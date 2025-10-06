// src/components/batches/BatchDeleteButton.tsx
"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function BatchDeleteButton({
    id,
    name,
    onDeleted,
}: {
    id: string
    name?: string
    onDeleted?: () => void
}) {
    async function del() {
        const r = await fetch(`/api/batches/${id}`, { method: "DELETE" })
        const data = await r.json().catch(() => ({}))
        if (!r.ok) {
            toast.error(data?.message || "Delete failed")
            return
        }
        toast.success("Batch deleted")
        onDeleted?.()
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete batch?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {name ? (
                            <>You are about to delete <b>{name}</b> (ID: <code>{id}</code>). This action cannot be undone.</>
                        ) : (
                            <>This action cannot be undone. ID: <code>{id}</code></>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={del}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
