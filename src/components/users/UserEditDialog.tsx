/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function UserEditDialog({ user, onUpdated }: { user: any; onUpdated?: () => void }) {
    const [open, setOpen] = React.useState(false)
    const [name, setName] = React.useState(user.name || "")
    const [password, setPassword] = React.useState("")
    const [profileImage, setProfileImage] = React.useState(user.profileImage || "")
    const [loading, setLoading] = React.useState(false)
    const [err, setErr] = React.useState<string | null>(null)

    async function submit() {
        setLoading(true); setErr(null)
        try {
            const payload: any = { name }
            if (password) payload.password = password
            if (profileImage) payload.profileImage = profileImage

            const r = await fetch(`/api/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            const data = await r.json().catch(() => ({}))
            if (!r.ok) throw new Error(data?.message || "Update failed")

            toast.success("User updated")
            setOpen(false)
            onUpdated?.()
        } catch (e: any) {
            const msg = e?.message || "Terjadi kesalahan"
            setErr(msg); toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Edit</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
                <div className="grid gap-3">
                    <div className="grid gap-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="password">New Password (optional)</Label>
                        <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="profileImage">Profile Image URL (optional)</Label>
                        <Input id="profileImage" value={profileImage} onChange={e => setProfileImage(e.target.value)} />
                    </div>
                    {err && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{err}</p>}
                </div>
                <DialogFooter>
                    <Button onClick={submit} disabled={loading} className="bg-[oklch(var(--brand-primary))]">
                        {loading ? "Saving..." : "Save changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
