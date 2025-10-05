// app/api/auth/login/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL!;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json(data, { status: res.status });

  const token = data?.token || data?.accessToken || data?.jwt || ""; // adjust if needed
  const role = data?.user?.role || data?.role || ""; // backend should return user role

  const cookieStore = cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  // role cookie (for middleware guard). Not sensitive.
  cookieStore.set("role", role, { sameSite: "lax", path: "/" });

  return NextResponse.json({ ok: true, role });
}
