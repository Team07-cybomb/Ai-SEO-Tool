// src/app/About/page.tsx

import React from "react";
import { CheckCircle, Zap, Bug, BarChart } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-[#2f8e76] to-[#34d399] text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-6 text-[#003366]">
          About AI Landing Page Optimizer
        </h1>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed">
          The AI-powered solution that audits and optimizes your landing pages
          for SEO, performance, and bugs. Unlock valuable insights and boost
          your website's search rankings with detailed, actionable reports.
        </p>
      </header>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-semibold mb-6 text-[#003366]">
          Our Mission
        </h2>
        <p className="text-lg leading-relaxed max-w-4xl mx-auto">
          Our mission is to help businesses, developers, and marketers optimize
          their websites through comprehensive SEO and performance audits. We
          leverage the power of AI and key industry tools like Google PageSpeed
          Insights, Lighthouse, and Moz/Ahrefs to deliver actionable insights
          and recommendations that improve your website's performance and search
          visibility.
        </p>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-6">
        <h2 className="text-3xl font-semibold text-center mb-12 text-[#003366]">
          Key Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="p-6 bg-[#f9f9f9] rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105 transform">
            <CheckCircle className="w-10 h-10 text-[#34d399] mb-4" />
            <h3 className="text-xl font-semibold mb-4 text-[#003366]">
              Comprehensive SEO Analysis
            </h3>
            <p className="text-base leading-relaxed">
              Our platform analyzes on-page SEO factors like meta tags,
              headings, alt tags, and schema to ensure your content is optimized
              for search engines.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="p-6 bg-[#f9f9f9] rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105 transform">
            <Zap className="w-10 h-10 text-[#34d399] mb-4" />
            <h3 className="text-xl font-semibold mb-4 text-[#003366]">
              Performance Optimization
            </h3>
            <p className="text-base leading-relaxed">
              Identify performance bottlenecks, analyze Core Web Vitals, and
              improve your page load times to ensure a seamless user experience.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="p-6 bg-[#f9f9f9] rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105 transform">
            <Bug className="w-10 h-10 text-[#34d399] mb-4" />
            <h3 className="text-xl font-semibold mb-4 text-[#003366] break-words">
              Bug Detection & Issue Repair
            </h3>
            <p className="text-base leading-relaxed">
              Find critical bugs and broken elements that can harm user
              experience and SEO rankings. We provide actionable recommendations
              to fix them.
            </p>
          </div>
          {/* Feature 4 */}
          <div className="p-6 bg-[#f9f9f9] rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105 transform">
            <BarChart className="w-10 h-10 text-[#34d399] mb-4" />
            <h3 className="text-xl font-semibold mb-4 text-[#003366]">
              Backlink & Domain Authority
            </h3>
            <p className="text-base leading-relaxed">
              Track your backlinks, domain authority, and referring domains to
              strengthen your website's trustworthiness and improve search
              engine rankings.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Help Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-center mb-8 text-[#003366]">
          Who Can Benefit?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white shadow rounded-lg hover:shadow-xl transition-all hover:scale-105 transform">
            <h3 className="text-xl font-semibold mb-3 text-[#003366]">
              Marketers
            </h3>
            <p className="text-base leading-relaxed">
              Optimize your landing pages for better rankings, higher CTR, and
              better performance in search engines to increase conversions.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg hover:shadow-xl transition-all hover:scale-105 transform">
            <h3 className="text-xl font-semibold mb-3 text-[#003366]">
              Developers
            </h3>
            <p className="text-base leading-relaxed">
              Save time with our automated bug detection and performance
              optimization tools, allowing you to focus on building instead of
              debugging.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg hover:shadow-xl transition-all hover:scale-105 transform">
            <h3 className="text-xl font-semibold mb-3 text-[#003366]">
              Business Owners
            </h3>
            <p className="text-base leading-relaxed">
              Ensure your website is fast, optimized, mobile-friendly and
              ranking well in search results to drive more traffic and increase
              sales.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-[#34d399] to-[#2f8e76] text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6 text-[#003366]">
          Ready to Improve Your SEO?
        </h2>
        <p className="text-lg max-w-3xl mx-auto mb-6">
          Thousands of websites are already benefiting from our AI-powered
          optimization tool. Start improving your SEO and performance today with
          our free audit.
        </p>
        <a
          href="/audit"
          className="inline-block bg-white text-[#34d399] px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
        >
          Start Your Free Audit
        </a>
      </section>
    </div>
  );
};

export default AboutPage;
