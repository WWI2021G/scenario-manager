import { KeyFactor } from "./KeyFactor";

export class KeyFactorCatalog {
  private maxAmountOfKeyFactors: number;
  private keyFactors: KeyFactor[];

  constructor(maxAmountOfFactors: number) {
    this.maxAmountOfKeyFactors = maxAmountOfFactors;
    this.keyFactors = [];
  }

  getMaxAmountOfKeyFactors() {
    return this.maxAmountOfKeyFactors;
  }

  updateMaxAmountOfKeyFactors(maxAmountOfKeyFactors: number) {
    this.maxAmountOfKeyFactors = maxAmountOfKeyFactors;
  }

  getKeyFactors(): KeyFactor[] {
    return this.keyFactors;
  }

  addKeyFactor(keyFactor: KeyFactor) {
    this.keyFactors.push(keyFactor);
  }

  removeKeyFactor(keyFactor: KeyFactor) {
    this.keyFactors = this.keyFactors.filter(
      (element: KeyFactor) => element !== keyFactor,
    );
  }
}
