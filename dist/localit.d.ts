declare type LocalitConfig = {
    domain?: string;
    type?: string;
};
declare const localit: {
    config({ domain, type }: LocalitConfig): void;
    set(key: string, value: any, expirationTime?: string): void;
    get(key: string): any;
    remove(key: string): void;
    setDomain(domain: string): void;
    clearDomain(domain?: string): void;
    bust(): void;
};

export { localit };
