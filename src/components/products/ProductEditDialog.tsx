/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/products/ProductEditDialog.tsx
"use client"
import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import NutritionPickerDialog from "./NutritionPickerDialog"
import BatchMultiPickerDialog from "./BatchMultiPickerDialog"
import BatchQRScanDialog from "@/components/shipments/BatchQRScanDialog"
import SelectedBatchInfo from "@/components/shipments/SelectedBatchInfo"
import { toast } from "sonner"
import { QrCode, Plus, X } from "lucide-react"
import { Card } from "../ui/card"

type Status = "PENDING" | "NEED_APPROVAL" | "READY_FOR_DISTRIBUTION" | "DISTRIBUTED"

export default function ProductEditDialog({ item, onUpdated }: { item: any; onUpdated?: () => void }) {
    const [open, setOpen] = React.useState(false)
    const [name, setName] = React.useState(item.name ?? "")
    const [status, setStatus] = React.useState<Status>(item.status ?? "PENDING")
    const [chefName, setChef] = React.useState<string>(item.chefName ?? "")
    const [nutritionId, setNutritionId] = React.useState<string>(item.nutritionId ?? "")
    const [nutritionPreview, setNutritionPreview] = React.useState<any>(item.nutrition ?? null)
    const [batchInput, setBatchInput] = React.useState("")
    const initialBatches = Array.isArray(item.batches) ? item.batches.map((b: any) => b.batchId) : []
    const [batchIds, setBatchIds] = React.useState<string[]>(initialBatches)
    const [loading, setLoading] = React.useState(false)
    const [err, setErr] = React.useState<string | null>(null)

    function addBatch(id: string) { if (!id) return; setBatchIds(prev => prev.includes(id) ? prev : [...prev, id]) }
    function removeBatch(id: string) { setBatchIds(prev => prev.filter(x => x !== id)) }

    async function submit() {
        setLoading(true); setErr(null)
        try {
            const payload = {
                name: name.trim(),
                nutritionId,
                status,
                chefName: chefName || null,
                batches: batchIds.map(id => ({ batchId: id })),
            }
            const r = await fetch(`/api/products/${item.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            const data = await r.json().catch(() => ({}))
            if (!r.ok) throw new Error(data?.message || "Update failed")
            toast.success("Product updated")
            setOpen(false)
            onUpdated?.()
        } catch (e: any) {
            const msg = e?.message || "Terjadi kesalahan"
            setErr(msg); toast.error(msg)
        } finally { setLoading(false) }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="outline" size="sm">Edit</Button></DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>

                <div className="grid md:grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                        <Label>Name</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} />
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
                            <Input value={nutritionId} onChange={e => setNutritionId(e.target.value.trim())} />
                            <NutritionPickerDialog onPick={(n) => { setNutritionId(n.id); setNutritionPreview(n) }} />
                        </div>
                        {nutritionId && nutritionPreview && (
                            <p className="text-xs text-muted-foreground">
                                {nutritionPreview.calories}kcal • P{nutritionPreview.protein} F{nutritionPreview.fat} C{nutritionPreview.carbs} — {nutritionPreview.vitamins}
                            </p>
                        )}
                    </div>
                    <div className="grid gap-1.5">
                        <Label>Chef Name</Label>
                        <Input value={chefName} onChange={e => setChef(e.target.value)} />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label>Batches</Label>
                    <div className="flex gap-2">
                        <Input value={batchInput} onChange={e => setBatchInput(e.target.value.trim())} placeholder="Batch ID" />
                        <Button variant="outline" onClick={() => { addBatch(batchInput); setBatchInput("") }}>
                            <Plus className="h-4 w-4 mr-1" /> Tambah
                        </Button>
                        <BatchMultiPickerDialog onAdd={(ids) => ids.forEach(addBatch)} />
                        <BatchQRScanDialog onDetected={(text) => addBatch(text)} trigger={<Button variant="outline" size="icon"><QrCode className="h-4 w-4" /></Button>} />
                    </div>
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
                            <SelectedBatchInfo batchId={batchIds[0]} />
                        </Card>
                    )}
                </div>

                {err && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{err}</p>}

                <DialogFooter>
                    <Button onClick={submit} disabled={loading} className="bg-[oklch(var(--brand-primary))]">
                        {loading ? "Saving..." : "Save changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
