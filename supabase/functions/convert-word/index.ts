import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { cleanWordHTML } from "../_shared/word-cleaner.ts";
import { validateApiKey, checkRateLimit } from "../_shared/auth.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ConvertRequest {
  content: string;
  options: {
    cleanupLevel: 'basic' | 'moderate' | 'aggressive';
    preserveImages: boolean;
    preserveTables: boolean;
    removeComments: boolean;
  };
  apiKey: string;
}

interface ConvertResponse {
  success: boolean;
  cleanHTML: string;
  originalSize: number;
  cleanedSize: number;
  processingTime: number;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    const startTime = performance.now();
    const { content, options, apiKey }: ConvertRequest = await req.json();

    // Validate required fields
    if (!content || !apiKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: content and apiKey' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate API key and check rate limits
    const user = await validateApiKey(supabase, apiKey);
    if (!user) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid API key' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check rate limits
    const rateLimitCheck = await checkRateLimit(supabase, user.id, user.plan);
    if (!rateLimitCheck.allowed) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Rate limit exceeded. ${rateLimitCheck.message}` 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Default options
    const cleanupOptions = {
      cleanupLevel: options?.cleanupLevel || 'moderate',
      preserveImages: options?.preserveImages ?? true,
      preserveTables: options?.preserveTables ?? true,
      removeComments: options?.removeComments ?? true,
    };

    // Clean the HTML content
    const originalSize = new TextEncoder().encode(content).length;
    const cleanHTML = cleanWordHTML(content, cleanupOptions);
    const cleanedSize = new TextEncoder().encode(cleanHTML).length;
    const processingTime = performance.now() - startTime;

    // Log the conversion for analytics
    await supabase
      .from('conversions')
      .insert({
        user_id: user.id,
        original_size: originalSize,
        cleaned_size: cleanedSize,
        processing_time: processingTime,
        cleanup_level: cleanupOptions.cleanupLevel,
        options: cleanupOptions
      });

    const response: ConvertResponse = {
      success: true,
      cleanHTML,
      originalSize,
      cleanedSize,
      processingTime: Math.round(processingTime)
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in convert-word function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}); 