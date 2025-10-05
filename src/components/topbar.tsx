// components/topbar.tsx
import Link from "next/link";
export default function Topbar() {
    return (
        <header className="border-b">
            <nav className="container mx-auto p-3 flex gap-3 text-sm">
                <Link className="font-semibold" href="/">NutriTrace</Link>
                <Link href="/producer">Producer</Link>
                <Link href="/distributor">Distributor</Link>
                <Link href="/nutritionist">Nutritionist</Link>
                <Link href="/admin">Admin</Link>
            </nav>
        </header>
    );
}