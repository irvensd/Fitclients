import { useState, useEffect, useMemo } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Users,
  Calendar,
  CreditCard,
  User,
  Clock,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  type: "client" | "session" | "payment";
  icon: React.ReactNode;
  action: () => void;
  badge?: string;
};

export const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { clients, sessions, payments, getClientName } = useData();

  // Keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Generate search results from all data
  const searchResults = useMemo((): SearchResult[] => {
    const results: SearchResult[] = [];

    // Add clients
    clients.forEach((client) => {
      results.push({
        id: `client-${client.id}`,
        title: client.name,
        subtitle: `${client.email} • ${client.fitnessLevel}`,
        type: "client",
        icon: <User className="h-4 w-4" />,
        badge: client.fitnessLevel,
        action: () => {
          navigate("/clients");
          setOpen(false);
        },
      });
    });

    // Add sessions
    sessions.forEach((session) => {
      const clientName = getClientName(session.clientId);
      const sessionDate = new Date(session.date).toLocaleDateString();
      results.push({
        id: `session-${session.id}`,
        title: `${clientName} - ${session.type.replace("-", " ")}`,
        subtitle: `${sessionDate} at ${session.startTime} • $${session.cost}`,
        type: "session",
        icon: <Calendar className="h-4 w-4" />,
        badge: session.status,
        action: () => {
          navigate("/sessions");
          setOpen(false);
        },
      });
    });

    // Add payments
    payments.forEach((payment) => {
      const clientName = getClientName(payment.clientId);
      const paymentDate = new Date(payment.date).toLocaleDateString();
      results.push({
        id: `payment-${payment.id}`,
        title: `$${payment.amount} - ${clientName}`,
        subtitle: `${payment.description} • ${paymentDate}`,
        type: "payment",
        icon: <CreditCard className="h-4 w-4" />,
        badge: payment.status,
        action: () => {
          navigate("/payments");
          setOpen(false);
        },
      });
    });

    return results;
  }, [clients, sessions, payments, getClientName, navigate]);

  const getBadgeVariant = (type: string, badge?: string) => {
    if (type === "session") {
      switch (badge) {
        case "completed":
          return "default";
        case "scheduled":
          return "secondary";
        case "cancelled":
          return "destructive";
        default:
          return "outline";
      }
    }
    if (type === "payment") {
      switch (badge) {
        case "completed":
          return "default";
        case "pending":
          return "secondary";
        case "failed":
          return "destructive";
        default:
          return "outline";
      }
    }
    return "outline";
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search everything...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search clients, sessions, payments..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Clients">
            {searchResults
              .filter((result) => result.type === "client")
              .map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={result.action}
                  className="flex items-center gap-2"
                >
                  {result.icon}
                  <div className="flex-1">
                    <div className="font-medium">{result.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.subtitle}
                    </div>
                  </div>
                  {result.badge && (
                    <Badge variant={getBadgeVariant(result.type, result.badge)}>
                      {result.badge}
                    </Badge>
                  )}
                </CommandItem>
              ))}
          </CommandGroup>

          <CommandGroup heading="Sessions">
            {searchResults
              .filter((result) => result.type === "session")
              .slice(0, 5)
              .map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={result.action}
                  className="flex items-center gap-2"
                >
                  {result.icon}
                  <div className="flex-1">
                    <div className="font-medium">{result.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.subtitle}
                    </div>
                  </div>
                  {result.badge && (
                    <Badge variant={getBadgeVariant(result.type, result.badge)}>
                      {result.badge}
                    </Badge>
                  )}
                </CommandItem>
              ))}
          </CommandGroup>

          <CommandGroup heading="Payments">
            {searchResults
              .filter((result) => result.type === "payment")
              .slice(0, 5)
              .map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={result.action}
                  className="flex items-center gap-2"
                >
                  {result.icon}
                  <div className="flex-1">
                    <div className="font-medium">{result.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.subtitle}
                    </div>
                  </div>
                  {result.badge && (
                    <Badge variant={getBadgeVariant(result.type, result.badge)}>
                      {result.badge}
                    </Badge>
                  )}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
