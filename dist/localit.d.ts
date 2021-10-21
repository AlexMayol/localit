declare type LocalitConfig = {
    domain?: string;
    type?: "localStorage" | "sessionStorage";
};
declare const localit: {
    /**
     *
     * @param domain - name of the domain that will prefix all the stored keys. Example, given a "books" domain, the key "Alone" will generate the key "books_Alone"
     * @param type - the type of Storage you want to use: "localStorage" (default) or "sessionStorage"
     */
    config({ domain, type }: LocalitConfig): void;
    /**
     * Retrieves the value associated with the given key from the Storage. It uses the current domain.
     * @param key - key that will be used to retrieve from the Storage
     * @param value - stored value in the Storage.
     * @param expirationTime - seconds, minutes, hours or days that the value will remain stored.
        It will be deleted after that. Example: "5d" for five days or "3h" for three hours.
     */
    set(key: string, value: any, expirationTime?: string): void;
    /**
     * Retrieves the value associated with the given key from the Storage. It uses the current domain.
     * @param key - key that will be used to retrieve from the Storage
     */
    get(key: string): any;
    /**
     * Removes the given key from the Storage. It uses the current domain.
     * @param key - key that will be removed from the Storage
     */
    remove(key: string): void;
    /**
     * Removes all the stored values in the Storage
     * @param domain - Name of the domain that will prefix all the keys until changed again
     */
    setDomain(domain: string): void;
    /**
     * Removes all the stored values for that domain
     */
    clearDomain(domain?: string): void;
    /**
     * Removes all the stored values in the Storage
     */
    bust(): void;
};

export { localit };
