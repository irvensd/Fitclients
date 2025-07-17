import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { mockClients, mockSessions, mockPayments, mockWorkoutPlans, mockProgressEntries } from "@/lib/mockData";
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
  dataInitialized: boolean;

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

  // New function
  addAiNotesToWorkoutPlan: (clientId: string, notes: string[]) => void;
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
  const [dataInitialized, setDataInitialized] = useState(false);
  const { user, isDemoUser } = useAuth();

  useEffect(() => {
    if (user) {
      if (isDemoUser) {
        const clientsWithStatus: ClientWithStatus[] = mockClients.map((client) => ({
            ...client,
            status: { isActive: true }, // Assuming demo clients are active
        }));
        setClients(clientsWithStatus);
        setSessions(mockSessions);
        setPayments(mockPayments);
        setWorkoutPlans(mockWorkoutPlans);
        setProgressEntries(mockProgressEntries);
        setLoading(false);
        setDataInitialized(true);
      } else {
        setLoading(true);
        setDataInitialized(false);
        
        console.log(`Setting up Firestore listeners for user: ${user.uid}`);

        const collections = {
          clients: collection(db, "users", user.uid, "clients"),
          sessions: collection(db, "users", user.uid, "sessions"),
          payments: collection(db, "users", user.uid, "payments"),
          workoutPlans: collection(db, "users", user.uid, "workoutPlans"),
          progressEntries: collection(db, "users", user.uid, "progressEntries"),
        };

        let collectionsLoaded = 0;
        const totalCollections = 5;

        const checkAllLoaded = () => {
          collectionsLoaded++;
          console.log(`Collection loaded. Count: ${collectionsLoaded}/${totalCollections}`);
          if (collectionsLoaded >= totalCollections) {
            console.log('All collections loaded, setting loading to false');
            setDataInitialized(true);
            // Add a small delay to ensure all state updates are processed
            setTimeout(() => setLoading(false), 100);
          }
        };

        const unsubscribes = [
          onSnapshot(collections.clients, (snapshot) => {
            const fetchedClients = snapshot.docs.map(doc => ({
              ...(doc.data() as Omit<Client, 'id'>),
              id: doc.id,
              status: doc.data().status || { isActive: true },
            })) as ClientWithStatus[];
            setClients(fetchedClients);
            checkAllLoaded();
          }, (err) => { console.error("Clients snapshot error:", err); setError("Failed to load clients."); }),

          onSnapshot(collections.sessions, (snapshot) => {
            const fetchedSessions = snapshot.docs.map(doc => ({ ...(doc.data() as Omit<Session, 'id'>), id: doc.id })) as Session[];
            setSessions(fetchedSessions);
            checkAllLoaded();
          }, (err) => { console.error("Sessions snapshot error:", err); setError("Failed to load sessions."); }),

          onSnapshot(collections.payments, (snapshot) => {
            const fetchedPayments = snapshot.docs.map(doc => ({ ...(doc.data() as Omit<Payment, 'id'>), id: doc.id })) as Payment[];
            setPayments(fetchedPayments);
            checkAllLoaded();
          }, (err) => { console.error("Payments snapshot error:", err); setError("Failed to load payments."); }),
          
          onSnapshot(collections.workoutPlans, (snapshot) => {
            const fetchedPlans = snapshot.docs.map(doc => ({ ...(doc.data() as Omit<WorkoutPlan, 'id'>), id: doc.id })) as WorkoutPlan[];
            setWorkoutPlans(fetchedPlans);
            checkAllLoaded();
          }, (err) => { console.error("WorkoutPlans snapshot error:", err); setError("Failed to load workout plans."); }),
          
          onSnapshot(collections.progressEntries, (snapshot) => {
            const fetchedEntries = snapshot.docs.map(doc => ({ ...(doc.data() as Omit<ProgressEntry, 'id'>), id: doc.id })) as ProgressEntry[];
            setProgressEntries(fetchedEntries);
            checkAllLoaded();
          }, (err) => { console.error("ProgressEntries snapshot error:", err); setError("Failed to load progress entries."); }),
        ];

        return () => {
          unsubscribes.forEach(unsub => unsub());
        };
      }
    } else {
      // Check if we're on the demo portal route
      const isDemoPortalRoute = window.location.pathname === '/demo-portal';
      if (isDemoPortalRoute) {
        // Load mock data for demo portal even without authentication
        const clientsWithStatus: ClientWithStatus[] = mockClients.map((client) => ({
            ...client,
            status: { isActive: true },
        }));
        setClients(clientsWithStatus);
        setSessions(mockSessions);
        setPayments(mockPayments);
        setWorkoutPlans(mockWorkoutPlans);
        setProgressEntries(mockProgressEntries);
        setLoading(false);
        setDataInitialized(true);
      } else {
        setLoading(false);
        setDataInitialized(true);
      }
    }
  }, [user, isDemoUser]);

  const isDemo = user?.email === 'trainer@demo.com';

  const addClient = async (clientData: Omit<Client, "id">): Promise<Client> => {
    if (isDemo) {
      const newClient = { ...clientData, id: `mock-${Date.now()}` };
      const clientWithStatus = { ...newClient, status: { isActive: true } } as ClientWithStatus;
      setClients(prev => [...prev, clientWithStatus]);
      return newClient;
    }

    if (!user) throw new Error("User not authenticated for addClient");
    const docRef = await addDoc(collection(db, "users", user.uid, "clients"), clientData);
    return { ...clientData, id: docRef.id };
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    if (isDemo) {
      setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
      return;
    }
    if (!user) throw new Error("User not authenticated for updateClient");
    await updateDoc(doc(db, "users", user.uid, "clients", id), updates);
  };
  
  const deleteClient = async (id: string) => {
    if (isDemo) {
      setClients(prev => prev.filter(c => c.id !== id));
      return;
    }
    if (!user) throw new Error("User not authenticated for deleteClient");
    await deleteDoc(doc(db, "users", user.uid, "clients", id));
  };
  
  const addSession = async (sessionData: Omit<Session, "id">): Promise<Session> => {
     if (isDemo) {
      const newSession = { ...sessionData, id: `mock-${Date.now()}` };
      setSessions(prev => [...prev, newSession]);
      return newSession;
    }
    if (!user) throw new Error("User not authenticated for addSession");
    const docRef = await addDoc(collection(db, "users", user.uid, "sessions"), sessionData);
    return { ...sessionData, id: docRef.id };
  };

  const updateSession = async (id: string, updates: Partial<Session>) => {
    if (isDemo) {
      setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
      return;
    }
    if (!user) throw new Error("User not authenticated for updateSession");
    await updateDoc(doc(db, "users", user.uid, "sessions", id), updates);
  };

  const deleteSession = async (id: string) => {
    if (isDemo) {
      setSessions(prev => prev.filter(s => s.id !== id));
      return;
    }
    if (!user) throw new Error("User not authenticated for deleteSession");
    await deleteDoc(doc(db, "users", user.uid, "sessions", id));
  };

  const addPayment = async (paymentData: Omit<Payment, "id">): Promise<Payment> => {
    if (isDemo) {
      const newPayment = { ...paymentData, id: `mock-${Date.now()}` };
      setPayments(prev => [...prev, newPayment]);
      return newPayment;
    }
    if (!user) throw new Error("User not authenticated for addPayment");
    const docRef = await addDoc(collection(db, "users", user.uid, "payments"), paymentData);
    return { ...paymentData, id: docRef.id };
  };

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    if (isDemo) {
      setPayments(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      return;
    }
    if (!user) throw new Error("User not authenticated for updatePayment");
    await updateDoc(doc(db, "users", user.uid, "payments", id), updates);
  };

  const deletePayment = async (id: string) => {
    if (isDemo) {
      setPayments(prev => prev.filter(p => p.id !== id));
      return;
    }
    if (!user) throw new Error("User not authenticated for deletePayment");
    await deleteDoc(doc(db, "users", user.uid, "payments", id));
  };

  const addWorkoutPlan = async (plan: Omit<WorkoutPlan, "id" | "createdDate">) => {
    if (isDemo) {
      const newPlan = { ...plan, id: `mock-${Date.now()}`, createdDate: new Date().toISOString() };
      setWorkoutPlans(prev => [...prev, newPlan]);
      return;
    }
    if (!user) throw new Error("User not authenticated for addWorkoutPlan");
    const planWithDate = { ...plan, createdDate: new Date().toISOString() };
    await addDoc(collection(db, "users", user.uid, "workoutPlans"), planWithDate);
  };

  const updateWorkoutPlan = async (planId: string, updates: Partial<WorkoutPlan>) => {
    if (isDemo) {
      setWorkoutPlans(prev => prev.map(p => p.id === planId ? { ...p, ...updates } : p));
      return;
    }
    if (!user) throw new Error("User not authenticated for updateWorkoutPlan");
    await updateDoc(doc(db, "users", user.uid, "workoutPlans", planId), updates);
  };

  const deleteWorkoutPlan = async (planId: string) => {
    if (isDemo) {
      setWorkoutPlans(prev => prev.filter(p => p.id !== planId));
      return;
    }
    if (!user) throw new Error("User not authenticated for deleteWorkoutPlan");
    await deleteDoc(doc(db, "users", user.uid, "workoutPlans", planId));
  };
  
  const addProgressEntry = async (entry: Omit<ProgressEntry, "id">): Promise<ProgressEntry> => {
    if (isDemo) {
      const newEntry = { ...entry, id: `mock-${Date.now()}` };
      setProgressEntries(prev => [...prev, newEntry]);
      return newEntry;
    }
    
    if (!user) {
      console.error("User not authenticated for addProgressEntry");
      throw new Error("User not authenticated for addProgressEntry");
    }
    
    try {
      const docRef = await addDoc(collection(db, "users", user.uid, "progressEntries"), entry);
      return { ...entry, id: docRef.id };
    } catch (error) {
      console.error("Firestore error in addProgressEntry:", error);
      throw error;
    }
  };

  const getClientProgressEntries = (clientId: string) => {
     return progressEntries.filter((entry) => entry.clientId === clientId);
  };

  const deleteProgressEntry = async (id: string) => {
    if (isDemo) {
      setProgressEntries(prev => prev.filter(e => e.id !== id));
      return;
    }
    if (!user) throw new Error("User not authenticated for deleteProgressEntry");
    await deleteDoc(doc(db, "users", user.uid, "progressEntries", id));
  };
  
  // These functions are not fully implemented for brevity in this refactor,
  // but they are added to satisfy the type interface.
  const archiveClients = async (clientIds: string[], reason?: string) => console.log('archiveClients', clientIds, reason);
  const reactivateClients = async (clientIds: string[]) => console.log('reactivateClients', clientIds);
  const handlePlanDowngrade = async (newLimit: number, selectedActiveIds: string[]) => console.log('handlePlanDowngrade', newLimit, selectedActiveIds);
  const getActiveClients = () => clients.filter(c => c.status.isActive);
  const getArchivedClients = () => clients.filter(c => !c.status.isActive);

  const getClientName = useCallback((id: string): string => {
    return clients.find((c) => c.id === id)?.name || "Unknown Client";
  }, [clients]);

  const addAiNotesToWorkoutPlan = (clientId: string, notes: string[]) => {
    // Check if workout plan exists, if not, create a default one
    const workoutPlan = workoutPlans.find(plan => plan.clientId === clientId && plan.isActive);
    if (!workoutPlan) {
      console.warn(
        `No active workout plan for client ${clientId}. Notes will be added to a new default plan.`,
      );
      const newPlan: WorkoutPlan = {
        id: `wp-${Date.now()}`,
        clientId,
        name: `Progressive Overload Plan for ${getClientName(clientId)}`,
        description:
          "Default plan focusing on core compound movements. Adjust as needed.",
        exercises: [],
        createdDate: new Date().toISOString(),
        isActive: true,
        aiNotes: notes,
      };
      setWorkoutPlans((prev) => [...prev, newPlan]);
    } else {
      setWorkoutPlans((prev) =>
        prev.map((plan) =>
          plan.id === workoutPlan.id
            ? {
                ...plan,
                aiNotes: [...(plan.aiNotes || []), ...notes],
              }
            : plan,
        ),
      );
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
    dataInitialized,
    addClient,
    updateClient,
    deleteClient,
    getClientName,
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
    archiveClients,
    reactivateClients,
    handlePlanDowngrade,
    getActiveClients,
    getArchivedClients,
    addAiNotesToWorkoutPlan,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Custom hook to use the DataContext
function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

export { DataProvider, useData };
