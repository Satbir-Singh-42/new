# 🏏 IPL 2025 Player Auction Dashboard

A modern, real-time web application for tracking and visualizing IPL (Indian Premier League) 2025 player auction data. Built with cutting-edge web technologies, it provides live auction results, team statistics, and comprehensive player information through direct Google Sheets integration.

![IPL Auction Dashboard](attached_assets/1920w%20light_1758935519817.png)

## ✨ Features

### 🎯 Core Functionality

- **Real-time Auction Data** - Live integration with Google Sheets for up-to-the-minute auction results
- **Team Overview** - Comprehensive team cards showing funds, players, and statistics in ranking order
- **Player Management** - Detailed views for sold and unsold players with advanced filtering
- **Live Leaderboard** - Dynamic team rankings based on points, budget, and performance
- **Responsive Design** - Optimized for desktop, tablet, and mobile viewing

### 🚀 Technical Features

- **Direct Data Fetching** - No backend database required - fetches data directly from Google Sheets
- **Smart Caching** - 30-second refresh intervals with intelligent client-side caching
- **Type-Safe** - Full TypeScript implementation with runtime validation
- **Modern UI** - Beautiful interface built with Tailwind CSS and shadcn/ui
- **Real-time Updates** - Background data synchronization every 30 seconds

## 🛠️ Technology Stack

### Frontend

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with strict mode
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with custom IPL theming
- **shadcn/ui** - High-quality accessible component library built on Radix UI
- **TanStack Query** - Powerful data synchronization and caching
- **Wouter** - Lightweight client-side routing
- **Framer Motion** - Smooth animations and transitions

### Data Management

- **Google Sheets Integration** - Primary data source for real-time auction information
- **Papa Parse** - Efficient CSV parsing for Google Sheets data
- **TanStack Query Caching** - Advanced client-side data caching and synchronization

### Development & Deployment

- **Node.js + Express** - Development server with static file serving for production
- **TSX** - Fast TypeScript execution for development
- **ESBuild** - Fast JavaScript bundler for production builds

## 📊 Data Sources

The application integrates with Google Sheets containing:

- **Teams & Budget Sheet** - Team information, budgets, and spending
- **Players Catalogue** - Complete player database with details
- **Auctioneer Sheet** - Live auction results and player status

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm package manager
- Google Sheets with publicly accessible data (CSV export enabled)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd ipl-auction-dashboard
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Open your browser**
   Navigate to `http://localhost:5000`

## 🌐 Deployment

### Deploy to Vercel (Recommended - Static Site)

The application is optimized for static deployment on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

**Manual Deployment:**

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

**Vercel Configuration:**

- ✅ Automatically configured via `vercel.json`
- ✅ Static site generation with SPA routing
- ✅ No server-side requirements

### Deploy to Render (Node.js Server)

For traditional Node.js hosting:

**Build Command:**

```bash
npm install; npm run build
```

**Start Command:**

```bash
node start-production.js
```

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   ├── pages/          # Page components and sections
│   │   ├── services/       # Google Sheets integration
│   │   └── assets/         # Static assets and configurations
│   ├── public/             # Public static files and team images
│   └── index.html          # HTML entry point
├── server/                 # Development server and production setup
│   ├── index.ts            # Express server for development/production
│   ├── routes.ts           # API route definitions (currently minimal)
│   ├── storage.ts          # Storage interface (for future expansion)
│   └── vite.ts             # Vite integration and static file serving
├── shared/                 # Shared TypeScript types and schemas
│   └── schema.ts           # Data schemas and validation
├── start-production.js     # Production server launcher
├── vercel.json            # Vercel deployment configuration
├── package.json           # Project dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── tailwind.config.ts     # Tailwind CSS configuration
```

## 🎮 Usage

### Navigation

- **Overview** - Team cards sorted by current ranking
- **Sold Players** - All purchased players with team filtering
- **Unsold Players** - Available players still in the auction pool
- **Leaderboard** - Complete team rankings with detailed statistics

### Features in Detail

#### Team Overview

- Teams automatically sorted by total points (highest first)
- Real-time budget tracking and remaining funds
- Player count including overseas player limits
- Click any team card to view detailed team information

#### Player Tables

- Advanced sorting by multiple criteria
- Team-based filtering for sold players
- Real-time status updates from Google Sheets
- Comprehensive player statistics and information

#### Leaderboard

- Multi-level ranking system:
  1. Total Team Points (primary)
  2. Funds Remaining (secondary)
  3. Team Name (tertiary)
- Interactive sorting by any column
- Real-time updates every 30 seconds

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run check        # Run TypeScript type checking

# Production
npm run build        # Build for production (frontend + backend)
npm run start        # Start production server

# Code Quality
npm run check        # TypeScript type checking
```

### Development Workflow

1. **Start the development server**

```bash
npm run dev
```

2. **Make your changes** - The app will automatically reload

3. **Run type checking**

```bash
npm run check
```

4. **Build for production**

```bash
npm run build
```

### Code Style Guidelines

- **TypeScript** - Strict mode with comprehensive type safety
- **Component Structure** - React functional components with hooks
- **Styling** - Tailwind CSS with shadcn/ui components
- **State Management** - TanStack Query for server state
- **Data Fetching** - Direct Google Sheets integration via frontend services

## 🔍 Troubleshooting

### Common Issues

#### 1. Google Sheets Data Loading Issues

```
Failed to load resource: the server responded with a status of 400
```

**Solution**:

- Verify Google Sheets are publicly accessible
- Check CSV export URLs are valid
- Ensure sheet permissions allow public access

#### 2. Build Failures

```
Type error: Cannot find module '@/components/ui/...'
```

**Solution**: Check that all shadcn/ui components are properly installed and paths are correct.

#### 3. Google Sheets Integration Issues

- Ensure sheets have proper column headers matching expected format
- Check that team names and player data are consistent
- Verify sheet permissions allow public CSV export

#### 4. Deployment Issues

- **Vercel**: Verify `vercel.json` configuration and build output
- **Render**: Check environment variables and start command

### Performance Optimization

- **Caching**: Data cached client-side with 30-second refresh intervals
- **Bundle Splitting**: Automatic code splitting for optimal loading
- **Image Optimization**: Optimized team logos and background images
- **Google Sheets Optimization**: Efficient sheet structures and minimal API calls

## 🔧 Environment Variables

### Development

No environment variables required for basic functionality.

### Production (Optional)

```env
# Only needed for custom configurations
NODE_ENV=production
PORT=5000  # Default port (auto-detected)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏏 About IPL 2025

The Indian Premier League (IPL) 2025 promises to be the most exciting season yet. This dashboard provides real-time insights into the player auction process, helping fans, analysts, and team management track the dynamic world of cricket's premier T20 league.

## 🚀 Live Demo

- **Production**: Deploy to Vercel for optimal performance
- **Self-hosted**: Deploy to Render or any Node.js hosting platform

---

**Built with ❤️ for cricket fans worldwide**

For support or questions, please open an issue on GitHub.
