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

  test("clearDomain works as expected", () => {
    store.bust();

    store.setDomain("clearDomain_test");
    store.set("test1", 1);
    store.set("test2", 2);
    store.setDomain("random_domain");
    store.set("test1", 1);
    store.set("test2", 2);

    expect(localStorage.length).toBe(4);
    store.clearDomain("random_domain");
    expect(localStorage.length).toBe(2);
  });

  test("localStorage is empty after clearing it", () => {
    store.bust();
    expect(localStorage.length).toBe(0);
  });
  test.only("saves a value and deletes it afterwards", () => {
    store.bust();
    store.set("simple", "test");
    const res = store.getAndRemove("simple");
    expect(res).toBe("test");
    expect(store.get("simple")).toBe(null);
    expect(localStorage.length).toBe(0);
  });
});
