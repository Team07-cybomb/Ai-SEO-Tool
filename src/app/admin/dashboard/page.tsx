// src/app/admin/dashboard/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Static data instead of API response
  const [data] = useState({
    totalLogins: 12,
    uniqueUsers: 5,
    auditData: [
      { _id: "1", userEmail: "user1@example.com", url: "https://mysite.com/audit1", timestamp: "2025-09-14T10:30:00Z" },
      { _id: "2", userEmail: "user2@example.com", url: "https://mysite.com/audit2", timestamp: "2025-09-14T11:00:00Z" },
      { _id: "3", userEmail: "user3@example.com", url: "https://mysite.com/audit3", timestamp: "2025-09-14T11:15:00Z" },
      { _id: "4", userEmail: "user1@example.com", url: "https://mysite.com/audit4", timestamp: "2025-09-14T11:30:00Z" },
    ],
  });

  useEffect(() => {
    // Simulate authentication check
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setTimeout(() => setLoading(false), 500); // simulate delay
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 max-w-2xl mb-6">
        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-500">Total audit entries</p>
          <p className="text-2xl font-bold">{data.totalLogins}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-500">Unique users (by email)</p>
          <p className="text-2xl font-bold">{data.uniqueUsers}</p>
        </div>
      </div>

      {/* Audit Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">User Email</th>
              <th className="px-4 py-2 text-left">URL</th>
              <th className="px-4 py-2 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {data.auditData.length > 0 ? (
              data.auditData.map((item, idx) => (
                <tr key={item._id || idx} className="border-t">
                  <td className="px-4 py-2">{item.userEmail}</td>
                  <td className="px-4 py-2 break-words max-w-xs">{item.url}</td>
                  <td className="px-4 py-2">{new Date(item.timestamp).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                  No user data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
