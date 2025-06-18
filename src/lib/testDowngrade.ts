// Simple test utility to demonstrate the downgrade logic
// Run this in console: testDowngrade()

import {
  willDowngradeAffectClients,
  getDowngradeImpact,
} from "./clientDowngrade";

export const testDowngrade = () => {
  console.log("=== Testing Subscription Downgrade Logic ===");

  // Scenario: User has 20 clients, downgrades to free plan (5 client limit)
  const clientCount = 20;
  const newLimit = 5;

  console.log(`Current clients: ${clientCount}`);
  console.log(`New plan limit: ${newLimit}`);

  const willAffect = willDowngradeAffectClients(clientCount, newLimit);
  console.log(`Will downgrade affect clients? ${willAffect}`);

  if (willAffect) {
    const mockClients = Array.from({ length: clientCount }, (_, i) => ({
      id: `client_${i + 1}`,
      name: `Client ${i + 1}`,
      email: `client${i + 1}@example.com`,
      fitnessLevel: "beginner" as const,
      goals: "Weight loss",
      notes: "",
      dateJoined: "2024-01-01",
      avatar: "",
    }));

    const impact = getDowngradeImpact(mockClients, newLimit);

    console.log("=== Impact Summary ===");
    console.log(`Total clients: ${impact.totalClients}`);
    console.log(`Will remain active: ${impact.willRemainActive}`);
    console.log(`Will be archived: ${impact.willBeArchived}`);
    console.log(`Needs selection modal: ${impact.needsSelection}`);
  }

  console.log("=== Test Complete ===");
};

// Add to window for console access
if (typeof window !== "undefined") {
  (window as any).testDowngrade = testDowngrade;
}
