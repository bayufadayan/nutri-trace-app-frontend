/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import * as React from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import BatchStatusBadge from "./BatchStatusBadge"
import BatchEditDialog from "./BatchEditDialog"
import BatchQRCodeButton from "./BatchQRCodeButton"
import BatchDeleteButton from "./BatchDeleteButton"
import { toast } from "sonner"

export default function BatchesTable() {
    const [items, setItems] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)
    const [q, setQ] = React.useState("")

    const load = React.useCallback(async () => {
        setLoading(true)
        try {
            const r = await fetch("/api/batches", { cache: "no-store" })
            const data = await r.json().catch(() => ([]))
            setItems(Array.isArray(data) ? data : [])
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => { load() }, [load])

    React.useEffect(() => {
        const handler = () => load()
        window.addEventListener("batches:refresh", handler)
        return () => window.removeEventListener("batches:refresh", handler)
    }, [load])

    const filtered = React.useMemo(() => {
        const s = q.toLowerCase()
        return items.filter((b) =>
            [b.id, b.materialName, b.status].some((v: string) => String(v || "").toLowerCase().includes(s))
        )
    }, [items, q])

    async function del(id: string) {
        const r = await fetch(`/api/batches/${id}`, { method: "DELETE" })
        const data = await r.json().catch(() => ({}))
        if (!r.ok) return toast.error(data?.message || "Delete failed")
        toast.success("Batch deleted")
        load()
    }

    return (
        <Card className="p-0 overflow-auto">
            <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
                <Input placeholder="Search batches..." value={q} onChange={e => setQ(e.target.value)} className="h-9 max-w-xs" />
                <Button variant="outline" size="sm" onClick={load}><RefreshCcw className="h-4 w-4 mr-1" /> Refresh</Button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-muted/30">
                        <tr>
                            <th className="text-left p-2">Batch ID</th>
                            <th className="text-left p-2">Material</th>
                            <th className="text-left p-2">Weight (kg)</th>
                            <th className="text-left p-2">Status</th>
                            <th className="text-left p-2">Created</th>
                            <th className="text-left p-2 w-[260px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td className="p-4 text-muted-foreground" colSpan={6}>Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td className="p-4 text-muted-foreground" colSpan={6}>No batches</td></tr>
                        ) : (
                            filtered.map((b: any) => (
                                <tr key={b.id} className="border-t">
                                    <td className="p-2 font-mono text-xs">{b.id}</td>
                                    <td className="p-2">{b.materialName}</td>
                                    <td className="p-2">{b.weight}</td>
                                    <td className="p-2"><BatchStatusBadge status={b.status} /></td>
                                    <td className="p-2">{new Date(b.createdAt).toLocaleString()}</td>
                                    <td className="p-2">
                                        <div className="flex flex-wrap gap-2">
                                            <BatchQRCodeButton qrPath={b.qrCode} id={b.id} />
                                            <BatchEditDialog batch={b} onUpdated={load} />
                                            <BatchDeleteButton id={b.id} name={b.materialName} onDeleted={load} />
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
