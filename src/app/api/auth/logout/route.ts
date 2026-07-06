import { NextResponse } from "next/server"
import { destroySession } from "@/services/auth-service"

export async function GET(request: Request) {
  await destroySession()
  const url = new URL(request.url)
  return NextResponse.redirect(new URL("/login", url.origin))
}
