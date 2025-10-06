import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_BASE = process.env.API_BASE!

function buildHeaders(token?: string, ct?: string) {
    const h = new Headers()
    if (ct) h.set("Content-Type", ct)
    if (token) h.set("Authorization", `Bearer ${token}`)
    return h
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        const token = (await cookies()).get("access_token")?.value
        const r = await fetch(`${API_BASE}/api/distributions/${id}`, {
            headers: buildHeaders(token),
            cache: "no-store",
        })
        const data = await r.json().catch(() => ({}))
        if (!r.ok) return NextResponse.json(data, { status: r.status })
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ message: "Failed to fetch shipment" }, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        const token = (await cookies()).get("access_token")?.value
        const body = await req.json() // boleh update batchId/driverName/truckId/from/to/sentAt/receivedAt/status
        const r = await fetch(`${API_BASE}/api/distributions/${id}`, {
            method: "PUT",
            headers: buildHeaders(token, "application/json"),
            body: JSON.stringify(body),
            cache: "no-store",
        })
        const data = await r.json().catch(() => ({}))
        if (!r.ok) return NextResponse.json(data, { status: r.status })
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ message: "Failed to update shipment" }, { status: 500 })
    }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        const token = (await cookies()).get("access_token")?.value
        const r = await fetch(`${API_BASE}/api/distributions/${id}`, {
            method: "DELETE",
            headers: buildHeaders(token),
            cache: "no-store",
        })
        const data = await r.json().catch(() => ({}))
        if (!r.ok) return NextResponse.json(data, { status: r.status })
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ message: "Failed to delete shipment" }, { status: 500 })
    }
}
