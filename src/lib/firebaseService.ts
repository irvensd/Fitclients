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
import { Client, Session, Payment, UserProfile, BillingHistory, ReferralData, ReferralStats, MarketingCampaign, Lead, SocialPost, EmailCampaign, MarketingAsset, Testimonial, ReferralLink, LeadNote } from "./types";

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
      
      // Calculate reward amount based on plan
      const rewardAmount = planSubscribed === "gold" ? 79 : 29; // One month of the subscribed plan
      
      // Update referrer's profile
      const referrerRef = doc(db, "users", referrerId);
      batch.update(referrerRef, {
        referralEarnings: increment(rewardAmount),
      });

      // Update referred user's profile
      const referredUserRef = doc(db, "users", referredUserId);
      batch.update(referredUserRef, {
        referralRewardGranted: true,
        referralRewardGrantedAt: new Date().toISOString(),
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
        });
      }

      await batch.commit();
      
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

// === MARKETING SERVICES ===
export const marketingService = {
  // Campaign Management
  getCampaigns: async (trainerId: string) => {
    const campaignsRef = collection(db, "trainers", trainerId, "campaigns");
    const snapshot = await getDocs(campaignsRef);
    const campaigns = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // If no campaigns exist, create some sample data
    if (campaigns.length === 0) {
      const sampleCampaigns = [
        {
          id: "sample-1",
          title: "New Year Transformation",
          description: "Get 20% off first month + free assessment",
          type: "referral" as const,
          status: "active" as const,
          createdAt: new Date().toISOString(),
          startDate: new Date().toISOString(),
          targetAudience: "New clients looking for weight loss",
          discountType: "percentage" as const,
          discountValue: 20,
          referralReward: 50,
          metrics: {
            views: 245,
            clicks: 89,
            conversions: 12,
            shares: 34,
            revenue: 2400,
            cost: 200,
            roi: 1100,
          },
          settings: {
            autoShare: true,
            trackingEnabled: true,
            emailReminders: true,
            smsNotifications: false,
            socialPlatforms: ["facebook", "instagram"],
          },
        },
        {
          id: "sample-2",
          title: "Friend Referral Program",
          description: "Both you and your friend get $50 credit",
          type: "referral" as const,
          status: "active" as const,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          targetAudience: "Existing clients",
          discountType: "fixed" as const,
          discountValue: 50,
          referralReward: 50,
          metrics: {
            views: 178,
            clicks: 67,
            conversions: 8,
            shares: 23,
            revenue: 1600,
            cost: 150,
            roi: 966,
          },
          settings: {
            autoShare: false,
            trackingEnabled: true,
            emailReminders: true,
            smsNotifications: true,
            socialPlatforms: ["instagram"],
          },
        },
      ];
      
      // Add sample campaigns to Firestore
      for (const campaign of sampleCampaigns) {
        await addDoc(campaignsRef, campaign);
      }
      
      return sampleCampaigns;
    }
    
    return campaigns;
  },

  createCampaign: async (trainerId: string, campaignData: Omit<MarketingCampaign, "id" | "createdAt" | "metrics">) => {
    const campaignsRef = collection(db, "trainers", trainerId, "campaigns");
    const newCampaign: Omit<MarketingCampaign, "id"> = {
      ...campaignData,
      createdAt: new Date().toISOString(),
      metrics: {
        views: 0,
        clicks: 0,
        conversions: 0,
        shares: 0,
        revenue: 0,
        cost: 0,
        roi: 0,
      },
    };
    
    const docRef = await addDoc(campaignsRef, newCampaign);
    return { id: docRef.id, ...newCampaign };
  },

  updateCampaign: async (trainerId: string, campaignId: string, updates: Partial<MarketingCampaign>) => {
    const campaignRef = doc(db, "trainers", trainerId, "campaigns", campaignId);
    return updateDoc(campaignRef, updates);
  },

  deleteCampaign: async (trainerId: string, campaignId: string) => {
    const campaignRef = doc(db, "trainers", trainerId, "campaigns", campaignId);
    return deleteDoc(campaignRef);
  },

  // Lead Management
  getLeads: async (trainerId: string) => {
    const leadsRef = collection(db, "trainers", trainerId, "leads");
    const snapshot = await getDocs(leadsRef);
    const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // If no leads exist, create some sample data
    if (leads.length === 0) {
      const sampleLeads = [
        {
          id: "sample-lead-1",
          name: "Sarah Johnson",
          email: "sarah.j@email.com",
          phone: "(555) 123-4567",
          source: "referral" as const,
          sourceDetails: "Friend Referral Program",
          status: "consultation_scheduled" as const,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          lastContactAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          notes: [
            {
              id: "note-1",
              content: "Interested in weight loss. Prefers morning sessions.",
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              type: "call" as const,
            },
          ],
          interests: ["weight loss", "strength training"],
          budget: "$150-200/month",
          preferredTime: "Morning",
        },
        {
          id: "sample-lead-2",
          name: "Mike Chen",
          email: "mike.chen@email.com",
          phone: "(555) 987-6543",
          source: "website" as const,
          sourceDetails: "Contact form",
          status: "new" as const,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          notes: [],
          interests: ["muscle building", "nutrition"],
          budget: "$200-300/month",
          preferredTime: "Evening",
        },
        {
          id: "sample-lead-3",
          name: "Lisa Rodriguez",
          email: "lisa.r@email.com",
          source: "social" as const,
          sourceDetails: "Instagram ad",
          status: "converted" as const,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          conversionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          conversionValue: 1800,
          notes: [],
          interests: ["cardio", "flexibility"],
          budget: "$100-150/month",
          preferredTime: "Afternoon",
        },
      ];
      
      // Add sample leads to Firestore
      for (const lead of sampleLeads) {
        await addDoc(leadsRef, lead);
      }
      
      return sampleLeads;
    }
    
    return leads;
  },

  createLead: async (trainerId: string, leadData: Omit<Lead, "id" | "createdAt" | "notes">) => {
    const leadsRef = collection(db, "trainers", trainerId, "leads");
    const newLead: Omit<Lead, "id"> = {
      ...leadData,
      createdAt: new Date().toISOString(),
      notes: [],
    };
    
    const docRef = await addDoc(leadsRef, newLead);
    return { id: docRef.id, ...newLead };
  },

  updateLead: async (trainerId: string, leadId: string, updates: Partial<Lead>) => {
    const leadRef = doc(db, "trainers", trainerId, "leads", leadId);
    return updateDoc(leadRef, updates);
  },

  addLeadNote: async (trainerId: string, leadId: string, note: Omit<LeadNote, "id" | "createdAt">) => {
    const leadRef = doc(db, "trainers", trainerId, "leads", leadId);
    const newNote: LeadNote = {
      ...note,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    
    return updateDoc(leadRef, {
      notes: arrayUnion(newNote),
    });
  },

  // Referral Links
  getReferralLinks: async (trainerId: string) => {
    const referralsRef = collection(db, "trainers", trainerId, "referralLinks");
    const snapshot = await getDocs(referralsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  createReferralLink: async (trainerId: string, campaignId: string, referrerId?: string, maxUses?: number) => {
    const referralsRef = collection(db, "trainers", trainerId, "referralLinks");
    const code = Math.random().toString(36).substr(2, 8).toUpperCase();
    
    const newReferral: Omit<ReferralLink, "id"> = {
      campaignId,
      referrerId,
      code,
      url: `https://fitclient.app/ref/${code}`,
      createdAt: new Date().toISOString(),
      uses: 0,
      maxUses,
    };
    
    const docRef = await addDoc(referralsRef, newReferral);
    return { id: docRef.id, ...newReferral };
  },

  trackReferralClick: async (trainerId: string, code: string) => {
    const referralsRef = collection(db, "trainers", trainerId, "referralLinks");
    const q = query(referralsRef, where("code", "==", code));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const referralDoc = snapshot.docs[0];
      const referralData = referralDoc.data();
      
      if (referralData.maxUses && referralData.uses >= referralData.maxUses) {
        return false; // Max uses reached
      }
      
      await updateDoc(referralDoc.ref, {
        uses: increment(1),
      });
      
      return true;
    }
    
    return false;
  },

  // Social Media Posts
  getSocialPosts: async (trainerId: string) => {
    const postsRef = collection(db, "trainers", trainerId, "socialPosts");
    const snapshot = await getDocs(postsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  createSocialPost: async (trainerId: string, postData: Omit<SocialPost, "id" | "metrics">) => {
    const postsRef = collection(db, "trainers", trainerId, "socialPosts");
    const newPost: Omit<SocialPost, "id"> = {
      ...postData,
      metrics: {
        likes: 0,
        comments: 0,
        shares: 0,
        reach: 0,
        engagement: 0,
      },
    };
    
    const docRef = await addDoc(postsRef, newPost);
    return { id: docRef.id, ...newPost };
  },

  updateSocialPost: async (trainerId: string, postId: string, updates: Partial<SocialPost>) => {
    const postRef = doc(db, "trainers", trainerId, "socialPosts", postId);
    return updateDoc(postRef, updates);
  },

  // Email Campaigns
  getEmailCampaigns: async (trainerId: string) => {
    const campaignsRef = collection(db, "trainers", trainerId, "emailCampaigns");
    const snapshot = await getDocs(campaignsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  createEmailCampaign: async (trainerId: string, campaignData: Omit<EmailCampaign, "id" | "metrics">) => {
    const campaignsRef = collection(db, "trainers", trainerId, "emailCampaigns");
    const newCampaign: Omit<EmailCampaign, "id"> = {
      ...campaignData,
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0,
      },
    };
    
    const docRef = await addDoc(campaignsRef, newCampaign);
    return { id: docRef.id, ...newCampaign };
  },

  // Marketing Assets
  getMarketingAssets: async (trainerId: string) => {
    const assetsRef = collection(db, "trainers", trainerId, "marketingAssets");
    const snapshot = await getDocs(assetsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  createMarketingAsset: async (trainerId: string, assetData: Omit<MarketingAsset, "id" | "createdAt" | "useCount">) => {
    const assetsRef = collection(db, "trainers", trainerId, "marketingAssets");
    const newAsset: Omit<MarketingAsset, "id"> = {
      ...assetData,
      createdAt: new Date().toISOString(),
      useCount: 0,
    };
    
    const docRef = await addDoc(assetsRef, newAsset);
    return { id: docRef.id, ...newAsset };
  },

  // Testimonials
  getTestimonials: async (trainerId: string) => {
    const testimonialsRef = collection(db, "trainers", trainerId, "testimonials");
    const snapshot = await getDocs(testimonialsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  createTestimonial: async (trainerId: string, testimonialData: Omit<Testimonial, "id" | "createdAt" | "isApproved">) => {
    const testimonialsRef = collection(db, "trainers", trainerId, "testimonials");
    const newTestimonial: Omit<Testimonial, "id"> = {
      ...testimonialData,
      createdAt: new Date().toISOString(),
      isApproved: false,
    };
    
    const docRef = await addDoc(testimonialsRef, newTestimonial);
    return { id: docRef.id, ...newTestimonial };
  },

  approveTestimonial: async (trainerId: string, testimonialId: string) => {
    const testimonialRef = doc(db, "trainers", trainerId, "testimonials", testimonialId);
    return updateDoc(testimonialRef, {
      isApproved: true,
      approvedAt: new Date().toISOString(),
    });
  },

  // Marketing Metrics
  getMarketingMetrics: async (trainerId: string, period: "week" | "month" | "quarter" | "year" = "month") => {
    try {
      // Calculate metrics from existing data
      const [campaigns, leads, referrals] = await Promise.all([
        this.getCampaigns(trainerId),
        this.getLeads(trainerId),
        this.getReferralLinks(trainerId),
      ]);

      // Ensure we have valid arrays
      const validCampaigns = Array.isArray(campaigns) ? campaigns : [];
      const validLeads = Array.isArray(leads) ? leads : [];
      const validReferrals = Array.isArray(referrals) ? referrals : [];

      const totalLeads = validLeads.length;
      const convertedLeads = validLeads.filter(lead => lead && lead.status === "converted").length;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
      
      // Safely calculate revenue and cost from campaigns
      const totalRevenue = validCampaigns.reduce((sum, campaign) => {
        if (campaign && campaign.metrics && typeof campaign.metrics.revenue === 'number') {
          return sum + campaign.metrics.revenue;
        }
        return sum;
      }, 0);
      
      const marketingCost = validCampaigns.reduce((sum, campaign) => {
        if (campaign && campaign.metrics && typeof campaign.metrics.cost === 'number') {
          return sum + campaign.metrics.cost;
        }
        return sum;
      }, 0);
      
      const roi = marketingCost > 0 ? ((totalRevenue - marketingCost) / marketingCost) * 100 : 0;

      // Calculate top sources with proper validation
      const sourceStats = validLeads.reduce((acc, lead) => {
        if (!lead || !lead.source) return acc;
        
        if (!acc[lead.source]) {
          acc[lead.source] = { leads: 0, conversions: 0, revenue: 0 };
        }
        acc[lead.source].leads++;
        if (lead.status === "converted") {
          acc[lead.source].conversions++;
          acc[lead.source].revenue += (lead.conversionValue || 0);
        }
        return acc;
      }, {} as Record<string, { leads: number; conversions: number; revenue: number }>);

      const topSources = Object.entries(sourceStats)
        .map(([source, stats]) => ({ 
          source, 
          leads: stats.leads, 
          conversions: stats.conversions, 
          revenue: stats.revenue 
        }))
        .sort((a, b) => b.leads - a.leads)
        .slice(0, 5);

      // Safely map campaign performance
      const campaignPerformance = validCampaigns.map(campaign => ({
        campaignId: campaign.id || '',
        name: campaign.title || 'Untitled Campaign',
        clicks: (campaign.metrics && typeof campaign.metrics.clicks === 'number') ? campaign.metrics.clicks : 0,
        conversions: (campaign.metrics && typeof campaign.metrics.conversions === 'number') ? campaign.metrics.conversions : 0,
        cost: (campaign.metrics && typeof campaign.metrics.cost === 'number') ? campaign.metrics.cost : 0,
        revenue: (campaign.metrics && typeof campaign.metrics.revenue === 'number') ? campaign.metrics.revenue : 0,
        roi: (campaign.metrics && typeof campaign.metrics.roi === 'number') ? campaign.metrics.roi : 0,
      }));

      return {
        period,
        totalLeads,
        convertedLeads,
        conversionRate,
        averageLeadValue: convertedLeads > 0 ? totalRevenue / convertedLeads : 0,
        totalRevenue,
        marketingCost,
        roi,
        topSources,
        campaignPerformance,
      };
    } catch (error) {
      console.error('Error calculating marketing metrics:', error);
      // Return default metrics structure on error
      return {
        period,
        totalLeads: 0,
        convertedLeads: 0,
        conversionRate: 0,
        averageLeadValue: 0,
        totalRevenue: 0,
        marketingCost: 0,
        roi: 0,
        topSources: [],
        campaignPerformance: [],
      };
    }
  },

  // Real-time subscriptions
  subscribeToCampaigns: (trainerId: string, callback: (campaigns: MarketingCampaign[]) => void) => {
    const campaignsRef = collection(db, "trainers", trainerId, "campaigns");
    return onSnapshot(campaignsRef, (snapshot) => {
      const campaigns = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MarketingCampaign[];
      callback(campaigns);
    });
  },

  subscribeToLeads: (trainerId: string, callback: (leads: Lead[]) => void) => {
    const leadsRef = collection(db, "trainers", trainerId, "leads");
    return onSnapshot(leadsRef, (snapshot) => {
      const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Lead[];
      callback(leads);
    });
  },

  subscribeToSocialPosts: (trainerId: string, callback: (posts: SocialPost[]) => void) => {
    const postsRef = collection(db, "trainers", trainerId, "socialPosts");
    return onSnapshot(postsRef, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SocialPost[];
      callback(posts);
    });
  },
};

// Utility function for generating unique IDs
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);
