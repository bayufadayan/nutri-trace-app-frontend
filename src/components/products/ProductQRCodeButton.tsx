// src/components/products/ProductQRCodeButton.tsx
"use client"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QrCode } from "lucide-react"

const BACKEND = process.env.NEXT_PUBLIC_API_BASE

export default function ProductQRCodeButton({ id, qrPath }: { id: string; qrPath?: string | null }) {
    const src = qrPath ? `${BACKEND}${qrPath}` : undefined
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm"><QrCode className="h-4 w-4 mr-1" /> QR</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>QR — {id}</DialogTitle></DialogHeader>
                {src ? (
                    <div className="relative mx-auto h-[320px] w-[320px]">
                        <Image src={src} alt={`QR ${id}`} fill sizes="320px" className="object-contain" />
                    </div>
                ) : <p className="text-sm text-muted-foreground">QR belum tersedia.</p>}
                {src && <a className="text-sm underline text-emerald-700" href={src} target="_blank">Buka di tab baru</a>}
            </DialogContent>
        </Dialog>
    )
}
