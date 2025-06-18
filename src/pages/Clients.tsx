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
  Users,
  Target,
  UserPlus,
  AlertTriangle,
} from "lucide-react";
import { DevModeNotice } from "@/components/DevModeNotice";
import { useData } from "@/contexts/DataContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  getClientLimitInfo,
  canAddClient,
  getUpgradeMessage,
} from "@/lib/clientLimits";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const AddClientDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addClient, clients, getActiveClients } = useData();
  const { getCurrentPlan } = useSubscription();
  const { toast } = useToast();

  const currentPlan = getCurrentPlan();
  const activeClients = getActiveClients ? getActiveClients() : clients;
  const currentClientCount = activeClients.length;
  const limitInfo = getClientLimitInfo(currentPlan.id, currentClientCount);
  const upgradeMessage = getUpgradeMessage(currentPlan.id, currentClientCount);

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

    if (!canAddClient(currentPlan.id, currentClientCount)) {
      toast({
        title: "Client limit reached",
        description:
          upgradeMessage || "You've reached your client limit for this plan.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await addClient({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        fitnessLevel: formData.fitnessLevel as
          | "beginner"
          | "intermediate"
          | "advanced",
        goals: formData.goals,
        notes: formData.notes,
        dateJoined: new Date().toISOString().split("T")[0],
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        fitnessLevel: "",
        goals: "",
        notes: "",
      });
      setOpen(false);

      toast({
        title: "Client added",
        description: "New client has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding client:", error);
      toast({
        title: "Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = (newOpen: boolean) => {
    if (newOpen && !limitInfo.canAddMore) {
      toast({
        title: "Client limit reached",
        description:
          upgradeMessage || "You've reached your client limit for this plan.",
        variant: "destructive",
      });
      return;
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button disabled={!limitInfo.canAddMore}>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
          {!limitInfo.isUnlimited && ` (${limitInfo.remainingSlots} left)`}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Enter the client's information to add them to your client base.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
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
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
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
            <div className="space-y-2">
              <Label htmlFor="goals">Fitness Goals</Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) =>
                  setFormData({ ...formData, goals: e.target.value })
                }
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="min-h-[60px]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
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

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fitnessLevelFilter, setFitnessLevelFilter] = useState("all");
  const { clients, loading, getActiveClients, getArchivedClients } = useData();
  const { getCurrentPlan } = useSubscription();

  const currentPlan = getCurrentPlan();
  const activeClients = getActiveClients
    ? getActiveClients()
    : clients.filter((c: any) => !c.status || c.status.isActive !== false);
  const archivedClients = getArchivedClients ? getArchivedClients() : [];
  const currentClientCount = activeClients.length;
  const limitInfo = getClientLimitInfo(currentPlan.id, currentClientCount);

  const filteredActiveClients = activeClients.filter((client: any) => {
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

  return (
    <div className="p-6 space-y-6">
      <DevModeNotice />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client relationships and track their progress.
          </p>
        </div>
        <AddClientDialog />
      </div>

      {/* Empty State */}
      {activeClients.length === 0 && archivedClients.length === 0 && (
        <Card className="border-2 border-dashed border-muted-foreground/25 bg-muted/5">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
              <UserPlus className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Clients Yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Start building your client base! Add your first client to begin
              tracking their fitness journey and managing their sessions.
            </p>
            <AddClientDialog />
          </CardContent>
        </Card>
      )}

      {(activeClients.length > 0 || archivedClients.length > 0) && (
        <>
          {/* Client Limit Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Client Usage - {currentPlan.name} Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {limitInfo.current} of{" "}
                    {limitInfo.isUnlimited ? "unlimited" : limitInfo.limit}{" "}
                    clients
                  </span>
                  {!limitInfo.isUnlimited && (
                    <Badge
                      variant={
                        limitInfo.percentageUsed > 80
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {Math.round(limitInfo.percentageUsed)}% used
                    </Badge>
                  )}
                </div>
                {!limitInfo.isUnlimited && (
                  <Progress value={limitInfo.percentageUsed} className="h-2" />
                )}
                {!limitInfo.canAddMore && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      You've reached your client limit. Upgrade your plan to add
                      more clients.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Active
                </CardTitle>
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-2 sm:pt-6">
                <div className="text-xl sm:text-2xl font-bold">
                  {activeClients.length}
                </div>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Active Clients
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Beginners</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {
                    activeClients.filter(
                      (c: any) => c.fitnessLevel === "beginner",
                    ).length
                  }
                </div>
                <p className="text-sm text-muted-foreground">New to fitness</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Intermediate
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {
                    activeClients.filter(
                      (c: any) => c.fitnessLevel === "intermediate",
                    ).length
                  }
                </div>
                <p className="text-sm text-muted-foreground">
                  Building strength
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Advanced</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {
                    activeClients.filter(
                      (c: any) => c.fitnessLevel === "advanced",
                    ).length
                  }
                </div>
                <p className="text-sm text-muted-foreground">
                  Peak performance
                </p>
              </CardContent>
            </Card>
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
                <Select
                  value={fitnessLevelFilter}
                  onValueChange={setFitnessLevelFilter}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Fitness Level" />
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

          {/* Client List */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Active Clients ({filteredActiveClients.length})
              </h2>
              <div className="grid gap-4">
                {filteredActiveClients.map((client: any) => (
                  <Card
                    key={client.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                            <AvatarImage src={client.avatar} />
                            <AvatarFallback className="text-sm sm:text-lg font-semibold">
                              {client.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-base sm:text-lg text-foreground">
                              {client.name}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                              <Badge
                                variant={
                                  client.fitnessLevel === "beginner"
                                    ? "secondary"
                                    : client.fitnessLevel === "intermediate"
                                      ? "default"
                                      : "outline"
                                }
                                className="w-fit text-xs"
                              >
                                {client.fitnessLevel.charAt(0).toUpperCase() +
                                  client.fitnessLevel.slice(1)}
                              </Badge>
                              <span className="text-xs sm:text-sm text-muted-foreground">
                                Joined {client.dateJoined}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {filteredActiveClients.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">
                    No clients found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Clients;
