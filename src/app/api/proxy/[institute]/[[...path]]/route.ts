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

export async function GET(req: NextRequest, { params }: RequestParams) {
  return await proxyHandler(req, params);
}

export async function POST(req: NextRequest, { params }: RequestParams) {
  return await proxyHandler(req, params);
}

async function proxyHandler(req: NextRequest, params: RequestParams["params"]) {
  const { institute, path } = await params;

  const auth = getAuthInstance(institute);
  const targetPath = path?.join("/") || "";
  const incomingHeaders = await NextHeaders();

  // Si es ruta de auth → delegar a Better Auth
  if (
    targetPath.startsWith("sign-in") ||
    targetPath.startsWith("sign-out") ||
    targetPath.startsWith("session") ||
    targetPath.startsWith("oauth2") ||
    targetPath.startsWith("callback") ||
    targetPath.startsWith("get-session")
  ) {
    return auth.handler(req);
  }

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
