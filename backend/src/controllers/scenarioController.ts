import {Request, Response} from "express";
import {scenarioService} from "../services/scenarioService";

class ScenarioController {
  addInfluencingFactors(req: Request, res: Response) {
    const {name, description, details}: {name: string, description: string, details: string} = req.body;
    const influencingFactor = {name, description, details};
    res.status(201).json(influencingFactor);
  }
}

export const scenarioController = new ScenarioController();