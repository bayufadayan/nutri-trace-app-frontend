import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE!;

function buildHeaders(token?: string, contentType?: string) {
    const h = new Headers();
    if (contentType) h.set("Content-Type", contentType);
    if (token) h.set("Authorization", `Bearer ${token}`);
    return h;
}

export async function GET() {
    try {
        const token = (await cookies()).get("access_token")?.value;
        const r = await fetch(`${API_BASE}/api/users`, {
            headers: buildHeaders(token),
            cache: "no-store",
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) return NextResponse.json(data, { status: r.status });
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { message: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const token = (await cookies()).get("access_token")?.value;
        const r = await fetch(`${API_BASE}/api/register`, {
            method: "POST",
            headers: buildHeaders(token, "application/json"),
            body: JSON.stringify(body),
            cache: "no-store",
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) return NextResponse.json(data, { status: r.status });
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { message: "Failed to create user" },
            { status: 500 }
        );
    }
}
