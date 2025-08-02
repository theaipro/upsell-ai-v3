import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Copy, Plus, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { demoApiKeys } from "@/lib/demo-data"

export default function ApiKeysPage() {
  const apiKeys = demoApiKeys

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
        <p className="text-muted-foreground">Manage API keys for accessing the Upsell AI API.</p>
      </div>

      <Separator />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your API Keys</CardTitle>
                <CardDescription>Create and manage API keys for your applications.</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New Key
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-1 rounded text-sm">{key.key_prefix}..</code>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{key.last_used_at?.toLocaleDateString()}</TableCell>
                    <TableCell>{key.last_used_at?.toLocaleTimeString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          key.is_active
                            ? "bg-green-50 text-green-700 hover:bg-green-50"
                            : "bg-red-50 text-red-700 hover:bg-red-50"
                        }
                      >
                        {key.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Usage</CardTitle>
            <CardDescription>Monitor your API usage and limits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>API Calls (This Month)</Label>
                <span className="text-sm font-medium">12,543 / 50,000</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "25%" }}></div>
              </div>
              <p className="text-xs text-muted-foreground">25% of your monthly limit used</p>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Rate Limit</p>
                <p className="text-2xl font-bold">100 req/min</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">99.8%</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Avg. Response Time</p>
                <p className="text-2xl font-bold">124ms</p>
              </div>
            </div>

            <Button variant="outline">View Detailed Analytics</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Documentation</CardTitle>
            <CardDescription>Resources to help you integrate with our API.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-4 justify-start bg-transparent">
                <div className="text-left">
                  <p className="font-medium">Getting Started Guide</p>
                  <p className="text-sm text-muted-foreground">Learn the basics of the Upsell AI API</p>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-4 justify-start bg-transparent">
                <div className="text-left">
                  <p className="font-medium">API Reference</p>
                  <p className="text-sm text-muted-foreground">Complete documentation of endpoints</p>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-4 justify-start bg-transparent">
                <div className="text-left">
                  <p className="font-medium">Code Examples</p>
                  <p className="text-sm text-muted-foreground">Sample code in various languages</p>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-4 justify-start bg-transparent">
                <div className="text-left">
                  <p className="font-medium">Webhooks Guide</p>
                  <p className="text-sm text-muted-foreground">Set up and manage webhook events</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
