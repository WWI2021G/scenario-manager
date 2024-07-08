export class KeyFactor {
  private name: string;
  private critical: boolean;
  private curState: string;
  private prop_one: string | undefined;
  private prop_two: string | undefined;

  constructor(name: string, curState: string) {
    this.name = name;
    this.critical = false;
    this.curState = curState;
    this.prop_one = undefined;
    this.prop_two = undefined;
  }

  getName(): string {
    return this.name;
  }

  updateName(name: string) {
    this.name = name;
  }

  getCritical(): boolean {
    return this.critical;
  }

  updateCritical(critical: boolean) {
    this.critical = critical;
  }

  getCurState(): string {
    return this.curState;
  }

  updateCurState(curState: string) {
    this.curState = curState;
  }

  getProperties(): [string | undefined, string | undefined] {
    return [this.prop_one, this.prop_two];
  }

  setProperties(propertyA: string | undefined, propertyB: string | undefined) {
    this.prop_one = propertyA;
    this.prop_two = propertyB;
  }

  updateProperty(propNum: number, property: string | undefined) {
    if (propNum == 1) {
      this.prop_one = property;
    } else if (propNum == 2) {
      this.prop_two = property;
    } else {
      throw new Error("updateProperty only takes 1 or 2 as first argument");
    }
  }
}
