import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

interface AccessibleFormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  description?: string;
  success?: string;
  className?: string;
  children: React.ReactNode;
}

export const AccessibleFormField: React.FC<AccessibleFormFieldProps> = ({
  id,
  label,
  required = false,
  error,
  description,
  success,
  className,
  children,
}) => {
  const describedBy = [
    description ? `${id}-description` : '',
    error ? `${id}-error` : '',
    success ? `${id}-success` : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cn("space-y-2", className)}>
      <Label 
        htmlFor={id} 
        className={cn(
          "text-sm font-medium",
          error && "text-destructive",
          success && "text-green-600"
        )}
      >
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-label="required">
            *
          </span>
        )}
      </Label>
      
      {description && (
        <p 
          id={`${id}-description`}
          className="text-sm text-muted-foreground"
        >
          <Info className="inline h-4 w-4 mr-1" />
          {description}
        </p>
      )}
      
      {React.cloneElement(children as React.ReactElement, {
        id,
        'aria-describedby': describedBy || undefined,
        'aria-invalid': error ? 'true' : 'false',
        'aria-required': required,
        className: cn(
          (children as React.ReactElement).props.className,
          error && "border-destructive focus:border-destructive",
          success && "border-green-500 focus:border-green-500"
        ),
      })}
      
      {error && (
        <div 
          id={`${id}-error`}
          className="flex items-center gap-2 text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
      
      {success && (
        <div 
          id={`${id}-success`}
          className="flex items-center gap-2 text-sm text-green-600"
          role="status"
          aria-live="polite"
        >
          <CheckCircle className="h-4 w-4" />
          {success}
        </div>
      )}
    </div>
  );
};

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  description?: string;
  success?: string;
}

export const AccessibleInput: React.FC<AccessibleInputProps> = ({
  id,
  label,
  required,
  error,
  description,
  success,
  className,
  ...props
}) => {
  const inputId = id || `input-${React.useId()}`;
  
  return (
    <AccessibleFormField
      id={inputId}
      label={label}
      required={required}
      error={error}
      description={description}
      success={success}
      className={className}
    >
      <Input {...props} />
    </AccessibleFormField>
  );
};

interface AccessibleTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  description?: string;
  success?: string;
}

export const AccessibleTextarea: React.FC<AccessibleTextareaProps> = ({
  id,
  label,
  required,
  error,
  description,
  success,
  className,
  ...props
}) => {
  const textareaId = id || `textarea-${React.useId()}`;
  
  return (
    <AccessibleFormField
      id={textareaId}
      label={label}
      required={required}
      error={error}
      description={description}
      success={success}
      className={className}
    >
      <Textarea {...props} />
    </AccessibleFormField>
  );
};

interface AccessibleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  description?: string;
  success?: string;
  options: { value: string; label: string; disabled?: boolean }[];
}

export const AccessibleSelect: React.FC<AccessibleSelectProps> = ({
  id,
  label,
  required,
  error,
  description,
  success,
  className,
  options,
  ...props
}) => {
  const selectId = id || `select-${React.useId()}`;
  
  return (
    <AccessibleFormField
      id={selectId}
      label={label}
      required={required}
      error={error}
      description={description}
      success={success}
      className={className}
    >
      <select
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </AccessibleFormField>
  );
};

// Hook for form validation and accessibility
export const useAccessibleForm = () => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const setFieldError = React.useCallback((fieldId: string, error: string) => {
    setErrors(prev => ({ ...prev, [fieldId]: error }));
  }, []);

  const clearFieldError = React.useCallback((fieldId: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldId];
      return newErrors;
    });
  }, []);

  const setFieldTouched = React.useCallback((fieldId: string) => {
    setTouched(prev => ({ ...prev, [fieldId]: true }));
  }, []);

  const validateField = React.useCallback((fieldId: string, value: string, rules: any) => {
    if (rules.required && !value.trim()) {
      setFieldError(fieldId, `${rules.label || 'This field'} is required`);
      return false;
    }
    
    if (rules.minLength && value.length < rules.minLength) {
      setFieldError(fieldId, `${rules.label || 'This field'} must be at least ${rules.minLength} characters`);
      return false;
    }
    
    if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setFieldError(fieldId, 'Please enter a valid email address');
      return false;
    }
    
    clearFieldError(fieldId);
    return true;
  }, [setFieldError, clearFieldError]);

  const announceError = React.useCallback((message: string) => {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.setAttribute('aria-live', 'assertive');
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 3000);
    }
  }, []);

  return {
    errors,
    touched,
    setFieldError,
    clearFieldError,
    setFieldTouched,
    validateField,
    announceError,
  };
}; 