# Project Overview

This is a full-stack JavaScript application migrated from Replit Agent to standard Replit environment.

## Architecture
- **Frontend**: React with Vite, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js server with API routes
- **Database**: PostgreSQL with Drizzle ORM (fallback to memory storage)
- **Authentication**: Passport.js with local strategy
- **Storage**: Hybrid storage interface supporting both database and memory storage

## Key Features
- User authentication and sessions
- AI service integration (Google Generative AI)
- Calculation services
- API caching
- File upload support (multer)
- Real-time features (WebSocket)

## Current Status
- ✅ Dependencies installed and verified
- ✅ Application running successfully on port 5000
- ✅ Client/server separation properly implemented
- ✅ Security practices in place (authentication, sessions, CORS)
- ✅ Memory storage fallback working correctly
- ✅ LSP errors resolved
- ✅ Migration completed successfully

## Migration Progress
✅ **COMPLETED** - Successfully migrated from Replit Agent to standard Replit environment with full compatibility, security, and proper client/server separation.

## User Preferences
- None specified yet

## Recent Changes
- 2025-08-28: Initial migration started, dependencies verified, application running

## Security Notes
- Client/server separation implemented
- Secure session management with express-session
- Password hashing with bcryptjs
- CORS configuration in place