import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE!;

function headers(token?: string, ct?: string) {
    const h = new Headers();
    if (ct) h.set("Content-Type", ct);
    if (token) h.set("Authorization", `Bearer ${token}`);
    return h;
}

export async function GET() {
    try {
        const token = (await cookies()).get("access_token")?.value;
        const r = await fetch(`${API_BASE}/api/batches`, {
            headers: headers(token),
            cache: "no-store",
        });
        const data = await r.json().catch(() => []);
        if (!r.ok) return NextResponse.json(data, { status: r.status });
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { message: "Failed to fetch batches" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const token = (await cookies()).get("access_token")?.value;
        const body = await req.json(); // { materialName, weight, status }
        const r = await fetch(`${API_BASE}/api/batches`, {
            method: "POST",
            headers: headers(token, "application/json"),
            body: JSON.stringify(body),
            cache: "no-store",
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) return NextResponse.json(data, { status: r.status });
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { message: "Failed to create batch" },
            { status: 500 }
        );
    }
}
