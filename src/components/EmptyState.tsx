import React from "react";
import { Button } from "./ui/button";

interface EmptyStateProps {
  Icon: React.ElementType;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  Icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="text-center bg-gray-50/50 p-4 sm:p-8 rounded-lg border-2 border-dashed border-gray-200">
      <div className="mx-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" aria-hidden="true" />
      </div>
      <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">{description}</p>
      {actionText && onAction && (
        <div className="mt-4 sm:mt-6">
          <Button onClick={onAction} size="sm" className="sm:text-sm">
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState; 