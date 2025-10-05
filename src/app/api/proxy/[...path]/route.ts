// app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL!; // e.g. http://localhost:5000/api

async function handle(req: NextRequest) {
  const segments = req.nextUrl.pathname.split("/api/proxy/")[1] || "";
  const target = `${API_URL}/${segments}`.replace(/\/+$/g, "");

  const token = cookies().get("token")?.value;

  const init: RequestInit = {
    method: req.method,
    headers: {
      "Content-Type": req.headers.get("content-type") || "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text(),
  };

  const res = await fetch(target, init);
  const data = await res.arrayBuffer();

  // Mirror status & headers as needed
  const out = new NextResponse(data, { status: res.status });
  res.headers.forEach((v, k) => {
    if (k.toLowerCase() === "content-type") out.headers.set(k, v);
  });
  return out;
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
