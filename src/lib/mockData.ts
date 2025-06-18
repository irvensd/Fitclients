import { Client, Session, Payment } from "./types";

// Centralized mock data for the application
export const mockClients: Client[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    dateJoined: "2024-01-15",
    fitnessLevel: "intermediate",
    goals: "Weight loss and strength building",
    notes:
      "Prefers morning sessions. Has knee issues - avoid high impact exercises.",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "(555) 234-5678",
    dateJoined: "2024-02-03",
    fitnessLevel: "beginner",
    goals: "Build muscle mass and improve endurance",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "(555) 345-6789",
    dateJoined: "2024-01-28",
    fitnessLevel: "advanced",
    goals: "Marathon training and performance optimization",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "(555) 456-7890",
    dateJoined: "2024-02-10",
    fitnessLevel: "intermediate",
    goals: "Functional fitness and injury prevention",
  },
  {
    id: "5",
    name: "Alex Thompson",
    email: "alex.thompson@email.com",
    phone: "(555) 567-8901",
    dateJoined: "2025-01-18",
    fitnessLevel: "beginner",
    goals: "General fitness and health improvement",
  },
  {
    id: "6",
    name: "Maria Rodriguez",
    email: "maria.rodriguez@email.com",
    phone: "(555) 678-9012",
    dateJoined: "2025-01-13",
    fitnessLevel: "intermediate",
    goals: "Strength training and flexibility",
  },
  {
    id: "7",
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "(555) 890-1234",
    dateJoined: "2024-02-14",
    fitnessLevel: "intermediate",
    goals: "Sports performance and agility training",
  },
  {
    id: "8",
    name: "Rachel Martinez",
    email: "rachel.martinez@email.com",
    phone: "(555) 111-2222",
    dateJoined: new Date().toISOString().split("T")[0], // Today
    fitnessLevel: "beginner",
    goals: "Weight loss and general fitness",
    notes: "New member - very motivated!",
  },
  {
    id: "9",
    name: "Tom Anderson",
    email: "tom.anderson@email.com",
    phone: "(555) 333-4444",
    dateJoined: new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // Yesterday
    fitnessLevel: "intermediate",
    goals: "Strength training and muscle building",
  },
  {
    id: "10",
    name: "Sophie Chen",
    email: "sophie.chen@email.com",
    phone: "(555) 555-6666",
    dateJoined: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 2 days ago
    fitnessLevel: "advanced",
    goals: "Powerlifting competition prep",
  },
];

export const mockSessions: Session[] = [
  // Past completed sessions (last 2 weeks)
  {
    id: "1",
    clientId: "1", // Sarah Johnson
    date: "2024-01-15",
    startTime: "09:00",
    endTime: "10:00",
    type: "assessment",
    status: "completed",
    notes: "Initial fitness assessment - knee issues noted",
    cost: 50,
  },
  {
    id: "2",
    clientId: "1",
    date: "2024-01-18",
    startTime: "09:00",
    endTime: "10:00",
    type: "personal-training",
    status: "completed",
    notes: "First workout session - focused on low impact exercises",
    cost: 75,
  },
  {
    id: "3",
    clientId: "2", // Mike Chen
    date: "2024-02-03",
    startTime: "10:30",
    endTime: "11:30",
    type: "assessment",
    status: "completed",
    notes: "Beginner assessment - good baseline strength",
    cost: 50,
  },
  {
    id: "4",
    clientId: "3", // Emily Davis
    date: "2024-01-28",
    startTime: "07:00",
    endTime: "08:00",
    type: "personal-training",
    status: "completed",
    notes: "Marathon training - tempo run and strength work",
    cost: 75,
  },
  {
    id: "5",
    clientId: "1",
    date: "2024-01-22",
    startTime: "09:00",
    endTime: "10:00",
    type: "personal-training",
    status: "completed",
    notes: "Great progress on form, increased weights",
    cost: 75,
  },
  {
    id: "6",
    clientId: "2",
    date: "2024-02-06",
    startTime: "10:30",
    endTime: "11:30",
    type: "personal-training",
    status: "completed",
    notes: "Upper body strength focus - bench press improvement",
    cost: 75,
  },
  {
    id: "7",
    clientId: "4", // James Wilson
    date: "2024-02-10",
    startTime: "15:30",
    endTime: "16:30",
    type: "consultation",
    status: "completed",
    notes: "Discussed functional fitness goals and injury prevention",
    cost: 60,
  },

  // This week's sessions
  {
    id: "8",
    clientId: "1",
    date: "2024-02-12",
    startTime: "09:00",
    endTime: "10:00",
    type: "personal-training",
    status: "completed",
    notes: "Excellent progress! Lost 6 lbs total, strength improving",
    cost: 75,
  },
  {
    id: "9",
    clientId: "3",
    date: "2024-02-14",
    startTime: "07:00",
    endTime: "08:00",
    type: "personal-training",
    status: "completed",
    notes: "Long run prep - 8 mile pace work, felt strong",
    cost: 75,
  },

  // Today and upcoming sessions
  {
    id: "11",
    clientId: "2", // Mike Chen
    date: "2024-02-15",
    startTime: "10:30",
    endTime: "11:30",
    type: "personal-training",
    status: "scheduled",
    notes: "Upper body focus - chest and back",
    cost: 75,
  },
  {
    id: "12",
    clientId: "1", // Sarah Johnson
    date: "2024-02-16",
    startTime: "09:00",
    endTime: "10:00",
    type: "personal-training",
    status: "scheduled",
    notes: "Lower body and core strengthening",
    cost: 75,
  },
  {
    id: "13",
    clientId: "3", // Emily Davis
    date: "2024-02-17",
    startTime: "07:00",
    endTime: "08:00",
    type: "personal-training",
    status: "scheduled",
    notes: "Marathon speed work - intervals",
    cost: 75,
  },
  {
    id: "14",
    clientId: "4", // James Wilson
    date: "2024-02-18",
    startTime: "15:30",
    endTime: "16:30",
    type: "personal-training",
    status: "scheduled",
    notes: "Functional movement patterns",
    cost: 75,
  },
  {
    id: "15",
    clientId: "5", // Alex Rodriguez
    date: "2024-02-19",
    startTime: "17:00",
    endTime: "18:00",
    type: "assessment",
    status: "scheduled",
    notes: "Initial fitness assessment",
    cost: 50,
  },

  // Next week's sessions
  {
    id: "16",
    clientId: "1",
    date: "2024-02-22",
    startTime: "09:00",
    endTime: "10:00",
    type: "personal-training",
    status: "scheduled",
    cost: 75,
  },
  {
    id: "17",
    clientId: "2",
    date: "2024-02-22",
    startTime: "10:30",
    endTime: "11:30",
    type: "personal-training",
    status: "scheduled",
    cost: 75,
  },
  {
    id: "18",
    clientId: "1",
    date: "2025-01-20",
    startTime: "10:00",
    endTime: "11:00",
    type: "personal-training",
    status: "cancelled",
    notes: "Client cancelled via portal: Schedule conflict - have to work late",
    cost: 75,
    cancelledBy: "client",
    cancelledAt: "2025-01-17T10:30:00Z",
  },
  {
    id: "19",
    clientId: "2",
    date: "2025-01-21",
    startTime: "14:00",
    endTime: "15:00",
    type: "personal-training",
    status: "cancelled",
    notes: "Trainer cancelled due to illness",
    cost: 75,
    cancelledBy: "trainer",
    cancelledAt: "2025-01-18T09:00:00Z",
  },
];

export const mockPayments: Payment[] = [
  // Completed payments
  {
    id: "1",
    clientId: "1", // Sarah Johnson
    sessionId: "1",
    amount: 50,
    date: "2024-01-15",
    method: "card",
    status: "completed",
    description: "Initial Fitness Assessment",
  },
  {
    id: "2",
    clientId: "1",
    sessionId: "2",
    amount: 75,
    date: "2024-01-18",
    method: "card",
    status: "completed",
    description: "Personal Training Session",
  },
  {
    id: "3",
    clientId: "2", // Mike Chen
    sessionId: "3",
    amount: 50,
    date: "2024-02-03",
    method: "cash",
    status: "completed",
    description: "Initial Assessment",
  },
  {
    id: "4",
    clientId: "3", // Emily Davis
    sessionId: "4",
    amount: 75,
    date: "2024-01-28",
    method: "bank-transfer",
    status: "completed",
    description: "Marathon Training Session",
  },
  {
    id: "5",
    clientId: "1",
    sessionId: "5",
    amount: 75,
    date: "2024-01-22",
    method: "card",
    status: "completed",
    description: "Personal Training Session",
  },
  {
    id: "6",
    clientId: "2",
    sessionId: "6",
    amount: 75,
    date: "2024-02-06",
    method: "cash",
    status: "completed",
    description: "Upper Body Strength Training",
  },
  {
    id: "7",
    clientId: "4", // James Wilson
    sessionId: "7",
    amount: 60,
    date: "2024-02-10",
    method: "venmo",
    status: "completed",
    description: "Functional Fitness Consultation",
  },
  {
    id: "8",
    clientId: "1",
    sessionId: "8",
    amount: 75,
    date: "2024-02-12",
    method: "card",
    status: "completed",
    description: "Personal Training Session",
  },
  {
    id: "9",
    clientId: "3",
    sessionId: "9",
    amount: 75,
    date: "2024-02-14",
    method: "bank-transfer",
    status: "completed",
    description: "Marathon Training Session",
  },

  // Package deals and pending payments
  {
    id: "10",
    clientId: "1",
    amount: 300,
    date: "2024-02-01",
    method: "card",
    status: "completed",
    description: "February Package (4 sessions)",
  },
  {
    id: "11",
    clientId: "2",
    amount: 225,
    date: "2024-02-01",
    method: "bank-transfer",
    status: "completed",
    description: "February Package (3 sessions)",
  },

  // Pending payments (invoices due)
  {
    id: "12",
    clientId: "4",
    amount: 225,
    date: "2024-02-15",
    method: "bank-transfer",
    status: "pending",
    description: "February Package (3 sessions)",
  },
  {
    id: "13",
    clientId: "5",
    amount: 50,
    date: "2024-02-19",
    method: "cash",
    status: "pending",
    description: "Initial Assessment",
  },
  {
    id: "14",
    clientId: "6",
    amount: 150,
    date: "2025-01-13",
    method: "venmo",
    status: "pending",
    description: "Bi-weekly Package (2 sessions)",
  },

  // Failed payment
  {
    id: "15",
    clientId: "7",
    amount: 75,
    date: "2025-01-19",
    method: "card",
    status: "failed",
    description: "Personal Training Session",
  },
];

// Helper function to get client name by ID
export const getClientName = (clientId: string): string => {
  const client = mockClients.find((c) => c.id === clientId);
  return client ? client.name : "Unknown Client";
};
