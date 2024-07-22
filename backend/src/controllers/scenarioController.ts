import { Request, Response } from "express";
import ClusterAnalysis from "../services/clusterAnalysis";
import { scenarioService } from "../services/scenarioService";

class ScenarioController {
  public async executeClustering(req: Request, res: Response): Promise<void> {
    try {
      const { projectionBundles } = req.body;
      const scenarioProject_id = req.body.scenarioProject_id;
      const clusterAnalysis = new ClusterAnalysis(projectionBundles);
      await clusterAnalysis.agglomerativeClustering(
        "average",
        scenarioProject_id,
      );

      res.status(200).json({ message: "Clustering completed" });
    } catch (error) {
      console.error("Error executing clustering:", error);
      res.status(500).json({ message: "Clustering failed", error });
    }
  }

  public async calculateDistribution(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { rawScenarioId } = req.body;

    try {
      const result = await scenarioService.calculateDistribution(rawScenarioId);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error executing distribution calculation:", error);
      res
        .status(500)
        .json({ message: "Distribution calculation failed", error });
    }
  }
}

export const scenarioController = new ScenarioController();
