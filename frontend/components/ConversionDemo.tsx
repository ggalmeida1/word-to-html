'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { convertWordHTML, isWordContent, getSizeReduction, type ConvertRequest } from '@/lib/supabase'
import { formatBytes, copyToClipboard } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import { 
  Copy, 
  Download, 
  Sparkles, 
  FileText, 
  Zap, 
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react'

const DEMO_API_KEY = 'wth_demo_key_for_testing_only'

const SAMPLE_WORD_HTML = `<p class="MsoNormal"><b><span style="font-size:18.0pt;mso-bidi-font-size:11.0pt">Sample Document Title<o:p></o:p></span></b></p>

<p class="MsoNormal"><o:p>&nbsp;</o:p></p>

<p class="MsoNormal">This is a <b>sample document</b> with <i>various formatting</i> that demonstrates how <u>Word HTML</u> can be messy and full of unnecessary Microsoft-specific tags and styles.<o:p></o:p></p>

<p class="MsoNormal"><o:p>&nbsp;</o:p></p>

<p class="MsoNormal">Here's a list:</p>

<p class="MsoNormal" style="margin-left:.5in;text-indent:-.25in;mso-list:l0 level1 lfo1;
tab-stops:list .5in"><!--[if !supportLists]--><span style="font-family:Symbol;
mso-fareast-font-family:Symbol;mso-bidi-font-family:Symbol"><span style="mso-list:Ignore">·<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->First item</p>

<p class="MsoNormal" style="margin-left:.5in;text-indent:-.25in;mso-list:l0 level1 lfo1;
tab-stops:list .5in"><!--[if !supportLists]--><span style="font-family:Symbol;
mso-fareast-font-family:Symbol;mso-bidi-font-family:Symbol"><span style="mso-list:Ignore">·<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Second item</p>`

export default function ConversionDemo() {
  const [inputHTML, setInputHTML] = useState('')
  const [outputHTML, setOutputHTML] = useState('')
  const [cleanupLevel, setCleanupLevel] = useState<'basic' | 'moderate' | 'aggressive'>('moderate')
  const [preserveImages, setPreserveImages] = useState(true)
  const [preserveTables, setPreserveTables] = useState(true)
  const [removeComments, setRemoveComments] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState<{
    originalSize: number
    cleanedSize: number
    processingTime: number
    sizeReduction: number
  } | null>(null)

  const handleConvert = async () => {
    if (!inputHTML.trim()) {
      toast.error('Please paste some HTML content to convert')
      return
    }

    setIsLoading(true)
    try {
      const request: ConvertRequest = {
        content: inputHTML,
        options: {
          cleanupLevel,
          preserveImages,
          preserveTables,
          removeComments
        },
        apiKey: DEMO_API_KEY
      }

      const result = await convertWordHTML(request)
      
      if (result.success) {
        setOutputHTML(result.cleanHTML)
        setStats({
          originalSize: result.originalSize,
          cleanedSize: result.cleanedSize,
          processingTime: result.processingTime,
          sizeReduction: getSizeReduction(result.originalSize, result.cleanedSize)
        })
        toast.success('HTML converted successfully!')
      } else {
        toast.error(result.error || 'Conversion failed')
      }
    } catch (error) {
      console.error('Conversion error:', error)
      toast.error('Failed to convert HTML. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadSample = () => {
    setInputHTML(SAMPLE_WORD_HTML)
    toast.success('Sample Word HTML loaded!')
  }

  const handleCopyOutput = async () => {
    if (!outputHTML) return
    
    try {
      await copyToClipboard(outputHTML)
      toast.success('Clean HTML copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleDownload = () => {
    if (!outputHTML) return

    const blob = new Blob([outputHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cleaned-html.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('HTML file downloaded!')
  }

  const isWordHtml = inputHTML && isWordContent(inputHTML)

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Try It Live</h2>
        </div>
        <p className="text-muted-foreground text-lg">
          Paste your Word HTML and see the magic happen instantly
        </p>
      </div>

      {/* Options */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Conversion Options</h3>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Cleanup Level</label>
              <select 
                value={cleanupLevel} 
                onChange={(e) => setCleanupLevel(e.target.value as any)}
                className="input"
              >
                <option value="basic">Basic</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="preserveImages"
                checked={preserveImages}
                onChange={(e) => setPreserveImages(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="preserveImages" className="text-sm font-medium">
                Preserve Images
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="preserveTables"
                checked={preserveTables}
                onChange={(e) => setPreserveTables(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="preserveTables" className="text-sm font-medium">
                Preserve Tables
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="removeComments"
                checked={removeComments}
                onChange={(e) => setRemoveComments(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="removeComments" className="text-sm font-medium">
                Remove Comments
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Input/Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Input */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <h3 className="font-semibold">Input HTML</h3>
                {isWordHtml && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs">Word detected</span>
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={handleLoadSample}>
                Load Sample
              </Button>
            </div>
          </div>
          <div className="card-content">
            <textarea
              value={inputHTML}
              onChange={(e) => setInputHTML(e.target.value)}
              placeholder="Paste your Word HTML here..."
              className="textarea min-h-[300px] font-mono text-sm"
            />
            {inputHTML && (
              <div className="mt-2 text-xs text-muted-foreground">
                Size: {formatBytes(new TextEncoder().encode(inputHTML).length)}
              </div>
            )}
          </div>
        </div>

        {/* Output */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Clean HTML</h3>
              </div>
              {outputHTML && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopyOutput}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="card-content">
            <textarea
              value={outputHTML}
              readOnly
              placeholder="Clean HTML will appear here..."
              className="textarea min-h-[300px] font-mono text-sm bg-muted/50"
            />
            {outputHTML && (
              <div className="mt-2 text-xs text-muted-foreground">
                Size: {formatBytes(new TextEncoder().encode(outputHTML).length)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Convert Button */}
      <div className="text-center mb-6">
        <Button 
          onClick={handleConvert} 
          disabled={isLoading || !inputHTML.trim()}
          size="lg"
          className="px-8"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Convert HTML
            </>
          )}
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold">Conversion Results</h3>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatBytes(stats.originalSize)}
                </div>
                <div className="text-sm text-muted-foreground">Original Size</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatBytes(stats.cleanedSize)}
                </div>
                <div className="text-sm text-muted-foreground">Clean Size</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.sizeReduction}%
                </div>
                <div className="text-sm text-muted-foreground">Size Reduced</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.processingTime}ms
                </div>
                <div className="text-sm text-muted-foreground">Processing Time</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Demo Mode</h4>
            <p className="text-blue-700 text-sm">
              This demo uses a test API key with limited functionality. 
              <strong> Sign up to get your own API key</strong> and integrate this conversion into your applications with full rate limits and features.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 