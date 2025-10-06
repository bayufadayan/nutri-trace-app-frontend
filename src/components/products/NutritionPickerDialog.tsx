// src/components/products/NutritionPickerDialog.tsx
"use client"
import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Nutrition = { id: string; calories: number; protein: number; fat: number; carbs: number; vitamins: string }

export default function NutritionPickerDialog({
    onPick, trigger,
}: { onPick: (n: Nutrition) => void; trigger?: React.ReactNode }) {
    const [open, setOpen] = React.useState(false)
    const [items, setItems] = React.useState<Nutrition[]>([])
    const [q, setQ] = React.useState("")
    React.useEffect(() => {
        if (!open) return
            ; (async () => {
                const r = await fetch("/api/nutritions", { cache: "no-store" })
                const data = await r.json().catch(() => ([]))
                setItems(Array.isArray(data) ? data : [])
            })()
    }, [open])
    const filtered = React.useMemo(() => {
        const s = q.toLowerCase()
        return items.filter(n =>
            [n.id, n.vitamins, n.calories, n.protein, n.fat, n.carbs]
                .some(v => String(v ?? "").toLowerCase().includes(s))
        )
    }, [items, q])
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger ?? <Button variant="outline">Pilih Nutrition</Button>}</DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader><DialogTitle>Pilih Nutrition</DialogTitle></DialogHeader>
                <div className="mb-2"><Input placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} /></div>
                <div className="border rounded overflow-hidden">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="text-left p-2">ID</th>
                                <th className="text-left p-2">Macros</th>
                                <th className="text-left p-2">Vitamins</th>
                                <th className="text-left p-2 w-24">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={4} className="p-4 text-muted-foreground">No items</td></tr>
                            ) : filtered.map(n => (
                                <tr key={n.id} className="border-t">
                                    <td className="p-2 font-mono text-[11px]">{n.id}</td>
                                    <td className="p-2">{n.calories}kcal • P{n.protein} F{n.fat} C{n.carbs}</td>
                                    <td className="p-2 truncate max-w-[260px]">{n.vitamins}</td>
                                    <td className="p-2"><Button size="sm" onClick={() => { onPick(n); setOpen(false) }}>Pilih</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DialogContent>
        </Dialog>
    )
}
