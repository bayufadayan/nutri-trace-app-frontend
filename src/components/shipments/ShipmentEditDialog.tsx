/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import BatchPickerDialog from "./BatchPickerDialog"
import SelectedBatchInfo from "./SelectedBatchInfo"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "sonner"

export default function ShipmentEditDialog({ shipment, onUpdated }: { shipment: any; onUpdated?: () => void }) {
    const [open, setOpen] = React.useState(false)
    const [batchId, setBatchId] = React.useState<string>(shipment.batchId || "")
    const [driverName, setDriver] = React.useState<string>(shipment.driverName || "")
    const [truckId, setTruck] = React.useState<string>(shipment.truckId || "")
    const [fromLocation, setFrom] = React.useState<string>(shipment.fromLocation || "")
    const [toLocation, setTo] = React.useState<string>(shipment.toLocation || "")
    const [sentAt, setSentAt] = React.useState<string>(shipment.sentAt ? new Date(shipment.sentAt).toISOString().slice(0, 16) : "")
    const [receivedAt, setReceivedAt] = React.useState<string>(shipment.receivedAt ? new Date(shipment.receivedAt).toISOString().slice(0, 16) : "")
    const [status, setStatus] = React.useState<string>(shipment.status || "IN_TRANSIT")
    const [loading, setLoading] = React.useState(false)
    const [err, setErr] = React.useState<string | null>(null)

    const toISO = (local: string) => (local ? new Date(local).toISOString() : null)

    async function submit() {
        setLoading(true); setErr(null)
        try {
            const payload: any = {
                batchId,
                driverName,
                truckId,
                fromLocation,
                toLocation,
                status,
            }
            if (sentAt) payload.sentAt = toISO(sentAt)
            if (receivedAt) payload.receivedAt = toISO(receivedAt)

            const r = await fetch(`/api/shipments/${shipment.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            const data = await r.json().catch(() => ({}))
            if (!r.ok) throw new Error(data?.message || "Update shipment failed")

            toast.success("Shipment updated")
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
                <DialogHeader><DialogTitle>Edit Shipment</DialogTitle></DialogHeader>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-3">
                        <div className="grid gap-1.5">
                            <Label>Batch ID</Label>
                            <div className="flex gap-2">
                                <Input value={batchId} onChange={e => setBatchId(e.target.value.trim())} />
                                <BatchPickerDialog onPick={(b) => setBatchId(b.id)} />
                            </div>
                        </div>
                        <div className="grid gap-1.5">
                            <Label>Driver Name</Label>
                            <Input value={driverName} onChange={e => setDriver(e.target.value)} />
                        </div>
                        <div className="grid gap-1.5">
                            <Label>Truck ID</Label>
                            <Input value={truckId} onChange={e => setTruck(e.target.value)} />
                        </div>
                        <div className="grid gap-1.5">
                            <Label>Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="IN_TRANSIT">IN_TRANSIT</SelectItem>
                                    <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        <div className="grid gap-1.5">
                            <Label>Sent At</Label>
                            <Input type="datetime-local" value={sentAt} onChange={e => setSentAt(e.target.value)} />
                        </div>
                        <div className="grid gap-1.5">
                            <Label>Received At</Label>
                            <Input type="datetime-local" value={receivedAt} onChange={e => setReceivedAt(e.target.value)} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label className="font-medium">Batch Info</Label>
                            <SelectedBatchInfo batchId={batchId} />
                        </div>
                    </div>
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
