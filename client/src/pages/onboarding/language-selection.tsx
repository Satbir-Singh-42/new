import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function LanguageSelection() {
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const updateOnboardingMutation = useMutation({
    mutationFn: async (data: { language: string }) => {
      return await apiRequest("PATCH", "/api/onboarding", data);
    },
    onSuccess: () => {
      setLocation("/onboarding/knowledge");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save language preference. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleContinue = () => {
    updateOnboardingMutation.mutate({ language: selectedLanguage });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-4">What language would you like to learn?</h2>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <RadioGroup value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary cursor-pointer">
                <RadioGroupItem value="hindi" id="hindi" />
                <Label htmlFor="hindi" className="font-medium cursor-pointer">हिंदी</Label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary cursor-pointer">
                <RadioGroupItem value="punjabi" id="punjabi" />
                <Label htmlFor="punjabi" className="font-medium cursor-pointer">Punjabi</Label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary cursor-pointer">
                <RadioGroupItem value="english" id="english" />
                <Label htmlFor="english" className="font-medium cursor-pointer">English</Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Button 
        className="w-full bg-primary hover:bg-purple-600"
        onClick={handleContinue}
        disabled={updateOnboardingMutation.isPending}
      >
        {updateOnboardingMutation.isPending ? "Saving..." : "Continue"}
      </Button>
    </div>
  );
}
