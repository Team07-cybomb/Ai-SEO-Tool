"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Eye, Search, Filter, Plus, MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for audit reports
const auditReports = [
  {
    id: 1,
    website: "example.com",
    url: "https://example.com",
    date: "2024-01-15",
    time: "14:30",
    seoScore: 85,
    speedScore: 72,
    accessibilityScore: 91,
    bestPracticesScore: 88,
    issues: 12,
    status: "completed",
    trend: "up",
  },
  {
    id: 2,
    website: "mystore.com",
    url: "https://mystore.com",
    date: "2024-01-14",
    time: "09:15",
    seoScore: 92,
    speedScore: 88,
    accessibilityScore: 95,
    bestPracticesScore: 90,
    issues: 5,
    status: "completed",
    trend: "up",
  },
  {
    id: 3,
    website: "blog.example.org",
    url: "https://blog.example.org",
    date: "2024-01-12",
    time: "16:45",
    seoScore: 67,
    speedScore: 45,
    accessibilityScore: 78,
    bestPracticesScore: 82,
    issues: 28,
    status: "completed",
    trend: "down",
  },
  {
    id: 4,
    website: "portfolio.dev",
    url: "https://portfolio.dev",
    date: "2024-01-10",
    time: "11:20",
    seoScore: 78,
    speedScore: 91,
    accessibilityScore: 89,
    bestPracticesScore: 85,
    issues: 15,
    status: "completed",
    trend: "up",
  },
  {
    id: 5,
    website: "startup.io",
    url: "https://startup.io",
    date: "2024-01-08",
    time: "13:10",
    seoScore: 89,
    speedScore: 76,
    accessibilityScore: 92,
    bestPracticesScore: 87,
    issues: 8,
    status: "completed",
    trend: "up",
  },
  {
    id: 6,
    website: "ecommerce.shop",
    url: "https://ecommerce.shop",
    date: "2024-01-06",
    time: "10:30",
    seoScore: 74,
    speedScore: 68,
    accessibilityScore: 85,
    bestPracticesScore: 79,
    issues: 22,
    status: "completed",
    trend: "down",
  },
]

function getScoreColor(score: number) {
  if (score >= 90) return "text-green-600 bg-green-50"
  if (score >= 70) return "text-yellow-600 bg-yellow-50"
  return "text-red-600 bg-red-50"
}

function getScoreBadgeVariant(score: number) {
  if (score >= 90) return "default"
  if (score >= 70) return "secondary"
  return "destructive"
}

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  const filteredReports = auditReports.filter((report) => {
    const matchesSearch =
      report.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.url.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-25">
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
                <p className="text-xl sm:text-2xl font-bold">81</p>
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
                <p className="text-xl sm:text-2xl font-bold">73</p>
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
                <p className="text-xl sm:text-2xl font-bold">90</p>
              </div>
              <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search + Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Audit Reports</CardTitle>
            <CardDescription>Detailed view of all your website audits</CardDescription>
          </div>
          {/* Grade Sheet on the right side */}
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
                  <TableHead className="text-right min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{report.website}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[180px]">{report.url}</p>
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
                      <Badge
                        variant={getScoreBadgeVariant(report.speedScore)}
                        className={getScoreColor(report.speedScore)}
                      >
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Export Data
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reports found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
