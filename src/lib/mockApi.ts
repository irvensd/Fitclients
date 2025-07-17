import { db, auth } from './firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

// Mock API endpoints for health and status checks
// In a real production app, these would be actual backend endpoints

export const mockApi = {
  // Health check endpoint
  health: async () => {
    try {
      const checks = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          app: { status: 'up', message: 'Application is running' },
          firebase: { status: 'up', message: 'Firebase services connected' },
          auth: { status: auth ? 'up' : 'down', message: auth ? 'Authentication service available' : 'Authentication service unavailable' }
        } as Record<string, { status: string; message: string }>,
        version: '1.0.0',
        environment: 'production'
      };

      // Test database connectivity
      try {
        const testQuery = query(collection(db, 'users'), limit(1));
        await getDocs(testQuery);
        checks.services.database = { status: 'up', message: 'Database is accessible' };
      } catch (error) {
        checks.services.database = { status: 'down', message: 'Database connection failed' };
        checks.status = 'degraded';
      }

      return {
        ok: true,
        data: checks
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Health check failed',
        data: null
      };
    }
  },

  // System status endpoint
  status: async () => {
    try {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Get system metrics
      const metrics = {
        timestamp: now.toISOString(),
        system: {
          uptime: '99.9%', // Would be calculated from real monitoring data
          load: {
            cpu: Math.floor(Math.random() * 30) + 10, // 10-40% CPU usage
            memory: Math.floor(Math.random() * 40) + 30, // 30-70% memory usage
          }
        },
        database: {
          connections: Math.floor(Math.random() * 50) + 20,
          responseTime: Math.floor(Math.random() * 100) + 50,
          status: 'operational'
        },
        errors: {
          last24h: 0,
          rate: 0
        },
        users: {
          active: 0,
          total: 0
        }
      };

      // Get error count from last 24 hours
      try {
        const errorQuery = query(
          collection(db, 'errorLogs'),
          where('timestamp', '>', oneDayAgo),
          where('level', '==', 'error')
        );
        const errorSnapshot = await getDocs(errorQuery);
        metrics.errors.last24h = errorSnapshot.size;
        metrics.errors.rate = Number((errorSnapshot.size / 24).toFixed(2)); // errors per hour
      } catch (error) {
        console.error('Failed to fetch error metrics:', error);
      }

      // Get user counts
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        metrics.users.total = usersSnapshot.size;
        
        // Count active users (logged in within last 24 hours)
        const activeCount = usersSnapshot.docs.filter(doc => {
          const lastLogin = doc.data().lastLogin;
          if (lastLogin) {
            let loginDate: Date;
            
            // Handle both Firestore timestamps and string dates
            if (lastLogin.toDate && typeof lastLogin.toDate === 'function') {
              // Firestore timestamp
              loginDate = lastLogin.toDate();
            } else if (typeof lastLogin === 'string') {
              // String date
              loginDate = new Date(lastLogin);
            } else {
              return false;
            }
            
            // Check if login was within last 24 hours
            return loginDate > oneDayAgo;
          }
          return false;
        }).length;
        
        metrics.users.active = activeCount;
      } catch (error) {
        console.error('Failed to fetch user metrics:', error);
      }

      return {
        ok: true,
        data: metrics
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Status check failed',
        data: null
      };
    }
  }
};

// Export individual endpoint functions
export const getHealth = () => mockApi.health();
export const getStatus = () => mockApi.status(); 