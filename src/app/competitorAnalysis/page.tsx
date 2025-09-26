"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Loader2, LinkIcon, XCircle, Users, TrendingUp, DollarSign, Target, Gauge, Star, Search, FileText, Lightbulb, PenTool } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// n8n webhook URL
const API_URL = "https://n8n.cybomb.com/webhook/competitor-analysis"

interface Keyword {
  keyword: string
  intent: string
  frequency: number
  relevance_score: number
  search_volume: number
  difficulty: string
  related_keywords: string[]
}

interface CompetitorAnalysis {
  competitor_name: string
  core_keywords: string[]
  long_tail_keywords: string[]
  technical_keywords: string[]
  local_keywords: string[]
  high_volume_low_competition: string[]
  strengths: string[]
  gaps: string[]
}

interface KeywordData {
  url: string
  keywords: Keyword[]
  summary: {
    primary_keywords: string[]
    secondary_keywords: string[]
    keyword_gaps: string[]
  }
  competitor_analysis: CompetitorAnalysis[]
  recommendations: string[]
  blog_topics: string[]
  meta_examples: Array<{
    meta_title: string
    meta_description: string
  }>
}

export default function KeywordAnalysis() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [keywordData, setKeywordData] = useState<KeywordData | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!url) {
      setError("Please enter a valid URL.")
      return
    }

    setLoading(true)
    setError("")
    setKeywordData(null)

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Failed to fetch keyword data from webhook.")

      // Parse the nested JSON string from the output
      const parsedOutput = typeof data.output === "string" 
        ? JSON.parse(data.output.replace(/```json\n?/g, "").replace(/```/g, "").trim())
        : data

      setKeywordData(parsedOutput)
    } catch (err) {
      if (err instanceof Error) setError(err.message)
      else setError("An unknown error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "low": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "high": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case "transactional": return "bg-blue-100 text-blue-800"
      case "informational": return "bg-purple-100 text-purple-800"
      case "navigational": return "bg-orange-100 text-orange-800"
      case "commercial": return "bg-pink-100 text-pink-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#008e7a]/10 to-[#008e7a]/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <Badge className="mb-4 px-4 py-1.5 text-sm bg-[#008e7a] hover:bg-[#007a69] text-white">
            <Search className="w-3 h-3 mr-1" />
            SEO Keyword Analysis
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#008e7a] to-[#006b5c] bg-clip-text text-transparent mb-4">
            Comprehensive Keyword Report
          </h1>
          <p className="text-lg text-[#008e7a]/80 max-w-2xl mx-auto">
            Discover high-value keywords, analyze competitor strategies, and optimize your content for better rankings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-12">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#008e7a] h-5 w-5" />
            <Input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10 h-12 text-base shadow-lg border-2 border-[#008e7a]/20 focus:border-[#008e7a] transition-colors"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 text-base shadow-lg bg-gradient-to-r from-[#008e7a] to-[#006b5c] hover:from-[#007a69] hover:to-[#005a4d]" disabled={loading}>
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

        {keywordData && (
          <div className="space-y-8">
            {/* Header Card with Summary */}
            <Card className="shadow-xl border-0 bg-gradient-to-r from-[#008e7a]/10 to-[#008e7a]/5 border-l-4 border-[#008e7a]">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl text-[#008e7a]">
                  <BarChart3 className="h-6 w-6 text-[#008e7a]" />
                  Keyword Analysis for
                </CardTitle>
                <CardDescription className="text-lg font-medium text-[#008e7a] break-all">
                  {keywordData.url}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-[#008e7a]/20">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-[#008e7a]" />
                      <span className="font-semibold text-[#008e7a]">Total Keywords</span>
                    </div>
                    <p className="text-3xl font-bold text-[#008e7a]">{keywordData.keywords?.length || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-[#008e7a]/20">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-[#008e7a]" />
                      <span className="font-semibold text-[#008e7a]">Primary Keywords</span>
                    </div>
                    <p className="text-3xl font-bold text-[#008e7a]">{keywordData.summary?.primary_keywords?.length || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-[#008e7a]/20">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-[#008e7a]" />
                      <span className="font-semibold text-[#008e7a]">Competitors Analyzed</span>
                    </div>
                    <p className="text-3xl font-bold text-[#008e7a]">{keywordData.competitor_analysis?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Keywords Section */}
            <Card className="shadow-xl border-0 border-l-4 border-[#008e7a]">
              <CardHeader className="bg-gradient-to-r from-[#008e7a] to-[#006b5c] text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Search className="h-5 w-5" />
                  Keyword Analysis
                </CardTitle>
                <CardDescription className="text-[#008e7a]/90">
                  Detailed breakdown of keywords by search volume, difficulty, and intent
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {keywordData.keywords?.map((keyword, i) => (
                    <Card key={i} className="group hover:shadow-lg transition-all duration-300 border border-[#008e7a]/20 hover:border-[#008e7a]/40">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-bold text-[#008e7a] group-hover:text-[#006b5c] transition-colors line-clamp-2">
                            {keyword.keyword}
                          </CardTitle>
                          <Badge variant="secondary" className={getIntentColor(keyword.intent)}>
                            {keyword.intent}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-[#008e7a]">Search Volume</span>
                          <span className="font-semibold flex items-center gap-1 text-[#008e7a]">
                            <TrendingUp className="h-4 w-4 text-[#008e7a]" />
                            {keyword.search_volume.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-[#008e7a]">Difficulty</span>
                          <Badge variant="secondary" className={getDifficultyColor(keyword.difficulty)}>
                            {keyword.difficulty}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-[#008e7a]">Relevance Score</span>
                          <div className="flex items-center gap-2">
                            <Progress value={keyword.relevance_score} className="w-20 h-2 bg-[#008e7a]/20" />
                            <span className="font-semibold text-[#008e7a]">{keyword.relevance_score}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-[#008e7a]">Frequency</span>
                          <span className="font-semibold text-[#008e7a]">{keyword.frequency}</span>
                        </div>
                        {keyword.related_keywords.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-[#008e7a] block mb-2">Related Keywords</span>
                            <div className="flex flex-wrap gap-1">
                              {keyword.related_keywords.slice(0, 3).map((related, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-[#008e7a]/5 text-[#008e7a] border-[#008e7a]/20">
                                  {related}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Competitor Analysis Section */}
            {keywordData.competitor_analysis?.length > 0 && (
              <Card className="shadow-xl border-0 border-l-4 border-[#008e7a]">
                <CardHeader className="bg-gradient-to-r from-[#008e7a] to-[#006b5c] text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Users className="h-5 w-5" />
                    Competitor Analysis
                  </CardTitle>
                  <CardDescription className="text-[#008e7a]/90">
                    Insights into competitor keyword strategies and opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {keywordData.competitor_analysis.map((competitor, i) => (
                      <Card key={i} className="border border-[#008e7a]/20">
                        <CardHeader>
                          <CardTitle className="text-lg text-[#008e7a]">{competitor.competitor_name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-[#008e7a] mb-2">Strengths</h4>
                              <ul className="space-y-1">
                                {competitor.strengths.map((strength, idx) => (
                                  <li key={idx} className="text-sm text-[#008e7a]/90 flex items-start gap-2">
                                    <Star className="h-3 w-3 text-[#008e7a] mt-1 flex-shrink-0" />
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#008e7a] mb-2">Gaps & Opportunities</h4>
                              <ul className="space-y-1">
                                {competitor.gaps.map((gap, idx) => (
                                  <li key={idx} className="text-sm text-[#008e7a]/90 flex items-start gap-2">
                                    <Lightbulb className="h-3 w-3 text-[#008e7a] mt-1 flex-shrink-0" />
                                    {gap}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <h4 className="font-semibold text-[#008e7a] text-sm mb-2">Core Keywords</h4>
                              <div className="flex flex-wrap gap-1">
                                {competitor.core_keywords.slice(0, 3).map((keyword, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs bg-[#008e7a]/5 text-[#008e7a] border-[#008e7a]/20">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#008e7a] text-sm mb-2">Long-tail Keywords</h4>
                              <div className="flex flex-wrap gap-1">
                                {competitor.long_tail_keywords.slice(0, 2).map((keyword, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs bg-[#008e7a]/5 text-[#008e7a] border-[#008e7a]/20">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#008e7a] text-sm mb-2">High Volume/Low Comp</h4>
                              <div className="flex flex-wrap gap-1">
                                {competitor.high_volume_low_competition.slice(0, 2).map((keyword, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs bg-[#008e7a]/5 text-[#008e7a] border-[#008e7a]/20">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendations Section */}
            {keywordData.recommendations?.length > 0 && (
              <Card className="shadow-xl border-0 bg-gradient-to-r from-[#008e7a]/10 to-[#008e7a]/5 border-l-4 border-[#008e7a]">
                <CardHeader className="bg-gradient-to-r from-[#008e7a] to-[#006b5c] text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Target className="h-5 w-5" />
                    Strategic Recommendations
                  </CardTitle>
                  <CardDescription className="text-[#008e7a]/90">
                    Actionable steps to improve your keyword strategy and rankings
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {keywordData.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border-l-4 border-[#008e7a]">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#008e7a]/10 rounded-full flex items-center justify-center">
                          <span className="text-[#008e7a] font-bold text-sm">{i + 1}</span>
                        </div>
                        <p className="text-[#008e7a] leading-relaxed">{rec.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Blog Topics Section */}
            {keywordData.blog_topics?.length > 0 && (
              <Card className="shadow-xl border-0 border-l-4 border-[#008e7a]">
                <CardHeader className="bg-gradient-to-r from-[#008e7a] to-[#006b5c] text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <PenTool className="h-5 w-5" />
                    Content Ideas & Blog Topics
                  </CardTitle>
                  <CardDescription className="text-[#008e7a]/90">
                    High-potential topics to attract your target audience
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {keywordData.blog_topics.map((topic, i) => (
                      <div key={i} className="p-4 bg-white rounded-lg border border-[#008e7a]/20 hover:border-[#008e7a]/40 transition-colors">
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-[#008e7a] mt-0.5 flex-shrink-0" />
                          <p className="text-[#008e7a] leading-relaxed">{topic}</p>
                        </div>
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