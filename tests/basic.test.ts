import { localit as store } from "../dist/index.min.esm";

describe("Simple tests", () => {
  const KEY = "basic";
  const VALUE = "Hello World";
  store.config({ domain: "simple_tests" });

  test("localStorage is empty", () => {
    store.bust();
    expect(localStorage.length).toBe(0);
  });

  test("set() is called properly", () => {
    store.set(KEY, VALUE);
    expect(localStorage.length).toBe(1);
  });

  test("get() is called properly", () => {
    expect(store.get(KEY)).toBe(VALUE);
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
    store.clearDomain("clearDomain_test");
    expect(localStorage.length).toBe(2);
    store.clearDomain("random_domain");
    expect(localStorage.length).toBe(0);
  });

  test("localStorage is empty after clearing it", () => {
    store.bust();
    expect(localStorage.length).toBe(0);
  });
  test("saves a value and deletes it afterwards", () => {
    store.bust();
    store.set("simple", "test");
    const res = store.getAndRemove("simple");
    expect(res).toBe("test");
    expect(store.get("simple")).toBe(null);
    expect(localStorage.length).toBe(0);
  });
});
