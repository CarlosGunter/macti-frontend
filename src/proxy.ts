import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { getAuthInstance } from "@/shared/lib/auth-factory";

function getInstituteFromPath(pathname: string) {
  return pathname.split("/").filter(Boolean)[0];
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const institute = getInstituteFromPath(pathname);
  if (!institute) {
    return NextResponse.next();
  }

  const auth = getAuthInstance(institute);
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    return NextResponse.next();
  }

  const callbackURL = encodeURIComponent(`${pathname}${search}`);
  const loginUrl = new URL(
    `/api/proxy/${institute}/keycloak/login?callbackURL=${callbackURL}`,
    request.url,
  );

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/:institute/perfil", "/:institute/:courseId/solicitudes"],
};
