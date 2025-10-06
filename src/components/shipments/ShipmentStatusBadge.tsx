"use client"
import { Badge } from "@/components/ui/badge"

export type ShipmentStatus = "IN_TRANSIT" | "RECEIVED" | "DELIVERED" | string

export default function ShipmentStatusBadge({ status }: { status: ShipmentStatus }) {
    const s = String(status)
    const map: Record<string, string> = {
        IN_TRANSIT: "bg-amber-500 text-white",
        RECEIVED: "bg-emerald-600 text-white",
        DELIVERED: "bg-emerald-600 text-white",
    }
    return <Badge className={map[s] || "bg-neutral-700 text-white"}>{s}</Badge>
}
