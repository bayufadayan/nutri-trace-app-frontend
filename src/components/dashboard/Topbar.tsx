// src/components/dashboard/Topbar.tsx
"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import LogoutButton from "@/components/auth/LogoutButton"
import { Input } from "@/components/ui/input"

export default function Topbar({ role, name }: { role?: string | null; name?: string | null }) {
    const initials = (name || role || "U").slice(0, 2).toUpperCase()

    return (
        <header className="sticky top-0 z-30 h-14 border-b bg-white/70 backdrop-blur">
            <div className="container mx-auto px-4 h-full flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2 lg:hidden font-semibold">NutriTrace</div>

                <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl">
                    <Input placeholder="Search…" className="h-9" />
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-9 px-2">
                                <Avatar className="h-7 w-7">
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="text-sm font-medium">{name || "User"}</div>
                                <div className="text-xs text-neutral-500">{role || "Guest"}</div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <a href="/settings">Settings</a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className="px-2 pb-2">
                                <LogoutButton className="w-full" />
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
