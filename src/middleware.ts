import { NextRequest, NextResponse } from "next/server";

const GUARDS: Record<string, Array<string>> = {
  "/admin": ["SUPERADMIN"],
  "/producer": ["PRODUCER"],
  "/distributor": ["DISTRIBUTOR"],
  "/nutritionist": ["NUTRITIONIST"],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = req.cookies.get("role")?.value; // set at login

  for (const prefix in GUARDS) {
    if (pathname.startsWith(prefix)) {
      if (!role) {
        const url = new URL("/auth/login", req.url);
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
      }
      if (!GUARDS[prefix].includes(role))
        return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (pathname.startsWith("/auth/login") && role) {
    const target = ("/" + role.toLowerCase()).replace("superadmin", "admin");
    return NextResponse.redirect(new URL(target, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/producer/:path*",
    "/distributor/:path*",
    "/nutritionist/:path*",
    "/auth/login",
  ],
};
