/**
 * Validation utilities for the FitClients application
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Email validation
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
}

/**
 * Password validation
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }
  
  return { isValid: true };
}

/**
 * Phone number validation (basic)
 */
export function validatePhone(phone: string): ValidationResult {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  
  if (!phone) {
    return { isValid: true }; // Phone is optional
  }
  
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  
  return { isValid: true };
}

/**
 * Name validation
 */
export function validateName(name: string, fieldName: string = 'Name'): ValidationResult {
  if (!name) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (name.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
  }
  
  if (name.length > 50) {
    return { isValid: false, error: `${fieldName} must be less than 50 characters` };
  }
  
  return { isValid: true };
}

/**
 * Number validation
 */
export function validateNumber(value: string | number, fieldName: string = 'Value'): ValidationResult {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }
  
  if (num < 0) {
    return { isValid: false, error: `${fieldName} must be positive` };
  }
  
  return { isValid: true };
}

/**
 * Date validation
 */
export function validateDate(date: string | Date, fieldName: string = 'Date'): ValidationResult {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: `${fieldName} must be a valid date` };
  }
  
  const now = new Date();
  if (dateObj > now) {
    return { isValid: false, error: `${fieldName} cannot be in the future` };
  }
  
  return { isValid: true };
}

/**
 * URL validation
 */
export function validateUrl(url: string): ValidationResult {
  if (!url) {
    return { isValid: true }; // URL is optional
  }
  
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
}

/**
 * Client data validation
 */
export function validateClientData(data: {
  name: string;
  email: string;
  phone?: string;
  fitnessLevel: string;
  goals: string;
}): ValidationResult {
  // Validate name
  const nameValidation = validateName(data.name, 'Name');
  if (!nameValidation.isValid) return nameValidation;
  
  // Validate email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) return emailValidation;
  
  // Validate phone (optional)
  if (data.phone) {
    const phoneValidation = validatePhone(data.phone);
    if (!phoneValidation.isValid) return phoneValidation;
  }
  
  // Validate fitness level
  if (!data.fitnessLevel) {
    return { isValid: false, error: 'Fitness level is required' };
  }
  
  // Validate goals
  if (!data.goals || data.goals.trim().length < 10) {
    return { isValid: false, error: 'Goals must be at least 10 characters long' };
  }
  
  return { isValid: true };
}

/**
 * Session data validation
 */
export function validateSessionData(data: {
  clientId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  cost: number;
}): ValidationResult {
  // Validate client ID
  if (!data.clientId) {
    return { isValid: false, error: 'Client is required' };
  }
  
  // Validate date
  const dateValidation = validateDate(data.date, 'Session date');
  if (!dateValidation.isValid) return dateValidation;
  
  // Validate times
  if (!data.startTime || !data.endTime) {
    return { isValid: false, error: 'Start and end times are required' };
  }
  
  // Validate that end time is after start time
  const startTime = new Date(`2000-01-01T${data.startTime}`);
  const endTime = new Date(`2000-01-01T${data.endTime}`);
  
  if (endTime <= startTime) {
    return { isValid: false, error: 'End time must be after start time' };
  }
  
  // Validate session type
  const validTypes = ['personal-training', 'consultation', 'assessment'];
  if (!validTypes.includes(data.type)) {
    return { isValid: false, error: 'Invalid session type' };
  }
  
  // Validate cost
  const costValidation = validateNumber(data.cost, 'Cost');
  if (!costValidation.isValid) return costValidation;
  
  return { isValid: true };
}

/**
 * Payment data validation
 */
export function validatePaymentData(data: {
  clientId: string;
  amount: number;
  date: string;
  method: string;
  description: string;
}): ValidationResult {
  // Validate client ID
  if (!data.clientId) {
    return { isValid: false, error: 'Client is required' };
  }
  
  // Validate amount
  const amountValidation = validateNumber(data.amount, 'Amount');
  if (!amountValidation.isValid) return amountValidation;
  
  // Validate date
  const dateValidation = validateDate(data.date, 'Payment date');
  if (!dateValidation.isValid) return dateValidation;
  
  // Validate payment method
  const validMethods = ['cash', 'card', 'bank-transfer', 'venmo', 'paypal'];
  if (!validMethods.includes(data.method)) {
    return { isValid: false, error: 'Invalid payment method' };
  }
  
  // Validate description
  if (!data.description || data.description.trim().length < 3) {
    return { isValid: false, error: 'Description must be at least 3 characters long' };
  }
  
  return { isValid: true };
} 