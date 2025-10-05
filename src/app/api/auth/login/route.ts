/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

// (opsional) URL API backend dari .env.local
const API_URL = process.env.API_URL ?? "http://localhost:4000";

type LoginPayload = { email: string; password: string };
type LoginResponse = { token: string };

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Return: { success, message? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginPayload;

    // --- panggil backend auth kamu ---
    const r = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!r.ok) {
      const text = await r.text().catch(() => "");
      return NextResponse.json(
        { success: false, message: text || "Login failed" },
        { status: r.status }
      );
    }

    const data = (await r.json()) as LoginResponse;
    const token = data.token;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token returned" },
        { status: 500 }
      );
    }

    // --- bikin response & set cookie DI SINI ---
    const res = NextResponse.json({ success: true });

    // set cookie aman untuk prod
    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Unexpected error" },
      { status: 500 }
    );
  }
}
