import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Download, ArrowLeft, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"
import Link from "next/link"

// Mock detailed report data
const reportDetails = {
  id: 1,
  website: "example.com",
  url: "https://example.com",
  date: "2024-01-15",
  time: "14:30",
  seoScore: 85,
  speedScore: 72,
  accessibilityScore: 91,
  bestPracticesScore: 88,
  overallScore: 84,
  issues: {
    critical: 2,
    warning: 8,
    info: 12,
  },
  seoDetails: {
    metaTags: { score: 90, status: "good" },
    headings: { score: 85, status: "good" },
    images: { score: 70, status: "warning" },
    links: { score: 95, status: "excellent" },
    content: { score: 80, status: "good" },
  },
  speedDetails: {
    firstContentfulPaint: { value: "1.2s", score: 85 },
    largestContentfulPaint: { value: "2.1s", score: 75 },
    cumulativeLayoutShift: { value: "0.05", score: 90 },
    firstInputDelay: { value: "45ms", score: 95 },
  },
  recommendations: [
    {
      type: "critical",
      title: "Missing meta description",
      description: "Add meta descriptions to improve search engine visibility",
      impact: "High",
    },
    {
      type: "warning",
      title: "Images without alt text",
      description: "8 images are missing alt text for accessibility",
      impact: "Medium",
    },
    {
      type: "info",
      title: "Optimize image sizes",
      description: "Compress images to improve loading speed",
      impact: "Low",
    },
  ],
}

function getScoreColor(score: number) {
  if (score >= 90) return "text-green-600"
  if (score >= 70) return "text-yellow-600"
  return "text-red-600"
}

function getIssueIcon(type: string) {
  switch (type) {
    case "critical":
      return <XCircle className="w-4 h-4 text-red-600" />
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />
    case "info":
      return <Info className="w-4 h-4 text-blue-600" />
    default:
      return <CheckCircle className="w-4 h-4 text-green-600" />
  }
}

export default function ReportDetailPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/reports">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Reports
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{reportDetails.website}</h1>
            <p className="text-muted-foreground">
              Audit completed on {reportDetails.date} at {reportDetails.time}
            </p>
          </div>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Performance</CardTitle>
          <CardDescription>Summary of your website's SEO and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">{reportDetails.overallScore}</div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${getScoreColor(reportDetails.seoScore)}`}>
                {reportDetails.seoScore}
              </div>
              <p className="text-sm text-muted-foreground">SEO</p>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${getScoreColor(reportDetails.speedScore)}`}>
                {reportDetails.speedScore}
              </div>
              <p className="text-sm text-muted-foreground">Speed</p>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${getScoreColor(reportDetails.accessibilityScore)}`}>
                {reportDetails.accessibilityScore}
              </div>
              <p className="text-sm text-muted-foreground">Accessibility</p>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${getScoreColor(reportDetails.bestPracticesScore)}`}>
                {reportDetails.bestPracticesScore}
              </div>
              <p className="text-sm text-muted-foreground">Best Practices</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO Details */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Analysis</CardTitle>
            <CardDescription>Detailed breakdown of SEO factors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(reportDetails.seoDetails).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="capitalize font-medium">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={value.score} className="w-20" />
                  <span className={`text-sm font-medium ${getScoreColor(value.score)}`}>{value.score}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Speed Details */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Core Web Vitals and loading performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(reportDetails.speedDetails).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="capitalize font-medium text-sm">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{value.value}</span>
                  <span className={`text-sm font-medium ${getScoreColor(value.score)}`}>{value.score}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Issues Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Issues Summary</CardTitle>
          <CardDescription>Overview of issues found during the audit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 border border-red-200 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{reportDetails.issues.critical}</div>
              <p className="text-sm text-muted-foreground">Critical Issues</p>
            </div>
            <div className="text-center p-4 border border-yellow-200 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{reportDetails.issues.warning}</div>
              <p className="text-sm text-muted-foreground">Warnings</p>
            </div>
            <div className="text-center p-4 border border-blue-200 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{reportDetails.issues.info}</div>
              <p className="text-sm text-muted-foreground">Recommendations</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recommendations</h3>
            {reportDetails.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                {getIssueIcon(rec.type)}
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                  <Badge variant="outline" className="mt-2">
                    {rec.impact} Impact
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
