import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SESSION_COOKIE = "svc_session"

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"]
const PUBLIC_API = ["/api/auth/login", "/api/auth/register", "/api/auth/forgot-password", "/api/init", "/api/settings/public"]
const PUBLIC_PREFIXES = ["/card/", "/_next", "/favicon", "/uploads"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.includes(pathname) || pathname === "/" || pathname.endsWith(".ico") || pathname.endsWith(".svg") || pathname.endsWith(".png")) {
    return NextResponse.next()
  }

  for (const prefix of PUBLIC_PREFIXES) {
    if (pathname.startsWith(prefix)) return NextResponse.next()
  }

  for (const api of PUBLIC_API) {
    if (pathname.startsWith(api)) return NextResponse.next()
  }

  const session = request.cookies.get(SESSION_COOKIE)?.value
  if (!session) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
