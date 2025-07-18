import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageSelector } from "@/components/language-selector";
import { Language } from "@/lib/i18n";
import { ArrowRight, Globe } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="text-center mb-8">
        <div className="w-full bg-white/60 backdrop-blur-sm rounded-full h-2 mb-6 shadow-sm">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: "25%" }}></div>
        </div>
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.selectLanguage}</h2>
          <p className="text-gray-600">Choose your preferred language for the app</p>
        </div>
      </div>

      <Card className="mb-8 shadow-lg border-0">
        <CardContent className="p-6">
          <LanguageSelector 
            variant="card" 
            onLanguageChange={handleLanguageChange}
          />
        </CardContent>
      </Card>

      <Button 
        className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium py-3 rounded-xl shadow-lg transition-all duration-200"
        onClick={handleContinue}
        disabled={updateOnboardingMutation.isPending}
      >
        {updateOnboardingMutation.isPending ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{t.loading}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span>{t.next}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        )}
      </Button>
    </div>
  );
}
