"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Eye,
  Search,
  Filter,
  Plus,
  TrendingUp,
  TrendingDown,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

function getPriorityColor(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":
      return "text-red-600";
    case "medium":
      return "text-yellow-600";
    case "low":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
}

// Function to format analysis text into bullet points
function formatAnalysis(analysis: string) {
  if (!analysis) return [];
  
  // Split by common bullet point indicators
  const points = analysis.split(/\n|•|\*| - /).filter(point => 
    point.trim().length > 0 && 
    !point.toLowerCase().includes("analysis:") &&
    !point.toLowerCase().includes("detailed analysis:")
  );
  
  return points.length > 0 ? points : [analysis];
}

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [auditReports, setAuditReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // ✅ Fetch data from API
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
          date: audit.date || new Date().toLocaleDateString("en-GB"), // format: DD/MM/YYYY
          time: audit.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          seoScore: audit.scores?.seo ?? 0,
          speedScore: audit.scores?.performance ?? 0,
          accessibilityScore: audit.scores?.accessibility ?? 0,
          bestPracticesScore: audit.scores?.bestPractices ?? 0,
          issues: audit.issues ?? 0,
          status: audit.status || "completed",
          trend: audit.trend || (audit.scores?.seo > 70 ? "up" : "down"),
          recommendations: audit.recommendations || [],
          analysis: audit.analysis || "",
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

  // ✅ Convert DD/MM/YYYY → YYYY-MM-DD for date comparison
  const formatDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  // ✅ Filtering logic with Date filter
  const filteredReports = auditReports.filter((report) => {
    const matchesSearch =
      report.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.url.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;

    const matchesDate = !dateFilter || formatDate(report.date) === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  // ✅ Handle view report
  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">View and manage your SEO audit reports</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> New Audit
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
                <p className="text-xs sm:text-sm text-muted-foreground">Recent SEO Score</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {auditReports.length > 0
                    ? auditReports[0].seoScore
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
                <p className="text-xs sm:text-sm text-muted-foreground">Recent Speed Score</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {auditReports.length > 0
                    ? auditReports[0].speedScore
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
                  {auditReports.filter(
                    (r) =>
                      r.seoScore === 0 &&
                      r.speedScore === 0 &&
                      r.accessibilityScore === 0 &&
                      r.bestPracticesScore === 0
                  ).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Audit Reports</CardTitle>
            <CardDescription>Detailed view of all your website audits</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search + Status + Date Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search websites or URLs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Date Filter */}
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full sm:w-48"
            />
          </div>

          {/* Reports Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Website</TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">SEO Score</TableHead>
                  <TableHead className="text-center">Speed Score</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Accessibility</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Best Practices</TableHead>
                  <TableHead className="text-center hidden lg:table-cell">Trend</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
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
                      <TableCell>{report.website}</TableCell>
                      <TableCell>
                        <p className="text-center text-sm font-medium">{report.date}</p>
                        {/* <p className="text-xs text-muted-foreground">{report.time}</p> */}
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
                        <Badge
                          variant={getScoreBadgeVariant(report.accessibilityScore)}
                          className={getScoreColor(report.accessibilityScore)}
                        >
                          {report.accessibilityScore}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell">
                        <Badge
                          variant={getScoreBadgeVariant(report.bestPracticesScore)}
                          className={getScoreColor(report.bestPracticesScore)}
                        >
                          {report.bestPracticesScore}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center hidden lg:table-cell">
                        {report.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-600 mx-auto" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewReport(report)}
                        >
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Report Detail Dialog - Increased width */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
         <DialogContent
    className="w-[70vw] max-w-[70vw] h-[95vh] overflow-y-auto text-xl"
    style={{ maxWidth: "70vw" }} // Extra safeguard if Tailwind is overridden
  >

          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Audit Report: {selectedReport?.website}</span>
              {/* <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button> */}
            </DialogTitle>
            <DialogDescription>
              Detailed analysis for {selectedReport?.url}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-6 py-4">
              {/* Summary Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Performance Summary</CardTitle>
                  <CardDescription>Overall website performance scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="space-y-2">
                      <p className="text-xl font-medium">SEO Score</p>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedReport.seoScore} className="h-2" />
                        <Badge variant={getScoreBadgeVariant(selectedReport.seoScore)}>
                          {selectedReport.seoScore}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-medium">Speed Score</p>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedReport.speedScore} className="h-2" />
                        <Badge variant={getScoreBadgeVariant(selectedReport.speedScore)}>
                          {selectedReport.speedScore}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-medium">Accessibility</p>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedReport.accessibilityScore} className="h-2" />
                        <Badge variant={getScoreBadgeVariant(selectedReport.accessibilityScore)}>
                          {selectedReport.accessibilityScore}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-medium">Best Practices</p>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedReport.bestPracticesScore} className="h-2" />
                        <Badge variant={getScoreBadgeVariant(selectedReport.bestPracticesScore)}>
                          {selectedReport.bestPracticesScore}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs for different sections */}
              <Tabs defaultValue="recommendations" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
                  <TabsTrigger value="technical">Technical Details</TabsTrigger>
                </TabsList>

                <TabsContent value="recommendations" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Actionable Recommendations</CardTitle>
                      <CardDescription>
                        Prioritized list of improvements for your website
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedReport.recommendations && selectedReport.recommendations.length > 0 ? (
                        selectedReport.recommendations.map((rec: any, index: number) => (
                          <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                            <div className={`p-2 rounded-full ${getPriorityColor(rec.priority)} bg-opacity-20`}>
                              {rec.priority === "high" ? (
                                <AlertCircle className="h-5 w-5" />
                              ) : rec.priority === "medium" ? (
                                <Clock className="h-5 w-5" />
                              ) : (
                                <CheckCircle className="h-5 w-5" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold capitalize">{rec.priority} Priority</h4>
                              <p className="text-xl text-muted-foreground">{rec.text}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No recommendations available for this audit.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analysis" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Analysis</CardTitle>
                      <CardDescription>
                        Comprehensive breakdown of the audit results
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedReport.analysis ? (
                        <div className="space-y-3">
                          {formatAnalysis(selectedReport.analysis).map((point, index) => (
                            <div key={index} className="flex items-start">
                              <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                              <p className="text-xl pt-1.5" >{point.replace(/#/g, "").trim()}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No detailed analysis available for this audit.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="technical" className="space-y-4 pt-4 text-xl">
                  <Card>
                    <CardHeader>
                      <CardTitle>Technical Details</CardTitle>
                      <CardDescription>
                        Metadata and technical information about this audit
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-xl">Audit Date</h4>
                          <p className="text-xl text-muted-foreground">{selectedReport.date}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-xl">Audit Time</h4>
                          <p className="text-xl text-muted-foreground">{selectedReport.time}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-xl">Website URL</h4>
                          <p className="text-xl text-muted-foreground break-all">{selectedReport.url}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-xl">Status</h4>
                          <Badge variant={selectedReport.status === "completed" ? "default" : "secondary"}>
                            {selectedReport.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
{/* 
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
                <Button>Run New Audit</Button>
              </div> */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}