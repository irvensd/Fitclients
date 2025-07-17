import { db } from './firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

/**
 * Utility to fix future lastLogin dates in the database
 * This script will update any users with future lastLogin dates to use the current date
 */
export const fixFutureLastLoginDates = async () => {
  try {
    console.log('Starting to fix future lastLogin dates...');
    
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const now = new Date();
    let fixedCount = 0;
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const lastLogin = userData.lastLogin;
      
      if (lastLogin) {
        let loginDate: Date;
        
        // Handle both string dates and Firestore timestamps
        if (typeof lastLogin === 'string') {
          loginDate = new Date(lastLogin);
        } else if (lastLogin.toDate && typeof lastLogin.toDate === 'function') {
          loginDate = lastLogin.toDate();
        } else {
          continue;
        }
        
        // Check if the date is in the future
        if (loginDate > now) {
          console.log(`Fixing future lastLogin for user ${userDoc.id}: ${loginDate} -> ${now}`);
          
          await updateDoc(doc(db, 'users', userDoc.id), {
            lastLogin: now.toISOString()
          });
          
          fixedCount++;
        }
      }
    }
    
    console.log(`Fixed ${fixedCount} users with future lastLogin dates`);
    return fixedCount;
  } catch (error) {
    console.error('Error fixing future lastLogin dates:', error);
    throw error;
  }
};

/**
 * Check how many users have future lastLogin dates
 */
export const checkFutureLastLoginDates = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const now = new Date();
    const futureDates: Array<{id: string, email: string, lastLogin: Date}> = [];
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const lastLogin = userData.lastLogin;
      
      if (lastLogin) {
        let loginDate: Date;
        
        if (typeof lastLogin === 'string') {
          loginDate = new Date(lastLogin);
        } else if (lastLogin.toDate && typeof lastLogin.toDate === 'function') {
          loginDate = lastLogin.toDate();
        } else {
          continue;
        }
        
        if (loginDate > now) {
          futureDates.push({
            id: userDoc.id,
            email: userData.email || 'unknown',
            lastLogin: loginDate
          });
        }
      }
    }
    
    console.log(`Found ${futureDates.length} users with future lastLogin dates:`, futureDates);
    return futureDates;
  } catch (error) {
    console.error('Error checking future lastLogin dates:', error);
    throw error;
  }
}; 