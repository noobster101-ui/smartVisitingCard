import { AUTH_CONFIG } from "./auth"
import { getUserByEmail, createUser } from "@/services/user-service"

export async function ensureAdminExists() {
  const existing = await getUserByEmail(AUTH_CONFIG.adminEmail)
  if (!existing) {
    await createUser({
      name: "Admin",
      email: AUTH_CONFIG.adminEmail,
      password: AUTH_CONFIG.adminPassword,
      role: "admin",
    })
  }
}
