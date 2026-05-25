import { betterAuth } from "better-auth";
import { genericOAuth, keycloak } from "better-auth/plugins";
import type { InstitutesType } from "../config/institutes";
import { keycloakConfigs } from "../config/kcConfig";

const SESSION_IDLE_TIMEOUT_SECONDS = 30 * 60;
const SESSION_REFRESH_WINDOW_SECONDS = 5 * 60;

export const getAuthInstance = (institute: InstitutesType) => {
  const keycloakConfig = keycloakConfigs[institute];

  return betterAuth({
    baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/proxy/${institute}`,
    advanced: {
      cookiePrefix: `auth-${institute}`,
      // Sesión del navegador alineada con el tiempo de espera inactivo de Keycloak.
      defaultCookieOptions: {
        maxAge: SESSION_IDLE_TIMEOUT_SECONDS,
      },
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
    ],
  });
};
