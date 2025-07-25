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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Share2,
  Link,
  Copy,
  Eye,
  Settings,
  Users,
  ExternalLink,
  Check,

  MessageSquare,
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useNavigate } from "react-router-dom";
import { LoadingPage } from "@/components/ui/loading";
import { useToast } from "@/components/ui/use-toast";


// Mock clients data with working portal settings
const mockClients = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    dateJoined: "2024-01-15",
    fitnessLevel: "intermediate",
    goals: "Weight loss and strength building",
    portalId: "sarah-johnson",
    portalActive: true,
    portalSettings: {
      showProgress: true,
      showSessions: true,
      showWorkouts: true,
      showPayments: true,
    },
    lastPortalAccess: "2024-03-16",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "(555) 234-5678",
    dateJoined: "2024-02-03",
    fitnessLevel: "beginner",
    goals: "Build muscle mass and improve endurance",
    portalId: "mike-chen",
    portalActive: false,
    portalSettings: {
      showProgress: true,
      showSessions: true,
      showWorkouts: true,
      showPayments: false,
    },
    lastPortalAccess: null,
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "(555) 345-6789",
    dateJoined: "2024-01-28",
    fitnessLevel: "advanced",
    goals: "Marathon training and performance optimization",
    portalId: "emily-davis",
    portalActive: true,
    portalSettings: {
      showProgress: true,
      showSessions: true,
      showWorkouts: true,
      showPayments: true,
    },
    lastPortalAccess: "2024-03-15",
  },
];

const SharePortalDialog = ({ client }: { client: any }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const portalUrl = `${window.location.origin}/client-portal/${client.id}`;
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex-1 sm:flex-initial">
          <Share2 className="h-4 w-4 mr-2" />
          <span className="text-sm">Share Portal</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Client Portal</DialogTitle>
          <DialogDescription>
            Share {client.name}'s personalized fitness portal
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Portal URL */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Portal Link</Label>
            <div className="flex gap-2">
              <Input value={portalUrl} readOnly className="font-mono text-sm" />
              <Button onClick={handleCopy} variant="outline" size="sm">
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This link is unique to {client.name} and doesn't require a login
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => window.open(portalUrl, "_blank")}
              className="justify-center sm:justify-start w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Preview Portal
            </Button>
          </div>

          {/* Portal Status */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Portal Status</p>
                <p className="text-sm text-muted-foreground">
                  {client.portalActive ? "Active and accessible" : "Disabled"}
                </p>
              </div>
              <Badge
                className={
                  client.portalActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }
              >
                {client.portalActive ? "Active" : "Disabled"}
              </Badge>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Instructions for Client
            </Label>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Bookmark the link for easy access</p>
              <p>• No login required - works on any device</p>
              <p>• Updates automatically when you add new data</p>
              <p>• Share only with the intended client</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PortalSettingsDialog = ({ client }: { client: any }) => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(client.portalSettings);
  const [portalActive, setPortalActive] = useState(client.portalActive);

  const handleSave = () => {
          // Saving portal settings
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
          <Settings className="h-4 w-4 mr-2" />
          <span className="text-sm">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Portal Settings</DialogTitle>
          <DialogDescription>
            Configure what {client.name} can see in their portal
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Portal Status */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Portal Access</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable portal access
              </p>
            </div>
            <Switch checked={portalActive} onCheckedChange={setPortalActive} />
          </div>

          {/* Visibility Settings */}
          <div className="space-y-4">
            <Label className="font-medium">Visible Sections</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Progress Tracking</Label>
                <Switch
                  checked={settings.showProgress}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showProgress: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Upcoming Sessions</Label>
                <Switch
                  checked={settings.showSessions}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showSessions: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Workout Plans</Label>
                <Switch
                  checked={settings.showWorkouts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showWorkouts: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Payment Information</Label>
                <Switch
                  checked={settings.showPayments}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showPayments: checked })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="w-full sm:w-auto">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ClientPortalManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { clients, loading } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();


  // Add portal-specific properties for mock purposes
  const clientsWithPortalData = clients.map((client) => ({
    ...client,
    portalActive: true, // All clients have portal access in demo
    lastPortalAccess: client.dateJoined, // Use join date as last access for demo
    portalSettings: {
      showProgress: true,
      showSessions: true,
      showWorkouts: true,
      showPayments: false,
      customMessage: "Welcome to your personal fitness portal!",
    },
  }));

  const filteredClients = clientsWithPortalData.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return <LoadingPage text="Loading client portals..." />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Client Portals
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Generate and manage shareable client portals with no login required.
          </p>
        </div>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold">
              {clientsWithPortalData.filter((c) => c.portalActive).length}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Active Portals
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold">
              {clients.length}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Total Clients
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold">
              {
                clientsWithPortalData.filter((c) => c.lastPortalAccess !== null)
                  .length
              }
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Recently Accessed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold">100%</div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Secure Links
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* Client Portal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <CardDescription>
                      {client.fitnessLevel} • Joined{" "}
                      {new Date(client.dateJoined).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Portal Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Portal Status
                </span>
                <Badge
                  className={
                    client.portalActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {client.portalActive ? "Active" : "Disabled"}
                </Badge>
              </div>

              {/* Last Access */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Last Accessed
                </span>
                <span className="text-sm">
                  {client.lastPortalAccess
                    ? new Date(client.lastPortalAccess).toLocaleDateString()
                    : "Never"}
                </span>
              </div>

              {/* Portal Features */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Available Sections:</span>
                <div className="flex flex-wrap gap-1">
                  {client.portalSettings.showProgress && (
                    <Badge variant="outline" className="text-xs">
                      Progress
                    </Badge>
                  )}
                  {client.portalSettings.showSessions && (
                    <Badge variant="outline" className="text-xs">
                      Sessions
                    </Badge>
                  )}
                  {client.portalSettings.showWorkouts && (
                    <Badge variant="outline" className="text-xs">
                      Workouts
                    </Badge>
                  )}
                  {client.portalSettings.showPayments && (
                    <Badge variant="outline" className="text-xs">
                      Payments
                    </Badge>
                  )}
                </div>
              </div>

              {/* Portal URL Preview */}
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Link className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-mono text-muted-foreground">
                    /client-portal/{client.id}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <div className="flex gap-2 flex-1">
                  <SharePortalDialog client={client} />
                  <PortalSettingsDialog client={client} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>How Client Portals Work</CardTitle>
          <CardDescription>
            Share secure, personalized fitness dashboards with your clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">For Trainers:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Generate unique links for each client</li>
                <li>• Control what information is visible</li>
                <li>• Share via email or copy the link directly</li>
                <li>• Enable/disable access anytime</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">For Clients:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• No login required - just bookmark the link</li>
                <li>• View progress, sessions, and workout plans</li>
                <li>• Check payment status and history</li>
                <li>• Access from any device, anywhere</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientPortalManager;
