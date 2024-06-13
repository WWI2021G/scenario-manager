import { ScenarioProject } from "../models/ScenarioProject";
import { ScenarioType } from "../models/ScenarioType";
import { User } from "../models/User";
import { dbService } from "../services/dbService";
import { Request, Response } from "express";

class DBController {
  async setupDB(_req: Request, res: Response) {
    try {
      const message = await dbService.setupDB();
      res.status(200).send(message);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getInsertUserID(req: Request, res: Response) {
    const {
      userName,
      userPasswordHash,
    }: { userName: string; userPasswordHash: string } = req.body;
    const user = new User(userName, userPasswordHash);
    try {
      const userID = await dbService.getInsertUserID(user);
      res.status(200).json({ userID: userID });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const user: User = await dbService.getUser(parseFloat(req.params.id));
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getInsertScenarioProject(req: Request, res: Response) {
    const {
      name,
      description,
      scenarioType,
      user: { userName, userPasswordHash },
    }: {
      name: string;
      description: string;
      scenarioType: ScenarioType;
      user: { userName: string; userPasswordHash: string };
    } = req.body;
    const user = new User(userName, userPasswordHash);
    const scenarioProject = new ScenarioProject(
      name,
      description,
      scenarioType,
      user,
    );
    try {
      const scenarioProjectID =
        await dbService.getInsertScenarioProject(scenarioProject);
      res.status(200).json({ scenarioProjectID: scenarioProjectID });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getScenarioProject(req: Request, res: Response) {
    try {
      const scenarioProject: ScenarioProject = await dbService.getScenarioProject(parseFloat(req.params.id));
      res.status(200).json(scenarioProject);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async redoDB(_req: Request, res: Response) {
    try {
      const message = await dbService.redoDB();
      res.status(200).send(message);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
}

export const dbController = new DBController();
