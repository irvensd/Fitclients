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
  Ruler,
} from "lucide-react";
import { Client, ProgressEntry } from "@/lib/types";
import { useData } from "@/contexts/DataContext";
import { SmartRecommendations } from "@/components/SmartRecommendations";
import { useToast } from "@/hooks/use-toast";

const AddProgressDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { clients, addProgressEntry } = useData();
  const { toast } = useToast();
  
  console.log("AddProgressDialog - clients:", clients);
  console.log("AddProgressDialog - clients length:", clients.length);
  
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
    console.log("Form submitted with data:", formData);

    if (!formData.clientId) {
      toast({
        variant: "destructive",
        title: "Client Not Selected",
        description: "Please select a client to record progress for.",
      });
      setLoading(false);
      return;
    }

    try {
      const progressData: Omit<ProgressEntry, 'id'> = {
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

      // Filter out undefined values for Firestore compatibility
      const cleanProgressData = Object.fromEntries(
        Object.entries(progressData).map(([key, value]) => {
          if (value === undefined) return [key, null];
          if (typeof value === 'object' && value !== null) {
            // Handle nested objects like measurements
            const cleanNested = Object.fromEntries(
              Object.entries(value).map(([nestedKey, nestedValue]) => 
                [nestedKey, nestedValue === undefined ? null : nestedValue]
              )
            );
            return [key, cleanNested];
          }
          return [key, value];
        })
      );

      console.log("Calling addProgressEntry with:", cleanProgressData);
      const result = await addProgressEntry(cleanProgressData as Omit<ProgressEntry, 'id'>);
      console.log("addProgressEntry result:", result);

      toast({
        title: "Progress Recorded",
        description: `Progress for ${clients.find(c => c.id === formData.clientId)?.name} has been successfully saved.`,
      });

      setFormData({
        clientId: "", weight: "", bodyFat: "", chest: "", waist: "",
        hips: "", arms: "", thighs: "", notes: "",
        date: new Date().toISOString().split("T")[0],
      });
      setOpen(false);
    } catch (error) {
      console.error("Error recording progress:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Failed to record progress. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto justify-center">
          <Plus className="h-4 w-4 mr-2" />
          Record Progress
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Progress Entry</DialogTitle>
          <DialogDescription>
            Track your client's progress with measurements and notes
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={clients.length === 0 ? "No clients available" : "Select client"} />
                </SelectTrigger>
                <SelectContent>
                  {clients.length === 0 ? (
                    <SelectItem value="no-clients" disabled>No clients available</SelectItem>
                  ) : (
                    clients.map((client) => <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>)
                  )}
                </SelectContent>
              </Select>
              {clients.length === 0 && (
                <p className="text-sm text-muted-foreground">Please add clients first to record progress.</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input id="weight" type="number" step="0.1" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} placeholder="150.5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bodyFat">Body Fat (%)</Label>
              <Input id="bodyFat" type="number" step="0.1" value={formData.bodyFat} onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })} placeholder="15.2" />
            </div>
          </div>
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">Body Measurements (inches)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chest">Chest</Label>
                <Input id="chest" type="number" step="0.1" value={formData.chest} onChange={(e) => setFormData({ ...formData, chest: e.target.value })} placeholder="40.0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waist">Waist</Label>
                <Input id="waist" type="number" step="0.1" value={formData.waist} onChange={(e) => setFormData({ ...formData, waist: e.target.value })} placeholder="32.0" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hips">Hips</Label>
                <Input id="hips" type="number" step="0.1" value={formData.hips} onChange={(e) => setFormData({ ...formData, hips: e.target.value })} placeholder="38.0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arms">Arms</Label>
                <Input id="arms" type="number" step="0.1" value={formData.arms} onChange={(e) => setFormData({ ...formData, arms: e.target.value })} placeholder="14.0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thighs">Thighs</Label>
                <Input id="thighs" type="number" step="0.1" value={formData.thighs} onChange={(e) => setFormData({ ...formData, thighs: e.target.value })} placeholder="22.0" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="How the client is feeling, observations..." className="min-h-[80px]" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Recording..." : "Record Progress"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ClientProgressCard = ({ client }: { client: Client }) => {
  const { progressEntries } = useData();
  const clientProgress = progressEntries
    .filter((entry) => entry.clientId === client.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (clientProgress.length === 0) {
    return null;
  }

  const latestEntry = clientProgress[clientProgress.length - 1];
  const firstEntry = clientProgress[0];
  const weightChange = latestEntry.weight && firstEntry.weight ? latestEntry.weight - firstEntry.weight : 0;
  const bodyFatChange = latestEntry.bodyFat && firstEntry.bodyFat ? latestEntry.bodyFat - firstEntry.bodyFat : 0;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={client.avatar} />
              <AvatarFallback className="text-xs font-medium">
                {client.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm truncate">{client.name}</CardTitle>
              <p className="text-xs text-muted-foreground capitalize">{client.fitnessLevel}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {clientProgress.length}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-3">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="text-center p-2 bg-muted/30 rounded">
            <p className={`text-lg font-bold ${weightChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {weightChange.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">lbs</p>
          </div>
          <div className="text-center p-2 bg-muted/30 rounded">
            <p className={`text-lg font-bold ${bodyFatChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {bodyFatChange.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">%</p>
          </div>
        </div>

        {/* Latest Weight */}
        {latestEntry.weight && (
          <div className="text-center p-2 bg-blue-50 rounded mb-2">
            <p className="text-sm font-semibold text-blue-700">{latestEntry.weight} lbs</p>
            <p className="text-xs text-blue-600">Current Weight</p>
          </div>
        )}

        {/* Progress Trend */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Last: {new Date(latestEntry.date).toLocaleDateString()}</span>
          <span>{clientProgress.length} entries</span>
        </div>
      </CardContent>
    </Card>
  );
};

const ProgressPage = () => {
  const { clients, progressEntries, loading } = useData();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const clientsWithProgress = filteredClients.filter((client) =>
    progressEntries.some((entry) => entry.clientId === client.id)
  );
  const clientsWithoutProgress = filteredClients.filter(
    (client) => !progressEntries.some((entry) => entry.clientId === client.id)
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Client Progress</h1>
          <p className="text-muted-foreground">Monitor and analyze client progress over time.</p>
        </div>
        <AddProgressDialog />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search clients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Progress Overview</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6 space-y-6">
          {filteredClients.length === 0 && (
             <Card><CardContent className="pt-6 text-center text-muted-foreground">No clients match your search.</CardContent></Card>
          )}
          
          {/* Progress Cards Grid */}
          {clientsWithProgress.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Clients with Progress Data</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {clientsWithProgress.map((client) => (
                  <ClientProgressCard key={client.id} client={client} />
                ))}
              </div>
            </div>
          )}

          {/* Clients without progress */}
          {clientsWithoutProgress.length > 0 && searchTerm.length === 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Clients Without Progress Data</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {clientsWithoutProgress.map((client) => (
                  <Card key={client.id} className="overflow-hidden hover:shadow-md transition-all duration-200">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={client.avatar} />
                          <AvatarFallback className="text-xs font-medium">
                            {client.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-sm truncate">{client.name}</CardTitle>
                          <p className="text-xs text-muted-foreground capitalize">{client.fitnessLevel}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 pb-3">
                      <div className="text-center p-4 bg-muted/20 rounded">
                        <p className="text-sm text-muted-foreground">No progress data</p>
                        <p className="text-xs text-muted-foreground mt-1">Record first entry</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="recommendations" className="mt-6">
           {clientsWithProgress.length > 0 ? (
            <SmartRecommendations client={clientsWithProgress[0]} />
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <TrendingUp className="mx-auto h-10 w-10 mb-4" />
                <p>No progress data available to generate AI recommendations.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressPage;
