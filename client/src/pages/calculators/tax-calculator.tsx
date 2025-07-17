import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TaxData {
  annualIncome: number;
  filingStatus: string;
}

interface TaxResult {
  grossIncome: number;
  taxableIncome: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  totalTax: number;
  netIncome: number;
}

export default function TaxCalculator() {
  const [taxData, setTaxData] = useState<TaxData>({
    annualIncome: 0,
    filingStatus: "single",
  });
  const [result, setResult] = useState<TaxResult | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const saveCalculationMutation = useMutation({
    mutationFn: async (data: { inputs: TaxData; results: TaxResult }) => {
      return await apiRequest("POST", "/api/calculator-history", {
        calculatorType: "tax",
        inputs: data.inputs,
        results: data.results,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tax calculation saved to your history.",
      });
    },
  });

  const calculateTax = () => {
    const income = taxData.annualIncome;
    
    // Simplified tax calculation (Indian tax brackets for demonstration)
    let federalTax = 0;
    
    if (income > 250000) {
      if (income <= 500000) {
        federalTax = (income - 250000) * 0.05;
      } else if (income <= 1000000) {
        federalTax = 250000 * 0.05 + (income - 500000) * 0.20;
      } else {
        federalTax = 250000 * 0.05 + 500000 * 0.20 + (income - 1000000) * 0.30;
      }
    }
    
    const stateTax = income * 0.02; // 2% state tax
    const socialSecurity = Math.min(income * 0.062, 142800 * 0.062); // 6.2% up to wage base
    const medicare = income * 0.0145; // 1.45% Medicare tax
    const totalTax = federalTax + stateTax + socialSecurity + medicare;
    
    const calculationResult: TaxResult = {
      grossIncome: income,
      taxableIncome: income,
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      totalTax,
      netIncome: income - totalTax,
    };
    
    setResult(calculationResult);
    
    // Save to history
    saveCalculationMutation.mutate({
      inputs: taxData,
      results: calculationResult
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-800 text-white p-6">
        <Button 
          variant="ghost" 
          className="mb-4 text-white hover:bg-white/20"
          onClick={() => setLocation("/calculators")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-semibold">Tax Estimator</h2>
      </div>

      <div className="p-6">
        {result && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">Your Yearly Tax</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Income</span>
                  <span className="font-semibold">₹{result.grossIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Federal Tax</span>
                  <span className="font-semibold">₹{result.federalTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">State Tax</span>
                  <span className="font-semibold">₹{result.stateTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Social Security</span>
                  <span className="font-semibold">₹{result.socialSecurity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Medicare Tax</span>
                  <span className="font-semibold">₹{result.medicare.toLocaleString()}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-xl font-semibold">Total Tax</span>
                    <span className="text-xl font-bold text-primary">₹{result.totalTax.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Net Income</span>
                  <span className="text-lg font-bold text-green-600">₹{result.netIncome.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Annual Income (₹)</Label>
            <Input 
              type="number" 
              placeholder="Enter annual income"
              value={taxData.annualIncome || ""}
              onChange={(e) => setTaxData(prev => ({ ...prev, annualIncome: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Filing Status</Label>
            <Select 
              value={taxData.filingStatus} 
              onValueChange={(value) => setTaxData(prev => ({ ...prev, filingStatus: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select filing status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married-jointly">Married Filing Jointly</SelectItem>
                <SelectItem value="married-separately">Married Filing Separately</SelectItem>
                <SelectItem value="head-of-household">Head of Household</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={calculateTax}
            className="w-full bg-primary hover:bg-purple-600"
            disabled={!taxData.annualIncome}
          >
            Calculate Tax
          </Button>
        </div>

        {result && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Tax Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Effective Tax Rate:</span>
                  <span className="font-semibold">
                    {((result.totalTax / result.grossIncome) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Take-home Percentage:</span>
                  <span className="font-semibold text-green-600">
                    {((result.netIncome / result.grossIncome) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
