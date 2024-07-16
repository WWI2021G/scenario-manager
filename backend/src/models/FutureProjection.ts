import { KeyFactor } from "./KeyFactor";
import { Probability } from "./Probability";
import { ProjectionType } from "./ProjectionType";

export class FutureProjection {
  private name: string;
  private description: string;
  private keyFactor: KeyFactor;
  private keyFactor_id: number;
  private probability: Probability;
  private timeFrame: Date;
  private type: ProjectionType;

  constructor(
    name: string,
    description: string,
    keyFactor: KeyFactor,
    keyFactor_id: number,
    probability: Probability,
    timeFrame: Date,
    type: ProjectionType,
  ) {
    this.name = name;
    this.description = description;
    this.keyFactor = keyFactor;
    this.keyFactor_id = keyFactor_id;
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

  getKeyFactorID(): number {
    return this.keyFactor_id;
  }

  updateKeyFactorID(keyFactor_id: number) {
    this.keyFactor_id = keyFactor_id;
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
