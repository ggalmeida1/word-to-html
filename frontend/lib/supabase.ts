import { createClient } from '@supabase/supabase-js'

// Use default values for local development if env vars are not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for the API
export interface ConvertRequest {
  content: string;
  options: {
    cleanupLevel: 'basic' | 'moderate' | 'aggressive';
    preserveImages: boolean;
    preserveTables: boolean;
    removeComments: boolean;
  };
  apiKey: string;
}

export interface ConvertResponse {
  success: boolean;
  cleanHTML: string;
  originalSize: number;
  cleanedSize: number;
  processingTime: number;
  error?: string;
}

export interface GenerateApiKeyRequest {
  email: string;
  plan?: 'free' | 'starter' | 'pro' | 'enterprise';
}

export interface GenerateApiKeyResponse {
  success: boolean;
  apiKey?: string;
  userId?: string;
  error?: string;
  message?: string;
}

// API functions with fallback for demo mode
export async function convertWordHTML(request: ConvertRequest): Promise<ConvertResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:54321/functions/v1'}/convert-word`
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('API not available, using demo mode:', error)
    
    // Fallback demo mode - simulate the conversion
    return simulateConversion(request)
  }
}

export async function generateApiKey(request: GenerateApiKeyRequest): Promise<GenerateApiKeyResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:54321/functions/v1'}/generate-api-key`
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('API not available, using demo mode:', error)
    
    // Fallback demo mode - generate a fake API key
    return {
      success: true,
      apiKey: `wth_demo_${Math.random().toString(36).substring(2, 15)}`,
      userId: 'demo-user-id',
      message: 'Demo API key generated (backend not running)'
    }
  }
}

// Demo conversion simulation
function simulateConversion(request: ConvertRequest): ConvertResponse {
  const { content, options } = request
  
  // Simple cleanup simulation
  let cleanHTML = content
  
  // Remove Microsoft-specific attributes and tags
  cleanHTML = cleanHTML.replace(/\s*class="[^"]*mso[^"]*"/gi, '')
  cleanHTML = cleanHTML.replace(/\s*class="[^"]*Mso[^"]*"/gi, '')
  cleanHTML = cleanHTML.replace(/<o:p[^>]*>[\s\S]*?<\/o:p>/gi, '')
  cleanHTML = cleanHTML.replace(/<!--\[if[^>]*>[\s\S]*?<!\[endif\]-->/gi, '')
  
  if (options.cleanupLevel === 'aggressive') {
    cleanHTML = cleanHTML.replace(/\s*style="[^"]*"/gi, '')
    cleanHTML = cleanHTML.replace(/\s*class="[^"]*"/gi, '')
  }
  
  // Normalize whitespace
  cleanHTML = cleanHTML.replace(/\s+/g, ' ').trim()
  
  const originalSize = new TextEncoder().encode(content).length
  const cleanedSize = new TextEncoder().encode(cleanHTML).length
  
  return {
    success: true,
    cleanHTML,
    originalSize,
    cleanedSize,
    processingTime: Math.floor(Math.random() * 50) + 10 // Random processing time
  }
}

// Helper function to validate if content looks like Word HTML
export function isWordContent(html: string): boolean {
  const wordIndicators = [
    /mso-/i,
    /Microsoft\s+Word/i,
    /urn:schemas-microsoft-com/i,
    /<!--\[if/i,
    /<o:p>/i,
    /class="?Mso/i
  ];
  
  return wordIndicators.some(pattern => pattern.test(html));
}

// Helper function to get size reduction percentage
export function getSizeReduction(originalSize: number, cleanedSize: number): number {
  if (originalSize === 0) return 0;
  return Math.round(((originalSize - cleanedSize) / originalSize) * 100);
} 