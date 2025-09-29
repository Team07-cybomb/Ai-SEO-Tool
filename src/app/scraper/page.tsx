"use client";
import { useState } from 'react';
import axios from 'axios';

// Interface for the data returned by the recursive crawler
interface CrawlResult {
    url: string;
    depth: number;
    title: string;
    content: string[]; // Holds all scraped content (paragraphs, headings, etc.)
    foundLinks: number;
    error?: string;
}

// Helper function for depth color visualization
const getColorForDepth = (depth: number) => {
    // Colors assigned to depth levels (0, 1, 2, 3+)
    const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545'];
    return colors[Math.min(depth, colors.length - 1)];
};

// --- NEW COMPONENT: Handles the interactive content display for a single URL ---
const ContentBlock = ({ result }: { result: CrawlResult }) => {
    // Local state to track if the full content should be shown
    const [isExpanded, setIsExpanded] = useState(false);
    
    const MAX_SHOWN_BLOCKS = 5;
    // Determine which content to show: full array or just the first 5 elements
    const contentToShow = isExpanded ? result.content : result.content.slice(0, MAX_SHOWN_BLOCKS);
    
    const hasMoreContent = result.content.length > MAX_SHOWN_BLOCKS;
    const remainingCount = result.content.length - MAX_SHOWN_BLOCKS;
    const depthColor = getColorForDepth(result.depth);

    return (
        <div style={{ 
            marginBottom: '25px', 
            border: `1px solid #eee`,
            borderLeft: `5px solid ${depthColor}`,
            padding: '15px', 
            borderRadius: '6px', 
            background: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
            <h3 style={{ color: '#333', marginTop: '0', fontSize: '18px' }}>
                <span style={{ color: depthColor, fontWeight: 'bold' }}>[Depth {result.depth}]</span> 
                <a href={result.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#0056b3', marginLeft: '10px' }}>{result.url}</a>
            </h3>
            
            {result.error ? (
                <p style={{ color: 'red', fontWeight: 'bold' }}>Scrape Error: {result.error}</p>
            ) : (
                <div>
                    <p><strong>Title:</strong> {result.title}</p>
                    <p style={{ marginTop: '10px', fontSize: '14px', color: '#6c757d' }}>
                        Content Extracted ({result.content.length} blocks) | Found {result.foundLinks} internal links.
                    </p>

                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                        {contentToShow.map((text, textIndex) => (
                            <li key={textIndex} style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>
                                {text.substring(0, 150)}{text.length > 150 ? '...' : ''}
                            </li>
                        ))}
                    </ul>
                    
                    {/* --- SHOW MORE / SHOW LESS BUTTON --- */}
                    {hasMoreContent && (
                         <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            style={{ 
                                background: '#f8f9fa', 
                                border: '1px solid #ddd', 
                                color: '#007bff', 
                                cursor: 'pointer', 
                                padding: '8px 15px',
                                borderRadius: '4px',
                                marginTop: '10px',
                                fontWeight: 'bold'
                            }}
                        >
                            {isExpanded ? 'Show Less Content' : `Show ${remainingCount} More Content Blocks`}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

// --- MAIN PAGE COMPONENT ---
export default function ScraperPage() {
    const [url, setUrl] = useState<string>('');
    const [mainUrl, setMainUrl] = useState<string>('');
    const [crawlingData, setCrawlingData] = useState<CrawlResult[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleCrawl = async () => {
        setLoading(true);
        setError(null);
        setCrawlingData(null);
        setMainUrl('');
        try {
            const response = await axios.post('http://localhost:3000/api/crawl', { url });
            
            if (response.data && response.data.data) {
                setCrawlingData(response.data.data as CrawlResult[]);
                setMainUrl(response.data.mainUrl);
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
        <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif', background: '#f4f7f6', minHeight: '100vh' }}>
            <h1 style={{ color: '#1a202c' }}>Recursive Web Scraper 🕸️</h1>
            <p style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
                This tool recursively scrapes internal sub-links up to a depth of 3 and displays content blocks interactively.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter starting URL (e.g., https://example.com)"
                    style={{ flex: 1, padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <button
                    onClick={handleCrawl}
                    disabled={loading}
                    style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', transition: 'background-color 0.3s' }}
                >
                    {loading ? 'Crawling...' : 'Start Crawl'}
                </button>
            </div>

            {loading && <p style={{ color: '#007bff' }}>Loading data...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {crawlingData && (
                <div style={{ marginTop: '20px', padding: '15px', borderRadius: '8px', background: '#f9f9f9', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', color: '#1a202c' }}>Crawl Results ({crawlingData.length} Pages Scraped)</h2>
                    <p style={{ marginBottom: '20px', fontWeight: 'bold' }}>Starting URL: {mainUrl}</p>
                    
                    {/* Render each scraped result using the ContentBlock component */}
                    {crawlingData.map((result, index) => (
                        <ContentBlock key={index} result={result} />
                    ))}
                </div>
            )}
        </div>
    );
}
