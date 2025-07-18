import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, User, Users, Briefcase, Award } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AgeSelection() {
  const [selectedAge, setSelectedAge] = useState("");
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

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
    { 
      range: "From 13 to 17 years old", 
      icon: User, 
      color: "bg-gradient-to-r from-green-400 to-green-500",
      description: "Student life"
    },
    { 
      range: "18 to 24 years old", 
      icon: Users, 
      color: "bg-gradient-to-r from-blue-400 to-blue-500",
      description: "College & early career"
    },
    { 
      range: "25 to 34 years old", 
      icon: Briefcase, 
      color: "bg-gradient-to-r from-purple-400 to-purple-500",
      description: "Career building"
    },
    { 
      range: "35 to 44 years old", 
      icon: Award, 
      color: "bg-gradient-to-r from-pink-400 to-pink-500",
      description: "Prime earning years"
    },
    { 
      range: "45 to 54 years old", 
      icon: User, 
      color: "bg-gradient-to-r from-indigo-400 to-indigo-500",
      description: "Pre-retirement planning"
    },
    { 
      range: "55 to 64 years old", 
      icon: Users, 
      color: "bg-gradient-to-r from-teal-400 to-teal-500",
      description: "Retirement preparation"
    },
    { 
      range: "65+", 
      icon: Award, 
      color: "bg-gradient-to-r from-orange-400 to-orange-500",
      description: "Retirement & legacy"
    }
  ];

  const handleAgeSelect = (ageGroup: string) => {
    setSelectedAge(ageGroup);
    updateOnboardingMutation.mutate({ 
      ageGroup, 
      onboardingCompleted: true 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <Button 
        variant="ghost" 
        className="mb-6 hover:bg-white/80 transition-colors"
        onClick={() => setLocation("/onboarding/goal")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      
      <div className="text-center mb-8">
        <div className="w-full bg-white/60 backdrop-blur-sm rounded-full h-2 mb-6 shadow-sm">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: "100%" }}></div>
        </div>
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.ageSelection}</h2>
          <p className="text-gray-600">Help us customize your experience</p>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {ageGroups.map((ageGroup) => (
          <Card 
            key={ageGroup.range}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
              selectedAge === ageGroup.range 
                ? 'ring-2 ring-indigo-500 shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleAgeSelect(ageGroup.range)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 ${ageGroup.color} rounded-lg flex items-center justify-center shadow-md`}>
                  <ageGroup.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{ageGroup.range}</h3>
                  <p className="text-gray-600 text-sm">{ageGroup.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500 mb-4">
          Almost done! This helps us personalize your content
        </p>
        {updateOnboardingMutation.isPending && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Completing setup...</span>
          </div>
        )}
      </div>
    </div>
  );
}
