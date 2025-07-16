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
  increment,
  arrayUnion,
} from "firebase/firestore";
import { db } from "./firebase";
import { Client, Session, Payment, UserProfile, BillingHistory, ReferralData, ReferralStats } from "./types";
import { subscriptionExtensionService } from "./subscriptionExtension";

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
      
      // Creating user profile
      await setDoc(userRef, userProfile);
              // User profile created successfully
      return userProfile;
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  },

  // Get user profile
  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      // Fetching user profile
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile;
        // User profile found
        return data;
      }
              // No user profile found
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

  // Initialize billing history for new users (do nothing now)
  initializeBillingHistory: async (userId: string, planId: string = "free") => {
    // No-op: Do not create any billing history entry for new users or plan switches
    // Only real payment events should create billing history
    return;
  },
};

// === REFERRAL SERVICES ===
export const referralService = {
  // Generate a unique referral code for a user
  generateReferralCode: (userId: string): string => {
    // Create a 6-character code from the last 6 characters of userId
    const baseCode = userId.slice(-6).toUpperCase();
    // Add a random 2-character suffix for uniqueness
    const randomSuffix = Math.random().toString(36).substring(2, 4).toUpperCase();
    return `${baseCode}${randomSuffix}`;
  },

  // Create or get user's referral code
  getOrCreateReferralCode: async (userId: string): Promise<string> => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.referralCode) {
          return userData.referralCode;
        }
      }

      // Generate new referral code
      const referralCode = referralService.generateReferralCode(userId);
      
      // Update user profile with referral code
      await updateDoc(userRef, {
        referralCode,
        totalReferrals: 0,
        referralEarnings: 0,
      });

      return referralCode;
    } catch (error) {
      console.error("Error getting/creating referral code:", error);
      throw error;
    }
  },

  // Get referral stats for a user
  getReferralStats: async (userId: string) => {
    try {
      // Get user's referral code
      const referralCode = await referralService.getOrCreateReferralCode(userId);
      
      // Get all referrals where this user is the referrer
      const referralsRef = collection(db, "referrals");
      const q = query(
        referralsRef,
        where("referrerId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      
      const referrals = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ReferralData[];

      const totalReferrals = referrals.length;
      const completedReferrals = referrals.filter(r => r.status === "completed" || r.status === "rewarded").length;
      const pendingReferrals = referrals.filter(r => r.status === "pending").length;
      const totalEarnings = referrals
        .filter(r => r.rewardAmount)
        .reduce((sum, r) => sum + (r.rewardAmount || 0), 0);

      // Generate referral link using current location
      const referralLink = `${window.location.origin}/login?ref=${referralCode}`;

      return {
        totalReferrals,
        completedReferrals,
        pendingReferrals,
        totalEarnings,
        referralCode,
        referralLink,
      } as ReferralStats;
    } catch (error) {
      console.error("Error getting referral stats:", error);
      throw error;
    }
  },

  // Create a new referral record
  createReferral: async (referrerId: string, referredUserId: string, referrerEmail: string, referredUserEmail: string) => {
    try {
      const referralData: Omit<ReferralData, "id"> = {
        referrerId,
        referredUserId,
        referrerEmail,
        referredUserEmail,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "referrals"), referralData);
      
      // Update referrer's total referrals count
      const referrerRef = doc(db, "users", referrerId);
      await updateDoc(referrerRef, {
        totalReferrals: increment(1),
      });

      return {
        id: docRef.id,
        ...referralData,
      } as ReferralData;
    } catch (error) {
      console.error("Error creating referral:", error);
      throw error;
    }
  },

  // Complete a referral when the referred user subscribes
  completeReferral: async (referralId: string, planSubscribed: string) => {
    try {
      const referralRef = doc(db, "referrals", referralId);
      const referralDoc = await getDoc(referralRef);
      
      if (!referralDoc.exists()) {
        throw new Error("Referral not found");
      }

      const referralData = referralDoc.data() as ReferralData;
      
      // Update referral status
      await updateDoc(referralRef, {
        status: "completed",
        completedAt: new Date().toISOString(),
        planSubscribed,
      });

      // Grant rewards to both users
      await referralService.grantReferralRewards(referralData.referrerId, referralData.referredUserId, planSubscribed);

      return true;
    } catch (error) {
      console.error("Error completing referral:", error);
      throw error;
    }
  },

  // Grant rewards to both referrer and referred user
  grantReferralRewards: async (referrerId: string, referredUserId: string, planSubscribed: string) => {
    try {
      const batch = writeBatch(db);
      
      // Calculate reward amount based on plan (for display purposes)
      let rewardAmount = 0;
      switch (planSubscribed) {
        case "starter":
          rewardAmount = 9; // One month of Starter plan
          break;
        case "pro":
          rewardAmount = 19; // One month of Pro plan
          break;
        case "lifetime":
          rewardAmount = 149; // Full lifetime plan value
          break;
        default:
          rewardAmount = 19; // Default to Pro plan value
      }
      
      // Update referrer's profile with free month credit
      const referrerRef = doc(db, "users", referrerId);
      batch.update(referrerRef, {
        referralEarnings: increment(rewardAmount),
        freeMonthsEarned: increment(1), // Track free months earned
        lastReferralReward: new Date().toISOString(),
      });

      // Update referred user's profile with free month credit
      const referredUserRef = doc(db, "users", referredUserId);
      batch.update(referredUserRef, {
        referralRewardGranted: true,
        referralRewardGrantedAt: new Date().toISOString(),
        freeMonthsEarned: increment(1), // Track free months earned
      });

      // Update referral record
      const referralsRef = collection(db, "referrals");
      const q = query(
        referralsRef,
        where("referrerId", "==", referrerId),
        where("referredUserId", "==", referredUserId)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const referralRef = doc(db, "referrals", querySnapshot.docs[0].id);
        batch.update(referralRef, {
          status: "rewarded",
          rewardGrantedAt: new Date().toISOString(),
          rewardAmount,
          rewardType: "free_month", // Track that this was a free month reward
        });
      }

      await batch.commit();
      
      // Apply actual free months to both users' subscriptions
      try {
        await subscriptionExtensionService.applyFreeMonth(referrerId);
        await subscriptionExtensionService.applyFreeMonth(referredUserId);
        console.log("Free months applied to both users");
      } catch (extensionError) {
        console.error("Error applying free months:", extensionError);
        // Don't fail the referral completion if extension fails
      }
      
      return true;
    } catch (error) {
      console.error("Error granting referral rewards:", error);
      throw error;
    }
  },

  // Get all referrals for a user (as referrer)
  getUserReferrals: (userId: string) => {
    const referralsRef = collection(db, "referrals");
    const q = query(
      referralsRef,
      where("referrerId", "==", userId),
      orderBy("createdAt", "desc")
    );
    return getDocs(q);
  },

  // Subscribe to referrals changes
  subscribeToReferrals: (
    userId: string,
    callback: (referrals: ReferralData[]) => void,
    errorCallback?: (error: Error) => void,
  ) => {
    const referralsRef = collection(db, "referrals");
    const q = query(
      referralsRef,
      where("referrerId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    return onSnapshot(
      q,
      (snapshot) => {
        const referrals = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ReferralData[];
        callback(referrals);
      },
      (error) => {
        console.error("Firestore referrals subscription error:", error);
        if (errorCallback) errorCallback(error);
      },
    );
  },

  // Validate referral code
  validateReferralCode: async (referralCode: string): Promise<{ valid: boolean; referrerId?: string; referrerEmail?: string }> => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("referralCode", "==", referralCode));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return { valid: false };
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      return {
        valid: true,
        referrerId: userDoc.id,
        referrerEmail: userData.email,
      };
    } catch (error) {
      console.error("Error validating referral code:", error);
      return { valid: false };
    }
  },
};

// Utility function for generating unique IDs
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);
