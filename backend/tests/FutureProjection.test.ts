import { describe } from "node:test";
import { FutureProjection } from "../src/models/FutureProjection";
import { KeyFactor } from "../src/models/KeyFactor";
import { Probability } from "../src/models/Probability";
import { ProjectionType } from "../src/models/ProjectionType";

let keyFactor = new KeyFactor("Bar");
let futureProjection = new FutureProjection(
  "Fuu",
  "Fuu projects Bar",
  keyFactor,
  Probability.high,
  new Date(new Date().getMonth() + 3),
  ProjectionType.Trend,
);

describe("Testing FutureProjection class", () => {
  test("Test constructor", () => {
    expect(futureProjection.getName()).toBe("Fuu");
    expect(futureProjection.getDescription()).toBe("Fuu projects Bar");
    expect(futureProjection.getKeyFactor()).toBe(keyFactor);
    expect(futureProjection.getProbability()).toBe(Probability.high);
    expect(futureProjection.getTimeFrame()).toStrictEqual(
      new Date(new Date().getMonth() + 3),
    );
    expect(futureProjection.getType()).toBe(ProjectionType.Trend);
  });

  test("Test updateName", () => {
    futureProjection.updateName("Bar");
    expect(futureProjection.getName()).toBe("Bar");
  });

  test("Test updateDescription", () => {
    futureProjection.updateDescription("Bar projects baz");
    expect(futureProjection.getDescription()).toBe("Bar projects baz");
  });

  test("Test updateKeyFactor", () => {
    futureProjection.updateKeyFactor(new KeyFactor("Key2"));
    expect(futureProjection.getKeyFactor()).toStrictEqual(
      new KeyFactor("Key2"),
    );
  });

  test("Test updateProbability", () => {
    futureProjection.updateProbability(Probability.average);
    expect(futureProjection.getProbability()).toBe(Probability.average);
    futureProjection.updateProbability(Probability.small);
    expect(futureProjection.getProbability()).toBe(Probability.small);
  });

  test("Test updateTimeFrame", () => {
    futureProjection.updateTimeFrame(new Date(new Date().getDay() + 120));
    expect(futureProjection.getTimeFrame()).toStrictEqual(
      new Date(new Date().getDay() + 120),
    );
  });

  test("Test updateType", () => {
    futureProjection.updateType(ProjectionType.Extreme);
    expect(futureProjection.getType()).toBe(ProjectionType.Extreme);
  });
});
