import type { InstitutesType } from "./institutes";

interface KeycloakConfig {
  clientId: string;
  clientSecret: string;
  issuer: string;
}

export const keycloakConfigs: Record<InstitutesType, KeycloakConfig> = {
  principal: {
    clientId: process.env.KEYCLOAK_CLIENT_ID || "",
    clientSecret: process.env.PRINCIPAL_KEYCLOAK_CLIENT_SECRET || "",
    issuer: process.env.PRINCIPAL_KEYCLOAK_ISSUER || "",
  },
  cuantico: {
    clientId: process.env.KEYCLOAK_CLIENT_ID || "",
    clientSecret: process.env.CUANTICO_KEYCLOAK_CLIENT_SECRET || "",
    issuer: process.env.CUANTICO_KEYCLOAK_ISSUER || "",
  },
  ciencias: {
    clientId: process.env.KEYCLOAK_CLIENT_ID || "",
    clientSecret: process.env.CIENCIAS_KEYCLOAK_CLIENT_SECRET || "",
    issuer: process.env.CIENCIAS_KEYCLOAK_ISSUER || "",
  },
  ingenieria: {
    clientId: process.env.KEYCLOAK_CLIENT_ID || "",
    clientSecret: process.env.INGENIERIA_KEYCLOAK_CLIENT_SECRET || "",
    issuer: process.env.INGENIERIA_KEYCLOAK_ISSUER || "",
  },
};
