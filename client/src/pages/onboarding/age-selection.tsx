import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AgeSelection() {
  const [selectedAge, setSelectedAge] = useState("");
  const [, setLocation] = useLocation();

  const updateOnboardingMutation = useMutation({
    mutationFn: async (data: { ageGroup: string; onboardingCompleted: boolean }) => {
      const response = await apiRequest("/api/onboarding", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate the user query to refresh authentication state
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/");
    }
  });

  const ageGroups = [
    "From 13 to 17 years old",
    "18 to 24 years old",
    "25 to 34 years old",
    "35 to 44 years old",
    "45 to 54 years old",
    "55 to 64 years old",
    "65+"
  ];

  const handleAgeSelect = (ageGroup: string) => {
    setSelectedAge(ageGroup);
    updateOnboardingMutation.mutate({ 
      ageGroup, 
      onboardingCompleted: true 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => setLocation("/onboarding/goal")}
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>
      
      <div className="text-center mb-8">
        <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
          <div className="bg-primary h-1 rounded-full" style={{ width: "75%" }}></div>
        </div>
        <h2 className="text-xl font-semibold">How old are you?</h2>
      </div>

      <div className="space-y-3 mb-8">
        {ageGroups.map((ageGroup) => (
          <Button
            key={ageGroup}
            variant="outline"
            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-primary transition-colors justify-start h-auto"
            onClick={() => handleAgeSelect(ageGroup)}
            disabled={updateOnboardingMutation.isPending}
          >
            {ageGroup}
          </Button>
        ))}
      </div>
    </div>
  );
}
