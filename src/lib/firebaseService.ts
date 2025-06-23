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
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Client, Session, Payment, UserProfile } from "./types";

// Helper to get user's collection path
const getUserCollection = (userId: string, collectionName: string) => {
  return collection(db, "users", userId, collectionName);
};

// === USER PROFILE SERVICES ===
export const userProfileService = {
  // Create user profile when they first register
  createUserProfile: async (userId: string, profileData: Omit<UserProfile, "id" | "createdAt">) => {
    try {
      const userRef = doc(db, "users", userId);
      const userProfile: UserProfile = {
        ...profileData,
        id: userId,
        createdAt: new Date().toISOString(),
        // Ensure all fields are initialized
        phone: profileData.phone || "",
        bio: profileData.bio || "",
        businessName: profileData.businessName || "",
        website: profileData.website || "",
        address: profileData.address || "",
        lastLogin: new Date().toISOString(),
      };
      
      console.log("Creating user profile with data:", userProfile);
      await setDoc(userRef, userProfile);
      console.log("User profile created successfully for:", userId);
      return userProfile;
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  },

  // Get user profile
  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log("Fetching user profile for:", userId);
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile;
        console.log("User profile found:", data);
        return data;
      }
      console.log("No user profile found for:", userId);
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userId: string, updates: Partial<UserProfile>) => {
    const userRef = doc(db, "users", userId);
    return updateDoc(userRef, updates);
  },

  // Update last login
  updateLastLogin: (userId: string) => {
    const userRef = doc(db, "users", userId);
    return updateDoc(userRef, {
      lastLogin: new Date().toISOString(),
    });
  },
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
    errorCallback?: (error: Error) => void,
  ) => {
    const q = query(
      getUserCollection(userId, "clients"),
      orderBy("dateJoined", "desc"),
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const clients = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Convert timestamp to string
          dateJoined:
            doc.data().dateJoined?.toDate?.()?.toISOString()?.split("T")[0] ||
            new Date().toISOString().split("T")[0],
        })) as Client[];
        callback(clients);
      },
      (error) => {
        console.error("Firestore clients subscription error:", error);
        if (errorCallback) errorCallback(error);
      },
    );
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
    errorCallback?: (error: Error) => void,
  ) => {
    const q = query(
      getUserCollection(userId, "sessions"),
      orderBy("date", "desc"),
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const sessions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Session[];
        callback(sessions);
      },
      (error) => {
        console.error("Firestore sessions subscription error:", error);
        if (errorCallback) errorCallback(error);
      },
    );
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
    errorCallback?: (error: Error) => void,
  ) => {
    const q = query(
      getUserCollection(userId, "payments"),
      orderBy("date", "desc"),
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const payments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Payment[];
        callback(payments);
      },
      (error) => {
        console.error("Firestore payments subscription error:", error);
        if (errorCallback) errorCallback(error);
      },
    );
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

// === SUPPORT TICKETS SERVICES ===
export const supportTicketsService = {
  // Get all support tickets (optionally with query/filters)
  getSupportTickets: async () => {
    const q = query(collection(db, "supportTickets"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Add a new support ticket
  addSupportTicket: async (ticket) => {
    const docRef = await addDoc(collection(db, "supportTickets"), {
      ...ticket,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: ticket.status || "open",
      comments: ticket.comments || [],
      tags: ticket.tags || [],
      attachments: ticket.attachments || [],
    });
    return docRef.id;
  },

  // Update a support ticket
  updateSupportTicket: async (ticketId, updates) => {
    const ticketRef = doc(db, "supportTickets", ticketId);
    return updateDoc(ticketRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  // Delete a support ticket
  deleteSupportTicket: async (ticketId) => {
    const ticketRef = doc(db, "supportTickets", ticketId);
    return deleteDoc(ticketRef);
  },

  // Subscribe to real-time updates for all support tickets
  subscribeToSupportTickets: (callback, errorCallback) => {
    const q = query(collection(db, "supportTickets"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(tickets);
    }, (error) => {
      console.error("Firestore supportTickets subscription error:", error);
      if (errorCallback) errorCallback(error);
    });
  },
};
