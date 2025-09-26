"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Loader2, LinkIcon, XCircle, Star, TrendingUp, Target, Zap, Lightbulb, Search, BarChart } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// n8n webhook URL
const API_URL = "https://n8n.cybomb.com/webhook/keyword"

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!url) {
      setError("Please enter a valid URL.")
      return
    }

    setLoading(true)
    setError("")
    setSeoData(null)

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Failed to fetch SEO data from webhook.")

      // Parse JSON output if your webhook returns it as a string
      const parsedData = typeof data.output === "string" ? JSON.parse(data.output.replace(/```json/g, "").replace(/```/g, "")) : data
      setSeoData(parsedData)
    } catch (err) {
      if (err instanceof Error) setError(err.message)
      else setError("An unknown error occurred.")
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100/30 py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge className="mb-4 px-4 py-1.5 text-sm bg-teal-600 hover:bg-teal-700 text-white">
            <BarChart className="w-3 h-3 mr-1" />
            SEO Keyword Analysis
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-700 to-teal-600 bg-clip-text text-transparent mb-4">
            Comprehensive SEO Keyword Report
          </h1>
          <p className="text-lg text-teal-800/80 max-w-2xl mx-auto">
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
              className="pl-10 h-12 text-base shadow-lg border-2 border-teal-100 focus:border-teal-400 transition-colors"
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
            <Card className="shadow-xl border-0 bg-gradient-to-r from-teal-50 to-teal-100/50 border-l-4 border-teal-600">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl text-teal-900">
                  <BarChart3 className="h-6 w-6 text-teal-600" />
                  Keyword Analysis for 
                </CardTitle>
                <CardDescription className="text-lg font-medium text-teal-800 break-all">
                  {seoData.url}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-teal-100">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-teal-600" />
                      <span className="font-semibold text-teal-800">Total Keywords</span>
                    </div>
                    <p className="text-3xl font-bold text-teal-600">{seoData.keywords?.length || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-teal-100">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-teal-600" />
                      <span className="font-semibold text-teal-800">Primary Keywords</span>
                    </div>
                    <p className="text-3xl font-bold text-teal-600">{seoData.summary?.primary_keywords?.length || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-teal-100">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-teal-600" />
                      <span className="font-semibold text-teal-800">Recommendations</span>
                    </div>
                    <p className="text-3xl font-bold text-teal-600">{seoData.recommendations?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Keywords Section */}
            <Card className="shadow-xl border-0 border-l-4 border-teal-600">
              <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Search className="h-5 w-5" />
                  Keyword Analysis
                </CardTitle>
                <CardDescription className="text-teal-100">
                  Detailed analysis of discovered keywords with metrics and insights
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {seoData.keywords?.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                    {seoData.keywords.map((kw, i) => (
                      <Card key={i} className="group hover:shadow-lg transition-all duration-300 border border-teal-100 hover:border-teal-300">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-bold capitalize text-teal-900 group-hover:text-teal-700 transition-colors">
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
                            <span className="text-sm font-medium text-teal-700">Frequency</span>
                            <span className="font-semibold text-teal-900">{kw.frequency}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-teal-700">Relevance Score</span>
                            <div className="flex items-center gap-2">
                              <Progress value={kw.relevance_score * 10} className="w-20 h-2 bg-teal-100" />
                              <span className="font-semibold text-teal-900">{kw.relevance_score}/10</span>
                            </div>
                          </div>
                          {kw.search_volume && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-teal-700">Search Volume</span>
                              <span className="font-semibold flex items-center gap-1 text-teal-900">
                                <TrendingUp className="h-4 w-4 text-teal-600" />
                                {kw.search_volume.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {kw.related_keywords.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-teal-700 block mb-1">Related Keywords</span>
                              <div className="flex flex-wrap gap-1">
                                {kw.related_keywords.slice(0, 3).map((related, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs border-teal-200 text-teal-700">
                                    {related}
                                  </Badge>
                                ))}
                                {kw.related_keywords.length > 3 && (
                                  <Badge variant="outline" className="text-xs border-teal-200 text-teal-700">
                                    +{kw.related_keywords.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Search className="h-12 w-12 text-teal-300 mx-auto mb-4" />
                    <p className="text-teal-600 text-lg">No keywords found for this URL.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary Section */}
            {seoData.summary && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="shadow-xl border-0 bg-gradient-to-br from-teal-50 to-teal-100/30 border-l-4 border-teal-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-teal-800">
                      <Star className="h-5 w-5 text-teal-600" />
                      Primary Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {seoData.summary.primary_keywords.map((keyword, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm border border-teal-100">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          <span className="font-medium text-teal-900">{keyword}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-xl border-0 bg-gradient-to-br from-teal-50 to-teal-100/30 border-l-4 border-teal-400">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-teal-800">
                      <Target className="h-5 w-5 text-teal-600" />
                      Secondary Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {seoData.summary.secondary_keywords.map((keyword, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm border border-teal-100">
                          <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                          <span className="font-medium text-teal-900">{keyword}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-xl border-0 bg-gradient-to-br from-teal-50 to-teal-100/30 border-l-4 border-teal-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-teal-800">
                      <Zap className="h-5 w-5 text-teal-600" />
                      Keyword Gaps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {seoData.summary.keyword_gaps.map((gap, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm border border-teal-100">
                          <div className="w-2 h-2 bg-teal-300 rounded-full"></div>
                          <span className="font-medium text-teal-900">{gap}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recommendations Section */}
            {seoData.recommendations?.length > 0 && (
              <Card className="shadow-xl border-0 bg-gradient-to-r from-teal-50 to-teal-100/30 border-l-4 border-teal-600">
                <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Lightbulb className="h-5 w-5" />
                    Actionable Recommendations
                  </CardTitle>
                  <CardDescription className="text-teal-100">
                    Expert suggestions to improve your SEO strategy
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {seoData.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
                        <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-teal-600 font-bold text-sm">{i + 1}</span>
                        </div>
                        <p className="text-teal-900 leading-relaxed">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}