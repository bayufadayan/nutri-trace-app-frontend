"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QrCode } from "lucide-react"
import * as React from "react"
import Image from "next/image"

const BACKEND = process.env.NEXT_PUBLIC_API_BASE

export default function BatchQRCodeButton({ qrPath, id }: { qrPath?: string | null; id: string }) {
    const src = qrPath ? `${BACKEND}${qrPath}` : undefined
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <QrCode className="h-4 w-4 mr-1" /> QR
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>QR Code — {id}</DialogTitle></DialogHeader>
                {src ? (
                    <div className="flex justify-center">
                        <Image
                            src={src}
                            alt={`QR ${id}`}
                            width={320}
                            height={320}
                            className="object-contain"
                            sizes="320px"
                        />
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">QR belum tersedia.</p>
                )}
                {src && (
                    <a className="text-center text-sm underline text-emerald-700" href={src} target="_blank" rel="noreferrer">
                        Buka gambar di tab baru
                    </a>
                )}
            </DialogContent>
        </Dialog>
    )
}
