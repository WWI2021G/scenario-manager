import { Request, Response } from "express";
import ClusterAnalysis from "../services/clusterAnalysis";

class ScenarioController {
  public async executeClustering(req: Request, res: Response): Promise<void> {
    try {
      const clusterAnalysis = new ClusterAnalysis();
      const clusters = clusterAnalysis.agglomerativeClustering('average');
      clusterAnalysis.displayClusters(clusters);

      res.status(200).json({ message: 'Clustering completed', clusters });
    } catch (error) {
      console.error('Error executing clustering:', error);
      res.status(500).json({ message: 'Clustering failed', error });
    }
  }

  // Other methods can be added here
}

export const scenarioController = new ScenarioController();

