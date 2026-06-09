import type { InstitutesType } from "../config/institutes";
import { keycloakConfigs } from "../config/kcConfig";
import type { getAuthClient } from "./auth-client";

type AuthClient = ReturnType<typeof getAuthClient>;

interface SignOutFederatedSessionParams {
  authClient: AuthClient;
  institute: InstitutesType;
  redirectPath?: string;
}

export async function signOutFederatedSession({
  authClient,
  institute,
  redirectPath = `/${institute}`,
}: SignOutFederatedSessionParams) {
  await authClient.signOut();

  const kcIssuer = keycloakConfigs[institute]?.issuer;
  if (!kcIssuer) window.location.assign(redirectPath);

  const logoutUrl = new URL(`${kcIssuer}/protocol/openid-connect/logout`);
  logoutUrl.searchParams.set(
    "post_logout_redirect_uri",
    `${window.location.origin}${redirectPath}`,
  );
  logoutUrl.searchParams.set(
    "client_id",
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "local-next-login",
  );

  window.location.assign(logoutUrl.toString());
}
