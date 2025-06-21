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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  FileText,
  MoreVertical,
  Play,
  Square,
  Edit,
  Trash2,
} from "lucide-react";
import { Session, SessionRecap } from "@/lib/types";
import { SessionRecapForm } from "@/components/SessionRecapForm";
import { SessionRecapViewer } from "@/components/SessionRecapViewer";
import { SessionCalendar } from "@/components/SessionCalendar";
import { useData } from "@/contexts/DataContext";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/contexts/AuthContext";

// Complete Session Dialog
const CompleteSessionDialog = ({
  session,
  open,
  onOpenChange,
  onComplete,
}: {
  session: Session | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (session: Session, notes?: string) => void;
}) => {
  const { getClientName } = useData();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");

  const handleComplete = async () => {
    if (!session) return;
    setLoading(true);
    try {
      await onComplete(session, notes);
      onOpenChange(false);
      setNotes("");
    } catch (error) {
      console.error("Error completing session:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Complete Session
          </DialogTitle>
          <DialogDescription>
            Mark this session as completed and add any final notes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium">{getClientName(session.clientId)}</h4>
            <p className="text-sm text-muted-foreground">
              {session.type.replace("-", " ").charAt(0).toUpperCase() +
                session.type.replace("-", " ").slice(1)}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(session.date).toLocaleDateString()} at{" "}
              {session.startTime}
            </p>
            <p className="text-sm font-medium">${session.cost}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="completion-notes">Session Notes (Optional)</Label>
            <Textarea
              id="completion-notes"
              placeholder="Add any notes about how the session went, client progress, or next steps..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>This will:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Mark the session as completed</li>
              <li>Update the session status</li>
              <li>Add completion timestamp</li>
              <li>Allow for session recap creation</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleComplete} disabled={loading}>
            {loading ? "Completing..." : "Complete Session"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Cancel Session Dialog
const CancelSessionDialog = ({
  session,
  open,
  onOpenChange,
  onCancel,
}: {
  session: Session | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: (session: Session, reason: string) => void;
}) => {
  const { getClientName } = useData();
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  const handleCancel = async () => {
    if (!session) return;
    setLoading(true);
    try {
      await onCancel(session, reason);
      onOpenChange(false);
      setReason("");
    } catch (error) {
      console.error("Error cancelling session:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-orange-600" />
            Cancel Session
          </DialogTitle>
          <DialogDescription>
            Cancel this session and provide a reason for the cancellation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium">{getClientName(session.clientId)}</h4>
            <p className="text-sm text-muted-foreground">
              {session.type.replace("-", " ").charAt(0).toUpperCase() +
                session.type.replace("-", " ").slice(1)}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(session.date).toLocaleDateString()} at{" "}
              {session.startTime}
            </p>
            <p className="text-sm font-medium">${session.cost}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cancellation-reason">Cancellation Reason</Label>
            <Textarea
              id="cancellation-reason"
              placeholder="Why is this session being cancelled? (e.g., client request, scheduling conflict, illness, etc.)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>This will:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Mark the session as cancelled</li>
              <li>Record the cancellation reason</li>
              <li>Add cancellation timestamp</li>
              <li>Keep the session for record keeping</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keep Session
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={loading || !reason.trim()}
          >
            {loading ? "Cancelling..." : "Cancel Session"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Delete Session Dialog
const DeleteSessionDialog = ({
  session,
  open,
  onOpenChange,
  onDelete,
}: {
  session: Session | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (session: Session) => void;
}) => {
  const { getClientName } = useData();
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    if (!session) return;
    setLoading(true);
    try {
      await onDelete(session);
      onOpenChange(false);
      setConfirmText("");
    } catch (error) {
      console.error("Error deleting session:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  const isConfirmed = confirmText.toLowerCase() === "delete";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Session
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <h4 className="font-medium">{getClientName(session.clientId)}</h4>
            <p className="text-sm text-muted-foreground">
              {session.type.replace("-", " ").charAt(0).toUpperCase() +
                session.type.replace("-", " ").slice(1)}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(session.date).toLocaleDateString()} at{" "}
              {session.startTime}
            </p>
            <p className="text-sm font-medium">${session.cost}</p>
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
              <li>Remove the session from all records</li>
              <li>Delete any associated session recaps</li>
              <li>Remove from client history</li>
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
            {loading ? "Deleting..." : "Delete Session"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "scheduled":
      return <Clock className="h-4 w-4 text-blue-600" />;
    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "no-show":
      return <AlertCircle className="h-4 w-4 text-orange-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "scheduled":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "no-show":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const ScheduleSessionDialog = ({
  isOpen,
  onOpenChange,
  sessionToEdit,
  onSessionScheduled,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sessionToEdit: Session | null;
  onSessionScheduled: () => void;
}) => {
  const { clients, addSession, updateSession } = useData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "",
    cost: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addSession({
        clientId: formData.clientId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        type: formData.type as
          | "personal-training"
          | "consultation"
          | "assessment",
        status: "scheduled",
        cost: parseFloat(formData.cost),
        notes: formData.notes,
      });

      // Reset form and close dialog
      setFormData({
        clientId: "",
        date: "",
        startTime: "",
        endTime: "",
        type: "",
        cost: "",
        notes: "",
      });
      onOpenChange(false);
      onSessionScheduled();
    } catch (error) {
      console.error("Error adding session:", error);
      alert("Failed to schedule session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule New Session</DialogTitle>
          <DialogDescription>
            Create a new training session with a client
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, clientId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Session Type</Label>
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
            </div>
            <div className="grid grid-cols-3 gap-4">
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
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  placeholder="75"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Gym, Home, Park..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
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

const Sessions = () => {
  const {
    sessions,
    loading,
    getClientName,
    addSession,
    updateSession,
    deleteSession,
  } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const [sessionToComplete, setSessionToComplete] = useState<Session | null>(
    null,
  );
  const [sessionToCancel, setSessionToCancel] = useState<Session | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);
  const [sessionToRecap, setSessionToRecap] = useState<Session | null>(null);
  const [sessionToEdit, setSessionToEdit] = useState<Session | null>(null);
  const [isScheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  const filteredSessions = sessions
    .filter((session) => {
      const clientName = getClientName(session.clientId);
      const matchesSearch = clientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || session.status === statusFilter;

      let matchesDate = true;
      if (dateFilter !== "all") {
        const sessionDate = new Date(session.date);
        const today = new Date();

        switch (dateFilter) {
          case "today":
            matchesDate = sessionDate.toDateString() === today.toDateString();
            break;
          case "week":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = sessionDate >= weekAgo && sessionDate <= today;
            break;
          case "month":
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = sessionDate >= monthAgo && sessionDate <= today;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleCompleteSession = (session: Session) => {
    setSessionToComplete(session);
  };
  const handleCancelSession = (session: Session) => {
    setSessionToCancel(session);
  };
  const handleDeleteSession = (session: Session) => {
    setSessionToDelete(session);
  };

  const onCompleteSession = async (session: Session, notes?: string) => {
    try {
      await updateSession(session.id, {
        status: "completed",
        notes,
      });
    } catch (error) {
      console.error("Error completing session:", error);
    }
  };
  const onCancelSession = async (session: Session, reason: string) => {
    try {
      await updateSession(session.id, {
        status: "cancelled",
        notes: reason,
      });
    } catch (error) {
      console.error("Error cancelling session:", error);
    }
  };
  const onDeleteSession = async (session: Session) => {
    try {
      await deleteSession(session.id);
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const handleScheduleSession = () => {
    setSessionToEdit(null);
    setScheduleDialogOpen(true);
  };

  const handleEditSession = (session: Session) => {
    setSessionToEdit(session);
    setScheduleDialogOpen(true);
  };
  
  if (user?.email !== "trainer@demo.com" && sessions.length === 0 && !loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sessions</h1>
            <p className="text-muted-foreground">
              Manage and track all your training sessions.
            </p>
          </div>
          <ScheduleSessionDialog
            isOpen={isScheduleDialogOpen}
            onOpenChange={setScheduleDialogOpen}
            sessionToEdit={sessionToEdit}
            onSessionScheduled={() => setScheduleDialogOpen(false)}
          />
        </div>

        <div className="space-y-6">
          {/* Welcome Message */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to Your Session Hub!</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  This is your command center for managing all training sessions. Schedule, track, and manage your client sessions all in one place. 
                  Get started by scheduling your first session below.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Main Empty State */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Schedule Session Section */}
            <Card className="lg:col-span-2 border-2 border-dashed border-muted-foreground/25 bg-muted/5">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 mb-6">
                  <Plus className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Schedule Your First Session</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Start organizing your training schedule! Create your first session to begin 
                  tracking client appointments and building your fitness business.
                </p>
                <ScheduleSessionDialog
                  isOpen={isScheduleDialogOpen}
                  onOpenChange={setScheduleDialogOpen}
                  sessionToEdit={sessionToEdit}
                  onSessionScheduled={() => setScheduleDialogOpen(false)}
                />
              </CardContent>
            </Card>

            {/* Session Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Session Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Smart Scheduling</h4>
                    <p className="text-xs text-muted-foreground">Calendar integration and time management</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Session Tracking</h4>
                    <p className="text-xs text-muted-foreground">Track completed, scheduled, and cancelled sessions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Session Recaps</h4>
                    <p className="text-xs text-muted-foreground">Add notes and track progress after each session</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Session Type Preview Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Personal Training</h4>
                <p className="text-sm text-muted-foreground">
                  One-on-one focused training sessions with personalized programs
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Assessments</h4>
                <p className="text-sm text-muted-foreground">
                  Initial evaluations and progress check-ins with clients
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Consultations</h4>
                <p className="text-sm text-muted-foreground">
                  Discovery sessions and program planning meetings
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sessions</h1>
          <p className="text-muted-foreground">
            Manage and track all your training sessions.
          </p>
        </div>
        <div className="flex gap-2">
          <ScheduleSessionDialog
            isOpen={isScheduleDialogOpen}
            onOpenChange={setScheduleDialogOpen}
            sessionToEdit={sessionToEdit}
            onSessionScheduled={() => setScheduleDialogOpen(false)}
          />
        </div>
      </div>

      {/* Empty State */}
      {sessions.length === 0 && (
        <div className="space-y-6">
          {/* Welcome Message */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to Your Session Hub!</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  This is your command center for managing all training sessions. Schedule, track, and manage your client sessions all in one place. 
                  Get started by scheduling your first session below.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Main Empty State */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Schedule Session Section */}
            <Card className="lg:col-span-2 border-2 border-dashed border-muted-foreground/25 bg-muted/5">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 mb-6">
                  <Plus className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Schedule Your First Session</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Start organizing your training schedule! Create your first session to begin 
                  tracking client appointments and building your fitness business.
                </p>
                <ScheduleSessionDialog
                  isOpen={isScheduleDialogOpen}
                  onOpenChange={setScheduleDialogOpen}
                  sessionToEdit={sessionToEdit}
                  onSessionScheduled={() => setScheduleDialogOpen(false)}
                />
              </CardContent>
            </Card>

            {/* Session Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Session Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Smart Scheduling</h4>
                    <p className="text-xs text-muted-foreground">Calendar integration and time management</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Session Tracking</h4>
                    <p className="text-xs text-muted-foreground">Track completed, scheduled, and cancelled sessions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Session Recaps</h4>
                    <p className="text-xs text-muted-foreground">Add notes and track progress after each session</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Session Type Preview Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Personal Training</h4>
                <p className="text-sm text-muted-foreground">
                  One-on-one focused training sessions with personalized programs
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Assessments</h4>
                <p className="text-sm text-muted-foreground">
                  Initial evaluations and progress check-ins with clients
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Consultations</h4>
                <p className="text-sm text-muted-foreground">
                  Discovery sessions and program planning meetings
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {sessions.length > 0 && (
        <Tabs defaultValue="list" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="list">Session List</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="schedule">Schedule New</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search sessions by client name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[160px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="no-show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full sm:w-[160px]">
                      <SelectValue placeholder="All Dates" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Sessions List */}
            <div className="space-y-4">
              {filteredSessions.map((session) => (
                <Card
                  key={session.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(session.status)}
                          <Badge className={getStatusColor(session.status)}>
                            {session.status}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {getClientName(session.clientId)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {session.type
                              .replace("-", " ")
                              .charAt(0)
                              .toUpperCase() +
                              session.type.replace("-", " ").slice(1)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">
                            {new Date(session.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {session.startTime} - {session.endTime}
                          </p>
                          <p className="text-sm font-medium">${session.cost}</p>
                        </div>

                        {/* Action Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {session.status === "scheduled" && (
                              <DropdownMenuItem
                                onClick={() => handleCompleteSession(session)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark Complete
                              </DropdownMenuItem>
                            )}
                            {session.status === "scheduled" && (
                              <DropdownMenuItem
                                onClick={() => handleCancelSession(session)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel Session
                              </DropdownMenuItem>
                            )}
                            {session.status === "completed" && (
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Add Session Recap
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteSession(session)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Session
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    {session.notes && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          {session.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredSessions.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">
                    No sessions found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <SessionCalendar />
          </TabsContent>

          {/* Schedule New Session Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <ScheduleSessionDialog
              isOpen={isScheduleDialogOpen}
              onOpenChange={setScheduleDialogOpen}
              sessionToEdit={sessionToEdit}
              onSessionScheduled={() => {
                setScheduleDialogOpen(false);
                setActiveTab("list");
              }}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Dialog Components */}
      <CompleteSessionDialog
        session={sessionToComplete}
        open={!!sessionToComplete}
        onOpenChange={() => setSessionToComplete(null)}
        onComplete={onCompleteSession}
      />

      <CancelSessionDialog
        session={sessionToCancel}
        open={!!sessionToCancel}
        onOpenChange={() => setSessionToCancel(null)}
        onCancel={onCancelSession}
      />

      <DeleteSessionDialog
        session={sessionToDelete}
        open={!!sessionToDelete}
        onOpenChange={() => setSessionToDelete(null)}
        onDelete={onDeleteSession}
      />
    </div>
  );
};

export default Sessions;
