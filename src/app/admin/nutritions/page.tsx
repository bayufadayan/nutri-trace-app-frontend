"use client"
import { Card } from "@/components/ui/card"
import { Toaster } from "sonner"
import NutritionCreateForm from "@/components/nutritions/NutritionCreateForm"
import NutritionsTable from "@/components/nutritions/NutritionsTable"

export default function NutritionistAnalysisPage() {
    return (
        <main className="space-y-6">
            <Toaster richColors />
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Nutrition</h1>
                <p className="text-muted-foreground">Create and manage nutrition facts.</p>
            </div>

            <Card className="p-4 space-y-4">
                <h2 className="font-medium">Create Nutrition</h2>
                <NutritionCreateForm onCreated={() => window.dispatchEvent(new Event("nutritions:refresh"))} />
            </Card>

            <NutritionsTable />
        </main>
    )
}
