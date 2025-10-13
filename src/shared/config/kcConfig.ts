interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}

export const keycloakConfigs: Record<string, KeycloakConfig> = {
  principal: {
    url: "https://sso.lamod.unam.mx/auth/",
    realm: "macti3dev",
    clientId: "next-login",
  },
  cuantico: {
    url: "https://sso.lamod.unam.mx/auth/",
    realm: "macti3dev",
    clientId: "next-login",
  },
};
