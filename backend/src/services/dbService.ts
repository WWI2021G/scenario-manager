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
id SERIAL PRIMARY KEY,
userName VARCHAR(50) UNIQUE NOT NULL,
password VARCHAR(50) NOT NULL);`,
      },
      {
        table_name: "ScenarioProject",
        query: `
CREATE TABLE IF NOT EXISTS ScenarioProject (
id SERIAL PRIMARY KEY,
name VARCHAR(50) UNIQUE,
description VARCHAR(200),
userID INT,
FOREIGN KEY (userID) REFERENCES scenarioUser(id));`,
      },
      {
        table_name: "InfluencingFactor",
        query: `
CREATE TABLE IF NOT EXISTS InfluencingFactor (
id SERIAL PRIMARY KEY,
name VARCHAR(50) UNIQUE,
description VARCHAR(200),
variable VARCHAR(50) CHECK (variable IN ('ControlVariable', 'EnvironmentVariable')),
influencingArea VARCHAR(50) CHECK (influencingArea IN ('Handel', 'Informationstechnologie', 'Ökonomie', 'Gesellschaft', 'Sonstige')));`,
      },
      {
        table_name: "KeyFactor",
        query: `
CREATE TABLE IF NOT EXISTS KeyFactor (
id INT PRIMARY KEY,
critical BOOLEAN,
sp_id INT,
FOREIGN KEY (id) REFERENCES InfluencingFactor(id));`,
      },
      {
        table_name: "properties",
        query: `
CREATE TABLE IF NOT EXISTS KeyFactor (
id SERIAL PRIMARY KEY,
name VARCHAR(50) UNIQUE,
cur_state VARCHAR(200),
kf_id INT,
FOREIGN KEY (kf_id) REFERENCES KeyFactor(id));`,
      },
      {
        table_name: "FutureProjection",
        query: `
CREATE TABLE IF NOT EXISTS FutureProjection (
id SERIAL PRIMARY KEY,
probability VARCHAR(6) CHECK (probability IN ('low', 'medium', 'high')),
description VARCHAR(200),
timeFrame TIMESTAMP,
projectionType VARCHAR(6) CHECK (projectionType IN ('Trend', 'Extreme')),
kf_id INT,
sp_id INT,
FOREIGN KEY (kf_id) REFERENCES KeyFactor(id),
FOREIGN KEY (sp_id) REFERENCES ScenarioProject(id));`,
      },
      {
        table_name: "ProjectionBundle",
        query: `
CREATE TABLE IF NOT EXISTS ProjectionBundle (
id SERIAL PRIMARY KEY,
name VARCHAR(50),
description VARCHAR(200));`,
      },
      {
        table_name: "RawScenario",
        query: `
CREATE TABLE IF NOT EXISTS RawScenario (
id SERIAL PRIMARY KEY,
name VARCHAR(50),
quality INT CHECK (quality > 0 AND quality < 8));`,
      },
      {
        table_name: "SP-IF",
        query: `
CREATE TABLE IF NOT EXISTS sp_if (
sp_id INT,
if_id INT,
FOREIGN KEY (sp_id) REFERENCES ScenarioProject(id),
FOREIGN KEY (if_id) REFERENCES InfluencingFactor(id));`,
      },
      {
        table_name: "KF-RS",
        query: `
CREATE TABLE IF NOT EXISTS kf_rs (
kf_id INT,
rs_id INT,
FOREIGN KEY (kf_id) REFERENCES KeyFactor(id),
FOREIGN KEY (rs_id) REFERENCES InfluencingFactor(id));`,
      },
      {
        table_name: "FP-PB",
        query: `
CREATE TABLE IF NOT EXISTS fp_pb (
fp_id INT,
pb_id INT,
FOREIGN KEY (fp_id) REFERENCES FutureProjection(id),
FOREIGN KEY (pb_id) REFERENCES ProjectionBundle(id));`,
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

  async getInsertUserID(user: User): Promise<number> {
    try {
      const userID: number | null = await db.oneOrNone(
        "SELECT su_id FROM scenariouser WHERE username = $1",
        user.getUserName(),
        (u) => u && u.su_id,
      );
      if (userID) {
        console.log("Request for exisiting user: " + user.getUserName());
        return userID;
      }
      const createdUserID: number =
        (await db.one<number>(
          "INSERT INTO scenariouser(username, password) VALUES($1, $2) RETURNING su_id",
          [user.getUserName(), user.getPassword()],
          (u) => u.su_id,
        ))
      console.log("Created user in database with ID: " + createdUserID);
      return createdUserID;
    } catch (error) {
      console.error("Error getting id from user: " + user.getUserName(), error);
      throw new Error("Error getting id from user: " + user.getUserName());
    }
  }

  async getUser(userID: number): Promise<User> {
    try {
      const result = await db.one<{ username: string; password: string }>(
        "SELECT username, password FROM scenariouser WHERE su_id = $1",
        userID,
      );
      const user = new User(result.username, result.password);
      console.log("Request for userID: " + userID);
      return user;
    } catch (error) {
      console.error("Error getting user from id" + userID, error);
      throw new Error("Error getting user from id" + userID);
    }
  }

  async getInsertScenarioProject(
    scenarioProject: ScenarioProject,
  ): Promise<number> {
    const userID = await this.getInsertUserID(scenarioProject.getUser());
    try {
      const scenarioProjectID: number | null = await db.oneOrNone(
        "SELECT sp_id FROM scenarioproject WHERE name = $1",
        scenarioProject.getName(),
        (sp) => sp && sp.sp_id,
      );
      if (scenarioProjectID) {
        console.log("Request for exisiting scenarioProject: " + scenarioProject.getName());
        return scenarioProjectID;
      }
      const createdScenarioProjectID: number = (await db.one<number>(
        "INSERT INTO scenarioproject (name, description, scenariotype, su_id) VALUES ($1, $2, $3, $4) RETURNING sp_id;",
        [
          scenarioProject.getName(),
          scenarioProject.getDescription(),
          scenarioProject.getScenarioType(),
          userID,
        ],
        (sp) => sp.sp_id,
      ))
      console.log("Created scenarioProject in database with ID: " + createdScenarioProjectID);
      return createdScenarioProjectID;
    } catch (error) {
      console.error("Error adding ScenarioProject", error);
      throw new Error("Error adding ScenarioProject");
    }
  }

  async getScenarioProject(sp_id: number): Promise<ScenarioProject> {
    try {
      const result = await db.one<{ name: string; description: string; scenarioType: string; su_id: number }>(
        "SELECT name, description, scenarioType, su_id FROM scenarioproject WHERE sp_id = $1",
        sp_id,
      );
      const user = await this.getUser(result.su_id);
      const scenarioType: ScenarioType = (<any>ScenarioType)[result.scenarioType];
      const scenarioProject = new ScenarioProject(result.name, result.description, scenarioType, user);
      console.log(scenarioProject);
      console.log("Request for sp_id: " + sp_id);
      return scenarioProject;
    } catch (error) {
      console.error("Error getting user from id" + sp_id, error);
      throw new Error("Error getting user from id" + sp_id);
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
