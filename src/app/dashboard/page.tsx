import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Plus } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your SEO performance overview.</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Audit
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average SEO Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">78</div>
            <p className="text-xs text-muted-foreground">+5 points from last audit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues Found</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">-8 from last audit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+23 this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Audits */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Audits</CardTitle>
            <CardDescription>Your latest website audits and their scores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">example.com</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">SEO: 85</Badge>
                <Badge variant="outline">Speed: 72</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">mystore.com</p>
                <p className="text-sm text-muted-foreground">1 day ago</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">SEO: 92</Badge>
                <Badge variant="outline">Speed: 88</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">blog.example.org</p>
                <p className="text-sm text-muted-foreground">3 days ago</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">SEO: 67</Badge>
                <Badge variant="outline">Speed: 45</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Plus className="w-4 h-4 mr-2" />
              Run New SEO Audit
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <BarChart3 className="w-4 h-4 mr-2" />
              View All Reports
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <TrendingUp className="w-4 h-4 mr-2" />
              Compare Performance
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Review Critical Issues
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
