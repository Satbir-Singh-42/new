import { MLEnergyEngine, WeatherCondition, OutageResponse } from './ml-engine';
import { Household, EnergyReading, EnergyTrade } from '../shared/schema';
import { IStorage } from './storage';

// Real-time simulation engine for live demonstrations
export class SimulationEngine {
  private mlEngine: MLEnergyEngine;
  private storage: IStorage;
  private simulationInterval: NodeJS.Timeout | null = null;
  private weatherSimulator: WeatherSimulator;
  private outageSimulator: OutageSimulator;
  private isRunning: boolean = false;

  constructor(storage: IStorage) {
    this.storage = storage;
    this.mlEngine = new MLEnergyEngine();
    this.weatherSimulator = new WeatherSimulator();
    this.outageSimulator = new OutageSimulator();
  }

  // Start live simulation
  async startSimulation(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🚀 Starting SolarSense live simulation...');
    
    // Initialize demo households if none exist
    await this.initializeDemoNetwork();
    
    // Start main simulation loop
    this.simulationInterval = setInterval(async () => {
      await this.runSimulationCycle();
    }, 10000); // Update every 10 seconds for live demo
    
    console.log('✅ Live simulation started - updating every 10 seconds');
  }

  // Stop simulation
  stopSimulation(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    this.isRunning = false;
    console.log('⏹️ Simulation stopped');
  }

  // Get simulation status
  getStatus(): SimulationStatus {
    return {
      isRunning: this.isRunning,
      currentWeather: this.weatherSimulator.getCurrentWeather(),
      activeOutages: this.outageSimulator.getActiveOutages(),
      networkStats: this.getNetworkStats()
    };
  }

  // Trigger weather change for demonstration
  async triggerWeatherChange(condition: WeatherCondition['condition']): Promise<WeatherCondition> {
    const newWeather = this.weatherSimulator.setWeather(condition);
    console.log(`🌤️ Weather changed to: ${condition}`);
    
    // Immediately run optimization with new weather
    await this.runSimulationCycle();
    
    return newWeather;
  }

  // Trigger power outage simulation
  async triggerOutage(householdIds: number[] = []): Promise<OutageResponse> {
    if (householdIds.length === 0) {
      // Random outage affecting 20-30% of network
      const allHouseholds = await this.storage.listHouseholds();
      const outageCount = Math.floor(allHouseholds.length * 0.2) + Math.floor(Math.random() * allHouseholds.length * 0.1);
      householdIds = this.selectRandomHouseholds(allHouseholds, outageCount);
    }

    const response = await this.outageSimulator.simulateOutage(householdIds, await this.storage.listHouseholds());
    
    console.log(`⚡ Outage simulation: ${householdIds.length} households affected`);
    console.log(`🔋 Community resilience score: ${response.communityResilience.toFixed(2)}`);
    
    // Update household statuses
    for (const householdId of householdIds) {
      await this.storage.updateHousehold(householdId, { 
        isOnline: false,
        lastOutage: new Date()
      });
    }

    return response;
  }

  // Restore power after outage
  async restorePower(householdIds: number[]): Promise<void> {
    for (const householdId of householdIds) {
      await this.storage.updateHousehold(householdId, { 
        isOnline: true 
      });
    }
    
    this.outageSimulator.clearOutage(householdIds);
    console.log(`🔌 Power restored to ${householdIds.length} households`);
  }

  // Main simulation cycle
  private async runSimulationCycle(): Promise<void> {
    try {
      const households = await this.storage.listHouseholds();
      const currentWeather = this.weatherSimulator.getCurrentWeather();
      
      // Run ML optimization
      const optimization = this.mlEngine.optimizeEnergyDistribution(households, currentWeather);
      
      // Generate energy readings for each household
      await this.generateEnergyReadings(households, currentWeather);
      
      // Execute optimal trades
      await this.executeTrades(optimization.tradingPairs, optimization.prices);
      
      // Update battery levels based on strategy
      await this.updateBatteryLevels(households, optimization.batteryStrategy);
      
      // Log key metrics
      this.logSimulationMetrics(optimization, currentWeather);
      
    } catch (error) {
      console.error('❌ Simulation cycle error:', error);
    }
  }

  private async generateEnergyReadings(households: Household[], weather: WeatherCondition): Promise<void> {
    const currentTime = new Date();
    const hour = currentTime.getHours();
    
    for (const household of households) {
      if (!household.isOnline) continue; // Skip households affected by outage
      
      const generation = this.mlEngine.predictEnergyGeneration(household, weather, hour);
      const consumption = this.mlEngine.predictEnergyDemand(household, hour, currentTime.getDay());
      
      // Add some realistic variance
      const generationVariance = generation * 0.1 * (Math.random() - 0.5);
      const consumptionVariance = consumption * 0.1 * (Math.random() - 0.5);
      
      const reading = {
        householdId: household.id,
        timestamp: currentTime,
        energyGenerated: Math.max(0, generation + generationVariance),
        energyConsumed: Math.max(0, consumption + consumptionVariance),
        batteryLevel: household.batteryLevel || 0,
        gridExport: Math.max(0, generation - consumption),
        gridImport: Math.max(0, consumption - generation),
        weather: weather.condition
      };
      
      await this.storage.createEnergyReading(reading);
    }
  }

  private async executeTrades(tradingPairs: any[], prices: Map<number, number>): Promise<void> {
    for (const pair of tradingPairs) {
      const price = prices.get(pair.supplierId) || 0.12;
      const totalCost = pair.energyAmount * price;
      
      const trade = {
        sellerId: pair.supplierId,
        buyerId: pair.demanderId,
        energyAmount: pair.energyAmount,
        pricePerKwh: price,
        totalAmount: totalCost,
        status: 'completed',
        timestamp: new Date(),
        distance: pair.distance,
        efficiency: Math.max(0.85, 1 - (pair.distance / 1000)), // Efficiency decreases with distance
        carbonSaved: pair.energyAmount * 0.45 // kg CO2 saved vs grid electricity
      };
      
      await this.storage.createEnergyTrade(trade);
    }
  }

  private async updateBatteryLevels(households: Household[], batteryStrategy: any): Promise<void> {
    for (const household of households) {
      const strategy = batteryStrategy.strategies[household.id];
      let newBatteryLevel = household.batteryLevel || 0;
      const maxCapacity = household.batteryCapacity || 0;
      
      if (!household.isOnline || maxCapacity === 0) continue;
      
      switch (strategy) {
        case 'charge':
          newBatteryLevel = Math.min(maxCapacity, newBatteryLevel + 2); // 2kWh charge rate
          break;
        case 'discharge':
          newBatteryLevel = Math.max(0, newBatteryLevel - 1.5); // 1.5kWh discharge rate
          break;
        case 'sell':
        case 'buy':
          // Battery level remains stable during active trading
          break;
      }
      
      if (newBatteryLevel !== household.batteryLevel) {
        await this.storage.updateHousehold(household.id, { 
          batteryLevel: newBatteryLevel 
        });
      }
    }
  }

  private async initializeDemoNetwork(): Promise<void> {
    const existingHouseholds = await this.storage.listHouseholds();
    
    if (existingHouseholds.length === 0) {
      console.log('🏠 Initializing demo network with sample households...');
      
      const demoHouseholds = [
        {
          name: 'Solar Pioneers',
          location: 'Residential District A',
          solarCapacity: 8.5,
          batteryCapacity: 15.0,
          batteryLevel: 12.0,
          averageDemand: 6.2,
          criticalLoad: true,
          isOnline: true,
          userId: 1
        },
        {
          name: 'Green Energy Hub',
          location: 'Residential District B', 
          solarCapacity: 12.0,
          batteryCapacity: 20.0,
          batteryLevel: 16.0,
          averageDemand: 8.5,
          criticalLoad: false,
          isOnline: true,
          userId: 1
        },
        {
          name: 'Community Center',
          location: 'Commercial Zone',
          solarCapacity: 25.0,
          batteryCapacity: 40.0,
          batteryLevel: 30.0,
          averageDemand: 15.2,
          criticalLoad: true,
          isOnline: true,
          userId: 1
        },
        {
          name: 'Eco Apartments',
          location: 'Residential District C',
          solarCapacity: 6.0,
          batteryCapacity: 10.0,
          batteryLevel: 7.0,
          averageDemand: 4.8,
          criticalLoad: false,
          isOnline: true,
          userId: 1
        },
        {
          name: 'Smart Home Alpha',
          location: 'Residential District A',
          solarCapacity: 10.0,
          batteryCapacity: 18.0,
          batteryLevel: 14.0,
          averageDemand: 7.1,
          criticalLoad: false,
          isOnline: true,
          userId: 1
        }
      ];

      for (const household of demoHouseholds) {
        await this.storage.createHousehold(household);
      }
      
      console.log(`✅ Created ${demoHouseholds.length} demo households`);
    }
  }

  private selectRandomHouseholds(households: Household[], count: number): number[] {
    const shuffled = [...households].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(h => h.id);
  }

  private getNetworkStats(): NetworkStats {
    // This would be populated with real-time data in a production system
    return {
      totalHouseholds: 5,
      activeConnections: 5,
      totalGeneration: 61.5,
      totalConsumption: 41.8,
      batteryStorageTotal: 103.0,
      tradingVelocity: 12.5,
      carbonReduction: 28.2
    };
  }

  private logSimulationMetrics(optimization: any, weather: WeatherCondition): void {
    console.log(`📊 Simulation Update - Weather: ${weather.condition}`);
    console.log(`⚡ Grid Stability: ${(optimization.gridStability * 100).toFixed(1)}%`);
    console.log(`🔄 Active Trades: ${optimization.tradingPairs.length}`);
    console.log(`💡 Recommendations: ${optimization.recommendations.length}`);
    
    if (optimization.recommendations.length > 0) {
      console.log(`🎯 Key Recommendation: ${optimization.recommendations[0]}`);
    }
  }
}

class WeatherSimulator {
  private currentWeather: WeatherCondition;
  private weatherCycle: WeatherCondition[] = [];
  private cycleIndex: number = 0;

  constructor() {
    this.initializeWeatherCycle();
    this.currentWeather = this.weatherCycle[0];
  }

  getCurrentWeather(): WeatherCondition {
    return this.currentWeather;
  }

  setWeather(condition: WeatherCondition['condition']): WeatherCondition {
    this.currentWeather = {
      condition,
      temperature: this.getTemperatureForCondition(condition),
      cloudCover: this.getCloudCoverForCondition(condition),
      windSpeed: Math.random() * 15 + 5
    };
    return this.currentWeather;
  }

  private initializeWeatherCycle(): void {
    this.weatherCycle = [
      { condition: 'sunny', temperature: 28, cloudCover: 10, windSpeed: 8 },
      { condition: 'partly-cloudy', temperature: 25, cloudCover: 40, windSpeed: 12 },
      { condition: 'cloudy', temperature: 22, cloudCover: 80, windSpeed: 15 },
      { condition: 'overcast', temperature: 20, cloudCover: 95, windSpeed: 18 },
      { condition: 'rainy', temperature: 18, cloudCover: 100, windSpeed: 22 }
    ];
  }

  private getTemperatureForCondition(condition: WeatherCondition['condition']): number {
    const temps = {
      'sunny': 28,
      'partly-cloudy': 25,
      'cloudy': 22,
      'overcast': 20,
      'rainy': 18,
      'stormy': 16
    };
    return temps[condition] + (Math.random() * 6 - 3); // ±3°C variance
  }

  private getCloudCoverForCondition(condition: WeatherCondition['condition']): number {
    const covers = {
      'sunny': 10,
      'partly-cloudy': 40,
      'cloudy': 80,
      'overcast': 95,
      'rainy': 100,
      'stormy': 100
    };
    return covers[condition];
  }
}

class OutageSimulator {
  private activeOutages: Set<number> = new Set();

  async simulateOutage(householdIds: number[], allHouseholds: Household[]): Promise<OutageResponse> {
    // Add to active outages
    householdIds.forEach(id => this.activeOutages.add(id));

    // Use ML engine to calculate outage response
    const mlEngine = new MLEnergyEngine();
    return mlEngine.simulateOutageResponse(householdIds, allHouseholds);
  }

  getActiveOutages(): number[] {
    return Array.from(this.activeOutages);
  }

  clearOutage(householdIds: number[]): void {
    householdIds.forEach(id => this.activeOutages.delete(id));
  }
}

// Type definitions
export interface SimulationStatus {
  isRunning: boolean;
  currentWeather: WeatherCondition;
  activeOutages: number[];
  networkStats: NetworkStats;
}

export interface NetworkStats {
  totalHouseholds: number;
  activeConnections: number;
  totalGeneration: number;
  totalConsumption: number;
  batteryStorageTotal: number;
  tradingVelocity: number;
  carbonReduction: number;
}