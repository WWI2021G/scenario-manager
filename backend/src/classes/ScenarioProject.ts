import { InfluencingFactor } from "./InfluencingFactor";
import { ScenarioType } from "./ScenarioType";

export class ScenarioProject {
  name: string;
  description: string;
  influencingFactors: InfluencingFactor[];
  scenarioType: ScenarioType;

  constructor(name: string, description: string, scenarioType: ScenarioType) {
    this.name = name;
    this.description = description;
    this.scenarioType = scenarioType;
    this.influencingFactors = [];
  }

  // TEST: Was genau soll es zurückgeben? Name und Beschreibung? <2024-05-27> - Max
  getDetails(): string { return this.name + "\n" + this.description }

  addInfluencingFactor(factor: InfluencingFactor): void {
    this.influencingFactors.push(factor);
  }

  removeInfluencingFactor(factor: InfluencingFactor): void {
    this.influencingFactors = this.influencingFactors.filter((element: InfluencingFactor) => element !== factor);
  }

  getInfluencingFactors(): InfluencingFactor[] {
    return this.influencingFactors;
  }
}
