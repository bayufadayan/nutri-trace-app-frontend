// app/api/auth/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const c = cookies();
  c.delete("token");
  c.delete("role");
  return NextResponse.json({ ok: true });
}
