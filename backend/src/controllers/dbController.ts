import { FutureProjection } from "../models/FutureProjection";
import { InfluencingFactor } from "../models/InfluencingFactor";
import { KeyFactor } from "../models/KeyFactor";
import { Probability } from "../models/Probability";
import { ProjectionBundle } from "../models/ProjectionBundle";
import { ProjectionType } from "../models/ProjectionType";
import { RawScenario } from "../models/RawScenario";
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

  async getUserByName(req: Request, res: Response) {
    const { name }: { name: string } = req.body;
    try {
      const user: User = await dbService.selectUserByName(name);
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
      project: { name, description, scenarioType },
      user_id,
    }: {
      project: {
        name: string;
        description: string;
        scenarioType: ScenarioType;
      };
      user_id: number;
    } = req.body;
    const user = await dbService.selectUser(user_id);
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
        await dbService.selectScenarioProjectsForUser(
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
      influencingFactor: { name, description },
    }: {
      scenarioProject_id: number;
      influencingFactor: {
        name: string;
        description: string;
      };
    } = req.body;
    const influencingFactor = new InfluencingFactor(name, description);
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

  async unlinkInfluencingFactor(req: Request, res: Response) {
    const {
      influencingFactor_name,
      scenarioProject_id,
    }: { influencingFactor_name: string; scenarioProject_id: number } =
      req.body;
    try {
      const influencingFactor_id = await dbService.selectInfluencingFactorID(
        new InfluencingFactor(influencingFactor_name, "Whatever"),
      );
      const message =
        await dbService.disconnectInfluencingFactorAndScenarioProject(
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
    }: {
      name: string;
      description: string;
    } = req.body;
    const influencingFactor = new InfluencingFactor(name, description);
    try {
      const influencingFactor_id =
        await dbService.selectInfluencingFactorID(influencingFactor);
      res.status(200).json({ influencingFactor_id: influencingFactor_id });
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

  async setActiveSum(req: Request, res: Response) {
    const {
      scenarioProject_id,
      name,
      description,
      activeSum,
      passiveSum,
    }: {
      scenarioProject_id: number;
      name: string;
      description: string;
      activeSum: number;
      passiveSum: number;
    } = req.body;
    const influencingFactor = new InfluencingFactor(name, description);
    influencingFactor.setActiveSum(activeSum);
    influencingFactor.setPassiveSum(passiveSum);
    try {
      const message = await dbService.updateActiveSum(
        scenarioProject_id,
        influencingFactor,
      );
      res.status(200).send(message);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async setPassiveSum(req: Request, res: Response) {
    const {
      scenarioProject_id,
      name,
      description,
      activeSum,
      passiveSum,
    }: {
      scenarioProject_id: number;
      name: string;
      description: string;
      activeSum: number;
      passiveSum: number;
    } = req.body;
    const influencingFactor = new InfluencingFactor(name, description);
    influencingFactor.setActiveSum(activeSum);
    influencingFactor.setPassiveSum(passiveSum);
    try {
      const message = await dbService.updatePassiveSum(
        scenarioProject_id,
        influencingFactor,
      );
      res.status(200).send(message);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async setInfluencingFactor(req: Request, res: Response) {
    const { oldName, newName, description } = req.body;
    try {
      await dbService.updateInfluencingFactor(oldName, newName, description);
      res
        .status(200)
        .json({ message: "Influencing factor updated successfully" });
    } catch (error: any) {
      if (error.message.includes("already exists")) {
        res.status(400).send(error.message);
      } else {
        res.status(500).send(error.message);
      }
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
        keyFactor_id,
        prop_one,
      }: { keyFactor_id: number; prop_one: string } = req.body;
      const message = await dbService.insertPropertyOne(keyFactor_id, prop_one);
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
        keyFactor_id,
        prop_two,
      }: { keyFactor_id: number; prop_two: string } = req.body;
      const message = await dbService.insertPropertyTwo(keyFactor_id, prop_two);
      res.status(200).send(message);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async addFutureProjection(req: Request, res: Response) {
    try {
      const {
        keyFactor_id,
        name,
        description,
        probability,
        timeFrame,
        projectionType,
      }: {
        keyFactor_id: number;
        name: string;
        probability: Probability;
        description: string;
        timeFrame: Date;
        projectionType: ProjectionType;
      } = req.body;
      const keyfactor = await dbService.selectKeyFactor(keyFactor_id);
      const futureProjection = new FutureProjection(
        name,
        description,
        keyfactor,
        keyFactor_id,
        probability,
        timeFrame,
        projectionType,
      );
      const futureProjection_id = await dbService.insertFutureProjection(
        keyFactor_id,
        futureProjection,
      );
      res.status(200).json({ futureProjection_id: futureProjection_id });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async linkFutureProjectionAndProjectionBundle(req: Request, res: Response) {
    const {
      futureProjection_id,
      projectionBundle_id,
    }: { futureProjection_id: number; projectionBundle_id: number } = req.body;
    try {
      const message =
        await dbService.connectFutureProjectionAndProjectionBundle(
          futureProjection_id,
          projectionBundle_id,
        );
      res.status(200).send(message);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getFutureProjectionID(req: Request, res: Response) {
    try {
      const {
        keyfactor_id,
        name,
        description,
        probability,
        timeframe,
        projectionType,
      }: {
        keyfactor_id: number;
        name: string;
        probability: Probability;
        description: string;
        timeframe: Date;
        projectionType: ProjectionType;
      } = req.body;
      const keyfactor = await dbService.selectKeyFactor(keyfactor_id);
      const futureProjection = new FutureProjection(
        name,
        description,
        keyfactor,
        keyfactor_id,
        probability,
        timeframe,
        projectionType,
      );
      const futureProjection_id =
        await dbService.selectFutureProjectionID(futureProjection);
      res.status(200).json({ futureProjection_id: futureProjection_id });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getFutureProjection(req: Request, res: Response) {
    try {
      const futureProjection = await dbService.selectFutureProjection(
        parseFloat(req.params.id),
      );
      res.status(200).json(futureProjection);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getFutureProjectionByName(req: Request, res: Response) {
    try {
      const { name }: { name: string } = req.body;
      const futureProjection =
        await dbService.selectFutureProjectionByName(name);
      res.status(200).json(futureProjection);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getFutureProjectionsForKeyFactor(req: Request, res: Response) {
    try {
      const futureProjections =
        await dbService.selectFutureProjectionsForKeyFactor(
          parseFloat(req.params.id),
        );
      res.status(200).json(futureProjections);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getFutureProjectionsForScenarioProject(req: Request, res: Response) {
    try {
      const futureProjections =
        await dbService.selectFutureProjectionsForScenarioProject(
          parseFloat(req.params.id),
        );
      res.status(200).json(futureProjections);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getFutureProjectionsForProjectionBundle(req: Request, res: Response) {
    try {
      const futureProjections =
        await dbService.selectFutureProjectionsForProjectionBundle(
          parseFloat(req.params.id),
        );
      res.status(200).json(futureProjections);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async addProjectionBundle(req: Request, res: Response) {
    try {
      const {
        futureProjection_id,
        consistency,
        numPartInconsistencies,
        pValue,
      }: {
        futureProjection_id: number;
        consistency: number;
        numPartInconsistencies: number;
        pValue: number;
      } = req.body;
      const projectionBundle = new ProjectionBundle(
        consistency,
        numPartInconsistencies,
        pValue,
      );
      const projectionBundle_id = await dbService.insertProjectionBundle(
        futureProjection_id,
        projectionBundle,
      );
      res.status(200).json({ scenarioProject_id: projectionBundle_id });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async calculateProjectionBundles(req: Request, res: Response) {
    const {
      matrix,
      scenarioProject_id,
    }: { matrix: any; scenarioProject_id: number } = req.body;
    const futureProjections =
      await dbService.selectFutureProjectionsForScenarioProject(
        scenarioProject_id,
      );
    let consistencyMatrix: Map<
      FutureProjection,
      Map<FutureProjection, number>
    > = dbService.createMapFromMatrix(matrix, futureProjections);
    const doubleCombinations =
      dbService.findDoubleCombinations(futureProjections);
    doubleCombinations.forEach((combo) => {
      consistencyMatrix = dbService.completeInnerMaps(
        consistencyMatrix,
        combo[0],
        combo[1],
      );
    });
    const keyFactorMap = dbService.sortByKeyFactor(futureProjections);
    const possibleCombinations =
      dbService.findPossibleCombinations(keyFactorMap);
    try {
      const projectionBundles: ProjectionBundle[] = [];
      let sumOfProbabilities: number = 0;
      possibleCombinations.forEach((combination) => {
        const { consistency, numPartInconsistencies, probability } =
          dbService.calculateProjectionBundleValues(
            combination,
            consistencyMatrix,
          );
        if (consistency !== 0) {
          sumOfProbabilities += probability;
          const projectionBundle: ProjectionBundle = new ProjectionBundle(
            consistency,
            numPartInconsistencies,
            probability,
          );
          projectionBundle.addProjections(combination);
          projectionBundles.push(projectionBundle);
        }
      });
      const reducedProjectionBundles = projectionBundles
        .slice(0, 100)
        .sort((a, b) => b.getConsistency() - a.getConsistency());
      const projectionBundle_ids: number[] = [];
      for (let i = 0; i < reducedProjectionBundles.length; i++) {
        const pValue = dbService.calculatePValue(
          sumOfProbabilities,
          reducedProjectionBundles[i],
        );
        reducedProjectionBundles[i].setPValue(pValue);
        const projectionBundle_id = await dbService.insertProjectionBundle(
          scenarioProject_id,
          reducedProjectionBundles[i],
        );
        const futureProjections = reducedProjectionBundles[i].getProjections();
        for (let j = 0; j < futureProjections.length; j++) {
          const futureProjection_id = await dbService.selectFutureProjectionID(
            futureProjections[j],
          );
          await dbService.connectFutureProjectionAndProjectionBundle(
            futureProjection_id,
            projectionBundle_id,
          );
        }
        projectionBundle_ids.push(projectionBundle_id);
      }
      res.status(200).send(projectionBundle_ids);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async linkProjectionBundleAndRawScenario(req: Request, res: Response) {
    const {
      projectionBundle_id,
      rawScenario_id,
    }: { projectionBundle_id: number; rawScenario_id: number } = req.body;
    try {
      const message = await dbService.connectProjectionBundleAndRawScenario(
        projectionBundle_id,
        rawScenario_id,
      );
      res.status(200).send(message);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getProjectionBundle(req: Request, res: Response) {
    try {
      const projectionBundle: ProjectionBundle =
        await dbService.selectProjectionBundle(parseFloat(req.params.id));
      res.status(200).json(projectionBundle);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getConsistency(req: Request, res: Response) {
    try {
      const consistency: number = await dbService.selectConsistency(
        parseFloat(req.params.id),
      );
      res.status(200).json({ consistency: consistency });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getNumPartInconsistencies(req: Request, res: Response) {
    try {
      const numPartInconsistencies: number =
        await dbService.selectNumPartInconsistencies(parseFloat(req.params.id));
      res.status(200).json({ numPartInconsistencies: numPartInconsistencies });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getPValue(req: Request, res: Response) {
    try {
      const pValue: number = await dbService.selectPValue(
        parseFloat(req.params.id),
      );
      res.status(200).json({ pValue: pValue });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getProjectionBundlesForRawScenario(req: Request, res: Response) {
    try {
      const projectionBundles: ProjectionBundle[] =
        await dbService.selectProjectionBundlesForRawScenario(
          parseFloat(req.params.id),
        );
      res.status(200).json(projectionBundles);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getProjectionBundlesForScenarioProject(req: Request, res: Response) {
    try {
      const projectionBundles: ProjectionBundle[] =
        await dbService.selectProjectionBundlesForScenarioProject(
          parseFloat(req.params.id),
        );
      res.status(200).json(projectionBundles);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async addRawScenario(req: Request, res: Response) {
    const { name, quality }: { name: string; quality: number } = req.body;
    const rawScenario: RawScenario = new RawScenario(name, quality);
    try {
      const rawScenario_id = await dbService.insertRawScenario(rawScenario);
      res.status(200).json({ rawScenario_id: rawScenario_id });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getRawScenarioID(req: Request, res: Response) {
    const { name, quality }: { name: string; quality: number } = req.body;
    const rawScenario: RawScenario = new RawScenario(name, quality);
    try {
      const rawScenario_id = await dbService.selectRawScenarioID(rawScenario);
      res.status(200).json({ rawScenario_id: rawScenario_id });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getRawScenario(req: Request, res: Response) {
    try {
      const rawScenario: RawScenario = await dbService.selectRawScenario(
        parseFloat(req.params.id),
      );
      res.status(200).json(rawScenario);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getRawScenarioByName(req: Request, res: Response) {
    const { name }: { name: string } = req.body;
    try {
      const rawScenario = await dbService.selectRawScenarioByName(name);
      res.status(200).json(rawScenario);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getRawScenariosForScenarioProject(req: Request, res: Response) {
    try {
      const rawScenarios = await dbService.selectRawScenariosForScenarioProject(
        parseFloat(req.params.id),
      );
      console.log(rawScenarios);
      res.status(200).json(rawScenarios);
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
