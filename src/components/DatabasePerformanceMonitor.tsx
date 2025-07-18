import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  Database,
  Wifi,
  WifiOff,
  Clock,
  Zap,
  HardDrive,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Cloud,
  CloudOff,
} from 'lucide-react';
import { unifiedDataService } from '@/lib/unifiedDataService';
import { optimizedFirebaseService } from '@/lib/optimizedFirebaseService';
import { offlineStorage } from '@/lib/offlineStorage';

interface PerformanceMetrics {
  connectionState: {
    isOnline: boolean;
    isFirebaseConnected: boolean;
    lastSyncTime: number;
  };
  firebaseMetrics: {
    cacheHitRate: number;
    cacheSize: number;
    activeSubscriptions: number;
    isOffline: boolean;
  };
  offlineStats: {
    totalSize: number;
    storeStats: Record<string, number>;
  };
  syncQueueSize: number;
}

interface DatabasePerformanceMonitorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabasePerformanceMonitor: React.FC<DatabasePerformanceMonitorProps> = ({
  isOpen,
  onClose,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  const loadMetrics = async () => {
    try {
      const performanceMetrics = await unifiedDataService.getPerformanceMetrics();
      setMetrics(performanceMetrics);
    } catch (error) {
      console.error('Failed to load performance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMetrics();
      
      if (autoRefresh) {
        const interval = setInterval(loadMetrics, 5000); // Refresh every 5 seconds
        setRefreshInterval(interval);
        
        return () => {
          clearInterval(interval);
        };
      }
    }
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [isOpen, autoRefresh]);

  const handleRefresh = () => {
    setLoading(true);
    loadMetrics();
  };

  const handleClearCache = async () => {
    try {
      optimizedFirebaseService.clearCache();
      await loadMetrics();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  const getConnectionStatus = () => {
    if (!metrics) return { status: 'unknown', color: 'gray' };
    
    const { isOnline, isFirebaseConnected } = metrics.connectionState;
    
    if (isOnline && isFirebaseConnected) {
      return { status: 'online', color: 'green', icon: Wifi };
    } else if (isOnline && !isFirebaseConnected) {
      return { status: 'degraded', color: 'yellow', icon: AlertTriangle };
    } else {
      return { status: 'offline', color: 'red', icon: WifiOff };
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (timestamp: number) => {
    if (timestamp === 0) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  if (!isOpen) return null;

  const connectionStatus = getConnectionStatus();
  const StatusIcon = connectionStatus.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <CardTitle>Database Performance Monitor</CardTitle>
            <Badge 
              variant={connectionStatus.color === 'green' ? 'default' : 'destructive'}
              className="flex items-center gap-1"
            >
              <StatusIcon className="h-3 w-3" />
              {connectionStatus.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {loading && !metrics ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading performance metrics...
            </div>
          ) : metrics ? (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="firebase">Firebase</TabsTrigger>
                <TabsTrigger value="offline">Offline Storage</TabsTrigger>
                <TabsTrigger value="sync">Sync Status</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Connection</CardTitle>
                        <StatusIcon className={`h-4 w-4 text-${connectionStatus.color}-500`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold capitalize">
                        {connectionStatus.status}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {metrics.connectionState.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Cache Hit Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {(metrics.firebaseMetrics.cacheHitRate * 100).toFixed(1)}%
                      </div>
                      <Progress 
                        value={metrics.firebaseMetrics.cacheHitRate * 100} 
                        className="mt-2"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Active Subscriptions</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {metrics.firebaseMetrics.activeSubscriptions}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Real-time connections
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Offline Data</CardTitle>
                        <HardDrive className="h-4 w-4 text-purple-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {metrics.offlineStats.totalSize}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Records stored locally
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Last Sync</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatTime(metrics.connectionState.lastSyncTime)}</span>
                      {metrics.connectionState.lastSyncTime > 0 && (
                        <Badge variant="outline" className="ml-auto">
                          {Math.round((Date.now() - metrics.connectionState.lastSyncTime) / 1000)}s ago
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="firebase" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Cloud className="h-4 w-4" />
                        Firebase Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Connection</span>
                        <Badge variant={metrics.connectionState.isFirebaseConnected ? 'default' : 'destructive'}>
                          {metrics.connectionState.isFirebaseConnected ? 'Connected' : 'Disconnected'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Cache Size</span>
                        <span>{metrics.firebaseMetrics.cacheSize} entries</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Offline Mode</span>
                        <Badge variant={metrics.firebaseMetrics.isOffline ? 'destructive' : 'default'}>
                          {metrics.firebaseMetrics.isOffline ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Cache Hit Rate</span>
                          <span>{(metrics.firebaseMetrics.cacheHitRate * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={metrics.firebaseMetrics.cacheHitRate * 100} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Active Subscriptions</span>
                        <span>{metrics.firebaseMetrics.activeSubscriptions}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleClearCache}
                        className="w-full"
                      >
                        Clear Cache
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="offline" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      Offline Storage Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Total Records</div>
                          <div className="text-2xl font-bold">{metrics.offlineStats.totalSize}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Collections</div>
                          <div className="text-2xl font-bold">{Object.keys(metrics.offlineStats.storeStats).length}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Storage Breakdown</div>
                        {Object.entries(metrics.offlineStats.storeStats).map(([store, count]) => (
                          <div key={store} className="flex justify-between items-center">
                            <span className="capitalize">{store}</span>
                            <Badge variant="outline">{count} records</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sync" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Sync Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      {metrics.connectionState.isOnline && metrics.connectionState.isFirebaseConnected ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}
                      <span className="font-medium">
                        {metrics.connectionState.isOnline && metrics.connectionState.isFirebaseConnected
                          ? 'Sync Available'
                          : 'Sync Unavailable'
                        }
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Last Sync</span>
                        <span>{formatTime(metrics.connectionState.lastSyncTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending Changes</span>
                        <Badge variant={metrics.syncQueueSize > 0 ? 'destructive' : 'default'}>
                          {metrics.syncQueueSize} items
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Auto Sync</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                    </div>

                    {metrics.syncQueueSize > 0 && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm text-yellow-800">
                            {metrics.syncQueueSize} changes are queued for sync when connection is restored.
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Failed to load performance metrics</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 