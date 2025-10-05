// app/distributor/distributions/new/page.tsx
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewDistributionPage() {
    const sp = useSearchParams();
    const router = useRouter();
    const [form, setForm] = useState({
        batchId: sp.get("batchId") || "",
        driverName: "",
        truckId: "",
        fromLocation: "",
        toLocation: "",
        sentAt: new Date().toISOString(),
    });

    const submit = async () => {
        await api.post("/distributions", form);
        router.push("/distributor");
    };

    return (
        <main className="container mx-auto p-4">
            <Card className="p-4 grid gap-2 max-w-xl">
                <h1 className="text-xl font-semibold">Create Distribution</h1>
                {Object.entries(form).map(([k, v]) => (
                    <Input key={k} placeholder={k} value={String(v)} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
                ))}
                <Button onClick={submit}>Create</Button>
            </Card>
        </main>
    );
}