import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  clientsService,
  sessionsService,
  paymentsService,
  analyticsService,
} from "@/lib/firebaseService";
import { Client, Session, Payment } from "@/lib/types";

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

    // For demo account, use empty data to simulate new account
    if (user.email === "trainer@demo.com") {
      setClients([]);
      setSessions([]);
      setPayments([]);
      setLoading(false);
      return;
    }

    const userId = user.email; // Using email as userId for simplicity
    setLoading(true);
    setError(null);

    // Initialize trainer profile if needed
    analyticsService
      .initializeTrainerProfile(userId, user.email)
      .catch(console.error);

    // Subscribe to real-time data updates
    const unsubscribeClients = clientsService.subscribeToClients(
      userId,
      (newClients) => {
        setClients(newClients);
      },
    );

    const unsubscribeSessions = sessionsService.subscribeToSessions(
      userId,
      (newSessions) => {
        setSessions(newSessions);
      },
    );

    const unsubscribePayments = paymentsService.subscribeToPayments(
      userId,
      (newPayments) => {
        setPayments(newPayments);
        setLoading(false);
      },
    );

    // Cleanup subscriptions
    return () => {
      unsubscribeClients();
      unsubscribeSessions();
      unsubscribePayments();
    };
  }, [user]);

  // Client actions
  const addClient = async (client: Omit<Client, "id">) => {
    if (!user?.email) throw new Error("User not authenticated");
    try {
      await clientsService.addClient(user.email, client);
    } catch (err) {
      setError("Failed to add client");
      throw err;
    }
  };

  const updateClient = async (clientId: string, updates: Partial<Client>) => {
    if (!user?.email) throw new Error("User not authenticated");
    try {
      await clientsService.updateClient(user.email, clientId, updates);
    } catch (err) {
      setError("Failed to update client");
      throw err;
    }
  };

  const deleteClient = async (clientId: string) => {
    if (!user?.email) throw new Error("User not authenticated");
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
    try {
      await sessionsService.updateSession(user.email, sessionId, updates);
    } catch (err) {
      setError("Failed to update session");
      throw err;
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!user?.email) throw new Error("User not authenticated");
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
    try {
      await paymentsService.updatePayment(user.email, paymentId, updates);
    } catch (err) {
      setError("Failed to update payment");
      throw err;
    }
  };

  const deletePayment = async (paymentId: string) => {
    if (!user?.email) throw new Error("User not authenticated");
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
