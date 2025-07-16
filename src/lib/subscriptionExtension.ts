import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface SubscriptionExtension {
  userId: string;
  freeMonthsRemaining: number;
  lastExtensionDate?: string;
  totalExtensionsEarned: number;
  extensionsUsed: number;
}

export const subscriptionExtensionService = {
  // Apply a free month to a user's subscription
  applyFreeMonth: async (userId: string): Promise<boolean> => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error("User not found");
      }

      const userData = userDoc.data();
      const currentExtensions = userData.subscriptionExtensions || {
        freeMonthsRemaining: 0,
        totalExtensionsEarned: 0,
        extensionsUsed: 0,
      };

      // Add one free month
      const updatedExtensions = {
        ...currentExtensions,
        freeMonthsRemaining: (currentExtensions.freeMonthsRemaining || 0) + 1,
        totalExtensionsEarned: (currentExtensions.totalExtensionsEarned || 0) + 1,
        lastExtensionDate: new Date().toISOString(),
      };

      await updateDoc(userRef, {
        subscriptionExtensions: updatedExtensions,
      });

      console.log(`Applied free month to user ${userId}`);
      return true;
    } catch (error) {
      console.error("Error applying free month:", error);
      throw error;
    }
  },

  // Get user's subscription extension status
  getUserExtensions: async (userId: string): Promise<SubscriptionExtension | null> => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data();
      return userData.subscriptionExtensions || {
        userId,
        freeMonthsRemaining: 0,
        totalExtensionsEarned: 0,
        extensionsUsed: 0,
      };
    } catch (error) {
      console.error("Error getting user extensions:", error);
      return null;
    }
  },

  // Use a free month (called when subscription renews)
  useFreeMonth: async (userId: string): Promise<boolean> => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error("User not found");
      }

      const userData = userDoc.data();
      const currentExtensions = userData.subscriptionExtensions || {
        freeMonthsRemaining: 0,
        totalExtensionsEarned: 0,
        extensionsUsed: 0,
      };

      if (currentExtensions.freeMonthsRemaining <= 0) {
        return false; // No free months available
      }

      // Use one free month
      const updatedExtensions = {
        ...currentExtensions,
        freeMonthsRemaining: currentExtensions.freeMonthsRemaining - 1,
        extensionsUsed: (currentExtensions.extensionsUsed || 0) + 1,
      };

      await updateDoc(userRef, {
        subscriptionExtensions: updatedExtensions,
      });

      console.log(`Used free month for user ${userId}`);
      return true;
    } catch (error) {
      console.error("Error using free month:", error);
      throw error;
    }
  },
}; 