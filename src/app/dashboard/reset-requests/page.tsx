"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2, CheckCircle, XCircle, Clock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface ResetRequest {
  id: string
  user_id: string
  user_name: string
  user_email: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

export default function ResetRequestsPage() {
  const [requests, setRequests] = useState<ResetRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [passwords, setPasswords] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    try {
      const res = await fetch("/api/auth/reset-requests")
      if (res.ok) {
        const data = await res.json()
        setRequests(data)
      }
    } catch {
      toast.error("Failed to load requests")
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(requestId: string) {
    const password = passwords[requestId]
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setApprovingId(requestId)
    try {
      const res = await fetch("/api/auth/reset-requests/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, newPassword: password }),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Failed")
        return
      }
      toast.success("Password updated successfully")
      setPasswords((prev) => ({ ...prev, [requestId]: "" }))
      fetchRequests()
    } catch {
      toast.error("Failed")
    } finally {
      setApprovingId(null)
    }
  }

  async function handleReject(requestId: string) {
    setRejectingId(requestId)
    try {
      const res = await fetch("/api/auth/reset-requests/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      })
      if (res.ok) {
        toast.success("Request rejected")
        fetchRequests()
      }
    } catch {
      toast.error("Failed")
    } finally {
      setRejectingId(null)
    }
  }

  const pending = requests.filter((r) => r.status === "pending")
  const processed = requests.filter((r) => r.status !== "pending")

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Password Reset Requests</h1>
        <p className="text-muted-foreground mt-1">Review and manage user password reset requests.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {pending.length === 0 && processed.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border bg-card">
              <Clock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No reset requests</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Requests from users will appear here.</p>
            </div>
          ) : (
            <>
              {pending.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                    Pending ({pending.length})
                  </h2>
                  {pending.map((req) => (
                    <div key={req.id} className="rounded-2xl border bg-card p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{req.user_name}</p>
                          <p className="text-sm text-muted-foreground">{req.user_email}</p>
                          <p className="text-xs text-muted-foreground/60 mt-1">
                            Requested {new Date(req.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-amber-600 border-amber-200">
                          Pending
                        </Badge>
                      </div>
                      <div className="flex items-end gap-3">
                        <div className="flex-1 space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">New Password</label>
                          <Input
                            type="password"
                            placeholder="Set new password (min 6 chars)"
                            value={passwords[req.id] || ""}
                            onChange={(e) => setPasswords((prev) => ({ ...prev, [req.id]: e.target.value }))}
                          />
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(req.id)}
                          disabled={approvingId === req.id}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          {approvingId === req.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <><CheckCircle className="h-4 w-4 mr-1" /> Approve</>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(req.id)}
                          disabled={rejectingId === req.id}
                        >
                          {rejectingId === req.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <><XCircle className="h-4 w-4 mr-1" /> Reject</>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {processed.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                    History ({processed.length})
                  </h2>
                  {processed.map((req) => (
                    <div key={req.id} className="rounded-2xl border bg-card p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{req.user_name}</p>
                        <p className="text-xs text-muted-foreground">{req.user_email}</p>
                      </div>
                      <Badge
                        variant={req.status === "approved" ? "default" : "destructive"}
                        className={req.status === "approved" ? "bg-emerald-600" : ""}
                      >
                        {req.status === "approved" ? "Approved" : "Rejected"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
