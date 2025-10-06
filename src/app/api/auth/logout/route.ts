import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  res.cookies.set("access_token", "", { path: "/", httpOnly: true, maxAge: 0 });
  res.cookies.set("refresh_token", "", {
    path: "/",
    httpOnly: true,
    maxAge: 0,
  });
  res.cookies.set("role", "", { path: "/", httpOnly: false, maxAge: 0 });

  return res;
}
