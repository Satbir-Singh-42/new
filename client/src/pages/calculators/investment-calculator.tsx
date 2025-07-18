import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import MobileHeader from "@/components/mobile-header";

export default function InvestmentCalculator() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    initialAmount: "",
    monthlyInvestment: "",
    annualReturn: "",
    timePeriod: "",
    compoundingFrequency: "monthly",
  });
  const [result, setResult] = useState<any>(null);

  const calculateInvestment = () => {
    const P = parseFloat(formData.initialAmount) || 0;
    const PMT = parseFloat(formData.monthlyInvestment) || 0;
    const r = parseFloat(formData.annualReturn) / 100;
    const t = parseFloat(formData.timePeriod);
    const n = formData.compoundingFrequency === "monthly" ? 12 : 1;

    if ((P || PMT) && r && t) {
      // Compound interest calculation for lump sum
      const futureValueLumpSum = P * Math.pow(1 + r / n, n * t);
      
      // Future value of annuity (monthly investments)
      const monthlyRate = r / 12;
      const futureValueAnnuity = PMT * (Math.pow(1 + monthlyRate, 12 * t) - 1) / monthlyRate;
      
      const totalInvestment = P + (PMT * 12 * t);
      const totalReturns = futureValueLumpSum + futureValueAnnuity;
      const totalGains = totalReturns - totalInvestment;

      const calculatedResult = {
        totalInvestment: Math.round(totalInvestment),
        totalReturns: Math.round(totalReturns),
        totalGains: Math.round(totalGains),
        roi: Math.round((totalGains / totalInvestment) * 100),
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
          calculatorType: "investment",
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
      <MobileHeader title="Investment Calculator" showBackButton onBackClick={() => setLocation("/calculators")} />
      
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Investment Returns Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Initial Investment Amount (₹)</Label>
              <Input
                type="number"
                placeholder="Enter initial amount"
                value={formData.initialAmount}
                onChange={(e) => setFormData({ ...formData, initialAmount: e.target.value })}
              />
            </div>
            
            <div>
              <Label>Monthly Investment (₹)</Label>
              <Input
                type="number"
                placeholder="Enter monthly investment"
                value={formData.monthlyInvestment}
                onChange={(e) => setFormData({ ...formData, monthlyInvestment: e.target.value })}
              />
            </div>
            
            <div>
              <Label>Expected Annual Return (%)</Label>
              <Input
                type="number"
                placeholder="Enter expected return"
                value={formData.annualReturn}
                onChange={(e) => setFormData({ ...formData, annualReturn: e.target.value })}
              />
            </div>
            
            <div>
              <Label>Investment Period (Years)</Label>
              <Input
                type="number"
                placeholder="Enter time period"
                value={formData.timePeriod}
                onChange={(e) => setFormData({ ...formData, timePeriod: e.target.value })}
              />
            </div>

            <div>
              <Label>Compounding Frequency</Label>
              <Select value={formData.compoundingFrequency} onValueChange={(value) => setFormData({ ...formData, compoundingFrequency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={calculateInvestment} 
              className="w-full"
              disabled={!formData.annualReturn || !formData.timePeriod || (!formData.initialAmount && !formData.monthlyInvestment)}
            >
              Calculate Returns
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Investment Projection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Total Investment</p>
                  <p className="text-2xl font-bold text-blue-600">₹{result.totalInvestment.toLocaleString()}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Total Returns</p>
                  <p className="text-2xl font-bold text-green-600">₹{result.totalReturns.toLocaleString()}</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Total Gains</p>
                  <p className="text-2xl font-bold text-orange-600">₹{result.totalGains.toLocaleString()}</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">ROI</p>
                  <p className="text-2xl font-bold text-purple-600">{result.roi}%</p>
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