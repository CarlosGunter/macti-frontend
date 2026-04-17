import { toNextJsHandler } from "better-auth/next-js";
import { headers as NextHeaders } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import type { InstitutesType } from "@/shared/config/institutes";
import { getAuthInstance } from "@/shared/lib/auth-factory";
import { tryCatch } from "@/shared/utils/try-catch";

interface RequestParams {
  params: Promise<{
    institute: InstitutesType;
    path?: string[];
  }>;
}

async function proxyHandler(req: NextRequest, { params }: RequestParams) {
  const { institute, path } = await params;

  const auth = getAuthInstance(institute);
  const betterAuthHandlers = toNextJsHandler(auth);

  const betterAuthHandler =
    betterAuthHandlers[req.method as keyof typeof betterAuthHandlers];

  if (betterAuthHandler) {
    const betterAuthResponse = await betterAuthHandler(req.clone());

    // Better Auth responde 404 cuando la ruta no pertenece a su router.
    if (betterAuthResponse.status !== 404) {
      return betterAuthResponse;
    }
  }

  const incomingHeaders = await NextHeaders();
  const sessionData = await auth.api.getSession({ headers: incomingHeaders });
  const keycloakAccessToken = sessionData?.session
    ? await auth.api
        .getAccessToken({
          headers: incomingHeaders,
          body: { providerId: "keycloak" },
        })
        .then((tokens) => tokens?.accessToken)
        .catch(() => undefined)
    : undefined;

  const session = sessionData
    ? {
        ...sessionData,
        session: {
          ...sessionData.session,
          token: keycloakAccessToken,
        },
      }
    : null;

  const targetPath = path?.join("/") || "";
  const searchParams = req.nextUrl.searchParams.toString();
  const resolvedApiEndpoint =
    process.env.API_URL_BASE +
    "/" +
    targetPath +
    (searchParams ? `?${searchParams}` : "");

  const requestHeaders: Record<string, string> = { "Content-Type": "application/json" };
  if (session?.session?.token) {
    requestHeaders.Authorization = `Bearer ${session.session.token}`;
  }

  const requestPromise = fetch(resolvedApiEndpoint, {
    method: req.method,
    headers: requestHeaders,
    body: req.method !== "GET" ? await req.text() : undefined,
  });

  const response = await tryCatch(requestPromise);
  if (response.error) {
    return NextResponse.json(
      { error: "Error al obtener datos de la API" },
      { status: 500 },
    );
  }

  const responseData = await tryCatch(response.data.json());
  if (responseData.error) {
    return NextResponse.json(
      { error: "Error al analizar la respuesta de la API" },
      { status: 500 },
    );
  }

  return NextResponse.json(responseData.data, { status: response.data.status });
}

export {
  proxyHandler as POST,
  proxyHandler as GET,
  proxyHandler as PUT,
  proxyHandler as DELETE,
  proxyHandler as PATCH,
  proxyHandler as OPTIONS,
};
