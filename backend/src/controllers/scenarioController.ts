import {Request, Response} from "express";
import {scenarioService} from "../services/scenarioService";
import { InfluencingArea } from "../models/InfluencingArea";
import { InfluencingFactor } from "../models/InfluencingFactor";

class ScenarioController {
  addInfluencingFactors(req: Request, res: Response) {
    const {name, description, influencingArea}: {name: string, description: string, influencingArea: InfluencingArea} = req.body;
    const influencingFactor = new InfluencingFactor(name, description, influencingArea);
    console.log(scenarioService.successMessage());
    console.log("Success");
    res.status(201).json(influencingFactor);
  }

  placeholder(req: Request, res: Response) {
    res.status(200).json({message: "Placeholder"});
  }
}

export const scenarioController = new ScenarioController();