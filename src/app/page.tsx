"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { Menu, Search, BarChart3, Zap, Shield, TrendingUp } from "lucide-react"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolledPastBanner, setIsScrolledPastBanner] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledPastBanner(window.scrollY > window.innerHeight * 0.8)
    }
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        className="relative w-full h-full pt-35 pb-16 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/banner.png')" }}
      >
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
            boost your website&apos;s search rankings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/audit">
              <Button size="lg" className="text-lg px-8 sm:w-auto">
                Start Free Audit
              </Button>
            </Link>
          </div>

          {/* Stats */}
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

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30" id="Features">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 text-primary">
              Everything You Need for SEO Success
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Our comprehensive platform provides detailed analysis and actionable recommendations to improve your
              website&apos;s search engine performance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center sm:text-left">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Detailed SEO Analysis</CardTitle>
                <CardDescription>
                  Comprehensive analysis of on-page SEO factors, meta tags, content optimization, and technical SEO issues.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center sm:text-left">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Performance Monitoring</CardTitle>
                <CardDescription>
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
                <CardDescription>
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
                <CardDescription>
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
                <CardDescription>
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
                <CardDescription>
                  Generate professional PDF reports to share with clients or stakeholders with detailed findings.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

{/* FAQ Section */}
<section className="py-16 px-4 sm:px-6 lg:px-8 bg-background" id="FAQ">
  <div className="container mx-auto max-w-4xl">
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-6 text-primary">
        Frequently Asked Questions
      </h2>
      <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Find quick answers to common questions about SEO and AI-powered SEO tools.
      </p>
    </div>

    <Accordion type="single" collapsible className="w-full space-y-4">
      <AccordionItem value="item-1" className="border rounded-xl shadow-sm">
        <AccordionTrigger className="text-lg sm:text-xl font-semibold text-foreground px-4 sm:px-6 py-4 hover:text-primary hover:no-underline transition-colors">
          What is SEO and why is it important?
        </AccordionTrigger>
        <AccordionContent className="text-base sm:text-lg text-muted-foreground px-4 sm:px-6 pb-4 leading-relaxed">
          SEO (Search Engine Optimization) helps improve your website’s visibility in search engines, driving more
          organic traffic and building credibility for your brand.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2" className="border rounded-xl shadow-sm">
        <AccordionTrigger className="text-lg sm:text-xl font-semibold text-foreground px-4 sm:px-6 py-4 hover:text-primary hover:no-underline transition-colors">
          How does an AI SEO tool work?
        </AccordionTrigger>
        <AccordionContent className="text-base sm:text-lg text-muted-foreground px-4 sm:px-6 pb-4 leading-relaxed">
          AI SEO tools analyze your site using machine learning to identify issues, suggest optimizations, and highlight
          keyword opportunities to improve your rankings faster.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3" className="border rounded-xl shadow-sm">
        <AccordionTrigger className="text-lg sm:text-xl font-semibold text-foreground px-4 sm:px-6 py-4 hover:text-primary hover:no-underline transition-colors">
          Can AI replace human SEO experts?
        </AccordionTrigger>
        <AccordionContent className="text-base sm:text-lg text-muted-foreground px-4 sm:px-6 pb-4 leading-relaxed">
          AI speeds up analysis and provides data-driven insights, but human creativity and strategy remain essential for
          long-term SEO success.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4" className="border rounded-xl shadow-sm">
        <AccordionTrigger className="text-lg sm:text-xl font-semibold text-foreground px-4 sm:px-6 py-4 hover:text-primary hover:no-underline transition-colors">
          How often should I run an SEO audit?
        </AccordionTrigger>
        <AccordionContent className="text-base sm:text-lg text-muted-foreground px-4 sm:px-6 pb-4 leading-relaxed">
          Running an audit monthly (or after major site changes) ensures your site stays optimized and aligned with
          search engine updates.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-5" className="border rounded-xl shadow-sm">
        <AccordionTrigger className="text-lg sm:text-xl font-semibold text-foreground px-4 sm:px-6 py-4 hover:text-primary hover:no-underline transition-colors">
          Will using an AI SEO tool guarantee first-page rankings?
        </AccordionTrigger>
        <AccordionContent className="text-base sm:text-lg text-muted-foreground px-4 sm:px-6 pb-4 leading-relaxed">
          No tool can guarantee #1 rankings, but AI tools give you the insights and recommendations needed to
          significantly improve your chances.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-6" className="border rounded-xl shadow-sm">
        <AccordionTrigger className="text-lg sm:text-xl font-semibold text-foreground px-4 sm:px-6 py-4 hover:text-primary hover:no-underline transition-colors">
          Is an AI SEO tool suitable for beginners?
        </AccordionTrigger>
        <AccordionContent className="text-base sm:text-lg text-muted-foreground px-4 sm:px-6 pb-4 leading-relaxed">
          Absolutely! AI SEO tools simplify complex SEO tasks, making them easy to understand even if you have no
          technical background.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</section>


      {/* CTA Section */}
      <section  className="text-white py-12 sm:py-16 px-4 sm:px-6 text-center"
        style={{ backgroundColor: "var(--primary)" }}>
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">Ready to Improve Your SEO?</h2>
          <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-6 text-gray-200 tracking-wide">
            Join thousands of websites already using our platform to boost their search rankings.
          </p>
<Link
          href="/audit"
          className="inline-block bg-white px-5 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all text-base sm:text-lg"
          style={{ color: "var(--primary)" }}
        >
          Start Your Free Audit Today
        </Link>
        </div>
      </section>
    </div>
  )
}
