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
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { DemoPaymentBanner } from "@/components/DemoPaymentBanner";
import { LoadingPage } from "@/components/ui/loading";
import { InputDialog } from "@/components/ui/input-dialog";
import { logger, logApiError } from "@/lib/logger";

const getStatusBorderColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500";
    case "pending":
      return "bg-orange-500";
    case "failed":
      return "bg-red-500";
    default:
      return "bg-gray-500";
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
  const { toast } = useToast();
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
    
    // Enhanced validation
    if (!formData.clientId) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select a client for this payment.",
      });
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter a valid payment amount greater than $0.",
      });
      return;
    }
    
    if (!formData.method) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select a payment method.",
      });
      return;
    }
    
    if (!formData.date) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select a payment date.",
      });
      return;
    }
    
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
        description: formData.description.trim(),
        date: formData.date,
      });

      toast({
        title: "Payment Recorded",
        description: `A payment of $${parseFloat(formData.amount).toFixed(2)} for ${
          clients.find((c) => c.id === formData.clientId)?.name
        } has been recorded.`,
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
      logger.error("Error adding payment:", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Failed to record payment. Please check your connection and try again.",
      });
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

const CustomDeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  payment,
  getClientName,
  isDeleting,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  payment: Payment | null;
  getClientName: (id: string) => string;
  isDeleting: boolean;
}) => {
  if (!open || !payment) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <div className="bg-card p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
        <h2 className="text-lg font-bold text-foreground">Are you absolutely sure?</h2>
        <p className="text-sm text-muted-foreground mt-2">
          This action cannot be undone. This will permanently delete the payment
          record of{" "}
          <span className="font-semibold text-foreground">${payment.amount.toFixed(2)}</span> for{" "}
          <span className="font-semibold text-foreground">
            {getClientName(payment.clientId)}
          </span>
          .
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const { toast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [paymentToFail, setPaymentToFail] = useState<Payment | null>(null);
  const [showFailureReasonDialog, setShowFailureReasonDialog] = useState(false);
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
      toast({
        title: "Payment Updated",
        description: `Payment of $${payment.amount.toFixed(2)} for ${getClientName(payment.clientId)} marked as completed.`,
      });
    } catch (error) {
      logger.error("Error updating payment:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update payment status. Please check your connection and try again.",
      });
    }
  };

  const handleMarkAsFailed = (payment: Payment) => {
    setPaymentToFail(payment);
    setShowFailureReasonDialog(true);
  };

  const confirmMarkAsFailed = async (reason: string) => {
    if (!paymentToFail) return;
    
    try {
      await updatePayment(paymentToFail.id, {
        status: "failed",
        description:
          paymentToFail.description +
          (reason ? ` - Failed: ${reason}` : " - Payment failed"),
      });
      toast({
        title: "Payment Updated",
        description: `Payment of $${paymentToFail.amount.toFixed(2)} for ${getClientName(
          paymentToFail.clientId,
        )} marked as failed.`,
      });
    } catch (error) {
      logApiError("marking payment as failed", error, { 
        paymentId: paymentToFail.id, 
        clientId: paymentToFail.clientId,
        reason 
      });
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update payment status. Please check your connection and try again.",
      });
    } finally {
      setPaymentToFail(null);
      setShowFailureReasonDialog(false);
    }
  };

  const handleSendReminder = (payment: Payment) => {
    // In a real app, this would send an email/SMS reminder
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent to ${getClientName(
        payment.clientId,
      )}.`,
    });
  };

  const handleDeleteRequest = (payment: Payment) => {
    setDeleteTarget(payment);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deletePayment(deleteTarget.id);
      toast({
        title: "Payment Deleted",
        description: `Payment record of $${deleteTarget.amount.toFixed(2)} for ${getClientName(deleteTarget.clientId)} has been successfully deleted.`,
      });
    } catch (error) {
      logger.error("Error deleting payment:", error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "Failed to delete payment. Please check your connection and try again.",
      });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
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
    return <LoadingPage text="Loading payments..." />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Demo Payment Banner */}
      <DemoPaymentBanner variant="compact" />
      
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
                    aria-label="Search payments"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[160px]" aria-label="Filter by payment status">
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
                  <SelectTrigger className="w-full sm:w-[160px]" aria-label="Filter by payment method">
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPayments.map((payment) => {
              const client = clients.find((c) => c.id === payment.clientId);
              const clientInfo = {
                name: client?.name || "Unknown Client",
                avatarUrl: client?.avatar || "",
                initials:
                  client?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "??",
              };
              const isOverdue =
                payment.status === "pending" &&
                new Date(payment.date) < new Date();
              const methodInfo = getPaymentMethodInfo(payment.method);

              return (
                <Card
                  key={payment.id}
                  className="relative flex flex-col overflow-hidden transition-all hover:shadow-lg"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      // Could open payment details dialog here
                    }
                  }}
                  role="button"
                  aria-label={`Payment from ${clientInfo.name} for $${payment.amount.toFixed(2)} - Status: ${payment.status}${isOverdue ? ' (Overdue)' : ''}`}
                >
                  <div
                    className={cn(
                      "absolute left-0 top-0 h-full w-1.5",
                      isOverdue
                        ? "bg-orange-500"
                        : getStatusBorderColor(payment.status),
                    )}
                  />
                  <CardHeader className="pl-6 flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage
                          src={clientInfo.avatarUrl}
                          alt={clientInfo.name}
                        />
                        <AvatarFallback>{clientInfo.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base font-semibold">
                          {clientInfo.name}
                        </CardTitle>
                        <CardDescription>
                          ${payment.amount.toFixed(2)}
                        </CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0"
                          aria-label={`Payment actions for ${clientInfo.name}`}
                          title="Payment actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {payment.status === "pending" && (
                          <DropdownMenuItem
                            onClick={() => handleMarkAsPaid(payment)}
                            aria-label={`Mark payment from ${clientInfo.name} as paid`}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Paid
                          </DropdownMenuItem>
                        )}
                        {payment.status === "pending" && (
                          <DropdownMenuItem
                            onClick={() => handleSendReminder(payment)}
                            aria-label={`Send payment reminder to ${clientInfo.name}`}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Send Reminder
                          </DropdownMenuItem>
                        )}
                        {payment.status === "pending" && (
                          <DropdownMenuItem
                            onClick={() => handleMarkAsFailed(payment)}
                            aria-label={`Mark payment from ${clientInfo.name} as failed`}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Mark as Failed
                          </DropdownMenuItem>
                        )}
                        {payment.status === "failed" && (
                          <DropdownMenuItem
                            onClick={() => handleMarkAsPaid(payment)}
                            aria-label={`Retry payment from ${clientInfo.name}`}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry Payment
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteRequest(payment)}
                          aria-label={`Delete payment record for ${clientInfo.name}`}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Record
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="pl-6 pb-4 flex-grow">
                    <div className="text-sm text-muted-foreground space-y-3 mt-4">
                      <div className="flex items-center justify-between">
                        <span>Status</span>
                        <Badge
                          className={cn(
                            "text-xs",
                            getStatusColor(payment.status),
                          )}
                        >
                          {payment.status.charAt(0).toUpperCase() +
                            payment.status.slice(1)}
                          {isOverdue && " (Overdue)"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Method</span>
                        <span className="font-medium text-foreground">
                          {methodInfo.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Date</span>
                        <span className="font-medium text-foreground">
                          {new Date(payment.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {payment.description && (
                      <p className="text-sm text-muted-foreground mt-4 pt-4 border-t">
                        {payment.description}
                      </p>
                    )}
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

          <CustomDeleteConfirmationDialog
            open={!!deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleConfirmDelete}
            payment={deleteTarget}
            getClientName={getClientName}
            isDeleting={isDeleting}
          />

          <InputDialog
            open={showFailureReasonDialog}
            onOpenChange={setShowFailureReasonDialog}
            title="Payment Failure Reason"
            description="Please provide a reason for the payment failure (optional):"
            placeholder="e.g., Insufficient funds, Card declined, etc."
            confirmText="Mark as Failed"
            cancelText="Cancel"
            onConfirm={confirmMarkAsFailed}
          />
        </>
      )}
    </div>
  );
};

export default Payments;
