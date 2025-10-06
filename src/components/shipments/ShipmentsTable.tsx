/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import * as React from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import ShipmentStatusBadge from "./ShipmentStatusBadge"
import ShipmentEditDialog from "./ShipmentEditDialog"
import ShipmentDeleteButton from "./ShipmentDeleteButton"

export default function ShipmentsTable() {
    const [items, setItems] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)
    const [q, setQ] = React.useState("")

    const load = React.useCallback(async () => {
        setLoading(true)
        try {
            const r = await fetch("/api/shipments", { cache: "no-store" })
            const data = await r.json().catch(() => ([]))
            setItems(Array.isArray(data) ? data : [])
        } finally { setLoading(false) }
    }, [])

    React.useEffect(() => { load() }, [load])

    React.useEffect(() => {
        const h = () => load()
        window.addEventListener("shipments:refresh", h)
        return () => window.removeEventListener("shipments:refresh", h)
    }, [load])

    const filtered = React.useMemo(() => {
        const s = q.toLowerCase()
        return items.filter((d) =>
            [d.id, d.batchId, d.driverName, d.truckId, d.fromLocation, d.toLocation, d.status]
                .some((v: string) => String(v || "").toLowerCase().includes(s))
        )
    }, [items, q])

    return (
        <Card className="p-0 overflow-auto">
            <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
                <Input placeholder="Search shipments..." value={q} onChange={e => setQ(e.target.value)} className="h-9 max-w-xs" />
                <Button variant="outline" size="sm" onClick={load}><RefreshCcw className="h-4 w-4 mr-1" /> Refresh</Button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-muted/30">
                        <tr>
                            <th className="text-left p-2">ID</th>
                            <th className="text-left p-2">Batch</th>
                            <th className="text-left p-2">Driver</th>
                            <th className="text-left p-2">Truck</th>
                            <th className="text-left p-2">Route</th>
                            <th className="text-left p-2">Sent</th>
                            <th className="text-left p-2">Received</th>
                            <th className="text-left p-2">Status</th>
                            <th className="text-left p-2 w-[260px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td className="p-4 text-muted-foreground" colSpan={9}>Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td className="p-4 text-muted-foreground" colSpan={9}>No shipments</td></tr>
                        ) : filtered.map(d => (
                            <tr key={d.id} className="border-t">
                                <td className="p-2 font-mono text-xs">{d.id}</td>
                                <td className="p-2 font-mono text-xs">{d.batchId}</td>
                                <td className="p-2">{d.driverName}</td>
                                <td className="p-2">{d.truckId}</td>
                                <td className="p-2">{d.fromLocation} → {d.toLocation}</td>
                                <td className="p-2">{d.sentAt ? new Date(d.sentAt).toLocaleString() : "—"}</td>
                                <td className="p-2">{d.receivedAt ? new Date(d.receivedAt).toLocaleString() : "—"}</td>
                                <td className="p-2"><ShipmentStatusBadge status={d.status} /></td>
                                <td className="p-2">
                                    <div className="flex flex-wrap gap-2">
                                        <ShipmentEditDialog shipment={d} onUpdated={load} />
                                        <ShipmentDeleteButton id={d.id} onDeleted={load} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}
