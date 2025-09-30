"use client";

import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, ChevronDown, ChevronUp, FileText, Globe, Search, BarChart3, Zap, Sparkles, Loader2, XCircle } from "lucide-react";


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";


// Interface for the data returned by the recursive crawler
interface CrawlResult {
    url: string;
    depth: number;
    title?: string;
    content?: string[];
    foundLinks?: number;
    error?: string;
}

// Helper function for depth color visualization
const getColorForDepth = (depth: number) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
    return colors[Math.min(depth, colors.length - 1)];
};

// ContentBlock Component
const ContentBlock = ({ result }: { result: CrawlResult }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [hovered, setHovered] = useState(false);
    
    const safeContent = result.content || [];
    const MAX_SHOWN_BLOCKS = 5;
    const contentToShow = isExpanded ? safeContent : safeContent.slice(0, MAX_SHOWN_BLOCKS);
    
    const hasMoreContent = safeContent.length > MAX_SHOWN_BLOCKS;
    const remainingCount = safeContent.length - MAX_SHOWN_BLOCKS;
    const depthColor = getColorForDepth(result.depth);

    return (
        <Card 
            className={`group hover:shadow-2xl transition-all duration-500 border-l-4 border-l-[${depthColor}] hover:border-l-[${depthColor}]/80 cursor-pointer transform hover:-translate-y-1`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ borderLeftColor: depthColor }}
        >
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Badge 
                            className="text-white font-semibold transition-all duration-300 transform group-hover:scale-105"
                            style={{ backgroundColor: depthColor }}
                        >
                            Depth {result.depth}
                        </Badge>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-blue-500" />
                            <a 
                                href={result.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:underline text-blue-600 break-all"
                            >
                                {result.url}
                            </a>
                        </CardTitle>
                    </div>
                    {!result.error && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FileText className="h-4 w-4" />
                            <span>{safeContent.length} blocks</span>
                            <BarChart3 className="h-4 w-4 ml-2" />
                            <span>{result.foundLinks || 0} links</span>
                        </div>
                    )}
                </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
                {result.error ? (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                        <XCircle className="h-4 w-4" />
                        <span className="font-medium">Scrape Error: {result.error}</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border">
                            <Sparkles className="h-4 w-4 text-blue-500" />
                            <span className="font-medium text-gray-900">{result.title || 'No title available'}</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-amber-500" />
                                <span className="text-sm font-medium text-gray-700">Extracted Content</span>
                            </div>
                            <ul className="space-y-2">
                                {contentToShow.map((text, textIndex) => (
                                    <li 
                                        key={textIndex} 
                                        className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-300 hover:bg-white hover:shadow-md"
                                    >
                                        {text.substring(0, 150)}{text.length > 150 ? '...' : ''}
                                    </li>
                                ))}
                            </ul>
                            
                            {hasMoreContent && (
                                <Button
                                    variant="outline"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="w-full border-dashed border-teal-200 text-teal-600 hover:text-teal-700 hover:bg-teal-50 transition-all duration-300"
                                >
                                    {isExpanded ? (
                                        <>
                                            <ChevronUp className="h-4 w-4 mr-2" />
                                            Show Less Content
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="h-4 w-4 mr-2" />
                                            Show {remainingCount} More Content Blocks
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// Main Page Component
export default function ScraperPage() {
    const [url, setUrl] = useState<string>('');
    const [mainUrl, setMainUrl] = useState<string>('');
    const [crawlingData, setCrawlingData] = useState<CrawlResult[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showAnimations, setShowAnimations] = useState(false);

    const handleCrawl = async () => {
        setLoading(true);
        setError(null);
        setCrawlingData(null);
        setMainUrl('');
        setShowAnimations(false);

        try {
           const response = await axios.post(`${API_URL}/api/crawl`, { url });
            
            if (response.data && response.data.data) {
                setCrawlingData(response.data.data as CrawlResult[]);
                setMainUrl(response.data.mainUrl);
                setTimeout(() => setShowAnimations(true), 500);
            } else {
                setError('Unexpected API response format.');
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.error || 'An error occurred during crawling.');
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

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
                                <Globe className="w-3 h-3 mr-1" />
                                Web Scraper
                            </Badge>
                            <div className="absolute -inset-1 bg-teal-300/30 rounded-lg blur-sm animate-pulse"></div>
                        </div>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-700 via-teal-600 to-teal-700 bg-clip-text text-transparent mb-4 relative">
                        Recursive Web Scraper
                        <Sparkles className="absolute -top-2 -right-6 w-5 h-5 text-teal-400 animate-spin" />
                    </h1>
                    
                    <div className="text-lg text-gray-600 max-w-2xl mx-auto relative text-center">
                        <p>
                            Recursively scrape internal sub-links up to a depth of 3 and analyze content structure
                        </p>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent"></div>
                    </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleCrawl(); }} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-16 relative">
                    <div className="relative flex-1 group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 to-blue-400 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 h-5 w-5 z-10" />
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
                                <span className="relative z-10">Crawling...</span>
                            </>
                        ) : (
                            <>
                                <BarChart3 className="mr-2 h-4 w-4 relative z-10" />
                                <span className="relative z-10">Start Crawl</span>
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
                            <h3 className="text-2xl font-bold text-gray-900">Crawling Website</h3>
                        </div>
                        <p className="text-gray-600 text-lg">Discovering pages and extracting content...</p>
                        <div className="mt-6 flex justify-center gap-1">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
                            ))}
                        </div>
                    </div>
                )}

                {crawlingData && (
                    <div className={`space-y-8 transition-all duration-700 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        {/* Header Card with Summary Stats */}
                        <Card className="shadow-2xl bg-white/80 backdrop-blur-sm border-0">
                            <CardHeader className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 text-white rounded-t-2xl pb-6 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-300 via-white/30 to-teal-300"></div>
                                <div className="flex items-center justify-center gap-3 mb-3 relative z-10">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <BarChart3 className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold">Crawl Results</CardTitle>
                                </div>
                                <CardDescription className="text-teal-100 text-lg font-medium text-center flex items-center justify-center gap-2">
                                    <ExternalLink className="h-4 w-4" />
                                    {mainUrl}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-8 pb-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        { icon: FileText, label: "Pages Scraped", value: crawlingData.length, color: "from-blue-400 to-blue-500" },
                                        { icon: Globe, label: "Starting URL", value: mainUrl ? 1 : 0, color: "from-purple-400 to-purple-500" },
                                        { icon: Zap, label: "Total Content Blocks", value: crawlingData.reduce((acc, curr) => acc + (curr.content?.length || 0), 0), color: "from-amber-400 to-amber-500" }
                                    ].map((stat, index) => (
                                        <div 
                                            key={index}
                                            className="text-center p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                        >
                                            <div className="flex items-center justify-center gap-2 mb-3">
                                                <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} shadow-lg`}>
                                                    <stat.icon className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-600 mb-1">{stat.label}</p>
                                            <p className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                                {stat.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Results Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {crawlingData.map((result, index) => (
                                <div 
                                    key={index}
                                    className={`transition-all duration-500 delay-${index * 100} ${
                                        showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                    }`}
                                >
                                    <ContentBlock result={result} />
                                </div>
                            ))}
                        </div>

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
                                    Crawl Complete!
                                </h3>
                                <p className="text-gray-600 mb-8 text-lg">Successfully analyzed {crawlingData.length} pages and extracted content.</p>
                            </div>
                        )}
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
    );
}