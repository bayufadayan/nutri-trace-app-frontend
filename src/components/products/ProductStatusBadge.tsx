// src/components/products/ProductStatusBadge.tsx
"use client"
import { Badge } from "@/components/ui/badge"

type S = "PENDING" | "NEED_APPROVAL" | "READY_FOR_DISTRIBUTION" | "DISTRIBUTED" | string
export default function ProductStatusBadge({ status }: { status: S }) {
    const map: Record<string, string> = {
        PENDING: "bg-amber-500 text-white",
        NEED_APPROVAL: "bg-blue-600 text-white",
        READY_FOR_DISTRIBUTION: "bg-emerald-600 text-white",
        DISTRIBUTED: "bg-emerald-700 text-white",
    }
    return <Badge className={map[status] || "bg-neutral-700 text-white"}>{status}</Badge>
}
