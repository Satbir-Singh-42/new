import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function KnowledgeAssessment() {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [, setLocation] = useLocation();

  const updateOnboardingMutation = useMutation({
    mutationFn: async (data: { knowledgeLevel: string }) => {
      return await apiRequest("PATCH", "/api/onboarding", data);
    },
    onSuccess: () => {
      setLocation("/onboarding/goal");
    }
  });

  const knowledgeLevels = [
    { id: "beginner", label: "I'm a total beginner", color: "bg-blue-400" },
    { id: "some-knowledge", label: "I have some basic knowledge", color: "bg-blue-500" },
    { id: "intermediate", label: "I have intermediate knowledge", color: "bg-blue-600" },
    { id: "advanced", label: "I'm quite knowledgeable", color: "bg-blue-700" },
  ];

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
    updateOnboardingMutation.mutate({ knowledgeLevel: level });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => setLocation("/")}
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>
      
      <div className="text-center mb-8">
        <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
          <div className="bg-primary h-1 rounded-full" style={{ width: "25%" }}></div>
        </div>
        <h2 className="text-xl font-semibold">How much do you know about Finance?</h2>
      </div>

      <div className="space-y-4 mb-8">
        {knowledgeLevels.map((level) => (
          <Button
            key={level.id}
            variant="outline"
            className="w-full p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary hover:text-white transition-colors text-left justify-start h-auto"
            onClick={() => handleLevelSelect(level.id)}
            disabled={updateOnboardingMutation.isPending}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 ${level.color} rounded`}></div>
              <span>{level.label}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
