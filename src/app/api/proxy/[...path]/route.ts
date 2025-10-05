// src/app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

// Satu handler untuk semua method
async function handler(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params; // params itu Promise di Next 15
  const segments = Array.isArray(path) ? path.join("/") : "";
  // Build target URL (ikutkan querystring dari req)
  const target =
    `${API_URL}/${segments}`.replace(/\/+$/g, "") + (req.nextUrl.search || "");

  // --- Baca cookie (ASYNC) ---
  const c = await cookies(); // <- wajib await
  const token = c.get("token")?.value;

  // Siapkan headers untuk diteruskan
  const headers = new Headers(req.headers);
  headers.delete("host");
  // Set Authorization bila ada token dari cookie
  if (token) headers.set("authorization", `Bearer ${token}`);

  // Siapkan body selain GET/HEAD
  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const init: RequestInit = {
    method: req.method,
    headers,
    body,
    redirect: "manual",
  };

  // Forward ke backend
  const upstream = await fetch(target, init);

  // Siapkan response ke client (salin headers tapi buang hop-by-hop)
  const resHeaders = new Headers(upstream.headers);
  resHeaders.delete("content-encoding");
  resHeaders.delete("transfer-encoding");
  resHeaders.delete("connection");

  const data = await upstream.arrayBuffer();
  return new NextResponse(data, {
    status: upstream.status,
    headers: resHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
