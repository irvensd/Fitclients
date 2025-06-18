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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  DollarSign,
  Calendar,
  Smartphone,
  Mail,
  Shield,
  Download,
  Upload,
  Trash2,
  Save,
  Camera,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { DevModeNotice } from "@/components/DevModeNotice";
import { SubscriptionManager } from "@/components/SubscriptionManager";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    emailReminders: true,
    smsReminders: false,
    paymentAlerts: true,
    newClientWelcome: true,
    weeklyReports: false,
  });

  const [businessInfo, setBusinessInfo] = useState({
    businessName: "FitTrainer Pro",
    trainerName: "Alex Johnson",
    email: "alex@fittrainerpro.com",
    phone: "(555) 123-4567",
    website: "www.fittrainerpro.com",
    address: "123 Fitness St, Gym City, GC 12345",
    bio: "Certified personal trainer with 5+ years of experience helping clients achieve their fitness goals.",
  });

  const [pricing, setPricing] = useState({
    personalTraining: 75,
    consultation: 50,
    assessment: 60,
    packageDiscount: 10,
    currency: "USD",
    taxRate: 8.5,
  });

  return (
    <div className="p-6 space-y-6">
      <DevModeNotice />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and business settings.
          </p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-6 min-w-[600px] lg:min-w-0">
            <TabsTrigger value="profile" className="text-xs sm:text-sm">
              Profile
            </TabsTrigger>
            <TabsTrigger value="business" className="text-xs sm:text-sm">
              Business
            </TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs sm:text-sm">
              Pricing
            </TabsTrigger>
            <TabsTrigger value="billing" className="text-xs sm:text-sm">
              Billing
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm">
              Security
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-lg">AJ</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="font-medium">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a professional photo for your profile
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <Button size="sm" variant="ghost">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" defaultValue="Alex" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" defaultValue="Johnson" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="alex@fittrainerpro.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="(555) 123-4567" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  defaultValue={businessInfo.bio}
                  rows={4}
                  placeholder="Tell clients about your experience, certifications, and training philosophy..."
                />
              </div>

              {/* Certifications */}
              <div className="space-y-4">
                <h3 className="font-medium">Certifications & Qualifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">
                        NASM Certified Personal Trainer
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Expires: Dec 2025
                      </p>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">CPR/AED Certification</h4>
                      <p className="text-sm text-muted-foreground">
                        Expires: Mar 2025
                      </p>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Add Certification
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Business Information
              </CardTitle>
              <CardDescription>
                Configure your business details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input
                    id="business-name"
                    defaultValue={businessInfo.businessName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue={businessInfo.website} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  defaultValue={businessInfo.address}
                  rows={3}
                  placeholder="Full business address including city, state, and zip code"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Operating Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-20">
                        <span className="text-sm font-medium">{day}</span>
                      </div>
                      <Switch defaultChecked={day !== "Sunday"} />
                      <Input className="w-20" defaultValue="9:00" type="time" />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        className="w-20"
                        defaultValue="17:00"
                        type="time"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input id="instagram" placeholder="@yourusername" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input id="facebook" placeholder="facebook.com/yourpage" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tiktok">TikTok</Label>
                    <Input id="tiktok" placeholder="@yourusername" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input id="youtube" placeholder="youtube.com/yourchannel" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing & Rates
              </CardTitle>
              <CardDescription>
                Set your service rates and payment preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="personal-training">
                    Personal Training (per session)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="personal-training"
                      type="number"
                      defaultValue={pricing.personalTraining}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultation">Consultation</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="consultation"
                      type="number"
                      defaultValue={pricing.consultation}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessment">Fitness Assessment</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="assessment"
                      type="number"
                      defaultValue={pricing.assessment}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="package-discount">Package Discount (%)</Label>
                  <div className="relative">
                    <Input
                      id="package-discount"
                      type="number"
                      defaultValue={pricing.packageDiscount}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      %
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue={pricing.currency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <div className="relative">
                    <Input
                      id="tax-rate"
                      type="number"
                      step="0.1"
                      defaultValue={pricing.taxRate}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      %
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Package Pricing</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label className="text-sm">4-Session Package</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                          $
                        </span>
                        <Input
                          type="number"
                          defaultValue="270"
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">8-Session Package</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                          $
                        </span>
                        <Input
                          type="number"
                          defaultValue="540"
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">12-Session Package</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                          $
                        </span>
                        <Input
                          type="number"
                          defaultValue="810"
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <SubscriptionManager />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about important events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-medium">Email Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get email notifications for upcoming sessions
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailReminders}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        emailReminders: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-medium">SMS Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive text messages for session reminders
                    </p>
                  </div>
                  <Switch
                    checked={notifications.smsReminders}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        smsReminders: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-medium">Payment Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when payments are received or overdue
                    </p>
                  </div>
                  <Switch
                    checked={notifications.paymentAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        paymentAlerts: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-medium">New Client Welcome</Label>
                    <p className="text-sm text-muted-foreground">
                      Send welcome emails to new clients automatically
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newClientWelcome}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        newClientWelcome: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-medium">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly business summary reports
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        weeklyReports: checked,
                      })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Client Notification Templates</h3>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Session Reminder</h4>
                      <Button variant="outline" size="sm">
                        Edit Template
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Hi {"{client_name}"}, this is a reminder for your training
                      session tomorrow at {"{time}"}. See you then!
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Payment Reminder</h4>
                      <Button variant="outline" size="sm">
                        Edit Template
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Hi {"{client_name}"}, your payment of ${"{amount}"} is now
                      due. Please submit payment at your earliest convenience.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
              <CardDescription>
                Manage your account security and data preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Password & Authentication</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Data & Privacy</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export My Data
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-red-600">Danger Zone</h3>
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="font-medium text-red-800 mb-2">
                    Delete Account
                  </h4>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. This
                    action cannot be undone.
                  </p>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
