import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Mail,
  Phone,
  Calendar,
  Target,
  Edit,
  MoreVertical,
  Share2,
  ExternalLink,
  Brain,
  Sparkles,
  Trophy,
  Star,
} from "lucide-react";
import { Client } from "@/lib/types";
import { SmartRecommendations } from "@/components/SmartRecommendations";
import { GamificationDashboard } from "@/components/GamificationDashboard";

// Mock data for demonstration
const mockClients: Client[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    dateJoined: "2024-01-15",
    fitnessLevel: "intermediate",
    goals: "Weight loss and strength building",
    notes:
      "Prefers morning sessions. Has knee issues - avoid high impact exercises.",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "(555) 234-5678",
    dateJoined: "2024-02-03",
    fitnessLevel: "beginner",
    goals: "Build muscle mass and improve endurance",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "(555) 345-6789",
    dateJoined: "2024-01-28",
    fitnessLevel: "advanced",
    goals: "Marathon training and performance optimization",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "(555) 456-7890",
    dateJoined: "2024-02-10",
    fitnessLevel: "intermediate",
    goals: "Functional fitness and injury prevention",
  },
];

const AddClientDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addClient } = useData();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    fitnessLevel: "",
    goals: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addClient({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        fitnessLevel: formData.fitnessLevel as "beginner" | "intermediate" | "advanced",
        goals: formData.goals,
        notes: formData.notes,
        dateJoined: new Date().toISOString().split("T")[0], // Will be overridden in DataContext
      });

      // Reset form and close dialog
      setFormData({
        name: "",
        email: "",
        phone: "",
        fitnessLevel: "",
        goals: "",
        notes: "",
      });
      setOpen(false);
    } catch (error) {
      console.error("Error adding client:", error);
      alert("Failed to add client. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Create a new client profile with their basic information and fitness
            goals.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter client name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fitness-level">Fitness Level</Label>
                <Select
                  value={formData.fitnessLevel}
                  onValueChange={(value) =>
                    setFormData({ ...formData, fitnessLevel: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="client@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goals">Fitness Goals</Label>
              <Textarea
                id="goals"
                placeholder="Describe their fitness goals and objectives..."
                className="min-h-[80px]"
                value={formData.goals}
                onChange={(e) =>
                  setFormData({ ...formData, goals: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any important notes, medical considerations, preferences..."
                className="min-h-[60px]"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Client"}
          </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const EditClientDialog = ({ client }: { client: Client }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: client.name,
    email: client.email,
    phone: client.phone,
    fitnessLevel: client.fitnessLevel,
    goals: client.goals,
    notes: client.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating client:", formData);
    alert(`Client "${formData.name}" updated successfully!`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex-1">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
          <DialogDescription>
            Update client information and fitness goals.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fitness-level">Fitness Level</Label>
                <Select
                  value={formData.fitnessLevel}
                  onValueChange={(value) =>
                    setFormData({ ...formData, fitnessLevel: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-goals">Fitness Goals</Label>
              <Textarea
                id="edit-goals"
                className="min-h-[80px]"
                value={formData.goals}
                onChange={(e) =>
                  setFormData({ ...formData, goals: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                className="min-h-[60px]"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Client</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ScheduleSessionDialog = ({ clientName }: { clientName: string }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    type: "",
    cost: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Scheduling session for:", clientName, formData);
    alert(`Session scheduled for ${clientName} on ${formData.date} at ${formData.startTime}!`);
    setOpen(false);
    setFormData({
      date: "",
      startTime: "",
      endTime: "",
      type: "",
      cost: "",
      notes: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="flex-1">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Session</DialogTitle>
          <DialogDescription>
            Schedule a new training session with {clientName}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="session-type">Session Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal-training">
                      Personal Training
                    </SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-cost">Cost ($)</Label>
                <Input
                  id="session-cost"
                  type="number"
                  placeholder="75"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="session-date">Date</Label>
                <Input
                  id="session-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-start">Start Time</Label>
                <Input
                  id="session-start"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-end">End Time</Label>
                <Input
                  id="session-end"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-notes">Notes (Optional)</Label>
              <Textarea
                id="session-notes"
                placeholder="Session notes, special instructions..."
                className="min-h-[60px]"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Schedule Session</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const SharePortalButton = ({ client }: { client: Client }) => {
  const portalId = client.name.toLowerCase().replace(/\s+/g, '-');
  const portalUrl = `${window.location.origin}/client-portal/${portalId}`;

  const handleShare = () => {
    const subject = "Your Personal Fitness Portal";
    const body = `Hi ${client.name},

I've created a personal fitness portal just for you! You can access it anytime to view your progress, upcoming sessions, workout plans, and payment information.

Access your portal here: ${portalUrl}

This link is secure and personalized just for you. Bookmark it for easy access!

Best regards,
Your Personal Trainer`;

    window.open(
      `mailto:${client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
  };

  const handleTestPortal = () => {
    window.open(`/client-portal/${portalId}`, '_blank');
  };

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="w-full"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share Portal
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleTestPortal}
        className="w-full text-xs"
      >
        <ExternalLink className="h-3 w-3 mr-1" />
        Test Portal
      </Button>
    </div>
  );
};

const AIRecommendationsDialog = ({ client }: { client: Client }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border-purple-200"
        >
          <Brain className="h-4 w-4 mr-2" />
          AI Coach
          <Sparkles className="h-3 w-3 ml-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            AI Coach Recommendations for {client.name}
          </DialogTitle>
          <DialogDescription>
            Smart insights and training recommendations powered by AI analysis
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <SmartRecommendations
            client={client}
            variant="full"
            onRecommendationApplied={(id) => {
              console.log(`Applied recommendation ${id} for ${client.name}`);
              // Here you would typically update the client's program
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const GamificationDialog = ({ client }: { client: Client }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 border-yellow-200"
        >
          <Trophy className="h-4 w-4 mr-1" />
          Achievements
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-600" />
            {client.name}'s Achievements & Streaks
          </DialogTitle>
          <DialogDescription>
            Gamification dashboard with streaks, badges, and milestones
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <GamificationDashboard
            client={client}
            variant="full"
            showCelebrations={true}
            onSendCelebration={(message) => {
              console.log(`Sending celebration to ${client.name}:`, message);
              alert(`🎉 Celebration SMS sent to ${client.name}!\n\n"${message}"`);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fitnessLevelFilter, setFitnessLevelFilter] = useState("all");
  const { clients, loading } = useData();

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFitnessLevel =
      fitnessLevelFilter === "all" ||
      client.fitnessLevel === fitnessLevelFilter;
    return matchesSearch && matchesFitnessLevel;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  const getFitnessLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client profiles and track their fitness journey.
          </p>
        </div>
        <AddClientDialog />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-sm text-muted-foreground">Total Clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beginners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {clients.filter((c) => c.fitnessLevel === "beginner").length}
            </div>
            <p className="text-sm text-muted-foreground">New to fitness</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intermediate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {
                clients.filter((c) => c.fitnessLevel === "intermediate")
                  .length
              }
            </div>
            <p className="text-sm text-muted-foreground">Building strength</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Advanced</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {clients.filter((c) => c.fitnessLevel === "advanced").length}
            </div>
            <p className="text-sm text-muted-foreground">Peak performance</p>
          </CardContent>
        </Card>
                      {client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <CardDescription>
                      Joined {new Date(client.dateJoined).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Fitness Level
                </span>
                <Badge className={getFitnessLevelColor(client.fitnessLevel)}>
                  {client.fitnessLevel.charAt(0).toUpperCase() +
                    client.fitnessLevel.slice(1)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  Goals
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {client.goals}
                </p>
              </div>

                  <div className="flex gap-2 pt-2">
                    <EditClientDialog client={client} />
                    <ScheduleSessionDialog clientName={client.name} />
                  </div>
                  <div className="space-y-2 pt-2">
                    <SharePortalButton client={client} />
                    <div className="grid grid-cols-2 gap-1">
                      <AIRecommendationsDialog client={client} />
                      <GamificationDialog client={client} />
                    </div>
                  </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm || filterLevel !== "all"
                  ? "No clients match your current filters."
                  : "No clients found. Add your first client to get started."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Clients;