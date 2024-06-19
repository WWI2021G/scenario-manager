import { describe } from "node:test";
import { InfluencingArea } from "../src/models/InfluencingArea";
import { InfluencingFactor } from "../src/models/InfluencingFactor";
import { Variable } from "../src/models/Variable";

let influencingFactor = new InfluencingFactor(
  "Baz",
  "Baz factors in bar",
  Variable.ControlVariable,
  InfluencingArea.Gesellschaft,
);

describe("Testing InfluencingFactor class", () => {
  test("Test constructor", () => {
    expect(influencingFactor.getName()).toBe("Baz");
    expect(influencingFactor.getDescription()).toBe("Baz factors in bar");
    expect(influencingFactor.getVariable()).toBe(Variable.ControlVariable);
    expect(influencingFactor.getInfluencingArea()).toBe(
      InfluencingArea.Gesellschaft,
    );
  });

  test("Test updateName", () => {
    influencingFactor.updateName("Bar");
    expect(influencingFactor.getName()).toBe("Bar");
  });

  test("Test updateDescription", () => {
    influencingFactor.updateDescription("Bar factors in baz");
    expect(influencingFactor.getDescription()).toBe("Bar factors in baz");
  });

  test("Test updateVariable", () => {
    influencingFactor.updateVariable(Variable.EnvironmentVariable);
    expect(influencingFactor.getVariable()).toBe(Variable.EnvironmentVariable);
  });

  test("Test updateInfluencingArea", () => {
    influencingFactor.updateInfluencingArea(InfluencingArea.Handel);
    expect(influencingFactor.getInfluencingArea()).toBe(InfluencingArea.Handel);
  });
});
