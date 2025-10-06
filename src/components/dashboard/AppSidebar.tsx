// src/components/dashboard/AppSidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NavItem, IconName } from "@/config/nav"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
    Menu,
    LayoutDashboard,
    Users,
    Boxes,
    Truck,
    Utensils,
    HandPlatter,
    Settings,
    type LucideIcon,
} from "lucide-react"
import * as React from "react"

// peta nama->komponen (client-only)
const ICONS: Record<IconName, LucideIcon> = {
    "layout-dashboard": LayoutDashboard,
    "users": Users,
    "boxes": Boxes,
    "truck": Truck,
    "utensils": Utensils,
    "hand-platter": HandPlatter,
    "settings": Settings,
}

export function AppSidebar({
    items,
    title = "NutriTrace",
}: {
    items: NavItem[]
    title?: string
}) {
    const [open, setOpen] = React.useState(false)

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r bg-white/70 backdrop-blur">
                <div className="h-14 flex items-center px-4 border-b font-semibold">
                    {title}
                </div>
                <ScrollArea className="flex-1">
                    <nav className="p-2 space-y-1">
                        {items.map((item) => (
                            <SidebarLink key={item.href} item={item} />
                        ))}
                    </nav>
                </ScrollArea>
            </aside>

            {/* Mobile trigger */}
            <div className="lg:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <div className="h-14 flex items-center px-4 border-b font-semibold">
                            {title}
                        </div>
                        <ScrollArea className="h-[calc(100vh-3.5rem)]">
                            <nav className="p-2 space-y-1">
                                {items.map((item) => (
                                    <SidebarLink key={item.href} item={item} onNavigate={() => setOpen(false)} />
                                ))}
                            </nav>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}

function SidebarLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
    const pathname = usePathname()
    const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
    const Icon = ICONS[item.icon] ?? LayoutDashboard

    return (
        <Link
            href={item.href}
            onClick={onNavigate}
            className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                "hover:bg-[oklch(var(--brand-primary)/0.08)] hover:text-[oklch(var(--brand-primary))]",
                isActive
                    ? "bg-[oklch(var(--brand-primary)/0.12)] text-[oklch(var(--brand-primary))] font-medium"
                    : "text-neutral-700"
            )}
        >
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
        </Link>
    )
}
