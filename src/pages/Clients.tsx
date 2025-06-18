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
  Trash2,
  Calendar,
  DollarSign,
  UserPlus,
  Target,
  Share2,
  Brain,
  Sparkles,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import { Client } from "@/lib/types";
import { useData } from "@/contexts/DataContext";

const AppliedRecommendations = ({ clientId }: { clientId: string }) => {
  const [appliedRecs, setAppliedRecs] = useState<any[]>([]);

  useState(() => {
    const stored = localStorage.getItem("appliedRecommendations");
    if (stored) {
      try {
        const allApplied = JSON.parse(stored);
        const clientRecs = allApplied.filter(
          (rec: any) => rec.clientId === clientId,
        );
        setAppliedRecs(clientRecs);
      } catch (e) {
        console.warn("Failed to load applied recommendations:", e);
      }
    }
  });

  const removeRecommendation = (recId: string) => {
    const stored = localStorage.getItem("appliedRecommendations");
    if (stored) {
      try {
        const allApplied = JSON.parse(stored);
        const updated = allApplied.filter((rec: any) => rec.id !== recId);
        localStorage.setItem("appliedRecommendations", JSON.stringify(updated));
        setAppliedRecs(updated.filter((rec: any) => rec.clientId === clientId));
      } catch (e) {
        console.warn("Failed to update recommendations:", e);
      }
    }
  };

  if (appliedRecs.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="h-4 w-4 text-purple-600" />
        <h4 className="font-medium text-sm text-muted-foreground">
          Active AI Recommendations ({appliedRecs.length})
        </h4>
      </div>
      <div className="space-y-2">
        {appliedRecs.map((rec) => (
          <div
            key={rec.id}
            className="flex items-center justify-between p-2 bg-purple-50 border border-purple-200 rounded-lg"
          >
            <div className="flex items-center gap-2 flex-1">
              <Sparkles className="h-3 w-3 text-purple-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-purple-800 truncate">
                  {rec.title}
                </p>
                <p className="text-xs text-purple-600">
                  Applied {new Date(rec.appliedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Badge
                variant="outline"
                className="text-xs border-purple-300 text-purple-700"
              >
                {rec.type}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-purple-100"
                onClick={() => removeRecommendation(rec.id)}
                title="Mark as completed"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SharePortalButton = ({ client }: { client: Client }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboardFallback = (text: string): boolean => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.error("Fallback copy failed:", err);
      return false;
    }
  };

  const handleShare = async () => {
    const portalUrl = `${window.location.origin}/client-portal/${client.id}`;

    let copySuccessful = false;

    // Try modern Clipboard API first, but catch any errors
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(portalUrl);
        copySuccessful = true;
      } catch (err) {
        console.warn("Modern clipboard API failed, trying fallback:", err);
        // Don't throw here, try fallback instead
      }
    }

    // If modern API failed or isn't available, try fallback
    if (!copySuccessful) {
      copySuccessful = copyToClipboardFallback(portalUrl);
    }

    if (copySuccessful) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      // Show user feedback for failed copy
      alert(`Copy failed. Please manually copy this URL: ${portalUrl}`);
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
    weight: "",
    height: "",
    bodyFat: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newClient = await addClient({
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

      // If initial measurements were provided, store them for the Progress page
      if (formData.weight || formData.height || formData.bodyFat) {
        const initialMeasurements = {
          clientId: Date.now().toString(), // Temporary ID - will need to be updated with real client ID
          date: new Date().toISOString().split("T")[0],
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          height: formData.height ? parseFloat(formData.height) : undefined,
          bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
          notes: "Initial measurements",
        };

        // Store in localStorage for now (in a real app, this would go to the database)
        const existingMeasurements = JSON.parse(
          localStorage.getItem("progressEntries") || "[]",
        );
        existingMeasurements.push(initialMeasurements);
        localStorage.setItem(
          "progressEntries",
          JSON.stringify(existingMeasurements),
        );
      }

      // Reset form and close dialog
      setFormData({
        name: "",
        email: "",
        phone: "",
        fitnessLevel: "",
        goals: "",
        notes: "",
        weight: "",
        height: "",
        bodyFat: "",
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

            {/* Initial Measurements Section */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="text-sm font-medium text-foreground">
                Initial Measurements
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (lbs) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    placeholder="160"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (in)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                    placeholder="70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodyFat">Body Fat %</Label>
                  <Input
                    id="bodyFat"
                    type="number"
                    step="0.1"
                    value={formData.bodyFat}
                    onChange={(e) =>
                      setFormData({ ...formData, bodyFat: e.target.value })
                    }
                    placeholder="18"
                  />
                </div>
              </div>
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

const ScheduleSessionDialog = ({ client }: { client: Client }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addSession } = useData();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
    type: "personal-training" as
      | "personal-training"
      | "consultation"
      | "assessment",
    cost: 75,
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addSession({
        clientId: client.id,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        type: formData.type,
        status: "scheduled",
        cost: formData.cost,
        notes: formData.notes,
      });

      setFormData({
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00",
        endTime: "10:00",
        type: "personal-training",
        cost: 75,
        notes: "",
      });
      setOpen(false);
    } catch (error) {
      console.error("Error scheduling session:", error);
      alert("Failed to schedule session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Session
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Session for {client.name}</DialogTitle>
          <DialogDescription>
            Schedule a new training session for your client.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Session Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      type: value as typeof formData.type,
                      cost:
                        value === "assessment"
                          ? 50
                          : value === "consultation"
                            ? 60
                            : 75,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal-training">
                      Personal Training ($75)
                    </SelectItem>
                    <SelectItem value="assessment">Assessment ($50)</SelectItem>
                    <SelectItem value="consultation">
                      Consultation ($60)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
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
              <Label htmlFor="cost">Cost ($)</Label>
              <Input
                id="cost"
                type="number"
                value={formData.cost}
                onChange={(e) =>
                  setFormData({ ...formData, cost: parseInt(e.target.value) })
                }
                required
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
                placeholder="Session focus, client goals, special considerations..."
                className="min-h-[60px]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Scheduling..." : "Schedule Session"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const RecordPaymentDialog = ({ client }: { client: Client }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addPayment } = useData();
  const [formData, setFormData] = useState({
    amount: 75,
    method: "card" as "card" | "cash" | "bank-transfer" | "venmo",
    description: "Personal Training Session",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addPayment({
        clientId: client.id,
        amount: formData.amount,
        date: formData.date,
        method: formData.method,
        status: "completed",
        description: formData.description,
      });

      setFormData({
        amount: 75,
        method: "card",
        description: "Personal Training Session",
        date: new Date().toISOString().split("T")[0],
      });
      setOpen(false);
    } catch (error) {
      console.error("Error recording payment:", error);
      alert("Failed to record payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Record Payment
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Payment for {client.name}</DialogTitle>
          <DialogDescription>
            Record a payment received from your client.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseInt(e.target.value) })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select
                value={formData.method}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    method: value as typeof formData.method,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="venmo">Venmo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Payment Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="What was this payment for?"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Recording..." : "Record Payment"}
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
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Client
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete Client</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {client.name}? This action cannot be
            undone and will remove all associated sessions and data.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Client"}
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Total
                </CardTitle>
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-2 sm:pt-6">
                <div className="text-xl sm:text-2xl font-bold">
                  {clients.length}
                </div>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Total Clients
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
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                        <AvatarImage src={client.avatar} />
                        <AvatarFallback className="text-sm sm:text-lg font-semibold">
                          {client.name
                            .split(" ")
                            .map((n) => n[0])
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
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      <div className="hidden sm:flex items-center gap-2">
                        <SharePortalButton client={client} />
                        <EditClientDialog client={client} />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <div className="sm:hidden">
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share Portal
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Client
                            </DropdownMenuItem>
                          </div>
                          <ScheduleSessionDialog client={client} />
                          <RecordPaymentDialog client={client} />
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
                  <AppliedRecommendations clientId={client.id} />
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
