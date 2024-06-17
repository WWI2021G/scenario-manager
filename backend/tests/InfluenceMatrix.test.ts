import { InfluenceMatrix } from "../src/models/InfluenceMatrix";
import { InfluencingArea } from "../src/models/InfluencingArea";
import { InfluencingFactor } from "../src/models/InfluencingFactor";
import { Variable } from "../src/models/Variable";

describe("InfluenceMatrix", () => {
  let influenceMatrix: InfluenceMatrix;
  let factorA: InfluencingFactor;
  let factorB: InfluencingFactor;
  let factorC: InfluencingFactor;

  beforeEach(() => {
    influenceMatrix = new InfluenceMatrix();

    factorA = new InfluencingFactor(
      "FactorA",
      "FactorA factors in A",
      Variable.ControlVariable,
      InfluencingArea.Handel,
    );
    factorB = new InfluencingFactor(
      "FactorB",
      "FactorB factors in B",
      Variable.ControlVariable,
      InfluencingArea.Ökonomie,
    );
    factorC = new InfluencingFactor(
      "FactorC",
      "FactorC factors in C",
      Variable.EnvironmentVariable,
      InfluencingArea.Gesellschaft,
    );
  });

  test("should set and get influence correctly", () => {
    influenceMatrix.setDistance(factorA, factorB, 10);
    const influence = influenceMatrix.getInfluence(factorA, factorB);
    expect(influence).toBe(10);
  });

  test("should return undefined for non-existing influence", () => {
    const influence = influenceMatrix.getInfluence(factorA, factorC);
    expect(influence).toBeUndefined();
  });

  test("should return the correct matrix", () => {
    influenceMatrix.setDistance(factorA, factorB, 10);
    influenceMatrix.setDistance(factorA, factorC, 15);
    const actualMatrix = influenceMatrix.getMatrix();
    const expectedMatrix = new Map();
    const innerMap = new Map();
    innerMap.set(factorB, 10);
    innerMap.set(factorC, 15);
    expectedMatrix.set(factorA, innerMap);
    expect(actualMatrix).toEqual(expectedMatrix);
  });

  test("should calculate active sum correctly", () => {
    influenceMatrix.setDistance(factorA, factorB, 10);
    influenceMatrix.setDistance(factorA, factorC, 15);
    const activeSum = influenceMatrix.getActiveSum(factorA);
    expect(activeSum).toBe(25);
  });

  test("should return undefined for active sum if factor does not exist", () => {
    const activeSum = influenceMatrix.getActiveSum(
      new InfluencingFactor(
        "NonExistingFactor",
        "NonExistingFactor factors nothing in",
        Variable.ControlVariable,
        InfluencingArea.Gesellschaft,
      ),
    );
    expect(activeSum).toBeUndefined();
  });

  test("should calculate passive sum correctly", () => {
    influenceMatrix.setDistance(factorB, factorA, 10);
    influenceMatrix.setDistance(factorC, factorA, 15);
    const passiveSum = influenceMatrix.getPassiveSum(factorA);
    expect(passiveSum).toBe(25);
  });

  test("should return undefined for passive sum if factor does not exist", () => {
    const passiveSum = influenceMatrix.getPassiveSum(
      new InfluencingFactor(
        "NonExistingFactor",
        "NonExistingFactor factors nothing in",
        Variable.ControlVariable,
        InfluencingArea.Gesellschaft,
      ),
    );
    expect(passiveSum).toBeUndefined();
  });

  test("should calculate impulse index correctly", () => {
    influenceMatrix.setDistance(factorA, factorB, 10);
    influenceMatrix.setDistance(factorA, factorC, 15);
    influenceMatrix.setDistance(factorB, factorA, 10);
    influenceMatrix.setDistance(factorC, factorA, 15);
    const impulseIndex = influenceMatrix.calcImpulsIndex(factorA);
    expect(impulseIndex).toBeCloseTo(1.0);
  });

  test("should return undefined for impulse index if active sum is undefined", () => {
    const impulseIndex = influenceMatrix.calcImpulsIndex(
      new InfluencingFactor(
        "NonExistingFactor",
        "NonExistingFactor factors nothing in",
        Variable.ControlVariable,
        InfluencingArea.Gesellschaft,
      ),
    );
    expect(impulseIndex).toBeUndefined();
  });

  test("should return undefined for impulse index if passive sum is undefined", () => {
    influenceMatrix.setDistance(factorA, factorB, 10);
    const impulseIndex = influenceMatrix.calcImpulsIndex(factorA);
    expect(impulseIndex).toBeUndefined();
  });

  test("should calculate dynamic index correctly", () => {
    influenceMatrix.setDistance(factorA, factorB, 10);
    influenceMatrix.setDistance(factorA, factorC, 15);
    influenceMatrix.setDistance(factorB, factorA, 10);
    influenceMatrix.setDistance(factorC, factorA, 15);
    const dynamicIndex = influenceMatrix.calcDynamicIndex(factorA);
    expect(dynamicIndex).toBe(625); // 25 * 25
  });

  test("should return undefined for dynamic index if active sum is undefined", () => {
    const dynamicIndex = influenceMatrix.calcDynamicIndex(
      new InfluencingFactor(
        "NonExistingFactor",
        "NonExistingFactor factors nothing in",
        Variable.ControlVariable,
        InfluencingArea.Gesellschaft,
      ),
    );
    expect(dynamicIndex).toBeUndefined();
  });

  test("should return undefined for dynamic index if passive sum is undefined", () => {
    influenceMatrix.setDistance(factorA, factorB, 10);
    const dynamicIndex = influenceMatrix.calcDynamicIndex(factorA);
    expect(dynamicIndex).toBeUndefined();
  });
});
