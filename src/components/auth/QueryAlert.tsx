"use client"

import { useSearchParams } from "next/navigation"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function QueryAlert() {
    const params = useSearchParams()
    const msg = params.get("msg")
    const err = params.get("err")

    if (!msg && !err) return null

    const isError = Boolean(err)
    const title = isError ? "Gagal" : "Info"
    const text = isError ? err : msg

    return (
        <Alert className={`mb-4 ${isError ? "border-red-300" : "border-emerald-300"}`}>
            <AlertTitle className={isError ? "text-red-700" : "text-emerald-700"}>
                {title}
            </AlertTitle>
            <AlertDescription className={isError ? "text-red-600" : "text-emerald-700"}>
                {text}
            </AlertDescription>
        </Alert>
    )
}
