// src/components/dashboard/DashboardShell.tsx
import { cookies } from "next/headers"
import { AppSidebar } from "./AppSidebar"
import Topbar from "./Topbar"
import { menuForRole, type Role } from "@/config/nav"
import { ReactNode } from "react"

export default async function DashboardShell({ children }: { children: ReactNode }) {
    const role = (await cookies()).get("role")?.value as Role | undefined
    const items = menuForRole(role ?? null) // <- pure data (serializable)

    return (
        <div className="min-h-svh bg-background">
            <Topbar role={role} />
            <div className="container mx-auto px-4">
                <div className="flex gap-4 py-4">
                    <AppSidebar items={items} />
                    <main className="flex-1">{children}</main>
                </div>
            </div>
        </div>
    )
}
