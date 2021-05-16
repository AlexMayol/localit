type LocalitConfig = {
  domain?: string;
  type?: string;
};

let DOMAIN = "";
const EXPIRE = "_expiration_date";
let store = localStorage;

const getFullKey = (key: string) => {
  return `${DOMAIN}${key}`;
};

const setExpiration = (key: string, expirationTime: string) => {
  // only minutes, days, hours and seconds allowed!
  const allowedFormats = ["h", "d", "m", "s"];
  if (!allowedFormats.some((char) => expirationTime.includes(char))) {
    return console.warn("Localit: provide a valid expiration time format (e.g. '20h', '160s', '15d'). Your expiration date hasn't been saved.");
  }

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

  store.setItem(`${getFullKey(key)}${EXPIRE}`, JSON.stringify(expirationDate));
};

const hasExpirationDate = (key: string) => {
  return store.getItem(`${getFullKey(key)}${EXPIRE}`) !== null;
};

const hasExpired = (key: string) => {
  const expirationDate: string = JSON.parse(store.getItem(`${getFullKey(key)}${EXPIRE}`) || "null");
  return new Date() > new Date(expirationDate);
};

export const localit = {
  config({ domain, type = "localStorage" }: LocalitConfig) {
    store = type === "localStorage" ? localStorage : sessionStorage;
    if (domain) DOMAIN = `${domain}_`;
    else DOMAIN = "";
  },
  set(key: string, value: any, expirationTime?: string) {
    if (!key) return console.error("Localit: provide a key to store a value");

    if (typeof value === "object") value = JSON.stringify(value);

    store.setItem(getFullKey(key), value);
    expirationTime && setExpiration(key, expirationTime);
  },
  get(key: string) {
    if (hasExpirationDate(key) && hasExpired(key)) {
      this.remove(key);
      return null;
    }
    try {
      return JSON.parse(store.getItem(getFullKey(key)));
    } catch (e) {
      return store.getItem(getFullKey(key));
    }
  },
  remove(key: string) {
    store.removeItem(getFullKey(key));
    store.removeItem(`${getFullKey(key)}${EXPIRE}`);
  },

  setDomain(domain: string) {
    DOMAIN = `${domain}_`;
  },
  clearDomain(domain: string = DOMAIN) {
    for (let key of Object.keys(store)) if (key.includes(`${domain}_`)) store.removeItem(key);
  },
  bust() {
    store.clear();
  },
};
