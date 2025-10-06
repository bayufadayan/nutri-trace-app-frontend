/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import * as React from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import NutritionEditDialog from "./NutritionEditDialog"
import NutritionDeleteButton from "./NutritionDeleteButton"

export default function NutritionsTable() {
    const [items, setItems] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)
    const [q, setQ] = React.useState("")

    const load = React.useCallback(async () => {
        setLoading(true)
        try {
            const r = await fetch("/api/nutritions", { cache: "no-store" })
            const data = await r.json().catch(() => ([]))
            setItems(Array.isArray(data) ? data : [])
        } finally { setLoading(false) }
    }, [])

    React.useEffect(() => { load() }, [load])

    React.useEffect(() => {
        const h = () => load()
        window.addEventListener("nutritions:refresh", h)
        return () => window.removeEventListener("nutritions:refresh", h)
    }, [load])

    const filtered = React.useMemo(() => {
        const s = q.toLowerCase()
        return items.filter((n) =>
            [
                n.id,
                n.vitamins,
                n.calories?.toString(),
                n.protein?.toString(),
                n.fat?.toString(),
                n.carbs?.toString(),
            ].some((v: string) => String(v || "").toLowerCase().includes(s))
        )
    }, [items, q])

    return (
        <Card className="p-0 overflow-auto">
            <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
                <Input placeholder="Search nutritions..." value={q} onChange={e => setQ(e.target.value)} className="h-9 max-w-xs" />
                <Button variant="outline" size="sm" onClick={load}><RefreshCcw className="h-4 w-4 mr-1" /> Refresh</Button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-muted/30">
                        <tr>
                            <th className="text-left p-2">ID</th>
                            <th className="text-left p-2">Calories</th>
                            <th className="text-left p-2">Protein</th>
                            <th className="text-left p-2">Fat</th>
                            <th className="text-left p-2">Carbs</th>
                            <th className="text-left p-2">Vitamins</th>
                            <th className="text-left p-2 w-[220px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td className="p-4 text-muted-foreground" colSpan={7}>Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td className="p-4 text-muted-foreground" colSpan={7}>No items</td></tr>
                        ) : filtered.map((n: any) => (
                            <tr key={n.id} className="border-t">
                                <td className="p-2 font-mono text-xs">{n.id}</td>
                                <td className="p-2">{n.calories}</td>
                                <td className="p-2">{n.protein}</td>
                                <td className="p-2">{n.fat}</td>
                                <td className="p-2">{n.carbs}</td>
                                <td className="p-2">{n.vitamins}</td>
                                <td className="p-2">
                                    <div className="flex flex-wrap gap-2">
                                        <NutritionEditDialog item={n} onUpdated={load} />
                                        <NutritionDeleteButton id={n.id} onDeleted={load} />
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
