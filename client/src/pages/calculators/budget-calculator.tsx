import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MobileHeader from "@/components/mobile-header";

interface BudgetData {
  income: number;
  rent: number;
  food: number;
  transportation: number;
  utilities: number;
  entertainment: number;
}

export default function BudgetCalculator() {
  const [budgetData, setBudgetData] = useState<BudgetData>({
    income: 0,
    rent: 0,
    food: 0,
    transportation: 0,
    utilities: 0,
    entertainment: 0,
  });
  const [result, setResult] = useState<{
    totalIncome: number;
    totalExpenses: number;
    remaining: number;
  } | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const saveCalculationMutation = useMutation({
    mutationFn: async (data: { inputs: BudgetData; results: any }) => {
      return await apiRequest("POST", "/api/calculator-history", {
        calculatorType: "budget",
        inputs: data.inputs,
        results: data.results,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Budget calculation saved to your history.",
      });
    },
  });

  const handleInputChange = (field: keyof BudgetData, value: string) => {
    setBudgetData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const calculateBudget = () => {
    const totalExpenses = budgetData.rent + budgetData.food + budgetData.transportation + 
                         budgetData.utilities + budgetData.entertainment;
    const remaining = budgetData.income - totalExpenses;
    
    const calculationResult = {
      totalIncome: budgetData.income,
      totalExpenses,
      remaining
    };
    
    setResult(calculationResult);
    
    // Save to history
    saveCalculationMutation.mutate({
      inputs: budgetData,
      results: calculationResult
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary text-white p-6">
        <Button 
          variant="ghost" 
          className="mb-4 text-white hover:bg-white/20"
          onClick={() => setLocation("/calculators")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-semibold">Budget Planner</h2>
      </div>

      <div className="p-6">
        <form className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Monthly Income</h3>
              <Input 
                type="number" 
                placeholder="Enter your monthly income"
                value={budgetData.income || ""}
                onChange={(e) => handleInputChange("income", e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Monthly Expenses</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">Rent/Mortgage</Label>
                  <Input 
                    type="number" 
                    placeholder="Rent/Mortgage"
                    value={budgetData.rent || ""}
                    onChange={(e) => handleInputChange("rent", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">Food & Groceries</Label>
                  <Input 
                    type="number" 
                    placeholder="Food & Groceries"
                    value={budgetData.food || ""}
                    onChange={(e) => handleInputChange("food", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">Transportation</Label>
                  <Input 
                    type="number" 
                    placeholder="Transportation"
                    value={budgetData.transportation || ""}
                    onChange={(e) => handleInputChange("transportation", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">Utilities</Label>
                  <Input 
                    type="number" 
                    placeholder="Utilities"
                    value={budgetData.utilities || ""}
                    onChange={(e) => handleInputChange("utilities", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">Entertainment</Label>
                  <Input 
                    type="number" 
                    placeholder="Entertainment"
                    value={budgetData.entertainment || ""}
                    onChange={(e) => handleInputChange("entertainment", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            type="button" 
            onClick={calculateBudget}
            className="w-full bg-primary hover:bg-purple-600"
          >
            Calculate Budget
          </Button>
        </form>

        {result && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Budget Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Income:</span>
                  <span className="font-semibold">₹{result.totalIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Expenses:</span>
                  <span className="font-semibold">₹{result.totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span>Remaining:</span>
                  <span className={`font-semibold ${result.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{result.remaining.toLocaleString()}
                  </span>
                </div>
              </div>
              
              {result.remaining < 0 && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-red-600 text-sm font-medium">
                    ⚠️ You're spending more than you earn. Consider reducing expenses.
                  </p>
                </div>
              )}
              
              {result.remaining > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-green-600 text-sm font-medium">
                    ✅ Great! You have surplus income. Consider saving or investing this amount.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
