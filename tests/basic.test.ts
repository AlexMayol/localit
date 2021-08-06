import { localit as store } from "../dist/localit";

describe("Simple tests", () => {
  const key = "basic";
  const value = "Hello World";
  store.config({ domain: "simple_tests" });

  test("localStorage is empty", () => {
    store.bust();
    expect(localStorage.length).toBe(0);
  });

  test("set() is called properly", () => {
    store.set(key, value);
    expect(localStorage.length).toBe(1);
  });

  test("get() is called properly", () => {
    expect(store.get(key)).toBe(value);
  });

  test("localStorage key is correct", () => {
    const included = Object.keys(localStorage).includes("simple_tests_basic");
    expect(included).toBeTruthy();
  });

  test("localStorage is empty after clearing it", () => {
    store.bust();
    expect(localStorage.length).toBe(0);
  });
});
