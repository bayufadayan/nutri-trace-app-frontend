/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const ACCESS_TOKEN_MAXAGE = Number(process.env.ACCESS_TOKEN_MAXAGE ?? 86400);
const REFRESH_TOKEN_MAXAGE = Number(
  process.env.REFRESH_TOKEN_MAXAGE ?? 2592000
);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const r = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      const msg = (data as any)?.message || "Login gagal";
      return NextResponse.json({ message: msg }, { status: r.status });
    }

    const { user, accessToken, refreshToken } = data as {
      user: any;
      accessToken: string;
      refreshToken: string;
    };

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { message: "Token tidak ditemukan dari server" },
        { status: 502 }
      );
    }

    const res = NextResponse.json({ user });

    const isHttps =
      process.env.NODE_ENV === "production" ||
      (typeof process !== "undefined" && process.env.VERCEL === "1");
    const baseCookie = {
      path: "/",
      httpOnly: true as const,
      secure: isHttps,
      sameSite: "lax" as const,
    };

    res.cookies.set("access_token", accessToken, {
      ...baseCookie,
      maxAge: ACCESS_TOKEN_MAXAGE,
    });
    res.cookies.set("refresh_token", refreshToken, {
      ...baseCookie,
      maxAge: REFRESH_TOKEN_MAXAGE,
    });
    // role non-httpOnly
    res.cookies.set("role", String(user.role), {
      path: "/",
      httpOnly: false,
      secure: isHttps,
      sameSite: "lax",
      maxAge: ACCESS_TOKEN_MAXAGE,
    });

    return res;
  } catch {
    return NextResponse.json(
      { message: "Tidak dapat menghubungi server. Coba lagi." },
      { status: 500 }
    );
  }
}
