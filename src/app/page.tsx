"use client";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import QRScanner from "@/components/qr-scanner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function HomePage() {
  const APPLICATION_MODE = process.env.APPLICATION_MODE! || "DEMO";
  const router = useRouter();
  const [isCodeOpen, setIsCodeOpen] = useState(false);

  const handleCodeToggle = () => {
    setIsCodeOpen(!isCodeOpen);
  };

  return (
    <main className="container mx-auto p-4 space-y-6">
      <section className="text-center space-y-2">
        <h1 className="text-3xl font-bold">NutriTrace</h1>
        <p className="text-muted-foreground">Scan to trace nutrition & journey</p>
      </section>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Scan QR Code</h2>
          <QRScanner />
        </Card>
        <Card className="p-4 space-y-3">
          <h2 className="font-semibold">Manual Input</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const code = String(formData.get("code") || "").trim();
              if (code) router.push(`/trace/${encodeURIComponent(code)}`);
            }}
            className="flex gap-2"
          >
            <input
              name="code"
              placeholder="Enter code"
              className="border rounded px-3 py-2 flex-1"
            />
            <button type="submit" className="border rounded px-3 py-2">
              Trace
            </button>
          </form>

          <div className="text-sm text-muted-foreground">
            Admin? Go to{" "}
            <Link className="underline" href="/auth/login">
              Login
            </Link>
          </div>

          {APPLICATION_MODE === "DEMO" && (
            <>
              <button type="button" className="border rounded px-3 py-2" onClick={handleCodeToggle}>
                {isCodeOpen ? "Tutup Contoh Kode" : "Buka Contoh Kode"}
              </button>
              {isCodeOpen && (
                <div className="flex flex-col gap-2 justify-center items-center bg-neutral-900 p-4 rounded-2xl">
                  <h3 className="font-semibold text-white">UNTUK CONTOH SILAKAN BISA PAKAI KODE ATAU QR BERIKUT</h3>
                  <p className="text-sm text-muted-foreground">Kode:</p>
                  <p className="text-sm text-muted-foreground">ff2493d3-1241-4d5b-b6ff-c3c03af51da9</p>
                  <Image
                    src={"https://nutri-trace-backend.bayufadayan.my.id/qrcodes/ff2493d3-1241-4d5b-b6ff-c3c03af51da9.png"}
                    alt={`QR ff2493d3-1241-4d5b-b6ff-c3c03af51da9`}
                    width={320}
                    height={320}
                    className="object-contain"
                    sizes="320px"
                  />
                </div>
              )}
            </>
          )
          }
        </Card>
      </div>
    </main>
  );
}