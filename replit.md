# replit.md

## Overview

Face2Finance is a comprehensive financial literacy education platform built as a full-stack web application. The application combines interactive learning modules, financial calculators, progress tracking, and gamification to provide users with an engaging financial education experience. The platform features JWT-based user authentication, responsive mobile-first design, and a robust backend API for data management.

## Recent Changes (July 18, 2025)

✅ **MOBILE NAVIGATION OPTIMIZATION COMPLETED**: Standardized navigation throughout app
- **Mobile Header Standardization**: All 23 pages now use consistent MobileHeader component
- **Back Button Fixes**: Removed duplicate back buttons and ensured proper navigation flow
- **Navigation Consistency**: Standardized mobile headers across all screens (transactions, tasks, profile, games)
- **UI Cleanup**: Removed redundant navigation elements and improved mobile user experience
- **Button Functionality**: All buttons now properly navigate and function correctly
- **Cross-Screen Navigation**: Ensured proper flow between all pages with consistent back button behavior

✅ **DEMO LOGIN BUTTON ADDED**: Added convenient demo access to login page
- **Demo Button**: Added "TRY DEMO" button on login page for quick app access
- **Demo Account**: Automatically creates demo user (demo@face2finance.com) if doesn't exist
- **Auto-Login**: Seamlessly logs in with demo credentials for instant app testing
- **User Experience**: Improved onboarding for new users and evaluators

✅ **REPLIT MIGRATION COMPLETED**: Successfully migrated from Replit Agent to standard Replit environment
- **Package Installation**: All required dependencies properly installed and configured
- **Workflow Setup**: Express server and Vite development server running seamlessly
- **Database Integration**: MongoDB in-memory server operational with proper data seeding
- **Schema Validation**: Fixed age group validation issues in onboarding flow
- **Onboarding Flow**: Updated to redirect to dashboard (home page) after completion
- **Migration Status**: Project fully operational in standard Replit environment

✅ **FRONTEND-BACKEND CONNECTIVITY VERIFIED**: Comprehensive full-stack integration confirmed
- **Database Integration**: MongoDB in-memory server with all collections working properly
- **API Endpoints**: All 23 frontend pages successfully connected to backend routes
- **Authentication Flow**: JWT-based auth system with token management fully operational
- **Data Retrieval**: Learning modules, quizzes, tasks, and user data flowing correctly
- **Query System**: React Query managing API states and caching effectively
- **Multi-language**: All translation strings properly integrated across components

✅ **UI/UX IMPROVEMENTS AND FEATURES ADDED**: Major interface updates completed
- **Games Section**: Replaced transactions with interactive games section featuring financial literacy games
- **AI Assistant Widget**: Moved AI assistant from dashboard to floating bottom-right widget for better UX
- **Settings Page**: Created comprehensive settings page with account, preferences, and support sections
- **Navigation Update**: Updated bottom navigation to include Games instead of Transactions
- **Language Integration**: Fixed dashboard categories to properly use translation strings
- **Profile Enhancement**: Added settings link in profile page for easy access
- **Onboarding UI Enhancement**: Improved all onboarding pages with modern gradient backgrounds, card-based layouts, icons, and better visual hierarchy
- **404 Route Fix**: Fixed routing issues for onboarding pages and ensured all pages are properly registered

✅ **PROJECT MIGRATION TO REPLIT COMPLETED**: Successfully migrated from Replit Agent to standard Replit environment
✅ **LANGUAGE FUNCTIONALITY FIXED**: Enhanced language selection system to ensure all components immediately switch to selected language
- **Authentication System**: Fixed JWT cookie-based authentication with proper token handling
- **Cookie Middleware**: Added cookie-parser to enable secure authentication cookies
- **User Registration**: Enhanced signup process with comprehensive user details (email, name, phone, password)
- **Database Management**: Added user data clearing functionality for development workflow
- **Full User Flow**: Complete signup → onboarding → dashboard experience working
- **API Security**: Proper Authorization header and cookie-based token authentication
- **Development Tools**: Clear endpoint for resetting user data during development
- **Migration Status**: Project fully operational in Replit environment with no authentication issues

✅ **MULTI-LANGUAGE SUPPORT AND PROJECT CLEANUP COMPLETED**: Added comprehensive i18n and cleaned codebase
- **Multi-Language Support**: Implemented full internationalization for Hindi, English, and Punjabi
- **Language System**: Created comprehensive translation system with 50+ UI strings
- **Language Components**: Built language selector and provider for seamless language switching
- **Language Integration**: Updated all major components (dashboard, navigation, onboarding) with translations
- **Persistent Language**: Language preference saved in localStorage and maintained across sessions
- **File Cleanup**: Removed all unused files (postgresql-storage.ts, cookie files, test files)
- **Translation Coverage**: Navigation, dashboard, auth, onboarding, calculators, tasks, transactions, AI chat
- **Application Status**: Full multi-language support operational with clean codebase

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a modern React-based frontend with the following key technologies:
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for lightweight client-side routing
- **Tailwind CSS** with custom CSS variables for responsive, mobile-first styling
- **shadcn/ui** component library for consistent, accessible UI components
- **TanStack Query** for server state management and API caching

The frontend follows a mobile-first design approach with a component-based architecture. Key UI patterns include bottom navigation for mobile users, responsive grid layouts, and progressive web app characteristics.

### Backend Architecture
The backend is built using Node.js with Express.js and follows RESTful API principles:
- **Express.js** server with TypeScript for type safety
- **JWT-based authentication** with bcrypt password hashing
- **Session management** using memory store for development
- **Middleware-based architecture** for request logging, error handling, and authentication
- **Modular route organization** with separate route handlers for different feature areas
- **Database abstraction layer** through a storage interface pattern

### Data Storage Solutions
The application uses MongoDB as the primary database with Mongoose ODM for data modeling:
- **MongoDB** with in-memory server for development (mongodb-memory-server)
- **Mongoose ODM** for schema validation and document modeling
- **Type-safe schema definitions** shared between frontend and backend
- **Flexible document structure** for complex data types
- **Automatic date handling** in API validation schemas

### Authentication and Authorization
User authentication is handled through a standard JWT-based system:
- **JWT tokens** for stateless authentication with 7-day expiration
- **bcrypt** for secure password hashing
- **Session storage** using memory-based store for development
- **Standard login/register/logout** endpoints
- **Middleware-based authentication** for protected routes

## Key Components

### Learning System
- **Modular learning content** organized by financial topics (budgeting, savings, fraud prevention)
- **Progress tracking** with completion percentages and user achievements
- **Interactive quizzes** with multiple-choice questions and scoring
- **Personalized learning paths** based on user's knowledge level and goals
- **AI-powered financial assistant** providing personalized advice and guidance

### Financial Tools
- **Budget calculator** for expense planning and tracking
- **Tax estimator** for income tax calculations
- **EMI calculator** for loan payment calculations
- **Investment calculator** for ROI and compound interest projections
- **Calculator history** for saving and reviewing past calculations

### User Management
- **Onboarding flow** for new users (language selection, knowledge assessment, goal setting)
- **User profiles** with customizable preferences and progress tracking
- **Notification system** for learning reminders and achievements
- **Task management** for financial goals and action items

### Responsive UI Components
- **Mobile-first design** optimized for smartphones and tablets
- **Bottom navigation** for easy mobile navigation
- **Progressive web app** characteristics for offline functionality
- **Accessibility features** through shadcn/ui components

## Data Flow

### User Authentication Flow
1. User accesses the application
2. Replit Auth middleware checks for valid session
3. If unauthenticated, redirects to Replit's OIDC provider
4. Upon successful authentication, creates/updates user record
5. Establishes authenticated session for subsequent requests

### Learning Progress Flow
1. User selects learning module or quiz
2. Frontend fetches content from backend API
3. User interactions are tracked and stored in database
4. Progress updates are reflected in user's dashboard
5. Achievements and notifications are triggered based on milestones

### Calculator Workflow
1. User inputs financial data into calculator forms
2. Frontend performs real-time calculations using validation schemas
3. Results are displayed with visual breakdowns
4. Optional saving to calculator history via backend API
5. Historical data can be retrieved for comparison and analysis

## External Dependencies

### Third-Party Services
- **MongoDB** for document-based data storage
- **OpenAI GPT-4o** for AI-powered financial advice and chat functionality
- **Standard authentication** using JWT tokens
- **Replit Infrastructure** for application hosting and deployment

### Multi-Language Support
- **Internationalization (i18n)** for Hindi, English, and Punjabi languages
- **Language Provider** for React context-based language management
- **Persistent Language Settings** using localStorage
- **Comprehensive Translation Coverage** for all UI elements

### NPM Dependencies
- **mongoose** for MongoDB object modeling
- **mongodb-memory-server** for in-memory development database
- **openai** for AI-powered financial advice and chat functionality
- **@radix-ui** component primitives for accessible UI
- **@tanstack/react-query** for server state management
- **zod** for runtime type validation and schema parsing
- **bcryptjs** for password hashing
- **jsonwebtoken** for JWT authentication
- **express-session** and **memorystore** for session management

### Development Tools
- **TypeScript** for static type checking
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **ESBuild** for backend bundling in production

## Deployment Strategy

### Development Environment
- **Vite development server** with hot module replacement
- **Express server** running in development mode with request logging
- **In-memory MongoDB** for development database
- **Environment variables** for database connections and authentication secrets

### Production Deployment
- **Vite build process** generates optimized static assets
- **ESBuild bundling** creates single Node.js bundle for backend
- **Static file serving** through Express for frontend assets
- **Session storage** using memory store for development
- **Environment-based configuration** for database URLs and authentication

### Build Process
The application uses a two-stage build process:
1. **Frontend build**: Vite compiles React/TypeScript to optimized static assets
2. **Backend build**: ESBuild bundles Express server with external dependencies
3. **Combined deployment**: Single Node.js process serves both API and static files

The deployment strategy prioritizes simplicity and performance, with the entire application running as a single process suitable for Replit's hosting environment.