import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import MobileHeader from "@/components/mobile-header";

export default function EMICalculator() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    loanAmount: "",
    interestRate: "",
    tenure: "",
  });
  const [result, setResult] = useState<any>(null);

  const calculateEMI = () => {
    const P = parseFloat(formData.loanAmount);
    const r = parseFloat(formData.interestRate) / 100 / 12;
    const n = parseInt(formData.tenure) * 12;

    if (P && r && n) {
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmount = emi * n;
      const totalInterest = totalAmount - P;

      const calculatedResult = {
        emi: Math.round(emi),
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest),
        principalAmount: P,
      };

      setResult(calculatedResult);
    }
  };

  const saveCalculationMutation = useMutation({
    mutationFn: async () => {
      if (!result) return;
      
      const response = await apiRequest("/api/calculator-history", {
        method: "POST",
        body: JSON.stringify({
          calculatorType: "emi",
          inputs: formData,
          results: result,
        }),
      });
      return response.json();
    },
  });

  const handleSave = () => {
    if (result) {
      saveCalculationMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader title="EMI Calculator" showBackButton onBackClick={() => setLocation("/calculators")} />
      
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Loan EMI Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Loan Amount (₹)</Label>
              <Input
                type="number"
                placeholder="Enter loan amount"
                value={formData.loanAmount}
                onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
              />
            </div>
            
            <div>
              <Label>Interest Rate (% per annum)</Label>
              <Input
                type="number"
                placeholder="Enter interest rate"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
              />
            </div>
            
            <div>
              <Label>Loan Tenure (Years)</Label>
              <Input
                type="number"
                placeholder="Enter tenure in years"
                value={formData.tenure}
                onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
              />
            </div>

            <Button 
              onClick={calculateEMI} 
              className="w-full"
              disabled={!formData.loanAmount || !formData.interestRate || !formData.tenure}
            >
              Calculate EMI
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Calculation Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Monthly EMI</p>
                  <p className="text-2xl font-bold text-blue-600">₹{result.emi.toLocaleString()}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600">₹{result.totalAmount.toLocaleString()}</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Total Interest</p>
                  <p className="text-2xl font-bold text-orange-600">₹{result.totalInterest.toLocaleString()}</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Principal</p>
                  <p className="text-2xl font-bold text-purple-600">₹{result.principalAmount.toLocaleString()}</p>
                </div>
              </div>

              <Button 
                onClick={handleSave} 
                variant="outline" 
                className="w-full"
                disabled={saveCalculationMutation.isPending}
              >
                {saveCalculationMutation.isPending ? "Saving..." : "Save Calculation"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}