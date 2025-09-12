import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

export default function HistoryPage() {
  const auditHistory = [
    {
      id: 1,
      website: "example.com",
      date: "2024-01-15",
      seoScore: 85,
      speedScore: 72,
      status: "completed",
    },
    {
      id: 2,
      website: "mystore.com",
      date: "2024-01-14",
      seoScore: 92,
      speedScore: 88,
      status: "completed",
    },
    {
      id: 3,
      website: "blog.example.org",
      date: "2024-01-12",
      seoScore: 67,
      speedScore: 45,
      status: "completed",
    },
    {
      id: 4,
      website: "portfolio.dev",
      date: "2024-01-10",
      seoScore: 78,
      speedScore: 91,
      status: "completed",
    },
    {
      id: 5,
      website: "startup.io",
      date: "2024-01-08",
      seoScore: 89,
      speedScore: 76,
      status: "completed",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit History</h1>
          <p className="text-muted-foreground">
            View and manage your previous SEO audits
          </p>
        </div>
      </div>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Audits</CardTitle>
          <CardDescription>
            Complete history of your website audits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditHistory.map((audit) => (
              <div
                key={audit.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-lg gap-3 sm:gap-0"
              >
                {/* Website & Date */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <div>
                    <p className="font-medium text-foreground">
                      {audit.website}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {audit.date}
                    </p>
                  </div>
                </div>

                {/* Scores & Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-2 sm:gap-0">
                  <div className="flex space-x-2 justify-center sm:justify-start">
                    <Badge variant="secondary">SEO: {audit.seoScore}</Badge>
                    <Badge variant="outline">Speed: {audit.speedScore}</Badge>
                  </div>

                  <div className="flex space-x-2 justify-center sm:justify-start">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
