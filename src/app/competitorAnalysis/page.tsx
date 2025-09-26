"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Loader2, LinkIcon, XCircle, Users, TrendingUp, Target, Star, Search, FileText, Lightbulb, PenTool, Globe, MapPin } from "lucide-react"

// n8n webhook URL
const API_URL = "https://n8n.cybomb.com/webhook/competitor-analysis"

interface CompetitorAnalysis {
  competitor_name: string
  website_url: string
  inferred_location: string
  core_keywords: string[]
  long_tail_keywords: string[]
  technical_or_niche_keywords: string[]
  local_keywords: string[]
  high_volume_low_competition: string[]
  keyword_groupings: {
    [key: string]: string[]
  }
  strengths: string[]
  gaps: string[]
}

interface LandscapeSummary {
  industry_keyword_themes: string[]
  competitor_overlap: string[]
  local_strategies: string[]
  opportunity_gaps: string[]
}

interface KeywordData {
  url: string
  inferred_location: string
  competitor_analysis: CompetitorAnalysis[]
  landscape_summary: LandscapeSummary
  recommendations: string[]
  blog_topics: string[]
  meta_examples: Array<{
    meta_title: string
    meta_description: string
  }>
}

interface N8nResponse {
  output: string | KeywordData
}

export default function KeywordAnalysis() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [keywordData, setKeywordData] = useState<KeywordData | null>(null)
  const [showAnimations, setShowAnimations] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  useEffect(() => {
    if (keywordData) {
      const timer = setTimeout(() => {
        setShowAnimations(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [keywordData])

  useEffect(() => {
    let progressInterval: NodeJS.Timeout
    if (loading) {
      setAnalysisProgress(0)
      progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)
    }
    return () => clearInterval(progressInterval)
  }, [loading])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!url) {
      setError("Please enter a valid URL.")
      return
    }

    setLoading(true)
    setError("")
    setKeywordData(null)
    setShowAnimations(false)
    setAnalysisProgress(0)

    try {
      const payload = {
        url
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: N8nResponse = await response.json()

      // Handle the nested JSON string structure from n8n
      let parsedData: KeywordData;
      
      if (typeof data.output === 'string') {
        // Clean the string and parse the JSON
        const cleanedOutput = data.output
          .replace(/```json\n?/g, "")
          .replace(/```/g, "")
          .trim();
        
        try {
          parsedData = JSON.parse(cleanedOutput);
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          // If parsing fails, try to extract JSON from the string more carefully
          const jsonMatch = cleanedOutput.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedData = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("Failed to parse the response data");
          }
        }
      } else if (data.output && typeof data.output === 'object') {
        // If it's already an object, use it directly
        parsedData = data.output as KeywordData;
      } else {
        throw new Error("Unexpected response format from server");
      }

      // Validate the parsed data has required structure
      if (!parsedData.url || !parsedData.competitor_analysis) {
        throw new Error("Invalid data structure received from server");
      }

      setKeywordData(parsedData)
      setAnalysisProgress(100)
    } catch (err) {
      console.error('Error fetching data:', err)
      if (err instanceof Error) {
        setError(err.message || "Failed to analyze competitors. Please try again.")
      } else {
        setError("An unknown error occurred. Please check the URL and try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Function to remove asterisks from text
  const cleanText = (text: string) => {
    return text.replace(/\*\*/g, '')
  }

  // Function to extract bold text for highlighting
  const renderTextWithHighlights = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={index} className="font-bold text-[#008e7a]">
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  }

  return (
    <div className="min-h-screen bg-white py-22 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <Badge className="mb-4 px-4 py-1.5 text-sm bg-[#008e7a] hover:bg-[#007a69] text-white">
            <Search className="w-3 h-3 mr-1" />
            SEO Competitor Analysis
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#008e7a] to-[#006b5c] bg-clip-text text-transparent mb-4">
            Competitive Intelligence Report
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze competitor strategies, identify keyword opportunities, and optimize your SEO positioning
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#008e7a] h-5 w-5" />
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 h-12 text-base shadow-lg border-2 border-gray-200 focus:border-[#008e7a] transition-colors"
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
                  Analyze Competitors
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2 ml-1">
            Enter a URL to get comprehensive competitor analysis and keyword data
          </p>
        </form>

        {error && (
          <div className="mt-6 flex items-center justify-center text-red-600 bg-red-50 p-4 rounded-lg border border-red-200 max-w-2xl mx-auto">
            <XCircle className="h-5 w-5 mr-2" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Loading Animation with Progress Bar */}
        {loading && (
          <div className="text-center py-12 transition-all duration-500">
            <div className="max-w-md mx-auto mb-8">
              <div className="relative bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#008e7a] to-[#00b894] h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${analysisProgress}%` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_2s_infinite]"></div>
              </div>
              <p className="text-sm text-gray-600">Analyzing competitors... {analysisProgress}%</p>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Analyzing Competitive Landscape
            </h3>
            <p className="text-gray-600">Scanning competitors, identifying keyword opportunities, and generating strategic insights...</p>
          </div>
        )}

        {keywordData && (
          <div className="space-y-8">
            {/* Header Card with Summary */}
            <Card className={`shadow-lg bg-white transition-all duration-500 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <CardHeader className="bg-gradient-to-r from-[#008e7a] to-[#006b5c] text-white rounded-lg">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <BarChart3 className="h-6 w-6" />
                  Competitor Analysis Report
                </CardTitle>
                <CardDescription className="text-blue-100 text-lg font-medium text-center">
                  {keywordData.url}
                  {keywordData.inferred_location && (
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      Location: {keywordData.inferred_location}
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-[#008e7a]" />
                      <span className="font-semibold text-gray-900">Competitors Analyzed</span>
                    </div>
                    <p className="text-3xl font-bold text-[#008e7a]">{keywordData.competitor_analysis?.length || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-[#008e7a]" />
                      <span className="font-semibold text-gray-900">Industry Themes</span>
                    </div>
                    <p className="text-3xl font-bold text-[#008e7a]">{keywordData.landscape_summary?.industry_keyword_themes?.length || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-[#008e7a]" />
                      <span className="font-semibold text-gray-900">Opportunity Gaps</span>
                    </div>
                    <p className="text-3xl font-bold text-[#008e7a]">{keywordData.landscape_summary?.opportunity_gaps?.length || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-[#008e7a]" />
                      <span className="font-semibold text-gray-900">Recommendations</span>
                    </div>
                    <p className="text-3xl font-bold text-[#008e7a]">{keywordData.recommendations?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Industry Landscape Summary */}
            {keywordData.landscape_summary && (
              <Card className={`shadow-lg bg-white transition-all duration-500 delay-200 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <CardHeader className="bg-gradient-to-r from-[#008e7a] to-[#006b5c] text-white rounded-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Globe className="h-5 w-5" />
                    Industry Landscape Summary
                    {keywordData.inferred_location && (
                      <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-white/30">
                        {keywordData.inferred_location}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Key themes, competitor overlaps, and market opportunities
                    {keywordData.inferred_location && ` for ${keywordData.inferred_location}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-3">Industry Keyword Themes</h3>
                    <div className="flex flex-wrap gap-2">
                      {keywordData.landscape_summary.industry_keyword_themes.map((theme, i) => (
                        <Badge key={i} variant="secondary" className="bg-[#008e7a]/10 text-[#008e7a] border-[#008e7a]/20">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-3">Competitor Overlaps</h3>
                      <ul className="space-y-2">
                        {keywordData.landscape_summary.competitor_overlap.map((overlap, i) => (
                          <li key={i} className="text-gray-700 flex items-start gap-2">
                            <Users className="h-4 w-4 text-[#008e7a] mt-0.5 flex-shrink-0" />
                            {renderTextWithHighlights(overlap)}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-3">Opportunity Gaps</h3>
                      <ul className="space-y-2">
                        {keywordData.landscape_summary.opportunity_gaps.map((gap, i) => (
                          <li key={i} className="text-gray-700 flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-[#008e7a] mt-0.5 flex-shrink-0" />
                            {renderTextWithHighlights(gap)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Local Strategies Section */}
                  {keywordData.landscape_summary.local_strategies && (
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-3">Local SEO Strategies</h3>
                      <ul className="space-y-2">
                        {keywordData.landscape_summary.local_strategies.map((strategy, i) => (
                          <li key={i} className="text-gray-700 flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-[#008e7a] mt-0.5 flex-shrink-0" />
                            {renderTextWithHighlights(strategy)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Competitor Analysis Section */}
            {keywordData.competitor_analysis?.length > 0 && (
              <Card className={`shadow-lg bg-white transition-all duration-500 delay-300 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <CardHeader className="bg-gradient-to-r from-[#008e7a] to-[#006b5c] text-white rounded-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Users className="h-5 w-5" />
                    Competitor Analysis ({keywordData.competitor_analysis.length} Competitors)
                    {keywordData.inferred_location && (
                      <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-white/30">
                        {keywordData.inferred_location}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Detailed analysis of competitor keyword strategies and positioning
                    {keywordData.inferred_location && ` in ${keywordData.inferred_location}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {keywordData.competitor_analysis.map((competitor, i) => (
                      <Card key={i} className="border border-gray-200">
                        <CardHeader className="bg-gradient-to-r from-[#008e7a]/10 to-[#006b5c]/10 rounded-t-lg border-b">
                          <CardTitle className="text-lg text-gray-900">{competitor.competitor_name}</CardTitle>
                          <CardDescription className="text-gray-600">
                            <div className="space-y-1">
                              <a href={competitor.website_url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                                <LinkIcon className="h-3 w-3" />
                                {competitor.website_url}
                              </a>
                              {competitor.inferred_location && (
                                <div className="flex items-center gap-1 text-sm">
                                  <MapPin className="h-3 w-3" />
                                  {competitor.inferred_location}
                                </div>
                              )}
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-gray-900 text-lg mb-3 flex items-center gap-2">
                                <Star className="h-4 w-4 text-[#008e7a]" />
                                Strengths
                              </h4>
                              <ul className="space-y-2">
                                {competitor.strengths.map((strength, idx) => (
                                  <li key={idx} className="text-gray-700 flex items-start gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                    {cleanText(strength)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-lg mb-3 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-[#008e7a]" />
                                Gaps & Opportunities
                              </h4>
                              <ul className="space-y-2">
                                {competitor.gaps.map((gap, idx) => (
                                  <li key={idx} className="text-gray-700 flex items-start gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                    {cleanText(gap)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <h4 className="font-semibold text-gray-900 text-sm mb-2">Core Keywords</h4>
                              <div className="flex flex-wrap gap-1">
                                {competitor.core_keywords.slice(0, 4).map((keyword, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs bg-white text-gray-700 border-gray-300">
                                    {cleanText(keyword)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <h4 className="font-semibold text-gray-900 text-sm mb-2">Long-tail Keywords</h4>
                              <div className="flex flex-wrap gap-1">
                                {competitor.long_tail_keywords.slice(0, 3).map((keyword, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs bg-white text-gray-700 border-gray-300">
                                    {cleanText(keyword)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <h4 className="font-semibold text-gray-900 text-sm mb-2">High Volume/Low Comp</h4>
                              <div className="flex flex-wrap gap-1">
                                {competitor.high_volume_low_competition.slice(0, 3).map((keyword, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs bg-white text-gray-700 border-gray-300">
                                    {cleanText(keyword)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <h4 className="font-semibold text-gray-900 text-sm mb-2">Technical Keywords</h4>
                              <div className="flex flex-wrap gap-1">
                                {competitor.technical_or_niche_keywords.slice(0, 3).map((keyword, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs bg-white text-gray-700 border-gray-300">
                                    {cleanText(keyword)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Local Keywords Section */}
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              Local Keywords
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {competitor.local_keywords.slice(0, 6).map((keyword, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-white text-blue-700 border-blue-300">
                                  {cleanText(keyword)}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {competitor.keyword_groupings && Object.keys(competitor.keyword_groupings).length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900 text-lg mb-3">Keyword Groupings</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {Object.entries(competitor.keyword_groupings).map(([category, keywords], idx) => (
                                  <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <h5 className="font-medium text-gray-900 text-sm mb-2 capitalize">{cleanText(category.replace(/_/g, ' '))}</h5>
                                    <div className="flex flex-wrap gap-1">
                                      {keywords.slice(0, 4).map((keyword, kIdx) => (
                                        <Badge key={kIdx} variant="outline" className="text-xs bg-white text-gray-700 border-gray-300">
                                          {cleanText(keyword)}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
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
            )}

            {/* Recommendations Section */}
            {keywordData.recommendations?.length > 0 && (
              <Card className={`shadow-lg bg-white transition-all duration-500 delay-400 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <CardHeader className="bg-gradient-to-r from-[#008e7a] to-[#006b5c] text-white rounded-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Target className="h-5 w-5" />
                    Strategic Recommendations
                    {keywordData.inferred_location && (
                      <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-white/30">
                        {keywordData.inferred_location}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Actionable steps to improve your competitive positioning and SEO strategy
                    {keywordData.inferred_location && ` in ${keywordData.inferred_location}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {keywordData.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-[#008e7a]">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#008e7a]/10 rounded-full flex items-center justify-center">
                          <span className="text-[#008e7a] font-bold text-sm">{i + 1}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{renderTextWithHighlights(rec)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Blog Topics Section */}
            {keywordData.blog_topics?.length > 0 && (
              <Card className={`shadow-lg bg-white transition-all duration-500 delay-500 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <CardHeader className="bg-gradient-to-r from-[#008e7a] to-[#006b5c] text-white rounded-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <PenTool className="h-5 w-5" />
                    Content Ideas & Blog Topics
                    {keywordData.inferred_location && (
                      <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-white/30">
                        {keywordData.inferred_location}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    High-potential topics to attract your target audience
                    {keywordData.inferred_location && ` in ${keywordData.inferred_location}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {keywordData.blog_topics.map((topic, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#008e7a]/40 transition-colors">
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-[#008e7a] mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 leading-relaxed">{cleanText(topic)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Meta Examples Section */}
            {keywordData.meta_examples?.length > 0 && (
              <Card className={`shadow-lg bg-white transition-all duration-500 delay-600 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <CardHeader className="bg-gradient-to-r from-[#008e7a] to-[#006b5c] text-white rounded-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Search className="h-5 w-5" />
                    SEO Meta Examples
                    {keywordData.inferred_location && (
                      <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-white/30">
                        {keywordData.inferred_location}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Optimized meta titles and descriptions for key pages
                    {keywordData.inferred_location && ` targeting ${keywordData.inferred_location}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {keywordData.meta_examples.map((meta, i) => (
                      <Card key={i} className="border border-gray-200 hover:border-[#008e7a]/40 transition-colors">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 text-lg mb-3">Example {i + 1}</h4>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm font-medium text-gray-700 block mb-1">Title:</span>
                              <p className="text-gray-900 font-semibold text-base bg-blue-50 p-2 rounded">{cleanText(meta.meta_title)}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700 block mb-1">Description:</span>
                              <p className="text-gray-700 bg-green-50 p-2 rounded">{cleanText(meta.meta_description)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success Animation */}
            {showAnimations && (
              <div className="text-center py-12 transition-all duration-1000">
                <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-full mb-6 animate-bounce">
                  <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Analysis Complete!</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Your competitive intelligence report {keywordData.inferred_location && `for ${keywordData.inferred_location} `}is ready. Use these insights to optimize your SEO strategy.
                </p>
                
                {/* Final Progress Bar */}
                <div className="max-w-md mx-auto bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-[#008e7a] to-[#00b894] h-2 rounded-full animate-pulse"></div>
                </div>
                <p className="text-sm text-gray-500">Ready to implement your competitive strategy</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}