/* eslint-disable @typescript-eslint/no-explicit-any */
// app/producer/batches/page.tsx
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function BatchesPage() {
    const [batches, setBatches] = useState<any[]>([]);
    const [form, setForm] = useState({ materialName: "", weight: 0, status: "PENDING" });

    const load = async () => {
        const { data } = await api.get("/batches");
        setBatches(Array.isArray(data) ? data : data?.items ?? []);
    };

    useEffect(() => { load(); }, []);

    const createBatch = async () => {
        await api.post("/batches", form);
        setForm({ materialName: "", weight: 0, status: "PENDING" });
        await load();
    };

    const updateBatch = async (id: string, payload: any) => {
        await api.put(`/batches/${id}`, payload);
        await load();
    };

    return (
        <main className="container mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-semibold">Batches</h1>

            <Card className="p-4 space-y-2">
                <h2 className="font-medium">Create Batch</h2>
                <div className="grid sm:grid-cols-3 gap-2">
                    <Input placeholder="Material Name" value={form.materialName} onChange={e => setForm(v => ({ ...v, materialName: e.target.value }))} />
                    <Input placeholder="Weight (kg)" type="number" value={form.weight} onChange={e => setForm(v => ({ ...v, weight: Number(e.target.value) }))} />
                    <Input placeholder="Status" value={form.status} onChange={e => setForm(v => ({ ...v, status: e.target.value }))} />
                </div>
                <Button onClick={createBatch}>Create</Button>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {batches.map((b: any) => {
                    const locked = b.status === "DELIVERED";
                    return (
                        <Card key={b.id} className="p-4 space-y-1">
                            <div className="font-semibold">🆔 Batch #{b.id}</div>
                            <div>Material: {b.materialName}</div>
                            <div>Weight: {b.weight} kg</div>
                            <div>Status: {b.status}</div>
                            <div className="pt-2 flex gap-2">
                                <Button variant="secondary" disabled={locked} onClick={() => updateBatch(b.id, { status: "PENDING" })}>Edit</Button>
                                <Button disabled={locked} onClick={() => updateBatch(b.id, { status: "DELIVERED" })}>Mark Delivered</Button>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </main>
    );
}
