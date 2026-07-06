import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Layout, BarChart3, Mail, Phone, MapPin } from "lucide-react";

const features = [
  {
    title: "Instant Sharing",
    description: "Share your digital business card instantly via QR code, NFC, or link. No more fumbling with paper cards.",
    icon: Share2,
  },
  {
    title: "Multiple Templates",
    description: "Choose from a variety of professionally designed templates and customize them to match your brand perfectly.",
    icon: Layout,
  },
  {
    title: "Analytics Ready",
    description: "Track how often your card is viewed, shared, and saved. Gain insights into your networking efforts.",
    icon: BarChart3,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-sm bg-background/80 border-b">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Smart Visiting Card
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Register</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-blue-600/5" />
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col items-center text-center max-w-3xl gap-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Your Digital Business Card, Reimagined</h1>
            <p className="text-lg text-muted-foreground max-w-2xl sm:text-xl">
              Create beautiful, shareable digital visiting cards that leave a lasting impression. Share instantly, track engagement, and
              never run out of cards again.
            </p>
            <div className="flex gap-4 mt-4">
              <Button asChild size="lg" className="text-base">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="flex flex-col items-center px-6 py-20 bg-muted/30">
          <div className="flex flex-col items-center text-center max-w-2xl mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Everything you need to network better</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Powerful features designed to make sharing your professional identity effortless and impactful.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl w-full">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-sm">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="contact" className="flex flex-col items-center px-6 py-20">
          <div className="flex flex-col items-center text-center max-w-2xl mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Get in Touch</h2>
            <p className="mt-4 text-muted-foreground text-lg">Have questions or need help? We&apos;re here for you.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3 max-w-4xl w-full">
            <Card className="border-0 shadow-sm text-center">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Email</CardTitle>
              </CardHeader>
              <CardContent>
                <a href="mailto:raj9028503607@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  raj9028503607@gmail.com
                </a>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm text-center">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Phone</CardTitle>
              </CardHeader>
              <CardContent>
                <a href="tel:+919876543210" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  +91 7276330438
                </a>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm text-center">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Mumbai, Maharashtra, India</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row max-w-5xl mx-auto">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Smart Visiting Card. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link href="/login" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
