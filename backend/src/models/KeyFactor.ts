export class KeyFactor {
  private name: string;
  private critical: boolean;
  private curState: string;
  private properties: [string | undefined, string | undefined];

  constructor(name: string, curState: string) {
    this.name = name;
    this.critical = false;
    this.curState = curState;
    this.properties = [undefined, undefined];
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
    return this.properties;
  }

  setProperties(propertyA: string | undefined, propertyB: string | undefined) {
    this.properties = [propertyA, propertyB];
  }

  updateProperty(propNum: number, property: string | undefined) {
    this.properties[propNum] = property;
  }
}
