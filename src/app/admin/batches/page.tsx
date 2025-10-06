// src/app/admin/batches/page.tsx
"use client"

import { Card } from "@/components/ui/card"
import { Toaster } from "sonner"
import BatchCreateForm from "@/components/batches/BatchCreateForm"
import BatchesTable from "@/components/batches/BatchesTable"

export default function AdminBatchesPage() {
    return (
        <main className="space-y-6">
            <Toaster richColors />
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Batches</h1>
                <p className="text-muted-foreground">Create, update, preview QR, and manage batches.</p>
            </div>

            <Card className="p-4 space-y-4">
                <h2 className="font-medium">Create Batch</h2>
                <BatchCreateForm onCreated={() => window.dispatchEvent(new Event("batches:refresh"))} />
            </Card>

            <BatchesTable />
        </main>
    )
}
