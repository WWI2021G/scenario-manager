import { KeyFactor } from "./KeyFactor";
import { Probability } from "./Probability";
import { ProjectionType } from "./ProjectionType";

// TEST: Add tests <2024-05-30> - Max
export class FutureProjection {
  private name: string;
  private description: string;
  private keyFactor: KeyFactor;
  private probability: Probability;
  private timeFrame: Date;
  private type: ProjectionType;

  constructor(name: string, description: string, keyFactor: KeyFactor, probability: Probability, timeFrame: Date, type: ProjectionType) {
    this.name = name;
    this.description = description;
    this.keyFactor = keyFactor;
    this.probability = probability;
    this.timeFrame = timeFrame;
    this.type = type;
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

  getKeyFactor(): KeyFactor {
    return this.keyFactor;
  }

  updateKeyFactor(keyFactor: KeyFactor) {
    this.keyFactor = keyFactor;
  }

  getProbability(): Probability {
    return this.probability;
  }

  updateProbability(probability: Probability) {
    this.probability = probability;
  }

  getTimeFrame(): Date {
    return this.timeFrame;
  }

  updateTimeFrame(timeFrame: Date) {
    this.timeFrame = timeFrame;
  }

  getType(): ProjectionType {
    return this.type;
  }

  updateType(type: ProjectionType) {
    this.type = type;
  }
}
