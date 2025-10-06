/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { BatchStatus } from "./BatchStatusBadge"

export default function BatchCreateForm({ onCreated }: { onCreated?: () => void }) {
    const [materialName, setMaterial] = React.useState("")
    const [weight, setWeight] = React.useState<number | string>("")
    const [status, setStatus] = React.useState<BatchStatus>("PENDING")
    const [loading, setLoading] = React.useState(false)
    const [err, setErr] = React.useState<string | null>(null)

    async function submit() {
        setLoading(true); setErr(null)
        try {
            const payload = { materialName, weight: Number(weight), status }
            const r = await fetch("/api/batches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            const data = await r.json().catch(() => ({}))
            if (!r.ok) throw new Error(data?.message || "Create batch failed")
            toast.success("Batch created")
            setMaterial(""); setWeight(""); setStatus("PENDING")
            onCreated?.()
        } catch (e: any) {
            const msg = e?.message || "Terjadi kesalahan"
            setErr(msg); toast.error(msg)
        } finally { setLoading(false) }
    }

    return (
        <div className="grid gap-3">
            <div className="grid sm:grid-cols-3 gap-3">
                <div className="grid gap-1.5">
                    <Label>Material</Label>
                    <Input value={materialName} onChange={e => setMaterial(e.target.value)} placeholder="Beras" />
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
            </div>
            {err && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{err}</p>}
            <div>
                <Button onClick={submit} disabled={loading} className="bg-[oklch(var(--brand-primary))]">
                    {loading ? "Creating..." : "Create"}
                </Button>
            </div>
        </div>
    )
}
