/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import * as React from "react"
import { Card } from "@/components/ui/card"
import UserRoleBadge from "./UserRoleBadge"
import UserEditDialog from "./UserEditDialog"
import UserDeleteButton from "./UserDeleteButton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

export default function UsersTable() {
    const [users, setUsers] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)
    const [q, setQ] = React.useState("")

    const load = React.useCallback(async () => {
        setLoading(true)
        try {
            const r = await fetch("/api/users", { cache: "no-store" })
            const data = await r.json().catch(() => ([]))
            setUsers(Array.isArray(data) ? data : [])
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => { load() }, [load])

    // allow external refresh from create form
    React.useEffect(() => {
        const handler = () => load()
        window.addEventListener("users:refresh", handler)
        return () => window.removeEventListener("users:refresh", handler)
    }, [load])

    const filtered = React.useMemo(() => {
        const s = q.toLowerCase()
        return users.filter((u) =>
            [u.name, u.email, u.role].some((v: string) => String(v || "").toLowerCase().includes(s))
        )
    }, [users, q])

    return (
        <Card className="p-0 overflow-auto">
            <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
                <Input placeholder="Search users..." value={q} onChange={e => setQ(e.target.value)} className="h-9 max-w-xs" />
                <Button variant="outline" size="sm" onClick={load}>
                    <RefreshCcw className="h-4 w-4 mr-1" /> Refresh
                </Button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-muted/30">
                        <tr>
                            <th className="text-left p-2">Name</th>
                            <th className="text-left p-2">Email</th>
                            <th className="text-left p-2">Role</th>
                            <th className="text-left p-2">Created</th>
                            <th className="text-left p-2 w-44">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td className="p-4 text-muted-foreground" colSpan={5}>Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td className="p-4 text-muted-foreground" colSpan={5}>No users</td></tr>
                        ) : (
                            filtered.map((u: any) => (
                                <tr key={u.id} className="border-t">
                                    <td className="p-2">{u.name}</td>
                                    <td className="p-2">{u.email}</td>
                                    <td className="p-2"><UserRoleBadge role={u.role} /></td>
                                    <td className="p-2">{new Date(u.createdAt).toLocaleString()}</td>
                                    <td className="p-2">
                                        <div className="flex gap-2">
                                            <UserEditDialog user={u} onUpdated={load} />
                                            <UserDeleteButton id={u.id} onDeleted={load} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}
