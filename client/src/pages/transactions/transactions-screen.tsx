import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, CreditCard, TrendingUp, TrendingDown } from "lucide-react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTransactionSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MobileHeader from "@/components/mobile-header";
import BottomNavigation from "@/components/bottom-navigation";
import type { InsertTransaction, Transaction } from "@shared/schema";

export default function TransactionsScreen() {
  const [, setLocation] = useLocation();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const form = useForm<InsertTransaction>({
    resolver: zodResolver(insertTransactionSchema),
    defaultValues: {
      name: "",
      amount: "0",
      category: "other",
      type: "expense",
      description: "",
    },
  });

  const addTransactionMutation = useMutation({
    mutationFn: async (data: InsertTransaction) => {
      return await apiRequest("POST", "/api/transactions", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transaction added successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTransaction) => {
    addTransactionMutation.mutate(data);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return '🍽️';
      case 'transport': return '🚗';
      case 'entertainment': return '🎬';
      case 'utilities': return '💡';
      case 'healthcare': return '🏥';
      case 'shopping': return '🛍️';
      case 'subscription': return '📱';
      case 'income': return '💰';
      default: return '📊';
    }
  };

  // Calculate totals
  const totalIncome = transactions
    .filter((t: Transaction) => t.type === 'income')
    .reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter((t: Transaction) => t.type === 'expense')
    .reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      
      <div className="bg-gray-800 text-white p-6">
        <Button 
          variant="ghost" 
          className="mb-4 text-white hover:bg-white/20"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Transactions</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-white border-white hover:bg-white/20">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input {...form.register("name")} placeholder="Transaction name" />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <Label>Amount</Label>
                  <Input 
                    type="number" 
                    step="0.01"
                    {...form.register("amount")} 
                    placeholder="0.00" 
                  />
                  {form.formState.errors.amount && (
                    <p className="text-red-500 text-sm">{form.formState.errors.amount.message}</p>
                  )}
                </div>

                <div>
                  <Label>Type</Label>
                  <Select 
                    value={form.watch("type")} 
                    onValueChange={(value) => form.setValue("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Category</Label>
                  <Select 
                    value={form.watch("category")} 
                    onValueChange={(value) => form.setValue("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food & Dining</SelectItem>
                      <SelectItem value="transport">Transportation</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="subscription">Subscriptions</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Description (Optional)</Label>
                  <Input {...form.register("description")} placeholder="Transaction description" />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={addTransactionMutation.isPending}
                >
                  {addTransactionMutation.isPending ? "Adding..." : "Add Transaction"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-6">
        {/* Balance Overview */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500 mr-1" />
                </div>
                <div className="text-lg font-bold text-green-600">₹{totalIncome.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Income</div>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <TrendingDown className="w-5 h-5 text-red-500 mr-1" />
                </div>
                <div className="text-lg font-bold text-red-600">₹{totalExpenses.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Expenses</div>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <CreditCard className="w-5 h-5 text-blue-500 mr-1" />
                </div>
                <div className={`text-lg font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{balance.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Balance</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
        </div>

        {transactions.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">No transactions yet</h4>
              <p className="text-gray-500 mb-4">Start tracking your finances by adding your first transaction</p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-primary hover:bg-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 mb-20">
            {transactions.map((transaction: Transaction) => (
              <Card key={transaction.id} className="shadow-sm border border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">{getCategoryIcon(transaction.category)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{transaction.name}</h4>
                        <p className="text-gray-500 text-sm">{transaction.category}</p>
                        <p className="text-gray-400 text-xs">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}₹{parseFloat(transaction.amount).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
