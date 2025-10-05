// src/app/trace/[code]/page.tsx
import { notFound } from "next/navigation";

// Ambil dari .env.local
const API_URL = process.env.API_URL!; // pastikan ada, mis. http://localhost:4000

async function fetchJSON<T>(url: string): Promise<T | null> {
    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return null;
        return (await res.json()) as T;
    } catch {
        return null;
    }
}

// Tipe props untuk Next.js 15 (params & searchParams adalah Promise saat type-check build)
type PageProps = {
    params: Promise<{ code: string }>;
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

// ---- Tipe data API (sesuaikan jika skema API-mu beda) ----
type Nutrition = {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
};

type Product = {
    id: string;
    name: string;
    status?: string;
    nutrition?: Nutrition;
};

type Batch = {
    id: string;
    producerId: string;
    materialName: string;
    weight: number;
    status?: string;
    qrUrl?: string;
};

type Producer = {
    id: string;
    name: string;
    address?: string;
    contact?: string;
};

// ---- UI kecil untuk section ----
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-2xl border p-4 shadow-sm">
            <h2 className="text-lg font-semibold">{title}</h2>
            <div className="mt-2 text-sm">{children}</div>
        </section>
    );
}

// ---- Halaman utama ----
export default async function TracePage({ params }: PageProps) {
    const { code } = await params;

    // 1) Coba resolve sebagai Product
    const product = await fetchJSON<Product>(`${API_URL}/products/${encodeURIComponent(code)}`);
    if (product) {
        return (
            <main className="container mx-auto max-w-3xl p-4 space-y-4">
                <h1 className="text-2xl font-semibold">🍱 Product: {product.name}</h1>
                {product.status && <p className="text-sm">Status: {product.status}</p>}

                {product.nutrition && (
                    <Section title="Nutrition">
                        <ul className="list-disc pl-5">
                            {"calories" in product.nutrition! && (
                                <li>Calories: {product.nutrition!.calories} kcal</li>
                            )}
                            {"protein" in product.nutrition! && <li>Protein: {product.nutrition!.protein} g</li>}
                            {"carbs" in product.nutrition! && <li>Carbs: {product.nutrition!.carbs} g</li>}
                            {"fat" in product.nutrition! && <li>Fat: {product.nutrition!.fat} g</li>}
                        </ul>
                    </Section>
                )}
            </main>
        );
    }

    // 2) Coba resolve sebagai Batch
    const batch = await fetchJSON<Batch>(`${API_URL}/batches/${encodeURIComponent(code)}`);
    if (batch) {
        return (
            <main className="container mx-auto max-w-3xl p-4 space-y-4">
                <h1 className="text-2xl font-semibold">🧺 Batch: {batch.id}</h1>
                <p className="text-sm">Status: {batch.status ?? "-"}</p>

                <Section title="Detail Batch">
                    <ul className="list-disc pl-5">
                        <li>Material: {batch.materialName}</li>
                        <li>Weight: {batch.weight}</li>
                        <li>Producer ID: {batch.producerId}</li>
                    </ul>
                </Section>

                {batch.qrUrl && (
                    <Section title="QR Code">
                        {/* Jika qrUrl adalah path relatif yang diserve oleh Next public/, gambar bisa langsung ditampilkan */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={batch.qrUrl} alt="Batch QR" className="h-40 w-40 object-contain" />
                    </Section>
                )}
            </main>
        );
    }

    // 3) Coba resolve sebagai Producer
    const producer = await fetchJSON<Producer>(`${API_URL}/producers/${encodeURIComponent(code)}`);
    if (producer) {
        return (
            <main className="container mx-auto max-w-3xl p-4 space-y-4">
                <h1 className="text-2xl font-semibold">🏭 Producer: {producer.name}</h1>

                <Section title="Detail Producer">
                    <ul className="list-disc pl-5">
                        <li>ID: {producer.id}</li>
                        {producer.address && <li>Address: {producer.address}</li>}
                        {producer.contact && <li>Contact: {producer.contact}</li>}
                    </ul>
                </Section>
            </main>
        );
    }

    // Tidak ketemu apa pun
    return notFound();
}

// (Opsional) generateMetadata — ketik params sebagai Promise juga
export async function generateMetadata({ params }: PageProps) {
    const { code } = await params;
    return {
        title: `Trace • ${code}`,
        description: `Trace info for ${code}`,
    };
}
