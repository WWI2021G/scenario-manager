import dotenv from "dotenv";
import pgPromise, { IDatabase, IMain } from "pg-promise";

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

    try {
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
