import { NextResponse } from "next/server"
import { destroySession } from "@/services/auth-service"

export async function POST() {
  await destroySession()
  return NextResponse.json({ success: true })
}
