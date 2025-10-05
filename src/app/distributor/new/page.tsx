/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/distributor/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// export const metadata = {
//     title: "Distributor • New",
//     description: "Create new distributor",
// };

export default function DistributorNewPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setErr(null);
        try {
            const r = await fetch("/api/distributors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, address }),
            });
            if (!r.ok) {
                const data = await r.json().catch(() => ({}));
                throw new Error(data?.message || "Gagal menyimpan distributor");
            }
            router.push("/distributor"); // arahkan ke list page kamu
        } catch (e: any) {
            setErr(e?.message || "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="container mx-auto max-w-lg p-6 space-y-4">
            <h1 className="text-2xl font-semibold">New Distributor</h1>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="block text-sm">Name</label>
                    <input
                        className="w-full rounded border px-3 py-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="PT Maju Jaya"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm">Address</label>
                    <input
                        className="w-full rounded border px-3 py-2"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Jl. Sudirman No. 1"
                    />
                </div>

                {err && <p className="text-sm text-red-600">{err}</p>}

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded border px-4 py-2"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </main>
    );
}
