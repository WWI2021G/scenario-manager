import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import scenarioRoutes from "./routes/scenarioRoutes";
import cors from "cors";
import dbRoutes from "./routes/dbRoutes";
import { appendFileSync } from "fs";
import { dbService } from "./services/dbService";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use("/api/scenario", scenarioRoutes);
app.use("/db", dbRoutes);

if (!process.env.DBSETUP) {
  try {
    appendFileSync("./.env", "DBSETUP=true");
    dbService.setupDB();
    console.log("Database setup completed");
  } catch (error) {
    console.error("Error setting variable to setup database");
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
