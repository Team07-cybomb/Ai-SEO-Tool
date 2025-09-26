"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Loader2, LinkIcon, XCircle, Star, TrendingUp, Target, Zap, Lightbulb, Search, BarChart, ChevronDown, ChevronUp, FileText, Globe } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// n8n webhook URL
const API_URL = "https://n8n.cybomb.com/webhook/keyword"

interface Page {
  page_url: string
  title: string
  purpose: string
  main_keywords: string[]
}

interface PagesData {
  homepage: Page[]
  services_products: Page[]
  blogs: Page[]
  landing_pages: Page[]
  other_pages: Page[]
}

interface Keyword {
  keyword: string
  intent: string
  frequency: number
  relevance_score: number
  search_volume?: number
  difficulty: string
  related_keywords: string[]
}

interface SEOData {
  url: string
  pages?: PagesData // Make pages optional since your example doesn't include it
  keywords: Keyword[]
  summary: {
    primary_keywords: string[]
    secondary_keywords: string[]
    keyword_gaps: string[]
  }
  recommendations: string[]
}

export default function Keywordchecker() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [seoData, setSeoData] = useState<SEOData | null>(null)
  const [showAnimations, setShowAnimations] = useState(false)
  const [expandedKeywords, setExpandedKeywords] = useState<{[key: number]: boolean}>({})

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
    setExpandedKeywords({})

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
      
      setSeoData(parsedData)
    } catch (err) {
      console.error('Error parsing SEO data:', err)
      if (err instanceof Error) setError(err.message)
      else setError("An unknown error occurred while processing the SEO data.")
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "hard": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getIntentColor = (intent: string) => {
    switch (intent.toLowerCase()) {
      case "commercial": return "bg-blue-100 text-blue-800"
      case "informational": return "bg-purple-100 text-purple-800"
      case "navigational": return "bg-orange-100 text-orange-800"
      case "transactional": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const toggleKeywordExpansion = (index: number) => {
    setExpandedKeywords(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  // Function to remove asterisks from text
  const cleanText = (text: string) => {
    return text.replace(/\*\*/g, '')
  }

  // Function to get all pages as a flat array (with null check)
  const getAllPages = (pagesData: PagesData | undefined): Page[] => {
    if (!pagesData) return []
    return [
      ...(pagesData.homepage || []),
      ...(pagesData.services_products || []),
      ...(pagesData.blogs || []),
      ...(pagesData.landing_pages || []),
      ...(pagesData.other_pages || [])
    ]
  }

  // Function to get total page count (with null check)
  const getTotalPageCount = (pagesData: PagesData | undefined): number => {
    return getAllPages(pagesData).length
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <Badge className="mb-4 px-4 py-1.5 text-sm bg-teal-600 hover:bg-teal-700 text-white">
            <BarChart className="w-3 h-3 mr-1" />
            SEO Keyword Analysis
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-700 to-teal-600 bg-clip-text text-transparent mb-4">
            Comprehensive SEO Keyword Report
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze any website's keyword strategy and get actionable insights to improve SEO performance
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
                Analyze Keywords
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
            {/* Header Card with Summary Stats */}
            <Card className={`shadow-lg bg-white transition-all duration-500 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BarChart3 className="h-6 w-6" />
                  <CardTitle className="text-2xl">SEO Analysis for</CardTitle>
                </div>
                <CardDescription className="text-teal-100 text-lg font-medium break-all text-center">
                  {seoData.url}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-teal-600" />
                      <span className="font-semibold text-gray-900">Pages Analyzed</span>
                    </div>
                    <p className="text-3xl font-bold text-teal-600">{getTotalPageCount(seoData.pages)}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-teal-600" />
                      <span className="font-semibold text-gray-900">Total Keywords</span>
                    </div>
                    <p className="text-3xl font-bold text-teal-600">{seoData.keywords?.length || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-teal-600" />
                      <span className="font-semibold text-gray-900">Primary Keywords</span>
                    </div>
                    <p className="text-3xl font-bold text-teal-600">{seoData.summary?.primary_keywords?.length || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-teal-600" />
                      <span className="font-semibold text-gray-900">Recommendations</span>
                    </div>
                    <p className="text-3xl font-bold text-teal-600">{seoData.recommendations?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pages Analysis Section - Only show if pages data exists */}
            {seoData.pages && getTotalPageCount(seoData.pages) > 0 && (
              <Card className={`shadow-lg bg-white transition-all duration-500 delay-200 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="h-5 w-5" />
                    <CardTitle className="text-xl">Website Pages Analysis</CardTitle>
                  </div>
                  <CardDescription className="text-teal-100">
                    Detailed analysis of all pages with their purposes and main keywords
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Homepage Section */}
                    {seoData.pages.homepage && seoData.pages.homepage.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Homepage</h3>
                        {seoData.pages.homepage.map((page, i) => (
                          <Card key={i} className="border border-gray-200 mb-4">
                            <CardHeader className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-t-lg">
                              <CardTitle className="text-lg text-gray-900">{page.title}</CardTitle>
                              <CardDescription className="text-teal-700">
                                <a href={page.page_url} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                                  {page.page_url}
                                </a>
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-base mb-2">Page Purpose</h4>
                                <p className="text-gray-700 leading-relaxed">{page.purpose}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-base mb-2">Main Keywords</h4>
                                <div className="flex flex-wrap gap-2">
                                  {page.main_keywords.map((keyword, idx) => (
                                    <Badge key={idx} variant="secondary" className="bg-teal-100 text-teal-800 border-teal-200">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Services & Products Section */}
                    {seoData.pages.services_products && seoData.pages.services_products.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Services & Products</h3>
                        {seoData.pages.services_products.map((page, i) => (
                          <Card key={i} className="border border-gray-200 mb-4">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                              <CardTitle className="text-lg text-gray-900">{page.title}</CardTitle>
                              <CardDescription className="text-blue-700">
                                <a href={page.page_url} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                                  {page.page_url}
                                </a>
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-base mb-2">Page Purpose</h4>
                                <p className="text-gray-700 leading-relaxed">{page.purpose}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-base mb-2">Main Keywords</h4>
                                <div className="flex flex-wrap gap-2">
                                  {page.main_keywords.map((keyword, idx) => (
                                    <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Blogs Section */}
                    {seoData.pages.blogs && seoData.pages.blogs.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Blogs</h3>
                        {seoData.pages.blogs.map((page, i) => (
                          <Card key={i} className="border border-gray-200 mb-4">
                            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
                              <CardTitle className="text-lg text-gray-900">{page.title}</CardTitle>
                              <CardDescription className="text-purple-700">
                                <a href={page.page_url} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                                  {page.page_url}
                                </a>
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-base mb-2">Page Purpose</h4>
                                <p className="text-gray-700 leading-relaxed">{page.purpose}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-base mb-2">Main Keywords</h4>
                                <div className="flex flex-wrap gap-2">
                                  {page.main_keywords.map((keyword, idx) => (
                                    <Badge key={idx} variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Other Pages Section */}
                    {seoData.pages.other_pages && seoData.pages.other_pages.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Other Pages</h3>
                        {seoData.pages.other_pages.map((page, i) => (
                          <Card key={i} className="border border-gray-200 mb-4">
                            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-lg">
                              <CardTitle className="text-lg text-gray-900">{page.title}</CardTitle>
                              <CardDescription className="text-orange-700">
                                <a href={page.page_url} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                                  {page.page_url}
                                </a>
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-base mb-2">Page Purpose</h4>
                                <p className="text-gray-700 leading-relaxed">{page.purpose}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-base mb-2">Main Keywords</h4>
                                <div className="flex flex-wrap gap-2">
                                  {page.main_keywords.map((keyword, idx) => (
                                    <Badge key={idx} variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Landing Pages Section */}
                    {seoData.pages.landing_pages && seoData.pages.landing_pages.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Landing Pages</h3>
                        {seoData.pages.landing_pages.map((page, i) => (
                          <Card key={i} className="border border-gray-200 mb-4">
                            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 rounded-t-lg">
                              <CardTitle className="text-lg text-gray-900">{page.title}</CardTitle>
                              <CardDescription className="text-red-700">
                                <a href={page.page_url} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                                  {page.page_url}
                                </a>
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-base mb-2">Page Purpose</h4>
                                <p className="text-gray-700 leading-relaxed">{page.purpose}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-base mb-2">Main Keywords</h4>
                                <div className="flex flex-wrap gap-2">
                                  {page.main_keywords.map((keyword, idx) => (
                                    <Badge key={idx} variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Keywords Section */}
            <Card className={`shadow-lg bg-white transition-all duration-500 delay-300 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Search className="h-5 w-5" />
                  <CardTitle className="text-xl">Keyword Analysis</CardTitle>
                </div>
                <CardDescription className="text-teal-100">
                  Detailed analysis of discovered keywords with metrics and insights
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {seoData.keywords?.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                    {seoData.keywords.map((kw, i) => (
                      <Card key={i} className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-teal-300">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-bold capitalize text-gray-900 group-hover:text-teal-700 transition-colors">
                              {kw.keyword}
                            </CardTitle>
                            <div className="flex gap-2">
                              <Badge variant="secondary" className={getIntentColor(kw.intent)}>
                                {kw.intent}
                              </Badge>
                              <Badge variant="secondary" className={getDifficultyColor(kw.difficulty)}>
                                {kw.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Frequency</span>
                            <span className="font-semibold text-gray-900">{kw.frequency}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Relevance Score</span>
                            <div className="flex items-center gap-2">
                              <Progress value={kw.relevance_score} className="w-20 h-2 bg-gray-200" />
                              <span className="font-semibold text-gray-900">{kw.relevance_score}%</span>
                            </div>
                          </div>
                          {kw.search_volume && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">Search Volume</span>
                              <span className="font-semibold flex items-center gap-1 text-gray-900">
                                <TrendingUp className="h-4 w-4 text-teal-600" />
                                {kw.search_volume.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {kw.related_keywords && kw.related_keywords.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-gray-700 block mb-1">Related Keywords</span>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {kw.related_keywords.slice(0, expandedKeywords[i] ? kw.related_keywords.length : 3).map((related, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs border-gray-300 text-gray-700">
                                    {related}
                                  </Badge>
                                ))}
                              </div>
                              {kw.related_keywords.length > 3 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs text-teal-600 hover:text-teal-700 hover:bg-teal-50 p-1 h-auto"
                                  onClick={() => toggleKeywordExpansion(i)}
                                >
                                  {expandedKeywords[i] ? (
                                    <>
                                      <ChevronUp className="h-3 w-3 mr-1" />
                                      Show Less
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="h-3 w-3 mr-1" />
                                      +{kw.related_keywords.length - 3} more
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No keywords found for this URL.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary Section */}
            {seoData.summary && (
              <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-500 delay-400 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Card className="shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg pb-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      <CardTitle className="text-lg">Primary Keywords</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      {seoData.summary.primary_keywords?.map((keyword, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">{keyword}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg pb-4">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      <CardTitle className="text-lg">Secondary Keywords</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      {seoData.summary.secondary_keywords?.map((keyword, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                          <span className="font-medium text-gray-900">{keyword}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg pb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      <CardTitle className="text-lg">Keyword Gaps</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      {seoData.summary.keyword_gaps?.map((gap, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="w-2 h-2 bg-teal-300 rounded-full"></div>
                          <span className="font-medium text-gray-900">{cleanText(gap)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recommendations Section */}
            {seoData.recommendations?.length > 0 && (
              <Card className={`shadow-lg bg-white transition-all duration-500 delay-500 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Lightbulb className="h-5 w-5" />
                    <CardTitle className="text-xl">Actionable Recommendations</CardTitle>
                  </div>
                  <CardDescription className="text-teal-100">
                    Expert suggestions to improve your SEO strategy
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {seoData.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-teal-500">
                        <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-teal-600 font-bold text-sm">{i + 1}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{cleanText(rec)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success Animation with Loading Bar Effect */}
            {showAnimations && (
              <div className="text-center py-8 transition-all duration-1000">
                <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-full mb-4">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Analysis Complete!</h3>
                <p className="text-gray-600 mb-6">Your SEO keyword analysis is ready. Use these insights to optimize your strategy.</p>
                
                {/* Loading Bar Animation */}
                <div className="max-w-md mx-auto bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full animate-pulse"></div>
                </div>
                <p className="text-sm text-gray-500">Ready to implement your SEO improvements</p>
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
            <p className="text-gray-600">Scanning keywords and generating insights...</p>
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