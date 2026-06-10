import { NextResponse } from "next/server";
import type { InstitutesType } from "@/shared/config/institutes";

interface KeycloakRouteProps {
  params: Promise<{
    institute: InstitutesType;
  }>;
}

const AUTH_ENDPOINT_PATH = "sign-in/oauth2";
const PROVIDER_ID = "keycloak";

export async function GET(req: Request, { params }: KeycloakRouteProps) {
  const { institute } = await params;
  const url = new URL(req.url);
  const callbackURL = url.searchParams.get("callbackURL") ?? `/${institute}/perfil`;
  const appOrigin = process.env.NEXT_PUBLIC_APP_URL || url.origin;
  const action = new URL(`/api/proxy/${institute}/${AUTH_ENDPOINT_PATH}`, appOrigin);

  const response = await fetch(action, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: appOrigin,
      cookie: req.headers.get("cookie") ?? "",
    },
    body: JSON.stringify({
      providerId: PROVIDER_ID,
      callbackURL,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    return NextResponse.json(
      {
        error: "Error al iniciar sesión con Keycloak",
        details: errorBody,
      },
      { status: response.status },
    );
  }

  const responseData = (await response.json()) as {
    url?: string;
    redirect?: boolean;
  };

  if (!responseData.url) {
    return NextResponse.json(
      { error: "Better Auth no devolvió una URL de redirección" },
      { status: 500 },
    );
  }

  const redirectResponse = NextResponse.redirect(responseData.url);
  const setCookies =
    (response.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.() ??
    [];

  for (const setCookie of setCookies) {
    redirectResponse.headers.append("set-cookie", setCookie);
  }

  return redirectResponse;
}
