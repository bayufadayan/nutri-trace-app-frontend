import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_BASE = process.env.API_BASE!

function buildHeaders(token?: string, ct?: string) {
    const h = new Headers()
    if (ct) h.set("Content-Type", ct)
    if (token) h.set("Authorization", `Bearer ${token}`)
    return h
}

export async function GET() {
    try {
        const token = (await cookies()).get("access_token")?.value
        const r = await fetch(`${API_BASE}/api/nutritions`, {
            headers: buildHeaders(token),
            cache: "no-store",
        })
        const data = await r.json().catch(() => ([]))
        if (!r.ok) return NextResponse.json(data, { status: r.status })
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ message: "Failed to fetch nutritions" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const token = (await cookies()).get("access_token")?.value
        const body = await req.json() // { calories, protein, fat, carbs, vitamins }
        // normalisasi angka
        const payload = {
            calories: Number(body.calories),
            protein: Number(body.protein),
            fat: Number(body.fat),
            carbs: Number(body.carbs),
            vitamins: String(body.vitamins ?? "").trim(),
        }
        const r = await fetch(`${API_BASE}/api/nutritions`, {
            method: "POST",
            headers: buildHeaders(token, "application/json"),
            body: JSON.stringify(payload),
            cache: "no-store",
        })
        const data = await r.json().catch(() => ({}))
        if (!r.ok) return NextResponse.json(data, { status: r.status })
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ message: "Failed to create nutrition" }, { status: 500 })
    }
}
