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

type AuthInstance = ReturnType<typeof getAuthInstance>;

function getTargetPath(path?: string[]) {
  return path?.join("/") || "";
}

async function tryHandleBetterAuthRoute(req: NextRequest, auth: AuthInstance) {
  const betterAuthHandlers = toNextJsHandler(auth);
  const betterAuthHandler =
    betterAuthHandlers[req.method as keyof typeof betterAuthHandlers];

  if (!betterAuthHandler) {
    return null;
  }

  const betterAuthResponse = await betterAuthHandler(req.clone());

  if (betterAuthResponse.status !== 404) {
    return betterAuthResponse;
  }

  return null;
}

async function getSessionWithAccessToken(auth: AuthInstance) {
  const incomingHeaders = await NextHeaders();
  const sessionData = await auth.api.getSession({ headers: incomingHeaders });

  if (!sessionData?.session) {
    return null;
  }

  const keycloakAccessToken = await auth.api
    .getAccessToken({
      headers: incomingHeaders,
      body: { providerId: "keycloak" },
    })
    .then((tokens) => tokens?.accessToken)
    .catch(() => undefined);

  return {
    ...sessionData,
    session: {
      ...sessionData.session,
      token: keycloakAccessToken,
    },
  };
}

function buildResolvedApiEndpoint(req: NextRequest, targetPath: string) {
  const searchParams = req.nextUrl.searchParams.toString();

  return `${process.env.API_URL_BASE}/${targetPath}${searchParams ? `?${searchParams}` : ""}`;
}

function buildRequestHeaders(token?: string) {
  const requestHeaders: Record<string, string> = { "Content-Type": "application/json" };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  return requestHeaders;
}

async function proxyToApi(req: NextRequest, endpoint: string, token?: string) {
  const requestPromise = fetch(endpoint, {
    method: req.method,
    headers: buildRequestHeaders(token),
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

async function proxyHandler(req: NextRequest, { params }: RequestParams) {
  const { institute, path } = await params;

  const auth = getAuthInstance(institute);
  const betterAuthResponse = await tryHandleBetterAuthRoute(req, auth);
  if (betterAuthResponse) {
    return betterAuthResponse;
  }

  const session = await getSessionWithAccessToken(auth);
  const targetPath = getTargetPath(path);
  const resolvedApiEndpoint = buildResolvedApiEndpoint(req, targetPath);

  return proxyToApi(req, resolvedApiEndpoint, session?.session?.token);
}

export {
  proxyHandler as POST,
  proxyHandler as GET,
  proxyHandler as PUT,
  proxyHandler as DELETE,
  proxyHandler as PATCH,
  proxyHandler as OPTIONS,
};
