/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { BatchStatus } from "./BatchStatusBadge"

export default function BatchEditDialog({ batch, onUpdated }: { batch: any; onUpdated?: () => void }) {
    const [open, setOpen] = React.useState(false)
    const [materialName, setMaterialName] = React.useState<string>(batch.materialName ?? "")
    const [weight, setWeight] = React.useState<number | string>(batch.weight ?? "")
    const [status, setStatus] = React.useState<BatchStatus>(batch.status ?? "PENDING")
    const [loading, setLoading] = React.useState(false)
    const [err, setErr] = React.useState<string | null>(null)

    async function submit() {
        setLoading(true); setErr(null)
        try {
            const payload: any = {}
            if (materialName?.trim()) payload.materialName = materialName.trim()
            if (weight !== "") payload.weight = Number(weight)
            if (status) payload.status = status
            const w = Number(weight)
            if (Number.isNaN(w) || w <= 0) {
                setErr("Weight harus lebih dari 0"); setLoading(false); return
            }

            const r = await fetch(`/api/batches/${batch.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            const data = await r.json().catch(() => ({}))
            if (!r.ok) throw new Error(data?.message || "Update failed")

            toast.success("Batch updated")
            setOpen(false)
            onUpdated?.()
        } catch (e: any) {
            const msg = e?.message || "Terjadi kesalahan"
            setErr(msg); toast.error(msg)
        } finally { setLoading(false) }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Edit</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Edit Batch</DialogTitle></DialogHeader>

                <div className="grid gap-3">
                    <div className="grid gap-1.5">
                        <Label>Material Name</Label>
                        <Input value={materialName} onChange={e => setMaterialName(e.target.value)} placeholder="Beras / Bayam ..." />
                    </div>

                    <div className="grid gap-1.5">
                        <Label>Weight (kg)</Label>
                        <Input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="100" />
                    </div>

                    <div className="grid gap-1.5">
                        <Label>Status</Label>
                        <Select value={status} onValueChange={(v) => setStatus(v as BatchStatus)}>
                            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PENDING">PENDING</SelectItem>
                                <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                                <SelectItem value="REJECTED">REJECTED</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {err && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{err}</p>}
                </div>

                <DialogFooter>
                    <Button onClick={submit} disabled={loading} className="bg-[oklch(var(--brand-primary))]">
                        {loading ? "Saving..." : "Save changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
