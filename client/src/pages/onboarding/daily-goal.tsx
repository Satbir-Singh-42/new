import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function DailyGoal() {
  const [selectedGoal, setSelectedGoal] = useState(15);
  const [, setLocation] = useLocation();

  const updateOnboardingMutation = useMutation({
    mutationFn: async (data: { dailyGoal: number }) => {
      const response = await apiRequest("/api/onboarding", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      setLocation("/onboarding/age");
    }
  });

  const goalOptions = [
    { minutes: 5, color: "bg-green-400" },
    { minutes: 10, color: "bg-blue-400" },
    { minutes: 15, color: "bg-purple-400" },
    { minutes: 20, color: "bg-pink-400" },
  ];

  const handleGoalSelect = (minutes: number) => {
    setSelectedGoal(minutes);
    updateOnboardingMutation.mutate({ dailyGoal: minutes });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => setLocation("/onboarding/knowledge")}
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>
      
      <div className="text-center mb-8">
        <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
          <div className="bg-primary h-1 rounded-full" style={{ width: "50%" }}></div>
        </div>
        <h2 className="text-xl font-semibold">What is your daily goal for practicing?</h2>
      </div>

      <div className="space-y-4 mb-8">
        {goalOptions.map((option) => (
          <Button
            key={option.minutes}
            variant="outline"
            className="w-full p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary hover:text-white transition-colors text-left justify-start h-auto"
            onClick={() => handleGoalSelect(option.minutes)}
            disabled={updateOnboardingMutation.isPending}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 ${option.color} rounded`}></div>
              <span>{option.minutes} min</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
