import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Plus,
  MoreVertical,
  Edit,
  CheckCircle,
  Trash2,
  User,
  Save,
  X,
  CalendarDays,
  List,
  Clock,
  DollarSign,
  ClipboardList,
} from "lucide-react";
import { SessionCalendar } from "@/components/SessionCalendar";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { formatTime, cn } from "@/lib/utils";

// Add Session Dialog Component
const AddSessionDialog = ({ onSessionAdded }: { onSessionAdded: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "",
    cost: "",
    notes: "",
  });

  // Load clients when dialog opens
  useEffect(() => {
    if (isOpen && user?.uid) {
      const loadClients = async () => {
        try {
          const clientsSnapshot = await getDocs(collection(db, "users", user.uid, "clients"));
          const clientsData = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setClients(clientsData);
        } catch (error) {
          console.error("Error loading clients:", error);
        }
      };
      loadClients();
    }
  }, [isOpen, user?.uid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !user?.uid) return;
    
    setLoading(true);
    
    try {
      const sessionsRef = collection(db, "users", user.uid, "sessions");
      await addDoc(sessionsRef, {
        clientId: formData.clientId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        type: formData.type as "personal-training" | "consultation" | "assessment",
        status: "scheduled",
        cost: parseFloat(formData.cost),
        notes: formData.notes,
      });
      
      toast({
        title: "Session scheduled",
        description: "New session has been successfully scheduled.",
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
      setIsOpen(false);
      onSessionAdded();
    } catch (error) {
      console.error("Error creating session:", error);
      toast({
        title: "Error",
        description: "Failed to create session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Session
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
            <div className="grid grid-cols-2 gap-4">
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
                    <SelectItem value="personal-training">Personal Training</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Add any additional notes..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Session"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Sessions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    clientId: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "",
    cost: "",
    notes: "",
  });

  const groupedSessions = React.useMemo(() => {
    const sortedSessions = [...sessions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const group = sortedSessions.reduce((acc, session) => {
      const sessionDate = new Date(session.date);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      let dateKey = sessionDate.toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      if (sessionDate.toDateString() === today.toDateString()) {
        dateKey = "Today";
      } else if (sessionDate.toDateString() === tomorrow.toDateString()) {
        dateKey = "Tomorrow";
      }
      
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(session);
      return acc;
    }, {} as Record<string, Session[]>);

    return group;
  }, [sessions]);

  // Load data once on component mount
  useEffect(() => {
    if (!user?.uid) return;

    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load sessions
        const sessionsSnapshot = await getDocs(collection(db, "users", user.uid, "sessions"));
        const sessionsData = sessionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
        setSessions(sessionsData);
        
        // Load clients
        const clientsSnapshot = await getDocs(collection(db, "users", user.uid, "clients"));
        const clientsData = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setClients(clientsData);
        
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load sessions. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.uid, toast]);

  const refreshData = async () => {
    if (!user?.uid) return;
    
    try {
      const sessionsSnapshot = await getDocs(collection(db, "users", user.uid, "sessions"));
      const sessionsData = sessionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
      setSessions(sessionsData);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const startEditing = (session: Session) => {
    setEditingSession(session.id);
    setEditForm({
      clientId: session.clientId,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      type: session.type,
      cost: session.cost.toString(),
      notes: session.notes || "",
    });
  };

  const cancelEditing = () => {
    setEditingSession(null);
    setEditForm({
      clientId: "",
      date: "",
      startTime: "",
      endTime: "",
      type: "",
      cost: "",
      notes: "",
    });
  };

  const saveEdit = async () => {
    if (!user?.uid || !editingSession) return;
    
    try {
      const sessionRef = doc(db, "users", user.uid, "sessions", editingSession);
      await updateDoc(sessionRef, {
        clientId: editForm.clientId,
        date: editForm.date,
        startTime: editForm.startTime,
        endTime: editForm.endTime,
        type: editForm.type as "personal-training" | "consultation" | "assessment",
        cost: parseFloat(editForm.cost),
        notes: editForm.notes,
      });
      
      // Update local state
      setSessions(prev => prev.map(s => 
        s.id === editingSession ? {
          ...s,
          clientId: editForm.clientId,
          date: editForm.date,
          startTime: editForm.startTime,
          endTime: editForm.endTime,
          type: editForm.type as "personal-training" | "consultation" | "assessment",
          cost: parseFloat(editForm.cost),
          notes: editForm.notes,
        } : s
      ));
      
      setEditingSession(null);
      toast({
        title: "Session updated",
        description: "Session has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating session:", error);
      toast({
        title: "Error",
        description: "Failed to update session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSession = async (session: Session) => {
    if (!user?.uid) return;
    
    try {
      const sessionRef = doc(db, "users", user.uid, "sessions", session.id);
      await deleteDoc(sessionRef);
      
      // Update local state immediately
      setSessions(prev => prev.filter(s => s.id !== session.id));
      
      toast({
        title: "Session deleted",
        description: "Session has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting session:", error);
      toast({
        title: "Error",
        description: "Failed to delete session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteSession = async (session: Session) => {
    if (!user?.uid) return;
    
    try {
      const sessionRef = doc(db, "users", user.uid, "sessions", session.id);
      await updateDoc(sessionRef, { status: "completed" });
      
      // Update local state immediately
      setSessions(prev => prev.map(s => 
        s.id === session.id ? { ...s, status: "completed" } : s
      ));
      
      toast({
        title: "Session completed",
        description: "Session has been marked as completed.",
      });
    } catch (error) {
      console.error("Error completing session:", error);
      toast({
        title: "Error",
        description: "Failed to complete session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || "Unknown Client";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "scheduled":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading sessions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sessions</h1>
          <p className="text-muted-foreground">
            Manage and track all your training sessions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData}>
            Refresh
          </Button>
          <AddSessionDialog onSessionAdded={refreshData} />
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {sessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No sessions yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start by scheduling your first training session.
                </p>
                <AddSessionDialog onSessionAdded={refreshData} />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedSessions).map(([date, sessionsOnDate]) => (
                <div key={date}>
                  <h2 className="text-lg font-semibold text-foreground mb-3 pb-2 border-b">
                    {date}
                  </h2>
                  <div className="space-y-4">
                    {sessionsOnDate.map((session) => (
                      <Card key={session.id} className="transition-shadow hover:shadow-lg">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-1.5 h-16 rounded-full ${getStatusColor(session.status).replace('bg-', 'bg-opacity-100 bg-')}`}></div>
                              <div>
                                <CardTitle className="text-xl font-bold text-foreground">
                                  {getClientName(session.clientId)}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    {formatTime(session.startTime)} -{" "}
                                    {formatTime(session.endTime)}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={cn("text-sm", getStatusColor(session.status))}
                              >
                                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                              </Badge>
                              {editingSession !== session.id && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-5 w-5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => startEditing(session)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    {session.status === "scheduled" && (
                                      <DropdownMenuItem onClick={() => handleCompleteSession(session)}>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Mark Complete
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem 
                                      onClick={() => handleDeleteSession(session)}
                                      className="text-red-500 hover:!text-red-500"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {editingSession === session.id ? (
                            <div className="space-y-4 pt-4 border-t">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Client</Label>
                                  <Select
                                    value={editForm.clientId}
                                    onValueChange={(value) =>
                                      setEditForm({ ...editForm, clientId: value })
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
                                  <Label>Date</Label>
                                  <Input
                                    type="date"
                                    value={editForm.date}
                                    onChange={(e) =>
                                      setEditForm({ ...editForm, date: e.target.value })
                                    }
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Start Time</Label>
                                  <Input
                                    type="time"
                                    value={editForm.startTime}
                                    onChange={(e) =>
                                      setEditForm({ ...editForm, startTime: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>End Time</Label>
                                  <Input
                                    type="time"
                                    value={editForm.endTime}
                                    onChange={(e) =>
                                      setEditForm({ ...editForm, endTime: e.target.value })
                                    }
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Type</Label>
                                  <Select
                                    value={editForm.type}
                                    onValueChange={(value) =>
                                      setEditForm({ ...editForm, type: value })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="personal-training">Personal Training</SelectItem>
                                      <SelectItem value="consultation">Consultation</SelectItem>
                                      <SelectItem value="assessment">Assessment</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Cost ($)</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={editForm.cost}
                                    onChange={(e) =>
                                      setEditForm({ ...editForm, cost: e.target.value })
                                    }
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Notes</Label>
                                <Textarea
                                  value={editForm.notes}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, notes: e.target.value })
                                  }
                                  placeholder="Add any additional notes..."
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={cancelEditing}>
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel
                                </Button>
                                <Button onClick={saveEdit}>
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="pt-4 border-t flex flex-col gap-3">
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <ClipboardList className="h-4 w-4" />
                                  <span>{session.type}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <DollarSign className="h-4 w-4" />
                                  <span>${session.cost}</span>
                                </div>
                              </div>
                              {session.notes && (
                                <div className="text-sm">
                                  <p className="text-muted-foreground">{session.notes}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Training Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SessionCalendar />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sessions;
