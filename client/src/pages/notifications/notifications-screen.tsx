import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Bell, GraduationCap, Book, Lightbulb, Settings, Users } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MobileHeader from "@/components/mobile-header";
import BottomNavigation from "@/components/bottom-navigation";
import type { Notification } from "@shared/schema";

export default function NotificationsScreen() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock notifications data since we don't have a notifications API endpoint yet
  const mockNotifications = [
    {
      id: 1,
      title: "New Lesson Available",
      message: "Check out our new lesson on 'Understanding Credit Cards'",
      type: "lesson",
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      actionUrl: "/lessons"
    },
    {
      id: 2,
      title: "Quiz Reminder",
      message: "Don't forget to complete the Financial Literacy Quiz!",
      type: "course",
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      actionUrl: "/quiz"
    },
    {
      id: 3,
      title: "Daily Tip",
      message: "💡 Try the 50/30/20 budgeting rule to manage your finances better",
      type: "tip",
      read: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      actionUrl: "/calculators/budget"
    },
    {
      id: 4,
      title: "Goal Progress",
      message: "You're 80% closer to your savings goal! Keep it up!",
      type: "community",
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      actionUrl: "/tasks"
    },
    {
      id: 5,
      title: "Profile Update",
      message: "Your profile information has been updated successfully",
      type: "system",
      read: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      actionUrl: "/profile"
    }
  ];

  const { data: notifications = mockNotifications, isLoading } = useQuery({
    queryKey: ["/api/notifications"],
    queryFn: () => Promise.resolve(mockNotifications),
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      return await apiRequest("PATCH", `/api/notifications/${notificationId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return GraduationCap;
      case 'course':
        return Book;
      case 'tip':
        return Lightbulb;
      case 'system':
        return Settings;
      case 'community':
        return Users;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'lesson':
        return 'bg-blue-500';
      case 'course':
        return 'bg-green-500';
      case 'tip':
        return 'bg-yellow-500';
      case 'system':
        return 'bg-gray-500';
      case 'community':
        return 'bg-purple-500';
      default:
        return 'bg-primary';
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      // In a real app, this would update the database
      console.log('Marking notification as read:', notification.id);
    }
    
    // Navigate to action URL if available
    if (notification.actionUrl) {
      setLocation(notification.actionUrl);
    }
  };

  const clearAllNotifications = () => {
    // TODO: Implement clear all functionality
    toast({
      title: "Feature Coming Soon",
      description: "Clear all notifications will be available soon.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold">Notifications</h2>
          <Button 
            variant="ghost" 
            onClick={clearAllNotifications}
            className="text-primary text-sm"
          >
            Clear all
          </Button>
        </div>

        {notifications.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">No notifications</h4>
              <p className="text-gray-500 mb-4">You're all caught up! New notifications will appear here.</p>
              <Button onClick={() => setLocation("/")} className="bg-primary hover:bg-purple-600">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 mb-20">
            {notifications.map((notification: any) => {
              const IconComponent = getNotificationIcon(notification.type);
              const iconColor = getNotificationColor(notification.type);
              
              return (
                <Card 
                  key={notification.id} 
                  className={`shadow-sm border cursor-pointer transition-all hover:shadow-md ${
                    notification.read ? 'border-gray-100' : 'border-primary/20 bg-primary/5'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 ${iconColor} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm mb-1">{notification.title}</h4>
                        <p className="text-sm text-gray-800 mb-1 line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
