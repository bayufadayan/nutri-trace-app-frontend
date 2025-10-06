"use client"
import * as React from "react"
import BatchStatusBadge from "../batches/BatchStatusBadge"

type Batch = {
    id: string
    producerId: string
    materialName: string
    weight: number
    createdAt: string
    status: string
}

export default function SelectedBatchInfo({ batchId }: { batchId?: string }) {
    const [data, setData] = React.useState<Batch | null>(null)
    const [producerName, setProducerName] = React.useState<string>("")
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        if (!batchId) { setData(null); setProducerName(""); return }
        ; (async () => {
            setLoading(true)
            try {
                const r = await fetch(`/api/batches/${batchId}`)
                const b = await r.json().catch(() => null)
                setData(b)
                if (b?.producerId) {
                    const ur = await fetch(`/api/users/${b.producerId}`)
                    const u = await ur.json().catch(() => null)
                    setProducerName(u?.name || b.producerId)
                }
            } finally { setLoading(false) }
        })()
    }, [batchId])

    if (!batchId) return null
    if (loading) return <div className="text-sm text-muted-foreground">Memuat info batch…</div>
    if (!data) return <div className="text-sm text-red-600">Batch tidak ditemukan.</div>

    return (
        <div className="text-sm space-y-1">
            <div><span className="font-medium">Material:</span> {data.materialName}</div>
            <div><span className="font-medium">Weight:</span> {data.weight} kg</div>
            <div><span className="font-medium">Producer:</span> {producerName || "—"}</div>
            <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span> <BatchStatusBadge status={data.status} />
            </div>
            <div><span className="font-medium">Created:</span> {new Date(data.createdAt).toLocaleString()}</div>
            <div className="text-xs text-muted-foreground font-mono">ID: {data.id}</div>
        </div>
    )
}
