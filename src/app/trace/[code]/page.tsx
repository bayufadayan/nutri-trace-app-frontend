// app/trace/[code]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import { Package, Utensils, Boxes, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const API_BASE = process.env.API_BASE! // pastikan ada di .env.local

async function fetchJSON<T>(url: string): Promise<T | null> {
    try {
        const res = await fetch(url, { cache: "no-store" })
        if (!res.ok) return null
        return (await res.json()) as T
    } catch {
        return null
    }
}

/** ==== Types (ringkas sesuai response) ==== */
type Nutrition = {
    id: string
    calories: number
    protein: number
    fat: number
    carbs: number
    vitamins: string
}

type ProductBatchRef = {
    id: string
    productId: string
    batchId: string
    /** OPTIONAL HINT: kalau API kamu mengembalikan distributionIds per batch ref */
    distributionIds?: string[]
}

type Product = {
    id: string
    name: string
    status: string
    createdAt?: string
    qrCode?: string | null
    chefName?: string | null
    nutrition?: Nutrition | null
    batches?: ProductBatchRef[]
}

type Batch = {
    id: string
    producerId: string
    materialName: string
    weight: number
    createdAt: string
    status: string
    qrCode?: string | null
    /** OPTIONAL HINT: beberapa API expose distributionIds di dalam Batch */
    distributionIds?: string[]
}

type Distribution = {
    id: string
    batchId: string
    driverName: string
    truckId: string
    fromLocation: string
    toLocation: string
    sentAt: string | null
    receivedAt: string | null
    status: string
}

/** ==== Helper robust: variasi endpoint ==== */
async function getProductById(id: string) {
    return (await fetchJSON<Product>(`${API_BASE}/products/${encodeURIComponent(id)}`))
        ?? (await fetchJSON<Product>(`${API_BASE}/api/products/${encodeURIComponent(id)}`))
}

async function getBatchById(id: string) {
    return (await fetchJSON<Batch>(`${API_BASE}/batches/${encodeURIComponent(id)}`))
        ?? (await fetchJSON<Batch>(`${API_BASE}/api/batches/${encodeURIComponent(id)}`))
}

async function getDistributionById(id: string) {
    // Coba beberapa path umum untuk GET by id
    return (await fetchJSON<Distribution>(`${API_BASE}/distributions/${encodeURIComponent(id)}`))
        ?? (await fetchJSON<Distribution>(`${API_BASE}/api/distributions/${encodeURIComponent(id)}`))
        ?? (await fetchJSON<Distribution>(`${API_BASE}/distribution/${encodeURIComponent(id)}`))
        ?? null
}

async function getDistributionsByBatchId(batchId: string) {
    // Fallback “by batch” kalau tidak ada daftar ID
    // Coba pola endpoint yang umum
    return (await fetchJSON<Distribution[]>(`${API_BASE}/batches/${encodeURIComponent(batchId)}/distributions`))
        ?? (await fetchJSON<Distribution[]>(`${API_BASE}/api/batches/${encodeURIComponent(batchId)}/distributions`))
        ?? (await fetchJSON<Distribution[]>(`${API_BASE}/distributions/by-batch/${encodeURIComponent(batchId)}`))
        ?? (await fetchJSON<Distribution[]>(`${API_BASE}/api/distributions/by-batch/${encodeURIComponent(batchId)}`))
        ?? (await fetchJSON<Distribution[]>(`${API_BASE}/distributions?batchId=${encodeURIComponent(batchId)}`))
        ?? (await fetchJSON<Distribution[]>(`${API_BASE}/api/distributions?batchId=${encodeURIComponent(batchId)}`))
        ?? []
}

/** Ambil distribusi “satu-satu” jika ada hintedIds; jika tidak, fallback by-batch */
async function resolveDistributionsForBatch(batchId: string, hintedIds?: string[]) {
    if (hintedIds && hintedIds.length > 0) {
        const items = (await Promise.all(hintedIds.map(id => getDistributionById(id)))).filter(Boolean) as Distribution[]
        return items
    }
    return await getDistributionsByBatchId(batchId)
}

/** ==== UI Utilities ==== */
function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
    return (
        <section className="rounded-2xl border p-4 shadow-sm bg-white">
            <div className="flex items-center gap-2">
                {icon}
                <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            <div className="mt-3 text-sm">{children}</div>
        </section>
    )
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${className}`}>{children}</span>
}

function productStatusClass(s: string) {
    switch (s) {
        case "PENDING": return "bg-amber-500 text-white"
        case "NEED_APPROVAL": return "bg-blue-600 text-white"
        case "READY_FOR_DISTRIBUTION": return "bg-emerald-600 text-white"
        case "DISTRIBUTED": return "bg-emerald-700 text-white"
        default: return "bg-neutral-700 text-white"
    }
}

function shipmentStatusClass(s: string) {
    switch (s) {
        case "IN_TRANSIT": return "bg-amber-500 text-white"
        case "RECEIVED": return "bg-emerald-600 text-white"
        case "DELIVERED": return "bg-emerald-700 text-white"
        default: return "bg-neutral-700 text-white"
    }
}

const fmt = (d?: string | null) => (d ? new Date(d).toLocaleString() : "—")

/** ==== Next 15 types (params Promise) ==== */
type PageProps = {
    params: Promise<{ code: string }>
    searchParams?: Promise<Record<string, string | string[] | undefined>>
}

/** ==== Page ==== */
export default async function TracePage({ params }: PageProps) {
    const { code } = await params

    // 1) Coba resolve sebagai PRODUCT
    const product = await getProductById(code)
    if (product) {
        // Ambil detail batch (agar punya materialName/weight/status/qrCode/optionally distributionIds)
        const batchIds = (product.batches ?? []).map(b => b.batchId)
        const batchDetails = (
            await Promise.all(batchIds.map((id) => getBatchById(id)))
        ).filter(Boolean) as Batch[]

        // Mapping hint distributionIds dari product.batches (kalau API kamu sediakan)
        const hintDistIdsByBatch = new Map<string, string[]>()
        for (const b of (product.batches ?? [])) {
            if (b.distributionIds?.length) hintDistIdsByBatch.set(b.batchId, b.distributionIds)
        }

        // Resolve distribusi per-batch:
        const distByBatch = new Map<string, Distribution[]>()
        await Promise.all(batchDetails.map(async (b) => {
            const hinted = hintDistIdsByBatch.get(b.id) // hint dari product.batches
            const dists = await resolveDistributionsForBatch(b.id, hinted)
            distByBatch.set(b.id, dists)
        }))

        const qrSrc = product.qrCode ? `${API_BASE}${product.qrCode}` : null

        return (
            <main className="container mx-auto max-w-4xl p-4 space-y-6">
                <Link
                    href={"/"}
                    className="mb-5"
                >
                    <Button className="w-full bg-neutral-900 hover:opacity-95">
                        Back Home
                    </Button>
                </Link>
                {/* Header Product */}
                <div className="rounded-2xl border p-6 bg-white shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-[oklch(var(--brand-primary))]" />
                                <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <Badge className={productStatusClass(product.status)}>{product.status}</Badge>
                                {product.chefName && (
                                    <span className="text-sm text-neutral-600">
                                        Chef: <span className="font-medium">{product.chefName}</span>
                                    </span>
                                )}
                                {product.createdAt && (
                                    <span className="text-sm text-neutral-600">Created: {fmt(product.createdAt)}</span>
                                )}
                                <span className="text-xs text-neutral-500 font-mono">ID: {product.id}</span>
                            </div>
                        </div>

                        {/* QR Produk */}
                        {qrSrc && (
                            <div className="relative h-[120px] w-[120px] rounded border bg-white/60">
                                <Image src={qrSrc} alt={`QR ${product.id}`} fill sizes="120px" className="object-contain p-2" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Nutrition */}
                {product.nutrition && (
                    <Section title="Nutrition" icon={<Utensils className="h-4 w-4" />}>
                        <div className="grid sm:grid-cols-5 gap-3">
                            <div className="rounded border p-3">
                                <div className="text-xs text-neutral-500">Calories</div>
                                <div className="text-base font-semibold">{product.nutrition.calories} kcal</div>
                            </div>
                            <div className="rounded border p-3">
                                <div className="text-xs text-neutral-500">Protein</div>
                                <div className="text-base font-semibold">{product.nutrition.protein} g</div>
                            </div>
                            <div className="rounded border p-3">
                                <div className="text-xs text-neutral-500">Fat</div>
                                <div className="text-base font-semibold">{product.nutrition.fat} g</div>
                            </div>
                            <div className="rounded border p-3">
                                <div className="text-xs text-neutral-500">Carbs</div>
                                <div className="text-base font-semibold">{product.nutrition.carbs} g</div>
                            </div>
                            <div className="rounded border p-3 sm:col-span-1">
                                <div className="text-xs text-neutral-500">Vitamins</div>
                                <div className="text-sm">{product.nutrition.vitamins}</div>
                            </div>
                        </div>
                    </Section>
                )}

                {/* Batches terkait */}
                <Section title="Related Batches" icon={<Boxes className="h-4 w-4" />}>
                    {batchDetails.length === 0 ? (
                        <p className="text-sm text-neutral-600">Tidak ada batch terkait.</p>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            {batchDetails.map((b) => {
                                const qr = b.qrCode ? `${API_BASE}${b.qrCode}` : null
                                const dists = (distByBatch.get(b.id) ?? []).sort((a, z) =>
                                    new Date(z.sentAt ?? 0).getTime() - new Date(a.sentAt ?? 0).getTime()
                                )
                                return (
                                    <div key={b.id} className="rounded-lg border p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="text-sm text-neutral-500">Material</div>
                                                <div className="text-base font-semibold">{b.materialName}</div>
                                                <div className="mt-1 text-xs text-neutral-600">
                                                    Weight: <span className="font-medium">{b.weight} kg</span>
                                                </div>
                                                <div className="mt-1">
                                                    <Badge className={shipmentStatusClass(b.status)}>{b.status}</Badge>
                                                </div>
                                                <div className="mt-1 text-xs text-neutral-500">Created: {fmt(b.createdAt)}</div>
                                                <div className="mt-1 text-[11px] text-neutral-500 font-mono">ID: {b.id}</div>
                                            </div>

                                            {qr && (
                                                <div className="relative h-[88px] w-[88px] rounded border bg-white/60">
                                                    <Image src={qr} alt={`QR ${b.id}`} fill sizes="88px" className="object-contain p-1.5" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Link cepat lihat detail batch via trace */}
                                        <div className="mt-3">
                                            <a href={`/trace/${encodeURIComponent(b.id)}`} className="text-sm underline text-[oklch(var(--brand-primary))]">
                                                Lihat detail batch
                                            </a>
                                        </div>

                                        {/* Distribusi untuk batch ini */}
                                        <div className="mt-4 rounded-md border">
                                            <div className="flex items-center gap-2 px-3 py-2 border-b bg-neutral-50">
                                                <Truck className="h-4 w-4" />
                                                <div className="text-sm font-medium">Distributions</div>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full text-xs">
                                                    <thead className="bg-muted/30">
                                                        <tr>
                                                            <th className="text-left p-2">Route</th>
                                                            <th className="text-left p-2">Driver</th>
                                                            <th className="text-left p-2">Truck</th>
                                                            <th className="text-left p-2">Sent</th>
                                                            <th className="text-left p-2">Received</th>
                                                            <th className="text-left p-2">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dists.length === 0 ? (
                                                            <tr><td className="p-3 text-neutral-500" colSpan={6}>Belum ada distribusi</td></tr>
                                                        ) : dists.map(d => (
                                                            <tr key={d.id} className="border-t">
                                                                <td className="p-2">{d.fromLocation} → {d.toLocation}</td>
                                                                <td className="p-2">{d.driverName}</td>
                                                                <td className="p-2">{d.truckId}</td>
                                                                <td className="p-2">{fmt(d.sentAt)}</td>
                                                                <td className="p-2">{fmt(d.receivedAt)}</td>
                                                                <td className="p-2">
                                                                    <Badge className={shipmentStatusClass(d.status)}>{d.status}</Badge>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </Section>
            </main>
        )
    }

    // 2) Fallback: code sebagai BATCH
    const batch = await getBatchById(code)
    if (batch) {
        const qr = batch.qrCode ? `${API_BASE}${batch.qrCode}` : null

        // Ambil distribusi: prefer “by id satu-satu” jika batch.distributionIds tersedia
        const dists = await resolveDistributionsForBatch(batch.id, batch.distributionIds)

        return (
            <main className="container mx-auto max-w-3xl p-4 space-y-6">
                <div className="rounded-2xl border p-6 bg-white shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <Boxes className="h-5 w-5 text-[oklch(var(--brand-primary))]" />
                                <h1 className="text-2xl font-semibold tracking-tight">Batch</h1>
                            </div>
                            <div className="mt-2">
                                <div className="text-sm"><span className="text-neutral-500">Material:</span> <span className="font-medium">{batch.materialName}</span></div>
                                <div className="text-sm"><span className="text-neutral-500">Weight:</span> <span className="font-medium">{batch.weight} kg</span></div>
                                <div className="mt-1"><Badge className={shipmentStatusClass(batch.status)}>{batch.status}</Badge></div>
                                <div className="mt-1 text-xs text-neutral-500">Created: {fmt(batch.createdAt)}</div>
                                <div className="text-xs text-neutral-500 font-mono">ID: {batch.id}</div>
                            </div>
                        </div>
                        {qr && (
                            <div className="relative h-[120px] w-[120px] rounded border bg-white/60">
                                <Image src={qr} alt={`QR ${batch.id}`} fill sizes="120px" className="object-contain p-2" />
                            </div>
                        )}
                    </div>
                </div>

                <Section title="Distributions" icon={<Truck className="h-4 w-4" />}>
                    <div className="overflow-x-auto rounded border">
                        <table className="min-w-full text-sm">
                            <thead className="bg-muted/30">
                                <tr>
                                    <th className="text-left p-2">Route</th>
                                    <th className="text-left p-2">Driver</th>
                                    <th className="text-left p-2">Truck</th>
                                    <th className="text-left p-2">Sent</th>
                                    <th className="text-left p-2">Received</th>
                                    <th className="text-left p-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dists.length === 0 ? (
                                    <tr><td className="p-4 text-neutral-500" colSpan={6}>Belum ada distribusi.</td></tr>
                                ) : dists
                                    .sort((a, z) => new Date(z.sentAt ?? 0).getTime() - new Date(a.sentAt ?? 0).getTime())
                                    .map(d => (
                                        <tr key={d.id} className="border-t">
                                            <td className="p-2">{d.fromLocation} → {d.toLocation}</td>
                                            <td className="p-2">{d.driverName}</td>
                                            <td className="p-2">{d.truckId}</td>
                                            <td className="p-2">{fmt(d.sentAt)}</td>
                                            <td className="p-2">{fmt(d.receivedAt)}</td>
                                            <td className="p-2"><Badge className={shipmentStatusClass(d.status)}>{d.status}</Badge></td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </Section>
            </main>
        )
    }

    // 3) (opsional) tipe lain (Producer) bisa ditambah nanti
    return notFound()
}

/** (opsional) SEO */
export async function generateMetadata({ params }: PageProps) {
    const { code } = await params
    return { title: `Trace • ${code}`, description: `Trace info for ${code}` }
}
