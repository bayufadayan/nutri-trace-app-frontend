/* eslint-disable @typescript-eslint/no-explicit-any */
// app/nutritionist/nutritions/page.tsx
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NutritionsPage() {
    const [items, setItems] = useState<any[]>([]);
    const [form, setForm] = useState({ calories: 0, protein: 0, fat: 0, carbs: 0, vitamins: "" });
    const load = async () => { const { data } = await api.get("/nutritions"); setItems(data); };
    useEffect(() => { load(); }, []);

    const createOne = async () => { await api.post("/nutritions", form); setForm({ calories: 0, protein: 0, fat: 0, carbs: 0, vitamins: "" }); await load(); };

    return (
        <main className="container mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-semibold">Nutritions</h1>
            <Card className="p-4 grid sm:grid-cols-5 gap-2">
                {Object.keys(form).map((k) => (
                    <Input key={k} placeholder={k} value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} />
                ))}
                <Button className="sm:col-span-5" onClick={createOne}>Create</Button>
            </Card>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((n: any) => (
                    <Card key={n.id} className="p-4">
                        <div>Calories: {n.calories}</div>
                        <div>Protein: {n.protein} g</div>
                        <div>Fat: {n.fat} g</div>
                        <div>Carbs: {n.carbs} g</div>
                        <div>Vitamins: {n.vitamins}</div>
                    </Card>
                ))}
            </div>
        </main>
    );
}