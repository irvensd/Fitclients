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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Plus,
  Search,
  TrendingUp,
  Scale,
  Ruler,
  Camera,
  Target,
  Award,
  Calendar,
  User,
} from "lucide-react";
import { ProgressEntry, Client } from "@/lib/types";
import { useData } from "@/contexts/DataContext";
import { GamificationDashboard } from "@/components/GamificationDashboard";
import { SmartRecommendations } from "@/components/SmartRecommendations";

const AddProgressDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { clients } = useData();
  const [formData, setFormData] = useState({
    clientId: "",
    weight: "",
    bodyFat: "",
    chest: "",
    waist: "",
    hips: "",
    arms: "",
    thighs: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In offline mode, just log the progress entry
      const progressEntry = {
        clientId: formData.clientId,
        date: formData.date,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
        measurements: {
          chest: formData.chest ? parseFloat(formData.chest) : undefined,
          waist: formData.waist ? parseFloat(formData.waist) : undefined,
          hips: formData.hips ? parseFloat(formData.hips) : undefined,
          arms: formData.arms ? parseFloat(formData.arms) : undefined,
          thighs: formData.thighs ? parseFloat(formData.thighs) : undefined,
        },
        notes: formData.notes,
      };

      console.log("Progress entry recorded:", progressEntry);
      alert("Progress entry recorded successfully!");

      // Reset form and close dialog
      setFormData({
        clientId: "",
        weight: "",
        bodyFat: "",
        chest: "",
        waist: "",
        hips: "",
        arms: "",
        thighs: "",
        notes: "",
        date: new Date().toISOString().split("T")[0],
      });
      setOpen(false);
    } catch (error) {
      console.error("Error recording progress:", error);
      alert("Failed to record progress. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Record Progress
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Progress Entry</DialogTitle>
          <DialogDescription>
            Track your client's progress with measurements and notes
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
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  placeholder="150.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bodyFat">Body Fat (%)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  value={formData.bodyFat}
                  onChange={(e) =>
                    setFormData({ ...formData, bodyFat: e.target.value })
                  }
                  placeholder="15.2"
                />
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">Body Measurements (inches)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chest">Chest</Label>
                  <Input
                    id="chest"
                    type="number"
                    step="0.1"
                    value={formData.chest}
                    onChange={(e) =>
                      setFormData({ ...formData, chest: e.target.value })
                    }
                    placeholder="40.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waist">Waist</Label>
                  <Input
                    id="waist"
                    type="number"
                    step="0.1"
                    value={formData.waist}
                    onChange={(e) =>
                      setFormData({ ...formData, waist: e.target.value })
                    }
                    placeholder="32.0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hips">Hips</Label>
                  <Input
                    id="hips"
                    type="number"
                    step="0.1"
                    value={formData.hips}
                    onChange={(e) =>
                      setFormData({ ...formData, hips: e.target.value })
                    }
                    placeholder="38.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arms">Arms</Label>
                  <Input
                    id="arms"
                    type="number"
                    step="0.1"
                    value={formData.arms}
                    onChange={(e) =>
                      setFormData({ ...formData, arms: e.target.value })
                    }
                    placeholder="14.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thighs">Thighs</Label>
                  <Input
                    id="thighs"
                    type="number"
                    step="0.1"
                    value={formData.thighs}
                    onChange={(e) =>
                      setFormData({ ...formData, thighs: e.target.value })
                    }
                    placeholder="22.0"
                  />
                </div>
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
                placeholder="How the client is feeling, observations, achievements..."
                className="min-h-[80px]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Recording..." : "Record Progress"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ClientProgressCard = ({ client }: { client: Client }) => {
  // Check for stored progress data (in a real app, this would come from the database)
  const storedProgress = JSON.parse(
    localStorage.getItem("progressEntries") || "[]",
  );
  const clientProgress = storedProgress.filter(
    (entry: any) => entry.clientId === client.id,
  );

  // If no progress data exists, show empty state
  if (clientProgress.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {client.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{client.name}</CardTitle>
                <CardDescription>{client.goals}</CardDescription>
              </div>
            </div>
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Progress Data Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking {client.name.split(" ")[0]}'s progress by recording
              their first measurements.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>• Weight and body composition</p>
              <p>• Body measurements</p>
              <p>• Progress photos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Use real progress data if available, otherwise fall back to mock data for demo
  const progressData =
    clientProgress.length > 0
      ? clientProgress
      : [
          { date: "Week 1", weight: 160, bodyFat: 18 },
          { date: "Week 2", weight: 158, bodyFat: 17.5 },
          { date: "Week 3", weight: 157, bodyFat: 17 },
          { date: "Week 4", weight: 155, bodyFat: 16.5 },
        ];

  const latestProgress = progressData[progressData.length - 1];
  const firstProgress = progressData[0];
  const weightLoss = firstProgress.weight - latestProgress.weight;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {client.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{client.name}</CardTitle>
              <CardDescription>{client.goals}</CardDescription>
            </div>
          </div>
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                -{weightLoss}
              </div>
              <div className="text-sm text-muted-foreground">lbs lost</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{latestProgress.weight}</div>
              <div className="text-sm text-muted-foreground">
                current weight
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {latestProgress.bodyFat}%
              </div>
              <div className="text-sm text-muted-foreground">body fat</div>
            </div>
          </div>

          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Camera className="h-4 w-4 mr-2" />
              Photos
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Ruler className="h-4 w-4 mr-2" />
              Measurements
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Progress = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { clients, loading } = useData();

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
          <h1 className="text-3xl font-bold text-foreground">Progress</h1>
          <p className="text-muted-foreground">
            Track your clients' fitness journey and achievements.
          </p>
        </div>
        <AddProgressDialog />
      </div>

      {/* Empty State */}
      {clients.length === 0 && (
        <Card className="border-2 border-dashed border-muted-foreground/25 bg-muted/5">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
              <TrendingUp className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Progress Data Yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Start tracking your clients' progress with measurements, photos,
              and achievement milestones.
            </p>
            <AddProgressDialog />
          </CardContent>
        </Card>
      )}

      {clients.length > 0 && (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{clients.length}</div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">0</div>
                <p className="text-sm text-muted-foreground">
                  Progress Entries
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">0</div>
                <p className="text-sm text-muted-foreground">Goals Achieved</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">0</div>
                <p className="text-sm text-muted-foreground">Photos Uploaded</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Progress Overview</TabsTrigger>
              <TabsTrigger value="gamification">Achievements</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Search */}
              <Card>
                <CardContent className="pt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search clients by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Client Progress Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredClients.map((client) => (
                  <ClientProgressCard key={client.id} client={client} />
                ))}
              </div>

              {filteredClients.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">
                      No clients found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search term.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="gamification" className="space-y-6">
              <GamificationDashboard />
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <SmartRecommendations />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Progress;
