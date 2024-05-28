import { Property } from "./Property";

export class KeyFactor {
  private name: string;
  private critical: boolean;
  private properties: [Property | undefined, Property | undefined];

  constructor(name: string) {
    this.name = name;
    this.critical = false;
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

  getProperties(): [Property | undefined, Property | undefined] {
    return this.properties;
  }

  setProperties(propertyA: Property | undefined, propertyB: Property | undefined) {
    this.properties = [propertyA, propertyB];
  }

  updateProperty(propNum: number, property: Property | undefined) {
    this.properties[propNum] = property;
  }
}
