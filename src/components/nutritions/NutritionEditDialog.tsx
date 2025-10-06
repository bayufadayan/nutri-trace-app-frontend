/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function NutritionEditDialog({ item, onUpdated }: { item: any; onUpdated?: () => void }) {
    const [open, setOpen] = React.useState(false)
    const [calories, setCalories] = React.useState<string>(String(item.calories ?? ""))
    const [protein, setProtein] = React.useState<string>(String(item.protein ?? ""))
    const [fat, setFat] = React.useState<string>(String(item.fat ?? ""))
    const [carbs, setCarbs] = React.useState<string>(String(item.carbs ?? ""))
    const [vitamins, setVitamins] = React.useState<string>(item.vitamins ?? "")
    const [loading, setLoading] = React.useState(false)
    const [err, setErr] = React.useState<string | null>(null)

    function validNumber(x: string) { return x !== "" && !Number.isNaN(Number(x)) && Number(x) >= 0 }

    async function submit() {
        setLoading(true); setErr(null)
        try {
            if (![calories, protein, fat, carbs].every(validNumber)) {
                throw new Error("Kalori, protein, fat, dan carbs harus angka ≥ 0")
            }
            const payload = {
                calories: Number(calories),
                protein: Number(protein),
                fat: Number(fat),
                carbs: Number(carbs),
                vitamins: String(vitamins ?? "").trim(),
            }
            const r = await fetch(`/api/nutritions/${item.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            const data = await r.json().catch(() => ({}))
            if (!r.ok) throw new Error(data?.message || "Update failed")

            toast.success("Nutrition updated")
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
            <DialogContent>
                <DialogHeader><DialogTitle>Edit Nutrition</DialogTitle></DialogHeader>

                <div className="grid sm:grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                        <Label>Calories</Label>
                        <Input type="number" inputMode="decimal" value={calories} onChange={e => setCalories(e.target.value)} />
                    </div>
                    <div className="grid gap-1.5">
                        <Label>Protein (g)</Label>
                        <Input type="number" inputMode="decimal" value={protein} onChange={e => setProtein(e.target.value)} />
                    </div>
                    <div className="grid gap-1.5">
                        <Label>Fat (g)</Label>
                        <Input type="number" inputMode="decimal" value={fat} onChange={e => setFat(e.target.value)} />
                    </div>
                    <div className="grid gap-1.5">
                        <Label>Carbs (g)</Label>
                        <Input type="number" inputMode="decimal" value={carbs} onChange={e => setCarbs(e.target.value)} />
                    </div>
                    <div className="grid gap-1.5 sm:col-span-2">
                        <Label>Vitamins</Label>
                        <Textarea value={vitamins} onChange={e => setVitamins(e.target.value)} />
                    </div>

                    {err && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 sm:col-span-2">{err}</p>}
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
