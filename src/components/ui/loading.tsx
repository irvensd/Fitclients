import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
  variant?: "default" | "primary" | "white";
}

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  variant?: "text" | "card" | "list";
}

interface LoadingPageProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

// Standardized loading spinner component
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
  text,
  variant = "default"
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const variantClasses = {
    default: "border-primary",
    primary: "border-primary",
    white: "border-white"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2 
        className={cn(
          "animate-spin",
          sizeClasses[size],
          variantClasses[variant]
        )} 
      />
      {text && (
        <p className={cn(
          "mt-2 text-sm text-muted-foreground",
          variant === "white" && "text-white/80"
        )}>
          {text}
        </p>
      )}
    </div>
  );
};

// Standardized skeleton loading component
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  lines = 3,
  variant = "text"
}) => {
  if (variant === "card") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
        <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "h-4 bg-muted rounded animate-pulse",
            i === 0 && "w-3/4",
            i === 1 && "w-1/2", 
            i === 2 && "w-5/6"
          )}
        />
      ))}
    </div>
  );
};

// Full page loading component
export const LoadingPage: React.FC<LoadingPageProps> = ({
  text = "Loading...",
  size = "lg"
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size={size} text={text} />
    </div>
  );
};

// Full screen loading component
export const LoadingScreen: React.FC<LoadingPageProps> = ({
  text = "Loading...",
  size = "lg"
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size={size} text={text} />
    </div>
  );
};

// Button loading component
export const LoadingButton: React.FC<{
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
}> = ({ children, loading, className }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </div>
  );
};

// Inline loading component for small spaces
export const LoadingInline: React.FC<{ className?: string }> = ({ className }) => {
  return <Loader2 className={cn("h-4 w-4 animate-spin", className)} />;
}; 