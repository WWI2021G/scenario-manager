import dotenv from "dotenv";
import pgPromise, { IDatabase, IMain } from "pg-promise";
import { ScenarioProject } from "../models/ScenarioProject";
import { User } from "../models/User";
import { ScenarioType } from "../models/ScenarioType";

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
        query: `
CREATE TABLE IF NOT EXISTS scenarioUser (
scenariouser_id SERIAL PRIMARY KEY,
userName VARCHAR(50) UNIQUE NOT NULL,
password VARCHAR(50) NOT NULL);`,
      },
      {
        table_name: "ScenarioProject",
        query: `
CREATE TABLE IF NOT EXISTS ScenarioProject (
scenarioproject_id SERIAL PRIMARY KEY,
name VARCHAR(50) UNIQUE NOT NULL,
description VARCHAR(200),
scenarioType VARCHAR(50) NOT NULL CHECK (scenarioType IN ('Umfeldszenario', 'LangfristigesUmfeldszenario', 'KurzfristigesUmfeldszenario', 'Systemszenario', 'RisikomeidendesSystemszenario', 'RisikosuchendesSystemszenario')),
scenariouser_id INT,
FOREIGN KEY (scenariouser_id) REFERENCES scenarioUser(scenariouser_id));`,
      },
      {
        table_name: "InfluencingFactor",
        query: `
CREATE TABLE IF NOT EXISTS InfluencingFactor (
influencingfactor_id SERIAL PRIMARY KEY,
name VARCHAR(50) UNIQUE NOT NULL,
description VARCHAR(200),
variable VARCHAR(50) CHECK (variable IN ('ControlVariable', 'EnvironmentVariable')),
influencingArea VARCHAR(50) CHECK (influencingArea IN ('Handel', 'Informationstechnologie', 'Ökonomie', 'Gesellschaft', 'Sonstige')));`,
      },
      {
        table_name: "KeyFactor",
        query: `
CREATE TABLE IF NOT EXISTS KeyFactor (
keyfactor_id INT PRIMARY KEY,
critical BOOLEAN,
scenarioproject_id INT,
FOREIGN KEY (keyfactor_id) REFERENCES InfluencingFactor(influencingfactor_id),
FOREIGN KEY (scenarioproject_id) REFERENCES ScenarioProject(scenarioproject_id));`,
      },
      {
        table_name: "properties",
        query: `
CREATE TABLE IF NOT EXISTS KeyFactor (
prop_id SERIAL PRIMARY KEY,
name VARCHAR(50) UNIQUE NOT NULL,
cur_state VARCHAR(200),
keyfactor_id INT,
FOREIGN KEY (keyfactor_id) REFERENCES KeyFactor(keyfactor_id));`,
      },
      {
        table_name: "FutureProjection",
        query: `
CREATE TABLE IF NOT EXISTS FutureProjection (
futureprojection_id SERIAL PRIMARY KEY,
probability VARCHAR(6) CHECK (probability IN ('low', 'medium', 'high')),
description VARCHAR(200),
timeFrame TIMESTAMP,
projectionType VARCHAR(6) CHECK (projectionType IN ('Trend', 'Extreme')),
keyfactor_id INT,
scenarioproject_id INT,
FOREIGN KEY (keyfactor_id) REFERENCES KeyFactor(keyfactor_id),
FOREIGN KEY (scenarioproject_id) REFERENCES ScenarioProject(scenarioproject_id));`,
      },
      {
        table_name: "ProjectionBundle",
        query: `
CREATE TABLE IF NOT EXISTS ProjectionBundle (
projectionbundle_id SERIAL PRIMARY KEY,
name VARCHAR(50) UNIQUE NOT NULL,
description VARCHAR(200));`,
      },
      {
        table_name: "RawScenario",
        query: `
CREATE TABLE IF NOT EXISTS RawScenario (
rs_id SERIAL PRIMARY KEY,
name VARCHAR(50) UNIQUE NOT NULL,
quality INT CHECK (quality > 0 AND quality < 8));`,
      },
      {
        table_name: "SP-IF",
        query: `
CREATE TABLE IF NOT EXISTS sp_if (
scenarioproject_id INT,
influencingfactor_id INT,
FOREIGN KEY (scenarioproject_id) REFERENCES ScenarioProject(scenarioproject_id),
FOREIGN KEY (influencingfactor_id) REFERENCES InfluencingFactor(influencingfactor_id));`,
      },
      {
        table_name: "KF-RS",
        query: `
CREATE TABLE IF NOT EXISTS kf_rs (
keyfactor_id INT,
rs_id INT,
FOREIGN KEY (keyfactor_id) REFERENCES KeyFactor(keyfactor_id),
FOREIGN KEY (rs_id) REFERENCES RawScenario(rs_id));`,
      },
      {
        table_name: "FP-PB",
        query: `
CREATE TABLE IF NOT EXISTS fp_pb (
futureprojection_id INT,
projectionbundle_id INT,
FOREIGN KEY (futureprojection_id) REFERENCES FutureProjection(futureprojection_id),
FOREIGN KEY (projectionbundle_id) REFERENCES ProjectionBundle(projectionbundle_id));`,
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
      throw new Error("Error setting up the database");
    }
  }

  async selectUserID(user: User): Promise<number> {
    try {
      const userID: number | null = await db.one<number>(
        "SELECT scenariouser_id FROM scenariouser WHERE username = $1;",
        user.getUserName(),
        (u) => u && u.scenariouser_id,
      );
      console.log("Request for exisiting user: " + user.getUserName());
      return userID;
    } catch (error) {
      console.error("Error selecting id from user: " + user.getUserName(), error);
      throw new Error("Error selecting id from user: " + user.getUserName());
    }
  }

  async insertUser(user: User): Promise<number> {
    try {
      const createdUserID: number =
        (await db.one<number>(
          "INSERT INTO scenariouser(username, password) VALUES($1, $2) RETURNING scenariouser_id;",
          [user.getUserName(), user.getPassword()],
          (u) => u.scenariouser_id,
        ))
      console.log("Created user in database with ID: " + createdUserID);
      return createdUserID;
    } catch (error) {
      console.error("Error inserting id from user: " + user.getUserName(), error);
      throw new Error("Error inserting id from user: " + user.getUserName());
    }
  }

  async selectUser(userID: number): Promise<User> {
    try {
      const result = await db.one<{ username: string; password: string }>(
        "SELECT username, password FROM scenariouser WHERE scenariouser_id = $1;",
        userID,
      );
      const user = new User(result.username, result.password);
      console.log("Request for userID: " + userID);
      return user;
    } catch (error) {
      console.error("Error getting user from id: " + userID, error);
      throw new Error("Error getting user from id: " + userID);
    }
  }

  async selectScenarioProjectID(scenarioProject: ScenarioProject): Promise<number> {
    try {
      const scenarioProjectID: number = await db.one<number>(
        "SELECT scenarioproject_id FROM scenarioproject WHERE name = $1;",
        scenarioProject.getName(),
        (sp) => sp && sp.scenarioproject_id,
      );
      console.log("Request for exisiting scenarioProject: " + scenarioProject.getName());
      return scenarioProjectID;
    } catch (error) {
      console.error("Error selecting scenarioproject_id for Scenario: " + scenarioProject.getName(), error);
      throw new Error("Error selecting scenarioproject_id for Scenario: " + scenarioProject.getName());
    }
  }

  async insertScenarioProject(
    scenarioProject: ScenarioProject,
  ): Promise<number> {
    try {
      console.log(scenarioProject.getUser());
      const userID = await this.selectUserID(scenarioProject.getUser());
      console.log(userID);
      const createdScenarioProjectID: number = (await db.one<number>(
        "INSERT INTO scenarioproject (name, description, scenariotype, scenariouser_id) VALUES ($1, $2, $3, $4) RETURNING scenarioproject_id;",
        [
          scenarioProject.getName(),
          scenarioProject.getDescription(),
          scenarioProject.getScenarioType(),
          userID,
        ],
        (sp) => sp.scenarioproject_id,
      ))
      console.log("Created scenarioProject in database with id: " + createdScenarioProjectID);
      return createdScenarioProjectID;
    } catch (error) {
      console.error("Error inserting ScenarioProject", error);
      throw new Error("Error inserting ScenarioProject");
    }
  }

  async selectScenarioProject(scenarioproject_id: number): Promise<ScenarioProject> {
    try {
      const result = await db.one<{ name: string; description: string; scenarioType: string; scenariouser_id: number }>(
        "SELECT name, description, scenarioType, scenariouser_id FROM scenarioproject WHERE scenarioproject_id = $1;",
        scenarioproject_id,
      );
      const user = await this.selectUser(result.scenariouser_id);
      const scenarioType: ScenarioType = (<any>ScenarioType)[result.scenarioType];
      const scenarioProject = new ScenarioProject(result.name, result.description, scenarioType, user);
      console.log(scenarioProject);
      console.log("Request for scenarioproject_id: " + scenarioproject_id);
      return scenarioProject;
    } catch (error) {
      console.error("Error selecting ScenarioProject from id: " + scenarioproject_id, error);
      throw new Error("Error selecting ScenarioProject from id: " + scenarioproject_id);
    }
  }

  async redoDB(): Promise<string> {
    try {
      await db.none(
        "DO $$ DECLARE r RECORD; BEGIN FOR r IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') LOOP EXECUTE 'DROP TABLE IF EXISTS ' || r.table_name || ' CASCADE;'; END LOOP; END $$;",
      );
      console.log("Successfully dropped all databases");
      await this.setupDB();
      const message = "Successfully recreated the database";
      console.log(message);
      return message;
    } catch (error) {
      console.error("Error droping all tables in the database", error);
      throw new Error("Error droping all tables in the database");
    }
  }
}

export const dbService = new DBService();
