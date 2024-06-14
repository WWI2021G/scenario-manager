import { User } from "../src/models/User";

const user = new User("Foo", "FooPassword");

describe("Testing ScenarioProject class", () => {
  test("Test constructor", () => {
    expect(user.getUserName()).toBe("Foo");
    expect(user.getPassword()).toBe("FooPassword");
  });
});
