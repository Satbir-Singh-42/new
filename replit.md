# IPL Player Auction Dashboard

## Overview

This is a full-stack web application for managing and displaying IPL (Indian Premier League) 2025 player auction data. The application provides real-time visualization of player auction results, team statistics, and leaderboards through integration with Google Sheets as a data source. Built with modern web technologies, it features a responsive design optimized for auction viewing experiences.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Build Tool**: Vite for fast development builds and hot module replacement
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Tailwind CSS with shadcn/ui component library for consistent, accessible design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules for modern JavaScript features
- **Development**: TSX for TypeScript execution in development
- **API Structure**: REST endpoints with `/api` prefix for clear separation

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Development Storage**: In-memory storage implementation for rapid prototyping

### Real-time Data Integration
- **External Data Source**: Google Sheets integration for live auction data
- **Data Processing**: Papa Parse for CSV parsing from Google Sheets export URLs
- **Caching Strategy**: React Query with 30-second refresh intervals for near real-time updates
- **Data Models**: TypeScript interfaces for Player, Team, and TeamStats entities

### Authentication and Session Management
- **Session Store**: PostgreSQL-backed sessions using connect-pg-simple
- **User Schema**: Drizzle-defined user table with username/password authentication
- **Validation**: Zod schemas for input validation and type safety

### Styling and Design System
- **Base Framework**: Tailwind CSS with custom configuration
- **Component Library**: Radix UI primitives with shadcn/ui wrapper components
- **Theme**: Custom IPL-branded color palette with CSS variables
- **Typography**: Multiple Google Fonts including Work Sans, DM Sans, and Fira Code
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts

### Development and Deployment
- **Development Server**: Vite dev server with Express API integration
- **Build Process**: Vite for frontend build, esbuild for backend bundling
- **Code Quality**: TypeScript strict mode with comprehensive type checking

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form, TanStack Query
- **TypeScript Tooling**: TSX runtime, TypeScript compiler, type definitions
- **Build Tools**: Vite with React plugin, esbuild for production builds

### Database and ORM
- **Database**: Neon Database (PostgreSQL) via `@neondatabase/serverless`
- **ORM**: Drizzle ORM with PostgreSQL dialect and Zod integration
- **Migrations**: Drizzle Kit for schema management and migrations

### UI and Styling
- **Component Library**: Complete Radix UI component suite (40+ components)
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **Utilities**: clsx and tailwind-merge for conditional styling
- **Icons**: Lucide React for consistent iconography

### Data Processing
- **CSV Parsing**: Papa Parse for Google Sheets data processing
- **Date Handling**: date-fns for date manipulation and formatting
- **Validation**: Zod for runtime type checking and schema validation

### Development Tools
- **Error Handling**: Runtime error overlay for development debugging
- **Session Management**: connect-pg-simple for PostgreSQL session storage

### External Services Integration
- **Google Sheets**: Direct CSV export integration for real-time auction data
- **Font Services**: Google Fonts for typography (Work Sans, DM Sans, Fira Code)
- **Asset Management**: Static asset handling for team logos and branding

## Configuration Management

### Team Branding Configuration
Location: `client/src/config/teamBranding.ts`

Centralized configuration for team visual identity:
- **Team Logos**: Emoji or image URLs for each team
- **Border Colors**: Team-specific border colors for cards and UI elements
- **Background Gradients**: Custom gradient classes for team branding

To modify team branding, edit the `TEAM_BRANDING` object in this file.

### Tournament Rules Configuration
Location: `client/src/config/tournamentRules.ts`

Centralized configuration for tournament rules and limits:
- **MAX_SQUAD_SIZE**: Maximum players per team (default: 15)
- **MAX_FOREIGN_PLAYERS**: Maximum foreign players per team (default: 7)
- **TEAMS_QUALIFYING**: Number of teams that qualify (default: 8)

To modify these tournament rules, edit the `TOURNAMENT_CONFIG` object in this file. All changes will automatically apply across the entire application.

Note: Starting budget and minimum squad size for eligibility are managed through the Google Sheets data source.