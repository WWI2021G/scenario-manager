import { ConsistencyMatrix } from "../src/models/ConsistencyMatrix";
import { FutureProjection } from "../src/models/FutureProjection";
import { KeyFactor } from "../src/models/KeyFactor";
import { Probability } from "../src/models/Probability";
import { ProjectionType } from "../src/models/ProjectionType";

describe("ConsistencyMatrix", () => {
  let consistencyMatrix: ConsistencyMatrix;
  let projectionA: FutureProjection;
  let projectionB: FutureProjection;
  let projectionC: FutureProjection;

  beforeEach(() => {
    consistencyMatrix = new ConsistencyMatrix();

    const keyFactor = new KeyFactor("Bar", "Bar is currently like this...");
    const probability = Probability.MEDIUM;
    const timeFrame = new Date();
    const type = ProjectionType.TREND;

    projectionA = new FutureProjection(
      "ProjectionA",
      "DescriptionA",
      keyFactor,
      probability,
      timeFrame,
      type,
    );

    projectionB = new FutureProjection(
      "ProjectionB",
      "DescriptionB",
      keyFactor,
      probability,
      timeFrame,
      type,
    );

    projectionC = new FutureProjection(
      "ProjectionC",
      "DescriptionC",
      keyFactor,
      probability,
      timeFrame,
      type,
    );
  });

  test("should set and get consistency correctly", () => {
    consistencyMatrix.setConsistency(projectionA, projectionB, 10);
    const consistency = consistencyMatrix.getConsistency(
      projectionA,
      projectionB,
    );
    expect(consistency).toBe(10);
  });

  test("should return undefined for non-existing consistency", () => {
    const consistency = consistencyMatrix.getConsistency(
      projectionA,
      projectionC,
    );
    expect(consistency).toBeUndefined();
  });

  test("should overwrite existing consistency correctly", () => {
    consistencyMatrix.setConsistency(projectionA, projectionB, 10);
    consistencyMatrix.setConsistency(projectionA, projectionB, 20);
    const consistency = consistencyMatrix.getConsistency(
      projectionA,
      projectionB,
    );
    expect(consistency).toBe(20);
  });

  test("should return the correct matrix", () => {
    consistencyMatrix.setConsistency(projectionA, projectionB, 10);
    consistencyMatrix.setConsistency(projectionA, projectionC, 15);
    const actualMatrix = consistencyMatrix.getMatrix();
    const expectedMatrix = new Map();
    const innerMap = new Map();
    innerMap.set(projectionB, 10);
    innerMap.set(projectionC, 15);
    expectedMatrix.set(projectionA, innerMap);
    expect(actualMatrix).toEqual(expectedMatrix);
  });
});
