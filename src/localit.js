export const Localit = class Localit {

    constructor({ domain = '', type = 'localStorage' } = {}) {
        this.store = (type == 'localStorage') ? localStorage : sessionStorage;
        this.DOMAIN = (domain) ? `${domain}_` : '';
        this.EXPIRE = '_expiration_date';
    }

    set(key, val, expire = null) {
        if (!key)
            return console.error('Localit: provide a key to store a value');

        if (typeof val == 'object')
            val = JSON.stringify(val);

        this.store.setItem(`${this.getFullKey(key)}`, val);

        expire && this.setExpiration(key, expire)
    }

    setExpiration(key, expire) {
        // only minutes, days and hours allowed!

        if (!expire.includes('h') && !expire.includes('d') && !expire.includes('m'))
            return;

        let expire_date = new Date();
        let add = null;

        if (expire.includes('m')) {
            add = parseInt(expire.replace('m', ''));
            expire_date.setMinutes(expire_date.getMinutes() + add);
        }

        if (expire.includes('h')) {
            add = parseInt(expire.replace('h', ''));
            expire_date.setHours(expire_date.getHours() + add);
        }

        if (expire.includes('d')) {
            add = parseInt(expire.replace('d', ''));
            expire_date.setDate(expire_date.getDate() + add);
        }

        this.store.setItem(`${this.getFullKey(key)}${this.EXPIRE}`, JSON.stringify(expire_date))
    }

    get(key) {
        if (this.hasExpirationDate(this.getFullKey(key))) {
            if (this.hasExpired(this.getFullKey(key))) {
                this.remove(key);
                return null;
            }
        }

        try {
            return JSON.parse(this.store.getItem(this.getFullKey(key)))
        } catch (e) {
            return this.store.getItem(this.getFullKey(key))
        }
    }

    remove(key) {
        this.store.removeItem(this.getFullKey(key));
        this.store.removeItem(`${this.getFullKey(key)}${this.EXPIRE}`);
    }

    setDomain(name) {
        this.DOMAIN = `${name}_`;

    }
    clearDomain(name = this.DOMAIN) {
        for (let key of Object.keys(localStorage))
            if (key.includes(name))
                this.store.removeItem(key);
    }

    hasExpirationDate(key) {
        return this.store.getItem(`${this.getFullKey(key)}${this.EXPIRE}`) !== null
    }

    hasExpired(key) {
        let expireDate = JSON.parse(this.store.getItem(`${this.getFullKey(key)}${this.EXPIRE}`));
        return new Date() > new Date(expireDate);
    }

    getFullKey(key) {
        return `${this.DOMAIN}${key}`;
    }

    bust() {
        this.store.clear();
    }
}
