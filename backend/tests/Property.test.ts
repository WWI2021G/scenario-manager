import { describe } from "node:test";
import { Property } from "../src/models/Property";

let property = new Property("Bar", "Bar is currently looking up");

describe("Testing Property class", () => {
  test("Test constructor", () => {
    expect(property.getName()).toBe("Bar");
    expect(property.getCurState()).toBe("Bar is currently looking up");
  });

  test("Test updateName", () => {
    property.updateName("Bar");
    expect(property.getName()).toBe("Bar");
  });

  test("Test updateCurState", () => {
    property.updateCurState("Bar is currently looking down");
    expect(property.getCurState()).toBe("Bar is currently looking down");
  });
});
