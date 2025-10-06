/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import * as React from "react"
import { ROLES, Role } from "./role"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function UserCreateForm({ onCreated }: { onCreated?: () => void }) {
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [role, setRole] = React.useState<Role>("PRODUCER")
    const [loading, setLoading] = React.useState(false)
    const [err, setErr] = React.useState<string | null>(null)

    async function submit() {
        setLoading(true); setErr(null)
        try {
            const r = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role }),
            })
            const data = await r.json().catch(() => ({}))
            if (!r.ok) throw new Error(data?.message || "Create user failed")
            toast.success("User created")
            setName(""); setEmail(""); setPassword(""); setRole("PRODUCER")
            onCreated?.()
        } catch (e: any) {
            const msg = e?.message || "Terjadi kesalahan"
            setErr(msg); toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid gap-3">
            <div className="grid sm:grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@company.com" />
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="********" />
                </div>
                <div className="grid gap-1.5">
                    <Label>Role</Label>
                    <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                        <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                        <SelectContent>
                            {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {err && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{err}</p>}

            <div>
                <Button onClick={submit} disabled={loading} className="bg-[oklch(var(--brand-primary))]">
                    {loading ? "Creating..." : "Create"}
                </Button>
            </div>
        </div>
    )
}
