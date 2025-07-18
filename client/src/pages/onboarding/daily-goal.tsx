import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Target, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function DailyGoal() {
  const [selectedGoal, setSelectedGoal] = useState(15);
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const updateOnboardingMutation = useMutation({
    mutationFn: async (data: { dailyGoal: number }) => {
      const response = await apiRequest("/api/onboarding", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate the user query to refresh user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/onboarding/age");
    }
  });

  const goalOptions = [
    { 
      minutes: 5, 
      color: "bg-gradient-to-r from-green-400 to-green-500", 
      icon: Clock,
      title: "Quick Start",
      description: "Perfect for beginners"
    },
    { 
      minutes: 10, 
      color: "bg-gradient-to-r from-blue-400 to-blue-500", 
      icon: Target,
      title: "Steady Progress",
      description: "Balanced daily learning"
    },
    { 
      minutes: 15, 
      color: "bg-gradient-to-r from-purple-400 to-purple-500", 
      icon: Zap,
      title: "Focused Session",
      description: "Deep dive into topics"
    },
    { 
      minutes: 20, 
      color: "bg-gradient-to-r from-pink-400 to-pink-500", 
      icon: Target,
      title: "Power User",
      description: "Maximum learning"
    },
  ];

  const handleGoalSelect = (minutes: number) => {
    setSelectedGoal(minutes);
    updateOnboardingMutation.mutate({ dailyGoal: minutes });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
      <Button 
        variant="ghost" 
        className="mb-6 hover:bg-white/80 transition-colors"
        onClick={() => setLocation("/onboarding/knowledge")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      
      <div className="text-center mb-8">
        <div className="w-full bg-white/60 backdrop-blur-sm rounded-full h-2 mb-6 shadow-sm">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: "75%" }}></div>
        </div>
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.dailyGoal}</h2>
          <p className="text-gray-600">Choose your daily learning commitment</p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {goalOptions.map((option) => (
          <Card 
            key={option.minutes}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
              selectedGoal === option.minutes 
                ? 'ring-2 ring-purple-500 shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleGoalSelect(option.minutes)}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${option.color} rounded-xl flex items-center justify-center shadow-md`}>
                  <option.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-lg text-gray-800">{option.title}</h3>
                    <span className="text-2xl font-bold text-purple-600">{option.minutes} min</span>
                  </div>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500 mb-4">
          You can always change this later in settings
        </p>
        {updateOnboardingMutation.isPending && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Setting up your goal...</span>
          </div>
        )}
      </div>
    </div>
  );
}
