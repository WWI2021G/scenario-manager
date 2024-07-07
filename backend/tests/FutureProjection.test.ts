import { describe } from "node:test";
import { FutureProjection } from "../src/models/FutureProjection";
import { KeyFactor } from "../src/models/KeyFactor";
import { Probability } from "../src/models/Probability";
import { ProjectionType } from "../src/models/ProjectionType";

let keyFactor = new KeyFactor("Bar", "Bar is currently like this...");
let futureProjection = new FutureProjection(
  "Fuu",
  "Fuu projects Bar",
  keyFactor,
  Probability.HIGH,
  new Date(new Date().getMonth() + 3),
  ProjectionType.TREND,
);

describe("Testing FutureProjection class", () => {
  test("Test constructor", () => {
    expect(futureProjection.getName()).toBe("Fuu");
    expect(futureProjection.getDescription()).toBe("Fuu projects Bar");
    expect(futureProjection.getKeyFactor()).toBe(keyFactor);
    expect(futureProjection.getProbability()).toBe(Probability.HIGH);
    expect(futureProjection.getTimeFrame()).toStrictEqual(
      new Date(new Date().getMonth() + 3),
    );
    expect(futureProjection.getType()).toBe(ProjectionType.TREND);
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
    futureProjection.updateKeyFactor(
      new KeyFactor("Key2", "Key2 is actually this..."),
    );
    expect(futureProjection.getKeyFactor()).toStrictEqual(
      new KeyFactor("Key2", "Key2 is actually this..."),
    );
  });

  test("Test updateProbability", () => {
    futureProjection.updateProbability(Probability.MEDIUM);
    expect(futureProjection.getProbability()).toBe(Probability.MEDIUM);
    futureProjection.updateProbability(Probability.LOW);
    expect(futureProjection.getProbability()).toBe(Probability.LOW);
  });

  test("Test updateTimeFrame", () => {
    futureProjection.updateTimeFrame(new Date(new Date().getDay() + 120));
    expect(futureProjection.getTimeFrame()).toStrictEqual(
      new Date(new Date().getDay() + 120),
    );
  });

  test("Test updateType", () => {
    futureProjection.updateType(ProjectionType.EXTREME);
    expect(futureProjection.getType()).toBe(ProjectionType.EXTREME);
  });
});
