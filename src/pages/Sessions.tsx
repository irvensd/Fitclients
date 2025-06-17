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
} from "lucide-react";
import { Session, SessionRecap } from "@/lib/types";
import { SessionRecapForm } from "@/components/SessionRecapForm";
import { SessionRecapViewer } from "@/components/SessionRecapViewer";

// Mock data for sessions
const mockSessions: Session[] = [
  {
    id: "1",
    clientId: "1",
    date: "2024-03-15",
    startTime: "09:00",
    endTime: "10:00",
    type: "personal-training",
    status: "completed",
    notes: "Great session, client showed improvement in form",
    cost: 75,
  },
  {
    id: "2",
    clientId: "2",
    date: "2024-03-15",
    startTime: "10:30",
    endTime: "11:30",
    type: "assessment",
    status: "completed",
    notes: "Initial fitness assessment completed",
    cost: 50,
  },
  {
    id: "3",
    clientId: "3",
    date: "2024-03-15",
    startTime: "14:00",
    endTime: "15:00",
    type: "personal-training",
    status: "scheduled",
    cost: 75,
  },
  {
    id: "4",
    clientId: "4",
    date: "2024-03-15",
    startTime: "15:30",
    endTime: "16:30",
    type: "consultation",
    status: "scheduled",
    cost: 60,
  },
  {
    id: "5",
    clientId: "1",
    date: "2024-03-16",
    startTime: "09:00",
    endTime: "10:00",
    type: "personal-training",
    status: "cancelled",
    notes: "Client cancelled due to illness",
    cost: 75,
  },
  {
    id: "6",
    clientId: "1",
    date: "2024-03-22",
    startTime: "10:00",
    endTime: "11:00",
    type: "personal-training",
    status: "cancelled",
    notes: "Client cancelled via portal: Schedule conflict - have to work late",
    cost: 75,
    cancelledBy: "client",
    cancelledAt: "2024-03-17T10:30:00Z",
  },
];

const clients = [
  { id: "1", name: "Sarah Johnson" },
  { id: "2", name: "Mike Chen" },
  { id: "3", name: "Emily Davis" },
  { id: "4", name: "James Wilson" },
];

const getClientName = (clientId: string) => {
  return clients.find((c) => c.id === clientId)?.name || "Unknown Client";
};

const getStatusColor = (status: Session["status"]) => {
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

const getStatusIcon = (status: Session["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4" />;
    case "scheduled":
      return <Clock className="h-4 w-4" />;
    case "cancelled":
      return <XCircle className="h-4 w-4" />;
    case "no-show":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const ScheduleSessionDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select>
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
              <Select>
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
              <Input id="date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input id="start-time" type="time" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input id="end-time" type="time" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Cost ($)</Label>
              <Input id="cost" type="number" placeholder="75" />
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
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Schedule Session</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EditSessionDialog = ({ session }: { session: Session }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: session.date,
    startTime: session.startTime,
    endTime: session.endTime,
    type: session.type,
    cost: session.cost.toString(),
    notes: session.notes || "",
    status: session.status,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating session:", formData);
    alert(`Session updated successfully!`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Session</DialogTitle>
          <DialogDescription>
            Update session details for {getClientName(session.clientId)}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Session Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
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
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-start">Start Time</Label>
                <Input
                  id="edit-start"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end">End Time</Label>
                <Input
                  id="edit-end"
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
              <Label htmlFor="edit-cost">Cost ($)</Label>
              <Input
                id="edit-cost"
                type="number"
                value={formData.cost}
                onChange={(e) =>
                  setFormData({ ...formData, cost: e.target.value })
                }
                required
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
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Session</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Sessions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [recaps, setRecaps] = useState<SessionRecap[]>([]);

  const handleRecapGenerated = (recap: SessionRecap) => {
    setRecaps([...recaps, recap]);
    // Update session to include recap
    setSessions(
      sessions.map((session) =>
        session.id === recap.sessionId ? { ...session, recap } : session,
      ),
    );
  };

  const handleRecapUpdated = (updatedRecap: SessionRecap) => {
    setRecaps(
      recaps.map((recap) =>
        recap.id === updatedRecap.id ? updatedRecap : recap,
      ),
    );
  };

  const filteredSessions = sessions.filter((session) => {
    const clientName = getClientName(session.clientId).toLowerCase();
    const matchesSearch = clientName.includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || session.status === statusFilter;

    let matchesDate = true;
    if (dateFilter === "today") {
      matchesDate = session.date === "2024-03-15";
    } else if (dateFilter === "week") {
      // This week logic would be more complex in real app
      matchesDate = true;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const todaySessions = sessions.filter((s) => s.date === "2024-03-15");
  const upcomingSessions = sessions.filter((s) => s.status === "scheduled");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sessions</h1>
          <p className="text-muted-foreground">
            Schedule and manage your training sessions with clients.
          </p>
        </div>
        <div className="flex gap-2">
          <ScheduleSessionDialog />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{todaySessions.length}</div>
            <p className="text-sm text-muted-foreground">Today's Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{upcomingSessions.length}</div>
            <p className="text-sm text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {sessions.filter((s) => s.status === "completed").length}
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              $
              {sessions
                .filter((s) => s.status === "completed")
                .reduce((sum, s) => sum + s.cost, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Revenue</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Session List</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

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

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(session.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {session.startTime} - {session.endTime}
                        </span>
                      </div>
                      <div className="text-sm font-medium">${session.cost}</div>
                      <EditSessionDialog session={session} />
                    </div>
                  </div>

                  {session.notes && (
                    <div
                      className={`mt-4 p-3 rounded-lg ${
                        session.status === "cancelled" &&
                        session.cancelledBy === "client"
                          ? "bg-red-50 border border-red-200"
                          : "bg-muted"
                      }`}
                    >
                      <p
                        className={`text-sm ${
                          session.status === "cancelled" &&
                          session.cancelledBy === "client"
                            ? "text-red-800"
                            : ""
                        }`}
                      >
                        {session.cancelledBy === "client" && (
                          <span className="font-medium">
                            🔔 Client Cancellation:{" "}
                          </span>
                        )}
                        {session.notes}
                      </p>
                      {session.cancelledAt &&
                        session.cancelledBy === "client" && (
                          <p className="text-xs text-red-600 mt-1">
                            Cancelled:{" "}
                            {new Date(session.cancelledAt).toLocaleString()}
                          </p>
                        )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>
                Visual calendar showing all scheduled sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <div
                      key={day}
                      className="p-3 text-center font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, i) => {
                  const dayNumber = i - 10; // Approximate calendar layout
                  const isToday = dayNumber === 15;
                  const hasSessions =
                    dayNumber === 15 || dayNumber === 16 || dayNumber === 17;

                  return (
                    <div
                      key={i}
                      className={`p-3 min-h-[80px] border rounded-lg ${
                        isToday
                          ? "bg-primary/10 border-primary"
                          : "border-border"
                      } ${dayNumber <= 0 || dayNumber > 31 ? "bg-muted" : ""}`}
                    >
                      {dayNumber > 0 && dayNumber <= 31 && (
                        <>
                          <div className="font-medium mb-1">{dayNumber}</div>
                          {hasSessions && (
                            <div className="space-y-1">
                              {dayNumber === 15 && (
                                <>
                                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    9:00 Sarah
                                  </div>
                                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    2:00 Emily
                                  </div>
                                </>
                              )}
                              {dayNumber === 16 && (
                                <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                  9:00 Sarah (C)
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sessions;
