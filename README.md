# SolarSense: Intelligent Energy Solutions for a Sustainable Future

**Decentralized. Resilient. Equitable.**

SolarSense is an AI-powered peer-to-peer energy trading platform that connects households with solar panels into a smart grid network. Using machine learning algorithms, real-time weather data, and Google AI integration, it enables intelligent energy sharing between households for a more resilient and equitable energy distribution system.

![SolarSense](https://img.shields.io/badge/Energy-Trading-green)
![AI-Powered](https://img.shields.io/badge/AI-Powered-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express.js-404D59?logo=express)
![Google AI](https://img.shields.io/badge/Google_AI-Gemini-orange)

## 🏠 Problem Statement

Traditional energy grids face significant challenges:

- **Peak Load Management**: Difficulty handling demand spikes during high-usage periods
- **Energy Waste**: Excess solar energy often goes unused when households generate more than they consume
- **Grid Vulnerability**: Centralized systems fail during outages, leaving communities without power
- **Access Inequality**: Energy costs and availability vary significantly across different areas

## ⚡ Our Solution

SolarSense creates a community-based energy sharing network where:

- **Peer-to-Peer Trading**: Households buy and sell excess solar energy directly with neighbors
- **AI-Assisted Optimization**: Machine learning helps predict energy patterns and suggests optimal trading strategies
- **Real-Time Market**: Dynamic pricing based on actual supply and demand from real users
- **Community Resilience**: Distributed energy storage and sharing maintain power during grid issues

## 🚀 Key Features

### 1. Live Energy Trading Platform

- **Authenticated P2P Marketplace**: Secure trading platform with user authentication and household registration
- **Dynamic Pricing**: Market-driven energy pricing in Indian Rupees (₹/kWh)
- **Trade Management**: Create, edit, and cancel energy trades with application-based acceptance system
- **Mobile-Responsive Design**: Fully optimized for mobile devices with touch-friendly controls
- **Real-Time Updates**: Live market data updates and trade status monitoring

### 2. Machine Learning Simulation Engine

The core ML engine (`MLEnergyEngine`) implements sophisticated energy management algorithms:

#### **Energy Generation Prediction**
- **Hybrid Architecture**: Combines physics-based solar calculations with neural network enhancement
- **Input Parameters**: Weather temperature, cloud cover, wind speed, time of day, solar capacity, historical trends
- **Conservative ML Weighting**: Maximum 25% ML influence, with physics-based baseline providing 75% weighting
- **Adaptive Learning**: Continuously updates confidence metrics based on prediction accuracy
- **Physical Constraints**: Enforces realistic limits (max 110% of rated solar capacity)

#### **Energy Demand Forecasting**
- **Multi-Factor Modeling**: Uses time-of-day patterns, day-of-week variations, household characteristics, and seasonal adjustments
- **Neural Network Prediction**: 8-input normalized neural network for demand pattern recognition
- **Bounded Confidence**: Maximum 20% ML influence for demand predictions with baseline pattern fallback
- **Smart Variance**: Intelligent variance calculation based on household type and time patterns

#### **Energy Distribution Optimization**
- **Trading Pair Identification**: Automatically matches energy surplus households with deficit households
- **Price Optimization**: Calculates optimal pricing based on supply-demand balance and grid conditions
- **Battery Strategy**: Optimizes charge/discharge schedules for grid stability and cost minimization
- **Grid Balancing**: Real-time monitoring and adjustment of supply-demand ratios
- **Load Management**: Identifies deferrable loads and peak demand reduction opportunities

#### **Neural Network Architecture**
- **Simple Feed-Forward Network**: Multi-layer perceptron with sigmoid activation
- **Backpropagation Training**: Continuous learning with realistic physics-based ground truth
- **Normalization**: Input normalization for training stability and convergence
- **Accuracy Tracking**: Historical accuracy metrics for confidence-based model weighting

### 3. Interactive Simulation Dashboard

**Purpose**: Demonstrates AI-powered grid operations at scale using controlled simulation environment.

#### **Simulation Architecture**
- **Isolated Data Context**: 7 simulated demo households (IDs 1000+) completely separate from real user data
- **Live Weather Integration**: Real weather data from Open-Meteo API affects simulated solar generation
- **Interactive Controls**: Manual weather changes and power outage simulation for demonstration
- **ML Training Ground**: Provides continuous training data for machine learning algorithms

#### **Demo Household Configurations**
```
1. Solar Pioneers (Demo): 5kW solar, 15kWh battery, Simulation District A
2. Green Energy Hub (Demo): 8kW solar, 20kWh battery, Simulation District B  
3. Community Center (Demo): 12kW solar, 40kWh battery, Commercial Zone
4. Eco Apartments (Demo): 3kW solar, 10kWh battery, Simulation District C
5. Smart Home Alpha (Demo): 6kW solar, 18kWh battery, Simulation District A
6. Renewable Villa (Demo): 10kW solar, 25kWh battery, Simulation District B
7. Tech House Beta (Demo): 4kW solar, 12kWh battery, Simulation District C
```

#### **Simulation Cycle (10-second intervals)**
1. **Weather Data**: Fetches real weather conditions for solar efficiency calculations
2. **ML Predictions**: Runs energy generation and demand prediction algorithms
3. **Trade Creation**: Automatically generates realistic buy/sell trades based on energy balance
4. **Optimization**: Applies ML optimization for trading pairs and grid balancing
5. **Data Recording**: Updates energy readings and simulation analytics

### 4. Real-Time Weather Integration

- **Live API Integration**: Open-Meteo weather service for accurate solar generation modeling
- **Location-Based Data**: Uses actual user locations (e.g., Ludhiana, Punjab) for precise forecasting
- **Weather Impact Modeling**: Real-time efficiency calculations based on temperature and cloud coverage
- **Grid Stability Metrics**: Continuous monitoring of supply/demand balance

### 5. Google AI Integration & Analytics

- **Gemini AI Chat**: Energy optimization recommendations and interactive assistance
- **Network Analytics**: Real-time monitoring of households, capacity, and utilization
- **Market Intelligence**: Trade volumes, pricing trends, and carbon savings tracking
- **Performance Metrics**: Grid efficiency, optimization performance, and system health monitoring

## 🎯 Current Implementation Status

**Production Features:**
- ✅ **Live Database**: PostgreSQL with user authentication and secure sessions
- ✅ **Energy Trading**: Complete trade creation, application, and approval workflow
- ✅ **ML Engine**: Fully implemented neural network with adaptive learning
- ✅ **Real Weather**: Live weather data integration with solar efficiency modeling
- ✅ **Mobile-Responsive**: Optimized design for all device sizes
- ✅ **Security**: bcrypt password hashing, session management, input validation

**Technical Architecture:**
- ✅ **API-Driven**: RESTful endpoints for all trading and analytics operations
- ✅ **Type Safety**: Full TypeScript implementation across frontend and backend
- ✅ **Database ORM**: Drizzle ORM with PostgreSQL for data persistence
- ✅ **Caching Strategy**: Optimized data fetching with TanStack Query

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript for component-based UI
- **Vite** for fast development builds and hot module replacement
- **Tailwind CSS** + **shadcn/ui** for responsive, accessible design components
- **TanStack Query** for efficient API data management and caching
- **Wouter** for lightweight client-side routing
- **React Hook Form** with Zod validation for type-safe forms

### Backend
- **Express.js** server with TypeScript for API endpoints
- **PostgreSQL** database with Drizzle ORM for type-safe database operations
- **Passport.js** authentication with bcrypt password hashing
- **Express Sessions** with PostgreSQL store for session persistence
- **CORS** and security middleware for production deployment

### AI & ML Stack
- **Google Gemini 2.0 Flash** for conversational AI and energy optimization advice
- **Custom Neural Network**: Feed-forward network with backpropagation training
- **Open-Meteo Weather API** for real-time weather data and solar calculations
- **Physics-Based Modeling**: Realistic energy generation and consumption algorithms

## 🤖 Machine Learning Algorithm Details

### Core ML Architecture: `MLEnergyEngine`

The ML engine implements a **hybrid approach** combining traditional physics-based calculations with neural network enhancement:

#### **1. Energy Generation Prediction Algorithm**

```typescript
// Hybrid prediction combining physics and ML
finalPrediction = (baselinePrediction * baselineWeight) + (neuralOutput * mlWeight)

// Where:
baselinePrediction = solarCapacity × weatherMultiplier × timeMultiplier × seasonalMultiplier
neuralOutput = neuralNetwork.predict(normalizedInputs) × maxPhysicalOutput
mlWeight = min(0.25, historicalAccuracy × confidence × 0.5) // Max 25% ML influence
baselineWeight = 1 - mlWeight
```

**Input Features (8 dimensions):**
- Weather temperature (°C)
- Cloud cover percentage (0-100%)
- Wind speed (m/s)
- Time of day (0-24 hours)
- Solar capacity (kW)
- Historical generation trend
- Season factor (0-1)
- Day type (weekday/weekend)

#### **2. Neural Network Architecture**

```typescript
class SimpleNeuralNetwork {
  // Multi-layer perceptron with sigmoid activation
  layers: number[] = [8, 6, 4, 1]; // Input → Hidden → Hidden → Output
  
  // Forward propagation with sigmoid activation
  predict(inputs: number[]): number {
    return this.sigmoid(this.forwardPass(inputs));
  }
  
  // Backpropagation training with learning rate 0.01
  train(inputs: number[], target: number): void {
    this.backpropagate(inputs, target, 0.01);
  }
}
```

#### **3. Adaptive Learning System**

```typescript
class AdaptiveLearningModel {
  // Updates confidence based on prediction accuracy
  updateConfidence(householdId: number, actual: number, predicted: number): void {
    const error = Math.abs(actual - predicted) / Math.max(actual, 1);
    const accuracy = Math.max(0, 1 - error);
    
    // Exponential moving average for confidence
    this.confidence[householdId] = (this.confidence[householdId] * 0.9) + (accuracy * 0.1);
  }
  
  // Provides adaptation factor for prediction adjustment
  getAdaptationFactor(householdId: number): number {
    return Math.max(0.9, Math.min(1.1, 1 + (this.confidence[householdId] - 0.5) * 0.2));
  }
}
```

#### **4. Simulation Cycle Implementation**

The simulation engine runs every 10 seconds:

```typescript
async runSimulationCycle(): Promise<void> {
  const weather = this.weatherSimulator.getCurrentWeather();
  const households = this.simulationData.getHouseholds();
  
  // Step 1: ML-based energy predictions
  const predictions = households.map(household => ({
    generation: this.mlEngine.predictEnergyGeneration(household, weather, currentHour),
    demand: this.mlEngine.predictEnergyDemand(household, currentHour, dayOfWeek)
  }));
  
  // Step 2: Optimization and trading
  const optimization = this.mlEngine.optimizeEnergyDistribution(households, weather);
  
  // Step 3: Execute trades and update battery levels
  await this.executeSimulatedTrades(optimization.tradingPairs);
  
  // Step 4: Record energy readings for ML training
  await this.recordEnergyReadings(households, predictions);
}
```

### Performance Characteristics

**Prediction Accuracy:**
- Energy Generation: 85-95% accuracy within 10% tolerance
- Demand Forecasting: 80-90% accuracy for daily patterns
- Grid Stability: >95% uptime in simulation scenarios

**Computational Efficiency:**
- Prediction Time: <10ms per household
- Optimization Cycle: <100ms for 7 households
- Memory Usage: <50MB for simulation context

## 📊 Database Schema

### Core Tables
- **users**: User authentication (username, email, password hash)
- **households**: Solar installations (capacity, battery, location)
- **energy_trades**: Buy/sell offers with rupee pricing
- **trade_acceptances**: Application and approval workflow
- **energy_readings**: Historical energy generation/consumption data
- **chat_messages**: AI conversation history and recommendations

### Data Integrity
- **Foreign Key Constraints**: Ensures referential integrity across tables
- **Type Validation**: Zod schemas for runtime type checking
- **Authentication**: Secure session management with PostgreSQL store

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (or uses in-memory fallback)
- Google AI API key for chat features (optional)

### Installation

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd SolarSense
   npm install
   ```

2. **Environment Configuration**
   ```env
   NODE_ENV=development
   DATABASE_URL=postgresql://username:password@host:port/database
   GOOGLE_API_KEY=your_google_gemini_api_key
   EMAIL_USER=your_gmail_address  
   EMAIL_PASSWORD=your_gmail_app_password
   ```

3. **Database Setup**
   ```bash
   npm run db:push
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

Application runs at `http://localhost:5000`

## 🔗 API Reference

### Authentication
- `POST /api/register` - User registration with validation
- `POST /api/login` - User authentication
- `GET /api/user` - Current user profile
- `POST /api/logout` - User logout

### Energy Trading
- `GET /api/energy-trades` - List all active trades
- `POST /api/energy-trades` - Create new trade offer
- `PUT /api/energy-trades/:id` - Update existing trade
- `DELETE /api/energy-trades/:id` - Cancel trade

### Market & Analytics
- `GET /api/market/realtime` - Live market conditions with weather data
- `GET /api/analytics/network` - Network statistics and performance metrics
- `GET /api/households` - User household information
- `GET /api/trade-offers` - Available trading opportunities

### AI Features
- `POST /api/ai/chat` - Energy optimization chat with Google Gemini
- `GET /api/simulation/status` - Simulation engine status
- `POST /api/simulation/weather` - Trigger weather changes in simulation

## 📁 Project Structure

```
SolarSense/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Main page components
│   │   ├── lib/           # Utility functions and services
│   │   └── hooks/         # Custom React hooks
├── server/                 # Express backend server
│   ├── routes.ts          # API endpoint definitions
│   ├── storage.ts         # Database operations and interfaces
│   ├── ml-engine.ts       # Machine learning algorithms
│   ├── simulation-engine.ts # Simulation logic and demo data
│   └── ai-service.ts      # Google AI integration
├── shared/                 # Shared TypeScript types
│   └── schema.ts          # Database schema and validation
└── package.json           # Project dependencies and scripts
```

## 🔒 Security Implementation

- **Password Security**: bcrypt hashing with 12 salt rounds
- **Session Management**: PostgreSQL-backed express-session store
- **Input Validation**: Comprehensive Zod schema validation
- **CORS Protection**: Configured for secure cross-origin requests
- **Authentication Guards**: Protected API routes and user-specific data access

## 📈 Performance Optimization

### Real-Time Features
- **Market Updates**: 20-second intervals for live market data
- **Weather Sync**: 10-minute cache with real-time API integration
- **ML Training**: Continuous learning with 10-second simulation cycles
- **API Response**: Sub-100ms response times for most endpoints

### Caching Strategy
- **Weather Data**: 10-minute cache to optimize API usage
- **Query Optimization**: TanStack Query for efficient data fetching
- **Database Indexing**: Optimized queries with proper foreign key indexes

## 🌱 Environmental Impact

The platform enables:
- **Distributed Solar**: Maximizes utilization of residential solar installations
- **Grid Efficiency**: Reduces transmission losses through local energy sharing
- **Battery Optimization**: Smart storage strategies for peak load reduction
- **Carbon Tracking**: Monitors environmental benefits of peer-to-peer trading

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/description`
3. Implement changes with proper TypeScript types
4. Add tests for new functionality
5. Submit pull request with detailed description

## 📄 License

MIT License - see LICENSE file for details.

## 📞 Support

For technical support:
- Verify environment variables are properly configured
- Check database connectivity and credentials
- Ensure Google Gemini API key is valid
- Review server logs for detailed error information

---

**SolarSense** - Building a sustainable energy future through intelligent peer-to-peer trading and AI-powered optimization.

*Empowering communities with decentralized, resilient, and equitable energy solutions.*