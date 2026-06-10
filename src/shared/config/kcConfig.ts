import type { InstitutesType } from "./institutes";

interface KeycloakConfig {
  clientId: string;
  clientSecret: string;
  issuer: string;
}

export const keycloakConfigs: Record<InstitutesType, KeycloakConfig> = {
  principal: {
    clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "",
    clientSecret: process.env.PRINCIPAL_KEYCLOAK_CLIENT_SECRET || "",
    issuer: process.env.NEXT_PUBLIC_PRINCIPAL_KEYCLOAK_ISSUER || "",
  },
  cuantico: {
    clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "",
    clientSecret: process.env.CUANTICO_KEYCLOAK_CLIENT_SECRET || "",
    issuer: process.env.NEXT_PUBLIC_CUANTICO_KEYCLOAK_ISSUER || "",
  },
  ciencias: {
    clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "",
    clientSecret: process.env.CIENCIAS_KEYCLOAK_CLIENT_SECRET || "",
    issuer: process.env.NEXT_PUBLIC_CIENCIAS_KEYCLOAK_ISSUER || "",
  },
  ingenieria: {
    clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "",
    clientSecret: process.env.INGENIERIA_KEYCLOAK_CLIENT_SECRET || "",
    issuer: process.env.NEXT_PUBLIC_INGENIERIA_KEYCLOAK_ISSUER || "",
  },
};
