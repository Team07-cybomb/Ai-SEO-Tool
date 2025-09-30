"use client";
import { useState, FC } from "react";
import axios from "axios";

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
  error?: string; // To handle fallback messages from the backend
}

// A map to associate keyword groups with colors and descriptions
const keywordGroupConfig = {
    primary_keywords: { title: "Primary Keywords", color: "bg-blue-500", description: "Core topics your content revolves around." },
    secondary_keywords: { title: "Secondary Keywords", color: "bg-green-500", description: "Supporting terms that add context to primary keywords." },
    long_tail_keywords: { title: "Long Tail Keywords", color: "bg-purple-500", description: "More specific, multi-word phrases indicating higher intent." },
    related_keywords: { title: "Related Keywords", color: "bg-pink-500", description: "Semantically linked terms that can broaden your content's reach." },
};

const intentGroupConfig = {
    informational: { title: "Informational", color: "bg-yellow-500", description: "Keywords used when searching for information or answers." },
    navigational: { title: "Navigational", color: "bg-orange-500", description: "Keywords used to find a specific website or page." },
    transactional: { title: "Transactional", color: "bg-red-500", description: "Keywords indicating a strong intent to make a purchase." },
    commercial: { title: "Commercial", color: "bg-teal-500", description: "Keywords showing interest in specific products or services." },
};


// KeywordChip component for displaying a single keyword
const KeywordChip: FC<{ keyword: string; color: string }> = ({ keyword, color }) => (
    <span className={`inline-block ${color} text-white text-sm font-medium px-3 py-1 rounded-full shadow-sm`}>
        {keyword}
    </span>
);

// KeywordGroup component for displaying a category of keywords
const KeywordGroup: FC<{ title: string; keywords?: string[]; color: string; description: string }> = ({ title, keywords, color, description }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 transform transition-all hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{description}</p>
            {(!keywords || keywords.length === 0) ? (
                <p className="text-gray-400 italic text-sm">No keywords were identified for this category.</p>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {keywords.map((kw, idx) => (
                        <KeywordChip key={idx} keyword={kw} color={color} />
                    ))}
                </div>
            )}
        </div>
    );
};


// Main Scraper Page component
export default function ScraperPage() {
    const [url, setUrl] = useState<string>("");
    const [jsonResult, setJsonResult] = useState<KeywordData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [scrapeInfo, setScrapeInfo] = useState<{ url: string; count: number } | null>(null);

    const handleCrawl = async () => {
        if (!url.trim()) {
            setError("Please enter a valid URL.");
            return;
        }
        setLoading(true);
        setError(null);
        setJsonResult(null);
        setScrapeInfo(null);

        try {
            // NOTE: Replace with your actual API endpoint if different.
            const response = await axios.post("http://localhost:5000/api/crawl", { url });
            if (response.data?.success && response.data.data) {
                setJsonResult(response.data.data);
                setScrapeInfo({ url: response.data.mainUrl, count: response.data.totalScraped });
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

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="bg-white shadow-md rounded-xl p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">SEO Keyword Extractor</h1>
                    <p className="text-gray-600 mt-1">Enter a website URL to crawl and analyze its keyword landscape.</p>
                </header>

                <main>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter website URL (e.g., https://example.com)"
                            className="flex-grow w-full px-4 py-3 text-lg text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                        />
                        <button
                            onClick={handleCrawl}
                            disabled={loading}
                            className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analyzing...
                                </>
                            ) : "Analyze Keywords"}
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md mb-6" role="alert">
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}
                    
                    {jsonResult?.error && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg shadow-md mb-6" role="alert">
                            <p className="font-bold">Analysis Notice</p>
                            <p>{jsonResult.error}</p>
                        </div>
                    )}

                    {!loading && jsonResult && (
                        <div className="space-y-8">
                           {scrapeInfo && (
                             <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                               <p className="text-gray-700">Analysis complete for <strong className="text-blue-600">{scrapeInfo.url}</strong>. Scanned <strong className="text-blue-600">{scrapeInfo.count}</strong> pages.</p>
                             </div>
                           )}

                            {/* Main Keyword Categories */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(keywordGroupConfig).map(([key, config]) => (
                                    <KeywordGroup
                                        key={key}
                                        title={config.title}
                                        keywords={jsonResult[key as keyof KeywordData] as string[]}
                                        color={config.color}
                                        description={config.description}
                                    />
                                ))}
                            </div>

                             {/* Search Intent Section */}
                             <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Search Intent Analysis</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {Object.entries(intentGroupConfig).map(([key, config]) => (
                                    <KeywordGroup
                                        key={key}
                                        title={config.title}
                                        keywords={jsonResult.keyword_intent[key as keyof KeywordIntent]}
                                        color={config.color}
                                        description={config.description}
                                    />
                                ))}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
