import { localit } from "../dist/index.min.esm";
import type { Localit } from "../dist/index";

const store = localit as Localit;

describe("Simple tests", () => {
  const KEY = "basic";
  const VALUE = "Hello World";

  test("localStorage is empty", () => {
    store.bust();
    expect(localStorage.length).toBe(0);
    store.bust(sessionStorage);
    expect(sessionStorage.length).toBe(0);
  });

  test("set() is called properly", () => {
    store.set(KEY, VALUE);
    expect(localStorage.length).toBe(1);
  });

  test("get() is called properly", () => {
    expect(store.get(KEY)).toBe(VALUE);
  });

  test("localStorage key is correct", () => {
    const included = Object.keys(localStorage).includes("basic");
    expect(included).toBeTruthy();
  });

  test("clearFamily works as expected", () => {
    store.bust();

    store.set("test1", 1, {family: 'family_1'});
    store.set("test2", 2, {family: 'family_1'});
    store.set("test1", 1, {family: 'family_2'});
    store.set("test2", 2, {family: 'family_2'});

    expect(localStorage.length).toBe(4);
    store.clearFamily("family_1");
    expect(localStorage.length).toBe(2);
    store.clearFamily("family_2");
    expect(localStorage.length).toBe(0);
  });

  test("localStorage is empty after clearing it", () => {
    store.bust();
    expect(localStorage.length).toBe(0);
  });
});
