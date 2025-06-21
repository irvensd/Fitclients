import { useState, useMemo } from "react";
import { Calendar, momentLocalizer, Event, View } from "react-big-calendar";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useData } from "@/contexts/DataContext";
import { Session } from "@/lib/types";
import { CalendarDays, Clock, User, DollarSign, FileText } from "lucide-react";

const localizer = momentLocalizer(moment);

interface CalendarEvent extends Event {
  resource: Session;
}

const formatSessionType = (type: string) => {
  switch (type) {
    case "personal-training":
      return "Personal Training";
    case "assessment":
      return "Assessment";
    case "consultation":
      return "Consultation";
    default:
      return type;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500";
    case "scheduled":
      return "bg-blue-500";
    case "cancelled":
      return "bg-red-500";
    case "no-show":
      return "bg-orange-500";
    default:
      return "bg-gray-500";
  }
};

export const SessionCalendar = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [view, setView] = useState<View>("week");
  const { sessions, getClientName } = useData();

  // Convert sessions to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    return sessions.map((session) => {
      const startDateTime = new Date(`${session.date}T${session.startTime}`);
      const endDateTime = new Date(`${session.date}T${session.endTime}`);

      return {
        id: session.id,
        title: `${getClientName(session.clientId)} - ${formatSessionType(session.type)}`,
        start: startDateTime,
        end: endDateTime,
        resource: session,
      };
    });
  }, [sessions, getClientName]);

  // Custom event component
  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    const session = event.resource;
    return (
      <div className="p-1">
        <div className="font-medium text-xs truncate">
          {getClientName(session.clientId)}
        </div>
        <div className="text-xs opacity-75 truncate">
          {formatSessionType(session.type)}
        </div>
        <div
          className={`w-2 h-2 rounded-full inline-block mr-1 ${getStatusColor(session.status)}`}
        />
      </div>
    );
  };

  // Custom event style getter
  const eventStyleGetter = (event: CalendarEvent) => {
    const session = event.resource;
    let backgroundColor = "#3174ad";

    switch (session.status) {
      case "completed":
        backgroundColor = "#16a34a";
        break;
      case "scheduled":
        backgroundColor = "#2563eb";
        break;
      case "cancelled":
        backgroundColor = "#dc2626";
        break;
      case "no-show":
        backgroundColor = "#ea580c";
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: session.status === "cancelled" ? 0.7 : 1,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  return (
    <>
      <Card className="h-[700px]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Session Calendar
            </div>
            <div className="flex gap-2">
              <Button
                variant={view === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("month")}
              >
                Month
              </Button>
              <Button
                variant={view === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("week")}
              >
                Week
              </Button>
              <Button
                variant={view === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("day")}
              >
                Day
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[600px]">
          <div className="h-full">
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <CalendarDays className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Sessions Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Schedule your first session to see it on the calendar
                </p>
              </div>
            ) : (
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                view={view}
                onView={setView}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
                components={{
                  event: EventComponent,
                }}
                popup
                style={{ height: "100%" }}
                step={30}
                timeslots={2}
                min={new Date(0, 0, 0, 6, 0, 0)} // Start at 6 AM
                max={new Date(0, 0, 0, 22, 0, 0)} // End at 10 PM
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Session Details Dialog */}
      <Dialog
        open={!!selectedEvent}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Session Details
            </DialogTitle>
            <DialogDescription>
              View and manage session details
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    selectedEvent.resource.status === "completed"
                      ? "default"
                      : selectedEvent.resource.status === "scheduled"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {selectedEvent.resource.status.toUpperCase()}
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {getClientName(selectedEvent.resource.clientId)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {moment(selectedEvent.start).format("MMMM Do, YYYY")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {moment(selectedEvent.start).format("h:mm A")} -{" "}
                    {moment(selectedEvent.end).format("h:mm A")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{formatSessionType(selectedEvent.resource.type)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${selectedEvent.resource.cost}</span>
                </div>

                {selectedEvent.resource.notes && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Notes:</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                      {selectedEvent.resource.notes}
                    </p>
                  </div>
                )}

                {selectedEvent.resource.status === "cancelled" &&
                  selectedEvent.resource.cancelledBy && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-sm text-red-800">
                        <strong>Cancelled by:</strong>{" "}
                        {selectedEvent.resource.cancelledBy}
                        {selectedEvent.resource.cancelledAt && (
                          <>
                            <br />
                            <strong>When:</strong>{" "}
                            {moment(selectedEvent.resource.cancelledAt).format(
                              "MMMM Do, YYYY [at] h:mm A",
                            )}
                          </>
                        )}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
