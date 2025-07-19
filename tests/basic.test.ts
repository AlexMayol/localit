import { describe, test, expect, beforeEach } from "vitest";
import { localit } from "../dist/localit.es.js";
import type { Localit } from "../dist/index.d.ts"; // not strictly necessary

const store = localit as Localit;

describe("Simple tests", () => {
  const KEY = "basic";
  const VALUE = "Hello World";

  beforeEach(() => {
    store.bust();
    store.bust(sessionStorage);
  });

  test("localStorage is empty", () => {
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
  });

  test("set() is called properly", () => {
    store.set(KEY, VALUE);
    expect(localStorage.length).toBe(1);
  });

  test("get() is called properly", () => {
    store.set(KEY, VALUE);
    expect(store.get(KEY)).toBe(VALUE);
  });

  test("localStorage key is correct", () => {
    store.set(KEY, VALUE);
    const included = Object.keys(localStorage).includes(KEY);
    expect(included).toBeTruthy();
  });

  test("clearFamily works as expected", () => {
    store.set("test1", 1, { family: "family_1" });
    store.set("test2", 2, { family: "family_1" });
    store.set("test1", 1, { family: "family_2" });
    store.set("test2", 2, { family: "family_2" });

    expect(localStorage.length).toBe(4);
    store.clearFamily("family_1");
    expect(localStorage.length).toBe(2);
    store.clearFamily("family_2");
    expect(localStorage.length).toBe(0);
  });

  test("localStorage is empty after clearing it", () => {
    expect(localStorage.length).toBe(0);
  });
});
