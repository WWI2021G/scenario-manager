import { InfluencingArea } from "../models/InfluencingArea";
import { InfluencingFactor } from "../models/InfluencingFactor";
import { ScenarioProject } from "../models/ScenarioProject";
import { ScenarioType } from "../models/ScenarioType";
import { User } from "../models/User";
import { Variable } from "../models/Variable";
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

  async getUserID(req: Request, res: Response) {
    const {
      userName,
      userPasswordHash,
    }: { userName: string; userPasswordHash: string } = req.body;
    const user = new User(userName, userPasswordHash);
    try {
      const scenarioUser_id = await dbService.selectUserID(user);
      res.status(200).json({ scenarioUser_id: scenarioUser_id });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async addUser(req: Request, res: Response) {
    const {
      userName,
      userPasswordHash,
    }: { userName: string; userPasswordHash: string } = req.body;
    const user = new User(userName, userPasswordHash);
    try {
      const scenarioUser_id = await dbService.insertUser(user);
      res.status(200).json({ scenarioUser_id: scenarioUser_id });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const user: User = await dbService.selectUser(parseFloat(req.params.id));
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getScenarioProjectID(req: Request, res: Response) {
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
      const scenarioProject_id =
        await dbService.selectScenarioProjectID(scenarioProject);
      res.status(200).json({ scenarioProject_id: scenarioProject_id });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async addScenarioProject(req: Request, res: Response) {
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
      const scenarioProject_id =
        await dbService.insertScenarioProject(scenarioProject);
      res.status(200).json({ scenarioProject_id: scenarioProject_id });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getScenarioProject(req: Request, res: Response) {
    try {
      const scenarioProject: ScenarioProject =
        await dbService.selectScenarioProject(parseFloat(req.params.id));
      res.status(200).json(scenarioProject);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getAllScenarioProjectsForUser(req: Request, res: Response) {
    try {
      const scenarioProjects: ScenarioProject[] =
        await dbService.selectAllScenarioProjectsForUser(
          parseFloat(req.params.id),
        );
      res.status(200).json(scenarioProjects);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async addInfluencingFactor(req: Request, res: Response) {
    const {
      scenarioProject_id,
      influencingFactor: { name, description, variable, influencingArea },
    }: {
      scenarioProject_id: number;
      influencingFactor: {
        name: string;
        description: string;
        variable: Variable;
        influencingArea: InfluencingArea;
      };
    } = req.body;
    const influencingFactor = new InfluencingFactor(
      name,
      description,
      variable,
      influencingArea,
    );
    try {
      const influencingFactor_id = await dbService.insertInfluencingFactor(
        scenarioProject_id,
        influencingFactor,
      );
      res.status(200).json({ influencingFactor_id: influencingFactor_id });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async linkInfluencingFactorAndScenarioProject(req: Request, res: Response) {
    const {
      influencingFactor_id,
      scenarioProject_id,
    }: { influencingFactor_id: number; scenarioProject_id: number } = req.body;
    try {
      const message =
        await dbService.connectInfluencingFactorAndScenarioProject(
          influencingFactor_id,
          scenarioProject_id,
        );
      res.status(200).send(message);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getInfluencingFactorID(req: Request, res: Response) {
    const {
      name,
      description,
      variable,
      influencingArea,
    }: {
      name: string;
      description: string;
      variable: Variable;
      influencingArea: InfluencingArea;
    } = req.body;
    const influencingFactor = new InfluencingFactor(
      name,
      description,
      variable,
      influencingArea,
    );
    try {
      const influencingFactor_id =
        await dbService.selectInfluencingFactorID(influencingFactor);
      res.status(200).json({ scenarioProject_id: influencingFactor_id });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getInfluencingFactor(req: Request, res: Response) {
    try {
      const influencingFactor: InfluencingFactor =
        await dbService.selectInfluencingFactor(parseFloat(req.params.id));
      res.status(200).json(influencingFactor);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getInfluencingFactorByName(req: Request, res: Response) {
    const name: string = req.body.name;
    try {
      const influencingFactor: InfluencingFactor =
        await dbService.selectInfluencingFactorByName(name);
      res.status(200).json(influencingFactor);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getInfluencingFactorsForScenarioProject(req: Request, res: Response) {
    try {
      const influencingFactors: InfluencingFactor[] =
        await dbService.selectInfluencingFactorsForScenarioProject(
          parseFloat(req.params.id),
        );
      res.status(200).json(influencingFactors);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getAllInfluencingFactors(_req: Request, res: Response) {
    try {
      const influencingFactors: InfluencingFactor[] =
        await dbService.selectAllInfluencingFactors();
      res.status(200).json(influencingFactors);
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
