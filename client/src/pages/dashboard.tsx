import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Search, Menu, CloudSun, MessageCircle, Bot, X, HelpCircle, User, LogOut, Activity, TrendingUp, HomeIcon, RefreshCw, Zap, ArrowRightLeft, Plus, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEnergyTradeSchema } from "@/../../shared/schema";
import type { EnergyTrade, Household } from "@/../../shared/schema";
import { useToast } from "@/hooks/use-toast";

import AIChatWidget from "@/components/mobile-ai-chat-widget";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/navbar";
import ValidationCard from "@/components/validation-card";
import { SimulationDashboard } from "@/components/simulation-dashboard";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'energy-dashboard' | 'energy-trading' | 'simulation'>('energy-dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showValidationCard, setShowValidationCard] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState<"success" | "error" | "warning">("warning");
  const [showCreateTradeDialog, setShowCreateTradeDialog] = useState(false);
  const { user, logoutMutation, healthStatus } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch energy trades
  const { data: energyTrades = [], isLoading: tradesLoading } = useQuery({
    queryKey: ['/api/energy-trades'],
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Fetch households for trading
  const { data: households = [] } = useQuery<Household[]>({
    queryKey: ['/api/households'],
  });

  // Create trade mutation
  const createTradeMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/energy-trades', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/energy-trades'] });
      setShowCreateTradeDialog(false);
      toast({
        title: "Trade Created",
        description: "Your energy trade offer has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create trade offer.",
        variant: "destructive",
      });
    },
  });

  // Form for creating trades
  const form = useForm({
    resolver: zodResolver(insertEnergyTradeSchema.extend({
      energyAmount: insertEnergyTradeSchema.shape.energyAmount.min(0.1, "Energy amount must be at least 0.1 kWh"),
      pricePerKwh: insertEnergyTradeSchema.shape.pricePerKwh.min(0.01, "Price must be at least ₹0.01 per kWh"),
    })),
    defaultValues: {
      sellerHouseholdId: 1,
      buyerHouseholdId: undefined,
      energyAmount: 0,
      pricePerKwh: 4.5,
      tradeType: 'sell',
    },
  });

  const onSubmit = (data: any) => {
    // Set household IDs based on trade type
    const tradeData = {
      ...data,
      sellerHouseholdId: data.tradeType === 'sell' ? 1 : undefined,
      buyerHouseholdId: data.tradeType === 'buy' ? 1 : undefined,
    };
    createTradeMutation.mutate(tradeData);
  };

  // Separate offers and requests
  const energyOffers = (energyTrades as EnergyTrade[]).filter((trade: EnergyTrade) => trade.tradeType === 'sell' && trade.status === 'pending');
  const energyRequests = (energyTrades as EnergyTrade[]).filter((trade: EnergyTrade) => trade.tradeType === 'buy' && trade.status === 'pending');

  // Check URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab === 'energy-trading') {
      setActiveTab('energy-trading');
    } else if (tab === 'energy-dashboard') {
      setActiveTab('energy-dashboard');
    } else if (tab === 'simulation') {
      setActiveTab('simulation');
    }
  }, []);

  // Show server unavailability message only for authenticated users who lose session
  useEffect(() => {
    // Only show server error if user was authenticated and server/database is down
    // Don't show for AI service issues (quota limits) - only for actual server/database problems
    if (healthStatus && user && (!healthStatus.server || !healthStatus.database) && healthStatus.message) {
      setValidationMessage(healthStatus.message);
      setValidationType("error");
      setShowValidationCard(true);
      setTimeout(() => {
        setShowValidationCard(false);
      }, 8000);
    }
  }, [healthStatus, user]);

  // Show logout success message after page reload
  useEffect(() => {
    const logoutSuccess = localStorage.getItem("logoutSuccess");
    if (logoutSuccess === "true") {
      localStorage.removeItem("logoutSuccess");
      setValidationMessage("You have logged out successfully.");
      setValidationType("success");
      setShowValidationCard(true);
      setTimeout(() => {
        setShowValidationCard(false);
      }, 3000);
    }
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar 
        currentPage="dashboard" 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.history.pushState({}, '', `/?tab=${tab}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Hero Section - Now visible on all devices */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-white pb-6 sm:pb-8 md:pb-10 lg:pb-12 xl:pb-16" style={{ paddingTop: '3.75rem' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center flex flex-col justify-center items-center min-h-[150px] sm:min-h-[160px] md:min-h-[170px] lg:min-h-[180px] xl:min-h-[190px] pt-6 sm:pt-8 md:pt-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 lg:mb-8">SolarSense: Intelligent Energy Solutions</h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 px-2 max-w-4xl mx-auto">
              Decentralized energy trading platform for a sustainable future
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Tabs - Positioned below hero section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex border-b border-border">
            <button
              onClick={() => {
                setActiveTab('energy-dashboard');
                window.history.pushState({}, '', '/?tab=energy-dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'energy-dashboard'
                  ? 'text-primary border-b-2 border-primary bg-blue-50'
                  : 'text-secondary-custom hover:text-primary hover:bg-gray-50'
              }`}
            >
              <Home className="inline mr-1 sm:mr-2" size={16} />
              <span>Energy</span>
              <span className="hidden sm:inline"> Dashboard</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('energy-trading');
                window.history.pushState({}, '', '/?tab=energy-trading');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'energy-trading'
                  ? 'text-primary border-b-2 border-primary bg-blue-50'
                  : 'text-secondary-custom hover:text-primary hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="inline mr-1 sm:mr-2" size={16} />
              <span>Energy</span>
              <span className="hidden sm:inline"> Trading</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('simulation');
                window.history.pushState({}, '', '/?tab=simulation');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'simulation'
                  ? 'text-primary border-b-2 border-primary bg-blue-50'
                  : 'text-secondary-custom hover:text-primary hover:bg-gray-50'
              }`}
            >
              <Activity className="inline mr-1 sm:mr-2" size={16} />
              <span>ML</span>
              <span className="hidden sm:inline"> Simulation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Application Interface */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Content Sections */}
        {activeTab === 'energy-dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Total Households</h3>
                <p className="text-3xl font-bold text-primary">0</p>
                <p className="text-sm text-gray-600">Connected to your network</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Active Trades</h3>
                <p className="text-3xl font-bold text-green-600">0</p>
                <p className="text-sm text-gray-600">Energy exchanges in progress</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Energy Produced</h3>
                <p className="text-3xl font-bold text-blue-600">0 kWh</p>
                <p className="text-sm text-gray-600">Total solar generation today</p>
              </Card>
            </div>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Getting Started with SolarSense</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-2">1. Register Your Household</h4>
                  <p className="text-sm text-gray-600">Add your solar installation and battery details to join the energy trading network.</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-2">2. Monitor Energy Flow</h4>
                  <p className="text-sm text-gray-600">Track your energy production, consumption, and battery levels in real-time.</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-2">3. Trade Energy</h4>
                  <p className="text-sm text-gray-600">Buy and sell surplus energy with neighbors for optimal grid balance.</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-2">4. AI Optimization</h4>
                  <p className="text-sm text-gray-600">Let our AI optimize energy distribution and trading opportunities for you.</p>
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {activeTab === 'energy-trading' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Energy Trading Marketplace</h2>
              <Button onClick={() => setShowCreateTradeDialog(true)} data-testid="button-create-trade">
                <Plus className="mr-2 h-4 w-4" />
                Create Trade Offer
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  Available Energy Offers ({energyOffers.length})
                </h3>
                <div className="space-y-3">
                  {tradesLoading ? (
                    <div className="p-3 border border-gray-200 rounded text-center text-gray-500">
                      Loading energy offers...
                    </div>
                  ) : energyOffers.length > 0 ? (
                    energyOffers.map((offer: EnergyTrade) => (
                      <div key={offer.id} className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-green-600">{offer.energyAmount} kWh available</p>
                            <p className="text-sm text-gray-600">Household #{offer.sellerHouseholdId}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              Created: {new Date(offer.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">₹{offer.pricePerKwh}/kWh</p>
                            <Button size="sm" className="mt-2" data-testid={`button-buy-${offer.id}`}>
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Buy
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 border border-gray-200 rounded text-center text-gray-500">
                      No energy offers available yet. Be the first to create one!
                    </div>
                  )}
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5 text-blue-600" />
                  Energy Demand Requests ({energyRequests.length})
                </h3>
                <div className="space-y-3">
                  {tradesLoading ? (
                    <div className="p-3 border border-gray-200 rounded text-center text-gray-500">
                      Loading energy requests...
                    </div>
                  ) : energyRequests.length > 0 ? (
                    energyRequests.map((request: EnergyTrade) => (
                      <div key={request.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-blue-600">{request.energyAmount} kWh needed</p>
                            <p className="text-sm text-gray-600">Household #{request.buyerHouseholdId}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              Created: {new Date(request.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">₹{request.pricePerKwh}/kWh</p>
                            <Button size="sm" variant="outline" className="mt-2" data-testid={`button-sell-${request.id}`}>
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Sell
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 border border-gray-200 rounded text-center text-gray-500">
                      No energy requests at the moment. Check back during peak hours.
                    </div>
                  )}
                </div>
              </Card>
            </div>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">How Energy Trading Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <HomeIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Surplus Generation</h4>
                  <p className="text-sm text-gray-600">When your solar panels produce more energy than you consume, create a sell offer.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ArrowRightLeft className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Smart Matching</h4>
                  <p className="text-sm text-gray-600">Our AI automatically matches energy offers with nearby demand for optimal distribution.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Instant Transfer</h4>
                  <p className="text-sm text-gray-600">Energy is transferred instantly through the smart grid with automatic billing.</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'simulation' && (
          <SimulationDashboard />
        )}
      </main>

      {/* AI Chat Widget */}
      <AIChatWidget />
      
      {/* Create Trade Dialog */}
      <Dialog open={showCreateTradeDialog} onOpenChange={setShowCreateTradeDialog}>
        <DialogContent className="w-[95vw] max-w-md mx-auto my-8 max-h-[90vh] overflow-y-auto z-50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <Plus className="h-5 w-5" />
              Create Energy Trade Offer
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="tradeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trade Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-trade-type" className="w-full">
                          <SelectValue placeholder="Select trade type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sell">Sell Energy (I have surplus)</SelectItem>
                        <SelectItem value="buy">Buy Energy (I need power)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="energyAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Energy Amount (kWh)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0.1"
                        placeholder="e.g., 5.5"
                        data-testid="input-energy-amount"
                        className="w-full"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pricePerKwh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per kWh (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="e.g., 4.50"
                        data-testid="input-price-per-kwh"
                        className="w-full"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateTradeDialog(false)}
                  className="flex-1 w-full"
                  data-testid="button-cancel-trade"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createTradeMutation.isPending}
                  className="flex-1 w-full"
                  data-testid="button-submit-trade"
                >
                  {createTradeMutation.isPending ? "Creating..." : "Create Trade"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Validation Card for Server Issues and Logout - Responsive positioning below navbar */}
      {showValidationCard && (
        <div className="fixed top-20 sm:top-24 md:top-28 right-2 sm:right-4 md:right-6 z-[10000] w-full max-w-xs sm:max-w-sm md:max-w-md px-2 sm:px-0">
          <ValidationCard
            type={validationType}
            title={validationType === "success" ? "Logout Successful" : "Server Notice"}
            description={validationMessage}
            onClose={() => setShowValidationCard(false)}
          />
        </div>
      )}
    </div>
  );
}
