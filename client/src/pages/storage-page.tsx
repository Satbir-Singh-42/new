import { useAuth } from "@/hooks/use-auth";
import { formatTradePrice, formatTradeAmount, formatTradeTotal } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/navbar";
import { Calendar, Zap, AlertTriangle, CheckCircle, Loader2, LogIn, User, TrendingUp, TrendingDown, ShoppingCart, RefreshCw, Edit2, X, FileText, ArrowRight, ArrowLeft, Clock, Plus, Store, Handshake, Database } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EnergyTrade, Household } from "@/../../shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface ExtendedEnergyTrade extends EnergyTrade {
  sellerHousehold?: { name: string; user: { username: string } };
  buyerHousehold?: { name: string; user: { username: string } };
  acceptanceCount?: number;
}

const tradeFormSchema = z.object({
  energyAmount: z.coerce.number().int("Energy amount must be a whole number").min(1, "Energy amount must be at least 1 kWh"),
  pricePerKwh: z.coerce.number().int("Price must be a whole number").min(1, "Price must be at least ₹1 per kWh"),
  tradeType: z.enum(["sell", "buy"], { required_error: "Trade type is required" }),
});

export default function StoragePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'my-listings' | 'my-requests' | 'applications' | 'request-results'>('my-listings');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const [editingTrade, setEditingTrade] = useState<ExtendedEnergyTrade | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTradeDetail, setSelectedTradeDetail] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Fetch energy trades
  const { data: energyTrades = [], isLoading, error, refetch } = useQuery<ExtendedEnergyTrade[]>({
    queryKey: ['/api/energy-trades'],
    enabled: !!user,
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 2,
    refetchInterval: activeTab === 'my-listings' || activeTab === 'my-requests' ? 1000 * 45 : false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Fetch available trade offers from other users  
  const { data: availableTradesData = [], isLoading: availableTradesLoading, refetch: refetchOffers } = useQuery<any[]>({
    queryKey: ['/api/trade-offers'],
    enabled: !!user,
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 3,
    refetchInterval: 1000 * 60,
    refetchOnWindowFocus: true,
  });

  // Fetch user's households
  const { data: userHouseholds = [] } = useQuery<Household[]>({
    queryKey: ['/api/households'],
    enabled: !!user,
  });

  // Fetch user's trade acceptances (applications they submitted to other people's trades)
  const { data: tradeAcceptances = [], isLoading: acceptancesLoading, refetch: refetchAcceptances } = useQuery<any[]>({
    queryKey: ['/api/trade-acceptances'],
    enabled: !!user,
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 2,
    refetchInterval: false,
    refetchOnWindowFocus: true,
  });

  // Fetch applications TO user's trades (people who want to accept their trades)
  const { data: tradeApplications = [], isLoading: applicationsLoading, error: applicationsError, refetch: refetchApplications } = useQuery<any[]>({
    queryKey: ['/api/my-trade-applications'],
    enabled: !!user,
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 2,
    refetchInterval: false,
    refetchOnWindowFocus: true,
  });

  // Memoized user household IDs
  const userHouseholdIds = useMemo(() => 
    userHouseholds.map(h => h.id), 
    [userHouseholds]
  );

  // Memoized helper function to check if trade belongs to user
  const isOwnTrade = useCallback((trade: ExtendedEnergyTrade) => {
    return (
      (trade.sellerHouseholdId && userHouseholdIds.includes(trade.sellerHouseholdId)) ||
      (trade.buyerHouseholdId && userHouseholdIds.includes(trade.buyerHouseholdId))
    );
  }, [userHouseholdIds]);

  // Memoized sorted trades (avoid mutating original array)
  const sortedTrades = useMemo(() => 
    [...energyTrades].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ), 
    [energyTrades]
  );

  // Memoized trade categorizations
  const myListings = useMemo(() =>
    sortedTrades.filter(trade => 
      trade.tradeType === 'sell' && trade.sellerHouseholdId && userHouseholdIds.includes(trade.sellerHouseholdId)
    ),
    [sortedTrades, userHouseholdIds]
  );

  const myRequests = useMemo(() =>
    sortedTrades.filter(trade => 
      trade.tradeType === 'buy' && trade.buyerHouseholdId && userHouseholdIds.includes(trade.buyerHouseholdId)
    ),
    [sortedTrades, userHouseholdIds]
  );

  const myAllTrades = useMemo(() =>
    sortedTrades.filter(trade => isOwnTrade(trade)),
    [sortedTrades, isOwnTrade]
  );

  // Memoized available offers
  const availableOffers = useMemo(() =>
    availableTradesData.map((item: any) => ({
      ...item.trade,
      sellerHousehold: item.household ? { name: item.household.name, user: { username: item.user?.username || 'Unknown' } } : undefined,
    })),
    [availableTradesData]
  );

  // Memoized user info display
  const userInfo = useMemo(() => {
    if (!user) return null;
    
    return {
      username: user.username,
      email: user.email,
      totalTrades: myAllTrades.length,
      activeSellListings: myListings.filter(t => t.status === 'pending').length,
      activeBuyRequests: myRequests.filter(t => t.status === 'pending').length,
      completedTrades: myAllTrades.filter(t => t.status === 'completed').length,
      joinDate: user.createdAt ? new Date(user.createdAt) : new Date(),
      availableOffers: availableOffers.length
    };
  }, [user, myAllTrades, myListings, myRequests, availableOffers]);

  // Helper function to get counterparty name safely
  const getCounterpartyName = useCallback((trade: ExtendedEnergyTrade) => {
    if (!user || !trade) return 'User';
    const isSeller = !!trade.sellerHouseholdId && userHouseholdIds.includes(trade.sellerHouseholdId);
    return isSeller
      ? (trade.buyerHousehold?.user?.username ?? 'Buyer')
      : (trade.sellerHousehold?.user?.username ?? 'Seller');
  }, [user, userHouseholdIds]);

  // Helper function to get acceptance counterparty name
  const getAcceptanceCounterparty = useCallback((acceptance: any) => {
    return acceptance.applicant?.username || acceptance.user?.username || 'User';
  }, []);

  // Create trade mutation
  const createTradeMutation = useMutation({
    mutationFn: async (data: z.infer<typeof tradeFormSchema>) => {
      return apiRequest('POST', '/api/energy-trades', {
        energyAmount: Math.round(data.energyAmount), // Store actual kWh value
        pricePerKwh: Math.round(data.pricePerKwh), // Store as rupees
        tradeType: data.tradeType,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/energy-trades'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/trade-offers'], refetchType: 'all' });
      setIsCreateDialogOpen(false);
      toast({
        title: "Trade Created",
        description: "Your energy trade has been posted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create trade. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update trade mutation
  const updateTradeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof tradeFormSchema> }) => {
      return apiRequest('PUT', `/api/energy-trades/${id}`, {
        energyAmount: Math.round(data.energyAmount), // Store actual kWh value
        pricePerKwh: Math.round(data.pricePerKwh), // Store as rupees
        tradeType: data.tradeType,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/energy-trades'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/trade-offers'], refetchType: 'all' });
      setIsEditDialogOpen(false);
      setEditingTrade(null);
      toast({
        title: "Trade Updated",
        description: "Your energy trade has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update trade. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Cancel trade mutation with optimistic updates
  const cancelTradeMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('PATCH', `/api/energy-trades/${id}/cancel`);
    },
    onMutate: async (id: number) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['/api/energy-trades'] });
      
      // Snapshot the previous value
      const previousTrades = queryClient.getQueryData<ExtendedEnergyTrade[]>(['/api/energy-trades']);
      
      // Optimistically update to the new value
      queryClient.setQueryData<ExtendedEnergyTrade[]>(['/api/energy-trades'], (old) => {
        if (!old) return old;
        return old.map(trade => 
          trade.id === id ? { ...trade, status: 'cancelled' as const } : trade
        );
      });
      
      // Return a context object with the snapshotted value
      return { previousTrades };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/energy-trades'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/trade-offers'], refetchType: 'all' });
      toast({
        title: "Trade Cancelled",
        description: "Your energy trade has been cancelled successfully.",
      });
    },
    onError: (error: any, id: number, context) => {
      // Rollback on error
      if (context?.previousTrades) {
        queryClient.setQueryData(['/api/energy-trades'], context.previousTrades);
      }
      toast({
        title: "Cancel Failed",
        description: error.message || "Failed to cancel trade. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['/api/energy-trades'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/trade-offers'], refetchType: 'all' });
    },
  });

  // Delete trade mutation
  const deleteTradeMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/energy-trades/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/energy-trades'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/trade-offers'], refetchType: 'all' });
      toast({
        title: "Trade Deleted",
        description: "Your energy trade has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete trade. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Accept trade mutation
  const acceptTradeMutation = useMutation({
    mutationFn: async (tradeId: number) => {
      return apiRequest('POST', '/api/trade-acceptances', { tradeId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/energy-trades'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/trade-acceptances'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/trade-offers'], refetchType: 'all' });
      toast({
        title: "Trade Accepted",
        description: "You have successfully accepted this trade offer.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to accept trade. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Share contact information mutation
  const shareContactMutation = useMutation({
    mutationFn: async (acceptanceId: number) => {
      return apiRequest('POST', `/api/trade-acceptances/${acceptanceId}/share-contact`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trade-acceptances'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/my-trade-applications'], refetchType: 'all' });
      toast({
        title: "Contact Shared Automatically",
        description: "Contact information has been shared automatically for energy delivery coordination.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to share contact information. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Complete trade mutation
  const completeTradeCompletionMutation = useMutation({
    mutationFn: async ({ acceptanceId, status }: { acceptanceId: number; status: string }) => {
      return apiRequest('PATCH', `/api/trade-acceptances/${acceptanceId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trade-acceptances'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/my-trade-applications'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/energy-trades'], refetchType: 'all' });
      toast({
        title: "Trade Updated",
        description: "Trade status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update trade status. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Cancel/withdraw application mutation
  const withdrawApplicationMutation = useMutation({
    mutationFn: async (acceptanceId: number) => {
      return apiRequest('DELETE', `/api/trade-acceptances/${acceptanceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trade-acceptances'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/trade-offers'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/energy-trades'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/my-trade-applications'], refetchType: 'all' });
      toast({
        title: "Application Withdrawn",
        description: "Your application has been successfully withdrawn.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to withdraw application. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Decline application mutation (owner rejects an application)
  const declineApplicationMutation = useMutation({
    mutationFn: async (acceptanceId: number) => {
      return apiRequest('PATCH', `/api/trade-acceptances/${acceptanceId}/owner-decision`, { 
        decision: 'reject' 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trade-acceptances'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/my-trade-applications'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/energy-trades'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/trade-offers'], refetchType: 'all' });
      toast({
        title: "Application Rejected",
        description: "The application has been rejected. Trade remains available for other applicants.",
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to reject application. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Approve application mutation (owner accepts an application)
  const approveApplicationMutation = useMutation({
    mutationFn: async (acceptanceId: number) => {
      return apiRequest('PATCH', `/api/trade-acceptances/${acceptanceId}/owner-decision`, { 
        decision: 'accept' 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trade-acceptances'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/my-trade-applications'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/energy-trades'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/trade-offers'], refetchType: 'all' });
      toast({
        title: "Application Approved",
        description: "Application accepted! Waiting for applicant to share contact or reject.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve application. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Applicant reject mutation (applicant rejects after owner accepted)
  const applicantRejectMutation = useMutation({
    mutationFn: async (acceptanceId: number) => {
      return apiRequest('PATCH', `/api/trade-acceptances/${acceptanceId}/applicant-reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trade-acceptances'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/my-trade-applications'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/energy-trades'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/trade-offers'], refetchType: 'all' });
      toast({
        title: "Trade Rejected",
        description: "You have rejected this trade. It's now available for other applicants.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject trade. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleApproveAndAutoShare = (acceptance: any) => {
    // Automatically share contact details without confirmation dialog
    shareContactMutation.mutate(acceptance.id);
  };

  const handleConfirmTransfer = (acceptance: any) => {
    completeTradeCompletionMutation.mutate({ acceptanceId: acceptance.id, status: 'completed' });
  };

  // Comprehensive refresh function that refreshes all data
  const handleRefreshAll = async () => {
    try {
      await Promise.all([
        refetch(),
        refetchOffers(),
        refetchAcceptances(),
        refetchApplications()
      ]);
      toast({
        title: "Data Refreshed",
        description: "All trade data has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const createForm = useForm<z.infer<typeof tradeFormSchema>>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      energyAmount: 0,
      pricePerKwh: 0,
      tradeType: "sell",
    },
  });

  const editForm = useForm<z.infer<typeof tradeFormSchema>>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      energyAmount: 0,
      pricePerKwh: 0,
      tradeType: "sell",
    },
  });

  const handleEditTrade = (trade: ExtendedEnergyTrade) => {
    setEditingTrade(trade);
    editForm.reset({
      energyAmount: trade.energyAmount, // Use actual kWh value
      pricePerKwh: trade.pricePerKwh, // Already in rupees
      tradeType: trade.tradeType as "sell" | "buy",
    });
    setIsEditDialogOpen(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="h-5 w-5" />
                Authentication Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Please log in to view your energy trading history and manage your listings.
              </p>
              <Button 
                onClick={() => setLocation('/login')}
                className="bg-green-600 hover:bg-green-700 text-white"
                data-testid="button-login"
              >
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Calendar className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const formatEnergy = (amount: number) => formatTradeAmount(amount);
  const formatPrice = (price: number) => formatTradePrice(price);
  const formatTotal = (amount: number, price: number) => formatTradeTotal(amount, price);

  // Comprehensive status mapping for all trade acceptance statuses
  const getApplicationStatusMeta = (status: string) => {
    switch (status) {
      case 'applied':
        return {
          label: 'Applied',
          variant: 'secondary' as const,
          icon: Calendar,
          dotClass: 'bg-yellow-500',
          showDetail: false
        };
      case 'awarded':
        return {
          label: 'Approved',
          variant: 'default' as const,
          icon: CheckCircle,
          dotClass: 'bg-blue-500',
          showDetail: true
        };
      case 'owner_rejected':
        return {
          label: 'Declined',
          variant: 'destructive' as const,
          icon: X,
          dotClass: 'bg-red-500',
          showDetail: false
        };
      case 'contacted':
        return {
          label: 'Contact Shared',
          variant: 'default' as const,
          icon: CheckCircle,
          dotClass: 'bg-green-500',
          showDetail: true
        };
      case 'applicant_rejected':
        return {
          label: 'Rejected',
          variant: 'destructive' as const,
          icon: X,
          dotClass: 'bg-red-500',
          showDetail: false
        };
      case 'withdrawn':
        return {
          label: 'Withdrawn',
          variant: 'outline' as const,
          icon: X,
          dotClass: 'bg-gray-500',
          showDetail: false
        };
      default:
        return {
          label: status.charAt(0).toUpperCase() + status.slice(1),
          variant: 'outline' as const,
          icon: AlertTriangle,
          dotClass: 'bg-gray-500',
          showDetail: false
        };
    }
  };

  // Helper function to determine if a status allows viewing detail
  const canViewDetail = (status: string) => {
    return ['awarded', 'contacted'].includes(status);
  };

  // Helper function to get consistent badge configuration
  const getStatusBadgeConfig = (status: string) => {
    const meta = getApplicationStatusMeta(status);
    return {
      variant: meta.variant,
      icon: meta.icon,
      label: meta.label
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar currentPage="storage" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Energy Trading Hub</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage your energy listings, requests, and trading history
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleRefreshAll}
              disabled={isLoading || availableTradesLoading || acceptancesLoading || applicationsLoading}
              className="flex items-center justify-center gap-2 min-h-[44px] flex-1 sm:flex-none"
              data-testid="button-refresh"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading || availableTradesLoading || acceptancesLoading || applicationsLoading ? 'animate-spin' : ''}`} />
              <span className="sm:inline">Refresh</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation('/?tab=energy-trading')}
              className="flex items-center justify-center gap-2 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 flex-1 sm:flex-none"
              data-testid="button-trade-market"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="sm:inline">Trade Market</span>
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 min-h-[44px] flex-1 sm:flex-none">
                  <Plus className="h-4 w-4" />
                  <span className="sm:inline">Create Trade</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Energy Trade</DialogTitle>
                </DialogHeader>
                <Form {...createForm}>
                  <form onSubmit={createForm.handleSubmit((data) => createTradeMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={createForm.control}
                      name="tradeType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trade Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select trade type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sell">Sell Energy</SelectItem>
                              <SelectItem value="buy">Buy Energy</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="energyAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Energy Amount (kWh)</FormLabel>
                          <FormControl>
                            <Input type="number" step="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="pricePerKwh"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price per kWh (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" step="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="text-red-600">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createTradeMutation.isPending}>
                        {createTradeMutation.isPending ? 'Creating...' : 'Create Trade'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* User Stats Cards */}
        {userInfo && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Store className="h-4 w-4 text-blue-600" />
                  My Sell Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{userInfo.activeSellListings}</div>
                <p className="text-xs text-gray-500">Energy for sale</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-green-600" />
                  My Buy Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{userInfo.activeBuyRequests}</div>
                <p className="text-xs text-gray-500">Energy needed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Handshake className="h-4 w-4 text-blue-600" />
                  Available Offers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{userInfo.availableOffers}</div>
                <p className="text-xs text-gray-500">To accept</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  Completed Trades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{userInfo.completedTrades}</div>
                <p className="text-xs text-gray-500">Successful</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-indigo-600" />
                  Total Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600">{userInfo.totalTrades}</div>
                <p className="text-xs text-gray-500">All time</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Data Source Status */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="font-medium text-sm sm:text-base">Data Status:</span>
                </div>
                <div className="flex items-center gap-2 ml-6 sm:ml-0" data-testid="connection-status">
                  {!isLoading && !error && energyTrades.length > 0 && (
                    <Badge variant="default" className="text-xs sm:text-sm">
                      Connected • {energyTrades.filter(trade => trade.status === 'pending').length} active trade{energyTrades.filter(trade => trade.status === 'pending').length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                  {!isLoading && energyTrades.length === 0 && (
                    <Badge variant="outline" className="text-xs sm:text-sm">No trades in system</Badge>
                  )}
                  {error && (
                    <Badge variant="destructive" className="text-xs sm:text-sm">Connection Error</Badge>
                  )}
                  {isLoading && (
                    <div className="flex items-center gap-1">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <Badge variant="secondary" className="text-xs sm:text-sm">Loading...</Badge>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 ml-6 sm:ml-0" aria-live="polite" data-testid="last-updated">
                Last updated: {format(new Date(), 'HH:mm:ss')}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Trading Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 gap-1 sm:gap-2 text-xs sm:text-sm mb-6">
            <TabsTrigger value="my-listings" className="flex items-center justify-center gap-2 text-xs sm:text-sm" data-testid="tab-listings">
              <Store className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Sell Listings</span>
              <span className="sm:hidden">Sell</span>
              ({myListings.length})
            </TabsTrigger>
            <TabsTrigger value="my-requests" className="flex items-center justify-center gap-2 text-xs sm:text-sm" data-testid="tab-requests">
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Buy Requests</span>
              <span className="sm:hidden">Buy</span>
              ({myRequests.length})
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center justify-center gap-2 text-xs sm:text-sm" data-testid="tab-applications">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Applications</span>
              <span className="sm:hidden">Apps</span>
              ({tradeAcceptances.length + tradeApplications.length})
            </TabsTrigger>
            <TabsTrigger value="request-results" className="flex items-center justify-center gap-2 text-xs sm:text-sm" data-testid="tab-request-results">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Results</span>
              <span className="sm:hidden">Results</span>
              ({(() => {
                // Use centralized status mapping to determine finalized results
                const finalizedStatuses = ['contacted', 'applicant_rejected', 'awarded', 'owner_rejected', 'withdrawn'];
                const myApplicationResults = tradeAcceptances.filter((acceptance: any) => 
                  finalizedStatuses.includes(acceptance.status)
                );
                const myTradeResults = tradeApplications.filter((application: any) => 
                  finalizedStatuses.includes(application.acceptance?.status)
                );
                return myApplicationResults.length + myTradeResults.length;
              })()})
            </TabsTrigger>
          </TabsList>

          {/* My Sell Listings */}
          <TabsContent value="my-listings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-blue-600" />
                  Energy You're Selling
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Energy listings you've posted for others to buy
                </p>
              </CardHeader>
              <CardContent>
                {myListings.length === 0 ? (
                  <div className="text-center py-8" data-testid="empty-listings">
                    <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No sell listings yet</p>
                    <p className="text-sm text-gray-400">Create energy listings to start selling surplus power</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myListings.map((trade) => (
                      <Card key={trade.id} className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                          <div className="flex-1">
                            <div className="font-medium text-base sm:text-lg">{formatEnergy(trade.energyAmount)}</div>
                            <div className="text-xs sm:text-sm text-gray-500">
                              Listed: {format(new Date(trade.createdAt), 'MMM dd, yyyy HH:mm')}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {trade.acceptanceCount !== undefined && trade.acceptanceCount > 0 && (
                              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                                <User className="h-3 w-3" />
                                {trade.acceptanceCount} applied
                              </Badge>
                            )}
                            <Badge variant={getStatusBadgeVariant(trade.status)} className="flex items-center gap-1 text-xs">
                              {getStatusIcon(trade.status)}
                              {trade.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                          <div>
                            <span className="text-xs sm:text-sm text-gray-600">Price/kWh:</span>
                            <div className="font-medium text-sm sm:text-base">{formatPrice(trade.pricePerKwh)}</div>
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm text-gray-600">Total Value:</span>
                            <div className="font-semibold text-green-600 text-sm sm:text-base">{formatTotal(trade.energyAmount, trade.pricePerKwh)}</div>
                          </div>
                        </div>
                        {trade.status === 'pending' && (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTrade(trade)}
                              disabled={trade.acceptanceCount !== undefined && trade.acceptanceCount > 0}
                              className="flex items-center justify-center gap-1 min-h-[44px] w-full sm:w-auto"
                              data-testid="button-edit-trade"
                            >
                              <Edit2 className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelTradeMutation.mutate(trade.id)}
                              disabled={cancelTradeMutation.isPending}
                              className="flex items-center justify-center gap-1 text-red-600 hover:text-red-700 min-h-[44px] w-full sm:w-auto"
                              data-testid="button-cancel-trade"
                            >
                              <X className="h-3 w-3" />
                              Cancel
                            </Button>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Buy Requests */}
          <TabsContent value="my-requests">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  Energy You're Requesting
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Active and manageable buy requests (edit or cancel here)
                </p>
              </CardHeader>
              <CardContent>
                {myRequests.length === 0 ? (
                  <div className="text-center py-8" data-testid="empty-requests">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No buy requests yet</p>
                    <p className="text-sm text-gray-400">Create requests to purchase energy from other users</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myRequests.map((trade) => (
                      <Card key={trade.id} className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                          <div className="flex-1">
                            <div className="font-medium text-base sm:text-lg">{formatEnergy(trade.energyAmount)}</div>
                            <div className="text-xs sm:text-sm text-gray-500">
                              Requested: {format(new Date(trade.createdAt), 'MMM dd, yyyy HH:mm')}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {trade.acceptanceCount !== undefined && trade.acceptanceCount > 0 && (
                              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                                <User className="h-3 w-3" />
                                {trade.acceptanceCount} applied
                              </Badge>
                            )}
                            <Badge variant={getStatusBadgeVariant(trade.status)} className="flex items-center gap-1 text-xs">
                              {getStatusIcon(trade.status)}
                              {trade.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                          <div>
                            <span className="text-xs sm:text-sm text-gray-600">Willing to Pay:</span>
                            <div className="font-medium text-sm sm:text-base">{formatPrice(trade.pricePerKwh)}</div>
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm text-gray-600">Total Budget:</span>
                            <div className="font-semibold text-blue-600 text-sm sm:text-base">{formatTotal(trade.energyAmount, trade.pricePerKwh)}</div>
                          </div>
                        </div>
                        {trade.status === 'pending' && (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTrade(trade)}
                              disabled={trade.acceptanceCount !== undefined && trade.acceptanceCount > 0}
                              className="flex items-center justify-center gap-1 min-h-[44px] w-full sm:w-auto"
                              data-testid="button-edit-trade"
                            >
                              <Edit2 className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelTradeMutation.mutate(trade.id)}
                              disabled={cancelTradeMutation.isPending}
                              className="flex items-center justify-center gap-1 text-red-600 hover:text-red-700 min-h-[44px] w-full sm:w-auto"
                              data-testid="button-cancel-trade"
                            >
                              <X className="h-3 w-3" />
                              Cancel
                            </Button>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications - Combined Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Applications
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Applications you submitted to others and applications others submitted to your trades
                </p>
              </CardHeader>
              <CardContent>
                {(acceptancesLoading || applicationsLoading) ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-500">Loading applications...</p>
                  </div>
                ) : (tradeAcceptances.length === 0 && tradeApplications.length === 0) ? (
                  <div className="text-center py-8" data-testid="empty-applications">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No applications yet</p>
                    <p className="text-sm text-gray-400">Apply to energy trades or wait for others to apply to your trades</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    
                    {/* Applications I submitted to others */}
                    {tradeAcceptances.filter((acceptance: any) => 
                      !['contacted', 'applicant_rejected', 'awarded', 'owner_rejected', 'withdrawn'].includes(acceptance.status)
                    ).length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <ArrowRight className="h-4 w-4" />
                          Applications I Submitted ({tradeAcceptances.filter((acceptance: any) => 
                            !['contacted', 'applicant_rejected', 'awarded', 'owner_rejected', 'withdrawn'].includes(acceptance.status)
                          ).length})
                        </h3>
                        <div className="space-y-4">
                          {tradeAcceptances.filter((acceptance: any) => 
                            !['contacted', 'applicant_rejected', 'awarded', 'owner_rejected', 'withdrawn'].includes(acceptance.status)
                          ).map((acceptance: any) => {
                            // Find trade and offer match data
                            let trade = energyTrades.find(t => t.id === acceptance.tradeId);
                            let offerMatch = null;
                            
                            if (!trade) {
                              offerMatch = availableTradesData.find(o => o.trade?.id === acceptance.tradeId);
                              trade = offerMatch?.trade;
                            } else {
                              offerMatch = availableTradesData.find(o => o.trade?.id === trade?.id);
                            }
                            
                            const statusMeta = getApplicationStatusMeta(acceptance.status);
                            
                            return (
                              <Card key={acceptance.id} className="overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow duration-200" data-testid={`card-application-${acceptance.id}`}>
                                <CardHeader className="pb-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Zap className="h-5 w-5 text-green-600" />
                                      <h3 className="text-lg font-semibold text-gray-900" data-testid={`text-title-${acceptance.id}`}>
                                        Energy {trade?.tradeType === 'sell' ? 'Sale' : 'Purchase'}: {formatEnergy(trade?.energyAmount || 0)}
                                      </h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant={statusMeta.variant} className="flex items-center gap-1" data-testid={`badge-status-${acceptance.id}`}>
                                        <statusMeta.icon className="h-3 w-3" />
                                        {statusMeta.label}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                    Applied: {format(new Date(acceptance.acceptedAt), 'MMM dd, yyyy HH:mm')}
                                  </div>
                                </CardHeader>
                                
                                <CardContent className="py-3">
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                      <User className="h-4 w-4" />
                                      <span>Applicant Details</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                      <div>
                                        <span className="text-gray-500">Name:</span>
                                        <div className="font-medium">{user?.username || 'User'}</div>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Household:</span>
                                        <div className="font-medium">{userHouseholds[0]?.name || 'Not specified'}</div>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Location:</span>
                                        <div className="font-medium">
                                          {user?.district || 'Not specified'}
                                          {user?.state && `, ${user.state}`}
                                        </div>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Contact:</span>
                                        <div className="font-medium">
                                          {acceptance.status === 'awarded' 
                                            ? (
                                                <div className="space-y-1">
                                                  <div>{user?.email || 'Email not available'}</div>
                                                  {user?.phone && (
                                                    <div>{user.phone}</div>
                                                  )}
                                                  {userHouseholds[0]?.address && (
                                                    <div className="text-xs text-gray-600">Address: {userHouseholds[0].address}</div>
                                                  )}
                                                </div>
                                              )
                                            : 'Hidden until approved'
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                                
                                <CardFooter className="pt-3 border-t">
                                  <div className="grid grid-cols-3 gap-4 w-full text-sm">
                                    <div>
                                      <span className="text-gray-500">Price per kWh:</span>
                                      <div className="font-semibold" data-testid={`text-price-${acceptance.id}`}>{formatPrice(trade?.pricePerKwh || 0)}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Total Value:</span>
                                      <div className="font-semibold text-green-600" data-testid={`text-total-${acceptance.id}`}>{formatTotal(trade?.energyAmount || 0, trade?.pricePerKwh || 0)}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Status:</span>
                                      <div className="flex items-center gap-1 font-medium">
                                        <div className={`w-2 h-2 rounded-full ${statusMeta.dotClass}`}></div>
                                        {statusMeta.label}
                                      </div>
                                    </div>
                                  </div>
                                </CardFooter>
                              
                              {/* Action buttons */}
                              {acceptance.status === 'applied' && (
                                <div className="px-6 pb-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => withdrawApplicationMutation.mutate(acceptance.id)}
                                    disabled={withdrawApplicationMutation.isPending}
                                    className="text-red-600 border-red-300 hover:bg-red-50 w-full"
                                    data-testid="button-withdraw-application"
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    {withdrawApplicationMutation.isPending ? 'Withdrawing...' : 'Withdraw Application'}
                                  </Button>
                                </div>
                              )}
                              
                              {acceptance.status === 'awarded' && (
                                <div className="px-6 pb-4">
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => applicantRejectMutation.mutate(acceptance.id)}
                                      disabled={applicantRejectMutation.isPending}
                                      className="text-red-600 border-red-300 hover:bg-red-50 flex-1"
                                      data-testid="button-reject-trade"
                                    >
                                      <X className="h-3 w-3 mr-1" />
                                      {applicantRejectMutation.isPending ? 'Rejecting...' : 'Decline'}
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => shareContactMutation.mutate(acceptance.id)}
                                      disabled={shareContactMutation.isPending}
                                      className="bg-green-600 hover:bg-green-700 flex-1"
                                      data-testid="button-share-contact"
                                    >
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      {shareContactMutation.isPending ? 'Sharing...' : 'Share Contact'}
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </Card>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Applications from others to my trades */}
                    {tradeApplications.filter((application: any) => 
                      !['contacted', 'applicant_rejected', 'awarded', 'owner_rejected', 'withdrawn'].includes(application.acceptance.status)
                    ).length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <ArrowLeft className="h-4 w-4" />
                          Applications to My Trades ({tradeApplications.filter((application: any) => 
                            !['contacted', 'applicant_rejected', 'awarded', 'owner_rejected', 'withdrawn'].includes(application.acceptance.status)
                          ).length})
                        </h3>
                        <div className="space-y-4">
                          {tradeApplications.filter((application: any) => 
                            !['contacted', 'applicant_rejected', 'awarded', 'owner_rejected', 'withdrawn'].includes(application.acceptance.status)
                          ).map((application: any) => {
                            const statusMeta = getApplicationStatusMeta(application.acceptance.status);
                            
                            return (
                            <Card key={application.acceptance.id} className="overflow-hidden border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow duration-200" data-testid={`card-application-${application.acceptance.id}`}>
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-green-600" />
                                    <h3 className="text-lg font-semibold text-gray-900" data-testid={`text-title-${application.acceptance.id}`}>
                                      Energy {application.trade?.tradeType === 'sell' ? 'Sale' : 'Purchase'}: {formatEnergy(application.trade?.energyAmount || 0)}
                                    </h3>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={statusMeta.variant} className="flex items-center gap-1" data-testid={`badge-status-${application.acceptance.id}`}>
                                      <statusMeta.icon className="h-3 w-3" />
                                      {statusMeta.label}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                  Applied: {format(new Date(application.acceptance.acceptedAt), 'MMM dd, yyyy HH:mm')}
                                </div>
                              </CardHeader>

                              <CardContent className="py-3">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <User className="h-4 w-4" />
                                    <span>Applicant Details</span>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <div>
                                      <span className="text-gray-500">Name:</span>
                                      <div className="font-medium">{application.applicant?.username || 'User'}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Household:</span>
                                      <div className="font-medium">{application.applicantHousehold?.name || 'Not specified'}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Location:</span>
                                      <div className="font-medium">
                                        {application.applicant?.district || 'Not specified'}
                                        {application.applicant?.state && `, ${application.applicant.state}`}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Contact:</span>
                                      <div className="font-medium">
                                        {application.acceptance.status === 'awarded' 
                                          ? (
                                              <div className="space-y-1">
                                                <div>{application.applicant?.email || 'Email not available'}</div>
                                                {application.applicant?.phone && (
                                                  <div>{application.applicant.phone}</div>
                                                )}
                                                {application.applicantHousehold?.address && (
                                                  <div className="text-xs text-gray-600">Address: {application.applicantHousehold.address}</div>
                                                )}
                                              </div>
                                            )
                                          : 'Hidden until approved'
                                        }
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>

                              <CardFooter className="pt-3 border-t">
                                <div className="grid grid-cols-3 gap-4 w-full text-sm">
                                  <div>
                                    <span className="text-gray-500">Price per kWh:</span>
                                    <div className="font-semibold" data-testid={`text-price-${application.acceptance.id}`}>{formatPrice(application.trade?.pricePerKwh || 0)}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Total Value:</span>
                                    <div className="font-semibold text-green-600" data-testid={`text-total-${application.acceptance.id}`}>{formatTotal(application.trade?.energyAmount || 0, application.trade?.pricePerKwh || 0)}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Status:</span>
                                    <div className="flex items-center gap-1 font-medium">
                                      <div className={`w-2 h-2 rounded-full ${statusMeta.dotClass}`}></div>
                                      {statusMeta.label}
                                    </div>
                                  </div>
                                </div>
                              </CardFooter>

                              
                              {/* Action buttons */}
                              {application.acceptance.status === 'applied' && (
                                <div className="px-6 pb-4">
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => declineApplicationMutation.mutate(application.acceptance.id)}
                                      disabled={declineApplicationMutation.isPending}
                                      className="text-red-600 border-red-300 hover:bg-red-50 flex-1"
                                      data-testid="button-reject-application"
                                    >
                                      <X className="h-3 w-3 mr-1" />
                                      {declineApplicationMutation.isPending ? 'Rejecting...' : 'Decline'}
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => approveApplicationMutation.mutate(application.acceptance.id)}
                                      disabled={approveApplicationMutation.isPending}
                                      className="bg-green-600 hover:bg-green-700 flex-1"
                                      data-testid="button-approve-application"
                                    >
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      {approveApplicationMutation.isPending ? 'Approving...' : 'Approve'}
                                    </Button>
                                  </div>
                                </div>
                              )}
                              
                              {application.acceptance.status === 'awarded' && (
                                <div className="px-6 pb-4">
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-green-800">
                                      <CheckCircle className="h-4 w-4" />
                                      <span className="font-medium">Application Approved</span>
                                    </div>
                                    <p className="text-sm text-green-700 mt-1">
                                      You approved this application. Waiting for applicant to share contact or reject.
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              {application.acceptance.status === 'owner_rejected' && (
                                <div className="px-6 pb-4">
                                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-red-800">
                                      <X className="h-4 w-4" />
                                      <span className="font-medium">Application Rejected</span>
                                    </div>
                                    <p className="text-sm text-red-700 mt-1">
                                      You rejected this application. Trade remains available.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </Card>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Your Results */}
          <TabsContent value="request-results">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  Your Results
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Completed trade interactions with contact details and outcomes
                </p>
              </CardHeader>
              <CardContent>
                {(() => {
                  // Get results from both sources using centralized status mapping
                  // Include all finalized statuses that represent completed interactions
                  const getFinalizedStatuses = () => {
                    return ['contacted', 'applicant_rejected', 'awarded', 'owner_rejected', 'withdrawn'];
                  };
                  
                  const finalizedStatuses = getFinalizedStatuses();
                  const myApplicationResults = tradeAcceptances.filter((acceptance: any) => 
                    finalizedStatuses.includes(acceptance.status)
                  );
                  
                  const myTradeResults = tradeApplications.filter((application: any) => 
                    finalizedStatuses.includes(application.acceptance?.status)
                  );
                  
                  const allResults = [...myApplicationResults, ...myTradeResults];
                  
                  if (allResults.length === 0) {
                    return (
                      <div className="text-center py-8" data-testid="empty-results">
                        <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No completed trade interactions yet</p>
                        <p className="text-sm text-gray-400">When applications are finalized (contact shared or rejected), they will appear here</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="space-y-4">
                      {/* Results from applications I submitted */}
                      {myApplicationResults.length > 0 && (
                        <div>
                          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <ArrowRight className="h-4 w-4" />
                            My Application Results ({myApplicationResults.length})
                          </h3>
                          <div className="space-y-3">
                            {myApplicationResults.map((acceptance: any) => (
                              <Card key={acceptance.id} className={`p-3 border-l-4 ${
                                acceptance.status === 'contacted' 
                                  ? 'border-l-green-400' 
                                  : acceptance.status === 'awarded' 
                                    ? 'border-l-blue-400'
                                    : 'border-l-red-400'
                              }`}>
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <div className="space-y-1">
                                      {(() => {
                                        // First try to find in energyTrades (my own trades), then in availableTradesData (others' trades)
                                        let trade = energyTrades.find(t => t.id === acceptance.tradeId);
                                        let offerMatch = null;
                                        
                                        if (!trade) {
                                          // Look for the trade in available trades data (trades from others)
                                          offerMatch = availableTradesData.find(o => o.trade?.id === acceptance.tradeId);
                                          trade = offerMatch?.trade;
                                        } else {
                                          // Find the counterparty information for my own trades
                                          offerMatch = availableTradesData.find(o => o.trade?.id === trade?.id);
                                        }
                                        
                                        if (!trade) return (
                                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                            <div className="text-sm text-gray-500">Trade Reference: {acceptance.tradeId}</div>
                                            <div className="text-xs text-gray-400 mt-1">Trade details no longer available</div>
                                          </div>
                                        );
                                        
                                        const tradeHouseholdId = trade.sellerHouseholdId || trade.buyerHouseholdId;
                                        const counterpartyName = offerMatch?.household?.name || (tradeHouseholdId ? `Household ${tradeHouseholdId}` : 'User');
                                        
                                        return (
                                          <div className="bg-white rounded-lg border border-gray-100 p-3 space-y-3">
                                            {/* Main trade info - responsive layout */}
                                            <div className="space-y-1">
                                              <div className="text-base md:text-lg font-bold text-gray-900 leading-tight">
                                                {formatEnergy(trade.energyAmount)} • {formatPrice(trade.pricePerKwh)}/kWh
                                              </div>
                                              <div className="text-lg md:text-xl font-bold text-green-600">
                                                Total: {formatTotal(trade.energyAmount, trade.pricePerKwh)}
                                              </div>
                                            </div>
                                            
                                            {/* Household and location info */}
                                            <div className="space-y-1 border-t border-gray-100 pt-2">
                                              <div className="text-sm md:text-base font-semibold text-gray-800">
                                                {counterpartyName}
                                              </div>
                                              <div className="text-xs text-gray-600">
                                                📍 {offerMatch?.user?.district || 'Location not available'} • 📅 {format(new Date(trade.createdAt), 'MMM dd')}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })()}
                                      <div className="flex items-center gap-2">
                                        {(() => {
                                          const statusConfig = getStatusBadgeConfig(acceptance.status);
                                          const StatusIcon = statusConfig.icon;
                                          return (
                                            <Badge 
                                              variant={statusConfig.variant}
                                              className="flex items-center gap-1"
                                            >
                                              <StatusIcon className="h-3 w-3" />
                                              {statusConfig.label}
                                            </Badge>
                                          );
                                        })()}
                                        {canViewDetail(acceptance.status) && (
                                          <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="h-7 text-xs"
                                            onClick={() => {
                                              setSelectedTradeDetail(acceptance);
                                              setIsDetailModalOpen(true);
                                            }}
                                            data-testid={`button-view-detail-${acceptance.id}`}
                                          >
                                            View Detail
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-2">
                                      Completed: {format(new Date(acceptance.acceptedAt), 'MMM dd, yyyy')}
                                    </div>
                                  </div>
                                </div>
                                
                                {acceptance.status === 'contacted' ? (
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-green-800 mb-2">
                                      <CheckCircle className="h-4 w-4" />
                                      <span className="font-medium">Contact Details Shared</span>
                                    </div>
                                    <p className="text-sm text-green-700 mb-3">
                                      You shared contact details with the trade owner. Both parties can now coordinate the energy transfer.
                                    </p>

                                  </div>
                                ) : (
                                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-red-800 mb-2">
                                      <X className="h-4 w-4" />
                                      <span className="font-medium">Trade Rejected</span>
                                    </div>
                                    <p className="text-sm text-red-700 mb-3">
                                      You rejected this trade after the owner accepted your application. The trade is now available for other applicants.
                                    </p>
                                    <div className="bg-white border rounded-lg p-3">
                                      <div className="text-sm text-gray-600">
                                        📧 Rejection notification has been sent to the trade owner
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Results from applications to my trades */}
                      {myTradeResults.length > 0 && (
                        <div>
                          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            My Trade Results ({myTradeResults.length})
                          </h3>
                          <div className="space-y-3">
                            {myTradeResults.map((application: any) => (
                              <Card key={application.acceptance.id} className={`p-3 border-l-4 ${
                                application.acceptance.status === 'contacted' 
                                  ? 'border-l-green-400' 
                                  : application.acceptance.status === 'awarded' 
                                    ? 'border-l-blue-400'
                                    : 'border-l-red-400'
                              }`}>
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <div className="font-medium text-base">
                                        {application.trade?.tradeType === 'sell' ? 'Your Sell Listing' : 'Your Buy Request'}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {(() => {
                                          const statusConfig = getStatusBadgeConfig(application.acceptance.status);
                                          const StatusIcon = statusConfig.icon;
                                          return (
                                            <Badge 
                                              variant={statusConfig.variant}
                                              className="flex items-center gap-1"
                                            >
                                              <StatusIcon className="h-3 w-3" />
                                              {statusConfig.label}
                                            </Badge>
                                          );
                                        })()}
                                        {canViewDetail(application.acceptance.status) && (
                                          <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="h-7 text-xs"
                                            onClick={() => {
                                              setSelectedTradeDetail(application);
                                              setIsDetailModalOpen(true);
                                            }}
                                            data-testid={`button-view-detail-trade-${application.acceptance.id}`}
                                          >
                                            View Detail
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-2">
                                      {formatEnergy(application.trade?.energyAmount)} at {formatPrice(application.trade?.pricePerKwh)}/kWh • {format(new Date(application.acceptance.acceptedAt), 'MMM dd, yyyy')}
                                    </div>
                                  </div>
                                </div>
                                
                                {application.acceptance.status === 'contacted' ? (
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-green-800 mb-2">
                                      <CheckCircle className="h-4 w-4" />
                                      <span className="font-medium">Contact Details Shared</span>
                                    </div>
                                    <p className="text-sm text-green-700 mb-3">
                                      The applicant shared contact details. Both parties can now coordinate the energy transfer.
                                    </p>

                                  </div>
                                ) : application.acceptance.status === 'awarded' ? (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-blue-800 mb-2">
                                      <CheckCircle className="h-4 w-4" />
                                      <span className="font-medium">Application Approved</span>
                                    </div>
                                    <p className="text-sm text-blue-700">
                                      You approved this application. Waiting for the applicant to share contact details for coordination.
                                    </p>
                                  </div>
                                ) : application.acceptance.status === 'applicant_rejected' ? (
                                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-red-800 mb-2">
                                      <X className="h-4 w-4" />
                                      <span className="font-medium">Application Rejected by Applicant</span>
                                    </div>
                                    <p className="text-sm text-red-700 mb-3">
                                      The applicant rejected the trade after you approved their application. Your trade is now available for other applicants.
                                    </p>
                                    <div className="bg-white border rounded-lg p-3">
                                      <div className="text-sm text-gray-600">
                                        📧 Rejection notification has been received
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-gray-800 mb-2">
                                      <Clock className="h-4 w-4" />
                                      <span className="font-medium">Status: {application.acceptance.status}</span>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                      Application status is being processed.
                                    </p>
                                  </div>
                                )}
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

        {/* Edit Trade Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Energy Trade</DialogTitle>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit((data) => editingTrade && updateTradeMutation.mutate({ id: editingTrade.id, data }))} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="tradeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trade Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select trade type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sell">Sell Energy</SelectItem>
                          <SelectItem value="buy">Buy Energy</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="energyAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Energy Amount (kWh)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="pricePerKwh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per kWh (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="text-red-600">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateTradeMutation.isPending}>
                    {updateTradeMutation.isPending ? 'Updating...' : 'Update Trade'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Trade Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Trade Contact Details
              </DialogTitle>
            </DialogHeader>
            {selectedTradeDetail && (
              <div className="space-y-4">
                {(() => {
                  // Determine if this is from myApplicationResults or myTradeResults
                  const isMyApplication = selectedTradeDetail.tradeId;
                  const isMyTrade = selectedTradeDetail.trade;
                  
                  if (isMyApplication) {
                    // This is from my application results - show trade owner's details
                    let trade = energyTrades.find(t => t.id === selectedTradeDetail.tradeId);
                    let offerMatch = null;
                    
                    if (!trade) {
                      offerMatch = availableTradesData.find(o => o.trade?.id === selectedTradeDetail.tradeId);
                      trade = offerMatch?.trade;
                    } else {
                      offerMatch = availableTradesData.find(o => o.trade?.id === trade?.id);
                    }

                    const counterpartyName = offerMatch?.household?.name || `Household ${trade?.sellerHouseholdId || trade?.buyerHouseholdId}`;
                    const counterpartyUser = offerMatch?.user;
                    const counterpartyHousehold = offerMatch?.household;
                    
                    return (
                      <div className="space-y-4">
                        {/* Trade Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-medium text-gray-900 mb-3">Trade Information</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">Energy:</span>
                              <div className="font-medium">{formatEnergy(trade?.energyAmount || 0)}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Price:</span>
                              <div className="font-medium">{formatPrice(trade?.pricePerKwh || 0)}/kWh</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Total:</span>
                              <div className="font-medium text-green-600">{formatTotal(trade?.energyAmount || 0, trade?.pricePerKwh || 0)}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Type:</span>
                              <div className="font-medium capitalize">{trade?.tradeType}</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Contact Information */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Trade Owner Contact Details
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-blue-700 font-medium">Name:</span>
                              <div className="text-blue-900">{counterpartyName}</div>
                            </div>
                            <div>
                              <span className="text-blue-700 font-medium">Location:</span>
                              <div className="text-blue-900">{counterpartyUser?.district || 'Location not available'}, {counterpartyUser?.state || 'State not available'}</div>
                            </div>
                            {counterpartyHousehold?.address && (
                              <div>
                                <span className="text-blue-700 font-medium">Address:</span>
                                <div className="text-blue-900">{counterpartyHousehold.address}</div>
                              </div>
                            )}
                            {counterpartyUser?.phone && (
                              <div>
                                <span className="text-blue-700 font-medium">Phone:</span>
                                <div className="text-blue-900">{counterpartyUser.phone}</div>
                              </div>
                            )}
                            {counterpartyUser?.email && (
                              <div>
                                <span className="text-blue-700 font-medium">Email:</span>
                                <div className="text-blue-900">{counterpartyUser.email}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  } else if (isMyTrade) {
                    // This is from my trade results - show applicant's details
                    const applicantUser = selectedTradeDetail.applicant;
                    const applicantHousehold = selectedTradeDetail.applicantHousehold;
                    const trade = selectedTradeDetail.trade;
                    
                    return (
                      <div className="space-y-4">
                        {/* Trade Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-medium text-gray-900 mb-3">Trade Information</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">Energy:</span>
                              <div className="font-medium">{formatEnergy(trade?.energyAmount || 0)}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Price:</span>
                              <div className="font-medium">{formatPrice(trade?.pricePerKwh || 0)}/kWh</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Total:</span>
                              <div className="font-medium text-green-600">{formatTotal(trade?.energyAmount || 0, trade?.pricePerKwh || 0)}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Type:</span>
                              <div className="font-medium capitalize">{trade?.tradeType}</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Contact Information */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Applicant Contact Details
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-blue-700 font-medium">Name:</span>
                              <div className="text-blue-900">{applicantUser?.username || applicantHousehold?.name}</div>
                            </div>
                            <div>
                              <span className="text-blue-700 font-medium">Household:</span>
                              <div className="text-blue-900">{applicantHousehold?.name || 'Household not available'}</div>
                            </div>
                            <div>
                              <span className="text-blue-700 font-medium">Location:</span>
                              <div className="text-blue-900">{applicantUser?.district || 'District not available'}, {applicantUser?.state || 'State not available'}</div>
                            </div>
                            {applicantHousehold?.address && (
                              <div>
                                <span className="text-blue-700 font-medium">Address:</span>
                                <div className="text-blue-900">{applicantHousehold.address}</div>
                              </div>
                            )}
                            {applicantUser?.phone && (
                              <div>
                                <span className="text-blue-700 font-medium">Phone:</span>
                                <div className="text-blue-900">{applicantUser.phone}</div>
                              </div>
                            )}
                            {applicantUser?.email && (
                              <div>
                                <span className="text-blue-700 font-medium">Email:</span>
                                <div className="text-blue-900">{applicantUser.email}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  return <div className="text-gray-500">Trade details not available</div>;
                })()}
                
                <div className="flex justify-center sm:justify-end pt-4 mt-4 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDetailModalOpen(false)}
                    className="w-full sm:w-auto min-h-[44px] font-medium"
                    data-testid="button-close-detail-modal-bottom"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}