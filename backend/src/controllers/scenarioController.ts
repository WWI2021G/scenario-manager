
import { Request, Response } from "express";
import ClusterAnalysis from "../services/clusterAnalysis";

class ScenarioController {
  public async executeClustering(req: Request, res: Response): Promise<void> {
    try {
      const { projectionBundles } = req.body;
      console.log(req.body)
      const scenarioProject_id = req.body.scenarioProject_id;
      const clusterAnalysis = new ClusterAnalysis(projectionBundles);
      await clusterAnalysis.agglomerativeClustering('average', scenarioProject_id);

      res.status(200).json({ message: 'Clustering completed' });
    } catch (error) {
      console.error('Error executing clustering:', error);
      res.status(500).json({ message: 'Clustering failed', error });
    }
  }

  // Other methods can be added here
}

export const scenarioController = new ScenarioController();

