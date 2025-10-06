// src/app/admin/products/page.tsx
"use client"
import { Card } from "@/components/ui/card"
import { Toaster } from "sonner"
import ProductCreateForm from "@/components/products/ProductCreateForm"
import ProductsTable from "@/components/products/ProductsTable"

export default function AdminProductsPage() {
    return (
        <main className="space-y-6">
            <Toaster richColors />
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
                <p className="text-muted-foreground">Create foods from nutritions and batches, manage status, and QR.</p>
            </div>

            <Card className="p-4 space-y-4">
                <h2 className="font-medium">Create Product</h2>
                <ProductCreateForm onCreated={() => window.dispatchEvent(new Event("products:refresh"))} />
            </Card>

            <ProductsTable />
        </main>
    )
}
