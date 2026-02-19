import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, Code, Zap, Globe } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <header className="container mx-auto px-4 pt-20 pb-32">
        <nav className="flex justify-between items-center mb-16">
          <div className="text-2xl font-bold">AI Builder</div>
          <Link href="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </nav>

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl font-bold tracking-tight">
            Build Websites with
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}AI Magic
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Chat with AI to create stunning landing pages, portfolios, and e-commerce sites. 
            Deploy instantly with custom domains.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Building
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-lg px-8">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Code Generation</h3>
            <p className="text-slate-600">
              Multiple AI providers (GPT-4, Claude, DeepSeek) generate production-ready code from your descriptions.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Preview</h3>
            <p className="text-slate-600">
              See your website come to life instantly with live preview as you chat with AI.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Deployment</h3>
            <p className="text-slate-600">
              Deploy to subdomain or custom domain with automatic SSL in one click.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Simple Credit-Based Pricing</h2>
          <p className="text-xl text-slate-600">
            Pay only for what you use. Choose the AI model that fits your budget.
          </p>
          <div className="bg-white p-8 rounded-xl shadow-md max-w-md mx-auto mt-8">
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span>DeepSeek Coder</span>
                <span className="font-semibold">1 credit</span>
              </div>
              <div className="flex justify-between">
                <span>GPT-4o Mini</span>
                <span className="font-semibold">3 credits</span>
              </div>
              <div className="flex justify-between">
                <span>GPT-4</span>
                <span className="font-semibold">10 credits</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-slate-600">100 credits = $10</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center text-slate-600">
        <p>&copy; 2026 AI Builder. Build smarter, deploy faster.</p>
      </footer>
    </div>
  )
}
