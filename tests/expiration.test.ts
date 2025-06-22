import { localit } from "../src/index";

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
      expiresIn: expirationTime
    });
    expect(localStorage.length).toBe(1);
  });

  test("Expiration metadata is present in localStorage", () => {
    store.set(key, value, {
      expiresIn: expirationTime
    });
    const item = JSON.parse(localStorage.getItem(key) || "null");
    expect(item?.meta.expiresAt).toBeDefined();
  });

  test("Expiration metadata is present in sessionStorage", () => {
    store.set(key, value, {
      expiresIn: expirationTime,
      type: sessionStorage
    });
    const item = JSON.parse(sessionStorage.getItem(key) || "null");
    expect(item?.meta.expiresAt).toBeDefined();
  });

  test("Value is retrievable within its life span", () => {
    store.set(key, value, {
      expiresIn: expirationTime
    });
    expect(store.get(key)).toEqual(value);
  });

  test("Value is no longer retrievable after the expiration date", async () => {
    store.set(key, value, {
      expiresIn: "2s"
    });
    await justWait(4000);
    expect(store.get(key)).toEqual(null);
  });

  test("localStorage is not empty after the expiration date has passed", async () => {
    store.set(key, value, {
      expiresIn: "2s"
    });
    await justWait(4000);
    expect(localStorage.length).toBe(1);
  });

  test("Storing multiple values with expiration date", () => {
    store.set("one", 1, {
      expiresIn: "3s"
    });
    store.set("two", 2, {
      expiresIn: "6s"
    });
    expect(localStorage.length).toBe(2);
  });

  test("After 4 seconds, only one value can be retrieved but two exists", async () => {
    store.set("one", 1, {
      expiresIn: "3s"
    });
    store.set("two", 2, {
      expiresIn: "6s"
    });
    await justWait(4000);
    expect(localStorage.length).toBe(2);
    expect(store.get("one")).toBeNull();
    expect(store.get("two")).toBe(2);
  });

  test("Storing bad time format", () => {
    const consoleMock = jest.spyOn(console, "warn");
    store.set("three", 3, {
      // @ts-expect-error incorrect type on purpose
      expiresIn: "10ddss"
    });
    store.set("three bad", 3, {
      // @ts-expect-error incorrect type on purpose
      expiresIn: "s"
    });

    expect(consoleMock.mock.calls.length).toBe(2);
    expect(localStorage.length).toBe(2);
  });
});
