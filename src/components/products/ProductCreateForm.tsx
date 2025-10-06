/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/products/ProductCreateForm.tsx
"use client"
import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import NutritionPickerDialog from "./NutritionPickerDialog"
import BatchMultiPickerDialog from "./BatchMultiPickerDialog"
import BatchQRScanDialog from "@/components/shipments/BatchQRScanDialog"
import SelectedBatchInfo from "@/components/shipments/SelectedBatchInfo"
import { toast } from "sonner"
import { QrCode, Plus, X } from "lucide-react"

type Status = "PENDING" | "NEED_APPROVAL" | "READY_FOR_DISTRIBUTION" | "DISTRIBUTED"

export default function ProductCreateForm({ onCreated }: { onCreated?: () => void }) {
    const [name, setName] = React.useState("")
    const [status, setStatus] = React.useState<Status>("PENDING")
    const [chefName, setChef] = React.useState<string>("")
    const [nutritionId, setNutritionId] = React.useState<string>("")
    const [nutritionPreview, setNutritionPreview] = React.useState<any | null>(null)

    const [batchInput, setBatchInput] = React.useState("")
    const [batchIds, setBatchIds] = React.useState<string[]>([])
    const [loading, setLoading] = React.useState(false)
    const [err, setErr] = React.useState<string | null>(null)

    function addBatch(id: string) {
        if (!id) return
        setBatchIds(prev => prev.includes(id) ? prev : [...prev, id])
    }
    function removeBatch(id: string) {
        setBatchIds(prev => prev.filter(x => x !== id))
    }

    async function submit() {
        setLoading(true); setErr(null)
        try {
            if (!name.trim()) throw new Error("Name wajib diisi")
            if (!nutritionId) throw new Error("Nutrition wajib dipilih")
            if (batchIds.length === 0) throw new Error("Minimal 1 Batch")

            const payload = {
                name: name.trim(),
                nutritionId,
                status,
                chefName: chefName || null,
                batches: batchIds.map(id => ({ batchId: id })),
            }
            const r = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            const data = await r.json().catch(() => ({}))
            if (!r.ok) throw new Error(data?.message || "Create product failed")

            toast.success("Product created")
            setName(""); setChef(""); setNutritionId(""); setNutritionPreview(null); setBatchIds([]); setBatchInput("")
            onCreated?.()
        } catch (e: any) {
            const msg = e?.message || "Terjadi kesalahan"
            setErr(msg); toast.error(msg)
        } finally { setLoading(false) }
    }

    return (
        <div className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                    <Label>Product Name</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nasi Goreng Sehat" />
                </div>

                <div className="grid gap-1.5">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PENDING">PENDING</SelectItem>
                            <SelectItem value="NEED_APPROVAL">NEED_APPROVAL</SelectItem>
                            <SelectItem value="READY_FOR_DISTRIBUTION">READY_FOR_DISTRIBUTION</SelectItem>
                            <SelectItem value="DISTRIBUTED">DISTRIBUTED</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-1.5">
                    <Label>Nutrition</Label>
                    <div className="flex gap-2">
                        <Input value={nutritionId} onChange={e => setNutritionId(e.target.value.trim())} placeholder="Nutrition ID" />
                        <NutritionPickerDialog
                            onPick={(n) => { setNutritionId(n.id); setNutritionPreview(n) }}
                            trigger={<Button variant="outline">Pilih</Button>}
                        />
                    </div>
                    {nutritionId && nutritionPreview && (
                        <p className="text-xs text-muted-foreground">
                            {nutritionPreview.calories}kcal • P{nutritionPreview.protein} F{nutritionPreview.fat} C{nutritionPreview.carbs} — {nutritionPreview.vitamins}
                        </p>
                    )}
                </div>

                <div className="grid gap-1.5">
                    <Label>Chef Name (opsional)</Label>
                    <Input value={chefName} onChange={e => setChef(e.target.value)} placeholder="Chef A" />
                </div>
            </div>

            <div className="grid gap-2">
                <Label>Batches</Label>
                <div className="flex gap-2">
                    <Input value={batchInput} onChange={e => setBatchInput(e.target.value.trim())} placeholder="Tempel ID batch" />
                    <Button variant="outline" onClick={() => { addBatch(batchInput); setBatchInput("") }}>
                        <Plus className="h-4 w-4 mr-1" /> Tambah
                    </Button>
                    <BatchMultiPickerDialog onAdd={(ids) => ids.forEach(addBatch)} />
                    <BatchQRScanDialog
                        onDetected={(text) => addBatch(text)}
                        trigger={<Button variant="outline" size="icon" title="Scan QR"><QrCode className="h-4 w-4" /></Button>}
                    />
                </div>

                {/* daftar batch terpilih */}
                {batchIds.length > 0 && (
                    <Card className="p-3 space-y-3">
                        <div className="flex flex-wrap gap-2">
                            {batchIds.map(id => (
                                <span key={id} className="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs">
                                    <code className="font-mono">{id}</code>
                                    <button onClick={() => removeBatch(id)} className="opacity-70 hover:opacity-100"><X className="h-3 w-3" /></button>
                                </span>
                            ))}
                        </div>
                        {/* tampilkan info batch pertama sebagai contoh; bisa diperluas jadi list */}
                        <SelectedBatchInfo batchId={batchIds[0]} />
                    </Card>
                )}
            </div>

            {err && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{err}</p>}

            <div>
                <Button onClick={submit} disabled={loading} className="bg-[oklch(var(--brand-primary))]">
                    {loading ? "Creating..." : "Create Product"}
                </Button>
            </div>
        </div>
    )
}
