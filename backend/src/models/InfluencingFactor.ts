export class InfluencingFactor {
  private name: string;
  private description: string;
  private activeSum: number;
  private passiveSum: number;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.activeSum = 0;
    this.passiveSum = 0;
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

  getActiveSum(): number {
    return this.activeSum;
  }

  setActiveSum(activeSum: number) {
    this.activeSum = activeSum;
  }

  getPassiveSum(): number {
    return this.passiveSum;
  }

  setPassiveSum(passiveSum: number) {
    this.passiveSum = passiveSum;
  }
}
