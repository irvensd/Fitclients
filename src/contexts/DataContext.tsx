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

  // Client actions (offline mode)
  const addClient = async (client: Omit<Client, "id">) => {
    if (!user?.email) throw new Error("User not authenticated");

    // OFFLINE MODE: Add to local state with generated ID
    const newClient: Client = {
      ...client,
      id: Date.now().toString(), // Simple ID generation
      dateJoined: new Date().toISOString().split("T")[0],
    };
    setClients((prev) => [newClient, ...prev]);

    console.log("Added client in offline mode:", newClient);

    // TODO: When Firebase is working, uncomment this:
    /*
    try {
      await clientsService.addClient(user.email, client);
    } catch (err) {
      setError("Failed to add client");
      throw err;
    }
    */
  };

  const updateClient = async (clientId: string, updates: Partial<Client>) => {
    if (!user?.email) throw new Error("User not authenticated");

    // OFFLINE MODE: Update local state
    setClients((prev) =>
      prev.map((client) =>
        client.id === clientId ? { ...client, ...updates } : client,
      ),
    );
    console.log("Updated client in offline mode:", clientId, updates);
  };

  const deleteClient = async (clientId: string) => {
    if (!user?.email) throw new Error("User not authenticated");

    // OFFLINE MODE: Remove from local state
    setClients((prev) => prev.filter((client) => client.id !== clientId));
    console.log("Deleted client in offline mode:", clientId);
  };

  // Session actions (offline mode)
  const addSession = async (session: Omit<Session, "id">) => {
    if (!user?.email) throw new Error("User not authenticated");

    // OFFLINE MODE: Add to local state
    const newSession: Session = {
      ...session,
      id: Date.now().toString(),
    };
    setSessions((prev) => [newSession, ...prev]);
    console.log("Added session in offline mode:", newSession);
  };

  const updateSession = async (
    sessionId: string,
    updates: Partial<Session>,
  ) => {
    if (!user?.email) throw new Error("User not authenticated");

    // OFFLINE MODE: Update local state
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? { ...session, ...updates } : session,
      ),
    );
    console.log("Updated session in offline mode:", sessionId, updates);
  };

  const deleteSession = async (sessionId: string) => {
    if (!user?.email) throw new Error("User not authenticated");

    // OFFLINE MODE: Remove from local state
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
    console.log("Deleted session in offline mode:", sessionId);
  };

  // Payment actions (offline mode)
  const addPayment = async (payment: Omit<Payment, "id">) => {
    if (!user?.email) throw new Error("User not authenticated");

    // OFFLINE MODE: Add to local state
    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString(),
    };
    setPayments((prev) => [newPayment, ...prev]);
    console.log("Added payment in offline mode:", newPayment);
  };

  const updatePayment = async (
    paymentId: string,
    updates: Partial<Payment>,
  ) => {
    if (!user?.email) throw new Error("User not authenticated");

    // OFFLINE MODE: Update local state
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === paymentId ? { ...payment, ...updates } : payment,
      ),
    );
    console.log("Updated payment in offline mode:", paymentId, updates);
  };

  const deletePayment = async (paymentId: string) => {
    if (!user?.email) throw new Error("User not authenticated");

    // OFFLINE MODE: Remove from local state
    setPayments((prev) => prev.filter((payment) => payment.id !== paymentId));
    console.log("Deleted payment in offline mode:", paymentId);
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
