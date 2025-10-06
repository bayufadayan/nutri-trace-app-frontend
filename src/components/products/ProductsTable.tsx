/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/products/ProductsTable.tsx
"use client"
import * as React from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import ProductStatusBadge from "./ProductStatusBadge"
import ProductQRCodeButton from "./ProductQRCodeButton"
import ProductEditDialog from "./ProductEditDialog"
import ProductDeleteButton from "./ProductDeleteButton"

export default function ProductsTable() {
    const [items, setItems] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)
    const [q, setQ] = React.useState("")

    const load = React.useCallback(async () => {
        setLoading(true)
        try {
            const r = await fetch("/api/products", { cache: "no-store" })
            const data = await r.json().catch(() => ([]))
            setItems(Array.isArray(data) ? data : [])
        } finally { setLoading(false) }
    }, [])

    React.useEffect(() => { load() }, [load])
    React.useEffect(() => {
        const h = () => load()
        window.addEventListener("products:refresh", h)
        return () => window.removeEventListener("products:refresh", h)
    }, [load])

    const filtered = React.useMemo(() => {
        const s = q.toLowerCase()

        return items.filter((p: any) =>
            [p.name, p.status, p.chefName, p.id, p.nutrition?.vitamins]
                .some((v) => String(v ?? "").toLowerCase().includes(s))
        )
    }, [items, q])


    return (
        <Card className="p-0 overflow-auto">
            <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
                <Input placeholder="Search products..." value={q} onChange={e => setQ(e.target.value)} className="h-9 max-w-xs" />
                <Button variant="outline" size="sm" onClick={load}><RefreshCcw className="h-4 w-4 mr-1" /> Refresh</Button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-muted/30">
                        <tr>
                            <th className="text-left p-2">Name</th>
                            <th className="text-left p-2">Nutrition</th>
                            <th className="text-left p-2">Batches</th>
                            <th className="text-left p-2">Status</th>
                            <th className="text-left p-2">Created</th>
                            <th className="text-left p-2 w-[320px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td className="p-4 text-muted-foreground" colSpan={6}>Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td className="p-4 text-muted-foreground" colSpan={6}>No products</td></tr>
                        ) : filtered.map((p: any) => (
                            <tr key={p.id} className="border-t">
                                <td className="p-2">
                                    <div className="font-medium">{p.name}</div>
                                    <div className="text-xs text-muted-foreground font-mono">{p.id}</div>
                                </td>
                                <td className="p-2">
                                    {p.nutrition
                                        ? (<span>{p.nutrition.calories}kcal • P{p.nutrition.protein} F{p.nutrition.fat} C{p.nutrition.carbs}</span>)
                                        : "—"}
                                </td>
                                <td className="p-2">{Array.isArray(p.batches) ? p.batches.length : 0}</td>
                                <td className="p-2"><ProductStatusBadge status={p.status} /></td>
                                <td className="p-2">{p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}</td>
                                <td className="p-2">
                                    <div className="flex flex-wrap gap-2">
                                        <ProductQRCodeButton id={p.id} qrPath={p.qrCode} />
                                        <ProductEditDialog item={p} onUpdated={load} />
                                        <ProductDeleteButton id={p.id} onDeleted={load} />
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
