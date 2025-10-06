// src/app/admin/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminHome() {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users and settings.</p>

            {/* contoh 3 cards ringkas */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">1,204</div>
                        <div className="text-xs text-neutral-500 mt-1">+4.2% vs last week</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Active Batches</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">48</div>
                        <div className="text-xs text-neutral-500 mt-1">Pending: 6</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Incidents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">2</div>
                        <div className="text-xs text-neutral-500 mt-1">0 new today</div>
                    </CardContent>
                </Card>
            </div>

            {/* placeholder area besar untuk chart/tabel */}
            <Card className="min-h-[320px]">
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-neutral-600">
                    (Chart or table goes here)
                </CardContent>
            </Card>
        </div>
    )
}
