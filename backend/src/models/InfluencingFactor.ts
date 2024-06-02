import { InfluencingArea } from "./InfluencingArea";
import { Variable } from "./Variable";

export class InfluencingFactor {
  private name: string;
  private description: string;
  // WARNING: Name ist komplett trash <2024-05-28> - Max
  private variable: Variable;
  private influencingArea: InfluencingArea;

  constructor(
    name: string,
    description: string,
    variable: Variable,
    influencingArea: InfluencingArea,
  ) {
    this.name = name;
    this.description = description;
    this.variable = variable;
    this.influencingArea = influencingArea;
  }

  getName(): string {
    return this.name;
  }

  updateName(name: string) {
    this.name = name;
  }

  getDescription(): string {
    return this.description;
  }

  updateDescription(description: string) {
    this.description = description;
  }

  getVariable(): Variable {
    return this.variable;
  }

  updateVariable(variable: Variable) {
    this.variable = variable;
  }

  getInfluencingArea(): InfluencingArea {
    return this.influencingArea;
  }

  updateInfluencingArea(influencingArea: InfluencingArea) {
    this.influencingArea = influencingArea;
  }
}
