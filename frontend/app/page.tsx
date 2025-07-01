import { Button } from '@/components/ui/Button'
import ConversionDemo from '@/components/ConversionDemo'
import PricingTable from '@/components/PricingTable'
import { 
  Zap, 
  Shield, 
  Code, 
  Globe, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  FileText,
  BarChart3,
  Users
} from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Convert Word HTML in milliseconds with our optimized algorithms'
  },
  {
    icon: Shield,
    title: 'Enterprise Ready',
    description: 'Rate limiting, API keys, and analytics built for production use'
  },
  {
    icon: Code,
    title: 'Developer First',
    description: 'Simple REST API with comprehensive documentation and examples'
  },
  {
    icon: Globe,
    title: 'Global CDN',
    description: 'Low latency worldwide with edge functions deployed globally'
  }
]

const stats = [
  { value: '99.9%', label: 'Uptime' },
  { value: '<100ms', label: 'Response Time' },
  { value: '500K+', label: 'Conversions Processed' },
  { value: '1000+', label: 'Happy Developers' }
]

const testimonials = [
  {
    quote: "This API saved us weeks of development time. The HTML cleanup is fantastic!",
    author: "Sarah Chen",
    role: "Lead Developer at TechCorp",
    avatar: "SC"
  },
  {
    quote: "Finally, a reliable solution for cleaning Word HTML. Perfect for our CMS.",
    author: "Mike Johnson",
    role: "CTO at ContentFlow",
    avatar: "MJ"
  },
  {
    quote: "The different cleanup levels give us exactly the control we need.",
    author: "Elena Rodriguez",
    role: "Frontend Engineer at WebStudio",
    avatar: "ER"
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Word to HTML</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm font-medium hover:text-primary">
              Docs
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button size="sm">
              Get API Key
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              Convert{' '}
              <span className="text-primary">Word HTML</span>
              {' '}to Clean, 
              <br className="hidden sm:block" />
              Optimized Code
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Remove unwanted Microsoft Word formatting while preserving essential structure. 
              Our powerful API cleans HTML in milliseconds with intelligent algorithms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="px-8">
                <Zap className="h-4 w-4 mr-2" />
                Get Started Free
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                <FileText className="h-4 w-4 mr-2" />
                View Documentation
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <ConversionDemo />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose Our API?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built by developers, for developers. Get the most reliable Word HTML conversion service available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to clean HTML conversion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Send HTML</h3>
              <p className="text-muted-foreground">
                POST your Word HTML content to our conversion endpoint
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">We Clean It</h3>
              <p className="text-muted-foreground">
                Our algorithms remove unwanted formatting while preserving structure
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Clean HTML</h3>
              <p className="text-muted-foreground">
                Receive optimized, clean HTML ready for your application
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Loved by Developers
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our users are saying about the API
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="card-content">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-medium">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">
                    "{testimonial.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing">
        <PricingTable />
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Clean Your HTML?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers using our API to convert Word HTML effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8">
              <Zap className="h-4 w-4 mr-2" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <FileText className="h-4 w-4 mr-2" />
              Read Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-bold">Word to HTML</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The most reliable API for converting Word HTML to clean, optimized code.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-foreground">Documentation</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground">Help Center</Link></li>
                <li><Link href="mailto:support@wordtohtml.dev" className="hover:text-foreground">Contact</Link></li>
                <li><Link href="/status" className="hover:text-foreground">Status</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Word to HTML SaaS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 