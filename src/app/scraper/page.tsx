"use client";
import { useState, FC } from "react";
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Define the structure of the data we expect from the API
interface KeywordIntent {
  informational: string[];
  navigational: string[];
  transactional: string[];
  commercial: string[];
}

interface KeywordData {
  primary_keywords: string[];
  secondary_keywords: string[];
  long_tail_keywords: string[];
  related_keywords: string[];
  keyword_intent: KeywordIntent;
  error?: string;
  url?: string;
  keywordCount?: number;
}

// A map to associate keyword groups with colors and descriptions - Updated to teal shades
const keywordGroupConfig = {
  primary_keywords: { 
    title: "Primary Keywords", 
    color: "bg-gradient-to-r from-teal-500 to-teal-600", 
    description: "Core topics your content revolves around.",
    icon: "⭐"
  },
  secondary_keywords: { 
    title: "Secondary Keywords", 
    color: "bg-gradient-to-r from-teal-400 to-teal-500", 
    description: "Supporting terms that add context to primary keywords.",
    icon: "🎯"
  },
  long_tail_keywords: { 
    title: "Long Tail Keywords", 
    color: "bg-gradient-to-r from-cyan-500 to-teal-500", 
    description: "More specific, multi-word phrases indicating higher intent.",
    icon: "📈"
  },
  related_keywords: { 
    title: "Related Keywords", 
    color: "bg-gradient-to-r from-emerald-500 to-teal-500", 
    description: "Semantically linked terms that can broaden your content's reach.",
    icon: "🔗"
  },
};

const intentGroupConfig = {
  informational: { 
    title: "Informational", 
    color: "bg-gradient-to-r from-teal-400 to-cyan-500", 
    description: "Keywords used when searching for information or answers.",
    icon: "🔍"
  },
  navigational: { 
    title: "Navigational", 
    color: "bg-gradient-to-r from-teal-500 to-blue-500", 
    description: "Keywords used to find a specific website or page.",
    icon: "🧭"
  },
  transactional: { 
    title: "Transactional", 
    color: "bg-gradient-to-r from-teal-600 to-emerald-500", 
    description: "Keywords indicating a strong intent to make a purchase.",
    icon: "💰"
  },
  commercial: { 
    title: "Commercial", 
    color: "bg-gradient-to-r from-cyan-600 to-teal-500", 
    description: "Keywords showing interest in specific products or services.",
    icon: "🛒"
  },
};

// KeywordChip component for displaying a single keyword
const KeywordChip: FC<{ keyword: string; color: string }> = ({ keyword, color }) => (
  <span className={`inline-block ${color} text-white text-sm font-medium px-3 py-2 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl`}>
    {keyword}
  </span>
);

// KeywordGroup component for displaying a category of keywords
const KeywordGroup: FC<{ 
  title: string; 
  keywords?: string[]; 
  color: string; 
  description: string;
  icon: string;
  animationDelay?: number;
}> = ({ title, keywords, color, description, icon, animationDelay = 0 }) => {
  return (
    <div 
      className="bg-white/80 backdrop-blur-sm border border-teal-100 rounded-2xl shadow-xl p-6 transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shadow-lg`}>
          <span className="text-white font-bold text-lg">{icon}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {(!keywords || keywords.length === 0) ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2 text-teal-300">🔍</div>
          <p className="text-gray-400 italic">No keywords identified for this category</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {keywords.map((kw, idx) => (
            <KeywordChip key={idx} keyword={kw} color={color} />
          ))}
        </div>
      )}
    </div>
  );
};

// Stats Card Component
const StatsCard: FC<{ 
  title: string; 
  value: string | number; 
  description: string;
  color: string;
  icon: string;
}> = ({ title, value, description, color, icon }) => (
  <div className="bg-white/80 backdrop-blur-sm border border-teal-100 rounded-2xl shadow-lg p-6 text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
      <span className="text-white font-bold text-lg">{icon}</span>
    </div>
    <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
    <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

// Main Scraper Page component
export default function ScraperPage() {
  const [url, setUrl] = useState<string>("");
  const [jsonResult, setJsonResult] = useState<KeywordData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [scrapeInfo, setScrapeInfo] = useState<{ url: string; count: number } | null>(null);
  const [showAnimations, setShowAnimations] = useState(false);

  const handleCrawl = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL.");
      return;
    }
    setLoading(true);
    setError(null);
    setJsonResult(null);
    setScrapeInfo(null);
    setShowAnimations(false);

    try {
      const response = await axios.post(`${API_URL}/api/crawl`, { url });
      if (response.data?.success && response.data.data) { 
        setJsonResult(response.data.data);
        setScrapeInfo({ url: response.data.mainUrl, count: response.data.totalScraped });
        setTimeout(() => setShowAnimations(true), 500);
      } else {
        setError(response.data.error || "An unexpected API response was received.");
      }
    } catch (err: any) {
      console.error("Crawl error:", err);
      const errorMessage = err.response?.data?.error || "Failed to fetch data. The server might be down or the URL is unreachable.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCrawl();
    }
  };

  const getTotalKeywordCount = (data: KeywordData | null): number => {
    if (!data) return 0;
    return (
      (data.primary_keywords?.length || 0) +
      (data.secondary_keywords?.length || 0) +
      (data.long_tail_keywords?.length || 0) +
      (data.related_keywords?.length || 0)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-teal-50/30 to-cyan-50/30 py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <header className="text-center mb-12 relative">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <span className="px-4 py-1.5 text-sm bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full shadow-lg shadow-teal-200/50 relative z-10 font-semibold">
                🔍 SEO Keyword Analysis
              </span>
              <div className="absolute -inset-1 bg-teal-300/30 rounded-lg blur-sm animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4 relative">
            SEO Keyword Extractor
            <span className="absolute -top-2 -right-6 text-teal-400 animate-spin">✨</span>
          </h1>
          
          <div className="text-lg text-gray-600 max-w-2xl mx-auto relative">
            <p>
              Enter a website URL to crawl and analyze its complete keyword landscape
            </p>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent"></div>
          </div>
        </header>

        <main>
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-16 relative">
            <div className="relative flex-1 group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 text-lg z-10">🔗</span>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 text-lg text-gray-700 bg-white/80 backdrop-blur-sm border-0 rounded-xl shadow-xl focus:ring-2 focus:ring-teal-300 transition-all duration-300"
                />
              </div>
            </div>
            
            <button
              onClick={handleCrawl}
              disabled={loading}
              className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 rounded-xl shadow-xl relative overflow-hidden group transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              {loading ? (
                <>
                  <span className="animate-spin inline-block mr-2">⏳</span>
                  <span className="relative z-10">Analyzing...</span>
                </>
              ) : (
                <>
                  <span className="mr-2 relative z-10">🔎</span>
                  <span className="relative z-10">Analyze Keywords</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-6 flex items-center justify-center text-red-600 bg-red-50 p-4 rounded-xl border border-red-200 max-w-2xl mx-auto shadow-lg transform transition-all duration-300 hover:scale-105">
              <span className="mr-2">❌</span>
              <p className="font-medium">{error}</p>
            </div>
          )}
          
          {jsonResult?.error && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-xl shadow-lg mb-6 max-w-2xl mx-auto" role="alert">
              <p className="font-bold">Analysis Notice</p>
              <p>{jsonResult.error}</p>
            </div>
          )}

          {!loading && jsonResult && (
            <div className="space-y-8">
              {/* Header Stats */}
              {scrapeInfo && (
                <div className={`bg-white/80 backdrop-blur-sm border border-teal-100 rounded-2xl shadow-2xl p-8 transition-all duration-700 transform ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete! 🎉</h2>
                    <p className="text-gray-600">
                      Successfully analyzed <strong className="text-teal-600">{scrapeInfo.url}</strong>
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard 
                      title="Pages Scanned" 
                      value={scrapeInfo.count} 
                      description="Total pages analyzed"
                      color="bg-gradient-to-r from-teal-400 to-cyan-400"
                      icon="📄"
                    />
                    <StatsCard 
                      title="Total Keywords" 
                      value={getTotalKeywordCount(jsonResult)} 
                      description="Keywords identified"
                      color="bg-gradient-to-r from-cyan-400 to-teal-400"
                      icon="🔑"
                    />
                    <StatsCard 
                      title="Search Intents" 
                      value={4}
                      description="Different search intent types"
                      color="bg-gradient-to-r from-teal-500 to-cyan-500"
                      icon="🎯"
                    />
                  </div>
                </div>
              )}

              {/* Main Keyword Categories */}
              <div className={`transition-all duration-700 delay-200 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center border-b pb-4 border-teal-200">
                  Keyword Analysis 📊
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.entries(keywordGroupConfig).map(([key, config], index) => (
                    <KeywordGroup
                      key={key}
                      title={config.title}
                      keywords={jsonResult[key as keyof KeywordData] as string[]}
                      color={config.color}
                      description={config.description}
                      icon={config.icon}
                      animationDelay={index * 100}
                    />
                  ))}
                </div>
              </div>

              {/* Search Intent Section */}
              <div className={`transition-all duration-700 delay-400 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center border-b pb-4 border-teal-200">
                  Search Intent Analysis 🎯
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(intentGroupConfig).map(([key, config], index) => (
                    <KeywordGroup
                      key={key}
                      title={config.title}
                      keywords={jsonResult.keyword_intent[key as keyof KeywordIntent]}
                      color={config.color}
                      description={config.description}
                      icon={config.icon}
                      animationDelay={index * 100 + 400}
                    />
                  ))}
                </div>
              </div>

              {/* Success Animation */}
              {showAnimations && (
                <div className="text-center py-12 transition-all duration-1000">
                  <div className="inline-flex items-center justify-center p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-3xl mb-6 shadow-2xl border border-teal-200">
                    <div className="relative">
                      <div className="absolute inset-0 bg-teal-400/20 rounded-full animate-ping"></div>
                      <span className="text-4xl relative z-10 text-teal-500">✅</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    Analysis Complete!
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg">Your comprehensive keyword analysis is ready for review.</p>
                  
                  <div className="max-w-md mx-auto bg-gray-200 rounded-full h-3 mb-6 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 h-3 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Ready to optimize your SEO strategy</p>
                </div>
              )}
            </div>
          )}

          {/* Loading Animation - Fixed without left side element */}
          {loading && (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto mb-8">
                <div className="bg-gray-200 rounded-full h-3 shadow-inner overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 h-3 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="animate-spin text-2xl text-teal-500">⏳</span>
                <h3 className="text-2xl font-bold text-gray-900">Analyzing Website</h3>
              </div>
              <p className="text-gray-600 text-lg">Scanning pages and extracting keywords...</p>
              <div className="mt-6 flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <div 
                    key={i} 
                    className="w-3 h-3 bg-teal-400 rounded-full animate-bounce"
                    style={{ 
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '1.5s'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </main>
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