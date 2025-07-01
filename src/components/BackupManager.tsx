import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { backupService, BackupData } from "@/lib/backupService";
import {
  Download,
  Upload,
  Database,
  RefreshCw,
  Trash2,
  MoreVertical,
  AlertTriangle,
  FileText,
  Cloud,
  History
} from "lucide-react";

interface BackupManagerProps {
  onDataChange?: () => void;
}

export const BackupManager = ({ onDataChange }: BackupManagerProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backups, setBackups] = useState<Array<{
    id: string;
    timestamp: string;
    size: number;
    status: string;
  }>>([]);
  const [loadingBackups, setLoadingBackups] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<BackupData | null>(null);

  const loadBackups = async () => {
    if (!user) return;
    
    setLoadingBackups(true);
    try {
      const userBackups = await backupService.listBackups(user.uid);
      setBackups(userBackups);
    } catch (error) {
      console.error('Error loading backups:', error);
      toast({
        title: "Error",
        description: "Failed to load backups",
        variant: "destructive"
      });
    } finally {
      setLoadingBackups(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;
    
    setIsExporting(true);
    try {
      const backupData = await backupService.exportUserData(user.uid, user.email || '');
      await backupService.downloadBackup(backupData);
      
      toast({
        title: "Export Successful",
        description: `Exported ${backupData.metadata.totalClients} clients, ${backupData.metadata.totalSessions} sessions, and ${backupData.metadata.totalPayments} payments`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreateBackup = async () => {
    if (!user) return;
    
    setIsCreatingBackup(true);
    try {
      const backupId = await backupService.createAutomatedBackup(user.uid, user.email || '');
      
      toast({
        title: "Backup Created",
        description: "Your data has been backed up successfully",
      });
      
      // Refresh backups list
      await loadBackups();
    } catch (error) {
      console.error('Backup creation error:', error);
      toast({
        title: "Backup Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    
    // Preview the file content
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);
        setImportPreview(content);
        setShowImportDialog(true);
      } catch (error) {
        toast({
          title: "Invalid File",
          description: "Please select a valid FitClients backup file",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const handleImportData = async (overwrite: boolean = false) => {
    if (!user || !importFile || !importPreview) return;
    
    setIsImporting(true);
    setImportProgress(0);
    
    try {
      const result = await backupService.importBackup(user.uid, importPreview, { overwrite });
      
      if (result.success) {
        toast({
          title: "Import Successful",
          description: `Imported ${result.imported.clients} clients, ${result.imported.sessions} sessions, and ${result.imported.payments} payments`,
        });
        
        // Trigger data refresh
        if (onDataChange) {
          onDataChange();
        }
      } else {
        toast({
          title: "Import Completed with Errors",
          description: `${result.errors.length} errors occurred during import`,
          variant: "destructive"
        });
      }
      
      setShowImportDialog(false);
      setImportFile(null);
      setImportPreview(null);
      
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    if (!user) return;
    
    if (!confirm("This will overwrite your current data. Are you sure you want to continue?")) {
      return;
    }
    
    setIsImporting(true);
    try {
      const result = await backupService.restoreFromBackup(user.uid, backupId);
      
      if (result.success) {
        toast({
          title: "Restore Successful",
          description: `Restored ${result.restored.clients} clients, ${result.restored.sessions} sessions, and ${result.restored.payments} payments`,
        });
        
        // Trigger data refresh
        if (onDataChange) {
          onDataChange();
        }
      } else {
        toast({
          title: "Restore Completed with Errors",
          description: `${result.errors.length} errors occurred during restore`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Restore error:', error);
      toast({
        title: "Restore Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    if (!confirm("Are you sure you want to delete this backup?")) {
      return;
    }
    
    try {
      await backupService.deleteBackup(backupId);
      toast({
        title: "Backup Deleted",
        description: "Backup has been permanently deleted",
      });
      
      // Refresh backups list
      await loadBackups();
    } catch (error) {
      console.error('Delete backup error:', error);
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Export, import, and backup your FitClients data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleExportData}
              disabled={isExporting}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Download className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Export Data</div>
                <div className="text-xs text-muted-foreground">Download as JSON</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Upload className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Import Data</div>
                <div className="text-xs text-muted-foreground">From backup file</div>
              </div>
            </Button>

            <Button
              onClick={handleCreateBackup}
              disabled={isCreatingBackup}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Cloud className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Create Backup</div>
                <div className="text-xs text-muted-foreground">Save to cloud</div>
              </div>
            </Button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Progress indicator */}
          {(isExporting || isImporting || isCreatingBackup) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>
                  {isExporting && "Exporting data..."}
                  {isImporting && "Importing data..."}
                  {isCreatingBackup && "Creating backup..."}
                </span>
                <span>{importProgress}%</span>
              </div>
              <Progress value={importProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5" />
              <CardTitle>Backup History</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadBackups}
              disabled={loadingBackups}
            >
              <RefreshCw className={`h-4 w-4 ${loadingBackups ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <CardDescription>
            Your automated backups stored in the cloud
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingBackups ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading backups...</p>
            </div>
          ) : backups.length === 0 ? (
            <div className="text-center py-8">
              <Cloud className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No backups found</p>
              <p className="text-xs text-muted-foreground">Create your first backup to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Backup {backup.id.slice(-8)}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(backup.timestamp)} • {formatFileSize(backup.size)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={backup.status === 'completed' ? 'default' : 'secondary'}>
                      {backup.status}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRestoreBackup(backup.id)}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Restore
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteBackup(backup.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
            <DialogDescription>
              Review the data before importing
            </DialogDescription>
          </DialogHeader>
          
          {importPreview && (
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This will import data from {formatDate(importPreview.timestamp)}. 
                  Choose whether to overwrite existing data or merge with current data.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Clients:</span>
                  <span>{importPreview.metadata.totalClients}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sessions:</span>
                  <span>{importPreview.metadata.totalSessions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Payments:</span>
                  <span>{importPreview.metadata.totalPayments}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Workout Plans:</span>
                  <span>{importPreview.metadata.totalWorkoutPlans}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Progress Entries:</span>
                  <span>{importPreview.metadata.totalProgressEntries}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowImportDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleImportData(false)}
                  disabled={isImporting}
                  className="flex-1"
                >
                  Merge Data
                </Button>
                <Button
                  onClick={() => handleImportData(true)}
                  disabled={isImporting}
                  variant="destructive"
                  className="flex-1"
                >
                  Overwrite
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 