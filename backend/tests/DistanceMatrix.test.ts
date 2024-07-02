import { DistanceMatrix } from "../src/models/DistanceMatrix";
import { ProjectionBundle } from "../src/models/ProjectionBundle";

describe("DistanceMatrix", () => {
  let matrix: DistanceMatrix;
  let bundleA: ProjectionBundle;
  let bundleB: ProjectionBundle;
  let bundleC: ProjectionBundle;

  beforeEach(() => {
    matrix = new DistanceMatrix();
    bundleA = new ProjectionBundle(51, 4, 2);
    bundleB = new ProjectionBundle(52, 5, 3);
    bundleC = new ProjectionBundle(53, 6, 4);
  });

  test("should set and get distance correctly", () => {
    matrix.setDistance(bundleA, bundleB, 10);
    const distance = matrix.getDistance(bundleA, bundleB);
    expect(distance).toBe(10);
  });

  test("should return undefined for non-existing distance", () => {
    const distance = matrix.getDistance(bundleA, bundleC);
    expect(distance).toBeUndefined();
  });

  test("should overwrite existing distance correctly", () => {
    matrix.setDistance(bundleA, bundleB, 10);
    matrix.setDistance(bundleA, bundleB, 20);
    const distance = matrix.getDistance(bundleA, bundleB);
    expect(distance).toBe(20);
  });

  test("should return the correct matrix", () => {
    matrix.setDistance(bundleA, bundleB, 10);
    matrix.setDistance(bundleA, bundleC, 15);
    const actualMatrix = matrix.getMatrix();
    const expectedMatrix = new Map();
    const innerMap = new Map();
    innerMap.set(bundleB, 10);
    innerMap.set(bundleC, 15);
    expectedMatrix.set(bundleA, innerMap);
    expect(actualMatrix).toEqual(expectedMatrix);
  });
});
