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
- **Smart Energy Flow**: ML models optimize solar, battery, and demand balance
- **Weather Adaptive**: Adjusts dynamically to cloudy/rainy conditions  
- **Decentralized Trading**: Households can sell surplus power
- **Resilient & Fair**: Equitable access to power during peak demand
- **AI-Powered Optimization**: Google Generative AI for energy advice and optimization
- **Real-time Monitoring**: Live tracking of energy generation, consumption, and battery levels

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
- 2025-08-28: Successfully migrated from Replit Agent to standard environment
- 2025-08-28: Transformed application from solar analysis to SolarSense energy trading platform
- 2025-08-28: Backend transformation completed - all API routes converted to energy trading
- 2025-08-28: Database schema updated for households, energy readings, and energy trades
- 2025-08-28: Storage interfaces fully migrated to support SolarSense functionality
- 2025-08-28: Migration process completed - all dependencies installed, application running successfully on port 5000
- 2025-08-28: SolarSense branding transformation completed - all SolarScope references updated
- 2025-08-28: Frontend pages updated with energy trading focus instead of solar panel analysis
- 2025-08-28: AI assistant messaging updated to focus on energy optimization and trading

## Security Notes
- Client/server separation implemented
- Secure session management with express-session
- Password hashing with bcryptjs
- CORS configuration in place