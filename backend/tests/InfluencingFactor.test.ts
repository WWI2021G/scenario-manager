import { describe } from "node:test";
import { InfluencingFactor } from "../src/models/InfluencingFactor";

let influencingFactor = new InfluencingFactor("Baz", "Baz factors in bar");

describe("Testing InfluencingFactor class", () => {
  test("Test constructor", () => {
    expect(influencingFactor.getName()).toBe("Baz");
    expect(influencingFactor.getDescription()).toBe("Baz factors in bar");
  });

  test("Test updateName", () => {
    influencingFactor.updateName("Bar");
    expect(influencingFactor.getName()).toBe("Bar");
  });

  test("Test updateDescription", () => {
    influencingFactor.updateDescription("Bar factors in baz");
    expect(influencingFactor.getDescription()).toBe("Bar factors in baz");
  });
});
