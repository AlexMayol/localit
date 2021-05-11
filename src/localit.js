// https://www.tsmean.com/articles/how-to-write-a-typescript-library/
// https://www.tsmean.com/articles/how-to-write-a-typescript-library/local-consumer/
var DOMAIN = "";
var EXPIRE = "_expiration_date";
var store = localStorage;
var getFullKey = function (key) {
    return "" + DOMAIN + key;
};
var setExpiration = function (key, expiration_time) {
    // only minutes, days, hours and seconds allowed!
    var allowedFormats = ["h", "d", "m", "s"];
    if (!allowedFormats.some(function (char) { return expiration_time.includes(char); }))
        return console.warn("Localit: provide a valid expiration time format (e.g. '20h', '160s', '15d'). Your expiration date hasn't been saved.");
    var expiration_date = new Date();
    var add = null;
    if (expiration_time.includes("s")) {
        add = +expiration_time.replace("s", "");
        expiration_date.setSeconds(expiration_date.getSeconds() + add);
    }
    if (expiration_time.includes("m")) {
        add = +expiration_time.replace("m", "");
        expiration_date.setMinutes(expiration_date.getMinutes() + add);
    }
    if (expiration_time.includes("h")) {
        add = +expiration_time.replace("h", "");
        expiration_date.setHours(expiration_date.getHours() + add);
    }
    if (expiration_time.includes("d")) {
        add = +expiration_time.replace("d", "");
        expiration_date.setDate(expiration_date.getDate() + add);
    }
    store.setItem("" + getFullKey(key) + EXPIRE, JSON.stringify(expiration_date));
};
var hasExpirationDate = function (key) {
    return store.getItem("" + getFullKey(key) + EXPIRE) !== null;
};
var hasExpired = function (key) {
    var expirationDate = JSON.parse(store.getItem("" + getFullKey(key) + EXPIRE));
    return new Date() > new Date(expirationDate);
};
exports.localit = {
    config: function (_a) {
        var _b = _a.type, type = _b === void 0 ? "localStorage" : _b, _c = _a.domain, domain = _c === void 0 ? DOMAIN : _c;
        store = type === "localStorage" ? localStorage : sessionStorage;
        // K ACEMOS CON ESTOO SI '' ¿
        if (domain !== "")
            DOMAIN = domain + "_";
        else
            DOMAIN = domain;
    },
    set: function (key, value, expiration_time) {
        if (expiration_time === void 0) { expiration_time = null; }
        if (!key)
            return console.error("Localit: provide a key to store a value");
        if (typeof value == "object")
            value = JSON.stringify(value);
        store.setItem(getFullKey(key), value);
        expiration_time && setExpiration(key, expiration_time);
    },
    get: function (key) {
        if (hasExpirationDate(key) && hasExpired(key)) {
            this.remove(key);
            return null;
        }
        try {
            return JSON.parse(store.getItem(getFullKey(key)));
        }
        catch (e) {
            return store.getItem(getFullKey(key));
        }
    },
    remove: function (key) {
        store.removeItem(getFullKey(key));
        store.removeItem("" + getFullKey(key) + EXPIRE);
    },
    setDomain: function (domain) {
        DOMAIN = domain + "_";
    },
    clearDomain: function (domain) {
        if (domain === void 0) { domain = DOMAIN; }
        for (var _i = 0, _a = Object.keys(store); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key.includes(domain + "_"))
                store.removeItem(key);
        }
    },
    bust: function () {
        store.clear();
    }
};
