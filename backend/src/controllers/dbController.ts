import { InfluencingArea } from "../models/InfluencingArea";
import { InfluencingFactor } from "../models/InfluencingFactor";
import { KeyFactor } from "../models/KeyFactor";
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

  async addKeyFactor(req: Request, res: Response) {
    const {
      scenarioProject_id,
      influencingFactor_id,
    }: { scenarioProject_id: number; influencingFactor_id: number } = req.body;
    try {
      const keyFactor_id = await dbService.insertKeyFactor(
        scenarioProject_id,
        influencingFactor_id,
      );
      res.status(200).json({ keyFactor_id: keyFactor_id });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async setCurState(req: Request, res: Response) {
    const { name, cur_state }: { name: string; cur_state: string } = req.body;
    try {
      const message = await dbService.updateCurState(
        new KeyFactor(name, cur_state),
      );
      res.status(200).send(message);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async setCritical(req: Request, res: Response) {
    const {
      name,
      critical,
      cur_state,
    }: { name: string; critical: boolean; cur_state: string } = req.body;
    try {
      const keyFactor = new KeyFactor(name, cur_state);
      keyFactor.updateCritical(critical);
      const message = await dbService.updateCritical(keyFactor);
      res.status(200).send(message);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getCritical(req: Request, res: Response) {
    const { name, cur_state }: { name: string; cur_state: string } = req.body;
    try {
      const critical = await dbService.selectCritical(
        new KeyFactor(name, cur_state),
      );
      res.status(200).json({ critical: critical });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getKeyFactorID(req: Request, res: Response) {
    const { name, cur_state }: { name: string; cur_state: string } = req.body;
    try {
      const keyFactor_id: number = await dbService.selectKeyFactorID(
        new KeyFactor(name, cur_state),
      );
      res.status(200).json({ keyFactor_id: keyFactor_id });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getKeyFactor(req: Request, res: Response) {
    try {
      const keyFactor: KeyFactor = await dbService.selectKeyFactor(
        parseFloat(req.params.id),
      );
      res.status(200).json(keyFactor);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getKeyFactorByName(req: Request, res: Response) {
    const { name }: { name: string } = req.body;
    try {
      const keyFactor: KeyFactor = await dbService.selectKeyFactorByName(name);
      res.status(200).json(keyFactor);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getKeyFactorsForScenarioProject(req: Request, res: Response) {
    try {
      const result = await dbService.selectKeyFactorsForScenarioProject(
        parseFloat(req.params.id),
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getPropertyOne(req: Request, res: Response) {
    try {
      const result = await dbService.selectPropertyOne(
        parseFloat(req.params.id),
      );
      res.status(200).json({ propertyOne: result });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async setPropertyOne(req: Request, res: Response) {
    try {
      const {
        keyfactor_id,
        prop_name,
      }: { keyfactor_id: number; prop_name: string } = req.body;
      const message = await dbService.insertPropertyOne(
        keyfactor_id,
        prop_name,
      );
      res.status(200).send(message);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getPropertyTwo(req: Request, res: Response) {
    try {
      const result = await dbService.selectPropertyTwo(
        parseFloat(req.params.id),
      );
      res.status(200).json({ propertyTwo: result });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async setPropertyTwo(req: Request, res: Response) {
    try {
      const {
        keyfactor_id,
        prop_name,
      }: { keyfactor_id: number; prop_name: string } = req.body;
      const message = await dbService.insertPropertyTwo(
        keyfactor_id,
        prop_name,
      );
      res.status(200).send(message);
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
