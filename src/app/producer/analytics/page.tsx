/* eslint-disable @typescript-eslint/no-explicit-any */
// app/producer/analytics/page.tsx
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AnalyticsPage() {
    const [data, setData] = useState<any[]>([]);
    useEffect(() => {
        (async () => {
            const { data } = await api.get("/batches");
            const grouped = (Array.isArray(data) ? data : data?.items ?? []).reduce((acc: any, b: any) => {
                const d = new Date(b.createdAt).toISOString().slice(0, 10);
                acc[d] = (acc[d] || 0) + 1; return acc;
            }, {});
            setData(Object.entries(grouped).map(([date, count]) => ({ date, count })));
        })();
    }, []);

    return (
        <main className="container mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-semibold">Analytics</h1>
            <Card className="p-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </main>
    );
}