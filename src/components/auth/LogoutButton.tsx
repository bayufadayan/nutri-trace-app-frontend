// src/components/auth/LogoutButton.tsx
"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import * as React from "react"

export default function LogoutButton({ className }: { className?: string }) {
    const router = useRouter()
    const [loading, setLoading] = React.useState(false)

    async function doLogout() {
        setLoading(true)
        try {
            await fetch("/api/auth/logout", { method: "POST" })
        } catch {
            // abaikan error API kecil
        } finally {
            setLoading(false)
            router.push("/auth/login?msg=Anda%20telah%20logout")
        }
    }

    return (
        <Button
            variant="outline"
            onClick={doLogout}
            disabled={loading}
            className={className}
        >
            <LogOut className="mr-2 h-4 w-4" />
            {loading ? "Keluar..." : "Keluar"}
        </Button>
    )
}
