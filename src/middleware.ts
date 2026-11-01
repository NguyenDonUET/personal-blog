import { getIronSession } from "iron-session";
import { NextResponse, type NextRequest } from "next/server";
import { sessionOptions, type SessionData } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";
  const response = NextResponse.next();

  const session = await getIronSession<SessionData>(
    request,
    response,
    sessionOptions,
  );

  if (isLoginRoute) {
    if (session.isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return response;
  }

  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
