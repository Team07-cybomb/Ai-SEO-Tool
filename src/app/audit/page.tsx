"use client";

import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LabelList,
} from "recharts";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
export default function AuditPage() {
  const [url, setUrl] = useState("");
  const [auditCount, setAuditCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState("Initializing audit...");
  const [auditDone, setAuditDone] = useState(false);
  const [showSampleReport, setShowSampleReport] = useState(true);
  const [showPopUp, setShowPopUp] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [chartSize, setChartSize] = useState(300);
  const [chartView, setChartView] = useState<"radar" | "polar">("radar");
  const [showDataLabels, setShowDataLabels] = useState(true);
  const router = useRouter();
  // Build radar data dynamically from report
  // const radarData = report
  //   ? [
  //       {
  //         metric: "SEO",
  //         value: report.seo ?? 0,
  //         industryAvg: 75, // You can fetch this dynamically later
  //         previous: report.history?.[report.history.length - 2]?.seo ?? undefined
  //       },
  //       {
  //         metric: "Performance",
  //         value: report.performance ?? 0,
  //         industryAvg: 65,
  //         previous: report.history?.[report.history.length - 2]?.performance ?? undefined
  //       },
  //       {
  //         metric: "Accessibility",
  //         value: report.accessibility ?? 0,
  //         industryAvg: 70,
  //         previous: report.history?.[report.history.length - 2]?.accessibility ?? undefined
  //       },
  //       {
  //         metric: "Best Practices",
  //         value: report.bestPractices ?? 0,
  //         industryAvg: 80,
  //         previous: report.history?.[report.history.length - 2]?.bestPractices ?? undefined
  //       },
  //     ]
  //   : [];

  // 1️⃣ Define ReportType first
  type ReportType = {
    seo?: number;
    performance?: number;
    accessibility?: number;
    bestPractices?: number;
    backlinks?: number;
    recommendations?: { text: string; priority: string }[];
    analysis?: string;
    history?: {
      date: string;
      seo: number;
      performance: number;
      accessibility: number;
      bestPractices: number;
    }[];
  };

  // 2️⃣ Define sample report
  const sampleReport: ReportType = {
    seo: 92,
    performance: 65,
    accessibility: 80,
    bestPractices: 88,
    recommendations: [
      {
        text: "Optimize images, enable caching, and reduce unused JS",
        priority: "High",
      },
      {
        text: "Improve color contrast and keyboard navigation",
        priority: "Medium",
      },
      { text: "Add missing alt text to images", priority: "Medium" },
    ],
    analysis: `# Sample SEO Audit Report

**Date:** September 12, 2025  
**Website:** https://www.sample.com  

---

## 1. Executive Summary
This is a **sample report** to show you what your final audit will look like.  
Your actual report will include detailed recommendations tailored to your website.
`,
  };

  // 3️⃣ Declare report state
  const [report, setReport] = useState<ReportType | null>(sampleReport);

  // 4️⃣ Now safely build radarData using report
  const radarData = report
    ? [
        {
          metric: "SEO",
          value: report.seo ?? 0,
          industryAvg: 75,
          previous: report.history?.[report.history.length - 2]?.seo,
        },
        {
          metric: "Performance",
          value: report.performance ?? 0,
          industryAvg: 65,
          previous: report.history?.[report.history.length - 2]?.performance,
        },
        {
          metric: "Accessibility",
          value: report.accessibility ?? 0,
          industryAvg: 70,
          previous: report.history?.[report.history.length - 2]?.accessibility,
        },
        {
          metric: "Best Practices",
          value: report.bestPractices ?? 0,
          industryAvg: 80,
          previous: report.history?.[report.history.length - 2]?.bestPractices,
        },
      ]
    : [];

  // Check availability of extra data
  const industryAverage = radarData.some(
    (item) => item.industryAvg !== undefined
  );
  const previousScores = radarData.some((item) => item.previous !== undefined);

  // NEW FUNCTION: Check and update audit count
  const checkAuditCount = () => {
    const today = new Date().toLocaleDateString();
    const lastAuditDate = localStorage.getItem("lastAuditDate");
    const storedCount = localStorage.getItem("auditCount");

    // Reset count if it's a new day
    if (lastAuditDate !== today) {
      localStorage.setItem("auditCount", "0");
      localStorage.setItem("lastAuditDate", today);
      setAuditCount(0);
      return 0;
    }

    // Get current count
    const currentCount = storedCount ? parseInt(storedCount, 10) : 0;
    setAuditCount(currentCount);
    return currentCount;
  };

  // Check audit count on component mount
  useEffect(() => {
    const count = checkAuditCount();

    // Redirect to login if user has used all free audits
    if (count >= 3 && !isLoggedIn) {
      router.push("/login");
    }
  }, []); // Run only on mount

  const isValidUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const startProgressAnimation = () => {
    setProgress(0);
    setLoadingStep("Running Lighthouse tests...");
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + Math.random() * 7 : prev));
      if (progress > 30) setLoadingStep("Analyzing SEO and content...");
      if (progress > 60)
        setLoadingStep("Checking accessibility and performance...");
      if (progress > 85) setLoadingStep("Generating recommendations...");
    }, 700);
  };

  const stopProgressAnimation = (complete = false) => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setProgress(complete ? 100 : 0);
    if (complete) setLoadingStep("Audit complete!");
  };

  const handleAudit = async () => {
    // Check audit count before proceeding
    const currentCount = checkAuditCount();

    // Check if the user has reached the audit limit (3 free audits)
    if (currentCount >= 3 && !isLoggedIn) {
      alert("🚀 Free audits used up! Please sign in to continue.");
      router.push("/login"); // Redirect to login if the user has reached the limit
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

try {
  const response = await fetch("https://n8n.cybomb.com/webhook/Audit-GPSI", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
    signal: controller.signal,
  });
 
  if (!response.ok) throw new Error("Failed to fetch audit report");
  const data = await response.json();
 
  // Save audit result to DB
  await fetch("http://localhost:5000/api/audits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
 
  setReport(data);
  setAuditCount((prev) => prev + 1);
  setAuditDone(true);
  stopProgressAnimation(true);
} catch (err: any) {
  console.error(err);
  alert("❌ Error analyzing the website.");
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

  const handleSignIn = () => {
    // Redirect user to login page
    router.push("/login");
  };

  /** ✅ Restored jsPDF logic ---------------------------------------------------------------------------**/
  const handleDownloadPDF = () => {
    if (!report) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    let yPosition = margin;

    // --- Cover Page ---
    pdf.setFillColor(15, 118, 110);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");

    // Optional logo placeholder (replace with real logo if available)
    pdf.setFillColor(255, 255, 255);
    pdf.circle(pageWidth / 2, 60, 20, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(28);
    pdf.text("SEO AUDIT REPORT", pageWidth / 2, 100, { align: "center" });

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "normal");
    pdf.text("Comprehensive Website Analysis", pageWidth / 2, 115, {
      align: "center",
    });

    pdf.setFontSize(14);
    pdf.text(`Website: ${url}`, pageWidth / 2, 140, { align: "center" });

    pdf.setFontSize(12);
    pdf.text(
      `Generated on: ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      pageWidth / 2,
      155,
      { align: "center" }
    );

    pdf.setFontSize(10);
    pdf.text("Generated by SEO Audit Pro", pageWidth / 2, pageHeight - 20, {
      align: "center",
    });

    pdf.addPage();

    // --- Table of Contents ---
    yPosition = margin;
    pdf.setFontSize(16);
    pdf.setTextColor(15, 118, 110);
    pdf.text("TABLE OF CONTENTS", margin, yPosition);
    yPosition += 8;
    pdf.setDrawColor(15, 118, 110);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    const contents = [
      { title: "Executive Summary", page: 3 },
      { title: "Score Overview", page: 3 },
      { title: "Detailed Analysis", page: 4 },
      { title: "Recommendations", page: 6 },
    ];

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    contents.forEach((item) => {
      pdf.text(item.title, margin, yPosition);
      pdf.text(`Page ${item.page}`, pageWidth - margin, yPosition, {
        align: "right",
      });
      yPosition += 8;
    });

    pdf.addPage();

    // --- Executive Summary ---
    yPosition = margin;
    pdf.setFontSize(16);
    pdf.setTextColor(15, 118, 110);
    pdf.text("EXECUTIVE SUMMARY", margin, yPosition);
    yPosition += 8;
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 12;

    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    const summaryText = `This report provides a comprehensive analysis of ${url} based on industry-standard metrics for SEO, performance, accessibility, and best practices. The following sections detail specific findings and actionable recommendations to improve your website's overall quality and search engine visibility.`;
    const summaryLines = pdf.splitTextToSize(summaryText, contentWidth);
    pdf.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 6 + 12;

    // --- Score Overview with Progress Bars ---
    pdf.setFontSize(16);
    pdf.setTextColor(15, 118, 110);
    pdf.text("SCORE OVERVIEW", margin, yPosition);
    yPosition += 8;
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 12;

    const scores = [
      { label: "SEO", score: report.seo ?? 0 },
      { label: "Performance", score: report.performance ?? 0 },
      { label: "Accessibility", score: report.accessibility ?? 0 },
      { label: "Best Practices", score: report.bestPractices ?? 0 },
    ];

    const barHeight = 6;
    const barWidth = contentWidth - 40;

    scores.forEach((item) => {
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${item.label}: ${item.score}/100`, margin, yPosition);

      yPosition += 4;
      pdf.setDrawColor(200, 200, 200);
      pdf.setFillColor(230, 230, 230);
      pdf.rect(margin, yPosition, barWidth, barHeight, "F");

      let fillColor: [number, number, number];
      if (item.score >= 90) fillColor = [22, 163, 74];
      else if (item.score >= 70) fillColor = [13, 148, 136];
      else if (item.score >= 50) fillColor = [202, 138, 4];
      else fillColor = [220, 38, 38];

      const filledWidth = (item.score / 100) * barWidth;
      pdf.setFillColor(...fillColor);
      pdf.rect(margin, yPosition, filledWidth, barHeight, "F");

      yPosition += barHeight + 10;
    });

    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      "Scores: 90-100 (Excellent), 70-89 (Good), 50-69 (Needs Improvement), 0-49 (Poor)",
      margin,
      yPosition
    );

    pdf.addPage();
    yPosition = margin;

    // --- Detailed Analysis ---
    pdf.setFontSize(16);
    pdf.setTextColor(15, 118, 110);
    pdf.text("DETAILED ANALYSIS", margin, yPosition);
    yPosition += 8;
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 12;

    const cleanAnalysis = report.analysis
      ? report.analysis
          .replace(/#{1,6}\s/g, "")
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\*(.*?)\*/g, "$1")
          .replace(/---/g, "")
          .replace(/\n\s*\n/g, "\n")
      : "No analysis available";

    const analysisLines = pdf.splitTextToSize(cleanAnalysis, contentWidth);
    analysisLines.forEach((line: string | string[]) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += 6;
    });

    // --- Recommendations ---
    if (report.recommendations?.length) {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(16);
      pdf.setTextColor(15, 118, 110);
      pdf.text("RECOMMENDATIONS", margin, yPosition);
      yPosition += 8;
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 12;

      report.recommendations.forEach((rec, index) => {
        if (yPosition > pageHeight - 25) {
          pdf.addPage();
          yPosition = margin;
        }

        let color: [number, number, number];
        if (rec.priority === "High") color = [220, 38, 38];
        else if (rec.priority === "Medium") color = [202, 138, 4];
        else color = [22, 163, 74];

        pdf.setFillColor(...color);
        pdf.rect(margin, yPosition, 4, 4, "F");

        pdf.setFont("helvetica", "bold");
        const recLines = pdf.splitTextToSize(
          `${index + 1}. ${rec.text}`,
          contentWidth - 10
        );
        pdf.setTextColor(0, 0, 0);
        pdf.text(recLines, margin + 8, yPosition + 4);
        yPosition += recLines.length * 6 + 2;

        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...color);
        pdf.text(`Priority: ${rec.priority}`, margin + 8, yPosition + 4);
        yPosition += 10;
      });
    }

    // --- Footer ---
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 10,
        { align: "right" }
      );

      if (i > 1) {
        pdf.setFontSize(8);
        pdf.setTextColor(200, 200, 200);
        pdf.text("CONFIDENTIAL", pageWidth / 2, pageHeight - 10, {
          align: "center",
        });
      }
    }

    pdf.save(
      `SEO-Audit-Report-${url.replace(/https?:\/\//, "").split("/")[0]}.pdf`
    );
  };
  // pdf section ends here--------------------------------------------------------------------------------------------

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-teal-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const renderScoreCard = (label: string, score: number) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white shadow-lg rounded-xl p-6 text-center border border-gray-100"
    >
      <h3 className="font-semibold text-gray-700 mb-2">{label}</h3>
      <p className={`text-2xl font-bold ${getScoreColor(score)}`}>
        {score}/100
      </p>
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-15 bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-gray-900 via-teal-900 to-gray-900 text-white py-16 text-center px-4">
        <h1 className="text-4xl font-extrabold">
          Analyze Your Website Performance
        </h1>
        <p className="mt-2 text-gray-300">
          Get SEO, Performance, Accessibility, and Best Practices insights
          instantly
        </p>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-2 max-w-xl mx-auto w-full">
          <input
            type="url"
            placeholder="https://example.com"
            className="flex-1 w-full px-4 py-3 rounded-lg text-black bg-white focus:ring-2 focus:ring-teal-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {!loading ? (
            <button
              onClick={handleAudit}
              className="px-6 py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-md"
            >
              Start Audit
            </button>
          ) : (
            <button
              onClick={handleStopAudit}
              className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md"
            >
              Stop Audit
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {loading && (
          <div className="mt-4 max-w-xl mx-auto">
            <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-teal-400 h-3"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "linear" }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-300">{loadingStep}</p>
          </div>
        )}

        <p className="mt-3 text-sm text-gray-300">
          {isLoggedIn
            ? "Unlimited audits available"
            : `Free audits left: ${Math.max(0, 3 - auditCount)}`}
        </p>
      </div>

      {/* REPORT SECTION */}
      {report && (
        <div className="container mx-auto py-12 px-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            {showSampleReport
              ? "Sample Audit Report"
              : `Audit Report for: ${url}`}
          </h2>

          {/* SCORE OVERVIEW */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {renderScoreCard("SEO", report.seo ?? 0)}
            {renderScoreCard("Performance", report.performance ?? 0)}
            {renderScoreCard("Accessibility", report.accessibility ?? 0)}
            {renderScoreCard("Best Practices", report.bestPractices ?? 0)}
          </div>

          {/* DYNAMIC RADAR CHART */}

          <div className="bg-white rounded-xl p-6 shadow-lg mb-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Performance Radar
            </h3>

            {/* Chart Controls */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center">
                <label className="mr-2 text-sm text-gray-600">
                  Chart Size:
                </label>
                <select
                  className="border rounded-md p-1 text-sm"
                  onChange={(e) => setChartSize(parseInt(e.target.value))}
                  value={chartSize}
                >
                  <option value={250}>Small</option>
                  <option value={300}>Medium</option>
                  <option value={350}>Large</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="mr-2 text-sm text-gray-600">View:</label>
                <select
                  className="border rounded-md p-1 text-sm"
                  onChange={(e) =>
                    setChartView(e.target.value as "radar" | "polar")
                  }
                  value={chartView}
                >
                  <option value="radar">Radar</option>
                  <option value="polar">Polar</option>
                </select>
              </div>

              <button
                className="text-sm text-teal-600 hover:text-teal-700 flex items-center"
                onClick={() => setShowDataLabels(!showDataLabels)}
              >
                {showDataLabels ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" />
                    Hide Values
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-1" />
                    Show Values
                  </>
                )}
              </button>
            </div>

            {/* Radar Chart */}

            <ResponsiveContainer width="100%" height={chartSize}>
              <RadarChart
                outerRadius={chartSize * 0.4}
                data={radarData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: "#4a5568", fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tickCount={6}
                  tick={{ fill: "#718096", fontSize: 10 }}
                />

                {/* Current Score */}
                <Radar
                  name="Current Score"
                  dataKey="value"
                  stroke="#0f766e"
                  fill="#0f766e"
                  fillOpacity={0.6}
                  strokeWidth={2}
                />

                {/* Industry Average (if available) */}
                {industryAverage && (
                  <Radar
                    name="Industry Average"
                    dataKey="industryAvg"
                    stroke="#9ca3af"
                    fill="#9ca3af"
                    fillOpacity={0.3}
                    strokeWidth={1}
                    strokeDasharray="5 5"
                  />
                )}

                {/* Previous Score (if available) */}
                {previousScores && (
                  <Radar
                    name="Previous Score"
                    dataKey="previous"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.2}
                    strokeWidth={1.5}
                  />
                )}

                {/* Data Labels */}
                {showDataLabels && (
                  <LabelList
                    dataKey="value"
                    position="top"
                    offset={10}
                    formatter={(value: number) => `${value}`}
                    style={{
                      fill: "#0f766e",
                      fontSize: 11,
                      fontWeight: "bold",
                    }}
                  />
                )}

                {/* Tooltip with detailed information */}
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-md border">
                          <p className="font-semibold text-gray-800">{label}</p>
                          <p className="text-sm mt-1">
                            <span className="text-teal-700 font-medium">
                              Score:{" "}
                            </span>
                            {payload[0].value}/100
                          </p>
                          {payload[1] && (
                            <p className="text-sm">
                              <span className="text-gray-500 font-medium">
                                Industry Avg:{" "}
                              </span>
                              {payload[1].value}/100
                            </p>
                          )}
                          {payload[2] && (
                            <p className="text-sm">
                              <span className="text-indigo-500 font-medium">
                                Previous:{" "}
                              </span>
                              {payload[2].value}/100
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Legend */}
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry) => (
                    <span className="text-xs text-gray-600">{value}</span>
                  )}
                />
              </RadarChart>
            </ResponsiveContainer>

            {/* Score Interpretation */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-teal-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-teal-600 mr-2"></div>
                  <span className="font-medium">Current Score</span>
                </div>
                <p className="text-gray-600">
                  Your website's current performance metrics
                </p>
              </div>

              {industryAverage && (
                <div className="p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                    <span className="font-medium">Industry Average</span>
                  </div>
                  <p className="text-gray-600">
                    Comparison with industry benchmarks
                  </p>
                </div>
              )}

              {previousScores && (
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                    <span className="font-medium">Previous Score</span>
                  </div>
                  <p className="text-gray-600">
                    Your website's performance from last audit
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* DETAILED ANALYSIS */}
          <div className="bg-gray-900 text-gray-100 rounded-xl p-6 lg:p-8 shadow-lg mb-12">
            <h3 className="text-xl font-semibold mb-4">Detailed Analysis</h3>
            <ReactMarkdown>
              {report.analysis ?? "No analysis available"}
            </ReactMarkdown>
          </div>

          {/* RECOMMENDATIONS */}
          {report.recommendations && (
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Recommendations
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {report.recommendations.map((rec, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-teal-500"
                  >
                    <h4 className="text-lg font-medium text-gray-800">
                      {rec.text}
                    </h4>
                    <p
                      className={`mt-1 text-sm font-semibold ${
                        rec.priority === "High"
                          ? "text-red-600"
                          : rec.priority === "Medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      Priority: {rec.priority}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {!showSampleReport && auditDone && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={handleDownloadPDF}
                className="px-6 py-3 rounded-lg mb-8 bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-md"
              >
                Download PDF Report
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}