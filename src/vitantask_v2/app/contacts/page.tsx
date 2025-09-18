"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  Search,
  MoreHorizontal,
  Building2,
  Mail,
  Phone,
  Tag,
  FileText,
  Eye,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react"

// Mock contacts data
const mockContacts = [
  {
    id: "1",
    name: "Sarah Johnson",
    company: "TechCorp Inc.",
    email: "sarah.johnson@techcorp.com",
    phone: "+1 (555) 123-4567",
    tags: ["Client", "VIP", "Tech"],
    notes: "Key decision maker for enterprise solutions. Prefers email communication.",
    createdAt: "2024-01-10",
    lastContact: "2024-01-14",
    projects: [
      { id: "p1", name: "Website Redesign", status: "active" },
      { id: "p2", name: "Mobile App", status: "completed" },
    ],
    tasks: [
      { id: "t1", name: "Review proposal", status: "completed" },
      { id: "t2", name: "Schedule meeting", status: "in-progress" },
    ],
    teamMembers: [
      { id: "u1", name: "John Doe", role: "Project Manager" },
      { id: "u2", name: "Jane Smith", role: "Designer" },
    ],
  },
  {
    id: "2",
    name: "Michael Chen",
    company: "StartupXYZ",
    email: "mike@startupxyz.com",
    phone: "+1 (555) 987-6543",
    tags: ["Prospect", "Startup"],
    notes: "Interested in our consulting services. Follow up next week.",
    createdAt: "2024-01-08",
    lastContact: "2024-01-12",
    projects: [{ id: "p3", name: "MVP Development", status: "active" }],
    tasks: [{ id: "t3", name: "Send proposal", status: "pending" }],
    teamMembers: [{ id: "u3", name: "Bob Wilson", role: "Developer" }],
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    company: "Global Solutions Ltd.",
    email: "emily.r@globalsolutions.com",
    phone: "+1 (555) 456-7890",
    tags: ["Client", "Enterprise"],
    notes: "Long-term client. Quarterly business reviews scheduled.",
    createdAt: "2023-12-15",
    lastContact: "2024-01-13",
    projects: [
      { id: "p4", name: "System Integration", status: "active" },
      { id: "p5", name: "Data Migration", status: "completed" },
    ],
    tasks: [
      { id: "t4", name: "Quarterly review", status: "scheduled" },
      { id: "t5", name: "Contract renewal", status: "in-progress" },
    ],
    teamMembers: [
      { id: "u1", name: "John Doe", role: "Account Manager" },
      { id: "u4", name: "Alice Brown", role: "Technical Lead" },
    ],
  },
  {
    id: "4",
    name: "David Park",
    company: "Innovation Hub",
    email: "david@innovationhub.org",
    phone: "+1 (555) 321-0987",
    tags: ["Partner", "Non-profit"],
    notes: "Partnership opportunities for community projects.",
    createdAt: "2024-01-05",
    lastContact: "2024-01-11",
    projects: [],
    tasks: [{ id: "t6", name: "Partnership proposal", status: "draft" }],
    teamMembers: [],
  },
]

const tagColors = {
  Client: "bg-blue-100 text-blue-800",
  VIP: "bg-purple-100 text-purple-800",
  Tech: "bg-green-100 text-green-800",
  Prospect: "bg-yellow-100 text-yellow-800",
  Startup: "bg-orange-100 text-orange-800",
  Enterprise: "bg-indigo-100 text-indigo-800",
  Partner: "bg-pink-100 text-pink-800",
  "Non-profit": "bg-gray-100 text-gray-800",
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-orange-100 text-orange-800",
  scheduled: "bg-purple-100 text-purple-800",
  draft: "bg-gray-100 text-gray-800",
}

export default function ContactsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [tagFilter, setTagFilter] = useState("all")
  const [companyFilter, setCompanyFilter] = useState("all")
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [isContactDetailOpen, setIsContactDetailOpen] = useState(false)
  const [isCreateContactOpen, setIsCreateContactOpen] = useState(false)

  const filteredContacts = mockContacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTag = tagFilter === "all" || contact.tags.some((tag) => tag.toLowerCase() === tagFilter.toLowerCase())
    const matchesCompany = companyFilter === "all" || contact.company === companyFilter

    return matchesSearch && matchesTag && matchesCompany
  })

  const allTags = Array.from(new Set(mockContacts.flatMap((contact) => contact.tags)))
  const allCompanies = Array.from(new Set(mockContacts.map((contact) => contact.company)))

  const handleDeleteContact = async (contactId: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const contact = mockContacts.find((c) => c.id === contactId)
      toast({
        title: "Contact deleted",
        description: `${contact?.name} has been removed from your contacts.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete contact.",
        variant: "destructive",
      })
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-balance">Contacts</h1>
            <p className="text-muted-foreground">Manage your business contacts and relationships</p>
          </div>
          <Dialog open={isCreateContactOpen} onOpenChange={setIsCreateContactOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
                <DialogDescription>Create a new contact and manage their information</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="Contact name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company</label>
                    <Input placeholder="Company name" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="email@company.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input placeholder="+1 (555) 123-4567" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <Input placeholder="Client, VIP, Tech (comma separated)" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <textarea
                    className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                    placeholder="Additional notes about this contact..."
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Create Contact</Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateContactOpen(false)}
                    className="flex-1 bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockContacts.length}</div>
              <p className="text-xs text-muted-foreground">
                {mockContacts.filter((c) => c.tags.includes("Client")).length} clients
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Companies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allCompanies.length}</div>
              <p className="text-xs text-muted-foreground">Unique organizations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockContacts.reduce(
                  (acc, contact) => acc + contact.projects.filter((p) => p.status === "active").length,
                  0,
                )}
              </div>
              <p className="text-xs text-muted-foreground">With contacts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  mockContacts.filter((c) => {
                    const lastContact = new Date(c.lastContact)
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return lastContact > weekAgo
                  }).length
                }
              </div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search and Filter</CardTitle>
            <CardDescription>Find contacts by name, company, or tags</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {allCompanies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Contacts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Contacts ({filteredContacts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Projects</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{contact.name}</div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {contact.phone}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {contact.company}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className={tagColors[tag as keyof typeof tagColors] || "bg-gray-100 text-gray-800"}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{contact.projects.length} projects</div>
                          <div className="text-xs text-muted-foreground">
                            {contact.projects.filter((p) => p.status === "active").length} active
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{contact.lastContact}</div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedContact(contact)
                                setIsContactDetailOpen(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Contact
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteContact(contact.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Contact Detail Dialog */}
        <Dialog open={isContactDetailOpen} onOpenChange={setIsContactDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Contact Profile - {selectedContact?.name}</DialogTitle>
              <DialogDescription>Complete contact information and relationship overview</DialogDescription>
            </DialogHeader>
            {selectedContact && (
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{selectedContact.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedContact.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedContact.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedContact.phone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex flex-wrap gap-1">
                          {selectedContact.tags.map((tag: string) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className={tagColors[tag as keyof typeof tagColors] || "bg-gray-100 text-gray-800"}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <p className="text-sm">{selectedContact.notes}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Related Projects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Related Projects ({selectedContact.projects.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedContact.projects.length > 0 ? (
                      <div className="space-y-2">
                        {selectedContact.projects.map((project: any) => (
                          <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{project.name}</span>
                            </div>
                            <Badge
                              variant="outline"
                              className={statusColors[project.status as keyof typeof statusColors]}
                            >
                              {project.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No projects associated with this contact.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Related Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Related Tasks ({selectedContact.tasks.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedContact.tasks.length > 0 ? (
                      <div className="space-y-2">
                        {selectedContact.tasks.map((task: any) => (
                          <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{task.name}</span>
                            </div>
                            <Badge variant="outline" className={statusColors[task.status as keyof typeof statusColors]}>
                              {task.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No tasks associated with this contact.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Team Members */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Linked Team Members ({selectedContact.teamMembers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedContact.teamMembers.length > 0 ? (
                      <div className="space-y-2">
                        {selectedContact.teamMembers.map((member: any) => (
                          <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{member.name}</span>
                            </div>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              {member.role}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No team members linked to this contact.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
