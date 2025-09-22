"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Eye, Search, Filter, Plus, MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getScoreColor(score: number) {
  if (score >= 90) return "text-green-600 bg-green-50";
  if (score >= 70) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
}

function getScoreBadgeVariant(score: number) {
  if (score >= 90) return "default";
  if (score >= 70) return "secondary";
  return "destructive";
}

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [auditReports, setAuditReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch data from the same API as dashboard
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_URL}/api/audits`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch reports");

        const data = await res.json();
        const formattedData = (Array.isArray(data) ? data : data.audits || []).map((audit: any, idx: number) => ({
          id: audit.id || idx + 1,
          website: audit.url || "Unknown",
          url: audit.url || "N/A",
          date: audit.date || new Date().toLocaleDateString("en-GB"),
          time: audit.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          seoScore: audit.scores?.seo ?? 0,
          speedScore: audit.scores?.performance ?? 0,
          accessibilityScore: audit.scores?.accessibility ?? 0,
          bestPracticesScore: audit.scores?.bestPractices ?? 0,
          issues: audit.issues || 0,
          status: audit.status || "completed",
          trend: audit.trend || (audit.scores?.seo > 70 ? "up" : "down"),
        }));

        setAuditReports(formattedData);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = auditReports.filter((report) => {
    const matchesSearch =
      report.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">View and manage your SEO audit reports</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Audit
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Reports</p>
                <p className="text-xl sm:text-2xl font-bold">{auditReports.length}</p>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Avg SEO Score</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {auditReports.length > 0
                    ? Math.round(auditReports.reduce((sum, r) => sum + r.seoScore, 0) / auditReports.length)
                    : 0}
                </p>
              </div>
              <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Avg Speed Score</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {auditReports.length > 0
                    ? Math.round(auditReports.reduce((sum, r) => sum + r.speedScore, 0) / auditReports.length)
                    : 0}
                </p>
              </div>
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Issues</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {auditReports.reduce((sum, r) => sum + r.issues, 0)}
                </p>
              </div>
              <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters + Table with Static Grade Sheet */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Audit Reports</CardTitle>
            <CardDescription>Detailed view of all your website audits</CardDescription>
          </div>

          {/* Grade Sheet - Static */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="flex flex-col items-center border rounded-lg p-2 sm:p-4">
              <span className="text-lg font-bold text-green-600">Good</span>
              <p className="text-xs sm:text-sm text-muted-foreground">90 - 100</p>
            </div>
            <div className="flex flex-col items-center border rounded-lg p-2 sm:p-4">
              <span className="text-lg font-bold text-yellow-600">Avg</span>
              <p className="text-xs sm:text-sm text-muted-foreground">70 - 89</p>
            </div>
            <div className="flex flex-col items-center border rounded-lg p-2 sm:p-4">
              <span className="text-lg font-bold text-red-600">Bad</span>
              <p className="text-xs sm:text-sm text-muted-foreground">Below 70</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search + Filter */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search websites or URLs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reports Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Website</TableHead>
                  <TableHead className="min-w-[120px]">Date & Time</TableHead>
                  <TableHead className="text-center min-w-[100px]">SEO Score</TableHead>
                  <TableHead className="text-center min-w-[100px]">Speed Score</TableHead>
                  <TableHead className="text-center min-w-[120px] hidden sm:table-cell">Accessibility</TableHead>
                  <TableHead className="text-center min-w-[120px] hidden md:table-cell">Best Practices</TableHead>
                  <TableHead className="text-center min-w-[80px] hidden lg:table-cell">Issues</TableHead>
                  <TableHead className="text-center min-w-[80px] hidden lg:table-cell">Trend</TableHead>
                  <TableHead className="text-center min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      No reports found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{report.website}</p>

                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{report.date}</p>
                          <p className="text-xs text-muted-foreground">{report.time}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getScoreBadgeVariant(report.seoScore)} className={getScoreColor(report.seoScore)}>
                          {report.seoScore}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getScoreBadgeVariant(report.speedScore)} className={getScoreColor(report.speedScore)}>
                          {report.speedScore}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center hidden sm:table-cell">
                        <Badge variant={getScoreBadgeVariant(report.accessibilityScore)} className={getScoreColor(report.accessibilityScore)}>
                          {report.accessibilityScore}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell">
                        <Badge variant={getScoreBadgeVariant(report.bestPracticesScore)} className={getScoreColor(report.bestPracticesScore)}>
                          {report.bestPracticesScore}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center hidden lg:table-cell">
                        <span className="text-sm font-medium">{report.issues}</span>
                      </TableCell>
                      <TableCell className="text-center hidden lg:table-cell">
                        {report.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-600 mx-auto" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button variant="ghost" size="sm" className="hidden sm:flex">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="hidden sm:flex">
                            <Download className="w-4 h-4 mr-1" />
                            PDF
                          </Button>

                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
