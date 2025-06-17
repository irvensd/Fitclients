import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { Client, Session, Payment } from "./types";

// Helper to get user's collection path
const getUserCollection = (userId: string, collectionName: string) => {
  return collection(db, "trainers", userId, collectionName);
};

// === CLIENTS SERVICES ===
export const clientsService = {
  // Get all clients for a trainer
  getClients: (userId: string) => {
    return getDocs(getUserCollection(userId, "clients"));
  },

  // Add new client
  addClient: (userId: string, client: Omit<Client, "id">) => {
    return addDoc(getUserCollection(userId, "clients"), {
      ...client,
      dateJoined: serverTimestamp(),
    });
  },

  // Update client
  updateClient: (
    userId: string,
    clientId: string,
    updates: Partial<Client>,
  ) => {
    const clientRef = doc(getUserCollection(userId, "clients"), clientId);
    return updateDoc(clientRef, updates);
  },

  // Delete client
  deleteClient: (userId: string, clientId: string) => {
    const clientRef = doc(getUserCollection(userId, "clients"), clientId);
    return deleteDoc(clientRef);
  },

  // Subscribe to clients changes
  subscribeToClients: (
    userId: string,
    callback: (clients: Client[]) => void,
  ) => {
    const q = query(
      getUserCollection(userId, "clients"),
      orderBy("dateJoined", "desc"),
    );
    return onSnapshot(q, (snapshot) => {
      const clients = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Convert timestamp to string
        dateJoined:
          doc.data().dateJoined?.toDate?.()?.toISOString()?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
      })) as Client[];
      callback(clients);
    });
  },
};

// === SESSIONS SERVICES ===
export const sessionsService = {
  // Get all sessions for a trainer
  getSessions: (userId: string) => {
    return getDocs(getUserCollection(userId, "sessions"));
  },

  // Add new session
  addSession: (userId: string, session: Omit<Session, "id">) => {
    return addDoc(getUserCollection(userId, "sessions"), {
      ...session,
      createdAt: serverTimestamp(),
    });
  },

  // Update session
  updateSession: (
    userId: string,
    sessionId: string,
    updates: Partial<Session>,
  ) => {
    const sessionRef = doc(getUserCollection(userId, "sessions"), sessionId);
    return updateDoc(sessionRef, updates);
  },

  // Delete session
  deleteSession: (userId: string, sessionId: string) => {
    const sessionRef = doc(getUserCollection(userId, "sessions"), sessionId);
    return deleteDoc(sessionRef);
  },

  // Subscribe to sessions changes
  subscribeToSessions: (
    userId: string,
    callback: (sessions: Session[]) => void,
  ) => {
    const q = query(
      getUserCollection(userId, "sessions"),
      orderBy("date", "desc"),
    );
    return onSnapshot(q, (snapshot) => {
      const sessions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Session[];
      callback(sessions);
    });
  },
};

// === PAYMENTS SERVICES ===
export const paymentsService = {
  // Get all payments for a trainer
  getPayments: (userId: string) => {
    return getDocs(getUserCollection(userId, "payments"));
  },

  // Add new payment
  addPayment: (userId: string, payment: Omit<Payment, "id">) => {
    return addDoc(getUserCollection(userId, "payments"), {
      ...payment,
      createdAt: serverTimestamp(),
    });
  },

  // Update payment
  updatePayment: (
    userId: string,
    paymentId: string,
    updates: Partial<Payment>,
  ) => {
    const paymentRef = doc(getUserCollection(userId, "payments"), paymentId);
    return updateDoc(paymentRef, updates);
  },

  // Delete payment
  deletePayment: (userId: string, paymentId: string) => {
    const paymentRef = doc(getUserCollection(userId, "payments"), paymentId);
    return deleteDoc(paymentRef);
  },

  // Subscribe to payments changes
  subscribeToPayments: (
    userId: string,
    callback: (payments: Payment[]) => void,
  ) => {
    const q = query(
      getUserCollection(userId, "payments"),
      orderBy("date", "desc"),
    );
    return onSnapshot(q, (snapshot) => {
      const payments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Payment[];
      callback(payments);
    });
  },
};

// === ANALYTICS SERVICES ===
export const analyticsService = {
  // Initialize trainer profile when they first sign up
  initializeTrainerProfile: async (userId: string, email: string) => {
    const trainerRef = doc(db, "trainers", userId);
    const batch = writeBatch(db);

    batch.set(trainerRef, {
      email,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });

    await batch.commit();
  },

  // Update last login
  updateLastLogin: (userId: string) => {
    const trainerRef = doc(db, "trainers", userId);
    return updateDoc(trainerRef, {
      lastLogin: serverTimestamp(),
    });
  },
};

// === DEMO DATA FALLBACK ===
export const useDemoData = () => {
  // Return empty arrays for new accounts
  return {
    clients: [],
    sessions: [],
    payments: [],
  };
};
