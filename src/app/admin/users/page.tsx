/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/users/page.tsx
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "PRODUCER" });

  const load = async () => {
    const { data } = await api.get("/users");
    setUsers(data);
  };

  useEffect(() => { load(); }, []);

  const createUser = async () => {
    await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", email: "", password: "", role: "PRODUCER" });
    await load();
  };

  return (
    <main className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Users</h1>

      <Card className="p-4 space-y-2">
        <h2 className="font-medium">Create User</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          <Input placeholder="Name" value={form.name} onChange={e=>setForm(v=>({...v,name:e.target.value}))}/>
          <Input placeholder="Email" type="email" value={form.email} onChange={e=>setForm(v=>({...v,email:e.target.value}))}/>
          <Input placeholder="Password" type="password" value={form.password} onChange={e=>setForm(v=>({...v,password:e.target.value}))}/>
          <Input placeholder="Role (SUPERADMIN/PRODUCER/DISTRIBUTOR/NUTRITIONIST)" value={form.role} onChange={e=>setForm(v=>({...v,role:e.target.value}))}/>
        </div>
        <Button onClick={createUser}>Create</Button>
      </Card>

      <Card className="p-0 overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Role</th>
              <th className="text-left p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u:any)=> (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">{new Date(u.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </main>
  );
}