// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // buat response dulu
  const res = NextResponse.json({ ok: true });

  // hapus cookie dgn set maxAge: 0 (cara paling kompatibel)
  res.cookies.set("token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  res.cookies.set("role", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return res;
}
