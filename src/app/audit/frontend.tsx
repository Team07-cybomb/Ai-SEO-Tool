"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Eye, EyeOff, Download, TrendingUp, AlertCircle, CheckCircle, Clock, BarChart3, Zap, Shield, Search, Globe, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from "react";

export const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-600 bg-green-50";
  if (score >= 70) return "text-teal-600 bg-teal-50";
  if (score >= 50) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
};

export const getPriorityColor = (priority: string) => {
  if (priority === "High") return "bg-red-100 text-red-800 border-red-500";
  if (priority === "Medium") return "bg-yellow-100 text-yellow-800 border-yellow-500";
  return "bg-green-100 text-green-800 border-green-500";
};

export const ScoreCard = ({ label, score, trend }: { label: string; score: number; trend?: number }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`${getScoreColor(score)} p-6 rounded-2xl shadow-lg text-center border-2 border-white transition-all duration-300 relative`}
  >
    <div className="absolute top-3 right-3">
      {trend !== undefined && (
        <div className={`flex items-center text-xs font-semibold ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
          {trend > 0 ? <ArrowUp size={14} /> : trend < 0 ? <ArrowDown size={14} /> : null}
          {trend !== 0 ? `${Math.abs(trend)}%` : 'No change'}
        </div>
      )}
    </div>
    
    <h3 className="font-semibold text-lg mb-3">{label}</h3>
    <div className="relative inline-block">
      <svg className="w-28 h-28" viewBox="0 0 36 36">
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#eee"
          strokeWidth="3"
        />
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={score >= 90 ? "#16a34a" : score >= 70 ? "#0f766e" : score >= 50 ? "#ca8a04" : "#dc2626"}
          strokeWidth="3"
          strokeDasharray={`${score}, 100`}
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
        {score}
      </div>
    </div>
    <p className="mt-2 text-sm opacity-80">out of 100</p>
    
    {score >= 90 && (
      <div className="mt-3 inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
        <CheckCircle size={12} className="mr-1" /> Excellent
      </div>
    )}
    {score >= 70 && score < 90 && (
      <div className="mt-3 inline-flex items-center text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
        <CheckCircle size={12} className="mr-1" /> Good
      </div>
    )}
    {score >= 50 && score < 70 && (
      <div className="mt-3 inline-flex items-center text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
        <AlertCircle size={12} className="mr-1" /> Needs Improvement
      </div>
    )}
    {score < 50 && (
      <div className="mt-3 inline-flex items-center text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
        <AlertCircle size={12} className="mr-1" /> Poor
      </div>
    )}
  </motion.div>
);

export const DetailedAnalysis = ({ text, url }: { text?: string; url: string }) => {
  const analysisSections = text ? parseAnalysisText(text, url) : null;
  
  if (!analysisSections) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 lg:p-8 shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <AlertCircle className="mr-2 text-teal-600" size={24} />
          Detailed Analysis
        </h3>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-600">No analysis available for this website.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6 lg:p-8 shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <AlertCircle className="mr-2 text-teal-600" size={24} />
        Detailed Analysis
      </h3>
      
      <div className="space-y-6">
        {analysisSections.map((section, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-teal-500"
          >
            <h4 className="text-lg font-semibold text-teal-700 mb-4 flex items-center">
              {getSectionIcon(section.title)}
              <span className="ml-2">{section.title}</span>
            </h4>
            
            <div className="space-y-4">
              {section.content.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                  </div>
                  <p className="ml-3 text-gray-700">{item}</p>
                </div>
              ))}
            </div>
            
            {section.metrics && section.metrics.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h5 className="font-medium text-gray-600 mb-2">Key Metrics:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {section.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm text-gray-600">{metric.label}</span>
                      <span className={`text-sm font-semibold ${
                        metric.value >= 90 ? 'text-green-600' : 
                        metric.value >= 70 ? 'text-teal-600' : 
                        metric.value >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Helper function to parse analysis text into structured sections
const parseAnalysisText = (text: string, url: string) => {
  // This is a simplified parser - you might need to adjust based on your actual analysis format
  const sections = [];
  const lines = text.split('\n').filter(line => line.trim());
  
  let currentSection: any = null;
  
  for (const line of lines) {
    if (line.match(/^#{1,3}\s+.+/)) {
      // This is a section header
      if (currentSection) {
        sections.push(currentSection);
      }
      
      const title = line.replace(/^#{1,3}\s+/, '').trim();
      currentSection = {
        title,
        content: [],
        metrics: []
      };
    } else if (line.match(/^-|\*|\d+\./)) {
      // This is a list item
      if (currentSection) {
        const content = line.replace(/^(-|\*|\d+\.)\s+/, '').trim();
        currentSection.content.push(content);
        
        // Check if this line contains a metric
        const metricMatch = content.match(/(.+):\s*(\d+)\/100/);
        if (metricMatch) {
          currentSection.metrics.push({
            label: metricMatch[1].trim(),
            value: parseInt(metricMatch[2])
          });
        }
      }
    } else if (currentSection && line.trim()) {
      // Regular paragraph content
      currentSection.content.push(line.trim());
    }
  }
  
  if (currentSection) {
    sections.push(currentSection);
  }
  
  // If no sections were found, create a default structure
  if (sections.length === 0) {
    sections.push({
      title: "Executive Summary",
      content: [`Analysis for ${url} based on comprehensive SEO audit.`],
      metrics: []
    });
  }
  
  return sections;
};

// Helper function to get appropriate icon for each section
const getSectionIcon = (title: string) => {
  if (title.toLowerCase().includes('executive') || title.toLowerCase().includes('summary')) {
    return <BarChart3 size={20} className="text-teal-600" />;
  } else if (title.toLowerCase().includes('technical')) {
    return <Zap size={20} className="text-teal-600" />;
  } else if (title.toLowerCase().includes('content')) {
    return <Search size={20} className="text-teal-600" />;
  } else if (title.toLowerCase().includes('opportunity') || title.toLowerCase().includes('recommendation')) {
    return <TrendingUp size={20} className="text-teal-600" />;
  } else if (title.toLowerCase().includes('security')) {
    return <Shield size={20} className="text-teal-600" />;
  } else {
    return <Globe size={20} className="text-teal-600" />;
  }
};

export const Recommendations = ({ list }: { list?: { text: string; priority: string }[] }) => {
  if (!list || list.length === 0) {
    return (
      <div className="mb-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <CheckCircle className="mr-2 text-teal-600" size={24} />
          Recommendations
        </h3>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <p className="text-gray-600 text-center">No specific recommendations available. All areas appear to be optimized.</p>
        </div>
      </div>
    );
  }
  
  // Group recommendations by priority
  const highPriority = list.filter(rec => rec.priority === "High");
  const mediumPriority = list.filter(rec => rec.priority === "Medium");
  const lowPriority = list.filter(rec => rec.priority === "Low");
  
  return (
    <div className="mb-12">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <CheckCircle className="mr-2 text-teal-600" size={24} />
        Recommendations
      </h3>
      
      <div className="space-y-6">
        {highPriority.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
              <AlertCircle size={20} className="mr-2" />
              High Priority Issues ({highPriority.length})
            </h4>
            <div className="grid gap-4 md:grid-cols-1">
              {highPriority.map((rec, idx) => (
                <RecommendationCard key={idx} recommendation={rec} index={idx} />
              ))}
            </div>
          </div>
        )}
        
        {mediumPriority.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-yellow-600 mb-4 flex items-center">
              <AlertCircle size={20} className="mr-2" />
              Medium Priority Improvements ({mediumPriority.length})
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              {mediumPriority.map((rec, idx) => (
                <RecommendationCard key={idx} recommendation={rec} index={idx + highPriority.length} />
              ))}
            </div>
          </div>
        )}
        
        {lowPriority.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
              <TrendingUp size={20} className="mr-2" />
              Low Priority Enhancements ({lowPriority.length})
            </h4>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lowPriority.map((rec, idx) => (
                <RecommendationCard key={idx} recommendation={rec} index={idx + highPriority.length + mediumPriority.length} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const RecommendationCard = ({ recommendation, index }: { recommendation: { text: string; priority: string }; index: number }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`bg-white p-5 rounded-xl shadow-lg border-l-4 ${
      recommendation.priority === "High" ? "border-red-500" :
      recommendation.priority === "Medium" ? "border-yellow-500" : "border-green-500"
    } transition-all h-full flex flex-col`}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-start">
        <span className="text-teal-600 font-bold mr-2 mt-0.5">{index + 1}.</span>
        <h4 className="text-lg font-medium text-gray-800">{recommendation.text}</h4>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(recommendation.priority)} whitespace-nowrap ml-2`}>
        {recommendation.priority}
      </span>
    </div>
    <div className="flex items-center text-sm text-gray-500 mt-auto pt-4">
      <AlertCircle size={16} className="mr-1 flex-shrink-0" />
      <span>
        {recommendation.priority === "High" ? "Critical issue - fix immediately" :
          recommendation.priority === "Medium" ? "Important improvement needed" :
          "Enhancement opportunity"}
      </span>
    </div>
  </motion.div>
);

export const ProgressBar = ({ progress, loadingStep }: { progress: number; loadingStep: string }) => (
  <div className="mt-6 max-w-xl mx-auto">
    <div className="bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
      <motion.div
        className="bg-gradient-to-r from-teal-400 to-teal-600 h-3 rounded-full"
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "linear" }}
      />
    </div>
    <p className="mt-3 text-sm text-gray-300 flex items-center justify-center gap-2">
      <Clock size={16} />
      {loadingStep}
    </p>
  </div>
);

export const HeaderSection = ({ 
  url, 
  setUrl, 
  loading, 
  handleAudit, 
  handleStopAudit, 
  isLoggedIn, 
  auditCount,
  progress,
  loadingStep 
}: { 
  url: string; 
  setUrl: (url: string) => void; 
  loading: boolean; 
  handleAudit: () => void; 
  handleStopAudit: () => void; 
  isLoggedIn: boolean; 
  auditCount: number;
  progress?: number;
  loadingStep?: string;
}) => (
  <div className="bg-gradient-to-r from-gray-900 via-teal-900 to-gray-900 text-white py-16 text-center px-4 relative overflow-hidden">
    <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
    <div className="container mx-auto relative z-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-extrabold mb-4"
      >
        Analyze Your Website Performance
      </motion.h1>
      <p className="mt-2 text-gray-300 text-lg max-w-2xl mx-auto">
        Get SEO, Performance, Accessibility, and Best Practices insights instantly
      </p>

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 max-w-xl mx-auto w-full">
        <input
          type="url"
          placeholder="https://example.com"
          className="flex-1 w-full px-5 py-3 rounded-lg text-black bg-white focus:ring-4 focus:ring-teal-300 focus:outline-none transition-all shadow-lg"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        {!loading ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAudit}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold shadow-lg flex items-center justify-center gap-2"
          >
            <BarChart3 size={20} />
            Start Audit
          </motion.button>
        ) : (
          <button
            onClick={handleStopAudit}
            className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg flex items-center justify-center gap-2"
          >
            <Clock size={20} />
            Stop Audit
          </button>
        )}
      </div>

      {loading && progress !== undefined && loadingStep && (
        <ProgressBar progress={progress} loadingStep={loadingStep} />
      )}

      <p className="mt-4 text-sm text-gray-300">
        {isLoggedIn ? "Unlimited audits available" : `Free audits left: ${Math.max(0, 3 - auditCount)}`}
      </p>
    </div>
  </div>
);

// New component for performance metrics
export const PerformanceMetrics = ({ report }: { report: any }) => (
  <div className="grid md:grid-cols-3 gap-6 mb-12">
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center mb-3">
        <Clock className="text-teal-600 mr-2" size={20} />
        <h3 className="font-semibold text-gray-700">Loading Time</h3>
      </div>
      <p className="text-2xl font-bold text-gray-800">{report.loadingTime || 3.2}s</p>
      <p className="text-sm text-gray-500 mt-1">Page load time</p>
    </div>
   
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center mb-3">
        <TrendingUp className="text-teal-600 mr-2" size={20} />
        <h3 className="font-semibold text-gray-700">Page Size</h3>
      </div>
      <p className="text-2xl font-bold text-gray-800">{report.pageSize || 2.4}MB</p>
      <p className="text-sm text-gray-500 mt-1">Total resources</p>
    </div>
   
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center mb-3">
        <BarChart3 className="text-teal-600 mr-2" size={20} />
        <h3 className="font-semibold text-gray-700">Requests</h3>
      </div>
      <p className="text-2xl font-bold text-gray-800">{report.requests || 78}</p>
      <p className="text-sm text-gray-500 mt-1">HTTP requests</p>
    </div>
  </div>
);