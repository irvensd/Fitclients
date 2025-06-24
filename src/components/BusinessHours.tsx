import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { OperatingHours } from "@/lib/types";

interface BusinessHoursProps {
  operatingHours?: OperatingHours[];
  trainerName?: string;
}

export const BusinessHours: React.FC<BusinessHoursProps> = ({ 
  operatingHours, 
  trainerName = "Your Trainer" 
}) => {
  // Debug logging
  console.log("BusinessHours component - operatingHours:", operatingHours);
  console.log("BusinessHours component - trainerName:", trainerName);

  if (!operatingHours || operatingHours.length === 0) {
    return (
      <Card className="shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Business Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-500">No business hours set</p>
            <p className="text-sm text-gray-400">Your trainer hasn't set their operating hours yet</p>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> Contact {trainerName} directly for scheduling and availability.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getCurrentDayStatus = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayHours = operatingHours.find(hour => hour.day === today);
    
    if (!todayHours) return null;
    
    if (!todayHours.isOpen) {
      return { status: 'closed', message: 'Closed today' };
    }
    
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const startTime = parseInt(todayHours.startTime.replace(':', ''));
    const endTime = parseInt(todayHours.endTime.replace(':', ''));
    
    if (currentTime >= startTime && currentTime <= endTime) {
      return { 
        status: 'open', 
        message: `Open until ${formatTime(todayHours.endTime)}` 
      };
    } else if (currentTime < startTime) {
      return { 
        status: 'opening', 
        message: `Opens at ${formatTime(todayHours.startTime)}` 
      };
    } else {
      return { 
        status: 'closed', 
        message: 'Closed for today' 
      };
    }
  };

  const currentStatus = getCurrentDayStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Business Hours
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        {currentStatus && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Today's Status</span>
            </div>
            <Badge 
              variant={
                currentStatus.status === 'open' ? 'default' :
                currentStatus.status === 'opening' ? 'secondary' : 'outline'
              }
              className={
                currentStatus.status === 'open' ? 'bg-green-100 text-green-800' :
                currentStatus.status === 'opening' ? 'bg-blue-100 text-blue-800' : ''
              }
            >
              {currentStatus.message}
            </Badge>
          </div>
        )}

        {/* Operating Hours List */}
        <div className="space-y-2">
          {operatingHours.map((hour) => (
            <div 
              key={hour.day} 
              className="flex items-center justify-between py-2 border-b border-border/30 last:border-b-0"
            >
              <span className="text-sm font-medium w-20">{hour.day}</span>
              <div className="flex items-center gap-2">
                {hour.isOpen ? (
                  <>
                    <span className="text-sm text-muted-foreground">
                      {formatTime(hour.startTime)} - {formatTime(hour.endTime)}
                    </span>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Open
                    </Badge>
                  </>
                ) : (
                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                    Closed
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> These are general business hours. Contact {trainerName} for specific session scheduling and availability.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 