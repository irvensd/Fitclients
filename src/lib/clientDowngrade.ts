import { Client } from "@/lib/types";

export interface ClientStatus {
  isActive: boolean;
  archivedAt?: string;
  archiveReason?: "plan_downgrade" | "manual" | string;
}

export interface ClientWithStatus extends Client {
  status: ClientStatus;
}

// Get active clients (within subscription limit)
export const getActiveClients = (
  clients: ClientWithStatus[],
): ClientWithStatus[] => {
  return clients.filter((client) => client.status.isActive);
};

// Get archived clients (over subscription limit)
export const getArchivedClients = (
  clients: ClientWithStatus[],
): ClientWithStatus[] => {
  return clients.filter((client) => !client.status.isActive);
};

// Archive excess clients when downgrading
export const archiveExcessClients = (
  clients: Client[],
  newLimit: number,
  selectedActiveIds: string[] = [],
): ClientWithStatus[] => {
  const now = new Date().toISOString();

  return clients.map((client, index) => {
    const shouldBeActive =
      selectedActiveIds.length > 0
        ? selectedActiveIds.includes(client.id)
        : index < newLimit; // If no selection, keep first X clients active

    return {
      ...client,
      status: {
        isActive: shouldBeActive,
        archivedAt: shouldBeActive ? undefined : now,
        archiveReason: shouldBeActive ? undefined : ("plan_downgrade" as const),
      },
    };
  });
};

// Reactivate all clients when upgrading
export const reactivateAllClients = (
  clients: ClientWithStatus[],
): ClientWithStatus[] => {
  return clients.map((client) => ({
    ...client,
    status: {
      isActive: true,
      archivedAt: undefined,
      archiveReason: undefined,
    },
  }));
};

// Get clients that need to be archived
export const getClientsToArchive = (
  clients: Client[],
  currentLimit: number,
  newLimit: number,
) => {
  if (newLimit >= currentLimit || clients.length <= newLimit) {
    return [];
  }

  return clients.slice(newLimit); // Clients that exceed the new limit
};

// Check if downgrade will affect clients
export const willDowngradeAffectClients = (
  clientCount: number,
  newLimit: number,
): boolean => {
  return clientCount > newLimit;
};

// Get downgrade impact summary
export const getDowngradeImpact = (clients: Client[], newLimit: number) => {
  const activeCount = Math.min(clients.length, newLimit);
  const archivedCount = Math.max(0, clients.length - newLimit);

  return {
    totalClients: clients.length,
    willRemainActive: activeCount,
    willBeArchived: archivedCount,
    needsSelection: clients.length > newLimit,
  };
};
