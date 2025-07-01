'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Check, Star, Zap } from 'lucide-react'
import { generateApiKey } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface PricingPlan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  buttonText: string
  highlighted?: boolean
  apiLimit: string
  planId: 'free' | 'starter' | 'pro' | 'enterprise'
}

const plans: PricingPlan[] = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out the service',
    features: [
      '100 conversions per month',
      'Basic cleanup level',
      'API access',
      'Community support',
      'Basic documentation'
    ],
    buttonText: 'Get Started Free',
    apiLimit: '100/month',
    planId: 'free'
  },
  {
    name: 'Starter',
    price: '$9',
    period: 'per month',
    description: 'Great for small projects and personal use',
    features: [
      '2,000 conversions per month',
      'All cleanup levels',
      'Image & table preservation',
      'API access with higher limits',
      'Email support',
      'Usage analytics'
    ],
    buttonText: 'Start Free Trial',
    highlighted: true,
    apiLimit: '2K/month',
    planId: 'starter'
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'Perfect for businesses and agencies',
    features: [
      '10,000 conversions per month',
      'All cleanup levels',
      'Priority processing',
      'Advanced API features',
      'Priority support',
      'Custom integrations',
      'Usage analytics & reporting'
    ],
    buttonText: 'Start Free Trial',
    apiLimit: '10K/month',
    planId: 'pro'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For large-scale applications',
    features: [
      'Custom conversion limits',
      'Dedicated infrastructure',
      'Custom cleanup rules',
      'SLA guarantee',
      'Dedicated support',
      'White-label options',
      'Custom integrations',
      'On-premise deployment'
    ],
    buttonText: 'Contact Sales',
    apiLimit: 'Unlimited',
    planId: 'enterprise'
  }
]

export default function PricingTable() {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [showEmailInput, setShowEmailInput] = useState<string | null>(null)

  const handleGetStarted = async (planId: string) => {
    if (planId === 'enterprise') {
      window.open('mailto:sales@wordtohtml.dev?subject=Enterprise Plan Inquiry', '_blank')
      return
    }

    if (planId === 'free') {
      setShowEmailInput(planId)
      return
    }

    // For paid plans, also collect email first
    setShowEmailInput(planId)
  }

  const handleEmailSubmit = async (planId: string) => {
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(planId)
    try {
      const result = await generateApiKey({
        email: email.trim(),
        plan: planId as 'free' | 'starter' | 'pro' | 'enterprise'
      })

      if (result.success && result.apiKey) {
        toast.success('API key generated successfully!')
        
        // Show the API key in a modal or copy to clipboard
        const message = `Your API Key: ${result.apiKey}\n\nSave this key securely - you'll need it to make API calls.`
        
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(result.apiKey)
          toast.success('API key copied to clipboard!')
        }
        
        alert(message) // In a real app, you'd use a proper modal
        
        // Reset form
        setEmail('')
        setShowEmailInput(null)
      } else {
        toast.error(result.error || 'Failed to generate API key')
      }
    } catch (error) {
      console.error('Error generating API key:', error)
      toast.error('Failed to generate API key. Please try again.')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose the perfect plan for your needs. All plans include API access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card relative ${
                plan.highlighted
                  ? 'ring-2 ring-primary shadow-lg scale-105'
                  : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="card-header text-center">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period !== 'contact us' && (
                    <span className="text-muted-foreground">/{plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                
                <div className="mt-4 p-2 bg-primary/10 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-primary font-medium text-sm">
                    <Zap className="h-4 w-4" />
                    {plan.apiLimit} API calls
                  </div>
                </div>
              </div>

              <div className="card-content">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {showEmailInput === plan.planId ? (
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input w-full"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleEmailSubmit(plan.planId)
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEmailSubmit(plan.planId)}
                        disabled={!!isLoading}
                        className="flex-1"
                        variant={plan.highlighted ? 'default' : 'outline'}
                      >
                        {isLoading === plan.planId ? 'Generating...' : 'Get API Key'}
                      </Button>
                      <Button
                        onClick={() => setShowEmailInput(null)}
                        variant="ghost"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleGetStarted(plan.planId)}
                    className="w-full"
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    {plan.buttonText}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-muted-foreground text-sm">
            <Check className="h-4 w-4 text-green-600" />
            No setup fees
            <Check className="h-4 w-4 text-green-600" />
            Cancel anytime
            <Check className="h-4 w-4 text-green-600" />
            30-day money-back guarantee
          </div>
        </div>
      </div>
    </div>
  )
} 