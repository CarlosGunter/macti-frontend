import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth, keycloak } from "better-auth/plugins";
import Database from "better-sqlite3";
import type { InstitutesType } from "../../shared/config/institutes";
import { keycloakConfigs } from "../../shared/config/kcConfig";

const SESSION_IDLE_TIMEOUT_SECONDS = 24 * 60 * 60; // 24 horas
const SESSION_REFRESH_WINDOW_SECONDS = 15 * 60; // 15 minutos

export const getAuthInstance = (institute: InstitutesType) => {
  const keycloakConfig = keycloakConfigs[institute];

  return betterAuth({
    database: new Database("@/../data/auth.sqlite"),
    baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/proxy/${institute}`,
    advanced: {
      cookiePrefix: `auth-${institute}`,
    },
    session: {
      // Coincide con la ventana de tiempo de espera inactivo de Keycloak.
      expiresIn: SESSION_IDLE_TIMEOUT_SECONDS,
      // Actualiza la sesión con la frecuencia para mantenerse activa durante el uso.
      updateAge: SESSION_REFRESH_WINDOW_SECONDS,
    },
    plugins: [
      genericOAuth({
        config: [
          keycloak({
            clientId: keycloakConfig.clientId,
            clientSecret: keycloakConfig.clientSecret,
            issuer: keycloakConfig.issuer,
          }),
        ],
      }),
      nextCookies(),
    ],
  });
};
