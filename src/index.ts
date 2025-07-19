export type LocalitItem = {
  value: any;
  meta: {
    expiration?: number | null;
  };
};

export type ExpirationType =
  | `${number}s`
  | `${number}m`
  | `${number}h`
  | `${number}d`
  | Date;

export type LocalitSetConfig = {
  type?: Storage;
  family?: string;
  expiration?: ExpirationType;
};

export type LocalitGetConfig = {
  type?: Storage;
  family?: string;
};

const getConfig = (key: string, config?: LocalitGetConfig) => {
  return {
    storage: config?.type ?? localStorage,
    fullKey: config?.family ? `${config.family}::${key}` : key,
  };
};

const listeners: { [key: string]: Array<(value: any) => void> } = {};

/**
 * @param key - the key to store with an expiration time
 * @param expirationTime - string with the amount of time we want to store the value. It allows "Xs", "Xm", "Xh", "Xd", where X can be any number.
 */
const getExpirationTime = (expirationTime?: ExpirationType): number | null => {
  if (!expirationTime) return null;

  // First, check if input value is a valid Date
  if (expirationTime instanceof Date) {
    if (isNaN(expirationTime.getTime())) {
      console.warn(
        "Localit: provided Date is invalid. Your expiration date wasn't saved.",
      );
      return null;
    }
    return expirationTime.getTime();
  }

  if (typeof expirationTime !== "string") {
    console.warn(
      "Localit: invalid expiration time type. Provide a string (e.g. '20h') or a Date.",
    );
    return null;
  }

  const expirationDate = new Date();

  // Or check if input is a valid string with the desired format
  const timeFormats = {
    h: (time: number) =>
      expirationDate.setHours(expirationDate.getHours() + time),
    d: (time: number) =>
      expirationDate.setDate(expirationDate.getDate() + time),
    m: (time: number) =>
      expirationDate.setMinutes(expirationDate.getMinutes() + time),
    s: (time: number) =>
      expirationDate.setSeconds(expirationDate.getSeconds() + time),
  };
  // only minutes, days, hours and seconds allowed!
  const allowedFormats = Object.keys(timeFormats);
  const timeKey = expirationTime[expirationTime.length - 1];
  const time = Number(expirationTime.replace(timeKey, ""));
  if (
    expirationTime.length < 2 ||
    !allowedFormats.some((char) => timeKey === char) ||
    isNaN(time)
  ) {
    console.warn(
      "Localit: provide a valid expiration time format (e.g. '20h', '160s', '15d'). Your expiration date wasn't saved.",
    );
    return null;
  }

  return timeFormats[timeKey as keyof typeof timeFormats](time);
};

/**
 * @param key - the key to check if it has expired
 * @return whether or not the timestamp is in the past
 */
const hasExpired = (time: number) => new Date() > new Date(time);

const on = (event: string, callback: (value: any) => void) => {
  if (!listeners[event]) {
    listeners[event] = [];
  }
  listeners[event].push(callback);
};

const emit = (event: string, ...data: [any]) => {
  if (!listeners[event]) {
    return;
  }

  for (const callback of listeners[event]) {
    callback(...data);
  }
};

const set = (key: string, value: any, config?: LocalitSetConfig) => {
  if (!key) return console.error("Localit: provide a key to store the value");

  let serializedValue = value;
  if (value instanceof Map) {
    serializedValue = {
      __type: "Map",
      value: Array.from(value.entries()),
    };
  } else if (value instanceof Set) {
    serializedValue = {
      __type: "Set",
      value: Array.from(value),
    };
  }

  const storeObject: LocalitItem = {
    value: serializedValue,
    meta: {
      expiration: getExpirationTime(config?.expiration),
    },
  };

  const { fullKey, storage } = getConfig(key, config);
  emit(fullKey, storeObject.value);
  storage.setItem(fullKey, JSON.stringify(storeObject));
};

const get = <T>(key: string, config?: LocalitGetConfig): T | null => {
  const { fullKey, storage } = getConfig(key, config);

  const item: LocalitItem | null = JSON.parse(
    storage.getItem(fullKey) ?? "null",
  );
  if (!item) return null;

  if (item.meta?.expiration && hasExpired(item.meta.expiration)) {
    remove(key, config);
    return null;
  }
  const value = item.value;
  if (value && value.__type === "Map") {
    return new Map(value.value) as T;
  } else if (value && value.__type === "Set") {
    return new Set(value.value) as T;
  }
  return value;
};

const remove = (key: string, config?: LocalitGetConfig): void => {
  const { fullKey, storage } = getConfig(key, config);
  emit(fullKey, null);
  storage.removeItem(fullKey);
};

const clearFamily = (family: string, storage: Storage = localStorage) => {
  for (const key of Object.keys(storage))
    if (key.includes(`${family}::`)) {
      remove(key, { type: storage });
    }
};

const bust = (storage: Storage = localStorage) => {
  storage.clear();
  Object.keys(listeners).forEach((event) => emit(event, null));
};

export const localit = {
  /**
   * Stores the given key/value in Storage. Additionally, an expiration date can be set.
   * @param key - key to store in Storage
   * @param value - value to store in Storage.
   * @param config - configuration for storing the value.
   * @param config.type - the type of Storage you want to use: "localStorage" (default) or "sessionStorage"
   * @param config.family - the family of the key. Example: given a "books" family, the key "fiction" will be stored as "books::fiction".
   * @param config.expiration - seconds, minutes, hours or days that the value will remain stored. Also accepts a fixed Date.
   *    It will be deleted after that when trying to get the value.
   *    It allows "Xs", "Xm", "Xh", "Xd", where X can be any number.
   *    Example: "5d" for five days or "3h" for three hours.
   */
  set,
  /**
   * Retrieves the value associated with the given key from the Storage. It uses the current domain.
   * @param key - key that will be used to retrieve from Storage
   */
  get,
  /**
   * Add a new listener on key changes
   * @param key - the key to attach the callback
   * @param callback - the function that will be called when the event key is emitted
   */
  on,
  /**
   * Removes the given key from the Storage (and it's associated expiration date, if set). It uses the current domain.
   * @param key - key that will be removed from the Storage
   */
  remove,
  /**
   * Removes all the stored values for that family.
   * @param family - Name of the family we want to remove
   * @param storage - the type of Storage you want to use: "localStorage" (default) or "sessionStorage"
   */
  clearFamily,
  /**
   * Removes all the stored values in Storage
   * @param storage - the type of Storage you want to clear: "localStorage" (default) or "sessionStorage"
   */
  bust,
};

export type Localit = typeof localit;
