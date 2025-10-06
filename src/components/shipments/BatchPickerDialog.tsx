/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BatchStatusBadge from "../batches/BatchStatusBadge"

type Batch = {
    id: string
    producerId: string
    materialName: string
    weight: number
    createdAt: string
    status: string
}

async function fetchProducerMap(batches: Batch) {
    // single item overload
    const r = await fetch(`/api/users/${batches.producerId}`)
    const u = await r.json().catch(() => ({}))
    return { [batches.producerId]: u?.name || batches.producerId }
}

export default function BatchPickerDialog({
    onPick,
    trigger,
}: {
    onPick: (batch: Batch & { producerName?: string }) => void
    trigger?: React.ReactNode
}) {
    const [open, setOpen] = React.useState(false)
    const [items, setItems] = React.useState<Batch[]>([])
    const [producers, setProducers] = React.useState<Record<string, string>>({})
    const [q, setQ] = React.useState("")

    React.useEffect(() => {
        if (!open) return
            ; (async () => {
                const r = await fetch("/api/batches", { cache: "no-store" })
                const data = await r.json().catch(() => ([]))
                const list: Batch[] = Array.isArray(data) ? data : []
                setItems(list)

                // build unique producer map (parallel)
                const unique = [...new Set(list.map(b => b.producerId))]
                const entries = await Promise.all(
                    unique.map(async (pid) => {
                        try {
                            const resp = await fetch(`/api/users/${pid}`)
                            const u = await resp.json().catch(() => ({}))
                            return [pid, u?.name || pid] as const
                        } catch { return [pid, pid] as const }
                    })
                )
                setProducers(Object.fromEntries(entries))
            })()
    }, [open])

    const filtered = React.useMemo(() => {
        const s = q.toLowerCase()
        return items.filter(b =>
            [b.id, b.materialName, b.status, producers[b.producerId]].some(v => String(v || "").toLowerCase().includes(s))
        )
    }, [items, q, producers])

    function choose(b: Batch) {
        onPick({ ...b, producerName: producers[b.producerId] })
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger ?? <Button variant="outline">Pilih Batch</Button>}</DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader><DialogTitle>Pilih Batch</DialogTitle></DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                    <Input placeholder="Cari batch / producer / status..." value={q} onChange={e => setQ(e.target.value)} />
                </div>
                <div className="border rounded overflow-hidden">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="text-left p-2">Material</th>
                                <th className="text-left p-2">Producer</th>
                                <th className="text-left p-2">Status</th>
                                <th className="text-left p-2">Created</th>
                                <th className="text-left p-2 w-24">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={5} className="p-4 text-muted-foreground">Tidak ada data</td></tr>
                            ) : filtered.map(b => (
                                <tr key={b.id} className="border-t">
                                    <td className="p-2">{b.materialName}</td>
                                    <td className="p-2">{producers[b.producerId] || "—"}</td>
                                    <td className="p-2"><BatchStatusBadge status={b.status} /></td>
                                    <td className="p-2">{new Date(b.createdAt).toLocaleString()}</td>
                                    <td className="p-2">
                                        <Button size="sm" onClick={() => choose(b)}>Pilih</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DialogContent>
        </Dialog>
    )
}
