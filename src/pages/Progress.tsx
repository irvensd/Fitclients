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
  Plus,
  Search,
  TrendingUp,
  Camera,
  Scale,
  Ruler,
  Calendar,
  Target,
  Activity,
} from "lucide-react";
import { ProgressEntry } from "@/lib/types";

// Mock progress data
const mockProgress: ProgressEntry[] = [
  {
    id: "1",
    clientId: "1",
    date: "2024-03-15",
    weight: 165,
    bodyFat: 18.5,
    measurements: {
      chest: 38,
      waist: 32,
      hips: 36,
      arms: 13,
      thighs: 22,
    },
    notes:
      "Great progress this month! Down 3 lbs and muscle definition improving.",
  },
  {
    id: "2",
    clientId: "1",
    date: "2024-03-01",
    weight: 168,
    bodyFat: 19.2,
    measurements: {
      chest: 38.5,
      waist: 33,
      hips: 36.5,
      arms: 12.5,
      thighs: 22.5,
    },
    notes: "Starting to see changes in muscle tone.",
  },
  {
    id: "3",
    clientId: "2",
    date: "2024-03-14",
    weight: 185,
    bodyFat: 15.8,
    measurements: {
      chest: 42,
      waist: 34,
      hips: 38,
      arms: 15,
      thighs: 24,
    },
    notes: "Strength gains continue. Added 10 lbs to bench press.",
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

const LogProgressDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    date: new Date().toISOString().split("T")[0],
    weight: "",
    bodyFat: "",
    measurements: {
      chest: "",
      waist: "",
      hips: "",
      arms: "",
      thighs: "",
    },
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging progress:", formData);
    alert(`Progress logged for ${getClientName(formData.clientId)}!`);
    setOpen(false);
    setFormData({
      clientId: "",
      date: new Date().toISOString().split("T")[0],
      weight: "",
      bodyFat: "",
      measurements: {
        chest: "",
        waist: "",
        hips: "",
        arms: "",
        thighs: "",
      },
      notes: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Log Progress
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Client Progress</DialogTitle>
          <DialogDescription>
            Record measurements, weight, and progress photos for a client.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="progress-client">Client</Label>
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
                <Label htmlFor="progress-date">Date</Label>
                <Input
                  id="progress-date"
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
                <Label htmlFor="progress-weight">Weight (lbs)</Label>
                <Input
                  id="progress-weight"
                  type="number"
                  step="0.1"
                  placeholder="165.5"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="progress-bodyfat">Body Fat (%)</Label>
                <Input
                  id="progress-bodyfat"
                  type="number"
                  step="0.1"
                  placeholder="18.5"
                  value={formData.bodyFat}
                  onChange={(e) =>
                    setFormData({ ...formData, bodyFat: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">
                Body Measurements (inches)
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chest">Chest</Label>
                  <Input
                    id="chest"
                    type="number"
                    step="0.1"
                    placeholder="38.0"
                    value={formData.measurements.chest}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        measurements: {
                          ...formData.measurements,
                          chest: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waist">Waist</Label>
                  <Input
                    id="waist"
                    type="number"
                    step="0.1"
                    placeholder="32.0"
                    value={formData.measurements.waist}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        measurements: {
                          ...formData.measurements,
                          waist: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hips">Hips</Label>
                  <Input
                    id="hips"
                    type="number"
                    step="0.1"
                    placeholder="36.0"
                    value={formData.measurements.hips}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        measurements: {
                          ...formData.measurements,
                          hips: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arms">Arms</Label>
                  <Input
                    id="arms"
                    type="number"
                    step="0.1"
                    placeholder="13.0"
                    value={formData.measurements.arms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        measurements: {
                          ...formData.measurements,
                          arms: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thighs">Thighs</Label>
                  <Input
                    id="thighs"
                    type="number"
                    step="0.1"
                    placeholder="22.0"
                    value={formData.measurements.thighs}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        measurements: {
                          ...formData.measurements,
                          thighs: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Progress Photos</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop photos here, or click to select
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Choose Files
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress-notes">Progress Notes</Label>
              <Textarea
                id="progress-notes"
                placeholder="Record observations, improvements, goals achieved..."
                className="min-h-[80px]"
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
            <Button type="submit">Log Progress</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ViewProgressDialog = ({ progress }: { progress: ProgressEntry }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Progress Details</DialogTitle>
          <DialogDescription>
            {getClientName(progress.clientId)} -{" "}
            {new Date(progress.date).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Weight</Label>
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg font-semibold">
                  {progress.weight} lbs
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Body Fat</Label>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg font-semibold">
                  {progress.bodyFat}%
                </span>
              </div>
            </div>
          </div>

          {progress.measurements && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Measurements (inches)
              </Label>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span>Chest:</span>
                  <span className="font-medium">
                    {progress.measurements.chest}"
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Waist:</span>
                  <span className="font-medium">
                    {progress.measurements.waist}"
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Hips:</span>
                  <span className="font-medium">
                    {progress.measurements.hips}"
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Arms:</span>
                  <span className="font-medium">
                    {progress.measurements.arms}"
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Thighs:</span>
                  <span className="font-medium">
                    {progress.measurements.thighs}"
                  </span>
                </div>
              </div>
            </div>
          )}

          {progress.notes && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Notes</Label>
              <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                {progress.notes}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProgressPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientFilter, setClientFilter] = useState<string>("all");

  const filteredProgress = mockProgress.filter((entry) => {
    const clientName = getClientName(entry.clientId).toLowerCase();
    const matchesSearch = clientName.includes(searchTerm.toLowerCase());
    const matchesClient =
      clientFilter === "all" || entry.clientId === clientFilter;
    return matchesSearch && matchesClient;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Progress Tracking
          </h1>
          <p className="text-muted-foreground">
            Monitor client progress with measurements, photos, and performance
            metrics.
          </p>
        </div>
        <div className="flex gap-2">
          <LogProgressDialog />
          <Button variant="outline">
            <Camera className="h-4 w-4 mr-2" />
            Upload Photos
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{mockProgress.length}</div>
            <p className="text-sm text-muted-foreground">Total Entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {new Set(mockProgress.map((p) => p.clientId)).size}
            </div>
            <p className="text-sm text-muted-foreground">Clients Tracked</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">-12</div>
            <p className="text-sm text-muted-foreground">
              Avg Weight Loss (lbs)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">85%</div>
            <p className="text-sm text-muted-foreground">Goals Achieved</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="entries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entries">Progress Entries</TabsTrigger>
          <TabsTrigger value="trends">Trends & Analytics</TabsTrigger>
          <TabsTrigger value="photos">Progress Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by client name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All Clients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Progress Entries */}
          <div className="space-y-4">
            {filteredProgress.map((entry) => (
              <Card
                key={entry.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {getClientName(entry.clientId)
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {getClientName(entry.clientId)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {entry.weight && (
                        <div className="flex items-center gap-2">
                          <Scale className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {entry.weight} lbs
                          </span>
                        </div>
                      )}
                      {entry.bodyFat && (
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {entry.bodyFat}% BF
                          </span>
                        </div>
                      )}
                      <ViewProgressDialog progress={entry} />
                    </div>
                  </div>

                  {entry.notes && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm">{entry.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progress Analytics</CardTitle>
              <CardDescription>
                Visual trends and progress metrics for your clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Weight Trends</h4>
                    <div className="h-32 bg-muted rounded flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        Chart visualization coming soon
                      </p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Body Fat Trends</h4>
                    <div className="h-32 bg-muted rounded flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        Chart visualization coming soon
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progress Photos</CardTitle>
              <CardDescription>
                Before and after photos to track visual progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Photo management features coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressPage;
