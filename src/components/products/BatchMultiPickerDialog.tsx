// src/components/products/BatchMultiPickerDialog.tsx
"use client"
import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BatchStatusBadge from "@/components/batches/BatchStatusBadge"

type Batch = { id: string; producerId: string; materialName: string; weight: number; createdAt: string; status: string }

export default function BatchMultiPickerDialog({
    onAdd, trigger,
}: { onAdd: (ids: string[]) => void; trigger?: React.ReactNode }) {
    const [open, setOpen] = React.useState(false)
    const [items, setItems] = React.useState<Batch[]>([])
    const [q, setQ] = React.useState("")
    const [selected, setSelected] = React.useState<Record<string, boolean>>({})

    React.useEffect(() => {
        if (!open) return
            ; (async () => {
                const r = await fetch("/api/batches", { cache: "no-store" })
                const data = await r.json().catch(() => ([]))
                setItems(Array.isArray(data) ? data : [])
                setSelected({})
            })()
    }, [open])

    const filtered = React.useMemo(() => {
        const s = q.toLowerCase()
        return items.filter(b =>
            [b.id, b.materialName, b.status].some(v => String(v || "").toLowerCase().includes(s))
        )
    }, [items, q])

    function toggle(id: string) {
        setSelected(prev => ({ ...prev, [id]: !prev[id] }))
    }

    function add() {
        const ids = Object.keys(selected).filter(k => selected[k])
        onAdd(ids)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger ?? <Button variant="outline">Pilih Batch</Button>}</DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader><DialogTitle>Pilih Beberapa Batch</DialogTitle></DialogHeader>

                <div className="mb-2"><Input placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} /></div>
                <div className="border rounded overflow-hidden">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="p-2 w-10"></th>
                                <th className="text-left p-2">Material</th>
                                <th className="text-left p-2">Status</th>
                                <th className="text-left p-2">Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={4} className="p-4 text-muted-foreground">No batches</td></tr>
                            ) : filtered.map(b => (
                                <tr key={b.id} className="border-t">
                                    <td className="p-2">
                                        <input type="checkbox" className="h-4 w-4" checked={!!selected[b.id]} onChange={() => toggle(b.id)} />
                                    </td>
                                    <td className="p-2">{b.materialName} <span className="font-mono text-[11px] text-muted-foreground">({b.id.slice(0, 8)})</span></td>
                                    <td className="p-2"><BatchStatusBadge status={b.status} /></td>
                                    <td className="p-2">{new Date(b.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <DialogFooter>
                    <Button onClick={add}>Add Selected</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
