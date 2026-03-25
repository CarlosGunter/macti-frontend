interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}

export const keycloakConfigs: Record<string, KeycloakConfig> = {
  principal: {
    url: "https://sso.lamod.unam.mx/auth/",
    realm: "macti3dev",
    clientId:
      process.env.NEXT_PUBLIC_NODE_ENV === "development"
        ? "local-next-login"
        : "next-login",
  },
  cuantico: {
    url: "https://keycloakmacti1.duckdns.org:8443/",
    realm: "macti4dev",
    clientId:
      process.env.NEXT_PUBLIC_NODE_ENV === "development"
        ? "local-next-login"
        : "next-login",
  },
  ciencias: {
    url: "https://keycloakmacti2.duckdns.org:8444/",
    realm: "macti4dev",
    clientId:
      process.env.NEXT_PUBLIC_NODE_ENV === "development"
        ? "local-next-login"
        : "next-login",
  },
  ingenieria: {
    url: "https://keycloakmacti3.duckdns.org:8445/",
    realm: "macti4dev",
    clientId:
      process.env.NEXT_PUBLIC_NODE_ENV === "development"
        ? "local-next-login"
        : "next-login",
  },
};
