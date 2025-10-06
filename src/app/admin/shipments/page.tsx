"use client"
import { Card } from "@/components/ui/card"
import { Toaster } from "sonner"
import ShipmentCreateForm from "@/components/shipments/ShipmentCreateForm"
import ShipmentsTable from "@/components/shipments/ShipmentsTable"

export default function AdminShipmentsPage() {
    return (
        <main className="space-y-6">
            <Toaster richColors />
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Distributions</h1>
                <p className="text-muted-foreground">Create, update, and manage product distributions.</p>
            </div>

            <Card className="p-4 space-y-4">
                <h2 className="font-medium">Create Distribution</h2>
                <ShipmentCreateForm onCreated={() => window.dispatchEvent(new Event("shipments:refresh"))} />
            </Card>

            <ShipmentsTable />
        </main>
    )
}
