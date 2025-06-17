import { mockClients, mockSessions, mockPayments } from "./mockData";
import { DashboardStats } from "./types";

/**
 * Calculate dynamic dashboard metrics from current data
 */
export const calculateDashboardStats = (): DashboardStats => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Total clients
  const totalClients = mockClients.length;

  // Sessions today
  const todayString = today.toISOString().split("T")[0];
  const sessionsToday = mockSessions.filter(
    (session) =>
      session.date === todayString &&
      (session.status === "scheduled" || session.status === "completed"),
  ).length;

  // Upcoming sessions in the next 7 days
  const upcomingSessions = mockSessions.filter((session) => {
    const sessionDate = new Date(session.date);
    return (
      sessionDate >= today &&
      sessionDate <= nextWeek &&
      session.status === "scheduled"
    );
  }).length;

  // Monthly revenue (completed payments this month)
  const monthlyRevenue = mockPayments
    .filter((payment) => {
      const paymentDate = new Date(payment.date);
      return (
        paymentDate.getMonth() === currentMonth &&
        paymentDate.getFullYear() === currentYear &&
        payment.status === "completed"
      );
    })
    .reduce((total, payment) => total + payment.amount, 0);

  // Active workout plans (for now, assume each client has 1 active plan)
  const activeWorkoutPlans = mockClients.length;

  // Pending payments (unpaid invoices)
  const pendingPayments = mockPayments.filter(
    (payment) => payment.status === "pending",
  ).length;

  return {
    totalClients,
    sessionsToday,
    sessionsThisWeek: upcomingSessions,
    monthlyRevenue,
    activeWorkoutPlans,
    pendingPayments,
  };
};

/**
 * Get upcoming sessions for the next 7 days
 */
export const getUpcomingSessions = () => {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  return mockSessions.filter((session) => {
    const sessionDate = new Date(session.date);
    return (
      sessionDate >= today &&
      sessionDate <= nextWeek &&
      session.status === "scheduled"
    );
  });
};

/**
 * Get recent client cancellations
 */
export const getRecentCancellations = () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return mockSessions.filter((session) => {
    if (session.status !== "cancelled" || !session.cancelledAt) return false;

    const cancelledDate = new Date(session.cancelledAt);
    return cancelledDate >= oneWeekAgo && session.cancelledBy === "client";
  });
};

/**
 * Get today's sessions
 */
export const getTodaysSessions = () => {
  const today = new Date().toISOString().split("T")[0];

  return mockSessions.filter((session) => session.date === today);
};

/**
 * Get recent clients (joined in the last 30 days)
 */
export const getRecentClients = () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return mockClients
    .filter((client) => {
      const joinDate = new Date(client.dateJoined);
      return joinDate >= thirtyDaysAgo;
    })
    .sort(
      (a, b) =>
        new Date(b.dateJoined).getTime() - new Date(a.dateJoined).getTime(),
    )
    .slice(0, 3); // Get the 3 most recent
};

/**
 * Calculate outstanding amount from unpaid invoices
 */
export const getOutstandingAmount = (): number => {
  return mockPayments
    .filter((payment) => payment.status === "pending")
    .reduce((total, payment) => total + payment.amount, 0);
};
