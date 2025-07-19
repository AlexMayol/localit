import { describe, test, expect, beforeEach, vi } from "vitest";
import { localit } from "../dist/localit.es.js";

const store = localit;

export const justWait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

describe("Saving and retrieving objects", () => {
  const key = "timed_value";
  const value = "A temporary string";
  const expirationTime = "5s";

  beforeEach(() => {
    store.bust();
  });

  test("Value is stored with an expiration date", () => {
    store.set(key, value, {
      expiration: expirationTime,
    });
    expect(localStorage.length).toBe(1);
  });

  test("Expiration metadata is present in localStorage", () => {
    store.set(key, value, {
      expiration: expirationTime,
    });
    const item = JSON.parse(localStorage.getItem(key) || "null");
    expect(item?.meta.expiration).toBeDefined();
  });

  test("Expiration metadata is present in sessionStorage", () => {
    store.set(key, value, {
      expiration: expirationTime,
      type: sessionStorage,
    });
    const item = JSON.parse(sessionStorage.getItem(key) || "null");
    expect(item?.meta.expiration).toBeDefined();
  });

  test("Value is retrievable within its life span", () => {
    store.set(key, value, {
      expiration: expirationTime,
    });
    expect(store.get(key)).toEqual(value);
  });

  test("Value is no longer retrievable after the expiration date", async () => {
    store.set(key, value, {
      expiration: "2s",
    });
    await justWait(4000);
    expect(store.get(key)).toEqual(null);
  });

  test("localStorage is not empty after the expiration date has passed", async () => {
    store.set(key, value, {
      expiration: "2s",
    });
    await justWait(4000);
    expect(localStorage.length).toBe(1);
  });

  test("Storing multiple values with expiration date", () => {
    store.set("one", 1, {
      expiration: "3s",
    });
    store.set("two", 2, {
      expiration: "6s",
    });
    expect(localStorage.length).toBe(2);
  });

  test("After 4 seconds, only one value can be retrieved but two exists", async () => {
    store.set("one", 1, {
      expiration: "3s",
    });
    store.set("two", 2, {
      expiration: "6s",
    });
    await justWait(4000);
    expect(localStorage.length).toBe(2);
    expect(store.get("one")).toBeNull();
    expect(store.get("two")).toBe(2);
  });

  test("Storing bad time format", () => {
    const consoleMock = vi.spyOn(console, "warn");
    store.set("three", 3, {
      expiration: "10ddss",
    });
    store.set("three bad", 3, {
      expiration: "s",
    });

    expect(consoleMock.mock.calls.length).toBe(2);
    expect(localStorage.length).toBe(2);
  });

  test("Value can be stored with a Date object", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    store.set("date", "A value with a date", {
      expiration: tomorrow,
    });
    expect(localStorage.length).toBe(1);
    expect(store.get("date")).toBe("A value with a date");
  });

  test("Value is not retrieved if the Date is in the past", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    store.set("past", "A value from the past", {
      expiration: yesterday,
    });
    expect(store.get("past")).toBeNull();
  });

  test("Storing an invalid Date", () => {
    const consoleMock = vi.spyOn(console, "warn");
    store.set("invalid-date", "A value with an invalid date", {
      expiration: new Date("invalid date"),
    });
    expect(consoleMock).toHaveBeenCalledWith(
      "Localit: provided Date is invalid. Your expiration date wasn't saved.",
    );
    const item = JSON.parse(localStorage.getItem("invalid-date") || "null");
    expect(item?.meta.expiration).toBeNull();
  });
});
