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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  DollarSign,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  Download,
  Send,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  RefreshCw,
} from "lucide-react";
import { Payment } from "@/lib/types";
import { useData } from "@/contexts/DataContext";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "pending":
      return <Clock className="h-4 w-4 text-orange-600" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "failed":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getMethodIcon = (method: string) => {
  switch (method) {
    case "card":
      return <CreditCard className="h-4 w-4" />;
    case "cash":
      return <DollarSign className="h-4 w-4" />;
    case "bank-transfer":
      return <Send className="h-4 w-4" />;
    default:
      return <DollarSign className="h-4 w-4" />;
  }
};

const AddPaymentDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { clients, addPayment } = useData();
  const [formData, setFormData] = useState({
    clientId: "",
    amount: "",
    method: "",
    status: "completed",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addPayment({
        clientId: formData.clientId,
        amount: parseFloat(formData.amount),
        method: formData.method as
          | "cash"
          | "card"
          | "bank-transfer"
          | "venmo"
          | "paypal",
        status: formData.status as "pending" | "completed" | "failed",
        description: formData.description,
        date: formData.date,
      });

      // Reset form and close dialog
      setFormData({
        clientId: "",
        amount: "",
        method: "",
        status: "completed",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      setOpen(false);
    } catch (error) {
      console.error("Error adding payment:", error);
      alert("Failed to record payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Record Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record New Payment</DialogTitle>
          <DialogDescription>
            Add a payment record for a client
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
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder="75.00"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="method">Payment Method</Label>
                <Select
                  value={formData.method}
                  onValueChange={(value) =>
                    setFormData({ ...formData, method: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="venmo">Venmo</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Personal training session, monthly package..."
                className="min-h-[80px]"
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

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const {
    payments,
    clients,
    loading,
    getClientName,
    updatePayment,
    deletePayment,
  } = useData();

  // Enhanced payment management functions
  const handleMarkAsPaid = async (payment: Payment) => {
    try {
      await updatePayment(payment.id, {
        status: "completed",
        date: new Date().toISOString().split("T")[0], // Update to current date when marked as paid
      });
      alert(
        `Payment of $${payment.amount} marked as completed for ${getClientName(payment.clientId)}`,
      );
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Failed to update payment status. Please try again.");
    }
  };

  const handleMarkAsFailed = async (payment: Payment) => {
    const reason = prompt("Reason for payment failure (optional):");
    try {
      await updatePayment(payment.id, {
        status: "failed",
        description:
          payment.description +
          (reason ? ` - Failed: ${reason}` : " - Payment failed"),
      });
      alert(`Payment marked as failed for ${getClientName(payment.clientId)}`);
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Failed to update payment status. Please try again.");
    }
  };

  const handleSendReminder = (payment: Payment) => {
    // In a real app, this would send an email/SMS reminder
    alert(
      `Payment reminder sent to ${getClientName(payment.clientId)}\n\nAmount: $${payment.amount}\nDue: ${new Date(payment.date).toLocaleDateString()}\nMethod: ${payment.method.replace("-", " ")}`,
    );
  };

  const handleDeletePayment = async (payment: Payment) => {
    if (
      confirm(
        `Are you sure you want to delete this payment record?\n\nClient: ${getClientName(payment.clientId)}\nAmount: $${payment.amount}\n\nThis action cannot be undone.`,
      )
    ) {
      try {
        await deletePayment(payment.id);
        alert("Payment record deleted successfully.");
      } catch (error) {
        console.error("Error deleting payment:", error);
        alert("Failed to delete payment. Please try again.");
      }
    }
  };

  // Get payment method display info
  const getPaymentMethodInfo = (method: string) => {
    switch (method) {
      case "bank-transfer":
        return {
          label: "Bank Transfer",
          color: "bg-blue-100 text-blue-800",
          icon: "🏦",
        };
      case "card":
        return {
          label: "Credit/Debit Card",
          color: "bg-green-100 text-green-800",
          icon: "💳",
        };
      case "cash":
        return {
          label: "Cash",
          color: "bg-gray-100 text-gray-800",
          icon: "💵",
        };
      case "venmo":
        return {
          label: "Venmo",
          color: "bg-purple-100 text-purple-800",
          icon: "📱",
        };
      case "paypal":
        return {
          label: "PayPal",
          color: "bg-blue-100 text-blue-800",
          icon: "🅿️",
        };
      default:
        return {
          label: method,
          color: "bg-gray-100 text-gray-800",
          icon: "💰",
        };
    }
  };

  // Get overdue payments
  const getOverduePayments = () => {
    const today = new Date();
    return payments.filter(
      (p) => p.status === "pending" && new Date(p.date) < today,
    );
  };

  const filteredPayments = payments.filter((payment) => {
    const clientName = getClientName(payment.clientId);
    const matchesSearch =
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    const matchesMethod =
      methodFilter === "all" || payment.method === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Calculate totals
  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((total, p) => total + p.amount, 0);

  const pendingAmount = payments
    .filter((p) => p.status === "pending")
    .reduce((total, p) => total + p.amount, 0);

  const thisMonthRevenue = payments
    .filter((p) => {
      const paymentDate = new Date(p.date);
      const now = new Date();
      return (
        paymentDate.getMonth() === now.getMonth() &&
        paymentDate.getFullYear() === now.getFullYear() &&
        p.status === "completed"
      );
    })
    .reduce((total, p) => total + p.amount, 0);

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
          <h1 className="text-3xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground">
            Track payments and manage your revenue.
          </p>
        </div>
        <AddPaymentDialog />
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              ${thisMonthRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current month revenue
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {payments.filter((p) => p.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">
              ${pendingAmount.toFixed(2)} outstanding
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Payments
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">Payment records</p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {payments.length === 0 && (
        <Card className="border-2 border-dashed border-muted-foreground/25 bg-muted/5">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
              <DollarSign className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Payments Yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Start recording payments from your clients. Track revenue and
              manage your business finances.
            </p>
            <AddPaymentDialog />
          </CardContent>
        </Card>
      )}

      {payments.length > 0 && (
        <>
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search payments by client or description..."
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
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="All Methods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="venmo">Venmo</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Overdue Payments Alert */}
          {getOverduePayments().length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-900">
                    {getOverduePayments().length} Overdue Payment
                    {getOverduePayments().length > 1 ? "s" : ""}
                  </h3>
                </div>
                <p className="text-sm text-orange-700">
                  You have overdue payments totaling $
                  {getOverduePayments()
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toFixed(2)}
                  . Consider sending payment reminders to clients.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Payments List */}
          <div className="space-y-4">
            {filteredPayments.map((payment) => {
              const isOverdue =
                payment.status === "pending" &&
                new Date(payment.date) < new Date();
              const methodInfo = getPaymentMethodInfo(payment.method);

              return (
                <Card
                  key={payment.id}
                  className={`hover:shadow-md transition-shadow ${
                    isOverdue ? "border-orange-200 bg-orange-50/30" : ""
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(payment.status)}
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                            {isOverdue && " (OVERDUE)"}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            ${payment.amount.toFixed(2)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {getClientName(payment.clientId)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {payment.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm">{methodInfo.icon}</span>
                            <Badge
                              variant="outline"
                              className={methodInfo.color}
                            >
                              {methodInfo.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {isOverdue ? "Due: " : ""}
                            {new Date(payment.date).toLocaleDateString()}
                          </p>
                          {payment.sessionId && (
                            <p className="text-xs text-muted-foreground">
                              Session #{payment.sessionId}
                            </p>
                          )}
                        </div>

                        {/* Action Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {payment.status === "pending" && (
                              <DropdownMenuItem
                                onClick={() => handleMarkAsPaid(payment)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Paid
                              </DropdownMenuItem>
                            )}
                            {payment.status === "pending" && (
                              <DropdownMenuItem
                                onClick={() => handleSendReminder(payment)}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Send Reminder
                              </DropdownMenuItem>
                            )}
                            {payment.status === "pending" && (
                              <DropdownMenuItem
                                onClick={() => handleMarkAsFailed(payment)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Mark as Failed
                              </DropdownMenuItem>
                            )}
                            {payment.status === "failed" && (
                              <DropdownMenuItem
                                onClick={() => handleMarkAsPaid(payment)}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Retry Payment
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeletePayment(payment)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredPayments.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">
                  No payments found
                </h3>
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

export default Payments;
