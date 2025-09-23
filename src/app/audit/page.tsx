"use client";
 
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { ScoreCard, DetailedAnalysis, Recommendations, HeaderSection, PerformanceMetrics, ScoresRadar, ScoreTrends } from "./frontend";
import PDFGenerator from "./pdf";
import { runAudit } from "./backend";

interface DecodedToken {
  user: {
    id: string;
    role?: string;
  };
}

interface Recommendation {
  text: string;
  priority: "High" | "Medium" | "Low";
}

interface AuditReport {
  seo?: number;
  performance?: number;
  accessibility?: number;
  bestPractices?: number;
  analysis?: string;
  recommendations?: Recommendation[];
  backlinks?: number;
  history?: { 
    date: string; 
    seo: number; 
    performance: number; 
    accessibility: number; 
    bestPractices: number 
  }[];
  issues?: { category: string; count: number }[];
  loadingTime?: number;
  pageSize?: number;
  requests?: number;
}
 
export default function AuditPage() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState("Initializing audit...");
  const [auditCount, setAuditCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
 
  useEffect(() => {
    const storedCount = localStorage.getItem("auditCount");
    if (storedCount) setAuditCount(parseInt(storedCount, 10));
    
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);
 
  useEffect(() => {
    localStorage.setItem("auditCount", auditCount.toString());
  }, [auditCount]);

  const startProgressAnimation = () => {
    setProgress(0);
    setLoadingStep("Running Lighthouse tests...");
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + Math.random() * 7 : prev));
      if (progress > 30) setLoadingStep("Analyzing SEO and content...");
      if (progress > 60) setLoadingStep("Checking accessibility and performance...");
      if (progress > 85) setLoadingStep("Generating recommendations...");
    }, 700);
  };
 
  const stopProgressAnimation = (complete = false) => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgress(complete ? 100 : 0);
    if (complete) setLoadingStep("Audit complete!");
  };
 
  const handleAudit = async () => {
    if (!url) {
      alert("⚠️ Please enter a website URL");
      return;
    }
    
    // Validate URL format
    try {
      new URL(url);
    } catch {
      alert("⚠️ Please enter a valid website URL");
      return;
    }
    
    if (!isLoggedIn && auditCount >= 3) {
      alert("🚀 Free audits used up! Please sign in to continue.");
      router.push("/login");
      return;
    }
 
    setLoading(true);
    // Create new AbortController for this audit
    abortControllerRef.current = new AbortController();
    startProgressAnimation();
 
    const token = localStorage.getItem("token");
    let userId: string | null = null;
 
    // 🔑 Decode token if available
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        userId = decoded.user.id;
      } catch (err) {
        console.error("❌ Invalid token:", err);
      }
    }
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
 
    try {
      // ✅ Run local audit with abort signal
      const auditResults = await runAudit(
        url, 
        userId || "", 
        token || undefined,
        abortControllerRef.current.signal
      );
 
      // Check if audit was aborted
      if (abortControllerRef.current.signal.aborted) {
        return;
      }
 
      // ✅ Decide endpoint: logged-in → save, guest → per-IP guest audits
      const endpoint = token
        ? `${API_URL}/api/create-audits`
        : `${API_URL}/api/guest-audits`;
 
      // ✅ Save audit (or guest audit check)
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ url, ...auditResults }),
        credentials: "include",
        signal: abortControllerRef.current.signal,
      });
 
      if (response.status === 403) {
        alert("🚀 Free audits used up for today! Please login.");
        router.push("/login");
        return;
      }
 
      const data = await response.json();
      setReport(data.audit || data);
      setAuditCount((prev) => prev + 1);
      stopProgressAnimation(true);
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Audit aborted by user.");
      } else {
        console.error("⚠️ Audit failed:", err);
        alert("Something went wrong while running the audit");
      }
      stopProgressAnimation();
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };
 
  const handleStopAudit = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log("Audit stopping...");
    }
    setLoading(false);
    stopProgressAnimation();
  };
 
  return (
    <div className="min-h-screen pt-15 bg-gradient-to-br from-gray-50 to-teal-50">
      <HeaderSection 
        url={url} 
        setUrl={setUrl} 
        loading={loading} 
        handleAudit={handleAudit} 
        handleStopAudit={handleStopAudit} 
        isLoggedIn={isLoggedIn} 
        auditCount={auditCount}
        progress={progress}
        loadingStep={loadingStep}
      />
      {/* 🔹 Sample Report Section */}
{!report && !loading &&  (
  <div className="container mx-auto py-8 sm:py-12 px-4 sm:px-6">
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 sm:mb-8">
      <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-400 to-gray-600 text-white">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
          Sample Audit Report
        </h2>
        <p className="mt-1 sm:mt-2 opacity-80 text-sm sm:text-base">
          This is a preview of how the audit report will appear for {url}.
        </p>
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <ScoreCard label="SEO" score={82} />
          <ScoreCard label="Performance" score={74} />
          <ScoreCard label="Accessibility" score={65} />
          <ScoreCard label="Best Practices" score={90} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <ScoresRadar scores={{ seo: 82, performance: 74, accessibility: 65, bestPractices: 90 }} />
          <ScoreTrends history={[
            { date: '2025-09-01', seo: 75, performance: 70, accessibility: 60, bestPractices: 85 },
            { date: '2025-09-15', seo: 82, performance: 74, accessibility: 65, bestPractices: 90 },
          ]} />
        </div>
      </div>
    </div>
  </div>
)}

      {/* 🔹 Report Section */}
      {report && (
        <div className="container mx-auto py-8 sm:py-12 px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 sm:mb-8">
            <div className="p-4 sm:p-6 bg-gradient-to-r from-teal-600 to-teal-800 text-white">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                Audit Report for: {url}
              </h2>
              <p className="mt-1 sm:mt-2 opacity-90 text-sm sm:text-base">
                Generated on {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
 
            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {['overview', 'analysis', 'recommendations'].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 sm:px-6 py-3 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab 
                      ? 'text-teal-600 border-b-2 border-teal-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
 
            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {activeTab === 'overview' && (
                <>
                  {/* SCORE OVERVIEW */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <ScoreCard label="SEO" score={report.seo ?? 0} />
                    <ScoreCard label="Performance" score={report.performance ?? 0} />
                    <ScoreCard label="Accessibility" score={report.accessibility ?? 0} />
                    <ScoreCard label="Best Practices" score={report.bestPractices ?? 0} />
                  </div>
                  
                  {/* Performance Metrics */}
                  {(report.loadingTime || report.pageSize || report.requests) && (
                    <PerformanceMetrics report={report} />
                  )}
                  
                  {/* Dynamic Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    
                    {/* Radar Chart Comparison - FIXED */}
                      <ScoresRadar scores={{
                        seo: report.seo ?? 0,
                        performance: report.performance ?? 0,
                        accessibility: report.accessibility ?? 0,
                        bestPractices: report.bestPractices ?? 0
                      }} />

                      {/* Historical Trends - FIXED */}
                      <ScoreTrends history={report.history || []} />
                  </div>
                  
                  {/* Quick Actions */}
              <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
                <PDFGenerator report={report} url={url} />
                {/* <button className="px-4 sm:px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 text-sm sm:text-base">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Share Report
                </button> */}
              </div>
              </>
             )}
              {activeTab === 'analysis' && (
                <DetailedAnalysis text={report.analysis} url={url} />
              )}
 
              {activeTab === 'recommendations' && (
                <Recommendations list={report.recommendations} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}