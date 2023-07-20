type LocalitConfig = {
  domain?: string;
  type?: "localStorage" | "sessionStorage";
};

type LocalitValue = any | any[];

type LocalitStore = {
  value: LocalitValue;
  meta: {
    expiresAt?: number | null;
  };
};

let DOMAIN = "";
let store: Storage = localStorage;
const listeners = {};

/**
 * @param key - the unprefixed key to retrieve
 * @returns the actual key stored in Storage
 */
const getFullKey = (key: string): string => (DOMAIN ? `${DOMAIN}_${key}` : key);

/**
 * @param key - the key to store with an expiration time
 * @param expirationTime - string with the amount of time we want to store the value. It allows "Xs", "Xm", "Xh", "Xd", where X can be any number.
 */
const getExpirationTime = (expirationTime: string | null): number | null => {
  if (!expirationTime) return null;
  const expirationDate = new Date();

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
      "🔥 Localit: provide a valid expiration time format (e.g. '20h', '160s', '15d'). Your expiration date hasn't been saved."
    );
    return null;
  }

  return timeFormats[timeKey](time);
};

/**
 * @param key - the key to check if it has expired
 * @return whether or not there is an expiration date for the given key
 */
const hasExpired = (time: number): boolean => new Date() > new Date(time);

const on = (event: string, callback: (value: LocalitValue) => void): void => {
  const key = getFullKey(event);
  if (!listeners[key]) {
    listeners[key] = [];
  }
  listeners[key].push(callback);
};

const emit = (event: string, ...data: LocalitValue): void => {
  if (!listeners[event]) {
    return;
  }

  for (let i = 0; i < listeners[event].length; i++) {
    const callback = listeners[event][i];
    callback(...data);
  }
};

const config = ({
  domain = "",
  type = "localStorage",
}: LocalitConfig): void => {
  store = type === "localStorage" ? localStorage : sessionStorage;
  DOMAIN = domain;
};

const set = (
  key: string,
  value: LocalitValue,
  expirationTime: string | null = null
): void => {
  if (!key)
    return console.error("🔥 Localit: provide a key to store the value");

  const storeObject: LocalitStore = {
    value,
    meta: {
      expiresAt: getExpirationTime(expirationTime),
    },
  };
  emit(getFullKey(key), storeObject);
  store.setItem(getFullKey(key), JSON.stringify(storeObject));
};

const get = (key: string): LocalitValue => {
  try {

    const item: LocalitStore | null = JSON.parse(
      store.getItem(getFullKey(key)) || "''"
    );

    if (item?.meta?.expiresAt && hasExpired(item.meta.expiresAt)) {
      remove(key);
      return null;
    }

    return item?.value || null;
  } catch (_) {
    return null;
  }
};

const remove = (key: string): void => {
  emit(getFullKey(key), null);
  store.removeItem(getFullKey(key));
};

const getAndRemove = (key: string): LocalitValue => {
  const res = get(key);
  remove(key);
  return res;
};

const setDomain = (domain: string) => (DOMAIN = domain);

const clearDomain = (domain: string = DOMAIN) => {
  for (const key of Object.keys(store))
    if (key.includes(`${domain}`)) {
      emit(key, null);
      store.removeItem(key);
    }
};

const bust = () => {
  store.clear();
  Object.keys(listeners).map((event) => {
    emit(event, null);
  });
};

export const localit = {
  /**
   * Sets the default configuration for storing data.
   * @param domain - name of the domain that will prefix all the stored keys. Example: given a "books" domain, the key "alone" will be stored as "books_alone".
   * @param type - the type of Storage you want to use: "localStorage" (default) or "sessionStorage"
   */
  config,
  /**
 * Stores the given key/value in Storage. Additionally, an expiration date can be set.
 * @param key - key to store in Storage
 * @param value - value to store in Storage. 
 * @param expirationTime - seconds, minutes, hours or days that the value will remain stored.
    It will be deleted after that.
    It allows "Xs", "Xm", "Xh", "Xd", where X can be any number.
    Example: "5d" for five days or "3h" for three hours.
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
   * Retrieves the value associated with the given key from the Storage and then removes it. It uses the current domain.
   * @param key - Key to get the value of and then remove from Storage. It uses the current domain.
   *
   */
  getAndRemove,
  /**
   * Sets a new domain to prefix the next stored keys
   * @param domain - Name of the domain that will prefix all the keys until changed again
   */
  setDomain,
  /**
   * Removes all the stored values for that domain. Defaults to the current domain.
   * @param domain - Name of the domain we want to remove
   */
  clearDomain,
  /**
   * Removes all the stored values in Storage
   */
  bust,
};

export type Localit = typeof localit;
