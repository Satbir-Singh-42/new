import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageSelector } from "@/components/language-selector";
import { Language } from "@/lib/i18n";
import { ArrowRight } from "lucide-react";

export default function LanguageSelection() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();

  const updateOnboardingMutation = useMutation({
    mutationFn: async (data: { language: string }) => {
      const response = await apiRequest("/api/onboarding", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      setLocation("/onboarding/knowledge");
    },
    onError: (error) => {
      toast({
        title: t.error,
        description: "Failed to save language preference. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const handleContinue = () => {
    updateOnboardingMutation.mutate({ language: language });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t.selectLanguage}</h2>
      </div>

      <div className="mb-8">
        <LanguageSelector 
          variant="card" 
          onLanguageChange={handleLanguageChange}
        />
      </div>

      <Button 
        className="w-full bg-primary hover:bg-purple-600"
        onClick={handleContinue}
        disabled={updateOnboardingMutation.isPending}
      >
        {updateOnboardingMutation.isPending ? t.loading : t.next}
      </Button>
    </div>
  );
}
