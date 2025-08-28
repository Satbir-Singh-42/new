import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Square, 
  Zap, 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSnow, 
  AlertTriangle,
  Battery,
  TrendingUp,
  Activity,
  BarChart3,
  Gauge,
  ArrowRightLeft,
  DollarSign,
  Leaf,
  Users,
  Network,
  Workflow
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SimulationStatus {
  isRunning: boolean;
  currentWeather: {
    condition: string;
    temperature: number;
    cloudCover: number;
    windSpeed: number;
  };
  activeOutages: number[];
  networkStats: {
    totalHouseholds: number;
    activeConnections: number;
    totalGeneration: number;
    totalConsumption: number;
    batteryStorageTotal: number;
    tradingVelocity: number;
    carbonReduction: number;
  };
}

interface OptimizationResult {
  tradingPairs: any[];
  prices: { [key: number]: number };
  gridStability: string;
  recommendations: string[];
  batteryStrategy: { strategies: { [key: number]: string } };
}

interface NetworkAnalytics {
  network: {
    totalHouseholds: number;
    activeHouseholds: number;
    totalGenerationCapacity: string;
    totalStorageCapacity: string;
    currentStorageLevel: string;
    storageUtilization: string;
  };
  trading: {
    totalTrades: number;
    totalEnergyTraded: string;
    averagePrice: string;
    carbonSaved: string;
  };
  efficiency: {
    averageDistance: string;
    networkEfficiency: string;
  };
}

export function SimulationDashboard() {
  const [simulationStatus, setSimulationStatus] = useState<SimulationStatus | null>(null);
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);
  const [analytics, setAnalytics] = useState<NetworkAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Auto-refresh data when simulation is running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (simulationStatus?.isRunning) {
      interval = setInterval(() => {
        fetchSimulationStatus();
        fetchOptimization();
        fetchAnalytics();
      }, 5000); // Update every 5 seconds during simulation
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [simulationStatus?.isRunning]);

  // Initial data fetch
  useEffect(() => {
    fetchSimulationStatus();
    fetchOptimization();
    fetchAnalytics();
  }, []);

  const fetchSimulationStatus = async () => {
    try {
      const response = await fetch('/api/simulation/status');
      if (response.ok) {
        const data = await response.json();
        setSimulationStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch simulation status:', error);
    }
  };

  const fetchOptimization = async () => {
    try {
      const response = await fetch('/api/ml/optimization');
      if (response.ok) {
        const data = await response.json();
        setOptimization(data.optimization);
      }
    } catch (error) {
      console.error('Failed to fetch optimization:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/network');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const startSimulation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/simulation/start', { method: 'POST' });
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Simulation Started",
          description: data.message,
        });
        fetchSimulationStatus();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Failed to start simulation",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const stopSimulation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/simulation/stop', { method: 'POST' });
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Simulation Stopped",
          description: data.message,
        });
        fetchSimulationStatus();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Failed to stop simulation",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const changeWeather = async (condition: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/simulation/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ condition })
      });
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Weather Changed",
          description: `${data.message}. ${data.impact}`,
        });
        fetchSimulationStatus();
        fetchOptimization();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Failed to change weather",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerOutage = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/simulation/outage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Outage Simulation Triggered",
          description: `${data.message}. ${data.resilienceScore}`,
        });
        fetchSimulationStatus();
        fetchOptimization();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Failed to trigger outage",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'partly-cloudy': return <Cloud className="h-5 w-5 text-gray-400" />;
      case 'cloudy': return <Cloud className="h-5 w-5 text-gray-600" />;
      case 'overcast': return <Cloud className="h-5 w-5 text-gray-700" />;
      case 'rainy': return <CloudRain className="h-5 w-5 text-blue-500" />;
      case 'stormy': return <CloudSnow className="h-5 w-5 text-purple-500" />;
      default: return <Cloud className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ML Energy Trading Simulation</h1>
          <p className="text-gray-600 mt-1">
            Live demonstration of decentralized energy trading with machine learning optimization
          </p>
        </div>
        
        <div className="flex gap-2">
          {simulationStatus?.isRunning ? (
            <Button 
              onClick={stopSimulation} 
              disabled={loading} 
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              Stop Simulation
            </Button>
          ) : (
            <Button 
              onClick={startSimulation} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Start Live Demo
            </Button>
          )}
        </div>
      </div>

      {/* Simulation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Simulation Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Badge variant={simulationStatus?.isRunning ? "default" : "secondary"}>
                {simulationStatus?.isRunning ? "Running" : "Stopped"}
              </Badge>
              {simulationStatus?.isRunning && (
                <span className="text-sm text-gray-600">Updates every 10s</span>
              )}
            </div>
            
            {simulationStatus?.currentWeather && (
              <div className="flex items-center gap-2">
                {getWeatherIcon(simulationStatus.currentWeather.condition)}
                <span className="text-sm capitalize">
                  {simulationStatus.currentWeather.condition.replace('-', ' ')}
                </span>
                <span className="text-sm text-gray-600">
                  {simulationStatus.currentWeather.temperature.toFixed(1)}°C
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span className="text-sm">
                {simulationStatus?.networkStats.activeConnections || 0} Active Connections
              </span>
            </div>
            
            {simulationStatus?.activeOutages && simulationStatus.activeOutages.length > 0 && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600">
                  {simulationStatus.activeOutages.length} Households Offline
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Weather Simulation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Change weather conditions to see real-time adaptation of energy generation and trading
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { condition: 'sunny', label: 'Sunny', icon: Sun },
                { condition: 'partly-cloudy', label: 'Partly Cloudy', icon: Cloud },
                { condition: 'cloudy', label: 'Cloudy', icon: Cloud },
                { condition: 'rainy', label: 'Rainy', icon: CloudRain }
              ].map(({ condition, label, icon: Icon }) => (
                <Button
                  key={condition}
                  variant="outline"
                  size="sm"
                  onClick={() => changeWeather(condition)}
                  disabled={loading || !simulationStatus?.isRunning}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Outage Simulation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Resilience Testing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Test network resilience by simulating power outages and recovery
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={triggerOutage}
                disabled={loading || !simulationStatus?.isRunning}
                className="w-full flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4" />
                Simulate Random Outage
              </Button>
              {simulationStatus?.activeOutages && simulationStatus.activeOutages.length > 0 && (
                <Button
                  variant="default"
                  onClick={() => {
                    fetch('/api/simulation/restore', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ householdIds: simulationStatus.activeOutages })
                    }).then(() => {
                      fetchSimulationStatus();
                      toast({ title: "Power Restored", description: "All affected households back online" });
                    });
                  }}
                  disabled={loading}
                  className="w-full flex items-center gap-2"
                >
                  <Battery className="h-4 w-4" />
                  Restore All Power
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Analytics */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Real-Time Network Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Network Stats */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wider">Network</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Households:</span>
                    <span className="font-semibold">{analytics.network.totalHouseholds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Connections:</span>
                    <span className="font-semibold text-green-600">{analytics.network.activeHouseholds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Generation Capacity:</span>
                    <span className="font-semibold">{analytics.network.totalGenerationCapacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage Utilization:</span>
                    <span className="font-semibold text-blue-600">{analytics.network.storageUtilization}</span>
                  </div>
                </div>
              </div>

              {/* Trading Stats */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wider">Trading</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Trades:</span>
                    <span className="font-semibold">{analytics.trading.totalTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Energy Traded:</span>
                    <span className="font-semibold">{analytics.trading.totalEnergyTraded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Price:</span>
                    <span className="font-semibold">{analytics.trading.averagePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbon Saved:</span>
                    <span className="font-semibold text-green-600">{analytics.trading.carbonSaved}</span>
                  </div>
                </div>
              </div>

              {/* Efficiency Stats */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wider">Efficiency</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Network Efficiency:</span>
                    <span className="font-semibold text-blue-600">{analytics.efficiency.networkEfficiency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Distance:</span>
                    <span className="font-semibold">{analytics.efficiency.averageDistance}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ML Optimization Results */}
      {optimization && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              ML Optimization Engine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Grid Stability */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Grid Stability:</span>
                <Badge variant="default" className="text-lg px-3 py-1">
                  {optimization.gridStability}
                </Badge>
              </div>

              <Separator />

              {/* Active Trading Pairs */}
              <div className="space-y-3">
                <h3 className="font-semibold">Active Trading Pairs ({optimization.tradingPairs.length})</h3>
                {optimization.tradingPairs.length > 0 ? (
                  <div className="grid gap-2">
                    {optimization.tradingPairs.slice(0, 3).map((pair, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                        <span className="text-sm">
                          Household #{pair.supplierId} → #{pair.demanderId}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{pair.energyAmount.toFixed(1)} kWh</span>
                          <Badge variant="outline">{pair.priority}</Badge>
                        </div>
                      </div>
                    ))}
                    {optimization.tradingPairs.length > 3 && (
                      <p className="text-sm text-gray-600">
                        ...and {optimization.tradingPairs.length - 3} more trades
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No active trades - network is balanced</p>
                )}
              </div>

              <Separator />

              {/* ML Recommendations */}
              <div className="space-y-3">
                <h3 className="font-semibold">AI Recommendations</h3>
                {optimization.recommendations.length > 0 ? (
                  <div className="space-y-2">
                    {optimization.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-green-600">✓ Network operating optimally</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}