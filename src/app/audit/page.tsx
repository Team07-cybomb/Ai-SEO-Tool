"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { ScoreCard, DetailedAnalysis, Recommendations } from "./frontend";
import PDFGenerator from "./pdf";
import { runAudit } from "./backend";
import { showSuccessAlert, showErrorAlert, showWarningAlert } from "@/components/Utils/alert-util";

interface DecodedToken {
  user: {
    id: string;
    role?: string;
  };
}

export default function AuditPage() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAudit = async () => {
    setLoading(true);

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


    // Reset count if it's a new day
    if (lastAuditDate !== today) {
      currentCount = 0;
    }

    setAuditCount(currentCount);
    return currentCount;
  };

  const updateAuditCount = (count: number) => {
    const today = new Date().toLocaleDateString();

    localStorage.setItem("lastAuditDate", today);
    sessionStorage.setItem("lastAuditDate", today);

    const dataToStore = btoa(
      JSON.stringify({
        count,
        date: today,
        salt: Math.random().toString(36).substring(2),
      })
    );

    localStorage.setItem("auditData", dataToStore);
    sessionStorage.setItem("auditData", dataToStore);

    setAuditCount(count);
  };

  const handleAudit = async () => {
    // Check audit count before proceeding
    const currentCount = checkAuditCount();

    // Check if the user has reached the audit limit (3 free audits)
    if (currentCount >= 3 && !isLoggedIn) {
      alert("🚀 Free audits used up! Please sign in to continue.");
      router.push("/login");
      return;
    }

    if (!url || !isValidUrl(url)) {
      alert("⚠️ Please enter a valid website URL");
      return;
    }

    setLoading(true);
    setShowSampleReport(false);
    setAuditDone(false);
    startProgressAnimation();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("https://n8n.cybomb.com/webhook/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        
        body: JSON.stringify({
          url,
          auditCount: currentCount,
          userId: getUserId(),
        }),
        signal: controller.signal,
      });

      // ✅ Decide endpoint: logged-in → save, guest → per-IP guest audits
      const endpoint = token
        ? `${API_URL}/api/create-audits`
        : `${API_URL}/api/guest-audits`;


      // Increment audit count using the secure update function
      const updatedCount = currentCount + 1;
      updateAuditCount(updatedCount);

      // Save audit result to DB
      await fetch("http://localhost:5000/api/create-audits", {
        method: "POST",
        headers: { 
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}` // ✅ send token
  },
        body: JSON.stringify(data),

      });

      if (response.status === 403) {
        showWarningAlert("🚀 Free audits used up for today! Please login.");
        router.push("/login");
        return;
      }

      const data = await response.json();
      setReport(data.audit || data);
    } catch (err) {
      console.error("⚠️ Audit failed:", err);
      showErrorAlert("Something went wrong while running the audit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-15 bg-gray-50">
      {/* 🔹 Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-teal-900 to-gray-900 text-white py-16 text-center px-4">
        <h1 className="text-4xl font-extrabold">Analyze Your Website Performance</h1>
        <p className="mt-2 text-gray-300">
          SEO, Performance, Accessibility, Best Practices
        </p>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-2 max-w-xl mx-auto w-full">
          <input
            type="url"
            placeholder="https://example.com"
            className="flex-1 w-full px-4 py-3 rounded-lg text-black bg-white focus:ring-2 focus:ring-teal-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleAudit}
            disabled={loading || !url}
            className="px-6 py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-md disabled:opacity-50"
          >
            {loading ? "Running..." : "Start Audit"}
          </button>
        </div>
      </div>

      {/* 🔹 Report Section */}
      {report && (
        <div className="container mx-auto py-12 px-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Audit Report for: {url}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <ScoreCard label="SEO" score={report.seo ?? 0} />
            <ScoreCard label="Performance" score={report.performance ?? 0} />
            <ScoreCard label="Accessibility" score={report.accessibility ?? 0} />
            <ScoreCard label="Best Practices" score={report.bestPractices ?? 0} />
          </div>

          <DetailedAnalysis text={report.analysis} />
          <Recommendations list={report.recommendations} />

          <div className="mt-12 flex justify-center">
            <PDFGenerator report={report} url={url} />
          </div>
        </div>
      )}
    </div>
  );
}
