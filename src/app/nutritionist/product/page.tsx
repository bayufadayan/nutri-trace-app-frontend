/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [nutritions, setNutritions] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [form, setForm] = useState<any>({ name: "", nutritionId: "", status: "PENDING", chefName: "", batches: [] as { batchId: string }[] });

    const load = async () => {
        const [p, n, b] = await Promise.all([
            api.get("/products"), api.get("/nutritions"), api.get("/batches"),
        ]);
        setProducts(p.data); setNutritions(n.data); setBatches(b.data);
    };
    useEffect(() => { load(); }, []);

    const createOne = async () => {
        await api.post("/products", form);
        setForm({ name: "", nutritionId: "", status: "PENDING", chefName: "", batches: [] });
        await load();
    };

    return (
        <main className="container mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-semibold">Products</h1>

            <Card className="p-4 space-y-2">
                <div className="grid sm:grid-cols-2 gap-2">
                    <Input placeholder="Name" value={form.name} onChange={e => setForm((v: any) => ({ ...v, name: e.target.value }))} />
                    <Input placeholder="NutritionId" value={form.nutritionId} onChange={e => setForm((v: any) => ({ ...v, nutritionId: e.target.value }))} />
                    <Input placeholder="Status" value={form.status} onChange={e => setForm((v: any) => ({ ...v, status: e.target.value }))} />
                    <Input placeholder="Chef Name" value={form.chefName} onChange={e => setForm((v: any) => ({ ...v, chefName: e.target.value }))} />
                </div>
                <div className="text-sm">Add batch IDs (comma separated)</div>
                <Input placeholder="batchId1,batchId2" onChange={e => {
                    const arr = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                    setForm((v: any) => ({ ...v, batches: arr.map(id => ({ batchId: id })) }));
                }} />
                <Button onClick={createOne}>Create</Button>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {products.map((p: any) => (
                    <Card key={p.id} className="p-4 space-y-1">
                        <div className="font-semibold">🍱 {p.name}</div>
                        <div>Nutrition: {p.nutritionId}</div>
                        <div>Status: {p.status}</div>
                        {Array.isArray(p.batches) && <div className="text-sm">Batches: {p.batches.map((b: any) => b.batchId).join(", ")}</div>}
                    </Card>
                ))}
            </div>
        </main>
    );
}