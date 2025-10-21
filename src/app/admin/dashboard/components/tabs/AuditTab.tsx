"use client";
import { useState } from "react";
import { DashboardData } from "../../types";
import AuditTable from "../AuditTable";

interface AuditTabProps {
  data: DashboardData;
}

export default function AuditTab({ data }: AuditTabProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Safe handling to prevent undefined errors
  const safeData = data || {};
  const safeAuditData = safeData.auditData || [];
  const safeUsers = safeData.users || [];

  const filteredAuditLogs = safeAuditData.filter(log => {
    const url = log.url || '';
    const action = log.action || '';
    
    const searchLower = searchTerm.toLowerCase();
    
    return (
      url.toLowerCase().includes(searchLower) ||
      action.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search audit logs by URL or action..."
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

      <AuditTable 
        auditLogs={filteredAuditLogs} 
        totalLogs={safeAuditData.length}
        users={safeUsers}
      />
    </div>
  );
}