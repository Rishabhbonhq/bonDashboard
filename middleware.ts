import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    (pathname === "/login" || pathname === "/register") &&
    request.headers.has("authorization")
  )
    return NextResponse.redirect(new URL("/", request.url));

  if (
    (pathname === "/" || pathname === "/deals" || pathname === "/categories") &&
    !request.headers.has("authorization")
  )
    return NextResponse.redirect(new URL("/login", request.url));

  return NextResponse.next();
}

export const config = {
  //matcher: ["/", "/accounts", "/login", "/register"],
  matcher: [],
};
