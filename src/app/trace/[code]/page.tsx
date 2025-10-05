/* eslint-disable @typescript-eslint/no-explicit-any */
// app/trace/[code]/page.tsx
import { notFound } from "next/navigation";

const API_URL = process.env.API_URL!; // server-side fetch

// ===== Types =====
type ProductStatus = "PENDING" | "NEED_APPROVAL" | "READY_FOR_DISTRIBUTION" | "DISTRIBUTED";
type BatchStatus = "PENDING" | "DELIVERED" | "REJECTED";

interface Nutrition {
    id: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    vitamins?: string | null;
}

interface ProductBatchRef {
    batchId: string;
}

interface Product {
    id: string;
    name: string;
    status: ProductStatus;
    nutrition?: Nutrition | null;
    batches?: ProductBatchRef[];
}

interface Batch {
    id: string;
    materialName: string;
    weight: number;
    status: BatchStatus;
    createdAt?: string;
}

// ===== Dummy data =====
const DUMMY_PRODUCTS: Record<string, Product> = {
    "P001": {
        id: "P001",
        name: "Nasi Ayam Rica-Rica",
        status: "READY_FOR_DISTRIBUTION",
        nutrition: { id: "N001", calories: 450, protein: 22, fat: 10, carbs: 60, vitamins: "A, C" },
        batches: [{ batchId: "B041" }, { batchId: "B092" }],
    },
    "P002": {
        id: "P002",
        name: "Bubur Kacang Hijau",
        status: "DISTRIBUTED",
        nutrition: { id: "N002", calories: 320, protein: 12, fat: 6, carbs: 48, vitamins: "B1, B6" },
        batches: [{ batchId: "B101" }],
    },
};

const DUMMY_BATCHES: Record<string, Batch> = {
    "B041": { id: "B041", materialName: "Beras Pandan Wangi", weight: 25, status: "PENDING", createdAt: "2025-10-02" },
    "B092": { id: "B092", materialName: "Ayam Fillet", weight: 15, status: "DELIVERED", createdAt: "2025-10-03" },
    "B101": { id: "B101", materialName: "Kacang Hijau", weight: 30, status: "PENDING", createdAt: "2025-10-01" },
};

// ===== Utils =====
async function fetchJSON(url: string) {
    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

// ambil dummy jika ada
function getDummyByCode(code: string): { product?: Product; batch?: Batch } | null {
    if (DUMMY_PRODUCTS[code]) return { product: DUMMY_PRODUCTS[code] };
    if (DUMMY_BATCHES[code]) return { batch: DUMMY_BATCHES[code] };
    return null;
}

// ===== Page =====
export default async function TracePage({
    params,
    searchParams,
}: {
    params: { code: string };
    searchParams?: Record<string, string | string[] | undefined>;
}) {
    const code = decodeURIComponent(params.code || "").trim();

    // Jika paksa dummy via ?mock=1
    const forceMock = searchParams?.mock === "1";

    if (!code) notFound();

    // 1) Coba Product dari API (skip jika forceMock)
    let product: Product | null = null;
    if (!forceMock) {
        const apiProduct = await fetchJSON(`${API_URL}/products/${code}`);
        if (apiProduct) product = apiProduct as Product;
    }
    // 2) Coba Batch dari API (skip jika forceMock)
    let batch: Batch | null = null;
    if (!forceMock && !product) {
        const apiBatch = await fetchJSON(`${API_URL}/batches/${code}`);
        if (apiBatch) batch = apiBatch as Batch;
    }
    // 3) Fallback ke dummy
    if (!product && !batch) {
        const mock = getDummyByCode(code);
        if (mock?.product) product = mock.product;
        if (!product && mock?.batch) batch = mock.batch;
    }

    // Render
    if (product) {
        return (
            <main className="container mx-auto p-4 space-y-4">
                <section className="rounded-md border p-4">
                    <h1 className="text-2xl font-semibold">🍱 Product: {product.name}</h1>
                    <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                    <div className="mt-2">Status: <span className="font-medium">{product.status}</span></div>

                    {product.nutrition && (
                        <div className="mt-4 grid md:grid-cols-2 gap-2 text-sm">
                            <div>Calories: <b>{product.nutrition.calories}</b> kcal</div>
                            <div>Protein: <b>{product.nutrition.protein}</b> g</div>
                            <div>Fat: <b>{product.nutrition.fat}</b> g</div>
                            <div>Carbs: <b>{product.nutrition.carbs}</b> g</div>
                            {product.nutrition.vitamins && <div>Vitamins: {product.nutrition.vitamins}</div>}
                        </div>
                    )}

                    {Array.isArray(product.batches) && product.batches.length > 0 && (
                        <div className="mt-6">
                            <h2 className="font-medium mb-2">Batches</h2>
                            <ul className="list-disc pl-5 text-sm">
                                {product.batches.map((b) => (
                                    <li key={b.batchId} className="leading-6">{b.batchId}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>

                {/* CTA ke perjalanan / detail lain sesuai kebutuhan */}
                <section className="rounded-md border p-4">
                    <h3 className="font-semibold mb-2">Journey & Details</h3>
                    <p className="text-sm text-muted-foreground">
                        This is a mock view. Replace with real distribution timeline later.
                    </p>
                </section>
            </main>
        );
    }

    if (batch) {
        return (
            <main className="container mx-auto p-4 space-y-4">
                <section className="rounded-md border p-4">
                    <h1 className="text-2xl font-semibold">🆔 Batch #{batch.id}</h1>
                    <div className="mt-2">Material: <b>{batch.materialName}</b></div>
                    <div>Weight: <b>{batch.weight}</b> kg</div>
                    <div>Status: <span className="font-medium">{batch.status}</span></div>
                    {batch.createdAt && (
                        <div className="text-sm text-muted-foreground mt-1">
                            Created At: {new Date(batch.createdAt).toLocaleDateString()}
                        </div>
                    )}
                </section>

                <section className="rounded-md border p-4">
                    <h3 className="font-semibold mb-2">Related Products</h3>
                    <p className="text-sm text-muted-foreground">
                        This is a mock section. Map this batch to products when API is ready.
                    </p>
                </section>
            </main>
        );
    }

    // Tidak ketemu apa pun
    notFound();
}
