"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Loader2, LinkIcon, XCircle, Star, TrendingUp, Target, Zap, Lightbulb, Search, BarChart, ChevronDown, ChevronUp, FileText, Globe, Sparkles, ArrowRight, ExternalLink } from "lucide-react"
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
  pages?: PagesData
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
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

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

      let parsedData;
      
      if (data.output && typeof data.output === 'string') {
        const jsonString = data.output.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedData = JSON.parse(jsonString);
      } else if (data.output && typeof data.output === 'object') {
        parsedData = data.output;
      } else {
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
      case "easy": return "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg shadow-green-200"
      case "medium": return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg shadow-yellow-200"
      case "hard": return "bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg shadow-red-200"
      default: return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-200"
    }
  }

  const getIntentColor = (intent: string) => {
    switch (intent.toLowerCase()) {
      case "commercial": return "bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg shadow-blue-200"
      case "informational": return "bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-lg shadow-purple-200"
      case "navigational": return "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-200"
      case "transactional": return "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg shadow-green-200"
      default: return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-200"
    }
  }

  const toggleKeywordExpansion = (index: number) => {
    setExpandedKeywords(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const cleanText = (text: string) => {
    return text.replace(/\*\*/g, '')
  }

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

  const getTotalPageCount = (pagesData: PagesData | undefined): number => {
    return getAllPages(pagesData).length
  }

  return (
    <div className="min-h-screen pt-30 bg-gradient-to-br from-white via-blue-50/30 to-teal-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <Badge className="mb-4 px-4 py-1.5 text-sm bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg shadow-teal-200/50 relative z-10">
                <BarChart className="w-3 h-3 mr-1" />
                SEO Keyword Analysis
              </Badge>
              <div className="absolute -inset-1 bg-teal-300/30 rounded-lg blur-sm animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-700 via-teal-600 to-teal-700 bg-clip-text text-transparent mb-4 relative">
            Comprehensive SEO Keyword Report
            <Sparkles className="absolute -top-2 -right-6 w-5 h-5 text-teal-400 animate-spin" />
          </h1>
          
          <div className="text-lg text-gray-600 max-w-2xl mx-auto relative text-center">
            <p>
              Analyze any website's keyword strategy and get actionable insights to improve SEO performance
            </p>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent"></div>
          </div>

        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-16 relative">
          <div className="relative flex-1 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 to-blue-400 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 h-5 w-5 z-10" />
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 h-12 text-base shadow-xl border-0 focus:ring-2 focus:ring-teal-300 transition-all duration-300 relative bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            size="lg" 
            className="h-12 text-base shadow-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 relative overflow-hidden group transition-all duration-300 transform hover:scale-105"
            disabled={loading}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin relative z-10" />
                <span className="relative z-10">Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4 relative z-10" />
                <span className="relative z-10">Analyze Keywords</span>
                
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-6 flex items-center justify-center text-red-600 bg-red-50 p-4 rounded-xl border border-red-200 max-w-2xl mx-auto shadow-lg transform transition-all duration-300 hover:scale-105">
            <XCircle className="h-5 w-5 mr-2" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {seoData && (
          <div className="space-y-8">
            {/* Header Card with Summary Stats */}
            <Card className={`shadow-2xl bg-white/80 backdrop-blur-sm border-0 transition-all duration-700 transform ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <CardHeader className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 text-white rounded-t-2xl pb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-300 via-white/30 to-teal-300"></div>
                <div className="flex items-center justify-center gap-3 mb-3 relative z-10">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">SEO Analysis for</CardTitle>
                </div>
                <CardDescription className="text-teal-100 text-lg font-medium break-all text-center flex items-center justify-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  {seoData.url}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { icon: FileText, label: "Pages Analyzed", value: getTotalPageCount(seoData.pages), color: "from-blue-400 to-blue-500" },
                    { icon: Target, label: "Total Keywords", value: seoData.keywords?.length || 0, color: "from-purple-400 to-purple-500" },
                    { icon: Star, label: "Primary Keywords", value: seoData.summary?.primary_keywords?.length || 0, color: "from-amber-400 to-amber-500" },
                    { icon: TrendingUp, label: "Recommendations", value: seoData.recommendations?.length || 0, color: "from-green-400 to-green-500" }
                  ].map((stat, index) => (
                    <div 
                      key={index}
                      className="text-center p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} shadow-lg`}>
                          <stat.icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">{stat.label}</p>
                      <p className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent transition-all duration-300 ${hoveredCard === index ? 'scale-110' : ''}`}>
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pages Analysis Section */}
            {seoData.pages && getTotalPageCount(seoData.pages) > 0 && (
              <Card className={`shadow-2xl bg-white/80 backdrop-blur-sm border-0 transition-all duration-700 delay-200 transform ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <CardHeader className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 text-white rounded-t-2xl pb-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-300 via-white/30 to-teal-300"></div>
                  <div className="flex items-center gap-3 mb-2 relative z-10">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">Website Pages Analysis</CardTitle>
                  </div>
                  <CardDescription className="text-teal-100">
                    Detailed analysis of all pages with their purposes and main keywords
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-8">
                    {[
                      { key: 'homepage', title: 'Homepage', color: 'from-teal-50 to-teal-100', badgeColor: 'bg-teal-100 text-teal-800 border-teal-200' },
                      { key: 'services_products', title: 'Services & Products', color: 'from-blue-50 to-blue-100', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200' },
                      { key: 'blogs', title: 'Blogs', color: 'from-purple-50 to-purple-100', badgeColor: 'bg-purple-100 text-purple-800 border-purple-200' },
                      { key: 'landing_pages', title: 'Landing Pages', color: 'from-red-50 to-red-100', badgeColor: 'bg-red-100 text-red-800 border-red-200' },
                      { key: 'other_pages', title: 'Other Pages', color: 'from-orange-50 to-orange-100', badgeColor: 'bg-orange-100 text-orange-800 border-orange-200' }
                    ].map((section) => (
                      seoData.pages?.[section.key as keyof PagesData]?.length > 0 && (
                        <div key={section.key} className="transform transition-all duration-300 hover:scale-[1.01]">
                          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 border-gray-100 flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${section.color.replace('50', '400').replace('100', '500')}`}></div>
                            {section.title}
                          </h3>
                          <div className="grid gap-4">
                            {seoData.pages[section.key as keyof PagesData]?.map((page, i) => (
                              <Card key={i} className="border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                <CardHeader className={`bg-gradient-to-r ${section.color} rounded-t-lg pb-4 transition-all duration-300 group-hover:brightness-105`}>
                                  <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    {page.title}
                                  </CardTitle>
                                  <CardDescription className="flex items-center gap-1">
                                    <ExternalLink className="h-3 w-3" />
                                    <a href={page.page_url} target="_blank" rel="noopener noreferrer" className="hover:underline break-all text-current">
                                      {page.page_url}
                                    </a>
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 text-base mb-2 flex items-center gap-2">
                                      <Target className="h-4 w-4 text-teal-500" />
                                      Page Purpose
                                    </h4>
                                    <p className="text-gray-700 leading-relaxed pl-6 border-l-2 border-teal-200">{page.purpose}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900 text-base mb-2 flex items-center gap-2">
                                      <Zap className="h-4 w-4 text-amber-500" />
                                      Main Keywords
                                    </h4>
                                    <div className="flex flex-wrap gap-2 pl-6">
                                      {page.main_keywords.map((keyword, idx) => (
                                        <Badge key={idx} variant="secondary" className={section.badgeColor + " transform transition-all duration-300 hover:scale-105"}>
                                          {keyword}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Keywords Section */}
            <Card className={`shadow-2xl bg-white/80 backdrop-blur-sm border-0 transition-all duration-700 delay-300 transform ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <CardHeader className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 text-white rounded-t-2xl pb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-300 via-white/30 to-teal-300"></div>
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Search className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">Keyword Analysis</CardTitle>
                </div>
                <CardDescription className="text-teal-100">
                  Detailed analysis of discovered keywords with metrics and insights
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {seoData.keywords?.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
                    {seoData.keywords.map((kw, i) => (
                      <Card 
                        key={i} 
                        className="group hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-teal-300 relative overflow-hidden transform hover:-translate-y-1 cursor-pointer"
                        onMouseEnter={() => setHoveredCard(100 + i)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-blue-400 transition-transform duration-300 ${hoveredCard === 100 + i ? 'scale-x-100' : 'scale-x-0'}`}></div>
                        <CardHeader className="pb-4">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-bold capitalize text-gray-900 group-hover:text-teal-700 transition-colors flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-teal-500" />
                              {kw.keyword}
                            </CardTitle>
                            <div className="flex gap-2">
                              <Badge className={`${getIntentColor(kw.intent)} transition-transform duration-300 hover:scale-105`}>
                                {kw.intent}
                              </Badge>
                              <Badge className={`${getDifficultyColor(kw.difficulty)} transition-transform duration-300 hover:scale-105`}>
                                {kw.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 text-teal-500" />
                              Frequency
                            </span>
                            <span className="font-bold text-gray-900 bg-white px-2 py-1 rounded-md shadow-sm">{kw.frequency}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">Relevance Score</span>
                              <span className="font-bold text-gray-900">{kw.relevance_score}%</span>
                            </div>
                            <Progress value={kw.relevance_score} className="w-full h-2 bg-gray-200" />
                          </div>
                          {kw.search_volume && (
                            <div className="flex justify-between items-center p-2 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg">
                              <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                <BarChart3 className="h-4 w-4 text-blue-500" />
                                Search Volume
                              </span>
                              <span className="font-bold text-gray-900 flex items-center gap-1">
                                {kw.search_volume.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {kw.related_keywords && kw.related_keywords.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-gray-700 block mb-2">Related Keywords</span>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {kw.related_keywords.slice(0, expandedKeywords[i] ? kw.related_keywords.length : 4).map((related, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs border-teal-200 text-teal-700 bg-teal-50 transition-all duration-300 hover:bg-teal-100 hover:scale-105">
                                    {related}
                                  </Badge>
                                ))}
                              </div>
                              {kw.related_keywords.length > 4 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs text-teal-600 hover:text-teal-700 hover:bg-teal-50 p-1 h-auto w-full border border-dashed border-teal-200"
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
                                      +{kw.related_keywords.length - 4} more keywords
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
                  <div className="p-12 text-center">
                    <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No keywords found for this URL.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary Section */}
            {seoData.summary && (
              <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 delay-400 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {[
                  { 
                    title: "Primary Keywords", 
                    icon: Star, 
                    keywords: seoData.summary.primary_keywords,
                    gradient: "from-teal-500 to-teal-600",
                    bgGradient: "from-teal-50 to-teal-100"
                  },
                  { 
                    title: "Secondary Keywords", 
                    icon: Target, 
                    keywords: seoData.summary.secondary_keywords,
                    gradient: "from-blue-500 to-blue-600",
                    bgGradient: "from-blue-50 to-blue-100"
                  },
                  { 
                    title: "Keyword Gaps", 
                    icon: Zap, 
                    keywords: seoData.summary.keyword_gaps,
                    gradient: "from-amber-500 to-amber-600",
                    bgGradient: "from-amber-50 to-amber-100"
                  }
                ].map((section, index) => (
                  <Card 
                    key={index} 
                    className="shadow-2xl bg-white/80 backdrop-blur-sm border-0 transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                    onMouseEnter={() => setHoveredCard(200 + index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <CardHeader className={`bg-gradient-to-r ${section.gradient} text-white rounded-t-2xl pb-4 relative overflow-hidden`}>
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <section.icon className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-lg font-bold">{section.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        {section.keywords?.map((keyword, i) => (
                          <div 
                            key={i} 
                            className={`flex items-center gap-3 p-3 bg-gradient-to-r ${section.bgGradient} rounded-lg border border-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-md`}
                          >
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${section.gradient} shadow-sm`}></div>
                            <span className="font-medium text-gray-900">{cleanText(keyword)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Recommendations Section */}
            {seoData.recommendations?.length > 0 && (
              <Card className={`shadow-2xl bg-white/80 backdrop-blur-sm border-0 transition-all duration-700 delay-500 transform ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <CardHeader className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 text-white rounded-t-2xl pb-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-300 via-white/30 to-teal-300"></div>
                  <div className="flex items-center gap-3 mb-2 relative z-10">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Lightbulb className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">Actionable Recommendations</CardTitle>
                  </div>
                  <CardDescription className="text-teal-100">
                    Expert suggestions to improve your SEO strategy
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    {seoData.recommendations.map((rec, i) => (
                      <div 
                        key={i} 
                        className="flex items-start gap-4 p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border-l-4 border-teal-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <span className="text-white font-bold text-sm">{i + 1}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-lg">{cleanText(rec)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success Animation */}
            {showAnimations && (
              <div className="text-center py-12 transition-all duration-1000">
                <div className="inline-flex items-center justify-center p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-3xl mb-6 shadow-2xl border border-green-200">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping"></div>
                    <svg className="w-16 h-16 text-green-500 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Analysis Complete!
                </h3>
                <p className="text-gray-600 mb-8 text-lg">Your SEO keyword analysis is ready. Use these insights to optimize your strategy.</p>
                
                <div className="max-w-md mx-auto bg-gray-200 rounded-full h-3 mb-6 overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 h-3 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
                </div>
                <p className="text-sm text-gray-500 font-medium">Ready to implement your SEO improvements</p>
              </div>
            )}
          </div>
        )}

        {/* Loading Animation */}
        {loading && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto mb-8 relative">
              <div className="bg-gray-200 rounded-full h-3 shadow-inner overflow-hidden">
                <div className="bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 h-3 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
              </div>
              <div className="absolute -top-1 left-0 w-3 h-5 bg-teal-400 rounded-full animate-bounce"></div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Loader2 className="h-6 w-6 text-teal-500 animate-spin" />
              <h3 className="text-2xl font-bold text-gray-900">Analyzing The URL</h3>
            </div>
            <p className="text-gray-600 text-lg">Scanning keywords and generating insights...</p>
            <div className="mt-6 flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
              ))}
            </div>
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