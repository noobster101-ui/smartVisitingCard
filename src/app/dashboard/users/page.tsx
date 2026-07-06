"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Loader2, Users, Shield, User, Trash2, Edit, X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import type { SafeUser } from "@/types"

export default function UsersPage() {
  const [users, setUsers] = useState<SafeUser[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<SafeUser | null>(null)
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editRole, setEditRole] = useState<"admin" | "user">("user")
  const [saving, setSaving] = useState(false)

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users")
      if (res.ok) {
        setUsers(await res.json())
      }
    } catch {
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleEdit = (user: SafeUser) => {
    setEditingUser(user)
    setEditName(user.name)
    setEditEmail(user.email)
    setEditRole(user.role)
  }

  const handleSave = async () => {
    if (!editingUser) return
    setSaving(true)
    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, email: editEmail, role: editRole }),
      })
      if (res.ok) {
        toast.success("User updated")
        setEditingUser(null)
        fetchUsers()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to update")
      }
    } catch {
      toast.error("Failed to update user")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (user: SafeUser) => {
    if (!confirm(`Delete ${user.name}? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("User deleted")
        fetchUsers()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to delete")
      }
    } catch {
      toast.error("Failed to delete user")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          User Management
        </h1>
        <p className="text-muted-foreground mt-1">Manage all registered users (Admin only)</p>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Joined</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                        {user.name[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{user.email}</td>
                  <td className="p-4">
                    <Badge variant={user.role === "admin" ? "default" : "secondary"} className="gap-1">
                      {user.role === "admin" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(user)}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      {user.role !== "admin" && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(user)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details and role.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={editRole === "user" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEditRole("user")}
                >
                  <User className="h-3.5 w-3.5 mr-1.5" /> User
                </Button>
                <Button
                  type="button"
                  variant={editRole === "admin" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEditRole("admin")}
                >
                  <Shield className="h-3.5 w-3.5 mr-1.5" /> Admin
                </Button>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setEditingUser(null)}>
                <X className="h-4 w-4 mr-1.5" /> Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
