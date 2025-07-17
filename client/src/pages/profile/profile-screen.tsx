import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, TrendingUp, Target, Shield, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import MobileHeader from "@/components/mobile-header";
import BottomNavigation from "@/components/bottom-navigation";

export default function ProfileScreen() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: progress } = useQuery({
    queryKey: ["/api/progress"],
  });

  const { data: goals = [] } = useQuery({
    queryKey: ["/api/goals"],
  });

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      window.location.href = '/api/logout';
    }
  };

  const menuItems = [
    {
      icon: User,
      title: "Edit Profile",
      description: "Update your personal information",
      onClick: () => {
        // TODO: Implement edit profile
        alert("Edit Profile feature coming soon!");
      }
    },
    {
      icon: TrendingUp,
      title: "Learning Progress",
      description: "View your learning statistics",
      onClick: () => setLocation("/profile?tab=progress")
    },
    {
      icon: Target,
      title: "Goals Summary",
      description: `${goals.length} active goals`,
      onClick: () => setLocation("/profile?tab=goals")
    },
    {
      icon: Shield,
      title: "Security & Settings",
      description: "Privacy and account settings",
      onClick: () => {
        // TODO: Implement security settings
        alert("Security Settings feature coming soon!");
      }
    },
    {
      icon: HelpCircle,
      title: "Help & Feedback",
      description: "Get support and share feedback",
      onClick: () => {
        // TODO: Implement help & feedback
        alert("Help & Feedback feature coming soon!");
      }
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      
      <div className="p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
          <img 
            src={user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120"} 
            alt="Profile"
            className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
          />
          <h3 className="text-lg font-semibold">
            Hi, {user?.firstName || "User"} {user?.lastName || ""}
          </h3>
          <p className="text-gray-600 text-sm">Welcome to Face2Finance</p>
        </div>

        {/* Progress Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Your Progress</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{progress?.lessonsCompleted || 0}</div>
                <div className="text-sm text-gray-600">Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{progress?.quizzesAttempted || 0}</div>
                <div className="text-sm text-gray-600">Quizzes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{progress?.currentStreak || 0}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-500">{progress?.totalPoints || 0}</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-4 mb-20">
          {menuItems.map((item, index) => (
            <Card key={index} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between" onClick={item.onClick}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Logout Button */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <Button 
              onClick={handleLogout}
              variant="ghost"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-100 justify-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}
