import { Request, Response } from "express";
import { scenarioService } from "../services/scenarioService";
import { InfluencingFactor } from "../models/InfluencingFactor";

class ScenarioController {
  addInfluencingFactors(req: Request, res: Response) {
    const {
      name,
      description,
    }: { name: string; description: string; } =
      req.body;
    const influencingFactor = new InfluencingFactor(
      name,
      description,
    );
    console.log(scenarioService.successMessage());
    console.log("Success");
    res.status(201).json(influencingFactor);
  }

  placeholder(req: Request, res: Response) {
    res.status(200).json({ message: "Placeholder" });
  }
}

export const scenarioController = new ScenarioController();
