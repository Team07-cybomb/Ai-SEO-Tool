"use client";

import { getGuestId } from "../../utils/guest";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ScoreCard, DetailedAnalysis, Recommendations } from "./frontend";
import PDFGenerator from "./pdf";
import { runAudit } from "./backend";

export default function AuditPage() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();


const handleAudit = async () => {
  const guestId = getGuestId();
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:5000/api/guest-audits", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ url, guestId }),
    credentials: "include",
  });

  if (response.status === 403) {
    alert("🚀 Free audits used up! Please login.");
    router.push("/login");
    return;
  }

  const data = await response.json();
  setReport(data.audit || data);
};


  return (
    <div className="min-h-screen pt-15 bg-gray-50">
      <div className="bg-gradient-to-r from-gray-900 via-teal-900 to-gray-900 text-white py-16 text-center px-4">
        <h1 className="text-4xl font-extrabold">Analyze Your Website Performance</h1>
        <p className="mt-2 text-gray-300">SEO, Performance, Accessibility, Best Practices</p>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-2 max-w-xl mx-auto w-full">
          <input type="url" placeholder="https://example.com"
            className="flex-1 w-full px-4 py-3 rounded-lg text-black bg-white focus:ring-2 focus:ring-teal-500"
            value={url} onChange={(e) => setUrl(e.target.value)} />
          <button onClick={handleAudit}
            className="px-6 py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-md">
            {loading ? "Running..." : "Start Audit"}
          </button>
        </div>
      </div>

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
