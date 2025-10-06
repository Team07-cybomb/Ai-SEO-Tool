"use client"

import { useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement, // Added for Line chart
  PointElement, // Added for Line chart
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Button } from "@/components/ui/button"
import { Card, CardDescription } from "@/components/ui/card" // Assuming you have these components

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

const sampleData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "RankSEO",
      data: [65, 75, 80, 85, 90, 95],
      backgroundColor: "rgba(59, 130, 246, 0.5)",
      borderColor: "rgba(59, 130, 246, 1)",
      borderWidth: 2,
    },
    {
      label: "Other Competitors",
      data: [70, 72, 78, 80, 75, 76],
      backgroundColor: "rgba(234, 179, 8, 0.5)",
      borderColor: "rgba(234, 179, 8, 1)",
      borderWidth: 2,
    },
  ],
}

export function SeoGraph() {
  const [chartType, setChartType] = useState<"bar" | "line">("bar")

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Simulated SEO Score Over Time",
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
      },
    },
  }

  return (
    <Card className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
          SEO Performance Comparison
        </h3>
        <div className="flex space-x-2">
          <Button
            variant={chartType === "bar" ? "default" : "outline"}
            onClick={() => setChartType("bar")}
            className="text-sm"
          >
            Bar Chart
          </Button>
          <Button
            variant={chartType === "line" ? "default" : "outline"}
            onClick={() => setChartType("line")}
            className="text-sm"
          >
            Line Chart
          </Button>
        </div>
      </div>
      <CardDescription className="mb-4">
        This graph uses simulated data to demonstrate how our tool can help you
        outperform competitors by identifying and fixing key SEO issues.
      </CardDescription>
      {chartType === "bar" ? (
        <Bar data={sampleData} options={options} />
      ) : (
        <Line data={sampleData} options={{ ...options, tension: 0.4 }} />
      )}
    </Card>
  )
}