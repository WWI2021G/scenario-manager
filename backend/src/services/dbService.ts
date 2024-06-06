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

  async getCurTime(): Promise<Date> {
    try {
      const result = await db.one<{ now: Date }>("SELECT NOW()");
      return result.now;
    } catch (error) {
      console.error("Error executing query", error);
      throw new Error("Error querying the database");
    }
  }
}

export const dbService = new DBService();
