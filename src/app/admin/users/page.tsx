"use client"
import { Card } from "@/components/ui/card"
import UserCreateForm from "@/components/users/UserCreateForm"
import UsersTable from "@/components/users/UsersTable"
import { Toaster } from "sonner"

export default function UsersPage() {
  return (
    <main className="space-y-6">
      <Toaster richColors />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Create, update, and manage platform users.</p>
      </div>

      <Card className="p-4 space-y-4">
        <h2 className="font-medium">Create User</h2>
        <UserCreateForm onCreated={() => window.dispatchEvent(new Event("users:refresh"))} />
      </Card>

      <UsersTable />
    </main>
  )
}
