import { type NextRequest, NextResponse } from "next/server";

function getInstituteFromPath(pathname: string) {
  return pathname.split("/").filter(Boolean)[0];
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const institute = getInstituteFromPath(pathname);
  if (!institute) {
    return NextResponse.next();
  }

  const sessionUrl = new URL(`/api/proxy/${institute}/get-session`, request.url);

  const sessionResponse = await fetch(sessionUrl, {
    method: "GET",
    headers: {
      cookie: request.headers.get("cookie") ?? "",
      origin: request.nextUrl.origin,
    },
  });

  if (sessionResponse.ok) {
    const sessionData = (await sessionResponse.json()) as {
      session?: unknown;
      user?: unknown;
    } | null;

    if (sessionData?.session && sessionData?.user) {
      return NextResponse.next();
    }
  }

  const callbackURL = encodeURIComponent(`${pathname}${search}`);
  const loginUrl = new URL(
    `/api/proxy/${institute}/keycloak?callbackURL=${callbackURL}`,
    request.url,
  );

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/:institute/perfil", "/:institute/:courseId/solicitudes"],
};
