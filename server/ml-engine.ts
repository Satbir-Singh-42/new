import { EnergyReading, EnergyTrade, Household } from '../shared/schema';

// ML-based energy prediction and optimization engine
export class MLEnergyEngine {
  private weatherPatterns: Map<string, number> = new Map();
  private demandPatterns: Map<string, number[]> = new Map();
  private priceModel: PriceOptimizer = new PriceOptimizer();

  // Predict energy generation based on weather and historical data
  predictEnergyGeneration(household: Household, weather: WeatherCondition, timeOfDay: number): number {
    const baseGeneration = household.solarCapacity || 0;
    const weatherMultiplier = this.getWeatherMultiplier(weather);
    const timeMultiplier = this.getTimeMultiplier(timeOfDay);
    const seasonalMultiplier = this.getSeasonalMultiplier();

    return baseGeneration * weatherMultiplier * timeMultiplier * seasonalMultiplier;
  }

  // Predict energy demand using ML patterns
  predictEnergyDemand(household: Household, timeOfDay: number, dayOfWeek: number): number {
    const baseDemand = household.averageDemand || 5.5; // kWh average
    const timePattern = this.getTimePattern(timeOfDay);
    const dayPattern = this.getDayPattern(dayOfWeek);
    const householdPattern = this.getHouseholdPattern(household);

    return baseDemand * timePattern * dayPattern * householdPattern;
  }

  // Optimize energy distribution across the network
  optimizeEnergyDistribution(households: Household[], currentWeather: WeatherCondition): OptimizationResult {
    const networkState = this.analyzeNetworkState(households, currentWeather);
    const tradingPairs = this.identifyTradingPairs(networkState);
    const prices = this.calculateOptimalPrices(tradingPairs, networkState);
    const batteryStrategy = this.optimizeBatteryStrategy(networkState);

    return {
      tradingPairs,
      prices,
      batteryStrategy,
      gridStability: this.calculateGridStability(networkState),
      recommendations: this.generateRecommendations(networkState)
    };
  }

  // Simulate outage response and recovery
  simulateOutageResponse(affectedHouseholds: number[], totalHouseholds: Household[]): OutageResponse {
    const survivingCapacity = this.calculateSurvivingCapacity(affectedHouseholds, totalHouseholds);
    const emergencyRouting = this.calculateEmergencyRouting(affectedHouseholds, survivingCapacity);
    const recoveryPlan = this.generateRecoveryPlan(affectedHouseholds, totalHouseholds);

    return {
      survivingCapacity,
      emergencyRouting,
      estimatedRecoveryTime: recoveryPlan.estimatedTime,
      priorityAllocation: recoveryPlan.priorityHouseholds,
      communityResilience: this.calculateResilienceScore(totalHouseholds, affectedHouseholds.length)
    };
  }

  // Weather adaptation algorithms
  private getWeatherMultiplier(weather: WeatherCondition): number {
    switch (weather.condition) {
      case 'sunny': return 1.0;
      case 'partly-cloudy': return 0.75;
      case 'cloudy': return 0.4;
      case 'overcast': return 0.2;
      case 'rainy': return 0.1;
      case 'stormy': return 0.05;
      default: return 0.6;
    }
  }

  private getTimeMultiplier(hour: number): number {
    // Solar generation curve throughout the day
    if (hour < 6 || hour > 19) return 0;
    if (hour >= 11 && hour <= 14) return 1.0; // Peak sun hours
    if (hour >= 9 && hour <= 16) return 0.8;
    return 0.3;
  }

  private getSeasonalMultiplier(): number {
    const month = new Date().getMonth();
    const seasonalFactors = [0.6, 0.7, 0.8, 0.9, 1.0, 1.0, 1.0, 0.95, 0.85, 0.75, 0.65, 0.55];
    return seasonalFactors[month];
  }

  private analyzeNetworkState(households: Household[], weather: WeatherCondition): NetworkState {
    const currentHour = new Date().getHours();
    const dayOfWeek = new Date().getDay();

    const householdsWithPredictions = households.map(household => {
      const predictedGeneration = this.predictEnergyGeneration(household, weather, currentHour);
      const predictedDemand = this.predictEnergyDemand(household, currentHour, dayOfWeek);
      const batteryLevel = household.batteryLevel || 0;
      const batteryCapacity = household.batteryCapacity || 0;
      
      return {
        ...household,
        predictedGeneration,
        predictedDemand,
        netBalance: predictedGeneration - predictedDemand,
        batteryLevel,
        batteryCapacity,
        canSupport: predictedGeneration > predictedDemand && batteryLevel > 0.2 * batteryCapacity,
        needsSupport: predictedGeneration < predictedDemand && batteryLevel < 0.8 * batteryCapacity
      };
    });

    return {
      households: householdsWithPredictions,
      totalGeneration: householdsWithPredictions.reduce((sum, h) => sum + h.predictedGeneration, 0),
      totalDemand: householdsWithPredictions.reduce((sum, h) => sum + h.predictedDemand, 0),
      weather,
      timestamp: new Date()
    };
  }

  private identifyTradingPairs(networkState: NetworkState): TradingPair[] {
    const suppliers = networkState.households.filter(h => h.canSupport);
    const demanders = networkState.households.filter(h => h.needsSupport);
    const pairs: TradingPair[] = [];

    // Smart matching algorithm considering distance and capacity
    demanders.forEach(demander => {
      const bestSupplier = suppliers
        .filter(s => s.netBalance > 0)
        .sort((a, b) => {
          const distanceA = this.calculateDistance(a.location || '', demander.location || '');
          const distanceB = this.calculateDistance(b.location || '', demander.location || '');
          return distanceA - distanceB; // Prefer closer suppliers
        })[0];

      if (bestSupplier) {
        const energyAmount = Math.min(
          Math.abs(demander.netBalance),
          bestSupplier.netBalance,
          2.0 // Max 2kWh per trade for stability
        );

        pairs.push({
          supplierId: bestSupplier.id,
          demanderId: demander.id,
          energyAmount,
          distance: this.calculateDistance(bestSupplier.location || '', demander.location || ''),
          priority: demander.criticalLoad ? 'high' : 'normal'
        });

        // Update balances for next iterations
        bestSupplier.netBalance -= energyAmount;
        demander.netBalance += energyAmount;
      }
    });

    return pairs;
  }

  private calculateOptimalPrices(pairs: TradingPair[], networkState: NetworkState): Map<number, number> {
    return this.priceModel.calculateOptimalPrices(pairs, networkState);
  }

  private optimizeBatteryStrategy(networkState: NetworkState): BatteryStrategy {
    const strategies: { [householdId: number]: string } = {};
    
    networkState.households.forEach(household => {
      const batteryRatio = household.batteryLevel / Math.max(household.batteryCapacity, 1);
      
      if (household.netBalance > 0) {
        // Surplus energy - charge battery or sell
        if (batteryRatio < 0.8) {
          strategies[household.id] = 'charge';
        } else {
          strategies[household.id] = 'sell';
        }
      } else {
        // Energy deficit - use battery or buy
        if (batteryRatio > 0.3) {
          strategies[household.id] = 'discharge';
        } else {
          strategies[household.id] = 'buy';
        }
      }
    });

    return { strategies };
  }

  private calculateGridStability(networkState: NetworkState): number {
    const totalBalance = networkState.totalGeneration - networkState.totalDemand;
    const balanceRatio = Math.abs(totalBalance) / networkState.totalDemand;
    
    // Stability score (0-1, higher is better)
    return Math.max(0, 1 - balanceRatio);
  }

  private generateRecommendations(networkState: NetworkState): string[] {
    const recommendations: string[] = [];
    const stabilityScore = this.calculateGridStability(networkState);

    if (stabilityScore < 0.7) {
      recommendations.push("Grid stability low - recommend immediate battery deployment");
    }

    if (networkState.totalGeneration < networkState.totalDemand * 0.8) {
      recommendations.push("Energy deficit detected - activate demand response programs");
    }

    const highDemandHouseholds = networkState.households.filter(h => h.needsSupport).length;
    if (highDemandHouseholds > networkState.households.length * 0.4) {
      recommendations.push("High network demand - consider temporary load shedding");
    }

    return recommendations;
  }

  private calculateDistance(loc1: string, loc2: string): number {
    // Simplified distance calculation - in real implementation would use GPS coordinates
    const hash1 = loc1.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const hash2 = loc2.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return Math.abs(hash1 - hash2) % 100; // Simulated km distance
  }

  private calculateSurvivingCapacity(affected: number[], total: Household[]): number {
    const surviving = total.filter(h => !affected.includes(h.id));
    return surviving.reduce((sum, h) => sum + (h.solarCapacity || 0), 0);
  }

  private calculateEmergencyRouting(affected: number[], survivingCapacity: number): EmergencyRouting {
    return {
      criticalLoadsFirst: true,
      maxDistanceKm: 10,
      emergencyReserveRatio: 0.2,
      availableCapacity: survivingCapacity * 0.8 // Reserve 20% for stability
    };
  }

  private generateRecoveryPlan(affected: number[], total: Household[]): RecoveryPlan {
    const criticalHouseholds = total.filter(h => 
      affected.includes(h.id) && h.criticalLoad
    );
    
    return {
      estimatedTime: affected.length * 0.5, // 30 min per household
      priorityHouseholds: criticalHouseholds.map(h => h.id),
      phaseApproach: 'critical-first'
    };
  }

  private calculateResilienceScore(allHouseholds: Household[], affectedCount: number): number {
    const networkSize = allHouseholds.length;
    const distributedGeneration = allHouseholds.filter(h => (h.solarCapacity || 0) > 0).length;
    const batteryBackup = allHouseholds.filter(h => (h.batteryCapacity || 0) > 0).length;
    
    const diversityScore = (distributedGeneration / networkSize) * 0.4;
    const backupScore = (batteryBackup / networkSize) * 0.3;
    const impactScore = (1 - (affectedCount / networkSize)) * 0.3;
    
    return diversityScore + backupScore + impactScore;
  }

  private getTimePattern(hour: number): number {
    // Demand patterns throughout the day
    const patterns = [0.3, 0.2, 0.2, 0.2, 0.3, 0.5, 0.8, 0.9, 0.7, 0.6, 0.6, 0.7, 0.8, 0.7, 0.6, 0.7, 0.9, 1.0, 1.0, 0.9, 0.8, 0.7, 0.5, 0.4];
    return patterns[hour] || 0.5;
  }

  private getDayPattern(dayOfWeek: number): number {
    // 0 = Sunday, 6 = Saturday
    const weekendPattern = [0.9, 1.0, 1.0, 1.0, 1.0, 1.0, 0.9];
    return weekendPattern[dayOfWeek];
  }

  private getHouseholdPattern(household: Household): number {
    // Adjust based on household characteristics
    let pattern = 1.0;
    if (household.criticalLoad) pattern *= 1.3;
    if ((household.batteryCapacity || 0) > 10) pattern *= 0.9; // Battery owners tend to optimize
    return pattern;
  }
}

class PriceOptimizer {
  calculateOptimalPrices(pairs: TradingPair[], networkState: NetworkState): Map<number, number> {
    const prices = new Map<number, number>();
    const basePrice = 0.12; // $0.12 per kWh base rate
    
    pairs.forEach(pair => {
      let price = basePrice;
      
      // Distance premium
      price += (pair.distance / 100) * 0.02;
      
      // Urgency premium
      if (pair.priority === 'high') {
        price += 0.03;
      }
      
      // Supply/demand adjustment
      const supplyDemandRatio = networkState.totalGeneration / networkState.totalDemand;
      if (supplyDemandRatio < 1) {
        price += (1 - supplyDemandRatio) * 0.05; // Scarcity premium
      } else {
        price -= Math.min((supplyDemandRatio - 1) * 0.03, 0.04); // Surplus discount
      }
      
      prices.set(pair.supplierId, Math.max(price, 0.08)); // Minimum price floor
    });
    
    return prices;
  }
}

// Type definitions
export interface WeatherCondition {
  condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'overcast' | 'rainy' | 'stormy';
  temperature: number;
  cloudCover: number;
  windSpeed: number;
}

export interface OptimizationResult {
  tradingPairs: TradingPair[];
  prices: Map<number, number>;
  batteryStrategy: BatteryStrategy;
  gridStability: number;
  recommendations: string[];
}

export interface TradingPair {
  supplierId: number;
  demanderId: number;
  energyAmount: number;
  distance: number;
  priority: 'high' | 'normal';
}

export interface NetworkState {
  households: (Household & {
    predictedGeneration: number;
    predictedDemand: number;
    netBalance: number;
    canSupport: boolean;
    needsSupport: boolean;
  })[];
  totalGeneration: number;
  totalDemand: number;
  weather: WeatherCondition;
  timestamp: Date;
}

export interface BatteryStrategy {
  strategies: { [householdId: number]: string };
}

export interface OutageResponse {
  survivingCapacity: number;
  emergencyRouting: EmergencyRouting;
  estimatedRecoveryTime: number;
  priorityAllocation: number[];
  communityResilience: number;
}

export interface EmergencyRouting {
  criticalLoadsFirst: boolean;
  maxDistanceKm: number;
  emergencyReserveRatio: number;
  availableCapacity: number;
}

export interface RecoveryPlan {
  estimatedTime: number;
  priorityHouseholds: number[];
  phaseApproach: string;
}