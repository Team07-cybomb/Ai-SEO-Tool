"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, BarChart3, Zap, Shield, TrendingUp } from "lucide-react"
import Link from "next/link";
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SEO Audit Pro</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">

               {/* ✅ Global Navigation */}
    
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
          <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">Support</Link>
          <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">Profile</Link>
        
              <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Plans
              </Link>
              <a href="#profile" className="text-muted-foreground hover:text-foreground transition-colors">
                Profile
              </a>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
              <Button size="sm">Get Started</Button>
            </div>

            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-6 mt-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Search className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <span className="text-xl font-bold text-foreground">SEO Audit Pro</span>
                    </div>
                    <div className="flex flex-col space-y-4">
                      <a
                        href="#plans"
                        className="text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Plans
                      </a>
                      <a
                        href="#profile"
                        className="text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </a>
                      <div className="flex flex-col space-y-3 pt-4">
                        <Button variant="outline" className="w-full bg-transparent">
                          Sign In
                        </Button>
                        <Button className="w-full">Get Started</Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            Professional SEO Analysis
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
            Comprehensive SEO Audits for
            <span className="text-primary"> Better Rankings</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
            Get detailed SEO and performance reports with actionable insights. Identify issues, track improvements, and
            boost your website's search rankings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 w-full sm:w-auto">
              Start Free Audit
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent w-full sm:w-auto">
              View Sample Report
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Everything You Need for SEO Success</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Our comprehensive platform provides detailed analysis and actionable recommendations to improve your
              website's search engine performance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center sm:text-left">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Detailed SEO Analysis</CardTitle>
                <CardDescription className="leading-relaxed">
                  Comprehensive analysis of on-page SEO factors, meta tags, content optimization, and technical SEO
                  issues.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center sm:text-left">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0">
                  <Zap className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Performance Monitoring</CardTitle>
                <CardDescription className="leading-relaxed">
                  Track page speed, Core Web Vitals, and performance metrics that impact your search rankings.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center sm:text-left">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Progress Tracking</CardTitle>
                <CardDescription className="leading-relaxed">
                  Monitor improvements over time with historical data and track the impact of your SEO efforts.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center sm:text-left">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Security Analysis</CardTitle>
                <CardDescription className="leading-relaxed">
                  Check for security issues, SSL certificates, and other factors that affect search engine trust.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center sm:text-left">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0">
                  <Search className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Keyword Insights</CardTitle>
                <CardDescription className="leading-relaxed">
                  Discover keyword opportunities and analyze how well your content targets important search terms.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center sm:text-left">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg sm:text-xl">PDF Reports</CardTitle>
                <CardDescription className="leading-relaxed">
                  Generate professional PDF reports to share with clients or stakeholders with detailed findings.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Ready to Improve Your SEO?</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
            Join thousands of websites already using our platform to boost their search rankings.
          </p>
          <Button size="lg" className="text-lg px-8 w-full sm:w-auto">
            Start Your Free Audit Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground text-sm sm:text-base">© 2025 SEO Audit Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
