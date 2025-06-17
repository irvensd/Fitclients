import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface NavigationButtonProps {
  to: string;
  children: ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onClick?: () => void;
}

export const NavigationButton = ({
  to,
  children,
  variant = "default",
  size = "default",
  className,
  onClick,
}: NavigationButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    navigate(to);
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};
