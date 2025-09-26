"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Loader2, LinkIcon, XCircle, Star, TrendingUp, Target, Zap, Lightbulb, Search, BarChart, ChevronDown, ChevronUp, FileText, Globe, Calendar, MapPin, BookOpen, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// n8n webhook URL
const API_URL = "https://n8n.cybomb.com/webhook/keyword"

interface ImplementationStep {
  step: number
  action: string
}

interface BlogHeading {
  heading: string
  keywords_used: string[]
}

interface BlogOutline {
  title: string
  headings: BlogHeading[]
  key_points: string[]
}

interface ContentExample {
  long_tail_keyword: string
  blog_outline: BlogOutline
}

interface SEOStrategy {
  keyword_usage_explained: string
  implementation_plan: ImplementationStep[]
  content_example: ContentExample
}

interface SEOData {
  url: string
  seo_strategy: SEOStrategy
}

export default function Keywordchecker() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [seoData, setSeoData] = useState<SEOData | null>(null)
  const [showAnimations, setShowAnimations] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    implementation: false,
    blogOutline: false
  })

  useEffect(() => {
    if (seoData) {
      const timer = setTimeout(() => {
        setShowAnimations(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [seoData])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!url) {
      setError("Please enter a valid URL.")
      return
    }

    setLoading(true)
    setError("")
    setSeoData(null)
    setShowAnimations(false)
    setExpandedSections({
      implementation: false,
      blogOutline: false
    })

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Failed to fetch SEO data from webhook.")

      // Handle the nested JSON structure from n8n
      let parsedData;
      
      if (data.output && typeof data.output === 'string') {
        // Remove markdown code blocks and parse JSON
        const jsonString = data.output.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedData = JSON.parse(jsonString);
      } else if (data.output && typeof data.output === 'object') {
        // If output is already an object, use it directly
        parsedData = data.output;
      } else {
        // Fallback to the entire response
        parsedData = data;
      }
      
      // Add the URL to the parsed data
      parsedData.url = url;
      setSeoData(parsedData)
    } catch (err) {
      console.error('Error parsing SEO data:', err)
      if (err instanceof Error) setError(err.message)
      else setError("An unknown error occurred while processing the SEO data.")
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Function to remove asterisks from text and format lists
  const cleanText = (text: string) => {
    return text.replace(/\*\*/g, '')
  }

  // Function to format the keyword usage explained text with proper formatting
  const formatKeywordExplanation = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.trim().startsWith('*   **')) {
        return (
          <div key={index} className="flex items-start gap-2 mb-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700 leading-relaxed">
              <strong>{line.replace('*   **', '').split(':**')[0]}:</strong>
              {line.split(':**')[1]}
            </span>
          </div>
        );
      }
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-4">
          {line}
        </p>
      );
    });
  }

  // Function to format implementation steps with proper formatting
  const formatImplementationStep = (action: string) => {
    const lines = action.split('\n');
    return lines.map((line, index) => {
      if (line.trim().startsWith('*   **')) {
        const cleanLine = line.replace('*   **', '').replace('**', '');
        return (
          <div key={index} className="flex items-start gap-2 mb-2 ml-4">
            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700 leading-relaxed text-sm">{cleanLine}</span>
          </div>
        );
      }
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-3">
          {line}
        </p>
      );
    });
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <Badge className="mb-4 px-4 py-1.5 text-sm bg-teal-600 hover:bg-teal-700 text-white">
            <BarChart className="w-3 h-3 mr-1" />
            SEO Strategy Analysis
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-700 to-teal-600 bg-clip-text text-transparent mb-4">
            Comprehensive SEO Strategy Report
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get a complete SEO strategy with implementation plan and content examples for any website
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-12">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 h-5 w-5" />
            <Input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10 h-12 text-base shadow-lg border-2 border-gray-200 focus:border-teal-400 transition-colors"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 text-base shadow-lg bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze Strategy
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-6 flex items-center justify-center text-red-600 bg-red-50 p-4 rounded-lg border border-red-200 max-w-2xl mx-auto">
            <XCircle className="h-5 w-5 mr-2" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {seoData && (
          <div className="space-y-8">
            {/* Header Card */}
            <Card className={`shadow-lg bg-white transition-all duration-500 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BarChart3 className="h-6 w-6" />
                  <CardTitle className="text-2xl">SEO Strategy Analysis for</CardTitle>
                </div>
                <CardDescription className="text-teal-100 text-lg font-medium break-all text-center">
                  {seoData.url}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <BookOpen className="h-5 w-5 text-teal-600" />
                      <span className="font-semibold text-gray-900">Strategy Overview</span>
                    </div>
                    <p className="text-lg font-bold text-teal-600">Complete Plan</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-teal-600" />
                      <span className="font-semibold text-gray-900">Implementation Steps</span>
                    </div>
                    <p className="text-lg font-bold text-teal-600">{seoData.seo_strategy.implementation_plan.length}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-teal-600" />
                      <span className="font-semibold text-gray-900">Content Example</span>
                    </div>
                    <p className="text-lg font-bold text-teal-600">Blog Outline</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Keyword Usage Explained Section */}
            <Card className={`shadow-lg bg-white transition-all duration-500 delay-200 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Lightbulb className="h-5 w-5" />
                  <CardTitle className="text-xl">Keyword Strategy Explained</CardTitle>
                </div>
                <CardDescription className="text-teal-100">
                  Understanding different keyword categories and their strategic importance
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-lg max-w-none text-gray-700">
                  {formatKeywordExplanation(cleanText(seoData.seo_strategy.keyword_usage_explained))}
                </div>
              </CardContent>
            </Card>

            {/* Implementation Plan Section */}
            <Card className={`shadow-lg bg-white transition-all duration-500 delay-300 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-5 w-5" />
                    <CardTitle className="text-xl">Implementation Plan</CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-teal-100 hover:text-white hover:bg-teal-500"
                    onClick={() => toggleSection('implementation')}
                  >
                    {expandedSections.implementation ? 'Collapse All' : 'Expand All'}
                  </Button>
                </div>
                <CardDescription className="text-teal-100">
                  Step-by-step guide to implement your SEO strategy effectively
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {seoData.seo_strategy.implementation_plan.map((step, index) => (
                    <div key={index} className="border-l-4 border-teal-500 pl-6 relative">
                      <div className="absolute -left-3 top-0 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{step.step}</span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Step {step.step}</h3>
                        <div className="text-gray-700">
                          {formatImplementationStep(cleanText(step.action))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Example Section */}
            <Card className={`shadow-lg bg-white transition-all duration-500 delay-400 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="h-5 w-5" />
                    <CardTitle className="text-xl">Content Example</CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-teal-100 hover:text-white hover:bg-teal-500"
                    onClick={() => toggleSection('blogOutline')}
                  >
                    {expandedSections.blogOutline ? 'Collapse' : 'Expand'}
                  </Button>
                </div>
                <CardDescription className="text-teal-100">
                  Sample blog outline targeting: "{seoData.seo_strategy.content_example.long_tail_keyword}"
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Blog Title */}
                  <div className="text-center p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Blog Title</h3>
                    <p className="text-lg text-teal-700 font-medium">{cleanText(seoData.seo_strategy.content_example.blog_outline.title)}</p>
                  </div>

                  {/* Blog Headings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-teal-600" />
                      Blog Structure & Headings
                    </h3>
                    <div className="space-y-3">
                      {seoData.seo_strategy.content_example.blog_outline.headings.map((heading, index) => (
                        <Card key={index} className="border border-gray-200 hover:border-teal-300 transition-colors">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-gray-900">
                              {cleanText(heading.heading)}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex flex-wrap gap-2">
                              {heading.keywords_used.map((keyword, kwIndex) => (
                                <Badge key={kwIndex} variant="secondary" className="bg-teal-100 text-teal-800 border-teal-200">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Key Points */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-teal-600" />
                      Key Content Points
                    </h3>
                    <div className="space-y-3">
                      {seoData.seo_strategy.content_example.blog_outline.key_points.map((point, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700 leading-relaxed">{cleanText(point)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Success Animation */}
            {showAnimations && (
              <div className="text-center py-8 transition-all duration-1000">
                <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-full mb-4">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Strategy Analysis Complete!</h3>
                <p className="text-gray-600 mb-6">Your comprehensive SEO strategy is ready. Follow the implementation plan to optimize your website.</p>
                
                {/* Loading Bar Animation */}
                <div className="max-w-md mx-auto bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full animate-pulse"></div>
                </div>
                <p className="text-sm text-gray-500">Ready to implement your SEO strategy</p>
              </div>
            )}
          </div>
        )}

        {/* Loading Animation */}
        {loading && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto mb-6">
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing The URL</h3>
            <p className="text-gray-600">Developing SEO strategy and content plan...</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}