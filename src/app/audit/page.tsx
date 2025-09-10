"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";

export default function AuditPage() {
  const [url, setUrl] = useState("");
  const [auditCount, setAuditCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // mock login state
  const [loading, setLoading] = useState(false);

  type ReportType = {
    seo: number;
    performance: number;
    accessibility: number;
    bestPractices: number;
    backlinks: number;
    recommendations: { text: string; priority: string }[];
  };

  const [report, setReport] = useState<ReportType | null>(null);
  const [showSampleReport, setShowSampleReport] = useState(true);

  // Load count from localStorage
  useEffect(() => {
    const storedCount = localStorage.getItem("auditCount");
    if (storedCount) setAuditCount(parseInt(storedCount, 10));
  }, []);

  useEffect(() => {
    localStorage.setItem("auditCount", auditCount.toString());
  }, [auditCount]);

  // // Load last saved report
  // useEffect(() => {
  //   const saved = localStorage.getItem("lastReport");
  //   if (saved) {
  //     const { url: savedUrl, report: savedReport } = JSON.parse(saved);
  //     setUrl(savedUrl);
  //     setReport(savedReport);
  //     setShowSampleReport(false);
  //   }
  // }, []);

  const isValidUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleAudit = async () => {
    if (!url || !isValidUrl(url)) {
      alert("⚠️ Please enter a valid URL (https://example.com)");
      return;
    }

    if (!isLoggedIn && auditCount >= 3) {
      alert("🚀 Free audits used up! Please sign in to continue.");
      return;
    }

    setLoading(true);
    setShowSampleReport(false);

    try {
      const response = await fetch("https://n8n.cybomb.com/webhook/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch audit report");
      }

      const data = await response.json();

      setReport({
        seo: data.seo,
        performance: data.performance,
        accessibility: data.accessibility,
        bestPractices: data.bestPractices,
        backlinks: data.backlinks,
        recommendations: data.recommendations,
      });

      setAuditCount((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      alert("❌ Error analyzing the website. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!report) return;
    const doc = new jsPDF();
    doc.text(`Audit Report for ${url}`, 10, 10);
    doc.text(`SEO Score: ${report.seo}/100`, 10, 30);
    doc.text(`Performance: ${report.performance}/100`, 10, 40);
    doc.text(`Accessibility: ${report.accessibility}/100`, 10, 50);
    doc.text(`Best Practices: ${report.bestPractices}/100`, 10, 60);
    doc.text(`Backlinks: ${report.backlinks}`, 10, 70);

    doc.text("Recommendations:", 10, 90);
    report.recommendations.forEach((rec, i) => {
      doc.text(`${i + 1}. ${rec.text} (${rec.priority})`, 10, 100 + i * 10);
    });

    doc.save("audit-report.pdf");
  };

  const handleSaveReport = () => {
    if (!report) return;
    localStorage.setItem("lastReport", JSON.stringify({ url, report }));
    alert("✅ Report saved locally!");
  };

  const renderScoreCard = (label: string, score: number) => (
    <div className="bg-white shadow rounded-xl p-6 text-center">
      <h3 className="font-semibold text-gray-700">{label}</h3>
      <p className="text-2xl font-bold text-teal-600 mt-2">{score}/100</p>
      <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
        <div
          className="bg-teal-600 h-3 rounded-full"
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );

  // Example Report (for display before user runs audit)
  const sampleReport: ReportType = {
    seo: 78,
    performance: 65,
    accessibility: 88,
    bestPractices: 72,
    backlinks: 45,
    recommendations: [
      { text: "Optimize images for faster load times", priority: "High" },
      { text: "Add missing meta descriptions", priority: "Medium" },
      { text: "Improve mobile responsiveness", priority: "Low" },
    ],
  };

  return (
    <div className="min-h-screen pt-15 w-full bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-teal-900 to-gray-900 text-white py-16 text-center px-4">
        <h1 className="text-4xl font-extrabold">
          Analyze Your Website Performance
        </h1>
        <p className="mt-2 text-gray-300">
          Get SEO, Performance, Accessibility, and Backlink insights instantly
        </p>

        {/* Input + Button */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-2 max-w-xl mx-auto w-full">
          <input
            type="url"
            placeholder="https://example.com"
            className="flex-1 w-full px-4 py-3 rounded-lg text-black bg-white focus:outline-none shadow-sm"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleAudit}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-teal-600 hover:bg-teal-700 transition text-white font-semibold shadow-md"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              "Start Audit"
            )}
          </button>
        </div>

        <p className="mt-3 text-sm text-gray-300">
          {isLoggedIn
            ? "Unlimited audits available"
            : `Free audits left: ${Math.max(0, 3 - auditCount)}`}
        </p>
      </div>

      {/* Report Section */}
      <div className="container mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {showSampleReport ? (
            "Sample Audit Report"
          ) : (
            <>
              Audit Report for: <span className="text-teal-600">{url}</span>
            </>
          )}
        </h2>

        {/* Score Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showSampleReport
            ? [
                { label: "SEO Score", score: sampleReport.seo },
                { label: "Performance", score: sampleReport.performance },
                { label: "Accessibility", score: sampleReport.accessibility },
                { label: "Best Practices", score: sampleReport.bestPractices },
              ].map((item, idx) => renderScoreCard(item.label, item.score))
            : report && [
                { label: "SEO Score", score: report.seo },
                { label: "Performance", score: report.performance },
                { label: "Accessibility", score: report.accessibility },
                { label: "Best Practices", score: report.bestPractices },
              ].map((item, idx) => renderScoreCard(item.label, item.score))}
          
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <h3 className="font-semibold text-gray-700">Backlinks</h3>
            <p className="text-2xl font-bold text-teal-600 mt-2">
              {showSampleReport ? sampleReport.backlinks : report?.backlinks}
            </p>
            <p className="text-sm text-gray-500">Referring domains</p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Recommendations
          </h3>
          <ul className="space-y-3">
            {(showSampleReport ? sampleReport : report)?.recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-center justify-between bg-white shadow rounded-lg px-4 py-3"
              >
                <span className="text-gray-700">{rec.text}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    rec.priority === "High"
                      ? "bg-red-100 text-red-700"
                      : rec.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {rec.priority}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        {!showSampleReport && report && (
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleDownloadPDF}
              className="px-6 py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-md"
            >
              Download PDF
            </button>
            <button
              onClick={handleSaveReport}
              className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold shadow-md"
            >
              Save Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}