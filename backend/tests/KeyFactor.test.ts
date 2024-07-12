import { describe } from "node:test";
import { KeyFactor } from "../src/models/KeyFactor";

let keyFactor = new KeyFactor("Foo", "Foo is currently like this...");
let propertyA = "Bar";
let propertyB = "Baz";
let propertyC = "Faz";

describe("Testing KeyFactor class", () => {
  test("Test constructor", () => {
    expect(keyFactor.getName()).toBe("Foo");
    expect(keyFactor.getCritical()).toBe(false);
    expect(keyFactor.getCurState()).toBe("Foo is currently like this...");
    expect(keyFactor.getProperties()).toStrictEqual([undefined, undefined]);
  });

  test("Test updateName", () => {
    keyFactor.updateName("Bar");
    expect(keyFactor.getName()).toBe("Bar");
  });

  test("Test updateCritical", () => {
    keyFactor.updateCritical(true);
    expect(keyFactor.getCritical()).toBe(true);
  });

  test("Test updateCurState", () => {
    keyFactor.updateCurState("Bar is currently looking down");
    expect(keyFactor.getCurState()).toBe("Bar is currently looking down");
  });

  test("Test addProperty", () => {
    expect(keyFactor.getProperties()).toStrictEqual([undefined, undefined]);
    keyFactor.setProperties(propertyA, undefined);
    expect(keyFactor.getProperties()).toStrictEqual([propertyA, undefined]);
    keyFactor.setProperties(propertyA, propertyB);
    expect(keyFactor.getProperties()).toStrictEqual([propertyA, propertyB]);
  });

  test("Test updateProperty", () => {
    keyFactor.updateProperty(1, propertyC);
    expect(keyFactor.getProperties()).toStrictEqual([propertyC, propertyB]);
    keyFactor.updateProperty(2, propertyA);
    expect(keyFactor.getProperties()).toStrictEqual([propertyC, propertyA]);
    keyFactor.updateProperty(1, undefined);
    expect(keyFactor.getProperties()).toStrictEqual([undefined, propertyA]);
    expect(() => keyFactor.updateProperty(0, propertyA)).toThrow(
      "updateProperty only takes 1 or 2 as first argument",
    );
  });
});
