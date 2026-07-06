import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <div className="text-9xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          404
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Page Not Found</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center h-10 px-6 rounded-lg border border-input bg-background font-medium hover:bg-accent transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
