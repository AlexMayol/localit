declare type LocalitConfig = {
    domain?: string;
    type?: "localStorage" | "sessionStorage";
};
declare const localit: {
    /**
     * Sets the default configuration for storing data.
     * @param domain - name of the domain that will prefix all the stored keys. Example: given a "books" domain, the key "alone" will be stored as "books_alone".
     * @param type - the type of Storage you want to use: "localStorage" (default) or "sessionStorage"
     */
    config({ domain, type }: LocalitConfig): void;
    /**
     * Stores the given key/value in Storage. Additionally, an expiration date can be set.
     * @param key - key to store in Storage
     * @param value - value to store in Storage.
     * @param expirationTime - seconds, minutes, hours or days that the value will remain stored.
        It will be deleted after that.
        It allows "Xs", "Xm", "Xh", "Xd", where X can be any number.
        Example: "5d" for five days or "3h" for three hours.
     */
    set(key: string, value: any, expirationTime?: string): void;
    /**
     * Retrieves the value associated with the given key from the Storage. It uses the current domain.
     * @param key - key that will be used to retrieve from Storage
     */
    get(key: string): any;
    /**
     * Removes the given key from the Storage (and it's associated expiration date, if set). It uses the current domain.
     * @param key - key that will be removed from the Storage
     */
    remove(key: string): void;
    /**
     * Retrieves the value associated with the given key from the Storage and then removes it. It uses the current domain.
     * @param key - Key to get the value of and then remove from Storage. It uses the current domain.
     *
     */
    getAndRemove(key: string): any;
    /**
     * Sets a new domain to prefix the next stored keys
     * @param domain - Name of the domain that will prefix all the keys until changed again
     */
    setDomain(domain: string): void;
    /**
     * Removes all the stored values for that domain. Defaults to the current domain.
     * @param domain - Name of the domain we want to remove
     */
    clearDomain(domain?: string): void;
    /**
     * Removes all the stored values in Storage
     */
    bust(): void;
};
declare type TLocalit = typeof localit;

export { TLocalit, localit };
