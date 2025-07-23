import { collection, getDocs, addDoc, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "./firebase";
import { logger } from "./utils";
import { Client, Session, Payment, WorkoutPlan, ProgressEntry } from "./types";

export interface BackupData {
  version: string;
  timestamp: string;
  user: {
    uid: string;
    email: string;
  };
  data: {
    clients: Client[];
    sessions: Session[];
    payments: Payment[];
    workoutPlans: WorkoutPlan[];
    progressEntries: ProgressEntry[];
  };
  metadata: {
    totalClients: number;
    totalSessions: number;
    totalPayments: number;
    totalWorkoutPlans: number;
    totalProgressEntries: number;
    backupSize: number;
  };
}

export interface BackupStatus {
  id: string;
  timestamp: string;
  status: 'in_progress' | 'completed' | 'failed';
  progress: number;
  message: string;
  downloadUrl?: string;
}

class BackupService {
  private static instance: BackupService;
  private backupStatus: Map<string, BackupStatus> = new Map();

  static getInstance(): BackupService {
    if (!BackupService.instance) {
      BackupService.instance = new BackupService();
    }
    return BackupService.instance;
  }

  /**
   * Export all user data to JSON format
   */
  async exportUserData(userId: string, userEmail: string): Promise<BackupData> {
    try {
      // Fetch all data from Firestore
      const [clients, sessions, payments, workoutPlans, progressEntries] = await Promise.all([
        this.fetchCollection(`users/${userId}/clients`),
        this.fetchCollection(`users/${userId}/sessions`),
        this.fetchCollection(`users/${userId}/payments`),
        this.fetchCollection(`users/${userId}/workoutPlans`),
        this.fetchCollection(`users/${userId}/progressEntries`)
      ]);

      const backupData: BackupData = {
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        user: {
          uid: userId,
          email: userEmail
        },
        data: {
          clients,
          sessions,
          payments,
          workoutPlans,
          progressEntries
        },
        metadata: {
          totalClients: clients.length,
          totalSessions: sessions.length,
          totalPayments: payments.length,
          totalWorkoutPlans: workoutPlans.length,
          totalProgressEntries: progressEntries.length,
          backupSize: 0 // Will be calculated after JSON stringification
        }
      };

      // Calculate backup size
      const jsonString = JSON.stringify(backupData, null, 2);
      backupData.metadata.backupSize = new Blob([jsonString]).size;

      return backupData;

    } catch (error) {
      logger.error('Error exporting user data:', error);
      throw new Error(`Failed to export data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Download backup data as JSON file
   */
  async downloadBackup(backupData: BackupData, filename?: string): Promise<void> {
    try {
      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `fitclients-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      logger.error('Error downloading backup:', error);
      throw new Error(`Failed to download backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Import data from backup file
   */
  async importBackup(userId: string, backupData: BackupData, options: {
    overwrite?: boolean;
    merge?: boolean;
    validateOnly?: boolean;
  } = {}): Promise<{
    success: boolean;
    imported: {
      clients: number;
      sessions: number;
      payments: number;
      workoutPlans: number;
      progressEntries: number;
    };
    errors: string[];
  }> {
    const results = {
      success: true,
      imported: {
        clients: 0,
        sessions: 0,
        payments: 0,
        workoutPlans: 0,
        progressEntries: 0
      },
      errors: [] as string[]
    };

    try {
      // Validate backup data
      if (!this.validateBackupData(backupData)) {
        throw new Error('Invalid backup data format');
      }

      if (options.validateOnly) {
        return results;
      }

      // Clear existing data if overwrite is enabled
      if (options.overwrite) {
        await this.clearUserData(userId);
      }

      // Import data collections
      const importPromises = [];

      if (backupData.data.clients.length > 0) {
        importPromises.push(
          this.importCollection(`users/${userId}/clients`, backupData.data.clients)
            .then(count => { results.imported.clients = count; })
            .catch(error => { results.errors.push(`Clients: ${error.message}`); })
        );
      }

      if (backupData.data.sessions.length > 0) {
        importPromises.push(
          this.importCollection(`users/${userId}/sessions`, backupData.data.sessions)
            .then(count => { results.imported.sessions = count; })
            .catch(error => { results.errors.push(`Sessions: ${error.message}`); })
        );
      }

      if (backupData.data.payments.length > 0) {
        importPromises.push(
          this.importCollection(`users/${userId}/payments`, backupData.data.payments)
            .then(count => { results.imported.payments = count; })
            .catch(error => { results.errors.push(`Payments: ${error.message}`); })
        );
      }

      if (backupData.data.workoutPlans.length > 0) {
        importPromises.push(
          this.importCollection(`users/${userId}/workoutPlans`, backupData.data.workoutPlans)
            .then(count => { results.imported.workoutPlans = count; })
            .catch(error => { results.errors.push(`Workout Plans: ${error.message}`); })
        );
      }

      if (backupData.data.progressEntries.length > 0) {
        importPromises.push(
          this.importCollection(`users/${userId}/progressEntries`, backupData.data.progressEntries)
            .then(count => { results.imported.progressEntries = count; })
            .catch(error => { results.errors.push(`Progress Entries: ${error.message}`); })
        );
      }

      await Promise.all(importPromises);

      // Check if any errors occurred
      if (results.errors.length > 0) {
        results.success = false;
        logger.warn('Import completed with errors:', results.errors);
      } else {
        // Data import completed successfully
      }

      return results;

    } catch (error) {
      logger.error('Error importing backup:', error);
      results.success = false;
      results.errors.push(error instanceof Error ? error.message : 'Unknown error');
      return results;
    }
  }

  /**
   * Create automated backup and store in cloud storage
   */
  async createAutomatedBackup(userId: string, userEmail: string): Promise<string> {
    const backupId = `backup-${userId}-${Date.now()}`;
    
    try {
      // Update backup status
      this.backupStatus.set(backupId, {
        id: backupId,
        timestamp: new Date().toISOString(),
        status: 'in_progress',
        progress: 0,
        message: 'Creating backup...'
      });

      // Export data
      const backupData = await this.exportUserData(userId, userEmail);
      
      // Store backup in Firestore (you could also use cloud storage)
      const backupRef = await addDoc(collection(db, "backups"), {
        userId,
        userEmail,
        backupData,
        createdAt: new Date(),
        status: 'completed'
      });

      // Update status
      this.backupStatus.set(backupId, {
        id: backupId,
        timestamp: new Date().toISOString(),
        status: 'completed',
        progress: 100,
        message: 'Backup completed successfully',
        downloadUrl: backupRef.id
      });

      return backupId;

    } catch (error) {
      logger.error('Error creating automated backup:', error);
      
      // Update status with error
      this.backupStatus.set(backupId, {
        id: backupId,
        timestamp: new Date().toISOString(),
        status: 'failed',
        progress: 0,
        message: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  /**
   * Get backup status
   */
  getBackupStatus(backupId: string): BackupStatus | undefined {
    return this.backupStatus.get(backupId);
  }

  /**
   * List all backups for a user
   */
  async listBackups(userId: string): Promise<Array<{
    id: string;
    timestamp: string;
    size: number;
    status: string;
  }>> {
    try {
      const backupsRef = collection(db, "backups");
      const querySnapshot = await getDocs(backupsRef);
      
      const backups = querySnapshot.docs
        .filter(doc => doc.data().userId === userId)
        .map(doc => ({
          id: doc.id,
          timestamp: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
          size: doc.data().backupData?.metadata?.backupSize || 0,
          status: doc.data().status || 'unknown'
        }))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return backups;
    } catch (error) {
      logger.error('Error listing backups:', error);
      throw new Error(`Failed to list backups: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Restore from a specific backup
   */
  async restoreFromBackup(userId: string, backupId: string): Promise<{
    success: boolean;
    restored: {
      clients: number;
      sessions: number;
      payments: number;
      workoutPlans: number;
      progressEntries: number;
    };
    errors: string[];
  }> {
    try {
      // Fetch backup data from Firestore
      const backupRef = doc(db, "backups", backupId);
      const backupDoc = await getDocs(collection(db, "backups"));
      const backupData = backupDoc.docs.find(doc => doc.id === backupId)?.data()?.backupData;

      if (!backupData) {
        throw new Error('Backup not found');
      }

      // Restore data with overwrite
      const importResult = await this.importBackup(userId, backupData, { overwrite: true });
      
      return {
        success: importResult.success,
        restored: importResult.imported,
        errors: importResult.errors
      };

    } catch (error) {
      logger.error('Error restoring from backup:', error);
      throw new Error(`Failed to restore backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a backup
   */
  async deleteBackup(backupId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "backups", backupId));
    } catch (error) {
      logger.error('Error deleting backup:', error);
      throw new Error(`Failed to delete backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Private helper methods

  private async fetchCollection(collectionPath: string): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(collection(db, collectionPath));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      logger.error(`Error fetching collection ${collectionPath}:`, error);
      return [];
    }
  }

  private async importCollection(collectionPath: string, data: any[]): Promise<number> {
    if (data.length === 0) return 0;

    const batch = writeBatch(db);
    let importedCount = 0;

    for (const item of data) {
      try {
        const { id, ...itemData } = item;
        const docRef = doc(collection(db, collectionPath));
        batch.set(docRef, itemData);
        importedCount++;
      } catch (error) {
        logger.error(`Error importing item in ${collectionPath}:`, error);
      }
    }

    await batch.commit();
    return importedCount;
  }

  private async clearUserData(userId: string): Promise<void> {
    const collections = ['clients', 'sessions', 'payments', 'workoutPlans', 'progressEntries'];
    
    for (const collectionName of collections) {
      try {
        const querySnapshot = await getDocs(collection(db, `users/${userId}/${collectionName}`));
        const batch = writeBatch(db);
        
        querySnapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        await batch.commit();
      } catch (error) {
        logger.error(`Error clearing ${collectionName}:`, error);
      }
    }
  }

  private validateBackupData(backupData: any): backupData is BackupData {
    return (
      backupData &&
      typeof backupData === 'object' &&
      backupData.version &&
      backupData.timestamp &&
      backupData.user &&
      backupData.data &&
      Array.isArray(backupData.data.clients) &&
      Array.isArray(backupData.data.sessions) &&
      Array.isArray(backupData.data.payments) &&
      Array.isArray(backupData.data.workoutPlans) &&
      Array.isArray(backupData.data.progressEntries)
    );
  }
}

export const backupService = BackupService.getInstance(); 