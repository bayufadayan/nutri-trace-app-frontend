/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE!;
const headers = (t?: string, ct?: string) => {
    const h = new Headers();
    if (ct) h.set("Content-Type", ct);
    if (t) h.set("Authorization", `Bearer ${t}`);
    return h;
};

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const token = (await cookies()).get("access_token")?.value;
        const r = await fetch(`${API_BASE}/api/batches/${params.id}`, {
            headers: headers(token),
            cache: "no-store",
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) return NextResponse.json(data, { status: r.status });
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { message: "Failed to fetch batch" },
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

        const payload: any = {};
        if (typeof body.materialName === "string" && body.materialName.trim()) {
            payload.materialName = body.materialName.trim();
        }
        if (
            typeof body.weight !== "undefined" &&
            body.weight !== null &&
            body.weight !== ""
        ) {
            const w = Number(body.weight);
            if (!Number.isNaN(w)) payload.weight = w;
        }
        if (typeof body.status === "string" && body.status) {
            payload.status = body.status;
        }

        const r = await fetch(`${API_BASE}/api/batches/${params.id}`, {
            method: "PUT",
            headers: headers(token, "application/json"),
            body: JSON.stringify(payload),
            cache: "no-store",
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) return NextResponse.json(data, { status: r.status });
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { message: "Failed to update batch" },
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
        const r = await fetch(`${API_BASE}/api/batches/${params.id}`, {
            method: "DELETE",
            headers: headers(token),
            cache: "no-store",
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) return NextResponse.json(data, { status: r.status });
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { message: "Failed to delete batch" },
            { status: 500 }
        );
    }
}
