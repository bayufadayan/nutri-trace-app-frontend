import { NextRequest, NextResponse } from "next/server";

const GUARDS: Record<string, Array<string>> = {
  "/admin": ["SUPERADMIN"],
  "/producer": ["PRODUCER"],
  "/distributor": ["DISTRIBUTOR"],
  "/nutritionist": ["NUTRITIONIST"],
};

const HOME_BY_ROLE: Record<string, string> = {
  SUPERADMIN: "/admin",
  PRODUCER: "/producer",
  DISTRIBUTOR: "/distributor",
  NUTRITIONIST: "/nutritionist",
};

function getRole(req: NextRequest): string | null {
  return req.cookies.get("role")?.value ?? null;
}

function isAllowed(pathname: string, role: string): boolean {
  if (role === "SUPERADMIN") return true;
  for (const prefix in GUARDS) {
    if (pathname.startsWith(prefix)) {
      return GUARDS[prefix].includes(role);
    }
  }
  return true;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const role = getRole(req);

  for (const prefix in GUARDS) {
    if (pathname.startsWith(prefix)) {
      if (!role) {
        const url = new URL("/auth/login", req.url);
        url.searchParams.set("next", pathname + (search || ""));
        return NextResponse.redirect(url);
      }
      if (!isAllowed(pathname, role)) {
        const home = HOME_BY_ROLE[role] ?? "/";
        return NextResponse.redirect(new URL(home, req.url));
      }
      // allowed → lanjut
      return NextResponse.next();
    }
  }
  
  if (pathname.startsWith("/auth/login") && role) {
    const url = new URL(req.url);
    const nextParam = url.searchParams.get("next");
    if (nextParam) {
      if (role === "SUPERADMIN" || isAllowed(nextParam, role)) {
        return NextResponse.redirect(new URL(nextParam, req.url));
      }
    }
    const home = HOME_BY_ROLE[role] ?? "/";
    return NextResponse.redirect(new URL(home, req.url));
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
