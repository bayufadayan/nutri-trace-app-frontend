/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QrCode } from "lucide-react"

// dynamic import (client-only)
const Scanner = dynamic(
    () => import("@yudiel/react-qr-scanner").then(m => m.Scanner),
    { ssr: false }
)

type Props = {
    onDetected: (text: string) => void
    trigger?: React.ReactNode
    title?: string
}

export default function BatchQRScanDialog({ onDetected, trigger, title = "Scan QR Batch" }: Props) {
    const [open, setOpen] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    function handleScan(detectedCodes: any[]) {
        const text = detectedCodes?.[0]?.rawValue?.trim()
        if (!text) return
        onDetected(text)
        setOpen(false) // tutup begitu dapat hasil
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button variant="outline" size="sm">
                        <QrCode className="h-4 w-4 mr-1" /> Scan
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        Arahkan kamera ke QR code. Pastikan izin kamera diaktifkan.
                    </div>

                    <div className="relative h-[360px] w-full overflow-hidden rounded-md border">
                        {/* Render scanner hanya saat dialog terbuka */}
                        {open && (
                            <Scanner
                                allowMultiple={false}
                                scanDelay={300}
                                constraints={{ facingMode: "environment" } as MediaTrackConstraints}
                                onScan={handleScan}
                                onError={(e: any) => setError(e?.message || "Camera error")}
                            />
                        )}
                    </div>

                    {error && (
                        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
                            {error}
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
