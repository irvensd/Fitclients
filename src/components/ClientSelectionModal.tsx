import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, Users, Archive, Crown } from "lucide-react";
import { Client } from "@/lib/types";
import { getDowngradeImpact } from "@/lib/clientDowngrade";

interface ClientSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  newPlanName: string;
  newLimit: number;
  onConfirm: (selectedClientIds: string[]) => void;
}

export const ClientSelectionModal = ({
  isOpen,
  onClose,
  clients,
  newPlanName,
  newLimit,
  onConfirm,
}: ClientSelectionModalProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    clients.slice(0, newLimit).map((c) => c.id),
  );

  const impact = getDowngradeImpact(clients, newLimit);

  const handleClientToggle = (clientId: string, checked: boolean) => {
    if (checked && selectedIds.length < newLimit) {
      setSelectedIds([...selectedIds, clientId]);
    } else if (!checked) {
      setSelectedIds(selectedIds.filter((id) => id !== clientId));
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedIds);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Choose Active Clients
          </DialogTitle>
          <DialogDescription>
            Your {newPlanName} plan allows {newLimit} active clients. Please
            select which {newLimit} clients you'd like to keep active.
          </DialogDescription>
        </DialogHeader>

        {/* Impact Summary */}
        <Alert>
          <Users className="h-4 w-4" />
          <AlertDescription>
            <strong>Impact Summary:</strong> {impact.willRemainActive} clients
            will remain active,
            {impact.willBeArchived} clients will be archived (read-only). You
            can reactivate archived clients by upgrading your plan.
          </AlertDescription>
        </Alert>

        {/* Selection Counter */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            Selected: {selectedIds.length} of {newLimit} allowed
          </span>
          <Badge
            variant={selectedIds.length === newLimit ? "default" : "secondary"}
          >
            {newLimit - selectedIds.length} remaining
          </Badge>
        </div>

        {/* Client Selection List */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Select Your Active Clients:</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {clients.map((client) => {
              const isSelected = selectedIds.includes(client.id);
              const canSelect = selectedIds.length < newLimit || isSelected;

              return (
                <Card
                  key={client.id}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? "ring-2 ring-primary bg-primary/5" : ""
                  } ${!canSelect ? "opacity-50" : ""}`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleClientToggle(client.id, checked as boolean)
                        }
                        disabled={!canSelect}
                      />

                      <Avatar className="h-8 w-8">
                        <AvatarImage src={client.avatar} />
                        <AvatarFallback className="text-xs">
                          {client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {client.name}
                          </span>
                          {isSelected && (
                            <Crown className="h-3 w-3 text-primary" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{client.email}</span>
                          <Badge variant="outline" className="text-xs">
                            {client.fitnessLevel}
                          </Badge>
                        </div>
                      </div>

                      {!isSelected && (
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">
                            <Archive className="h-3 w-3 mr-1" />
                            Will be archived
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Info about archived clients */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-medium text-sm text-blue-800 mb-1">
            About Archived Clients:
          </h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• View client information and history (read-only)</li>
            <li>• Cannot schedule new sessions or record payments</li>
            <li>• Easily reactivate by upgrading your plan</li>
            <li>• All data is safely preserved</li>
          </ul>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel Downgrade
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedIds.length === 0}
            className="flex-1"
          >
            Confirm Selection ({selectedIds.length}/{newLimit})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
