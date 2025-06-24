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
import { Client, Session, Payment, UserProfile, BillingHistory } from "./types";

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

// === BILLING HISTORY SERVICES ===
export const billingHistoryService = {
  // Get billing history for a user
  getBillingHistory: async (userId: string): Promise<BillingHistory[]> => {
    try {
      const q = query(
        getUserCollection(userId, "billingHistory"),
        orderBy("date", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BillingHistory[];
    } catch (error) {
      console.error("Error fetching billing history:", error);
      return [];
    }
  },

  // Add billing history item (called when subscription is created/updated)
  addBillingHistoryItem: async (userId: string, billingItem: Omit<BillingHistory, "id">) => {
    try {
      const docRef = await addDoc(getUserCollection(userId, "billingHistory"), {
        ...billingItem,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding billing history item:", error);
      throw error;
    }
  },

  // Update billing history item
  updateBillingHistoryItem: async (
    userId: string,
    billingId: string,
    updates: Partial<BillingHistory>
  ) => {
    try {
      const billingRef = doc(getUserCollection(userId, "billingHistory"), billingId);
      return updateDoc(billingRef, updates);
    } catch (error) {
      console.error("Error updating billing history item:", error);
      throw error;
    }
  },

  // Subscribe to billing history changes
  subscribeToBillingHistory: (
    userId: string,
    callback: (billingHistory: BillingHistory[]) => void,
    errorCallback?: (error: Error) => void,
  ) => {
    const q = query(
      getUserCollection(userId, "billingHistory"),
      orderBy("date", "desc"),
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const billingHistory = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BillingHistory[];
        callback(billingHistory);
      },
      (error) => {
        console.error("Firestore billing history subscription error:", error);
        if (errorCallback) errorCallback(error);
      },
    );
  },

  // Initialize billing history for new users (creates sample data if needed)
  initializeBillingHistory: async (userId: string, planId: string = "free") => {
    try {
      // Only create sample data for non-free plans
      if (planId === "free") {
        return;
      }

      const existingHistory = await billingHistoryService.getBillingHistory(userId);
      if (existingHistory.length > 0) {
        return; // Already has billing history
      }

      // Create sample billing history for new paid subscribers
      const sampleHistory: Omit<BillingHistory, "id">[] = [
        {
          date: new Date().toISOString().split("T")[0],
          amount: planId === "professional" ? 29 : 79,
          status: "paid",
          description: `${planId === "professional" ? "Professional" : "Gold"} Plan - Initial Subscription`,
          planId,
          planName: planId === "professional" ? "Professional" : "Gold",
          customerId: `cus_${userId}`,
          paymentMethod: "card",
          currency: "USD",
          createdAt: new Date().toISOString(),
        },
        // Add a few more sample entries for better UX
        {
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 1 month ago
          amount: planId === "professional" ? 29 : 79,
          status: "paid",
          description: `${planId === "professional" ? "Professional" : "Gold"} Plan - Monthly Subscription`,
          planId,
          planName: planId === "professional" ? "Professional" : "Gold",
          customerId: `cus_${userId}`,
          paymentMethod: "card",
          currency: "USD",
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 2 months ago
          amount: planId === "professional" ? 29 : 79,
          status: "paid",
          description: `${planId === "professional" ? "Professional" : "Gold"} Plan - Monthly Subscription`,
          planId,
          planName: planId === "professional" ? "Professional" : "Gold",
          customerId: `cus_${userId}`,
          paymentMethod: "card",
          currency: "USD",
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      // Add sample billing history items
      for (const item of sampleHistory) {
        await billingHistoryService.addBillingHistoryItem(userId, item);
      }
    } catch (error) {
      console.error("Error initializing billing history:", error);
    }
  },

  // Manually add sample billing history for existing users (for demo purposes)
  addSampleBillingHistory: async (userId: string, planId: string = "professional") => {
    try {
      const sampleHistory: Omit<BillingHistory, "id">[] = [
        {
          date: new Date().toISOString().split("T")[0],
          amount: planId === "professional" ? 29 : 79,
          status: "paid",
          description: `${planId === "professional" ? "Professional" : "Gold"} Plan - Current Month`,
          planId,
          planName: planId === "professional" ? "Professional" : "Gold",
          customerId: `cus_${userId}`,
          paymentMethod: "card",
          currency: "USD",
          createdAt: new Date().toISOString(),
        },
        {
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 1 month ago
          amount: planId === "professional" ? 29 : 79,
          status: "paid",
          description: `${planId === "professional" ? "Professional" : "Gold"} Plan - Previous Month`,
          planId,
          planName: planId === "professional" ? "Professional" : "Gold",
          customerId: `cus_${userId}`,
          paymentMethod: "card",
          currency: "USD",
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 2 months ago
          amount: planId === "professional" ? 29 : 79,
          status: "paid",
          description: `${planId === "professional" ? "Professional" : "Gold"} Plan - Monthly Subscription`,
          planId,
          planName: planId === "professional" ? "Professional" : "Gold",
          customerId: `cus_${userId}`,
          paymentMethod: "card",
          currency: "USD",
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      // Add sample billing history items
      for (const item of sampleHistory) {
        await billingHistoryService.addBillingHistoryItem(userId, item);
      }

      console.log("Sample billing history added for user:", userId);
    } catch (error) {
      console.error("Error adding sample billing history:", error);
    }
  },
};
