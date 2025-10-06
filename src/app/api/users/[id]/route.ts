import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE!;

function buildHeaders(token?: string, contentType?: string) {
  const h = new Headers();
  if (contentType) h.set("Content-Type", contentType);
  if (token) h.set("Authorization", `Bearer ${token}`);
  return h;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = (await cookies()).get("access_token")?.value;
    const r = await fetch(`${API_BASE}/api/users/${params.id}`, {
      headers: buildHeaders(token),
      cache: "no-store",
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return NextResponse.json(data, { status: r.status });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = (await cookies()).get("access_token")?.value;
    const body = await req.json();
    const r = await fetch(`${API_BASE}/api/users/${params.id}`, {
      method: "PUT",
      headers: buildHeaders(token, "application/json"),
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return NextResponse.json(data, { status: r.status });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = (await cookies()).get("access_token")?.value;
    const r = await fetch(`${API_BASE}/api/users/${params.id}`, {
      method: "DELETE",
      headers: buildHeaders(token),
      cache: "no-store",
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return NextResponse.json(data, { status: r.status });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
