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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Filter,
  Users,
  Mail,
  Phone,
  MoreHorizontal,
  Edit,
  Trash,
  Calendar,
  DollarSign,
  UserPlus,
  Target,
} from "lucide-react";
import { Client } from "@/lib/types";
import { useData } from "@/contexts/DataContext";

const SharePortalButton = ({ client }: { client: Client }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const portalUrl = `${window.location.origin}/client-portal/${client.id}`;
    try {
      await navigator.clipboard.writeText(portalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      {copied ? "Copied!" : "Share Portal"}
    </Button>
  );
};

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
        fitnessLevel: formData.fitnessLevel as
          | "beginner"
          | "intermediate"
          | "advanced",
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
                  placeholder="John Doe"
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
                  placeholder="john@example.com"
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
                  placeholder="(555) 123-4567"
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
            <div className="space-y-2">
              <Label htmlFor="goals">Fitness Goals</Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) =>
                  setFormData({ ...formData, goals: e.target.value })
                }
                placeholder="Weight loss, muscle gain, endurance improvement..."
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Special considerations, preferences, medical notes..."
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

const EditClientDialog = ({ client }: { client: Client }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateClient } = useData();
  const [formData, setFormData] = useState({
    name: client.name,
    email: client.email,
    phone: client.phone,
    fitnessLevel: client.fitnessLevel,
    goals: client.goals,
    notes: client.notes || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateClient(client.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        fitnessLevel: formData.fitnessLevel as
          | "beginner"
          | "intermediate"
          | "advanced",
        goals: formData.goals,
        notes: formData.notes,
      });
      setOpen(false);
    } catch (error) {
      console.error("Error updating client:", error);
      alert("Failed to update client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
          <DialogDescription>
            Update {client.name}'s information.
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fitness-level">Fitness Level</Label>
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
              <Label htmlFor="edit-goals">Fitness Goals</Label>
              <Textarea
                id="edit-goals"
                value={formData.goals}
                onChange={(e) =>
                  setFormData({ ...formData, goals: e.target.value })
                }
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
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
              {loading ? "Updating..." : "Update Client"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DeleteClientDialog = ({ client }: { client: Client }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { deleteClient } = useData();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteClient(client.id);
      setOpen(false);
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Failed to delete client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Client</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {client.name}? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
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

  return (
    <div className="space-y-6">
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
      {clients.length === 0 && (
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

      {clients.length > 0 && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Clients
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{clients.length}</div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Beginners</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
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
                <CardTitle className="text-sm font-medium">
                  Intermediate
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {
                    clients.filter((c) => c.fitnessLevel === "intermediate")
                      .length
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
                  {clients.filter((c) => c.fitnessLevel === "advanced").length}
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
          <div className="grid gap-4">
            {filteredClients.map((client) => (
              <Card
                key={client.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{client.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {client.email}
                          </div>
                          {client.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {client.phone}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              client.fitnessLevel === "beginner"
                                ? "secondary"
                                : client.fitnessLevel === "intermediate"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {client.fitnessLevel.charAt(0).toUpperCase() +
                              client.fitnessLevel.slice(1)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Joined {client.dateJoined}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <SharePortalButton client={client} />
                      <EditClientDialog client={client} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Session
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <DollarSign className="h-4 w-4 mr-2" />
                            Record Payment
                          </DropdownMenuItem>
                          <DeleteClientDialog client={client} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  {client.goals && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">
                        Goals
                      </h4>
                      <p className="text-sm">{client.goals}</p>
                    </div>
                  )}
                  {client.notes && (
                    <div className="mt-2">
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">
                        Notes
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {client.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No clients found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Clients;
