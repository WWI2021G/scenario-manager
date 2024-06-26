import dotenv from "dotenv";
import pgPromise, { IDatabase, IMain } from "pg-promise";
import { ScenarioProject } from "../models/ScenarioProject";
import { User } from "../models/User";
import { ScenarioType } from "../models/ScenarioType";
import { InfluencingFactor } from "../models/InfluencingFactor";
import { KeyFactor } from "../models/KeyFactor";

dotenv.config();

const pgp: IMain = pgPromise({});
const db: IDatabase<any> = pgp({
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
                 PASSWORD VARCHAR(50) NOT NULL
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
                 description VARCHAR(200)
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
                 probability VARCHAR(6) CHECK (probability IN ('low', 'medium', 'high')),
                 description VARCHAR(200),
                 timeFrame TIMESTAMP,
                 projectionType VARCHAR(6) CHECK (projectionType IN ('Trend', 'Extreme')),
                 keyfactor_id INT,
                 scenarioproject_id INT,
                 FOREIGN KEY (keyfactor_id) REFERENCES KeyFactor(keyfactor_id),
                 FOREIGN KEY (scenarioproject_id) REFERENCES ScenarioProject(scenarioproject_id)
               );`,
      },
      {
        table_name: "ProjectionBundle",
        query: `CREATE TABLE IF NOT EXISTS ProjectionBundle (
                 projectionbundle_id SERIAL PRIMARY KEY,
                 name VARCHAR(50) UNIQUE NOT NULL,
                 description VARCHAR(200)
               );`,
      },
      {
        table_name: "RawScenario",
        query: `CREATE TABLE IF NOT EXISTS RawScenario (
                 rs_id SERIAL PRIMARY KEY,
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
        table_name: "KF-RS",
        query: `CREATE TABLE IF NOT EXISTS kf_rs (
                 keyfactor_id INT,
                 rs_id INT,
                 FOREIGN KEY (keyfactor_id) REFERENCES KeyFactor(keyfactor_id),
                 FOREIGN KEY (rs_id) REFERENCES RawScenario(rs_id)
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

  async selectAllScenarioProjectsForUser(
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
        console.log(scenarioProject);
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
        "INSERT INTO influencingfactor (name, description, variable, influencingArea) VALUES ($1, $2, $3, $4) RETURNING influencingfactor_id;",
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
      return (
        "Successfully connected influencingFactor_id: " +
        influencingFactor_id +
        " and scenarioProject_id: " +
        scenarioProject_id
      );
    } catch (error) {
      console.error(
        "Error connecting InfluencingFactor and ScenarioProject",
        error,
      );
      throw {
        message: "Error connecting InfluencingFactor and ScenarioProject",
        name: "ConnectionError",
      };
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
        variable: string;
        influencingarea: string;
      }>(
        `SELECT
          name,
          description,
          variable,
          influencingarea
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
          variable,
          influencingarea
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

  async selectInfluencingFactorsForScenarioProject(
    scenarioProject_id: number,
  ): Promise<InfluencingFactor[]> {
    try {
      var results: InfluencingFactor[] = [];
      const query_results = await db.any<{
        name: string;
        description: string;
        variable: string;
        influencingarea: string;
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
        console.log(influencingFactor);
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
          variable,
          influencingarea
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
          sp.scenarioproject_id = $1;`,
        scenarioProject_id,
      );
      query_results.forEach((factor) => {
        const keyFactor: KeyFactor = new KeyFactor(
          factor.name,
          factor.cur_state,
        );
        keyFactor.updateCritical(factor.critical);
        keyFactor.setProperties(factor.prop_one, factor.prop_two);
        console.log(keyFactor);
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
