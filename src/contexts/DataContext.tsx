import { createContext, useContext, useState, useEffect } from "react";
import { mockClients, mockSessions, mockPayments, mockWorkoutPlans } from "@/lib/mockData";
import { Client, Session, Payment, WorkoutPlan, ProgressEntry } from "@/lib/types";
import {
  ClientWithStatus,
  archiveExcessClients,
  reactivateAllClients,
  getActiveClients,
} from "@/lib/clientDowngrade";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, deleteField } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";

interface DataContextType {
  clients: ClientWithStatus[];
  sessions: Session[];
  payments: Payment[];
  progressEntries: ProgressEntry[];
  loading: boolean;
  error: string | null;
  workoutPlans: WorkoutPlan[];

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

  // Progress operations
  addProgressEntry: (entry: Omit<ProgressEntry, "id">) => Promise<ProgressEntry>;
  getClientProgressEntries: (clientId: string) => ProgressEntry[];
  deleteProgressEntry: (id: string) => Promise<void>;

  // Workout Plan operations
  addWorkoutPlan: (plan: Omit<WorkoutPlan, "id" | "createdDate">) => Promise<void>;
  updateWorkoutPlan: (planId: string, updates: Partial<WorkoutPlan>) => Promise<void>;
  deleteWorkoutPlan: (planId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [clients, setClients] = useState<ClientWithStatus[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Check if this is the demo account
    const isDemoAccount = user.email === "trainer@demo.com" || user.uid === "demo-user-123";

    if (isDemoAccount) {
      // Load mock data for demo account
      console.log("Loading mock data for demo account");
      setTimeout(() => {
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
        setWorkoutPlans(mockWorkoutPlans);
        setProgressEntries([]);
        setLoading(false);
      }, 1000);
    } else {
      // For real users, start with empty data and set up Firestore listeners
      console.log("Setting up Firestore listeners for real user:", user.uid);
      setClients([]);
      setSessions([]);
      setPayments([]);
      setWorkoutPlans([]);
      setProgressEntries([]);
      setLoading(false);

      // Set up Firestore listeners for real data
      const workoutPlansCollection = collection(db, "users", user.uid, "workoutPlans");
      const sessionsCollection = collection(db, "users", user.uid, "sessions");
      const clientsCollection = collection(db, "users", user.uid, "clients");
      
      const unsubscribeWorkoutPlans = onSnapshot(workoutPlansCollection, (snapshot) => {
        const plans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkoutPlan));
        console.log("Loaded workout plans from Firestore:", plans);
        setWorkoutPlans(plans);
      });

      const unsubscribeSessions = onSnapshot(sessionsCollection, (snapshot) => {
        const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
        console.log("Loaded sessions from Firestore:", sessions);
        setSessions(sessions);
      });

      const unsubscribeClients = onSnapshot(clientsCollection, (snapshot) => {
        const clients = snapshot.docs.map(doc => {
          const clientData = doc.data();
          return {
            ...clientData,
            id: doc.id,
            status: clientData.status || {
              isActive: true,
              archivedAt: undefined,
              archiveReason: undefined,
            },
          } as ClientWithStatus;
        });
        console.log("Loaded clients from Firestore:", clients);
        setClients(clients);
      });

      const paymentsCollection = collection(db, "users", user.uid, "payments");
      const unsubscribePayments = onSnapshot(paymentsCollection, (snapshot) => {
        const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
        console.log("Loaded payments from Firestore:", payments);
        setPayments(payments);
      });

      const progressEntriesCollection = collection(db, "users", user.uid, "progressEntries");
      const unsubscribeProgressEntries = onSnapshot(progressEntriesCollection, (snapshot) => {
        const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProgressEntry));
        console.log("Loaded progress entries from Firestore:", entries);
        setProgressEntries(entries);
      });

      return () => {
        unsubscribeWorkoutPlans();
        unsubscribeSessions();
        unsubscribeClients();
        unsubscribePayments();
        unsubscribeProgressEntries();
      };
    }
  }, [user]);

  // Generate unique ID
  const generateId = () => {
    return Date.now().toString();
  };

  // Client operations
  const addClient = async (clientData: Omit<Client, "id">): Promise<Client> => {
    const tempId = `temp-${generateId()}`;
    const newClient: Client = {
      ...clientData,
      id: tempId,
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

    try {
      if (!user) throw new Error("User not authenticated");
      const clientsCollection = collection(db, "users", user.uid, "clients");
      const { id, ...clientToSave } = newClient;
      const docRef = await addDoc(clientsCollection, clientToSave);

      // Update the client with the real ID from Firestore
      setClients((prev) =>
        prev.map((client) =>
          client.id === tempId ? { ...client, id: docRef.id } : client
        )
      );
      return { ...newClient, id: docRef.id };
    } catch (error) {
      setError("Failed to add client. Please try again.");
      // Revert the state change
      setClients((prev) => prev.filter((client) => client.id !== tempId));
      throw error;
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    const originalClients = clients;
    setClients((prev) =>
      prev.map((client) =>
        client.id === id ? { ...client, ...updates } : client,
      ),
    );

    try {
      if (!user) throw new Error("User not authenticated");
      const clientDoc = doc(db, "users", user.uid, "clients", id);
      await updateDoc(clientDoc, updates);
    } catch (error) {
      setError("Failed to update client. Please try again.");
      setClients(originalClients);
    }
  };

  const deleteClient = async (id: string) => {
    const originalClients = clients;
    setClients((prev) => prev.filter((client) => client.id !== id));
    // Also remove related sessions and payments
    setSessions((prev) => prev.filter((session) => session.clientId !== id));
    setPayments((prev) => prev.filter((payment) => payment.clientId !== id));
    try {
      if (!user) throw new Error("User not authenticated");
      const clientDoc = doc(db, "users", user.uid, "clients", id);
      await deleteDoc(clientDoc);
    } catch (error) {
      setError("Failed to delete client. Please try again.");
      setClients(originalClients);
    }
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
    const originalClients = clients;
    
    // Update local state immediately
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

    // Persist to Firebase
    try {
      if (!user) throw new Error("User not authenticated");
      
      const updatePromises = clientIds.map(async (clientId) => {
        const clientDoc = doc(db, "users", user.uid, "clients", clientId);
        return updateDoc(clientDoc, {
          status: {
            isActive: false,
            archivedAt: now,
            archiveReason: reason,
          },
        });
      });

      await Promise.all(updatePromises);
    } catch (error) {
      setError("Failed to archive clients. Please try again.");
      // Revert local state on error
      setClients(originalClients);
      throw error;
    }
  };

  const reactivateClients = async (clientIds: string[]) => {
    const originalClients = clients;
    
    // Update local state immediately
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

    // Persist to Firebase
    try {
      if (!user) throw new Error("User not authenticated");
      
      const updatePromises = clientIds.map(async (clientId) => {
        const clientDoc = doc(db, "users", user.uid, "clients", clientId);
        return updateDoc(clientDoc, {
          "status.isActive": true,
          "status.archivedAt": deleteField(),
          "status.archiveReason": deleteField(),
        });
      });

      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error reactivating clients:", error);
      setError("Failed to reactivate clients. Please try again.");
      // Revert local state on error
      setClients(originalClients);
      throw error;
    }
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
    const tempId = `temp-${generateId()}`;
    const newSession = {
      ...sessionData,
      id: tempId,
    };
    setSessions((prev) => [...prev, newSession]);

    try {
      if (!user) {
        console.error("User is not authenticated in addSession");
        throw new Error("User not authenticated");
      }
      
      if (!user.uid) {
        console.error("User UID is undefined:", user);
        throw new Error("User UID not available");
      }

      console.log("Adding session for user:", user.uid, "Session data:", sessionData);
      
      const sessionsCollection = collection(db, "users", user.uid, "sessions");
      const { id, ...sessionToSave } = newSession;
      const docRef = await addDoc(sessionsCollection, sessionToSave);

      setSessions((prev) =>
        prev.map((session) =>
          session.id === tempId ? { ...session, id: docRef.id } : session
        )
      );
      return { ...newSession, id: docRef.id };
    } catch (error) {
      console.error("Error in addSession:", error);
      setError("Failed to add session. Please try again.");
      setSessions((prev) => prev.filter((session) => session.id !== tempId));
      throw error;
    }
  };

  const updateSession = async (id: string, updates: Partial<Session>) => {
    const originalSessions = sessions;
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id ? { ...session, ...updates } : session,
      ),
    );

    try {
      if (!user) throw new Error("User not authenticated");
      const sessionDoc = doc(db, "users", user.uid, "sessions", id);
      await updateDoc(sessionDoc, updates);
    } catch (error) {
      setError("Failed to update session. Please try again.");
      setSessions(originalSessions);
    }
  };

  const deleteSession = async (id: string) => {
    const originalSessions = sessions;
    setSessions((prev) => prev.filter((session) => session.id !== id));

    try {
      if (!user) throw new Error("User not authenticated");
      const sessionDoc = doc(db, "users", user.uid, "sessions", id);
      await deleteDoc(sessionDoc);
    } catch (error) {
      setError("Failed to delete session. Please try again.");
      setSessions(originalSessions);
    }
  };

  // Payment operations
  const addPayment = async (
    paymentData: Omit<Payment, "id">,
  ): Promise<Payment> => {
    const tempId = `temp-${generateId()}`;
    const newPayment = {
      ...paymentData,
      id: tempId,
    };
    setPayments((prev) => [...prev, newPayment]);

    try {
      if (!user) throw new Error("User not authenticated");
      const paymentsCollection = collection(db, "users", user.uid, "payments");
      const { id, ...paymentToSave } = newPayment;
      const docRef = await addDoc(paymentsCollection, paymentToSave);

      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === tempId ? { ...payment, id: docRef.id } : payment
        )
      );
      return { ...newPayment, id: docRef.id };
    } catch (error) {
      setError("Failed to add payment. Please try again.");
      setPayments((prev) => prev.filter((payment) => payment.id !== tempId));
      throw error;
    }
  };

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    const originalPayments = payments;
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === id ? { ...payment, ...updates } : payment,
      ),
    );

    try {
      if (!user) throw new Error("User not authenticated");
      const paymentDoc = doc(db, "users", user.uid, "payments", id);
      await updateDoc(paymentDoc, updates);
    } catch (error) {
      setError("Failed to update payment. Please try again.");
      setPayments(originalPayments);
    }
  };

  const deletePayment = async (id: string) => {
    const originalPayments = payments;
    setPayments((prev) => prev.filter((payment) => payment.id !== id));

    try {
      if (!user) throw new Error("User not authenticated");
      const paymentDoc = doc(db, "users", user.uid, "payments", id);
      await deleteDoc(paymentDoc);
    } catch (error) {
      setError("Failed to delete payment. Please try again.");
      setPayments(originalPayments);
    }
  };

  const addWorkoutPlan = async (plan: Omit<WorkoutPlan, "id" | "createdDate">) => {
    const tempId = `temp-${generateId()}`;
    const newPlan = {
      ...plan,
      id: tempId,
      createdDate: new Date().toISOString(),
    };
    setWorkoutPlans((prev) => [...prev, newPlan]);

    try {
      if (!user) throw new Error("User not authenticated");
      const workoutPlansCollection = collection(db, "users", user.uid, "workoutPlans");
      const { id, ...planToSave } = newPlan;
      const docRef = await addDoc(workoutPlansCollection, planToSave);

      setWorkoutPlans((prev) =>
        prev.map((plan) =>
          plan.id === tempId ? { ...plan, id: docRef.id } : plan
        )
      );
    } catch (error) {
      setError("Failed to add workout plan. Please try again.");
      setWorkoutPlans((prev) => prev.filter((plan) => plan.id !== tempId));
      throw error;
    }
  };

  const updateWorkoutPlan = async (planId: string, updates: Partial<WorkoutPlan>) => {
    const originalPlans = workoutPlans;
    setWorkoutPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId ? { ...plan, ...updates } : plan,
      ),
    );

    try {
      if (!user) throw new Error("User not authenticated");
      const planDoc = doc(db, "users", user.uid, "workoutPlans", planId);
      await updateDoc(planDoc, updates);
    } catch (error) {
      setError("Failed to update workout plan. Please try again.");
      setWorkoutPlans(originalPlans);
      throw error;
    }
  };

  const deleteWorkoutPlan = async (planId: string) => {
    const originalPlans = workoutPlans;
    setWorkoutPlans((prev) => prev.filter((plan) => plan.id !== planId));

    try {
      if (!user) throw new Error("User not authenticated");
      const planDoc = doc(db, "users", user.uid, "workoutPlans", planId);
      await deleteDoc(planDoc);
    } catch (error) {
      setError("Failed to delete workout plan. Please try again.");
      setWorkoutPlans(originalPlans);
      throw error;
    }
  };

  const addProgressEntry = async (entry: Omit<ProgressEntry, "id">) => {
    const tempId = `temp-${generateId()}`;
    const newEntry = {
      ...entry,
      id: tempId,
    };
    setProgressEntries((prev) => [...prev, newEntry]);

    try {
      if (!user) throw new Error("User not authenticated");
      const progressEntriesCollection = collection(db, "users", user.uid, "progressEntries");
      const { id, ...entryToSave } = newEntry;
      const docRef = await addDoc(progressEntriesCollection, entryToSave);

      setProgressEntries((prev) =>
        prev.map((entry) =>
          entry.id === tempId ? { ...entry, id: docRef.id } : entry
        )
      );
      return { ...newEntry, id: docRef.id };
    } catch (error) {
      setError("Failed to add progress entry. Please try again.");
      setProgressEntries((prev) => prev.filter((entry) => entry.id !== tempId));
      throw error;
    }
  };

  const getClientProgressEntries = (clientId: string) => {
    return progressEntries.filter((entry) => entry.clientId === clientId);
  };

  const deleteProgressEntry = async (id: string) => {
    const originalProgressEntries = progressEntries;
    setProgressEntries((prev) => prev.filter((entry) => entry.id !== id));

    try {
      if (!user) throw new Error("User not authenticated");
      const progressEntryDoc = doc(db, "users", user.uid, "progressEntries", id);
      await deleteDoc(progressEntryDoc);
    } catch (error) {
      setError("Failed to delete progress entry. Please try again.");
      setProgressEntries(originalProgressEntries);
    }
  };

  const value = {
    clients,
    sessions,
    payments,
    progressEntries,
    loading,
    error,
    workoutPlans,
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
    addWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    addProgressEntry,
    getClientProgressEntries,
    deleteProgressEntry,
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
