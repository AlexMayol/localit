type LocalitConfig = {
  domain?: string;
  type?: "localStorage" | "sessionStorage";
};

let DOMAIN: string = "";
const EXPIRE: string = "_expiration_date";
let store: Storage = localStorage;

/**
 * @param key - the unprefixed key to retrieve
 * @returns the actual key stored in Storage
 */
const getFullKey = (key: string): string => `${DOMAIN}${key}`;

/**
 * @param key - the unprefixed key to save with an expiration time
 * @returns the actual key stored in the Storage
 */
const getExpirationKey = (key: string): string => `${getFullKey(key)}${EXPIRE}`;

/**
 * @param key - the key to store with an expiration time
 * @param expirationTime - string with the amount of time we want to store the value. It allows "Xs", "Xm", "Xh", "Xd", where X can be any number.
 */
const setExpiration = (key: string, expirationTime: string): void => {
  // only minutes, days, hours and seconds allowed!
  const allowedFormats = ["h", "d", "m", "s"];
  if (!allowedFormats.some((char) => expirationTime.includes(char)))
    return console.warn("Localit: provide a valid expiration time format (e.g. '20h', '160s', '15d'). Your expiration date hasn't been saved.");

  const expirationDate = new Date();
  let add = 0;

  if (expirationTime.includes("s")) {
    add = +expirationTime.replace("s", "");
    expirationDate.setSeconds(expirationDate.getSeconds() + add);
  }

  if (expirationTime.includes("m")) {
    add = +expirationTime.replace("m", "");
    expirationDate.setMinutes(expirationDate.getMinutes() + add);
  }

  if (expirationTime.includes("h")) {
    add = +expirationTime.replace("h", "");
    expirationDate.setHours(expirationDate.getHours() + add);
  }

  if (expirationTime.includes("d")) {
    add = +expirationTime.replace("d", "");
    expirationDate.setDate(expirationDate.getDate() + add);
  }

  store.setItem(getExpirationKey(key), JSON.stringify(expirationDate));
};

/**
 * @param key - the key to check if it has an expiration date
 * @return whether or not there is an expiration date for the given key
 */
const hasExpirationDate = (key: string): boolean => store.getItem(getExpirationKey(key)) !== null;

/**
 * @param key - the key to check if it has expired
 * @return whether or not there is an expiration date for the given key
 */
const hasExpired = (key: string): boolean => {
  const expirationDate: string = JSON.parse(store.getItem(getExpirationKey(key)));
  return new Date() > new Date(expirationDate);
};

export const localit = {
  /**
   * Sets the default configuration for storing data.
   * @param domain - name of the domain that will prefix all the stored keys. Example: given a "books" domain, the key "alone" will be stored as "books_alone".
   * @param type - the type of Storage you want to use: "localStorage" (default) or "sessionStorage"
   */
  config({ domain = null, type = "localStorage" }: LocalitConfig): void {
    store = type === "localStorage" ? localStorage : sessionStorage;
    if (domain) DOMAIN = `${domain}_`;
    else DOMAIN = "";
  },
  /**
   * Stores the given key/value in Storage. Additionally, an expiration date can be set.
   * @param key - key to store in Storage
   * @param value - value to store in Storage. 
   * @param expirationTime - seconds, minutes, hours or days that the value will remain stored.
      It will be deleted after that.
      It allows "Xs", "Xm", "Xh", "Xd", where X can be any number.
      Example: "5d" for five days or "3h" for three hours.
   */
  set(key: string, value: any, expirationTime?: string): void {
    if (!key) return console.error("Localit: provide a key to store the value");

    if (typeof value === "object") value = JSON.stringify(value);

    store.setItem(getFullKey(key), value);
    expirationTime && setExpiration(key, expirationTime);
  },
  /**
   * Retrieves the value associated with the given key from the Storage. It uses the current domain.
   * @param key - key that will be used to retrieve from Storage
   */
  get(key: string): any {
    if (hasExpirationDate(key) && hasExpired(key)) {
      this.remove(key);
      return null;
    }
    try {
      return JSON.parse(store.getItem(getFullKey(key)));
    } catch (_) {
      return store.getItem(getFullKey(key));
    }
  },
  /**
   * Removes the given key from the Storage (and it's associated expiration date, if set). It uses the current domain.
   * @param key - key that will be removed from the Storage
   */
  remove(key: string): void {
    store.removeItem(getFullKey(key));
    store.removeItem(getExpirationKey(key));
  },
  /**
   * Sets a new domain to prefix the next stored keys
   * @param domain - Name of the domain that will prefix all the keys until changed again
   */
  setDomain(domain: string): void {
    DOMAIN = `${domain}_`;
  },
  /**
   * Removes all the stored values for that domain. Defaults to the current domain.
   * @param domain - Name of the domain we want to remove
   */
  clearDomain(domain: string = DOMAIN): void {
    for (let key of Object.keys(store)) if (key.includes(`${domain}_`)) store.removeItem(key);
  },
  /**
   * Removes all the stored values in Storage
   */
  bust(): void {
    store.clear();
  },
};

export type TLocalit = typeof localit;
