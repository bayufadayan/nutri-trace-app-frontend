// src/app/auth/login/page.tsx
import { Suspense } from "react"
import LoginForm from "@/components/auth/LoginForm"
import QueryAlert from "@/components/auth/QueryAlert"
import { ShieldCheck, Lock, Leaf, Sparkles } from "lucide-react"

export default function Page() {
  return (
    <main className="min-h-svh body-bg">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 min-h-svh items-center py-10">
          {/* Kiri: minimal hero */}
          <section className="order-2 lg:order-1">
            {/* badge tipis */}
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium
                            border-[oklch(var(--brand-primary)/0.20)] text-[oklch(var(--brand-primary))]
                            bg-[oklch(var(--brand-surface))]">
              <Sparkles className="h-3.5 w-3.5" />
              Fokus, ringan, dan konsisten
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
              Area masuk yang tenang dan rapi
            </h1>
            <p className="mt-3 text-neutral-600 max-w-prose">
              Tampilan dibuat sederhana agar perhatianmu hanya pada yang penting. Warna utama hijau
              dengan aksen kuning lembut untuk nuansa yang segar.
            </p>

            {/* fitur ringkas */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              <Feature
                icon={<ShieldCheck className="h-4 w-4" />}
                title="Konsisten & responsif"
                desc="Skala dari mobile hingga desktop tanpa distraksi."
              />
              <Feature
                icon={<Lock className="h-4 w-4" />}
                title="Akses aman"
                desc="Rangka dasar siap integrasi session/JWT."
              />
              <Feature
                icon={<Leaf className="h-4 w-4" />}
                title="Palet hijau"
                desc="Hijau sebagai primernya, aksen kuning tipis."
              />
              <Feature
                icon={<Sparkles className="h-4 w-4" />}
                title="Tipografi bersih"
                desc="Kontras nyaman untuk mode terang."
              />
            </div>

            {/* garis aksen halus */}
            <div className="mt-10 h-1 w-28 rounded bg-[oklch(var(--brand-accent)/0.7)]" />
          </section>

          {/* Kanan: card login */}
          <section className="order-1 lg:order-2">
            <div className="mx-auto w-full max-w-md">
              <Suspense fallback={null}>
                <QueryAlert />
              </Suspense>
              <LoginForm />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

/** sub-komponen kecil untuk item fitur (server-safe) */
function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="group rounded-lg border bg-white/60 backdrop-blur-sm p-4
                    border-[color:oklch(var(--brand-primary)/0.15)]
                    hover:border-[color:oklch(var(--brand-primary)/0.3)]
                    transition-colors">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 p-1.5 rounded-md
                        bg-[oklch(var(--brand-primary)/0.08)]
                        text-[oklch(var(--brand-primary))]">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
          <p className="mt-1 text-sm text-neutral-600">{desc}</p>
        </div>
      </div>
    </div>
  )
}
