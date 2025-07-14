import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Users,
  Target,
  UserPlus,
  AlertTriangle,
  ExternalLink,
  Share2,
  Eye,
  Mail,
  Copy,
  ChevronDown,
  Trash2,
  Edit,
  Save,
  X,
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  Archive,
  RotateCcw,
} from "lucide-react";
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
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AddClientDialog = ({ isOpen, onOpenChange }: { isOpen?: boolean; onOpenChange?: (open: boolean) => void; }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addClient, addProgressEntry, clients, getActiveClients } = useData();
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
    initialWeight: "",
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
      // Add the client first
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
        dateJoined: new Date().toISOString().split("T")[0],
      });

      // If initial weight is provided, create a progress entry
      if (formData.initialWeight && parseFloat(formData.initialWeight) > 0) {
        try {
          const progressData = {
            clientId: newClient.id,
            date: new Date().toISOString().split("T")[0],
            weight: parseFloat(formData.initialWeight),
            notes: "Initial weight recorded during client registration",
          };

          await addProgressEntry(progressData);
          
          toast({
            title: "Client added with initial weight",
            description: `${formData.name} has been added with initial weight of ${formData.initialWeight} lbs.`,
          });
        } catch (progressError) {
          console.error("Error adding initial progress:", progressError);
          // Still show success for client creation, but warn about progress
          toast({
            title: "Client added",
            description: `${formData.name} has been added, but there was an issue recording the initial weight.`,
          });
        }
      } else {
        toast({
          title: "Client added",
          description: `${formData.name} has been added successfully.`,
        });
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        fitnessLevel: "",
        goals: "",
        notes: "",
        initialWeight: "",
      });
      setOpen(false);
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

  const dialogOpen = isOpen !== undefined ? isOpen : open;
  const dialogOnOpenChange = onOpenChange || handleDialogOpen;

  return (
    <Dialog open={dialogOpen} onOpenChange={dialogOnOpenChange}>
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
            <div className="space-y-2">
              <Label htmlFor="initial-weight">Initial Weight (lbs) - Optional</Label>
              <Input
                id="initial-weight"
                type="number"
                step="0.1"
                placeholder="150.0"
                value={formData.initialWeight}
                onChange={(e) =>
                  setFormData({ ...formData, initialWeight: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Adding initial weight will automatically create the first progress entry, making it easier to track progress from day one.
              </p>
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

// Delete Client Confirmation Dialog
const DeleteClientDialog = ({
  client,
  open,
  onOpenChange,
  onDelete,
}: {
  client: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (clientId: string) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    if (!client) return;
    setLoading(true);
    try {
      await onDelete(client.id);
      onOpenChange(false);
      setConfirmText("");
    } catch (error) {
      console.error("Error deleting client:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!client) return null;

  const isConfirmed = confirmText.toLowerCase() === "delete";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Client
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the client and all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={client.avatar} />
                <AvatarFallback className="text-sm font-semibold">
                  {client.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{client.name}</h4>
                <p className="text-sm text-muted-foreground">{client.email}</p>
                <p className="text-sm text-muted-foreground">
                  {client.fitnessLevel.charAt(0).toUpperCase() + client.fitnessLevel.slice(1)} • 
                  Joined {client.dateJoined}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delete-confirmation">
              Type "DELETE" to confirm deletion
            </Label>
            <Input
              id="delete-confirmation"
              placeholder="DELETE"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
          </div>

          <div className="text-sm text-destructive">
            <p>⚠️ Warning: This will permanently:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Remove the client from your account</li>
              <li>Delete all client sessions and history</li>
              <li>Remove access to their client portal</li>
              <li>Delete all associated payments and invoices</li>
              <li>Cannot be recovered</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading || !isConfirmed}
          >
            {loading ? "Deleting..." : "Delete Client"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Delete Progress Entry Confirmation Dialog
const DeleteProgressEntryDialog = ({
  entry,
  open,
  onOpenChange,
  onDelete,
}: {
  entry: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (entryId: string) => void;
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!entry) return;
    setLoading(true);
    try {
      await onDelete(entry.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting progress entry:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Progress Entry
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this progress entry.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{new Date(entry.date).toLocaleDateString()}</span>
            </div>
            
            <div className="text-sm space-y-1">
              {entry.weight && <div>Weight: {entry.weight} lbs</div>}
              {entry.bodyFat && <div>Body Fat: {entry.bodyFat}%</div>}
              {entry.measurements && Object.values(entry.measurements).some(val => val !== undefined) && (
                <div>Measurements: {Object.entries(entry.measurements)
                  .filter(([_, value]) => value !== undefined)
                  .map(([key, value]) => `${key}: ${value}"`)
                  .join(", ")}</div>
              )}
              {entry.notes && <div className="italic">"{entry.notes}"</div>}
            </div>
          </div>

          <div className="text-sm text-destructive">
            <p>⚠️ This will permanently remove this progress entry from the client's history.</p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Entry"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Client Details Modal
const ClientDetailsModal = ({
  client,
  open,
  onOpenChange,
  onClientUpdated,
}: {
  client: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientUpdated: () => void;
}) => {
  const { updateClient, addProgressEntry, getClientProgressEntries, deleteProgressEntry, sessions } = useData();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progressEntryToDelete, setProgressEntryToDelete] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    fitnessLevel: "beginner" as "beginner" | "intermediate" | "advanced",
    goals: "",
    notes: "",
  });
  const [progressData, setProgressData] = useState({
    weight: "",
    height: "",
    bodyFat: "",
    chest: "",
    waist: "",
    hips: "",
    arms: "",
    thighs: "",
    progressNotes: "",
  });

  // Initialize form data when client changes
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        email: client.email || "",
        phone: client.phone || "",
        fitnessLevel: client.fitnessLevel || "beginner",
        goals: client.goals || "",
        notes: client.notes || "",
      });
    }
  }, [client]);

  const handleSaveClient = async () => {
    if (!client) return;
    setLoading(true);
    try {
      await updateClient(client.id, formData);
      setIsEditing(false);
      onClientUpdated();
      toast({
        title: "Client updated",
        description: "Client information has been saved successfully.",
      });
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        title: "Error",
        description: "Failed to update client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProgress = async () => {
    if (!client) return;
    
    // Check if any progress data is actually provided
    const hasWeight = progressData.weight.trim();
    const hasBodyFat = progressData.bodyFat.trim();
    const hasNotes = progressData.progressNotes.trim();
    const hasMeasurements = progressData.chest.trim() || progressData.waist.trim() || 
                           progressData.hips.trim() || progressData.arms.trim() || 
                           progressData.thighs.trim();

    if (!hasWeight && !hasBodyFat && !hasNotes && !hasMeasurements) {
      toast({
        title: "No progress data",
        description: "Please enter at least one measurement, weight, body fat percentage, or note before recording progress.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create progress entry - only include fields that have values
      const progressEntry: any = {
        clientId: client.id,
        date: new Date().toISOString(),
      };

      // Only add fields that have values
      if (progressData.weight) {
        progressEntry.weight = parseFloat(progressData.weight);
      }
      if (progressData.bodyFat) {
        progressEntry.bodyFat = parseFloat(progressData.bodyFat);
      }

      // Handle measurements - only include if any measurement is provided
      const measurements: any = {};
      if (progressData.chest) measurements.chest = parseFloat(progressData.chest);
      if (progressData.waist) measurements.waist = parseFloat(progressData.waist);
      if (progressData.hips) measurements.hips = parseFloat(progressData.hips);
      if (progressData.arms) measurements.arms = parseFloat(progressData.arms);
      if (progressData.thighs) measurements.thighs = parseFloat(progressData.thighs);
      
      if (Object.keys(measurements).length > 0) {
        progressEntry.measurements = measurements;
      }

      // Only add notes if provided
      if (progressData.progressNotes.trim()) {
        progressEntry.notes = progressData.progressNotes.trim();
      }

      await addProgressEntry(progressEntry);
      
      toast({
        title: "Progress recorded",
        description: "Client progress has been saved successfully.",
      });
      
      // Clear the form
      setProgressData({
        weight: "",
        height: "",
        bodyFat: "",
        chest: "",
        waist: "",
        hips: "",
        arms: "",
        thighs: "",
        progressNotes: "",
      });
    } catch (error) {
      console.error("Error saving progress:", error);
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProgressEntry = async (entryId: string) => {
    try {
      await deleteProgressEntry(entryId);
      toast({
        title: "Progress entry deleted",
        description: "The progress entry has been removed successfully.",
      });
    } catch (error) {
      console.error("Error deleting progress entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete progress entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={client.avatar} />
              <AvatarFallback className="text-lg font-semibold">
                {client.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{client.name}</h3>
              <p className="text-sm text-muted-foreground">{client.email}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Client Details</TabsTrigger>
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
            <TabsTrigger value="history">Session History</TabsTrigger>
          </TabsList>

          {/* Client Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold">Client Information</h4>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveClient} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fitness-level">Fitness Level</Label>
                <Select
                  value={formData.fitnessLevel}
                  onValueChange={(value) => setFormData({ ...formData, fitnessLevel: value as "beginner" | "intermediate" | "advanced" })}
                  disabled={!isEditing}
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
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                className="min-h-[80px]"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="min-h-[80px]"
                disabled={!isEditing}
              />
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm">
                <span className="font-medium">Date Joined:</span>
                <p className="text-muted-foreground">{client.dateJoined}</p>
              </div>
            </div>
          </TabsContent>

          {/* Progress Tracking Tab */}
          <TabsContent value="progress" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold">Record New Progress</h4>
              <Badge variant="outline" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date().toLocaleDateString()}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="150"
                  value={progressData.weight}
                  onChange={(e) => setProgressData({ ...progressData, weight: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (inches)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="70"
                  value={progressData.height}
                  onChange={(e) => setProgressData({ ...progressData, height: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body-fat">Body Fat %</Label>
                <Input
                  id="body-fat"
                  type="number"
                  placeholder="15"
                  value={progressData.bodyFat}
                  onChange={(e) => setProgressData({ ...progressData, bodyFat: e.target.value })}
                />
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-3">Body Measurements (inches)</h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chest">Chest</Label>
                  <Input
                    id="chest"
                    type="number"
                    placeholder="40"
                    value={progressData.chest}
                    onChange={(e) => setProgressData({ ...progressData, chest: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waist">Waist</Label>
                  <Input
                    id="waist"
                    type="number"
                    placeholder="32"
                    value={progressData.waist}
                    onChange={(e) => setProgressData({ ...progressData, waist: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hips">Hips</Label>
                  <Input
                    id="hips"
                    type="number"
                    placeholder="36"
                    value={progressData.hips}
                    onChange={(e) => setProgressData({ ...progressData, hips: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arms">Arms</Label>
                  <Input
                    id="arms"
                    type="number"
                    placeholder="14"
                    value={progressData.arms}
                    onChange={(e) => setProgressData({ ...progressData, arms: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thighs">Thighs</Label>
                  <Input
                    id="thighs"
                    type="number"
                    placeholder="22"
                    value={progressData.thighs}
                    onChange={(e) => setProgressData({ ...progressData, thighs: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress-notes">Progress Notes</Label>
              <Textarea
                id="progress-notes"
                placeholder="Any observations, achievements, or notes about this progress entry..."
                value={progressData.progressNotes}
                onChange={(e) => setProgressData({ ...progressData, progressNotes: e.target.value })}
                className="min-h-[80px]"
              />
            </div>

            <Button onClick={handleSaveProgress} disabled={loading} className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              {loading ? "Recording..." : "Record Progress Entry"}
            </Button>

            <div className="pt-4 border-t">
              <h5 className="font-medium mb-3">Progress History</h5>
              {(() => {
                const clientProgressEntries = getClientProgressEntries(client.id)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                
                if (clientProgressEntries.length === 0) {
                  return (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No progress entries yet</p>
                      <p className="text-sm">Record your first progress entry above</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {clientProgressEntries.map((entry) => (
                      <Card key={entry.id} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(entry.date).toLocaleDateString()}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setProgressEntryToDelete(entry)}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          {entry.weight && (
                            <div>
                              <span className="font-medium">Weight:</span>
                              <p className="text-muted-foreground">{entry.weight} lbs</p>
                            </div>
                          )}
                          {entry.bodyFat && (
                            <div>
                              <span className="font-medium">Body Fat:</span>
                              <p className="text-muted-foreground">{entry.bodyFat}%</p>
                            </div>
                          )}
                        </div>

                        {entry.measurements && Object.values(entry.measurements).some(val => val !== undefined) && (
                          <div className="mt-3">
                            <h6 className="font-medium text-sm mb-2">Measurements (inches):</h6>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              {entry.measurements.chest && (
                                <div>Chest: {entry.measurements.chest}"</div>
                              )}
                              {entry.measurements.waist && (
                                <div>Waist: {entry.measurements.waist}"</div>
                              )}
                              {entry.measurements.hips && (
                                <div>Hips: {entry.measurements.hips}"</div>
                              )}
                              {entry.measurements.arms && (
                                <div>Arms: {entry.measurements.arms}"</div>
                              )}
                              {entry.measurements.thighs && (
                                <div>Thighs: {entry.measurements.thighs}"</div>
                              )}
                            </div>
                          </div>
                        )}

                        {entry.notes && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm text-muted-foreground italic">"{entry.notes}"</p>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                );
              })()}
            </div>
          </TabsContent>

          {/* Session History Tab */}
          <TabsContent value="history" className="space-y-4">
            <h4 className="text-lg font-semibold">Session History</h4>
            {(() => {
              const clientSessions = sessions
                .filter(session => session.clientId === client.id)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
              
              const upcomingSessions = clientSessions.filter(session => 
                new Date(session.date) >= new Date() && session.status === 'scheduled'
              );
              
              const pastSessions = clientSessions.filter(session => 
                new Date(session.date) < new Date() || session.status !== 'scheduled'
              );

              if (clientSessions.length === 0) {
                return (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No sessions scheduled yet</p>
                    <p className="text-sm">Sessions with this client will appear here</p>
                  </div>
                );
              }

              return (
                <div className="space-y-6">
                  {/* Session Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{clientSessions.length}</div>
                      <div className="text-xs text-muted-foreground">Total Sessions</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{pastSessions.filter(s => s.status === 'completed').length}</div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{upcomingSessions.length}</div>
                      <div className="text-xs text-muted-foreground">Upcoming</div>
                    </Card>
                  </div>

                  {/* Upcoming Sessions */}
                  {upcomingSessions.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Upcoming Sessions
                      </h5>
                      <div className="space-y-2">
                        {upcomingSessions.map((session) => (
                          <Card key={session.id} className="p-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">{session.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                                <div className="text-sm text-muted-foreground">
                                  {new Date(session.date).toLocaleDateString()} at {session.startTime}
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant="secondary">{session.status}</Badge>
                                <div className="text-sm font-medium">${session.cost}</div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Past Sessions */}
                  <div>
                    <h5 className="font-medium mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Session History ({pastSessions.length})
                    </h5>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {pastSessions.map((session) => (
                        <Card key={session.id} className="p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{session.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(session.date).toLocaleDateString()} at {session.startTime}
                              </div>
                              {session.notes && (
                                <div className="text-xs text-muted-foreground italic mt-1">"{session.notes}"</div>
                              )}
                            </div>
                            <div className="text-right">
                              <Badge variant={session.status === 'completed' ? 'default' : session.status === 'cancelled' ? 'destructive' : 'secondary'}>
                                {session.status}
                              </Badge>
                              <div className="text-sm font-medium">${session.cost}</div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </TabsContent>
        </Tabs>

        {/* Delete Progress Entry Dialog */}
        <DeleteProgressEntryDialog
          entry={progressEntryToDelete}
          open={!!progressEntryToDelete}
          onOpenChange={() => setProgressEntryToDelete(null)}
          onDelete={handleDeleteProgressEntry}
        />
      </DialogContent>
    </Dialog>
  );
};

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fitnessLevelFilter, setFitnessLevelFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const { clients, loading, getActiveClients, getArchivedClients, deleteClient, updateClient, sessions, archiveClients, reactivateClients } = useData();
  const { getCurrentPlan } = useSubscription();
  const { user } = useAuth();
  const [isAddClientDialogOpen, setAddClientDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<any | null>(null);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Helper function to get client session stats - memoized for performance
  const getClientSessionStats = (clientId: string) => {
    const clientSessions = sessions.filter(session => session.clientId === clientId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const pastSessions = clientSessions.filter(session => new Date(session.date) < today);
    const upcomingSessions = clientSessions.filter(session => 
      new Date(session.date) >= today && session.status === 'scheduled'
    );
    
    const lastSession = pastSessions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    const nextSession = upcomingSessions
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    
    return {
      totalSessions: clientSessions.length,
      completedSessions: pastSessions.filter(s => s.status === 'completed').length,
      lastSession,
      nextSession
    };
  };

  // Memoize client stats to prevent unnecessary recalculations
  const clientStatsMap = new Map();
  const getMemoizedClientStats = (clientId: string) => {
    if (!clientStatsMap.has(clientId)) {
      clientStatsMap.set(clientId, getClientSessionStats(clientId));
    }
    return clientStatsMap.get(clientId);
  };

  const currentPlan = getCurrentPlan();
  const activeClients = getActiveClients
    ? getActiveClients()
    : clients.filter((c: any) => !c.status || c.status.isActive !== false);
  const archivedClients = getArchivedClients ? getArchivedClients() : [];
  const currentClientCount = activeClients.length;
  const limitInfo = getClientLimitInfo(currentPlan.id, currentClientCount);

  const filteredActiveClients = activeClients
    .filter((client: any) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFitnessLevel =
        fitnessLevelFilter === "all" ||
        client.fitnessLevel === fitnessLevelFilter;
      return matchesSearch && matchesFitnessLevel;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "dateJoined":
          return new Date(b.dateJoined).getTime() - new Date(a.dateJoined).getTime();
        case "lastSession":
          const statsA = getClientSessionStats(a.id);
          const statsB = getClientSessionStats(b.id);
          const lastA = statsA.lastSession?.date || '1970-01-01';
          const lastB = statsB.lastSession?.date || '1970-01-01';
          return new Date(lastB).getTime() - new Date(lastA).getTime();
        case "totalSessions":
          const totalA = getClientSessionStats(a.id).completedSessions;
          const totalB = getClientSessionStats(b.id).completedSessions;
          return totalB - totalA;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Portal functions
  const openClientPortal = (clientId: string) => {
    // For demo users, always redirect to demo portal
    if (user?.email === 'trainer@demo.com') {
      const portalUrl = `/demo-portal`;
      window.open(portalUrl, "_blank");
      return;
    }
    
    const portalUrl = `/client-portal/${clientId}`;
    window.open(portalUrl, "_blank");
  };

  const shareClientPortal = (client: any) => {
    // For demo users, always use demo portal
    const portalUrl = user?.email === 'trainer@demo.com' 
      ? `${window.location.origin}/demo-portal`
      : `${window.location.origin}/client-portal/${client.id}`;
    
    const subject = "Your Personal Fitness Portal";
    const body = `Hi ${client.name},

I've created a personal fitness portal just for you! You can access it anytime to view:

• Your progress and measurements
• Upcoming training sessions  
• Your personalized workout plan
• Payment information

Access your portal here: ${portalUrl}

This link is secure and personalized just for you. Bookmark it for easy access!

Best regards,
Your Personal Trainer`;

    window.open(
      `mailto:${client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
  };

  const copyPortalLink = async (clientId: string, clientName: string) => {
    try {
          const portalUrl = `${window.location.origin}/client-portal/${clientId}`;
      
      await navigator.clipboard.writeText(portalUrl);
      toast({
        title: "Portal link copied!",
        description: `Portal link for ${clientName} has been copied to clipboard.`,
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      await deleteClient(clientId);
      toast({
        title: "Client deleted",
        description: "Client has been permanently removed from your account.",
      });
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleArchiveClient = async (clientId: string) => {
    try {
      await archiveClients([clientId], "manual");
      toast({
        title: "Client archived",
        description: "Client has been moved to archived status.",
      });
    } catch (error) {
      console.error("Error archiving client:", error);
      toast({
        title: "Error",
        description: "Failed to archive client. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReactivateClient = async (clientId: string) => {
    try {
      await reactivateClients([clientId]);
      toast({
        title: "Client reactivated",
        description: "Client has been moved back to active status.",
      });
    } catch (error) {
      console.error("Error reactivating client:", error);
      toast({
        title: "Error",
        description: "Failed to reactivate client. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show empty state only if not demo user and no clients
  if (user?.email !== "trainer@demo.com" && clients.length === 0 && !loading) {
    return (
      <div className="p-6 space-y-6">
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

        <div className="space-y-6">
          {/* Welcome Message */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to Your Client Hub!</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  This is where you'll manage all your client relationships, track their progress, and grow your fitness business. 
                  Get started by adding your first client below.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Main Empty State */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Add Client Section */}
            <Card className="lg:col-span-2 border-2 border-dashed border-muted-foreground/25 bg-muted/5">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 mb-6">
                  <UserPlus className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Add Your First Client</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Start building your client base! Add your first client to begin
                  tracking their fitness journey and managing their sessions.
                </p>
                <AddClientDialog />
              </CardContent>
            </Card>

            {/* What You Can Do */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  What You Can Do
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Manage Clients</h4>
                    <p className="text-xs text-muted-foreground">Track client info, goals, and progress</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ExternalLink className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Client Portals</h4>
                    <p className="text-xs text-muted-foreground">Give clients access to their own dashboard</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Share2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Share & Communicate</h4>
                    <p className="text-xs text-muted-foreground">Send portal links and stay connected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Track Progress</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor client workouts, measurements, and achievements
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Client Portals</h4>
                <p className="text-sm text-muted-foreground">
                  Provide personalized dashboards for each client
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Smart Insights</h4>
                <p className="text-sm text-muted-foreground">
                  Get AI-powered recommendations and analytics
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* The AddClientDialog needs to be available for the EmptyState action */}
        <AddClientDialog isOpen={isAddClientDialogOpen} onOpenChange={setAddClientDialogOpen} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
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
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="dateJoined">Date Joined</SelectItem>
                    <SelectItem value="lastSession">Last Session</SelectItem>
                    <SelectItem value="totalSessions">Total Sessions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Client List */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-6">
                Active Clients ({filteredActiveClients.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredActiveClients.map((client: any) => {
                  const stats = getMemoizedClientStats(client.id);
                  const hasUpcomingSession = stats.nextSession;
                  
                  return (
                    <Card
                      key={client.id}
                      className={`group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm ${
                        hasUpcomingSession 
                          ? 'ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10' 
                          : 'hover:ring-2 hover:ring-primary/20'
                      }`}
                      onClick={() => setSelectedClient(client)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedClient(client);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`View details for ${client.name}`}
                    >
                      <CardContent className="p-6 relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl -translate-y-16 translate-x-16" />
                        
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4 relative z-10">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-12 w-12 ring-2 ring-primary/10 ring-offset-2">
                                <AvatarImage src={client.avatar} />
                                <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-primary/10 to-primary/5">
                                  {client.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {hasUpcomingSession && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                {client.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant={
                                    client.fitnessLevel === "beginner"
                                      ? "secondary"
                                      : client.fitnessLevel === "intermediate"
                                        ? "default"
                                        : "outline"
                                  }
                                  className="h-5 text-xs font-medium"
                                >
                                  {client.fitnessLevel.charAt(0).toUpperCase() +
                                    client.fitnessLevel.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          {/* Quick Actions Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                                                      <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => shareClientPortal(client)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Email Client
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyPortalLink(client.id, client.name)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Portal Link
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleArchiveClient(client.id)}
                              className="text-orange-600 focus:text-orange-600"
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Archive Client
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setClientToDelete(client)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Client
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Goals */}
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {client.goals || "No specific goals set yet"}
                          </p>
                        </div>

                        {/* Key Stats */}
                        <div className="flex items-center justify-between mb-4 p-3 bg-muted/30 rounded-lg border border-border/50">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-foreground/70" />
                              <div>
                                <div className="font-semibold text-foreground">
                                  {stats.completedSessions}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Sessions
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">
                              Joined {client.dateJoined ? new Date(client.dateJoined).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                            </div>
                          </div>
                        </div>

                        {/* Session Info */}
                        {(stats.lastSession || stats.nextSession) && (
                          <div className="space-y-2 mb-4">
                            {stats.nextSession && (
                              <div className="flex items-center gap-2 text-xs">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                <span className="text-blue-600 dark:text-blue-400 font-medium">
                                  Next: {new Date(stats.nextSession.date).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {stats.lastSession && (
                              <div className="flex items-center gap-2 text-xs">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  Last: {new Date(stats.lastSession.date).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2 border-t border-border/50">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/sessions');
                            }}
                            className="flex-1 h-8 text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Schedule
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openClientPortal(client.id);
                            }}
                            className="flex-1 h-8 text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Portal
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
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

            {/* Archived Clients Section */}
            {archivedClients.length > 0 && (
              <div className="mt-12">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Archive className="h-5 w-5 text-muted-foreground" />
                  Archived Clients ({archivedClients.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {archivedClients.map((client: any) => {
                    const stats = getMemoizedClientStats(client.id);
                    
                    return (
                      <Card
                        key={client.id}
                        className="group hover:shadow-lg hover:shadow-muted/5 transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm opacity-75 hover:opacity-90"
                        onClick={() => setSelectedClient(client)}
                      >
                        <CardContent className="p-6 relative overflow-hidden">
                          {/* Archived Badge */}
                          <div className="absolute top-3 right-3 z-10">
                            <Badge variant="secondary" className="text-xs">
                              <Archive className="h-3 w-3 mr-1" />
                              Archived
                            </Badge>
                          </div>
                          
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-12 w-12 ring-2 ring-muted/20 ring-offset-2 opacity-75">
                                  <AvatarImage src={client.avatar} />
                                  <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-muted/20 to-muted/10">
                                    {client.name
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <div>
                                <h3 className="font-bold text-lg text-muted-foreground group-hover:text-foreground transition-colors">
                                  {client.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    variant="outline"
                                    className="h-5 text-xs font-medium opacity-60"
                                  >
                                    {client.fitnessLevel.charAt(0).toUpperCase() +
                                      client.fitnessLevel.slice(1)}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            {/* Quick Actions Dropdown */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem 
                                  onClick={() => handleReactivateClient(client.id)}
                                  className="text-green-600 focus:text-green-600"
                                >
                                  <RotateCcw className="h-4 w-4 mr-2" />
                                  Reactivate Client
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => copyPortalLink(client.id, client.name)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Portal Link
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => setClientToDelete(client)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Client
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Goals */}
                          <div className="mb-4">
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed opacity-75">
                              {client.goals || "No specific goals set yet"}
                            </p>
                          </div>

                          {/* Key Stats */}
                          <div className="flex items-center justify-between mb-4 p-3 bg-muted/20 rounded-lg border border-border/30">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-muted-foreground/70" />
                                <div>
                                  <div className="font-semibold text-muted-foreground">
                                    {stats.completedSessions}
                                  </div>
                                  <div className="text-xs text-muted-foreground/70">
                                    Sessions
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground/70">
                                Archived {client.status?.archivedAt ? new Date(client.status.archivedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                              </div>
                            </div>
                          </div>

                          {/* Archive Info */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground/70 mb-4">
                            <Archive className="h-3 w-3" />
                            <span>
                              Reason: {client.status?.archiveReason === 'manual' ? 'Manually archived' : 'Plan downgrade'}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2 border-t border-border/30">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReactivateClient(client.id);
                              }}
                              className="flex-1 h-8 text-xs font-medium hover:bg-green-500 hover:text-white transition-colors"
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Reactivate
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openClientPortal(client.id);
                              }}
                              className="flex-1 h-8 text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors opacity-75"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View Portal
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Client Details Modal */}
      <ClientDetailsModal
        client={selectedClient}
        open={!!selectedClient}
        onOpenChange={() => setSelectedClient(null)}
        onClientUpdated={() => {
          // Trigger a refresh if needed
          setSelectedClient(null);
        }}
      />

      {/* Delete Client Dialog */}
      <DeleteClientDialog
        client={clientToDelete}
        open={!!clientToDelete}
        onOpenChange={() => setClientToDelete(null)}
        onDelete={handleDeleteClient}
      />
    </div>
  );
};

export default Clients;
