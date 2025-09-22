"use client";
 
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { ScoreCard, DetailedAnalysis, Recommendations, HeaderSection, PerformanceMetrics } from "./frontend";
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
  history?: { date: string; seo: number; performance: number; accessibility: number; bestPractices: number }[];
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
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
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
      // ✅ Run local audit
      const auditResults = await runAudit(url, userId || "", token || undefined);
 
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
    }
  };
 
  const handleStopAudit = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      stopProgressAnimation();
    }
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
 
      {/* 🔹 Report Section */}
      {report && (
        <div className="container mx-auto py-12 px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="p-6 bg-gradient-to-r from-teal-600 to-teal-800 text-white">
              <h2 className="text-2xl md:text-3xl font-bold">
                Audit Report for: {url}
              </h2>
              <p className="mt-2 opacity-90">
                Generated on {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
 
            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              <button
                className={`px-6 py-3 font-medium text-sm ${activeTab === 'overview' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`px-6 py-3 font-medium text-sm ${activeTab === 'analysis' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('analysis')}
              >
                Detailed Analysis
              </button>
              <button
                className={`px-6 py-3 font-medium text-sm ${activeTab === 'recommendations' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('recommendations')}
              >
                Recommendations
              </button>
            </div>
 
            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <>
                  {/* SCORE OVERVIEW */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <ScoreCard label="SEO" score={report.seo ?? 0} />
                    <ScoreCard label="Performance" score={report.performance ?? 0} />
                    <ScoreCard label="Accessibility" score={report.accessibility ?? 0} />
                    <ScoreCard label="Best Practices" score={report.bestPractices ?? 0} />
                  </div>
                  
                  {/* Performance Metrics */}
                  {(report.loadingTime || report.pageSize || report.requests) && (
                    <PerformanceMetrics report={report} />
                  )}
                </>
              )}
 
              {activeTab === 'analysis' && (
                <DetailedAnalysis text={report.analysis} url={url} />
              )}
 
              {activeTab === 'recommendations' && (
                <Recommendations list={report.recommendations} />
              )}
            </div>
 
            {/* Download Button */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <PDFGenerator report={report} url={url} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}