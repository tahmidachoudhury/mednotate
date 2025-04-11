import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Download, FileText, Filter, Search, Share2, User } from "lucide-react"

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Consultation History</h1>
          <p className="text-muted-foreground">View and manage your past consultations and notes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Refine your consultation history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <User className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patients</SelectItem>
                  <SelectItem value="p1">Patient #101</SelectItem>
                  <SelectItem value="p2">Patient #102</SelectItem>
                  <SelectItem value="p3">Patient #103</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select defaultValue="week">
                <SelectTrigger>
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">Last 3 Months</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Template Type</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <FileText className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Templates</SelectItem>
                  <SelectItem value="soap">SOAP</SelectItem>
                  <SelectItem value="dap">DAP</SelectItem>
                  <SelectItem value="birp">BIRP</SelectItem>
                  <SelectItem value="progress">Progress Note</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="signed">Signed</SelectItem>
                  <SelectItem value="shared">Shared</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full">Apply Filters</Button>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>All Consultations</CardTitle>
                  <CardDescription>Showing 12 consultations from the past 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">
                              {i % 3 === 0 ? "SOAP Note" : i % 3 === 1 ? "Progress Note" : "BIRP Note"} - Patient #
                              {100 + i}
                            </h3>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs ${
                                i % 4 === 0
                                  ? "bg-yellow-100 text-yellow-800"
                                  : i % 4 === 1
                                    ? "bg-green-100 text-green-800"
                                    : i % 4 === 2
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {i % 4 === 0 ? "Draft" : i % 4 === 1 ? "Completed" : i % 4 === 2 ? "Signed" : "Archived"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Created on April {i + 5}, 2025 • Last edited {i} day{i !== 1 ? "s" : ""} ago
                          </p>
                          <p className="text-sm">
                            {i % 3 === 0
                              ? "Headache, sinusitis"
                              : i % 3 === 1
                                ? "Follow-up, medication review"
                                : "Anxiety, insomnia"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4" />
                            <span className="sr-only">Share</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recent" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Consultations</CardTitle>
                  <CardDescription>Your most recent consultations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">
                              {i % 2 === 0 ? "SOAP Note" : "Progress Note"} - Patient #{100 + i}
                            </h3>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs ${
                                i % 2 === 0 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                              }`}
                            >
                              {i % 2 === 0 ? "Draft" : "Completed"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Created on April {i + 10}, 2025 • Last edited {i} hour{i !== 1 ? "s" : ""} ago
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4" />
                            <span className="sr-only">Share</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shared" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Shared Consultations</CardTitle>
                  <CardDescription>Consultations you've shared with others</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">
                              {i % 2 === 0 ? "SOAP Note" : "BIRP Note"} - Patient #{105 + i}
                            </h3>
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">Shared</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Shared with Dr. {i % 2 === 0 ? "Johnson" : "Williams"} on April {i + 8}, 2025
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="archived" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Archived Consultations</CardTitle>
                  <CardDescription>Consultations you've archived</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1].map((i) => (
                      <div key={i} className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">Progress Note - Patient #110</h3>
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800">Archived</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Archived on April 2, 2025</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
