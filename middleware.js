import { NextResponse } from "next/server";

export function middleware(request) {
  // All routes are public — no admin panel in this Shopify build
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
