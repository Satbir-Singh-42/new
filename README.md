# 🏏 IPL 2025 Player Auction Dashboard

A modern, real-time web application for tracking and visualizing IPL (Indian Premier League) 2025 player auction data. Built with cutting-edge web technologies, it provides live auction results, team statistics, and comprehensive player information through direct Google Sheets integration.


## ✨ Features

### 🎯 Core Functionality

- **Real-time Auction Data** - Live integration with Google Sheets for up-to-the-minute auction results
- **Team Overview** - Comprehensive team cards showing funds, players, and statistics in ranking order
- **Player Management** - Detailed views for sold and unsold players with advanced filtering
- **Live Leaderboard** - Dynamic team rankings with circular rank indicators based on points, budget, and performance
- **Foreign Players Tracking** - Dedicated column showing overseas player count for each team
- **Responsive Design** - Optimized for desktop, tablet, and mobile viewing
- **Custom Branding** - ISTE logo favicon and IPL-themed design

### 🚀 Technical Features

- **Direct Data Fetching** - No backend database required - fetches data directly from Google Sheets
- **Smart Caching** - 60-second client-side cache with automatic refresh intervals
- **Type-Safe** - Full TypeScript implementation with runtime validation
- **Modern UI** - Beautiful interface built with Tailwind CSS and shadcn/ui
- **Smooth Animations** - Framer Motion powered transitions and interactions
- **Real-time Updates** - Background data synchronization every 60 seconds

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
- **Lucide React** - Beautiful icons for UI elements

### Data Management

- **Google Sheets Integration** - Primary data source for real-time auction information
- **Papa Parse** - Efficient CSV parsing for Google Sheets data
- **TanStack Query Caching** - Advanced client-side data caching with 60-second refresh intervals
- **google-spreadsheet** - Official Google Sheets API client for data fetching

### Development & Deployment

- **Node.js + Express** - Development server with static file serving for production
- **TSX** - Fast TypeScript execution for development
- **ESBuild** - Fast JavaScript bundler for production builds

## 📊 Data Sources

The application integrates with three Google Sheets:

### 1. Teams & Budget Sheet
- Team names and identifiers
- Initial budget allocations
- Current remaining funds
- Total players count
- Foreign players count
- Total team points

### 2. Players Catalogue
- Complete player database
- Player names and nationalities
- Base prices and categories
- Player roles and specializations
- Team assignments (if sold)

### 3. Auctioneer Sheet
- Live auction results
- Final bid amounts
- Player status (sold/unsold)
- Real-time updates during auction

**Note**: The application expects 400 errors during sheet fetching as it tries multiple sheet identifiers to find the correct data source. This is normal behavior.

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


### Deploy to Vercel (Static Site)

For static site deployment:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

**Manual Deployment:**

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

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
│   │   │   ├── ui/         # shadcn/ui component library
│   │   │   ├── LeaderboardView.tsx    # Leaderboard with rankings
│   │   │   ├── PlayerCard.tsx         # Player display cards
│   │   │   ├── TeamCard.tsx           # Team overview cards
│   │   │   └── ...
│   │   ├── hooks/          # Custom React hooks
│   │   │   └── use-toast.ts           # Toast notification hook
│   │   ├── lib/            # Utility libraries
│   │   │   ├── queryClient.ts         # TanStack Query configuration
│   │   │   └── utils.ts               # Utility functions
│   │   ├── pages/          # Page components and sections
│   │   │   ├── sections/   # Page section components
│   │   │   │   ├── PlayerDetailsSection.tsx   # Player details view
│   │   │   │   ├── TeamOverviewSection.tsx    # Team cards view
│   │   │   │   └── ...
│   │   │   └── HomePage.tsx           # Main homepage
│   │   ├── services/       # Google Sheets integration
│   │   │   └── googleSheetsService.ts # Data fetching service
│   │   ├── assets/         # Static assets
│   │   │   └── teamLogos/  # Team logo images
│   │   └── App.tsx         # Main app component with routing
│   ├── public/             # Public static files
│   │   └── favicon.ico     # ISTE logo favicon
│   └── index.html          # HTML entry point
├── server/                 # Backend server
│   ├── index.ts            # Express server (dev + production)
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Storage interface
│   └── vite.ts             # Vite dev server integration
├── shared/                 # Shared TypeScript types
│   └── schema.ts           # Data schemas and types
├── attached_assets/        # Project assets
│   ├── iste-logo.png      # ISTE logo
│   └── background images   # IPL themed backgrounds
├── start-production.js     # Production server launcher
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite build configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS theming
└── README.md              # This file
```

## 🎮 Usage Guide

### Navigation Tabs

The dashboard features four main sections accessible via navigation tabs:

#### 1. **OVERVIEW** (Default)
- Team cards sorted by current ranking
- Shows top 3 teams with medal indicators
- Real-time budget tracking
- Player count with foreign player limits
- Team logos and branding
- Click any card for detailed team view

#### 2. **SOLD PLAYERS**
- Complete list of all purchased players
- Filter by team using dropdown
- Sortable columns:
  - Player name
  - Team assignment
  - Sold amount
  - Base price
  - Nationality
- Search functionality
- Real-time status updates

#### 3. **UNSOLD PLAYERS**
- All available players not yet purchased
- Detailed player information
- Base price and category
- Player roles and specializations
- Searchable and sortable interface

#### 4. **LEADERBOARD**
- Complete team rankings table
- **Circular rank indicators** (1, 2, 3, etc.) with gradient styling
- Sortable columns:
  - Rank (calculated dynamically)
  - Team Name
  - Total Spent
  - Remaining Budget
  - Total Players
  - **Foreign Players** (overseas count)
  - Total Team Points
- Multi-level ranking system:
  1. Total Team Points (primary)
  2. Funds Remaining (secondary)
  3. Team Name alphabetical (tertiary)
- Color-coded data for easy reading
- Updates every 60 seconds

### Key Features Explained

#### Foreign Players Column
- Tracks overseas player count per team
- Important for IPL rules compliance (max 4 foreign players)
- Purple color coding for distinction
- Sortable for strategic analysis

#### Smart Data Caching
- Initial data fetch from Google Sheets
- 60-second client-side cache
- Automatic background refresh
- "Returning cached data" logs indicate efficient caching
- Minimal API calls for performance

#### Team Logos
- Custom team logo support
- Automatic fallback to team initials
- Stored in `client/src/assets/teamLogos/`
- Optimized for fast loading

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server on port 5000 with hot reload
npm run check        # Run TypeScript type checking

# Production
npm run build        # Build frontend + backend for production
npm run start        # Start production server

# Code Quality
npm run check        # Full TypeScript type checking
```

### Development Workflow

1. **Start the development server**

```bash
npm run dev
```

Server starts on `http://localhost:5000`

2. **Make your changes**
   - Hot module replacement (HMR) enabled
   - Changes reflect immediately in browser
   - TypeScript errors shown in terminal

3. **Run type checking**

```bash
npm run check
```

4. **Test with real data**
   - Update Google Sheets URLs in `googleSheetsService.ts`
   - Data refreshes every 60 seconds automatically
   - Check browser console for fetch logs

5. **Build for production**

```bash
npm run build
```

Creates optimized build in `dist/` directory

### Code Style Guidelines

- **TypeScript** - Strict mode with comprehensive type safety
- **Component Structure** - React functional components with hooks
- **Styling** - Tailwind CSS utility classes with shadcn/ui components
- **State Management** - TanStack Query for server state, useState for local state
- **Data Fetching** - Direct Google Sheets integration via frontend services
- **File Organization** - Feature-based organization with shared components

### Adding New Features

#### Add a New Team Logo

1. Place logo image in `client/src/assets/teamLogos/`
2. Update `teamLogos` object in `LeaderboardView.tsx`:

```typescript
const teamLogos: Record<string, string> = {
  "Team Name": "/teamLogos/team-logo.png",
  // ... other teams
};
```

#### Add a New Data Column

1. Update data types in `shared/schema.ts`
2. Modify Google Sheets service parsing in `googleSheetsService.ts`
3. Add column to relevant component (LeaderboardView, PlayerCard, etc.)
4. Update sorting logic if sortable

#### Customize Theme Colors

Edit `client/src/index.css`:

```css
:root {
  --background: hsl(222, 47%, 11%);
  --primary: hsl(20, 100%, 50%);
  /* ... customize other colors */
}
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Google Sheets 400 Errors (EXPECTED BEHAVIOR)

```
Failed to load resource: the server responded with a status of 400
```

**This is normal!** The service tries multiple sheet identifiers (GIDs) to find the correct data. These 400 errors are expected and don't affect functionality.

**Verify it's working**:
- Check for "Successfully parsed X rows" logs
- Data should load after a few 400 errors
- Teams and players should display correctly

#### 2. Data Not Refreshing

**Solution**:
- Check browser console for fetch errors
- Verify Google Sheets are publicly accessible
- Clear browser cache and reload
- Check network tab for CSV request status
- Ensure sheet permissions allow public CSV export

#### 3. Circular Ranks Not Displaying

**Solution**:
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check that `rounded-full` class is present in LeaderboardView.tsx
- Verify Tailwind CSS is compiling correctly

#### 4. Foreign Players Column Missing

**Solution**:
- Ensure Google Sheets "Teams & Budget" has "Foreign Players" column
- Check that data parsing includes `overseasCount` field
- Verify column is added to LeaderboardView component


### Performance Optimization

- **Caching**: 60-second client-side cache reduces API calls
- **Bundle Splitting**: Automatic code splitting via Vite
- **Image Optimization**: Optimized team logos and assets
- **Sheet Structure**: Keep sheets clean with proper headers
- **Query Optimization**: TanStack Query prevents redundant fetches
- **Lazy Loading**: Components load on-demand for faster initial render

## 🔧 Configuration

### Google Sheets Setup

#### Required Sheet Structure

**Teams & Budget Sheet** columns:
- Team Name
- Initial Budget
- Total Spent
- Funds Remaining
- Players Count
- Foreign Players
- Total Points

**Players Catalogue** columns:
- Player Name
- Base Price
- Category
- Role
- Nationality
- Team (if sold)

**Auctioneer Sheet** columns:
- Player Name
- Status (Sold/Unsold)
- Final Amount
- Winning Team

#### Sheet Permissions

1. Open Google Sheet → Share
2. Set to "Anyone with the link can view"
3. Copy sheet URL
4. Extract spreadsheet ID from URL
5. Update in `googleSheetsService.ts`

### Environment Variables

#### Development (Optional)

No environment variables required for basic functionality.

#### Production (Optional)

```env
NODE_ENV=production
PORT=5000              # Server port (default: 5000)
```

## 📊 Data Flow

```
Google Sheets (Source)
       ↓
CSV Export URLs
       ↓
Papa Parse (Parser)
       ↓
googleSheetsService.ts (Transform)
       ↓
TanStack Query (Cache - 60s)
       ↓
React Components (Display)
       ↓
User Interface
```

### Cache Strategy

1. **Initial Load**: Fetch from Google Sheets
2. **Cache**: Store in TanStack Query cache (60 seconds)
3. **Subsequent Requests**: Return cached data
4. **Background Refresh**: Auto-refresh every 60 seconds
5. **Stale Data**: Invalidate and refetch on user interaction

## 🎨 Design Features

### Color Palette

- **Background**: Dark blue gradient (`#0a0e1a` to `#1a1f3a`)
- **Primary**: Orange (`#ff8c00`) for IPL branding
- **Accent**: Red gradient for ranks and highlights
- **Text**: White with varied opacity for hierarchy
- **Data Colors**:
  - Green: Spent amounts
  - Blue: Remaining budget
  - Yellow: Total points
  - Purple: Foreign players

### Typography

- **Headers**: Bold, large sizes for prominence
- **Data**: Medium weight for readability
- **Labels**: Smaller, gray for secondary information

### Animations

- **Framer Motion**: Smooth page transitions
- **Hover Effects**: Interactive feedback on all clickable elements
- **Loading States**: Skeleton screens during data fetch
- **Transitions**: Smooth color and transform transitions

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow existing code style
   - Add TypeScript types
   - Test thoroughly
4. **Commit with clear message**
   ```bash
   git commit -m 'Add: Feature description'
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open Pull Request**
   - Describe changes clearly
   - Reference any related issues
   - Include screenshots if UI changes

### Contribution Guidelines

- Use TypeScript for all new code
- Follow existing component patterns
- Add comments for complex logic
- Test with real Google Sheets data
- Ensure responsive design
- No console.log statements in production code

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏏 About IPL 2025

The Indian Premier League (IPL) 2025 promises to be the most exciting season yet. This dashboard provides real-time insights into the player auction process, helping fans, analysts, and team management track the dynamic world of cricket's premier T20 league.


## 🚀 Live Demo

- **Vercel**: Fast static site deployment
- **Render**: Traditional Node.js hosting

## 📞 Support

For support, questions, or bug reports:

- **GitHub Issues**: Open an issue with detailed description
- **Documentation**: Check this README thoroughly
- **Community**: Share on cricket forums and communities

---

**Built with ❤️ for cricket fans worldwide**

**Powered by**: React • TypeScript • Vite • Tailwind CSS • Google Sheets

**Optimized for**: Vercel • Modern Browsers

---

### Credits

- **IPL**: Indian Premier League brand and cricket data
- **shadcn/ui**: Beautiful component library

For questions or feedback, please open an issue on GitHub.
