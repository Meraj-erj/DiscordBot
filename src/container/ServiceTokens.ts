export const ServiceTokens = {
    Logger: "logger",

    Client: "client",

    ClientManager: "clientManager",

    Config: "config",

    Application: "application",

    ProxyManager: "proxyManager",
} as const;

export type ServiceToken = (typeof ServiceTokens)[keyof typeof ServiceTokens];
