declare const localit: {
    config({ type, domain }: {
        type: string;
        domain: string;
    }): void;
    set(key: string, value: any, expirationTime?: string): void;
    get(key: string): any;
    remove(key: string): void;
    setDomain(domain: string): void;
    clearDomain(domain?: string): void;
    bust(): void;
};

export { localit };
