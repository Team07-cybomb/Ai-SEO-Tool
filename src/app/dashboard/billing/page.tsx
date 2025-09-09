import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Download, CheckCircle } from "lucide-react"

export default function BillingPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Purchase & Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your active subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Professional Plan</h3>
              <p className="text-muted-foreground">50 audits per month</p>
              <Badge variant="secondary" className="mt-2">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">$29/month</p>
              <p className="text-sm text-muted-foreground">Next billing: Jan 15, 2024</p>
              <Button className="mt-2">Upgrade Plan</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Usage This Month</CardTitle>
          <CardDescription>Track your audit usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Audits Used</span>
                <span>24 / 50</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "48%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your recent invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-4">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Professional Plan</p>
                  <p className="text-sm text-muted-foreground">Dec 15, 2023</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary">Paid</Badge>
                <span className="font-medium">$29.00</span>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Invoice
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-4">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Professional Plan</p>
                  <p className="text-sm text-muted-foreground">Nov 15, 2023</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary">Paid</Badge>
                <span className="font-medium">$29.00</span>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Invoice
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
