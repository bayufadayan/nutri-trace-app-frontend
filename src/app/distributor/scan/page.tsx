// app/distributor/scan/page.tsx
"use client";
import QRScanner from "@/components/qr-scanner";
import { Card } from "@/components/ui/card";

export default function DistributorScanPage() {
    return (
        <main className="container mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-semibold">Scan Batch</h1>
            <Card className="p-4">
                <QRScanner />
            </Card>
        </main>
    );
}