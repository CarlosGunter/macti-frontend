import { betterAuth } from "better-auth";
import { genericOAuth, keycloak } from "better-auth/plugins";
import type { InstitutesType } from "../config/institutes";
import { keycloakConfigs } from "../config/kcConfig";

export const getAuthInstance = (institute: InstitutesType) => {
  const keycloakConfig = keycloakConfigs[institute];

  return betterAuth({
    advanced: { cookiePrefix: `auth-${institute}` },
    baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/proxy/${institute}`,
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
