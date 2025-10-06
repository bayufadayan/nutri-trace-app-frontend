"use client"
import { Badge } from "@/components/ui/badge"

export type BatchStatus = "PENDING" | "DELIVERED" | "REJECTED"

export default function BatchStatusBadge({ status }: { status: BatchStatus | string }) {
    const s = String(status)
    const map: Record<string, string> = {
        PENDING: "bg-amber-500 text-white",
        DELIVERED: "bg-emerald-600 text-white",
        REJECTED: "bg-red-600 text-white",
    }
    return <Badge className={map[s] || "bg-neutral-700 text-white"}>{s}</Badge>
}
