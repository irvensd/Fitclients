import { createContext, useContext, useState, useEffect } from "react";
import { mockClients, mockSessions, mockPayments } from "@/lib/mockData";
import { Client, Session, Payment } from "@/lib/types";
import {
  ClientWithStatus,
  archiveExcessClients,
  reactivateAllClients,
  getActiveClients,
} from "@/lib/clientDowngrade";

interface DataContextType {
  clients: ClientWithStatus[];
  sessions: Session[];
  payments: Payment[];
  loading: boolean;
  error: string | null;

  // Client operations
  addClient: (client: Omit<Client, "id">) => Promise<Client>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClientName: (id: string) => string;

  // Client status operations
  archiveClients: (clientIds: string[], reason?: string) => Promise<void>;
  reactivateClients: (clientIds: string[]) => Promise<void>;
  handlePlanDowngrade: (
    newLimit: number,
    selectedActiveIds: string[],
  ) => Promise<void>;
  getActiveClients: () => ClientWithStatus[];
  getArchivedClients: () => ClientWithStatus[];

  // Session operations
  addSession: (session: Omit<Session, "id">) => Promise<Session>;
  updateSession: (id: string, updates: Partial<Session>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;

  // Payment operations
  addPayment: (payment: Omit<Payment, "id">) => Promise<Payment>;
  updatePayment: (id: string, updates: Partial<Payment>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [clients, setClients] = useState<ClientWithStatus[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      // Initialize clients with active status
      const clientsWithStatus: ClientWithStatus[] = mockClients.map(
        (client) => ({
          ...client,
          status: {
            isActive: true,
            archivedAt: undefined,
            archiveReason: undefined,
          },
        }),
      );

      setClients(clientsWithStatus);
      setSessions(mockSessions);
      setPayments(mockPayments);
      setLoading(false);
    }, 1000);
  }, []);

  // Generate unique ID
  const generateId = () => {
    return Date.now().toString();
  };

  // Client operations
  const addClient = async (clientData: Omit<Client, "id">): Promise<Client> => {
    const newClient = {
      ...clientData,
      id: generateId(),
      dateJoined: new Date().toISOString().split("T")[0],
    };

    const clientWithStatus: ClientWithStatus = {
      ...newClient,
      status: {
        isActive: true,
        archivedAt: undefined,
        archiveReason: undefined,
      },
    };

    setClients((prev) => [...prev, clientWithStatus]);
    return newClient;
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === id ? { ...client, ...updates } : client,
      ),
    );
  };

  const deleteClient = async (id: string) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
    // Also remove related sessions and payments
    setSessions((prev) => prev.filter((session) => session.clientId !== id));
    setPayments((prev) => prev.filter((payment) => payment.clientId !== id));
  };

  const getClientName = (id: string): string => {
    const client = clients.find((c) => c.id === id);
    return client?.name || "Unknown Client";
  };

  // Client status operations
  const archiveClients = async (
    clientIds: string[],
    reason: string = "manual",
  ) => {
    const now = new Date().toISOString();
    setClients((prev) =>
      prev.map((client) =>
        clientIds.includes(client.id)
          ? {
              ...client,
              status: {
                isActive: false,
                archivedAt: now,
                archiveReason: reason as "plan_downgrade" | "manual",
              },
            }
          : client,
      ),
    );
  };

  const reactivateClients = async (clientIds: string[]) => {
    setClients((prev) =>
      prev.map((client) =>
        clientIds.includes(client.id)
          ? {
              ...client,
              status: {
                isActive: true,
                archivedAt: undefined,
                archiveReason: undefined,
              },
            }
          : client,
      ),
    );
  };

  const handlePlanDowngrade = async (
    newLimit: number,
    selectedActiveIds: string[],
  ) => {
    const plainClients = clients.map(({ status, ...client }) => client);
    const updatedClients = archiveExcessClients(
      plainClients,
      newLimit,
      selectedActiveIds,
    );
    setClients(updatedClients);
  };

  const getActiveClientsOnly = () => {
    return getActiveClients(clients);
  };

  const getArchivedClientsOnly = () => {
    return clients.filter((client) => !client.status.isActive);
  };

  // Session operations
  const addSession = async (
    sessionData: Omit<Session, "id">,
  ): Promise<Session> => {
    const newSession = {
      ...sessionData,
      id: generateId(),
    };
    setSessions((prev) => [...prev, newSession]);
    return newSession;
  };

  const updateSession = async (id: string, updates: Partial<Session>) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id ? { ...session, ...updates } : session,
      ),
    );
  };

  const deleteSession = async (id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id));
  };

  // Payment operations
  const addPayment = async (
    paymentData: Omit<Payment, "id">,
  ): Promise<Payment> => {
    const newPayment = {
      ...paymentData,
      id: generateId(),
    };
    setPayments((prev) => [...prev, newPayment]);
    return newPayment;
  };

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === id ? { ...payment, ...updates } : payment,
      ),
    );
  };

  const deletePayment = async (id: string) => {
    setPayments((prev) => prev.filter((payment) => payment.id !== id));
  };

  const value = {
    clients,
    sessions,
    payments,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient,
    getClientName,
    archiveClients,
    reactivateClients,
    handlePlanDowngrade,
    getActiveClients: getActiveClientsOnly,
    getArchivedClients: getArchivedClientsOnly,
    addSession,
    updateSession,
    deleteSession,
    addPayment,
    updatePayment,
    deletePayment,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export { DataProvider };
