// src/components/products/ProductDeleteButton.tsx
"use client"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function ProductDeleteButton({ id, onDeleted }: { id: string; onDeleted?: () => void }) {
    async function del() {
        const r = await fetch(`/api/products/${id}`, { method: "DELETE" })
        const data = await r.json().catch(() => ({}))
        if (!r.ok) return toast.error(data?.message || "Delete failed")
        toast.success("Product deleted")
        onDeleted?.()
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild><Button variant="destructive" size="sm">Delete</Button></AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete product?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={del}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
