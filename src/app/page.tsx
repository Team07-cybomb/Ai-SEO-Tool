"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Menu, Search, BarChart3, Zap, Shield, TrendingUp } from "lucide-react"


export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolledPastBanner, setIsScrolledPastBanner] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Check if we've scrolled past the banner section (approx 100vh)
      setIsScrolledPastBanner(window.scrollY > window.innerHeight * 0.8)
    }

    // window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      

      {/* Hero Section with Background Image & Overlay */}
      <section
        className="relative w-full h-full pt-35 pb-16 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/banner.png')" }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/80"></div>

        <div className="relative container mx-auto text-center max-w-4xl text-white">
          <Badge variant="secondary" className="mb-4">
            Professional SEO Analysis
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Comprehensive SEO Audits for
            <span className="text-primary"> Better Rankings</span>
          </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Get detailed SEO and performance reports with actionable insights. Identify issues, track improvements, and
            boost your website's search rankings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/audit">
                <Button size="lg" className="text-lg px-8 sm:w-auto">
                  Start Free Audit
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent  sm:w-auto">
              View Sample Report
            </Button>
          </div>

          {/* Stats Row */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-2xl font-bold">500K+</h3>
              <p className="text-light-foreground">Audits Completed</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">98%</h3>
              <p className="text-light-foreground">Accuracy Rate</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">24/7</h3>
              <p className="text-light-foreground">Support</p>
            </div>
          </div>
        </div>
      </section>


      {/* Feature Highlights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30" id="Features">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 text-primary">Everything You Need for SEO Success</h2>
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
                  <Zap className="w-6 h-6 text-primary" />
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
                  <TrendingUp className="w-6 h-6 text-primary" />
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
                  <Search className="w-6 h-6 text-primary" />
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
                  <BarChart3 className="w-6 h-6 text-primary" />
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
          <Link href="/audit">
          <Button size="lg" className="text-lg px-8 w-full sm:w-auto">
            Start Your Free Audit Today
          </Button></Link>
          
        </div>
      </section>

    </div>
  )
}
