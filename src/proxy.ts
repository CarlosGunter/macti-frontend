import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { getAuthInstance } from "@/infra/auth/auth-factory";

export async function proxy(request: NextRequest) {
  const institute = getInstituteFromPath(request.nextUrl.pathname);
  if (!institute) return NextResponse.next();

  const auth = getAuthInstance(institute);
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) return NextResponse.next();

  const loginUrl = buildRedirectURL(institute, request);
  return NextResponse.redirect(loginUrl);
}

function getInstituteFromPath(pathname: string) {
  const [institute] = pathname.split("/").filter(Boolean);
  return institute;
}

function buildRedirectURL(institute: string, request: NextRequest) {
  const callbackURL = encodeURIComponent(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  const redirectUrl = new URL(
    `/api/proxy/${institute}/keycloak/login?callbackURL=${callbackURL}`,
    request.nextUrl.origin,
  );

  return redirectUrl;
}

export const config = {
  matcher: ["/:institute/perfil", "/:institute/:courseId/solicitudes"],
};
