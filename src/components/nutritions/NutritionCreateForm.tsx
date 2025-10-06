/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import * as React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function NutritionCreateForm({ onCreated }: { onCreated?: () => void }) {
    const [calories, setCalories] = React.useState<string>("")
    const [protein, setProtein] = React.useState<string>("")
    const [fat, setFat] = React.useState<string>("")
    const [carbs, setCarbs] = React.useState<string>("")
    const [vitamins, setVitamins] = React.useState<string>("")
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
                vitamins: vitamins.trim(),
            }
            const r = await fetch("/api/nutritions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            const data = await r.json().catch(() => ({}))
            if (!r.ok) throw new Error(data?.message || "Create nutrition failed")

            toast.success("Nutrition created")
            setCalories(""); setProtein(""); setFat(""); setCarbs(""); setVitamins("")
            onCreated?.()
        } catch (e: any) {
            const msg = e?.message || "Terjadi kesalahan"
            setErr(msg); toast.error(msg)
        } finally { setLoading(false) }
    }

    return (
        <div className="grid gap-3">
            <div className="grid sm:grid-cols-4 gap-3">
                <div className="grid gap-1.5">
                    <Label>Calories</Label>
                    <Input type="number" inputMode="decimal" value={calories} onChange={e => setCalories(e.target.value)} placeholder="200" />
                </div>
                <div className="grid gap-1.5">
                    <Label>Protein (g)</Label>
                    <Input type="number" inputMode="decimal" value={protein} onChange={e => setProtein(e.target.value)} placeholder="10" />
                </div>
                <div className="grid gap-1.5">
                    <Label>Fat (g)</Label>
                    <Input type="number" inputMode="decimal" value={fat} onChange={e => setFat(e.target.value)} placeholder="5" />
                </div>
                <div className="grid gap-1.5">
                    <Label>Carbs (g)</Label>
                    <Input type="number" inputMode="decimal" value={carbs} onChange={e => setCarbs(e.target.value)} placeholder="30" />
                </div>
            </div>

            <div className="grid gap-1.5">
                <Label>Vitamins</Label>
                <Textarea value={vitamins} onChange={e => setVitamins(e.target.value)} placeholder="Vitamin A, C" />
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
