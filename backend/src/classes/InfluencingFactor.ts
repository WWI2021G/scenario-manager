import { InfluencingArea } from "./InfluencingArea";

export class InfluencingFactor {
  name: string;
  description: string;
  details: string;
  influencingArea: InfluencingArea;

  constructor(name: string, description: string, details: string, influencingArea: InfluencingArea) {
    this.name = name;
    this.description = description;
    this.details = details;
    this.influencingArea = influencingArea;
  }

  getInfluencingArea(): InfluencingArea {
    return this.influencingArea;
  }
}
