import { InfluencingArea } from "./InfluencingArea";

export class InfluencingFactor {
  name: string;
  description: string;
  influencingArea: InfluencingArea;

  constructor(name: string, description: string, influencingArea: InfluencingArea) {
    this.name = name;
    this.description = description;
    this.influencingArea = influencingArea;
  }

  getInfluencingArea(): InfluencingArea {
    return this.influencingArea;
  }
}