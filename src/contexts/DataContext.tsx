import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  clientsService,
  sessionsService,
  paymentsService,
  analyticsService,
} from "@/lib/firebaseService";
import { Client, Session, Payment } from "@/lib/types";
import { mockClients, mockSessions, mockPayments } from "@/lib/mockData";

interface DataContextType {
  clients: Client[];
  sessions: Session[];
  payments: Payment[];
  loading: boolean;
  error: string | null;

  // Client actions
  addClient: (client: Omit<Client, "id">) => Promise<void>;
  updateClient: (clientId: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (clientId: string) => Promise<void>;

  // Session actions
  addSession: (session: Omit<Session, "id">) => Promise<void>;
  updateSession: (
    sessionId: string,
    updates: Partial<Session>,
  ) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;

  // Payment actions
  addPayment: (payment: Omit<Payment, "id">) => Promise<void>;
  updatePayment: (
    paymentId: string,
    updates: Partial<Payment>,
  ) => Promise<void>;
  deletePayment: (paymentId: string) => Promise<void>;

  // Helper functions
  getClientName: (clientId: string) => string;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get client name
  const getClientName = (clientId: string): string => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : "Unknown Client";
  };

  // Initialize data when user logs in
  useEffect(() => {
    if (!user?.email) {
      setClients([]);
      setSessions([]);
      setPayments([]);
      setLoading(false);
      return;
    }

    // For demo account, use comprehensive mock data to showcase features
    if (user.email === "trainer@demo.com") {
      setClients(mockClients);
      setSessions(mockSessions);
      setPayments(mockPayments);

      // Add demo progress data to localStorage
      const demoProgressData = [
        {
          id: "prog1",
          clientId: "1", // Sarah Johnson
          date: "2024-01-15",
          weight: 165,
          bodyFat: 22,
          measurements: {
            chest: 36,
            waist: 30,
            hips: 38,
            arms: 12,
            thighs: 24,
          },
          notes: "Initial measurements",
        },
        {
          id: "prog2",
          clientId: "1",
          date: "2024-01-29",
          weight: 162,
          bodyFat: 21,
          measurements: {
            chest: 35.5,
            waist: 29,
            hips: 37.5,
            arms: 12.2,
            thighs: 23.5,
          },
          notes: "Great progress after 2 weeks!",
        },
        {
          id: "prog3",
          clientId: "1",
          date: "2024-02-12",
          weight: 159,
          bodyFat: 19.5,
          measurements: {
            chest: 35,
            waist: 28,
            hips: 37,
            arms: 12.5,
            thighs: 23,
          },
          notes: "Excellent consistency - lost 6 lbs!",
        },
        {
          id: "prog4",
          clientId: "2", // Mike Chen
          date: "2024-02-03",
          weight: 180,
          bodyFat: 15,
          measurements: {
            chest: 42,
            waist: 32,
            hips: 40,
            arms: 15,
            thighs: 26,
          },
          notes: "Starting bulk phase",
        },
        {
          id: "prog5",
          clientId: "2",
          date: "2024-02-17",
          weight: 183,
          bodyFat: 15.5,
          measurements: {
            chest: 43,
            waist: 32.5,
            hips: 40.5,
            arms: 15.5,
            thighs: 26.5,
          },
          notes: "Good muscle gain, staying lean",
        },
        {
          id: "prog6",
          clientId: "3", // Emily Davis
          date: "2024-01-28",
          weight: 135,
          bodyFat: 18,
          measurements: {
            chest: 34,
            waist: 26,
            hips: 36,
            arms: 10.5,
            thighs: 21,
          },
          notes: "Marathon training baseline",
        },
      ];
      localStorage.setItem("progressEntries", JSON.stringify(demoProgressData));

      // Add demo workout plans
      const demoWorkoutPlans = [
        {
          id: "workout1",
          clientId: "1", // Sarah Johnson
          name: "Fat Loss Circuit",
          description: "High-intensity circuit training for weight loss",
          exercises: [
            { name: "Burpees", sets: 3, reps: "10", rest: "30s" },
            { name: "Mountain Climbers", sets: 3, reps: "20", rest: "30s" },
            { name: "Jump Squats", sets: 3, reps: "15", rest: "30s" },
            { name: "Push-ups", sets: 3, reps: "12", rest: "30s" },
            { name: "Plank", sets: 3, reps: "45s", rest: "30s" },
          ],
          createdAt: "2024-01-15",
          lastUsed: "2024-02-10",
        },
        {
          id: "workout2",
          clientId: "2", // Mike Chen
          name: "Upper Body Strength",
          description: "Compound movements for muscle building",
          exercises: [
            { name: "Bench Press", sets: 4, reps: "8-10", rest: "2min" },
            { name: "Pull-ups", sets: 4, reps: "6-8", rest: "2min" },
            { name: "Overhead Press", sets: 3, reps: "8-10", rest: "90s" },
            { name: "Barbell Rows", sets: 3, reps: "10-12", rest: "90s" },
            { name: "Dips", sets: 3, reps: "10-15", rest: "60s" },
          ],
          createdAt: "2024-02-03",
          lastUsed: "2024-02-15",
        },
        {
          id: "workout3",
          clientId: "3", // Emily Davis
          name: "Marathon Base Training",
          description: "Endurance and strength for distance running",
          exercises: [
            { name: "Easy Run", sets: 1, reps: "45min", rest: "-" },
            { name: "Lunges", sets: 3, reps: "12 each leg", rest: "45s" },
            {
              name: "Single Leg Deadlifts",
              sets: 3,
              reps: "10 each",
              rest: "45s",
            },
            { name: "Calf Raises", sets: 3, reps: "20", rest: "30s" },
            { name: "Core Circuit", sets: 3, reps: "60s", rest: "30s" },
          ],
          createdAt: "2024-01-28",
          lastUsed: "2024-02-12",
        },
      ];
      localStorage.setItem("workoutPlans", JSON.stringify(demoWorkoutPlans));

      setLoading(false);
      return;
    }
    const userId = user.email; // Using email as userId for simplicity
    setLoading(true);
    setError(null);

    // Initialize trainer profile if needed
    analyticsService
      .initializeTrainerProfile(userId, user.email)
      .catch((error) => {
        console.error("Failed to initialize trainer profile:", error);
        // Don't fail completely if this doesn't work
      });

    try {
      // Subscribe to real-time data updates with error handling
      const unsubscribeClients = clientsService.subscribeToClients(
        userId,
        (newClients) => {
          setClients(newClients);
          setError(null); // Clear error on successful data load
        },
        (error) => {
          console.error("Error subscribing to clients:", error);
          setError("Unable to connect to database. Using offline mode.");
          setClients([]); // Set empty data for new accounts
        },
      );

      const unsubscribeSessions = sessionsService.subscribeToSessions(
        userId,
        (newSessions) => {
          setSessions(newSessions);
          setError(null);
        },
        (error) => {
          console.error("Error subscribing to sessions:", error);
          setError("Unable to connect to database. Using offline mode.");
          setSessions([]);
        },
      );

      const unsubscribePayments = paymentsService.subscribeToPayments(
        userId,
        (newPayments) => {
          setPayments(newPayments);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error("Error subscribing to payments:", error);
          setError("Unable to connect to database. Using offline mode.");
          setPayments([]);
          setLoading(false);
        },
      );

      // Cleanup subscriptions
      return () => {
        try {
          unsubscribeClients();
          unsubscribeSessions();
          unsubscribePayments();
        } catch (error) {
          console.error("Error unsubscribing:", error);
        }
      };
    } catch (error) {
      console.error("Error setting up Firebase subscriptions:", error);
      setError("Unable to connect to database. Using offline mode.");
      setClients([]);
      setSessions([]);
      setPayments([]);
      setLoading(false);
    }
  }, [user]);

  // Client actions
  const addClient = async (client: Omit<Client, "id">) => {
    if (!user?.email) throw new Error("User not authenticated");

    // Demo account: use offline mode with realistic ID generation
    if (user.email === "trainer@demo.com") {
      const newClient: Client = {
        ...client,
        id: (Math.max(...clients.map((c) => parseInt(c.id))) + 1).toString(),
        dateJoined: new Date().toISOString().split("T")[0],
      };
      setClients((prev) => [newClient, ...prev]);
      return newClient;
    }

    try {
      await clientsService.addClient(user.email, client);
    } catch (err) {
      setError("Failed to add client");
      throw err;
    }
  };

  const updateClient = async (clientId: string, updates: Partial<Client>) => {
    if (!user?.email) throw new Error("User not authenticated");

    // Demo account: use offline mode
    if (user.email === "trainer@demo.com") {
      setClients((prev) =>
        prev.map((client) =>
          client.id === clientId ? { ...client, ...updates } : client,
        ),
      );
      return;
    }

    try {
      await clientsService.updateClient(user.email, clientId, updates);
    } catch (err) {
      setError("Failed to update client");
      throw err;
    }
  };

  const deleteClient = async (clientId: string) => {
    if (!user?.email) throw new Error("User not authenticated");

    // Demo account: use offline mode
    if (user.email === "trainer@demo.com") {
      setClients((prev) => prev.filter((client) => client.id !== clientId));
      return;
    }

    try {
      await clientsService.deleteClient(user.email, clientId);
    } catch (err) {
      setError("Failed to delete client");
      throw err;
    }
  };

  // Session actions
  const addSession = async (session: Omit<Session, "id">) => {
    if (!user?.email) throw new Error("User not authenticated");

    // Demo account: use offline mode
    if (user.email === "trainer@demo.com") {
      const newSession: Session = {
        ...session,
        id: Date.now().toString(),
      };
      setSessions((prev) => [newSession, ...prev]);
      return;
    }

    try {
      await sessionsService.addSession(user.email, session);
    } catch (err) {
      setError("Failed to add session");
      throw err;
    }
  };

  const updateSession = async (
    sessionId: string,
    updates: Partial<Session>,
  ) => {
    if (!user?.email) throw new Error("User not authenticated");

    // Demo account: use offline mode
    if (user.email === "trainer@demo.com") {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId ? { ...session, ...updates } : session,
        ),
      );
      return;
    }

    try {
      await sessionsService.updateSession(user.email, sessionId, updates);
    } catch (err) {
      setError("Failed to update session");
      throw err;
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!user?.email) throw new Error("User not authenticated");

    // Demo account: use offline mode
    if (user.email === "trainer@demo.com") {
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));
      return;
    }

    try {
      await sessionsService.deleteSession(user.email, sessionId);
    } catch (err) {
      setError("Failed to delete session");
      throw err;
    }
  };

  // Payment actions
  const addPayment = async (payment: Omit<Payment, "id">) => {
    if (!user?.email) throw new Error("User not authenticated");

    // Demo account: use offline mode
    if (user.email === "trainer@demo.com") {
      const newPayment: Payment = {
        ...payment,
        id: Date.now().toString(),
      };
      setPayments((prev) => [newPayment, ...prev]);
      return;
    }

    try {
      await paymentsService.addPayment(user.email, payment);
    } catch (err) {
      setError("Failed to add payment");
      throw err;
    }
  };

  const updatePayment = async (
    paymentId: string,
    updates: Partial<Payment>,
  ) => {
    if (!user?.email) throw new Error("User not authenticated");

    // Demo account: use offline mode
    if (user.email === "trainer@demo.com") {
      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === paymentId ? { ...payment, ...updates } : payment,
        ),
      );
      return;
    }

    try {
      await paymentsService.updatePayment(user.email, paymentId, updates);
    } catch (err) {
      setError("Failed to update payment");
      throw err;
    }
  };

  const deletePayment = async (paymentId: string) => {
    if (!user?.email) throw new Error("User not authenticated");

    // Demo account: use offline mode
    if (user.email === "trainer@demo.com") {
      setPayments((prev) => prev.filter((payment) => payment.id !== paymentId));
      return;
    }

    try {
      await paymentsService.deletePayment(user.email, paymentId);
    } catch (err) {
      setError("Failed to delete payment");
      throw err;
    }
  };

  const refreshData = () => {
    // Data refreshes automatically via subscriptions
    setError(null);
  };

  const value: DataContextType = {
    clients,
    sessions,
    payments,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient,
    addSession,
    updateSession,
    deleteSession,
    addPayment,
    updatePayment,
    deletePayment,
    getClientName,
    refreshData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
