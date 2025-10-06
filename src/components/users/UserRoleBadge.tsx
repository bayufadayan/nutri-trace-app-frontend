"use client"
import { Badge } from "@/components/ui/badge"
import { Role } from "./role"

export default function UserRoleBadge({ role }: { role: Role | string }) {
    const map: Record<string, string> = {
        SUPERADMIN: "bg-black text-white",
        PRODUCER: "bg-[oklch(var(--brand-primary))] text-white",
        DISTRIBUTOR: "bg-blue-600 text-white",
        NUTRITIONIST: "bg-emerald-600 text-white",
    }
    return <Badge className={map[String(role)] || "bg-neutral-700 text-white"}>{String(role)}</Badge>
}
