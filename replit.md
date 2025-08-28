# Project Overview

**SolarSense: Intelligent Energy Solutions for a Sustainable Future**
*Decentralized. Resilient. Equitable.*

**Problem**: Energy grids are struggling with peak loads, unpredictable demand, and unequal access to power. Traditional systems fail during outages and extreme weather.

**Solution**: SolarSense is an AI-powered platform that connects households with solar panels into a decentralized energy trading network. It intelligently manages energy flow, prevents grid overload, and ensures fair distribution—keeping the lights on even in challenging conditions.

## Architecture
- **Frontend**: React with Vite, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js server with API routes
- **Database**: PostgreSQL with Drizzle ORM (fallback to memory storage)
- **Authentication**: Passport.js with local strategy
- **Storage**: Hybrid storage interface supporting both database and memory storage

## Key Features
### Machine Learning Engine
- **Predictive Energy Generation**: ML algorithms predict solar output based on weather patterns
- **Demand Forecasting**: Advanced algorithms predict energy demand using time-of-day and household patterns
- **Intelligent Trading**: Automated matching of energy suppliers and demanders based on proximity and capacity
- **Battery Optimization**: ML-driven charge/discharge strategies for maximum grid stability

### Live Demonstration Platform
- **Real-time Simulation**: Updates every 10 seconds with live energy trading operations
- **Weather Adaptation**: Interactive weather controls (sunny → cloudy → rainy → stormy) show immediate impact
- **Outage Simulation**: Power outage testing with automatic resilience scoring and recovery planning
- **ML Optimization Dashboard**: Real-time display of trading pairs, grid stability, and AI recommendations

### Advanced Analytics
- **Network Monitoring**: Real-time tracking of households, generation capacity, and storage utilization
- **Trading Analytics**: Energy trade volumes, pricing, and carbon savings tracking
- **Efficiency Metrics**: Network efficiency, average trade distance, and optimization performance
- **AI-Powered Chat**: Google Generative AI assistant for energy optimization advice

## Current Status
- ✅ Dependencies installed and verified
- ✅ Application running successfully on port 5000
- ✅ Client/server separation properly implemented
- ✅ Security practices in place (authentication, sessions, CORS)
- ✅ Memory storage fallback working correctly
- ✅ LSP errors significantly reduced
- ✅ Migration completed successfully
- ✅ Backend transformation to SolarSense energy trading completed
- ✅ Database schema updated for energy trading platform
- ✅ New API endpoints for households, energy readings, and energy trades

## Migration Progress
✅ **COMPLETED** - Successfully migrated from Replit Agent to standard Replit environment with full compatibility, security, and proper client/server separation.

## User Preferences  
- Keep existing design and frontend theme
- Successfully transformed to SolarSense energy trading platform functionality
- All SolarScope references cleaned up and updated to SolarSense branding

## Recent Changes
- 2025-08-28: **MAJOR MILESTONE** - Complete ML-powered energy trading platform developed
- 2025-08-28: Built comprehensive ML Engine (`server/ml-engine.ts`) with predictive energy optimization
- 2025-08-28: Created real-time Simulation Engine (`server/simulation-engine.ts`) for live demonstrations
- 2025-08-28: Added 163 lines of ML simulation API routes supporting weather changes and outage simulation
- 2025-08-28: Developed interactive Simulation Dashboard with real-time controls and analytics
- 2025-08-28: Successfully implemented weather adaptation algorithms (sunny, cloudy, rainy, stormy conditions)
- 2025-08-28: Built power outage simulation and recovery system with community resilience scoring
- 2025-08-28: Created ML-powered energy optimization with trading pair matching and pricing algorithms
- 2025-08-28: Integrated real-time network analytics showing efficiency metrics and carbon savings
- 2025-08-28: Platform now supports live demonstration capabilities updating every 10 seconds

## Security Notes
- Client/server separation implemented
- Secure session management with express-session
- Password hashing with bcryptjs
- CORS configuration in place