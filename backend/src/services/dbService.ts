import dotenv from "dotenv";
import pgPromise, { IDatabase, IMain } from "pg-promise";
import { ScenarioProject } from "../models/ScenarioProject";
import { User } from "../models/User";
import { ScenarioType } from "../models/ScenarioType";
import { InfluencingFactor } from "../models/InfluencingFactor";
import { KeyFactor } from "../models/KeyFactor";
import { FutureProjection } from "../models/FutureProjection";
import { Probability } from "../models/Probability";
import { ProjectionType } from "../models/ProjectionType";
import { ProjectionBundle } from "../models/ProjectionBundle";
import { RawScenario } from "../models/RawScenario";

dotenv.config();

const pgp: IMain = pgPromise({});
export const db: IDatabase<any> = pgp({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

class DBService {
  name: String = "DBService";
  db: IDatabase<any> = db;

  async setupDB(): Promise<string> {
    const tables: { table_name: string; query: string }[] = [
      {
        table_name: "ScenarioUsers",
        query: `CREATE TABLE IF NOT EXISTS scenarioUser (
                 scenarioUser_id SERIAL PRIMARY KEY,
                 userName VARCHAR(50) UNIQUE NOT NULL,
                 PASSWORD VARCHAR(70) NOT NULL
               );`,
      },
      {
        table_name: "ScenarioProject",
        query: `CREATE TABLE IF NOT EXISTS ScenarioProject (
                 scenarioproject_id SERIAL PRIMARY KEY,
                 name VARCHAR(50) UNIQUE NOT NULL,
                 description VARCHAR(200),
                 scenarioType VARCHAR(50) NOT NULL CHECK (
                   scenarioType IN (
                     'Umfeldszenario',
                     'LangfristigesUmfeldszenario',
                     'KurzfristigesUmfeldszenario',
                     'Systemszenario',
                     'RisikomeidendesSystemszenario',
                     'RisikosuchendesSystemszenario'
                   )
                 ),
                 scenarioUser_id INT,
                 FOREIGN KEY (scenarioUser_id) REFERENCES scenarioUser(scenarioUser_id)
               );`,
      },
      {
        table_name: "InfluencingFactor",
        query: `CREATE TABLE IF NOT EXISTS InfluencingFactor (
                 influencingfactor_id SERIAL PRIMARY KEY,
                 name VARCHAR(50) UNIQUE NOT NULL,
                 description VARCHAR(200),
                 activesum INT,
                 passivesum INT
               );`,
      },
      {
        table_name: "KeyFactor",
        query: `CREATE TABLE IF NOT EXISTS KeyFactor (
                 keyfactor_id INT PRIMARY KEY,
                 critical BOOLEAN,
                 cur_state VARCHAR(200),
                 prop_one VARCHAR(50) UNIQUE,
                 prop_two VARCHAR(50) UNIQUE,
                 scenarioproject_id INT,
                 FOREIGN KEY (keyfactor_id) REFERENCES InfluencingFactor(influencingfactor_id),
                 FOREIGN KEY (scenarioproject_id) REFERENCES ScenarioProject(scenarioproject_id)
               );`,
      },
      {
        table_name: "FutureProjection",
        query: `CREATE TABLE IF NOT EXISTS FutureProjection (
                 futureprojection_id SERIAL PRIMARY KEY,
                 name VARCHAR(20) UNIQUE,
                 probability VARCHAR(6) CHECK (probability IN ('LOW', 'MEDIUM', 'HIGH')),
                 description VARCHAR(200),
                 timeFrame TIMESTAMP,
                 projectionType VARCHAR(7) CHECK (projectionType IN ('TREND', 'EXTREME')),
                 keyfactor_id INT,
                 FOREIGN KEY (keyfactor_id) REFERENCES KeyFactor(keyfactor_id)
               );`,
      },
      {
        table_name: "ProjectionBundle",
        query: `CREATE TABLE IF NOT EXISTS ProjectionBundle (
                 projectionbundle_id SERIAL PRIMARY KEY,
                 consistency INT,
                 numPartInconsistencies INT,
                 pValue NUMeric(6, 5),
                 scenarioproject_id INT,
                 FOREIGN KEY (scenarioproject_id) REFERENCES ScenarioProject(scenarioproject_id)
               );`,
      },
      {
        table_name: "RawScenario",
        query: `CREATE TABLE IF NOT EXISTS RawScenario (
                 rawscenario_id SERIAL PRIMARY KEY,
                 name VARCHAR(50) UNIQUE NOT NULL,
                 quality INT CHECK (
                   quality > 0
                   AND quality < 8
                 )
               );`,
      },
      {
        table_name: "SP-IF",
        query: `CREATE TABLE IF NOT EXISTS sp_if (
                 scenarioproject_id INT,
                 influencingfactor_id INT,
                 FOREIGN KEY (scenarioproject_id) REFERENCES ScenarioProject(scenarioproject_id),
                 FOREIGN KEY (influencingfactor_id) REFERENCES InfluencingFactor(influencingfactor_id)
               );`,
      },
      {
        table_name: "PB-RS",
        query: `CREATE TABLE IF NOT EXISTS pb_rs (
                 projectionbundle_id INT,
                 rawscenario_id INT,
                 FOREIGN KEY (projectionbundle_id) REFERENCES ProjectionBundle(projectionbundle_id),
                 FOREIGN KEY (rawscenario_id) REFERENCES RawScenario(rawscenario_id)
               );`,
      },
      {
        table_name: "FP-PB",
        query: `CREATE TABLE IF NOT EXISTS fp_pb (
                 futureprojection_id INT,
                 projectionbundle_id INT,
                 FOREIGN KEY (futureprojection_id) REFERENCES FutureProjection(futureprojection_id),
                 FOREIGN KEY (projectionbundle_id) REFERENCES ProjectionBundle(projectionbundle_id)
               );`,
      },
    ];
    try {
      for (const table of tables) {
        await this.db.any(table.query);
      }
      let message: string = "All databases are set up";
      console.log("Success:", message);
      return message;
    } catch (error) {
      console.error("Error setting up database", error);
      throw error;
    }
  }

  async insertUser(scenarioUser: User): Promise<number> {
    try {
      const createdUser_id: number = await db.one<number>(
        `INSERT INTO
          scenariouser(username, PASSWORD)
        VALUES
          ($1, $2) RETURNING scenariouser_id;`,
        [scenarioUser.getUserName(), scenarioUser.getPassword()],
        (u) => u.scenariouser_id,
      );
      console.log("Created user in database with ID: " + createdUser_id);
      return createdUser_id;
    } catch (error) {
      console.error(
        "Error inserting id from user: " + scenarioUser.getUserName(),
        error,
      );
      throw error;
    }
  }

  async selectUserID(scenarioUser: User): Promise<number> {
    try {
      const scenarioUser_id: number = await db.one<number>(
        `SELECT
          scenariouser_id
        FROM
          scenariouser
        WHERE
          username = $1;`,
        scenarioUser.getUserName(),
        (u) => u.scenariouser_id,
      );
      console.log("Request for existing user: " + scenarioUser.getUserName());
      return scenarioUser_id;
    } catch (error) {
      console.error(
        "Error selecting id from user: " + scenarioUser.getUserName(),
        error,
      );
      throw error;
    }
  }

  async selectUser(scenarioUser_id: number): Promise<User> {
    try {
      const result = await db.one<{ username: string; password: string }>(
        `SELECT
          username,
          PASSWORD
        FROM
          scenariouser
        WHERE
          scenariouser_id = $1;`,
        scenarioUser_id,
      );
      const user = new User(result.username, result.password);
      console.log("Request for scenarioUser_id: " + scenarioUser_id);
      return user;
    } catch (error) {
      console.error("Error getting user from ID: " + scenarioUser_id, error);
      throw error;
    }
  }

  async selectUserByName(scenarioUser_name: string): Promise<User> {
    try {
      const result = await db.one<{ username: string; password: string }>(
        `SELECT
          username,
          PASSWORD
        FROM
          scenariouser
        WHERE
          username = $1;`,
        scenarioUser_name,
      );
      const user = new User(result.username, result.password);
      console.log("Request for ScenarioUser: " + scenarioUser_name);
      return user;
    } catch (error) {
      console.error(
        "Error getting user from name: " + scenarioUser_name,
        error,
      );
      throw error;
    }
  }

  async insertScenarioProject(
    scenarioProject: ScenarioProject,
  ): Promise<number> {
    try {
      const scenarioUser_id = await this.selectUserID(
        scenarioProject.getUser(),
      );
      const createdScenarioProject_id: number = await db.one<number>(
        `INSERT INTO
          scenarioproject (name, description, scenariotype, scenarioUser_id)
        VALUES
          ($1, $2, $3, $4) RETURNING scenarioproject_id;`,
        [
          scenarioProject.getName(),
          scenarioProject.getDescription(),
          scenarioProject.getScenarioType(),
          scenarioUser_id,
        ],
        (sp) => sp.scenarioproject_id,
      );
      console.log(
        "Created scenarioProject in database with id: " +
        createdScenarioProject_id,
      );
      return createdScenarioProject_id;
    } catch (error) {
      console.error("Error inserting ScenarioProject", error);
      throw error;
    }
  }

  async selectScenarioProjectID(
    scenarioProject: ScenarioProject,
  ): Promise<number> {
    try {
      const scenarioProject_id: number = await db.one<number>(
        `SELECT
          scenarioproject_id
        FROM
          scenarioproject
        WHERE
          name = $1;`,
        scenarioProject.getName(),
        (sp) => sp.scenarioproject_id,
      );
      console.log(
        "Request for exisiting scenarioProject: " + scenarioProject.getName(),
      );
      return scenarioProject_id;
    } catch (error) {
      console.error(
        "Error selecting scenarioproject_id for Scenario: " +
        scenarioProject.getName(),
        error,
      );
      throw error;
    }
  }

  async selectScenarioProject(
    scenarioProject_id: number,
  ): Promise<ScenarioProject> {
    try {
      const result = await db.one<{
        name: string;
        description: string;
        scenariotype: string;
        scenariouser_id: number;
      }>(
        `SELECT
          name,
          description,
          scenariotype,
          scenariouser_id
        FROM
          scenarioproject
        WHERE
          scenarioproject_id = $1;`,
        scenarioProject_id,
      );
      const scenarioUser = await this.selectUser(result.scenariouser_id);
      const scenarioType: ScenarioType = result.scenariotype as ScenarioType;
      const scenarioProject = new ScenarioProject(
        result.name,
        result.description,
        scenarioType,
        scenarioUser,
      );
      console.log(scenarioProject);
      console.log(
        "Request for existing scenarioProject_id: " + scenarioProject_id,
      );
      return scenarioProject;
    } catch (error) {
      console.error(
        "Error selecting ScenarioProject from ID: " + scenarioProject_id,
        error,
      );
      throw error;
    }
  }

  async selectScenarioProjectsForUser(
    scenarioUser_id: number,
  ): Promise<ScenarioProject[]> {
    try {
      var results: ScenarioProject[] = [];
      const query_results = await db.any<{
        name: string;
        description: string;
        scenarioType: string;
      }>(
        `SELECT
          name,
          description,
          scenarioType
        FROM
          scenarioproject
        WHERE
          scenarioUser_id = $1;`,
        scenarioUser_id,
      );
      const user = await this.selectUser(scenarioUser_id);
      query_results.forEach((project) => {
        const scenarioType: ScenarioType = (<any>ScenarioType)[
          project.scenarioType
        ];
        const scenarioProject = new ScenarioProject(
          project.name,
          project.description,
          scenarioType,
          user,
        );
        results.push(scenarioProject);
      });
      console.log(
        "Request for all ScenarioProjects with scenarioUser_id: " +
        scenarioUser_id,
      );
      return results;
    } catch (error) {
      console.error(
        "Error selecting ScenarioProject for scenarioUser_id: " +
        scenarioUser_id,
        error,
      );
      throw error;
    }
  }

  async insertInfluencingFactor(
    scenarioProject_id: number,
    influencingFactor: InfluencingFactor,
  ): Promise<number> {
    try {
      const validate: number | null = await db.oneOrNone(
        `SELECT
          scenarioproject_id
        FROM
          scenarioproject
        WHERE
          scenarioproject_id = $1`,
        scenarioProject_id,
      );
      if (validate == null) {
        console.error(
          "ScenarioProject must exist before inserting InfluencingFactor",
        );
        throw new Error(
          "ScenarioProject must exist before inserting InfluencingFactor",
        );
      }
      const createdInfluencingFactor_id: number = await db.one<number>(
        `INSERT INTO
          influencingfactor (name, description)
        VALUES
          ($1, $2) RETURNING influencingfactor_id;`,
        [influencingFactor.getName(), influencingFactor.getDescription()],
        (influencingFactor) => influencingFactor.influencingfactor_id,
      );
      await this.connectInfluencingFactorAndScenarioProject(
        createdInfluencingFactor_id,
        scenarioProject_id,
      );
      console.log(
        "Created influencingFactor in database with id: " +
        createdInfluencingFactor_id,
      );
      return createdInfluencingFactor_id;
    } catch (error: any) {
      console.error("Error inserting InfluencingFactor", error);
      throw error;
    }
  }

  async updateInfluencingFactor(
    oldName: string,
    newName: string,
    description: string,
  ): Promise<void> {
    try {
      // Check if the new name already exists
      const existing = await db.oneOrNone<{ name: string }>(
        `SELECT
          name
        FROM
          influencingfactor
        WHERE
          name = $1
          AND name != $2;`,
        [newName, oldName],
      );

      if (existing) {
        throw new Error(
          "Influencing factor with name $ { newName } already exists.",
        );
      }

      // Update the influencing factor
      await db.none(
        `UPDATE
          influencingfactor
        SET
          name = $1,
          description = $2
        WHERE
          name = $3;`,
        [newName, description, oldName],
      );
    } catch (error) {
      console.error("Error updating influencing factor:", error);
      throw error;
    }
  }

  async connectInfluencingFactorAndScenarioProject(
    influencingFactor_id: number,
    scenarioProject_id: number,
  ): Promise<string> {
    try {
      await db.none(
        `INSERT INTO
          sp_if (scenarioProject_id, influencingfactor_id)
        VALUES
          ($1, $2);`,
        [scenarioProject_id, influencingFactor_id],
      );
      const message =
        "Successfully connected influencingFactor_id: " +
        influencingFactor_id +
        " and scenarioProject_id: " +
        scenarioProject_id;
      console.log(message);
      return message;
    } catch (error) {
      console.error(
        "Error connecting InfluencingFactor and ScenarioProject",
        error,
      );
      throw error;
    }
  }

  async selectInfluencingFactorID(
    influencingFactor: InfluencingFactor,
  ): Promise<number> {
    try {
      const influencingFactor_id: number = await db.one<number>(
        `SELECT
          influencingfactor_id
        FROM
          influencingfactor
        WHERE
          name = $1;`,
        influencingFactor.getName(),
        (influencingFactor) => influencingFactor.influencingfactor_id,
      );
      console.log(
        "Request for existing influencingFactor: " +
        influencingFactor.getName(),
      );
      return influencingFactor_id;
    } catch (error) {
      console.error(
        "Error selecting influencingFactor_id for InfluencingFactor: " +
        influencingFactor.getName(),
        error,
      );
      throw error;
    }
  }

  async selectInfluencingFactor(
    influencingFactor_id: number,
  ): Promise<InfluencingFactor> {
    try {
      const result = await db.one<{
        name: string;
        description: string;
        activesum: number;
        passivesum: number;
      }>(
        `SELECT
          name,
          description,
          activesum,
          passivesum
        FROM
          influencingfactor
        WHERE
          influencingfactor_id = $1;`,
        influencingFactor_id,
      );
      const influencingFactor: InfluencingFactor = new InfluencingFactor(
        result.name,
        result.description,
      );
      influencingFactor.setActiveSum(result.activesum);
      influencingFactor.setPassiveSum(result.passivesum);
      console.log(
        "Request for existing influencingFactor_id: " + influencingFactor_id,
      );
      return influencingFactor;
    } catch (error) {
      console.error(
        "Error selecting influencingFactor from ID: " + influencingFactor_id,
        error,
      );
      throw error;
    }
  }

  async selectInfluencingFactorByName(
    influencingFactor_name: string,
  ): Promise<InfluencingFactor> {
    try {
      const result = await db.one<{
        name: string;
        description: string;
        variable: string;
        influencingarea: string;
      }>(
        `SELECT
          name,
          description,
          activesum,
          passivesum
        FROM
          influencingfactor
        WHERE
          name = $1;`,
        influencingFactor_name,
      );
      const influencingFactor: InfluencingFactor = new InfluencingFactor(
        result.name,
        result.description,
      );
      console.log(
        "Request for existing influencingFactor by name: " +
        influencingFactor_name,
      );
      return influencingFactor;
    } catch (error) {
      console.error(
        "Error selecting influencingFactor for InfluencingFactor: " +
        influencingFactor_name,
        error,
      );
      throw error;
    }
  }

  async updateActiveSum(influencingFactor: InfluencingFactor): Promise<string> {
    try {
      await db.none(
        `UPDATE
          influencingfactor
        SET
          activeSum = $1
        WHERE
          name = $2;`,
        [influencingFactor.getActiveSum(), influencingFactor.getName()],
      );
      const message =
        "Successfully updated activeSum for InfluencingFactor: " +
        influencingFactor.getName();
      console.log(message);
      return message;
    } catch (error) {
      console.error(
        "Error updating activeSum for InfluencingFactor: " +
        influencingFactor.getName(),
      );
      throw error;
    }
  }

  async selectActiveSum(influencingFactor_id: number): Promise<number> {
    try {
      const activesum = await db.one<number>(
        `SELECT
          activesum
        FROM
          influencingfactor
        WHERE
          influencingfactor_id = $1;`,
        influencingFactor_id,
        (as) => as.activesum,
      );
      console.log(
        "Request for activeSum of InfluencingFactor: " + influencingFactor_id,
      );
      return activesum;
    } catch (error) {
      console.error(
        "Error selecting activeSum for InfluencingFactor: " +
        influencingFactor_id,
      );
      throw error;
    }
  }

  async updatePassiveSum(
    influencingFactor: InfluencingFactor,
  ): Promise<string> {
    try {
      await db.none(
        `UPDATE
          influencingfactor
        SET
          passiveSum = $1
        WHERE
          name = $2;`,
        [influencingFactor.getPassiveSum(), influencingFactor.getName()],
      );
      const message =
        "Successfully updated passiveSum for InfluencingFactor: " +
        influencingFactor.getName();
      console.log(message);
      return message;
    } catch (error) {
      console.error(
        "Error updating passiveSum for InfluencingFactor: " +
        influencingFactor.getName(),
      );
      throw error;
    }
  }

  async selectPassiveSum(influencingFactor_id: number): Promise<number> {
    try {
      const passiveSum = await db.one<number>(
        `SELECT
          passivesum
        FROM
          influencingfactor
        WHERE
          influencingfactor_id = $1;`,
        influencingFactor_id,
        (as) => as.passivesum,
      );
      console.log(
        "Request for passiveSum of InfluencingFactor: " + influencingFactor_id,
      );
      return passiveSum;
    } catch (error) {
      console.error(
        "Error selecting passiveSum for InfluencingFactor: " +
        influencingFactor_id,
      );
      throw error;
    }
  }

  async selectInfluencingFactorsForScenarioProject(
    scenarioProject_id: number,
  ): Promise<InfluencingFactor[]> {
    try {
      var results: InfluencingFactor[] = [];
      const query_results = await db.any<{
        name: string;
        description: string;
        activesum: number;
        passivesum: number;
      }>(
        `SELECT
          i.*
        FROM
          influencingfactor i
          JOIN sp_if isp ON i.influencingfactor_id = isp.influencingfactor_id
          JOIN scenarioProject sp ON sp.scenarioproject_id = isp.scenarioproject_id
        WHERE
          sp.scenarioproject_id = $1;`,
        scenarioProject_id,
      );
      query_results.forEach((factor) => {
        const influencingFactor: InfluencingFactor = new InfluencingFactor(
          factor.name,
          factor.description,
        );
        influencingFactor.setActiveSum(factor.activesum);
        influencingFactor.setPassiveSum(factor.passivesum);
        results.push(influencingFactor);
      });
      console.log(
        "Request for all InfluencingFactors with scenarioProject_id: " +
        scenarioProject_id,
      );
      return results;
    } catch (error) {
      console.error(
        "Error selecting all InfluencingFactors for scenarioProject_id: " +
        scenarioProject_id,
        error,
      );
      throw error;
    }
  }

  async selectAllInfluencingFactors(): Promise<InfluencingFactor[]> {
    try {
      var results: InfluencingFactor[] = [];
      const query_results = await db.any<{
        name: string;
        description: string;
        variable: string;
        influencingarea: string;
      }>(
        `SELECT
          name,
          description,
          activesum,
          passivesum
        FROM
          influencingfactor;`,
      );
      query_results.forEach((factor) => {
        const influencingFactor: InfluencingFactor = new InfluencingFactor(
          factor.name,
          factor.description,
        );
        console.log(influencingFactor);
        results.push(influencingFactor);
      });
      console.log("Request for all InfluencingFactors");
      return results;
    } catch (error) {
      console.error("Error selecting all InfluencingFactors");
      throw error;
    }
  }

  async insertKeyFactor(
    scenarioProject_id: number,
    influencingFactor_id: number,
  ): Promise<number> {
    try {
      const keyFactor_id = await db.one<number>(
        `INSERT INTO
          keyfactor(keyfactor_id, critical, scenarioproject_id)
        VALUES
          ($1, $2, $3) RETURNING keyfactor_id;`,
        [influencingFactor_id, false, scenarioProject_id],
        (kf) => kf.keyfactor_id,
      );
      console.log("Created KeyFactor in database with ID: " + keyFactor_id);
      return keyFactor_id;
    } catch (error) {
      console.error("Error inserting KeyFactor");
      throw error;
    }
  }

  async updateCurState(keyFactor: KeyFactor): Promise<string> {
    try {
      await db.none(
        `UPDATE
          keyfactor k
        SET
          cur_state = $1
        FROM
          influencingfactor i
        WHERE
          k.keyfactor_id = i.influencingfactor_id
          AND i.name = $2;`,
        [keyFactor.getCurState(), keyFactor.getName()],
      );
      const message =
        "Successfully updated cur_state for KeyFactor: " + keyFactor.getName();
      console.log(message);
      return message;
    } catch (error) {
      console.error(
        "Error inserting cur_state for KeyFactor: " + keyFactor.getName(),
      );
      throw error;
    }
  }

  async updateCritical(keyFactor: KeyFactor): Promise<string> {
    try {
      await db.none(
        `UPDATE
          keyfactor k
        SET
          critical = $1
        FROM
          influencingfactor i
        WHERE
          k.keyfactor_id = i.influencingfactor_id
          AND i.name = $2;`,
        [keyFactor.getCritical(), keyFactor.getName()],
      );
      const message =
        "Successfully updated critical for KeyFactor: " + keyFactor.getName();
      console.log(message);
      return message;
    } catch (error) {
      console.error(
        "Error updating critical for KeyFactor: " + keyFactor.getName(),
      );
      throw error;
    }
  }

  async selectCritical(keyFactor: KeyFactor): Promise<boolean> {
    try {
      const critical = await db.one<boolean>(
        `SELECT
          critical
        FROM
          influencingfactor
          JOIN keyfactor ON influencingfactor_id = keyfactor_id
        WHERE
          name = $1;`,
        keyFactor.getName(),
        (crit) => crit.critical,
      );
      console.log("Request for critical of KeyFactor: " + keyFactor.getName());
      return critical;
    } catch (error) {
      console.error("Error selecting critical for KeyFactor: " + keyFactor);
      throw error;
    }
  }

  async selectKeyFactorID(keyFactor: KeyFactor): Promise<number> {
    try {
      const keyFactor_id: number = await db.one<number>(
        `SELECT
          keyfactor_id
        FROM
          influencingfactor
          JOIN keyfactor ON influencingfactor_id = keyfactor_id
        WHERE
          name = $1;`,
        keyFactor.getName(),
        (kf) => kf.keyfactor_id,
      );
      console.log("Request for existing KeyFactor: " + keyFactor.getName());
      return keyFactor_id;
    } catch (error) {
      console.error("Error selecting keyFactor_id for KeyFactor: " + keyFactor);
      throw error;
    }
  }

  async selectKeyFactor(keyFactor_id: number): Promise<KeyFactor> {
    try {
      const result = await db.one<{
        name: string;
        critical: boolean;
        cur_state: string;
        prop_one: string;
        prop_two: string;
      }>(
        `SELECT
          i.name,
          k.critical,
          k.cur_state,
          prop_one,
          prop_two
        FROM
          influencingfactor i
          LEFT JOIN keyfactor k ON i.influencingfactor_id = k.keyfactor_id
        WHERE
          k.keyfactor_id = $1;`,
        keyFactor_id,
      );
      const keyFactor: KeyFactor = new KeyFactor(result.name, result.cur_state);
      keyFactor.updateCritical(result.critical);
      keyFactor.setProperties(result.prop_one, result.prop_two);
      console.log("Request for existing keyFactor_id: " + keyFactor_id);
      return keyFactor;
    } catch (error) {
      console.error(
        "Error selecting KeyFactor from ID: " + keyFactor_id,
        error,
      );
      throw error;
    }
  }

  async selectKeyFactorByName(keyFactor_name: string) {
    try {
      const result = await db.one<{
        name: string;
        critical: boolean;
        cur_state: string;
        prop_one: string;
        prop_two: string;
      }>(
        `SELECT
          i.name,
          k.critical,
          k.cur_state,
          k.prop_one,
          k.prop_two
        FROM
          influencingfactor i
          LEFT JOIN keyfactor k ON i.influencingfactor_id = k.keyfactor_id
        WHERE
          i.name = $1;`,
        keyFactor_name,
      );
      const keyFactor: KeyFactor = new KeyFactor(result.name, result.cur_state);
      keyFactor.updateCritical(result.critical);
      keyFactor.setProperties(result.prop_one, result.prop_two);
      console.log("Request for existing keyFactor_name: " + keyFactor_name);
      return keyFactor;
    } catch (error) {
      console.error(
        "Error selecting KeyFactor from name: " + keyFactor_name,
        error,
      );
      throw error;
    }
  }

  async selectKeyFactorsForScenarioProject(
    scenarioProject_id: number,
  ): Promise<KeyFactor[]> {
    try {
      var results: KeyFactor[] = [];
      const query_results = await db.any<{
        name: string;
        critical: boolean;
        cur_state: string;
        prop_one: string;
        prop_two: string;
      }>(
        `SELECT
          i.name,
          k.critical,
          k.cur_state,
          k.prop_one,
          k.prop_two
        FROM
          influencingfactor i
          JOIN sp_if spif ON i.influencingfactor_id = spif.influencingfactor_id
          JOIN scenarioProject sp ON sp.scenarioproject_id = spif.scenarioproject_id
          JOIN keyfactor k ON i.influencingfactor_id = k.keyfactor_id
        WHERE
          sp.scenarioproject_id = $1
        ORDER BY
          i.influencingfactor_id ASC;`,
        scenarioProject_id,
      );
      query_results.forEach((factor) => {
        const keyFactor: KeyFactor = new KeyFactor(
          factor.name,
          factor.cur_state,
        );
        keyFactor.updateCritical(factor.critical);
        keyFactor.setProperties(factor.prop_one, factor.prop_two);
        console.log(keyFactor.getName());
        results.push(keyFactor);
      });
      console.log(
        "Request for all KeyFactors with scenarioProject_id: " +
        scenarioProject_id,
      );
      return results;
    } catch (error) {
      console.error(
        "Error selecting all KeyFactors for scenarioProject_id: " +
        scenarioProject_id,
        error,
      );
      throw error;
    }
  }

  async selectPropertyOne(keyfactor_id: number): Promise<string> {
    try {
      const propertyOne = await db.one<string>(
        `SELECT
          prop_one
        FROM
          keyfactor
        WHERE
          keyfactor_id = $1;`,
        keyfactor_id,
        (prop) => prop.prop_one,
      );
      console.log("Request for PropertyOne of keyfactor_id: " + keyfactor_id);
      return propertyOne;
    } catch (error) {
      console.error(
        "Error selecting PropertyOne for keyfactor_id: " + keyfactor_id,
        error,
      );
      throw error;
    }
  }

  async insertPropertyOne(
    keyfactor_id: number,
    property: string,
  ): Promise<string> {
    try {
      await db.none(
        `UPDATE
          keyfactor
        SET
          prop_one = $1
        WHERE
          keyfactor_id = $2;`,
        [property, keyfactor_id],
      );
      const message = "Updated PropertyOne to keyfactor_id: " + keyfactor_id;
      console.log(message);
      return message;
    } catch (error) {
      console.error(
        "Error inserting PropertyOne for keyfactor_id: " + keyfactor_id,
        error,
      );
      throw error;
    }
  }

  async selectPropertyTwo(keyfactor_id: number): Promise<string> {
    try {
      const propertyTwo = await db.one<string>(
        `SELECT
          prop_two
        FROM
          keyfactor
        WHERE
          keyfactor_id = $1;`,
        keyfactor_id,
        (prop) => prop.prop_two,
      );
      console.log("Request for PropertyTwo of keyfactor_id: " + keyfactor_id);
      return propertyTwo;
    } catch (error) {
      console.error(
        "Error selecting PropertyTwo for keyfactor_id: " + keyfactor_id,
        error,
      );
      throw error;
    }
  }

  async insertPropertyTwo(
    keyfactor_id: number,
    property: string,
  ): Promise<string> {
    try {
      await db.none(
        `UPDATE
          keyfactor
        SET
          prop_two = $1
        WHERE
          keyfactor_id = $2;`,
        [property, keyfactor_id],
      );
      const message = "Updated PropertyTwo to keyfactor_id: " + keyfactor_id;
      console.log(message);
      return message;
    } catch (error) {
      console.error(
        "Error inserting PropertyTwo for keyfactor_id: " + keyfactor_id,
        error,
      );
      throw error;
    }
  }

  async insertFutureProjection(
    keyfactor_id: number,
    futureProjection: FutureProjection,
  ): Promise<number> {
    try {
      const futureProjection_id: number = await db.one<number>(
        `INSERT INTO
        futureprojection (
          name,
          probability,
          description,
          timeframe,
          projectiontype,
          keyfactor_id
        )
      VALUES
        ($1, $2, $3, $4, $5, $6) ON CONFLICT (name) DO
      UPDATE
      SET
        probability = EXCLUDED.probability,
        description = EXCLUDED.description,
        timeframe = EXCLUDED.timeframe,
        projectiontype = EXCLUDED.projectiontype,
        keyfactor_id = EXCLUDED.keyfactor_id RETURNING futureprojection_id;`,
        [
          futureProjection.getName(),
          futureProjection.getProbability(),
          futureProjection.getDescription(),
          futureProjection.getTimeFrame(),
          futureProjection.getType(),
          keyfactor_id,
        ],
        (fp) => fp.futureprojection_id,
      );
      console.log(
        "Created or updated FutureProjection in database with ID: " +
        futureProjection_id,
      );
      return futureProjection_id;
    } catch (error) {
      console.error(
        "Error inserting or updating FutureProjection: " +
        futureProjection.getName(),
        error,
      );
      throw error;
    }
  }

  async connectFutureProjectionAndProjectionBundle(
    futureProjection_id: number,
    projectionBundle_id: number,
  ): Promise<string> {
    try {
      await db.none(
        `INSERT INTO
          fp_pb (futureprojection_id, projectionbundle_id)
        VALUES
          ($1, $2);`,
        [futureProjection_id, projectionBundle_id],
      );
      const message =
        "Successfully connected futureProjection_id: " +
        futureProjection_id +
        " and projectionBundle_id: " +
        projectionBundle_id;
      console.log(message);
      return message;
    } catch (error) {
      console.error(
        "Error connecting FutureProjection and ProjectionBundle",
        error,
      );
      throw error;
    }
  }

  async selectFutureProjectionID(
    futureProjection: FutureProjection,
  ): Promise<number> {
    try {
      const futureProjection_id: number = await db.one<number>(
        `SELECT
          futureprojection_id
        FROM
          futureprojection
        WHERE
          name = $1;`,
        futureProjection.getName(),
        (fp) => fp.futureprojection_id,
      );
      console.log(
        "Request for existing FutureProjectionID: " +
        futureProjection.getName(),
      );
      return futureProjection_id;
    } catch (error) {
      console.error(
        "Error selecting ID for FutureProjection: " +
        futureProjection.getName(),
        error,
      );
      throw error;
    }
  }

  async selectFutureProjection(
    futureProjection_id: number,
  ): Promise<FutureProjection> {
    try {
      const result = await db.one<{
        name: string;
        probability: Probability;
        description: string;
        timeFrame: Date;
        projectionType: ProjectionType;
        keyfactor_id: number;
      }>(
        `SELECT
          name,
          probability,
          description,
          timeFrame,
          projectionType,
          keyfactor_id
        FROM
          futureprojection
        WHERE
          futureprojection_id = $1;`,
        futureProjection_id,
      );
      const keyFactor = await this.selectKeyFactor(result.keyfactor_id);
      const futureProjection = new FutureProjection(
        result.name,
        result.description,
        keyFactor,
        result.keyfactor_id,
        result.probability,
        result.timeFrame,
        result.projectionType,
      );
      console.log(
        "Request for existing FutureProjection: " + futureProjection_id,
      );
      return futureProjection;
    } catch (error) {
      console.error(
        "Error selecting FutureProjection: " + futureProjection_id,
        error,
      );
      throw error;
    }
  }

  async selectFutureProjectionByName(
    futureProjection_name: string,
  ): Promise<FutureProjection> {
    try {
      const result = await db.one<{
        name: string;
        probability: Probability;
        description: string;
        timeFrame: Date;
        projectionType: ProjectionType;
        keyfactor_id: number;
      }>(
        `SELECT
          name,
          probability,
          description,
          timeFrame,
          projectionType,
          keyfactor_id
        FROM
          futureprojection
        WHERE
          name = $1;`,
        futureProjection_name,
      );
      const keyFactor = await this.selectKeyFactor(result.keyfactor_id);
      const futureProjection = new FutureProjection(
        result.name,
        result.description,
        keyFactor,
        result.keyfactor_id,
        result.probability,
        result.timeFrame,
        result.projectionType,
      );
      console.log(
        "Request for existing FutureProjection: " + futureProjection_name,
      );
      return futureProjection;
    } catch (error) {
      console.error(
        "Error selecting FutureProjection by name: " + futureProjection_name,
        error,
      );
      throw error;
    }
  }

  async selectFutureProjectionsForKeyFactor(
    keyfactor_id: number,
  ): Promise<FutureProjection[]> {
    try {
      const results: FutureProjection[] = [];
      const query_results = await db.any<{
        name: string;
        probability: Probability;
        description: string;
        timeframe: Date;
        projectiontype: ProjectionType;
        keyfactor_id: number;
      }>(
        `SELECT
        name,
        probability,
        description,
        timeframe,
        projectiontype,
        keyfactor_id
      FROM
        futureprojection
      WHERE
        keyfactor_id = $1;`,
        keyfactor_id,
      );
      const keyFactor = await this.selectKeyFactor(keyfactor_id);
      query_results.forEach((fp) => {
        const futureProjection = new FutureProjection(
          fp.name,
          fp.description,
          keyFactor,
          fp.keyfactor_id,
          fp.probability,
          fp.timeframe, // Ensure this matches your class constructor
          fp.projectiontype, // Ensure this matches your class constructor
        );
        results.push(futureProjection);
      });
      console.log(
        "Request for all FutureProjections with keyfactor_id: " + keyfactor_id,
      );
      return results;
    } catch (error) {
      console.error(
        "Error selecting FutureProjections for KeyFactor: " + keyfactor_id,
        error,
      );
      throw error;
    }
  }

  async selectFutureProjectionsForScenarioProject(
    scenarioProject_id: number,
  ): Promise<FutureProjection[]> {
    try {
      var results: FutureProjection[] = [];
      const query_results = await db.any<{
        name: string;
        probability: Probability;
        description: string;
        timeFrame: Date;
        projectionType: ProjectionType;
        keyfactor_id: number;
      }>(
        `SELECT
          name,
          probability,
          description,
          timeFrame,
          projectionType,
          fp.keyfactor_id
        FROM
          futureprojection fp
          JOIN keyfactor k ON k.keyfactor_id = fp.keyfactor_id
        WHERE
          scenarioproject_id = $1;`,
        scenarioProject_id,
      );
      for (let i = 0; i < query_results.length; i++) {
        const keyFactor = await this.selectKeyFactor(
          query_results[i].keyfactor_id,
        );
        const futureProjection = new FutureProjection(
          query_results[i].name,
          query_results[i].description,
          keyFactor,
          query_results[i].keyfactor_id,
          query_results[i].probability,
          query_results[i].timeFrame,
          query_results[i].projectionType,
        );
        results.push(futureProjection);
      }
      console.log(
        "Request for all FutureProjections with scenarioProject_id: " +
        scenarioProject_id,
      );
      return results;
    } catch (error) {
      console.error(
        "Error selecting FutureProjections for ScenarioProject: " +
        scenarioProject_id,
        error,
      );
      throw error;
    }
  }

  async selectFutureProjectionsForProjectionBundle(
    projectionBundle_id: number,
  ): Promise<FutureProjection[]> {
    try {
      var results: FutureProjection[] = [];
      const query_results = await db.any<{
        name: string;
        probability: Probability;
        description: string;
        timeFrame: Date;
        projectionType: ProjectionType;
        keyfactor_id: number;
      }>(
        `SELECT
          name,
          probability,
          description,
          timeFrame,
          projectionType,
          fp.keyfactor_id
        FROM
          futureprojection fp
          JOIN fp_pb fp_pb ON fp.futureprojection_id = fp_pb.futureprojection_id
        WHERE
          projectionbundle_id = $1;`,
        projectionBundle_id,
      );
      for (let i = 0; i < query_results.length; i++) {
        const keyFactor = await this.selectKeyFactor(
          query_results[i].keyfactor_id,
        );
        const futureProjection = new FutureProjection(
          query_results[i].name,
          query_results[i].description,
          keyFactor,
          query_results[i].keyfactor_id,
          query_results[i].probability,
          query_results[i].timeFrame,
          query_results[i].projectionType,
        );
        results.push(futureProjection);
      }
      console.log(
        "Request for all FutureProjections with scenarioProject_id: " +
        projectionBundle_id,
      );
      return results;
    } catch (error) {
      console.error(
        "Error selecting FutureProjections for ScenarioProject: " +
        projectionBundle_id,
        error,
      );
      throw error;
    }
  }

  async insertProjectionBundle(
    scenarioProject_id: number,
    projectionBundle: ProjectionBundle,
  ): Promise<number> {
    try {
      const projectionBundle_id = await db.one<number>(
        `INSERT INTO
          projectionbundle(
            consistency,
            numpartinconsistencies,
            pvalue,
            scenarioproject_id
          )
        VALUES
          ($1, $2, $3, $4) RETURNING projectionbundle_id;`,
        [
          projectionBundle.getConsistency(),
          projectionBundle.getNumPartInconsistencies(),
          projectionBundle.getPValue(),
          scenarioProject_id,
        ],
        (bp) => bp.projectionbundle_id,
      );
      console.log(
        "Created ProjectionBundle in database with ID: " + projectionBundle_id,
      );
      return projectionBundle_id;
    } catch (error) {
      console.error("Error inserting ProjectionBundle");
      throw error;
    }
  }

  createMapFromMatrix(
    matrix: any,
    futureProjections: FutureProjection[],
  ): Map<FutureProjection, Map<FutureProjection, number>> {
    const consistencyMatrix: Map<
      FutureProjection,
      Map<FutureProjection, number>
    > = new Map();
    for (const projRow in matrix) {
      if (Object.prototype.hasOwnProperty.call(matrix, projRow)) {
        const innerMap = new Map<FutureProjection, number>();
        const innerObj = matrix[projRow];
        for (const projCol in innerObj) {
          if (Object.prototype.hasOwnProperty.call(innerObj, projCol)) {
            const innerFutureProjection = futureProjections.find(
              (fp) => fp.getName() === projCol,
            );
            if (innerFutureProjection) {
              innerMap.set(innerFutureProjection, innerObj[projCol]);
            }
          }
        }
        const outerFutureProjection = futureProjections.find(
          (fp) => fp.getName() === projRow,
        );
        if (outerFutureProjection) {
          consistencyMatrix.set(outerFutureProjection, innerMap);
        }
      }
    }
    return consistencyMatrix;
  }

  findDoubleCombinations = (
    projections: FutureProjection[],
  ): [FutureProjection, FutureProjection][] => {
    const combinations: [FutureProjection, FutureProjection][] = [];
    for (let i = 0; i < projections.length; i++) {
      for (let j = 0; j < projections.length; j++) {
        if (
          projections[i].getKeyFactor().getName() !==
          projections[j].getKeyFactor().getName()
        ) {
          combinations.push([projections[i], projections[j]]);
        }
      }
    }
    return combinations;
  };

  completeInnerMaps = (
    matrix: Map<FutureProjection, Map<FutureProjection, number>>,
    key1: FutureProjection,
    key2: FutureProjection,
  ): Map<FutureProjection, Map<FutureProjection, number>> => {
    const newMatrix = matrix;
    matrix.forEach((value, key) => {
      value.forEach((v, k) => {
        if (key === key1 && k == key2 && v !== 0) {
          const innerMap = matrix.get(key2);
          if (innerMap) {
            innerMap.set(key1, v);
            newMatrix.set(key2, innerMap);
          }
        }
      });
    });
    return newMatrix;
  };

  sortByKeyFactor = (
    futureProjections: FutureProjection[],
  ): Map<string, FutureProjection[]> => {
    const keyFactorMap: Map<string, FutureProjection[]> = new Map();
    futureProjections.forEach((futureProjection) => {
      if (!keyFactorMap.has(futureProjection.getKeyFactor().getName())) {
        keyFactorMap.set(futureProjection.getKeyFactor().getName(), []);
      }
      const array: FutureProjection[] = keyFactorMap.get(
        futureProjection.getKeyFactor().getName(),
      )!;
      if (!array.includes(futureProjection)) {
        array.push(futureProjection);
      }
    });
    return keyFactorMap;
  };

  findPossibleCombinations = (
    keyFactorMap: Map<string, FutureProjection[]>,
  ): FutureProjection[][] => {
    const factorArrays = Array.from(keyFactorMap.values());
    const generateCombinations = (
      arrays: FutureProjection[][],
      index: number = 0,
      current: FutureProjection[] = [],
    ): FutureProjection[][] => {
      if (index === arrays.length) {
        return [current];
      }
      const results: FutureProjection[][] = [];
      const currentArray = arrays[index];
      for (const item of currentArray) {
        const newCurrent = [...current, item];
        results.push(...generateCombinations(arrays, index + 1, newCurrent));
      }
      return results;
    };
    return generateCombinations(factorArrays);
  };

  calculateProjectionBundleValues = (
    combination: FutureProjection[],
    matrix: Map<FutureProjection, Map<FutureProjection, number>>,
  ): {
    consistency: number;
    numPartInconsistencies: number;
    probability: number;
  } => {
    let consistency: number = 0;
    let numPartInconsistencies: number = 0;
    let probability: number = 1;
    for (let i = 0; i < combination.length; i++) {
      const probabilityValues = new Map<Probability, number>([
        [Probability.LOW, 0.2],
        [Probability.MEDIUM, 0.5],
        [Probability.HIGH, 0.8],
      ]);
      const probabilityValue = probabilityValues.get(
        combination[i].getProbability(),
      );
      if (probabilityValue) {
        probability = probability * probabilityValue;
      }
      const innerMatrix = matrix.get(combination[i]);
      if (innerMatrix) {
        for (let j = i + 1; j < combination.length; j++) {
          const value = innerMatrix.get(combination[j]);
          if (value) {
            if (value === 1) {
              return {
                consistency: 0,
                numPartInconsistencies: 0,
                probability: 0,
              };
            } else if (value === 2) {
              numPartInconsistencies++;
            }
            consistency += value;
          }
        }
      }
    }
    return { consistency, numPartInconsistencies, probability };
  };

  calculatePValue = (
    sumOfProbabilities: number,
    projectionBundle: ProjectionBundle,
  ): number => {
    return projectionBundle.getProbability() / sumOfProbabilities;
  };

  async connectProjectionBundleAndRawScenario(
    projectionBundle_id: number,
    rawScenario_id: number,
  ): Promise<string> {
    try {
      await db.none(
        `INSERT INTO
          pb_rs (projectionbundle_id, rawscenario_id)
        VALUES
          ($1, $2);`,
        [projectionBundle_id, rawScenario_id],
      );
      const message =
        "Successfully connected projectionBundle_id: " +
        projectionBundle_id +
        " and rawScenario_id: " +
        rawScenario_id;
      console.log(message);
      return message;
    } catch (error) {
      console.error("Error connecting ProjectionBundle and RawScenario", error);
      throw error;
    }
  }

  async selectProjectionBundle(
    projectionBundle_id: number,
  ): Promise<ProjectionBundle> {
    try {
      const result_pb = await db.one<{
        consistency: number;
        numpartinconsistencies: number;
        pvalue: number;
      }>(
        `SELECT
          consistency,
          numpartinconsistencies,
          pvalue
        FROM
          projectionbundle
        WHERE
          projectionbundle_id = $1;`,
        projectionBundle_id,
      );
      const projectionBundle = new ProjectionBundle(
        result_pb.consistency,
        result_pb.numpartinconsistencies,
        result_pb.pvalue,
      );
      const futureProjections =
        await this.selectFutureProjectionsForProjectionBundle(
          projectionBundle_id,
        );
      futureProjections.forEach((fp) => {
        projectionBundle.addProjection(fp);
      });
      console.log(
        "Request for existing projectionBundle_id: " + projectionBundle_id,
      );
      return projectionBundle;
    } catch (error) {
      console.error("Error selecting ProjectionBundle: " + projectionBundle_id);
      throw error;
    }
  }

  async selectConsistency(projectionBundle_id: number): Promise<number> {
    try {
      const consistency = await db.one<number>(
        `SELECT
          consistency
        FROM
          projectionbundle
        WHERE
          projectionbundle_id = $1;`,
        projectionBundle_id,
        (pb) => pb.consistency,
      );
      console.log(
        "Request for consistency of projectionBundle_id: " +
        projectionBundle_id,
      );
      return consistency;
    } catch (error) {
      console.error(
        "Error selecting consistency for ProjectionBundle: " +
        projectionBundle_id,
      );
      throw error;
    }
  }

  async selectNumPartInconsistencies(
    projectionBundle_id: number,
  ): Promise<number> {
    try {
      const numPartInconsistencies = await db.one<number>(
        `SELECT
          numpartinconsistencies
        FROM
          projectionbundle
        WHERE
          projectionbundle_id = $1;`,
        projectionBundle_id,
        (pb) => pb.numpartinconsistencies,
      );
      console.log(
        "Request for numPartInconsistencies of projectionBundle_id: " +
        projectionBundle_id,
      );
      return numPartInconsistencies;
    } catch (error) {
      console.error(
        "Error selecting numPartInconsistencies for ProjectionBundle: " +
        projectionBundle_id,
      );
      throw error;
    }
  }

  async selectPValue(projectionBundle_id: number): Promise<number> {
    try {
      const pValue = await db.one<number>(
        `SELECT
          pvalue
        FROM
          projectionbundle
        WHERE
          projectionbundle_id = $1;`,
        projectionBundle_id,
        (pb) => pb.pvalue,
      );
      console.log(
        "Request for pValue of projectionBundle_id: " + projectionBundle_id,
      );
      return pValue;
    } catch (error) {
      console.error(
        "Error selecting pValue for ProjectionBundle: " + projectionBundle_id,
      );
      throw error;
    }
  }

  async selectProjectionBundlesForRawScenario(
    rawScenario_id: number,
  ): Promise<ProjectionBundle[]> {
    try {
      var results: ProjectionBundle[] = [];
      const query_results = await db.any<{
        projectionbundle_id: number;
        consistency: number;
        numpartinconsistencies: number;
        pvalue: number;
      }>(
        `SELECT
          pbrs.projectionbundle_id,
          consistency,
          numpartinconsistencies,
          pvalue
        FROM
          projectionbundle pb
          JOIN pb_rs pbrs ON pb.projectionbundle_id = pbrs.projectionbundle_id
        WHERE
          rawscenario_id = $1;`,
        rawScenario_id,
      );
      console.log(query_results);
      for (let i = 0; i < query_results.length; i++) {
        const projectionBundle: ProjectionBundle = new ProjectionBundle(
          query_results[i].consistency,
          query_results[i].numpartinconsistencies,
          query_results[i].pvalue,
          query_results[i].projectionbundle_id,
        );
        const futureProjections =
          await this.selectFutureProjectionsForProjectionBundle(
            query_results[i].projectionbundle_id,
          );
        futureProjections.forEach((fp) => {
          projectionBundle.addProjection(fp);
        });
        results.push(projectionBundle);
      }
      console.log(
        "Request for all ProjectionBundles with rawScenario_id: " +
        rawScenario_id,
      );
      return results;
    } catch (error) {
      console.error(
        "Error selecting all ProjectionBundles for rawScenario_id: " +
        rawScenario_id,
        error,
      );
      throw error;
    }
  }

  
async selectProjectionBundlesForScenarioProject(
  scenarioProject_id: number,
): Promise<ProjectionBundle[]> {
  try {
    var results: ProjectionBundle[] = [];
    const query_results = await db.any<{
      projectionbundle_id: number;
      consistency: number;
      numpartinconsistencies: number;
      pvalue: number;
    }>(
      `SELECT
        projectionbundle_id,
        consistency,
        numpartinconsistencies,
        pvalue
      FROM
        projectionbundle
      WHERE
        scenarioproject_id = $1;`,
      scenarioProject_id,
    );
console.log(query_results);
    for (let i = 0; i < query_results.length; i++) {
      const { projectionbundle_id, consistency, numpartinconsistencies, pvalue } = query_results[i];
      console.log(query_results[i].pvalue);
      
      const projectionBundle: ProjectionBundle = new ProjectionBundle(
        consistency,
        numpartinconsistencies,
        pvalue,
        projectionbundle_id,
      );

      console.log(projectionBundle.getPValue
                 ());
      console.log(query_results[i].projectionbundle_id);
      const futureProjections = await this.selectFutureProjectionsForProjectionBundle(projectionbundle_id);
      futureProjections.forEach((fp) => {
        projectionBundle.addProjection(fp);
      });
      results.push(projectionBundle);
    }
    console.log("Request for all ProjectionBundles with scenarioProject_id: " + scenarioProject_id);
    return results;
  } catch (error) {
    console.error("Error selecting all ProjectionBundles for scenarioProject_id: " + scenarioProject_id, error);
    throw error;
  }
}

 async createRawScenarios(clusters: ProjectionBundle[][], scenarioProject_id: number): Promise<void> {
  for (let i = 0; i < clusters.length; i++) {
    const cluster = clusters[i];
    const rawScenarioName = `RawScenario_${i + 1}_${scenarioProject_id}
    `;

    try {
      // Check if the raw scenario already exists
      const existingScenario = await db.oneOrNone(
        `SELECT rawscenario_id FROM rawscenario WHERE name = $1`,
        [rawScenarioName]
      );

      if (existingScenario) {
        console.log(`Raw scenario ${rawScenarioName} already exists.`);
        continue;
      }

      // Insert new raw scenario if it does not exist
      const rawScenario = await db.one(
        `INSERT INTO rawscenario (name, quality) VALUES ($1, $2) RETURNING rawscenario_id`,
        [rawScenarioName, 1]
      );

      // Link the projection bundles to the new raw scenario
      for (const bundle of cluster) {
        await db.none(
          `INSERT INTO pb_rs (projectionbundle_id, rawscenario_id) VALUES ($1, $2)`,
          [bundle.getID(), rawScenario.rawscenario_id]
        );
      }

      console.log(`Raw scenario ${rawScenarioName} created and linked to projection bundles.`);
    } catch (error) {
      console.error(`Error creating or linking raw scenario ${rawScenarioName}:`, error);
    }
  }
}

async insertRawScenario(rawScenario: RawScenario): Promise<number> {
    try {
      const rawScenario_id = db.one<number>(
        `INSERT INTO
          rawscenario (name, quality)
        VALUES
          ($1, $2) RETURNING rawscenario_id`,
        [rawScenario.getName(), rawScenario.getQuality()],
        (rs) => rs.rawscenario_id,
      );
      console.log("Created RawScenario in database with ID: " + rawScenario_id);
      return rawScenario_id;
    } catch (error) {
      console.error(
        "Error inserting RawScenario: " + rawScenario.getName(),
        error,
      );
      throw error;
    }
  }

  async selectRawScenarioID(rawScenario: RawScenario): Promise<number> {
    try {
      const rawScenario_id: number = await db.one<number>(
        `SELECT
          rawscenario_id
        FROM
          rawscenario
        WHERE
          name = $1;`,
        rawScenario.getName(),
        (rs) => rs.rawscenario_id,
      );
      console.log("Request for existing rawScenario: " + rawScenario.getName());
      return rawScenario_id;
    } catch (error) {
      console.error(
        "Error selecting id from rawScenario: " + rawScenario.getName(),
        error,
      );
      throw error;
    }
  }

  async selectRawScenario(rawScenario_id: number): Promise<RawScenario> {
    try {
      const result = await db.one<{ name: string; quality: number }>(
        `SELECT
          name,
          quality
        FROM
          rawscenario
        WHERE
          rawscenario_id = $1;`,
        rawScenario_id,
      );
      const rawScenario = new RawScenario(result.name, result.quality);
      const projectionBundles =
        await this.selectProjectionBundlesForRawScenario(rawScenario_id);
      projectionBundles.forEach((projectionBundle) => {
        rawScenario.addProjectionBundle(projectionBundle);
      });
      console.log("Request for rawScenario_id: " + rawScenario_id);
      return rawScenario;
    } catch (error) {
      console.error(
        "Error getting rawScenario from ID: " + rawScenario_id,
        error,
      );
      throw error;
    }
  }

  async selectRawScenarioByName(
    rawScenario_name: string,
  ): Promise<RawScenario> {
    try {
      const result = await db.one<{
        rawscenario_id: number;
        name: string;
        quality: number;
      }>(
        `SELECT
          rawscenario_id,
          name,
          quality
        FROM
          scenariouser
        WHERE
          name = $1;`,
        rawScenario_name,
      );
      const rawScenario = new RawScenario(result.name, result.quality);
      const projectionBundles =
        await this.selectProjectionBundlesForRawScenario(result.rawscenario_id);
      projectionBundles.forEach((projectionBundle) => {
        rawScenario.addProjectionBundle(projectionBundle);
      });
      console.log("Request for rawScenario_name: " + rawScenario_name);
      return rawScenario;
    } catch (error) {
      console.error(
        "Error getting rawScenario from name: " + rawScenario_name,
        error,
      );
      throw error;
    }
  }

  async selectRawScenariosForScenarioProject(
    scenarioProject_id: number,
  ): Promise<RawScenario[]> {
    try {
      var results: RawScenario[] = [];
      const query_results = await db.any<{
        rawscenario_id: number;
        name: string;
        quality: number;
      }>(
        `SELECT
          rs.rawscenario_id,
          name,
          quality
        FROM
          rawscenario rs
          JOIN pb_rs pbrs ON pbrs.rawscenario_id = rs.rawscenario_id
          JOIN projectionbundle pb ON pb.projectionbundle_id = pbrs.projectionbundle_id
        WHERE
          scenarioproject_id = $1
          GROUP BY rs.rawscenario_id;`,
        scenarioProject_id,
      );
      console.log('query' ,query_results);
      for (let i = 0; i < query_results.length; i++) {
        const rawScenario: RawScenario = new RawScenario(
          query_results[i].name,
          query_results[i].quality,
        );
        const projectionBundles =
          await this.selectProjectionBundlesForRawScenario(
            query_results[i].rawscenario_id,
          );
        projectionBundles.forEach((projectionBundle) => {
          rawScenario.addProjectionBundle(projectionBundle);
        });
        console.log(rawScenario.getName());
        results.push(rawScenario);
      }
      console.log(
        "Request for all RawScenarios with scenarioProject_id: " +
        scenarioProject_id,
      );
      return results;
    } catch (error) {
      console.error(
        "Error selecting all RawScenarios for scenarioProject_id: " +
        scenarioProject_id,
        error,
      );
      throw error;
    }
  }

  async redoDB(): Promise<string> {
    try {
      await db.none(
        `DO
        $$
        DECLARE
        r RECORD;

        BEGIN
        FOR r IN (
          SELECT
            table_name
          FROM
            information_schema.tables
          WHERE
            table_schema = 'public'
            AND table_type = 'BASE TABLE'
        ) LOOP EXECUTE 'DROP TABLE IF EXISTS ' || r.table_name || ' CASCADE;';

        END LOOP;

        END
        $$
        ;`,
      );
      console.log("Successfully dropped all databases");
      await this.setupDB();
      const message = "Successfully recreated the database";
      console.log(message);
      return message;
    } catch (error) {
      console.error("Error droping all tables in the database", error);
      throw error;
    }
  }
}

export const dbService = new DBService();
