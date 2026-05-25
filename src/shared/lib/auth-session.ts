import type { InstitutesType } from "../config/institutes";
import { keycloakConfigs } from "../config/kcConfig";
import type { getAuthClient } from "./auth-client";

type AuthClient = ReturnType<typeof getAuthClient>;

function buildKeycloakLogoutUrl(institute: InstitutesType, redirectUri: string) {
  const issuer = keycloakConfigs[institute]?.issuer;

  if (!issuer?.trim()) {
    return null;
  }

  try {
    const logoutEndpoint = issuer.endsWith("/")
      ? `${issuer}protocol/openid-connect/logout`
      : `${issuer}/protocol/openid-connect/logout`;
    const logoutUrl = new URL(logoutEndpoint);

    logoutUrl.searchParams.set("redirect_uri", redirectUri);

    return logoutUrl.toString();
  } catch {
    return null;
  }
}

export async function signOutFederatedSession({
  authClient,
  institute,
  redirectPath = `/${institute}`,
}: {
  authClient: AuthClient;
  institute: InstitutesType;
  redirectPath?: string;
}) {
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}${redirectPath}`;

  await authClient.signOut();

  const keycloakLogoutUrl = buildKeycloakLogoutUrl(institute, redirectUri);

  if (keycloakLogoutUrl) {
    window.location.assign(keycloakLogoutUrl);
    return;
  }

  window.location.assign(redirectPath);
}
