// src/app/producer/layout.tsx
import DashboardShell from "@/components/dashboard/DashboardShell"
export default function ProducerLayout({ children }: { children: React.ReactNode }) {
    return <DashboardShell>{children}</DashboardShell>
}