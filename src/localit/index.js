const localit = class Localit {
    constructor(type = 'localStorage') {
        this.store = (type == 'localStorage') ? localStorage : sessionStorage;
    }

    set(key, val) {
        if (typeof val == 'object')
            val = JSON.stringify(val);

        this.store.setItem(key, val)
    }

    get(key) {
        return JSON.parse(this.store.getItem(key));
    }

    remove(key) {
        this.store.removeItem(key)
    }

    clear() {
        this.store.clear();
    }
}

export { localit };