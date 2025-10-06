/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import BatchPickerDialog from "./BatchPickerDialog"
import SelectedBatchInfo from "./SelectedBatchInfo"
import { QrCode } from "lucide-react"
import BatchQRScanDialog from "./BatchQRScanDialog"
import { toast } from "sonner"

export default function ShipmentCreateForm({ onCreated }: { onCreated?: () => void }) {
    const [batchId, setBatchId] = React.useState<string>("")
    const [driverName, setDriver] = React.useState("")
    const [truckId, setTruck] = React.useState("")
    const [fromLocation, setFrom] = React.useState("")
    const [toLocation, setTo] = React.useState("")
    const [sentAt, setSentAt] = React.useState<string>("") // yyyy-MM-ddTHH:mm (local)
    const [loading, setLoading] = React.useState(false)
    const [err, setErr] = React.useState<string | null>(null)

    function fromLocalToISO(local: string) {
        // input type=datetime-local → treat as local, convert to ISO
        if (!local) return ""
        const dt = new Date(local)
        return dt.toISOString()
    }

    async function submit() {
        setLoading(true); setErr(null)
        try {
            if (!batchId) throw new Error("Batch ID wajib diisi")
            const payload = {
                batchId,
                driverName,
                truckId,
                fromLocation,
                toLocation,
                sentAt: fromLocalToISO(sentAt),
            }
            const r = await fetch("/api/shipments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            const data = await r.json().catch(() => ({}))
            if (!r.ok) throw new Error(data?.message || "Create shipment failed")

            toast.success("Shipment created")
            setDriver(""); setTruck(""); setFrom(""); setTo(""); setSentAt("")
            onCreated?.()
        } catch (e: any) {
            const msg = e?.message || "Terjadi kesalahan"
            setErr(msg); toast.error(msg)
        } finally { setLoading(false) }
    }

    return (
        <div className="grid gap-4">
            <div className="grid md:grid-cols-3 gap-3">
                <div className="grid gap-1.5">
                    <Label>Batch ID / QR ID</Label>
                    <div className="flex gap-2">
                        <Input
                            value={batchId}
                            onChange={e => setBatchId(e.target.value.trim())}
                            placeholder="Tempel ID batch / QR"
                        />
                        <BatchPickerDialog
                            onPick={(b) => setBatchId(b.id)}
                            trigger={<Button variant="outline">Pilih</Button>}
                        />
                        {/* ⬇️ Tombol scan QR */}
                        <BatchQRScanDialog
                            onDetected={(text) => setBatchId(text)}
                            trigger={
                                <Button variant="outline" size="icon" title="Scan QR">
                                    <QrCode className="h-4 w-4" />
                                </Button>
                            }
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Isi manual ID, klik “Pilih”, atau gunakan “Scan QR”.
                    </p>
                </div>

                <div className="grid gap-1.5">
                    <Label>Driver Name</Label>
                    <Input value={driverName} onChange={e => setDriver(e.target.value)} placeholder="Pak Jono" />
                </div>

                <div className="grid gap-1.5">
                    <Label>Truck ID</Label>
                    <Input value={truckId} onChange={e => setTruck(e.target.value)} placeholder="TR-123" />
                </div>

                <div className="grid gap-1.5">
                    <Label>From</Label>
                    <Input value={fromLocation} onChange={e => setFrom(e.target.value)} placeholder="Gudang A" />
                </div>

                <div className="grid gap-1.5">
                    <Label>To</Label>
                    <Input value={toLocation} onChange={e => setTo(e.target.value)} placeholder="Puskesmas B" />
                </div>

                <div className="grid gap-1.5">
                    <Label>Sent At</Label>
                    <Input type="datetime-local" value={sentAt} onChange={e => setSentAt(e.target.value)} />
                </div>
            </div>

            {batchId && (
                <Card className="p-3">
                    <div className="font-medium mb-2">Batch Info</div>
                    <SelectedBatchInfo batchId={batchId} />
                </Card>
            )}

            {err && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{err}</p>}

            <div>
                <Button onClick={submit} disabled={loading} className="bg-[oklch(var(--brand-primary))]">
                    {loading ? "Creating..." : "Create Shipment"}
                </Button>
            </div>
        </div>
    )
}
