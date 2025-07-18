import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen, TrendingUp, DollarSign, PiggyBank } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function KnowledgeAssessment() {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const updateOnboardingMutation = useMutation({
    mutationFn: async (data: { knowledgeLevel: string }) => {
      const response = await apiRequest("/api/onboarding", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate the user query to refresh user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/onboarding/goal");
    }
  });

  const knowledgeLevels = [
    { 
      id: "beginner", 
      label: "I'm a total beginner", 
      color: "bg-gradient-to-r from-green-400 to-green-500",
      icon: BookOpen,
      description: "New to financial concepts"
    },
    { 
      id: "some-knowledge", 
      label: "I have some basic knowledge", 
      color: "bg-gradient-to-r from-blue-400 to-blue-500",
      icon: PiggyBank,
      description: "Know basics like saving"
    },
    { 
      id: "intermediate", 
      label: "I have intermediate knowledge", 
      color: "bg-gradient-to-r from-purple-400 to-purple-500",
      icon: TrendingUp,
      description: "Understand investing basics"
    },
    { 
      id: "advanced", 
      label: "I'm quite knowledgeable", 
      color: "bg-gradient-to-r from-pink-400 to-pink-500",
      icon: DollarSign,
      description: "Complex financial planning"
    },
  ];

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
    updateOnboardingMutation.mutate({ knowledgeLevel: level });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <Button 
        variant="ghost" 
        className="mb-6 hover:bg-white/80 transition-colors"
        onClick={() => setLocation("/")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      
      <div className="text-center mb-8">
        <div className="w-full bg-white/60 backdrop-blur-sm rounded-full h-2 mb-6 shadow-sm">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: "50%" }}></div>
        </div>
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.knowledgeAssessment}</h2>
          <p className="text-gray-600">Help us personalize your learning journey</p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {knowledgeLevels.map((level) => (
          <Card 
            key={level.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
              selectedLevel === level.id 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleLevelSelect(level.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${level.color} rounded-xl flex items-center justify-center shadow-md`}>
                  <level.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">{level.label}</h3>
                  <p className="text-gray-600 text-sm">{level.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500 mb-4">
          Don't worry, we'll adapt the content to your level
        </p>
        {updateOnboardingMutation.isPending && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Assessing your knowledge...</span>
          </div>
        )}
      </div>
    </div>
  );
}
