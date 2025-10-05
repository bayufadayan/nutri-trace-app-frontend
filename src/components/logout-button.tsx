// components/logout-button.tsx
"use client";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
    return (
        <Button
            variant="secondary"
            onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/";
            }}
        >
            Logout
        </Button>
    );
}