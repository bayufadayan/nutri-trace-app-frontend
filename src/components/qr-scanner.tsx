"use client";

import { useRouter } from "next/navigation";
import { Scanner } from "@yudiel/react-qr-scanner";
// (opsional) kalau mau type safety penuh:
// import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";

export default function QRScanner() {
    const router = useRouter();

    return (
        <div className="rounded overflow-hidden">
            <Scanner
                constraints={{ facingMode: "environment" } as MediaTrackConstraints}
                // detectedCodes: IDetectedBarcode[]
                onScan={(detectedCodes) => {
                    const text = detectedCodes?.[0]?.rawValue;
                    if (text) {
                        router.push(`/trace/${encodeURIComponent(text)}`);
                    }
                }}
                onError={(error) => {
                    console.error("QR Scan error:", error);
                }}
                allowMultiple={false}
                scanDelay={300}
            />
        </div>
    );
}
