/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, LogIn } from "lucide-react"

export default function LoginForm() {
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [showPw, setShowPw] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [err, setErr] = React.useState<string | null>(null)

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setErr(null)
        try {
            const r = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })
            const data = await r.json().catch(() => ({} as any))

            if (!r.ok) {
                throw new Error(data?.message || "Login gagal")
            }

            // redirect sederhana
            window.location.href = "/"
        } catch (e: any) {
            setErr(e?.message || "Terjadi kesalahan")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="shadow-soft border-emerald-100">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Masuk</CardTitle>
                <CardDescription>Silakan masuk menggunakan akun Anda</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="nama@contoh.com"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="focus:ring-2 focus:ring-[oklch(var(--brand-primary))]"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <a href="/auth/forgot" className="text-sm text-emerald-700 hover:underline">
                                Lupa password?
                            </a>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPw ? "text" : "password"}
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pr-10 focus:ring-2 focus:ring-[oklch(var(--brand-primary))]"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw((s) => !s)}
                                className="absolute inset-y-0 right-2 flex items-center"
                                aria-label={showPw ? "Sembunyikan password" : "Lihat password"}
                            >
                                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {err && (
                        <p
                            className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2"
                            role="alert"
                        >
                            {err}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[oklch(var(--brand-primary))] hover:opacity-95"
                    >
                        <LogIn className="mr-2 h-4 w-4" />
                        {loading ? "Masuk..." : "Masuk"}
                    </Button>

                    <div className="h-1 rounded bg-[oklch(var(--brand-accent)/0.7)] mt-1" />
                </form>
            </CardContent>
        </Card>
    )
}
