import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  level = 1,
  className,
  children,
}) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const headingClasses = {
    1: "text-3xl font-bold tracking-tight",
    2: "text-2xl font-semibold tracking-tight",
    3: "text-xl font-semibold",
    4: "text-lg font-semibold",
    5: "text-base font-semibold",
    6: "text-sm font-semibold",
  };

  return (
    <header className={cn("space-y-2", className)} role="banner">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <HeadingTag className={cn(headingClasses[level], "text-foreground")}>
            {title}
          </HeadingTag>
          {description && (
            <p className="text-muted-foreground text-sm sm:text-base">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-2">
            {children}
          </div>
        )}
      </div>
    </header>
  );
};

interface SectionHeaderProps {
  title: string;
  description?: string;
  level?: 2 | 3 | 4 | 5 | 6;
  className?: string;
  children?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  level = 2,
  className,
  children,
}) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const headingClasses = {
    2: "text-xl font-semibold",
    3: "text-lg font-semibold",
    4: "text-base font-semibold",
    5: "text-sm font-semibold",
    6: "text-xs font-semibold",
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <HeadingTag className={cn(headingClasses[level], "text-foreground")}>
            {title}
          </HeadingTag>
          {description && (
            <p className="text-muted-foreground text-sm">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

// Hook for managing heading hierarchy
export const useHeadingLevel = (parentLevel: number = 1) => {
  const getNextLevel = (increment: number = 1) => {
    const nextLevel = parentLevel + increment;
    return Math.min(6, Math.max(1, nextLevel)) as 1 | 2 | 3 | 4 | 5 | 6;
  };

  return { getNextLevel };
}; 