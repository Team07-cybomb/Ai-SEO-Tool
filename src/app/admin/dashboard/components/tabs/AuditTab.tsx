"use client";
import { useState, useMemo } from "react";
import { DashboardData, ToolData, AuditLog } from "../../types";
import AuditTable from "../AuditTable";

interface AuditTabProps {
  data: DashboardData;
}

export default function AuditTab({ data }: AuditTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");

  // Safe handling to prevent undefined errors
  const safeData = data || {};
  const safeAuditData = safeData.auditData || [];
  const safeBusinessNameData = safeData.businessNameData || [];
  const safeKeycheckData = safeData.keycheckData || [];
  const safeKeyScrapeData = safeData.keyScrapeData || [];
  const safeKeywordData = safeData.keywordData || [];
  const safeAllToolData = safeData.allToolData || [];
  const safeUsers = safeData.users || [];

  // Combine all data for unified view
  const allActivityData = useMemo(() => {
    return safeAllToolData.length > 0 ? safeAllToolData : [
      ...safeAuditData,
      ...safeBusinessNameData,
      ...safeKeycheckData,
      ...safeKeyScrapeData,
      ...safeKeywordData
    ];
  }, [safeAllToolData, safeAuditData, safeBusinessNameData, safeKeycheckData, safeKeyScrapeData, safeKeywordData]);

  // Action filter options
  const actionOptions = [
    { value: "all", label: "All Actions" },
    { value: "seo_audit", label: "SEO Audit" },
    { value: "name_generation", label: "Name Generation" },
    { value: "keyword_analysis", label: "Keyword Analysis" },
    { value: "keyword_scraping", label: "Keyword Scraping" },
    { value: "keyword_generation", label: "Keyword Generation" },
  ];

  const filteredAuditLogs = useMemo(() => {
    return allActivityData.filter(log => {
      const url = ('url' in log && log.url) || 
                 ('mainUrl' in log && log.mainUrl) || 
                 ('path' in log && log.path) || 
                 ('endpoint' in log && log.endpoint) || 
                 '';
      const action = ('action' in log && log.action) || 
                    ('type' in log && log.type) || 
                    ('event' in log && log.event) || 
                    '';
      
      const searchLower = searchTerm.toLowerCase();
      
      // Check if matches search term
      const matchesSearch = searchTerm === '' || 
        url.toLowerCase().includes(searchLower) ||
        action.toLowerCase().includes(searchLower) ||
        ('industry' in log && log.industry && log.industry.toLowerCase().includes(searchLower)) ||
        ('topic' in log && log.topic && log.topic.toLowerCase().includes(searchLower)) ||
        ('domain' in log && log.domain && log.domain.toLowerCase().includes(searchLower));
      
      // Check if matches selected action filter
      const matchesAction = selectedAction === "all" || action === selectedAction;
      
      return matchesSearch && matchesAction;
    });
  }, [allActivityData, searchTerm, selectedAction]);

  // Get activity statistics by tool
  const toolStats = useMemo(() => {
    const stats: { [key: string]: number } = {};
    allActivityData.forEach(log => {
      const tool = ('tool' in log && log.tool) || 'seo_audit';
      stats[tool] = (stats[tool] || 0) + 1;
    });
    return stats;
  }, [allActivityData]);

  return (
    <div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-800">
            {toolStats['seo_audit'] || 0}
          </div>
          <div className="text-sm text-gray-500 truncate">
            SEO Audit
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-800">
            {toolStats['business_name_generator'] || 0}
          </div>
          <div className="text-sm text-gray-500 truncate">
            Business Name Generator
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-800">
            {toolStats['keyword_checker'] || 0}
          </div>
          <div className="text-sm text-gray-500 truncate">
            Keyword Checker
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-800">
            {toolStats['keyword_scraper'] || 0}
          </div>
          <div className="text-sm text-gray-500 truncate">
            Keyword Scraper
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-800">
            {toolStats['keyword_generator'] || 0}
          </div>
          <div className="text-sm text-gray-500 truncate">
            Keyword Generator
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search activities by URL, action, industry, topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {actionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Filter status indicator */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          {selectedAction !== "all" && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Action: {actionOptions.find(opt => opt.value === selectedAction)?.label}
              <button
                onClick={() => setSelectedAction("all")}
                className="ml-1 text-green-600 hover:text-green-800 focus:outline-none"
              >
                ×
              </button>
            </span>
          )}
          {searchTerm && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Search: "{searchTerm}"
              <button
                onClick={() => setSearchTerm("")}
                className="ml-1 text-purple-600 hover:text-purple-800 focus:outline-none"
              >
                ×
              </button>
            </span>
          )}
          <span className="text-gray-500">
            Showing {filteredAuditLogs.length} of {allActivityData.length} activities
          </span>
        </div>
      </div>

      <AuditTable 
        auditLogs={filteredAuditLogs} 
        totalLogs={allActivityData.length}
        users={safeUsers}
        showToolColumn={true}
      />
    </div>
  );
}