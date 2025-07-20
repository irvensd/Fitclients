// Client-related types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals?: string;
  notes?: string;
  dateJoined: string;
  status?: {
    isActive: boolean;
    archivedAt?: string;
    archiveReason?: string;
  };
  portalActive?: boolean;
  avatar?: string;
}

export interface ClientWithStatus extends Client {
  status: {
    isActive: boolean;
    archivedAt?: string;
  };
}

// Progress entry types
export interface ProgressEntry {
  id: string;
  clientId: string;
  date: string;
  weight?: number;
  height?: number;
  bodyFat?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    biceps?: number;
    thighs?: number;
    calves?: number;
    arms?: number; // Add missing arms property
  };
  notes?: string;
  photos?: string[]; // Add missing photos property
}

// Session types
export interface Session {
  id: string;
  clientId: string;
  date: string;
  time?: string;
  startTime?: string; // Add missing startTime property
  endTime?: string; // Add missing endTime property
  duration?: number;
  type: 'training' | 'personal-training' | 'consultation' | 'assessment' | 'follow-up';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  exercises?: SessionExercise[];
  cost?: number; // Add missing cost property
}

export interface SessionExercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
}

// Payment types
export interface Payment {
  id: string;
  clientId: string;
  amount: number;
  date: string;
  method: 'cash' | 'card' | 'bank_transfer' | 'bank-transfer' | 'venmo' | 'paypal' | 'check' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description?: string;
  notes?: string;
}

// Workout plan types
export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  clientId?: string;
  exercises: WorkoutExercise[];
  createdDate: string;
  updatedDate?: string;
  isActive: boolean;
  aiNotes?: string[];
}

export interface WorkoutExercise {
  name: string;
  category: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restTime?: number;
  notes?: string;
}

// User profile types
export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  address?: string;
  createdAt: string;
  lastLogin?: string;
  selectedPlan?: string;
  referralCode?: string;
  totalReferrals?: number;
  freeMonthsEarned?: number;
  referredBy?: string;
  operatingHours?: OperatingHours[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
  };
  certifications?: Certification[];
  pricing?: Pricing;
}

// Subscription types
export interface Subscription {
  id: string;
  planId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

// Support ticket types
export interface SupportTicket {
  id: string;
  clientName: string;
  clientEmail?: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  tags: string[];
  attachments?: Array<{ name: string; url: string; size: number }>;
  comments: SupportTicketComment[];
}

export interface SupportTicketComment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  isInternal: boolean;
}

// System alert types
export interface SystemAlert {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  createdAt: Date;
  affectedServices: string[];
  resolved: boolean;
}

// Service status types
export interface ServiceStatus {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'checking';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  lastChecked: Date;
  responseTime?: number;
  uptime?: number;
  url?: string;
  environment?: 'production' | 'staging' | 'development';
}

// Performance metrics types
export interface PerformanceMetrics {
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

// Form data types
export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string;
  notes: string;
  initialWeight: string;
}

export interface ProgressFormData {
  weight: string;
  height: string;
  bodyFat: string;
  chest: string;
  waist: string;
  hips: string;
  biceps: string;
  thighs: string;
  calves: string;
  notes: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Error types
export interface AppError {
  message: string;
  code?: string;
  details?: Record<string, any>;
  timestamp: Date;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Settings-related types
export interface OperatingHours {
  day: string;
  isOpen: boolean;
  startTime: string;
  endTime: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate: string;
  credentialId?: string;
  status: "active" | "expired" | "expiring-soon";
  notes?: string;
}

export interface Package {
  id: string;
  name: string;
  sessions: number;
  price: number;
  discount: number;
}

export interface Pricing {
  personalTraining: number;
  consultation: number;
  assessment: number;
  packageDiscount: number;
  currency: string;
  taxRate: number;
  packages: Package[];
}
