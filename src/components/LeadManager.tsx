import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  DollarSign,
  User,
  MoreVertical,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useMarketing } from "@/contexts/MarketingContext";
import { Lead } from "@/lib/marketingTypes";

interface CreateLeadForm {
  name: string;
  email: string;
  phone?: string;
  source: "website" | "social" | "referral" | "walkin" | "google" | "facebook";
  sourceDetails?: string;
  interests: string[];
  budget?: string;
  preferredTime?: string;
}

interface AddNoteForm {
  content: string;
  type: "call" | "email" | "meeting" | "sms" | "general";
}

export const LeadManager: React.FC = () => {
  const {
    leads,
    createLead,
    updateLeadStatus,
    addLeadNote,
    convertLead,
    metrics,
  } = useMarketing();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [conversionValue, setConversionValue] = useState("");
  const [filter, setFilter] = useState<Lead["status"] | "all">("all");

  const [formData, setFormData] = useState<CreateLeadForm>({
    name: "",
    email: "",
    phone: "",
    source: "website",
    sourceDetails: "",
    interests: [],
    budget: "",
    preferredTime: "",
  });

  const [noteForm, setNoteForm] = useState<AddNoteForm>({
    content: "",
    type: "general",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      source: "website",
      sourceDetails: "",
      interests: [],
      budget: "",
      preferredTime: "",
    });
  };

  const resetNoteForm = () => {
    setNoteForm({
      content: "",
      type: "general",
    });
  };

  const handleCreateLead = async () => {
    try {
      await createLead({
        ...formData,
        status: "new",
      });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create lead:", error);
    }
  };

  const handleAddNote = async () => {
    if (!selectedLead) return;

    try {
      await addLeadNote(selectedLead.id, noteForm);
      setIsNoteDialogOpen(false);
      resetNoteForm();
      setSelectedLead(null);
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const handleConvertLead = async () => {
    if (!selectedLead || !conversionValue) return;

    try {
      await convertLead(selectedLead.id, Number(conversionValue));
      setIsConvertDialogOpen(false);
      setConversionValue("");
      setSelectedLead(null);
    } catch (error) {
      console.error("Failed to convert lead:", error);
    }
  };

  const openNoteDialog = (lead: Lead) => {
    setSelectedLead(lead);
    setIsNoteDialogOpen(true);
  };

  const openConvertDialog = (lead: Lead) => {
    setSelectedLead(lead);
    setIsConvertDialogOpen(true);
  };

  const getStatusColor = (status: Lead["status"]) => {
    switch (status) {
      case "new":
        return "destructive";
      case "contacted":
        return "secondary";
      case "consultation_scheduled":
        return "default";
      case "converted":
        return "outline";
      case "lost":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getSourceIcon = (source: Lead["source"]) => {
    switch (source) {
      case "website":
        return "🌐";
      case "social":
        return "📱";
      case "referral":
        return "👥";
      case "walkin":
        return "🚶";
      case "google":
        return "🔍";
      case "facebook":
        return "📘";
      default:
        return "📍";
    }
  };

  const filteredLeads = leads.filter(
    (lead) => filter === "all" || lead.status === filter,
  );

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const leadsByStatus = {
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    consultation_scheduled: leads.filter(
      (l) => l.status === "consultation_scheduled",
    ).length,
    converted: leads.filter((l) => l.status === "converted").length,
    lost: leads.filter((l) => l.status === "lost").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Lead Management</h3>
          <p className="text-sm text-muted-foreground">
            Track and convert potential clients
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
              <DialogDescription>
                Add a potential client to your pipeline
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Lead Source</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, source: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="walkin">Walk-in</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sourceDetails">Source Details (Optional)</Label>
                <Input
                  id="sourceDetails"
                  value={formData.sourceDetails}
                  onChange={(e) =>
                    setFormData({ ...formData, sourceDetails: e.target.value })
                  }
                  placeholder="Campaign name, referrer, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Input
                    id="budget"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    placeholder="$150-200/month"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Input
                    id="preferredTime"
                    value={formData.preferredTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredTime: e.target.value,
                      })
                    }
                    placeholder="Morning, Evening, etc."
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateLead}>Add Lead</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">New</span>
            </div>
            <div className="text-2xl font-bold">{leadsByStatus.new}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Contacted</span>
            </div>
            <div className="text-2xl font-bold">{leadsByStatus.contacted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Scheduled</span>
            </div>
            <div className="text-2xl font-bold">
              {leadsByStatus.consultation_scheduled}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Converted</span>
            </div>
            <div className="text-2xl font-bold">{leadsByStatus.converted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Conversion</span>
            </div>
            <div className="text-2xl font-bold">
              {metrics.conversionRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Label>Filter by status:</Label>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Leads</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="consultation_scheduled">Scheduled</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lead List */}
      <div className="grid gap-4">
        {filteredLeads.map((lead) => (
          <Card key={lead.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{lead.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{getSourceIcon(lead.source)}</span>
                      <span className="capitalize">{lead.source}</span>
                      {lead.sourceDetails && (
                        <>
                          <span>•</span>
                          <span>{lead.sourceDetails}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(lead.status)}>
                    <span className="capitalize">
                      {lead.status.replace("_", " ")}
                    </span>
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => updateLeadStatus(lead.id, "contacted")}
                      >
                        Mark as Contacted
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateLeadStatus(lead.id, "consultation_scheduled")
                        }
                      >
                        Schedule Consultation
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openNoteDialog(lead)}>
                        Add Note
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openConvertDialog(lead)}>
                        Convert to Client
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateLeadStatus(lead.id, "lost")}
                      >
                        Mark as Lost
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Contact
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3" />
                      {lead.email}
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Details
                  </div>
                  <div className="space-y-1">
                    {lead.budget && (
                      <div className="text-sm">Budget: {lead.budget}</div>
                    )}
                    {lead.preferredTime && (
                      <div className="text-sm">
                        Prefers: {lead.preferredTime}
                      </div>
                    )}
                    {lead.interests.length > 0 && (
                      <div className="text-sm">
                        Interests: {lead.interests.join(", ")}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Timeline
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm">
                      Created: {getTimeAgo(lead.createdAt)}
                    </div>
                    {lead.lastContactAt && (
                      <div className="text-sm">
                        Last contact: {getTimeAgo(lead.lastContactAt)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {lead.notes.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Recent Notes</div>
                  <div className="space-y-2">
                    {lead.notes.slice(-2).map((note) => (
                      <div
                        key={note.id}
                        className="p-2 bg-muted rounded-lg text-sm"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {note.type}
                          </Badge>
                          <span className="text-muted-foreground">
                            {getTimeAgo(note.createdAt)}
                          </span>
                        </div>
                        <p>{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredLeads.length === 0 && (
          <Card className="border-2 border-dashed border-muted-foreground/25">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                <Target className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No leads found</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                {filter === "all"
                  ? "Start adding leads to track your sales pipeline"
                  : `No leads with ${filter} status found`}
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Lead
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Add a note to track your interaction with{" "}
              {selectedLead?.name || "this lead"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="note-type">Note Type</Label>
              <Select
                value={noteForm.type}
                onValueChange={(value: any) =>
                  setNoteForm({ ...noteForm, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Phone Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="general">General Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-content">Note</Label>
              <Textarea
                id="note-content"
                value={noteForm.content}
                onChange={(e) =>
                  setNoteForm({ ...noteForm, content: e.target.value })
                }
                placeholder="Enter your note here..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNoteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddNote}>Add Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert Lead Dialog */}
      <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convert Lead to Client</DialogTitle>
            <DialogDescription>
              Convert {selectedLead?.name || "this lead"} to a paying client
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="conversion-value">Conversion Value ($)</Label>
              <Input
                id="conversion-value"
                type="number"
                value={conversionValue}
                onChange={(e) => setConversionValue(e.target.value)}
                placeholder="150"
              />
              <p className="text-sm text-muted-foreground">
                Enter the initial package value or monthly rate
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConvertDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConvertLead}>Convert Lead</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
