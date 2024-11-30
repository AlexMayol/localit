import { localit as store } from "../dist/index.min.esm";

describe("Listener Events", () => {
  const KEY = "listener";
  const VALUE = "d_ listener";
  const DOMAIN = "event_listener_test";

  store.config({ domain: DOMAIN });

  const mockCallback = jest.fn();
  store.on(KEY, mockCallback);

  beforeEach(() => {
    store.bust();
    mockCallback.mockClear();
  });

  test("Callback is executed on set", () => {
    store.set(KEY, VALUE);
    expect(mockCallback).toHaveBeenCalled();
    expect(mockCallback).toHaveBeenCalledWith(VALUE);
  });
  test("Callback is executed on set twice", () => {
    store.set(KEY, VALUE);
    const updateValue = "updatedValue";
    store.set(KEY, updateValue);
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toHaveBeenCalledWith(updateValue);
  });
  test("Callback is executed on remove", () => {
    store.set(KEY, VALUE);
    store.remove(KEY);
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toHaveBeenCalledWith(null);
  });
  test("Callback is executed on getAndRemove", () => {
    store.set(KEY, VALUE);
    store.getAndRemove(KEY);
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toHaveBeenCalledWith(null);
  });
  test("Callback is executed on bust", () => {
    store.set(KEY, VALUE);
    store.bust();
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toHaveBeenCalledWith(null);
  });
  test("Callback is executed on clearDomain", () => {
    store.set(KEY, VALUE);
    store.clearDomain();
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toHaveBeenCalledWith(null);
  });
});
