import { describe } from "node:test";
import { KeyFactorCatalog } from "../src/models/KeyFactorCatalog";
import { KeyFactor } from "../src/models/KeyFactor";

let keyFactor = new KeyFactor("Bar");
let keyFactorCatalog = new KeyFactorCatalog(7);

describe("Testing KeyFactorCatalog class", () => {
  test("Test constructor", () => {
    expect(keyFactorCatalog.getMaxAmountOfKeyFactors()).toBe(7);
    expect(keyFactorCatalog.getKeyFactors()).toStrictEqual([]);
  });

  test("Test updateMaxAmountOfKeyFactors", () => {
    keyFactorCatalog.updateMaxAmountOfKeyFactors(10);
    expect(keyFactorCatalog.getMaxAmountOfKeyFactors()).toBe(10);
  });

  test("Test addKeyFactor", () => {
    keyFactorCatalog.addKeyFactor(keyFactor);
    expect(keyFactorCatalog.getKeyFactors()).toStrictEqual([keyFactor]);
  });

  test("Test removeKeyFactor", () => {
    expect(keyFactorCatalog.getKeyFactors()).toStrictEqual([keyFactor]);
    keyFactorCatalog.removeKeyFactor(keyFactor);
    expect(keyFactorCatalog.getKeyFactors()).toStrictEqual([]);
  });
});
