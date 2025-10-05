"use client";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import QRScanner from "@/components/qr-scanner";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  
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
        </Card>
      </div>
    </main>
  );
}