/**
 * ========================================
 * WEBSITE/APP CONFIGURATION
 * ========================================
 * 
 * This file contains ALL website and auction settings:
 * - Auction rules (squad limits, qualification)
 * - UI styling (cards, colors, layouts)
 * - Display settings
 * 
 * HOW TO UPDATE:
 * 1. Modify values below to change auction rules
 * 2. Update UI colors and styling
 * 3. All changes apply across the entire website
 */

// ========================================
// AUCTION RULES & LIMITS
// ========================================
export const AUCTION_RULES = {
  // Squad Size Limits
  maxPlayers: 15,           // Maximum players per team
  minPlayers: 11,           // Minimum players required for eligibility
  maxOverseasPlayers: 7,    // Maximum foreign/overseas players per team
  
  // Qualification Rules
  teamsQualifying: 8,       // Number of teams that advance to playoffs
  
  // Display Text (customize these as needed)
  squadSizeLabel: "Squad Size: Max {max} players",
  qualificationLabel: "🏆 Qualification: Top {count} teams advance",
  minPlayersLabel: "Min: {min} players required",
};

// ========================================
// TEAM CARD STYLING
// ========================================
export const TEAM_CARD_STYLE = {
  // Card container styling
  container: {
    base: "h-full min-w-0 flex flex-col items-center gap-6 p-3 rounded-3xl overflow-hidden border-2 border-solid cursor-pointer transition-all duration-200",
    hover: "hover:ring-2 hover:ring-white/20",
  },
  
  // Logo container styling
  logo: {
    container: "flex w-20 h-20 items-center justify-center rounded-full overflow-hidden border-2 border-white/20",
    size: "w-20 h-20",
  },
  
  // Team name styling
  teamName: {
    container: "text-center",
    text: "[font-family:'Work_Sans',Helvetica] font-semibold text-white text-sm tracking-[0] leading-5",
  },
  
  // Card content background
  content: {
    background: "bg-wwwiplt20comblack-3",
    padding: "p-0",
  },
  
  // Stats section styling
  stats: {
    divider: "border-[#ffffff1a]",
    label: "[font-family:'Work_Sans',Helvetica] font-normal text-wwwiplt-2-0comwhite text-sm text-center tracking-[0] leading-6",
    value: "[font-family:'Work_Sans',Helvetica] font-bold text-wwwiplt-2-0comwhite text-lg text-center tracking-[0] leading-7",
  },
};

// ========================================
// DASHBOARD COLORS
// ========================================
export const DASHBOARD_COLORS = {
  // Card backgrounds and borders
  card: {
    background: "bg-[#0f1629]",
    border: "border-[#1a2332]",
    borderHover: "hover:border-[#2a3441]",
  },
  
  // Stat-specific colors
  stats: {
    startingBudget: {
      border: "border-[#1a2332]",
      borderHover: "hover:border-[#2a3441]",
      text: "text-white",
    },
    currentRank: {
      border: "border-[#1a2332]",
      borderHover: "hover:border-orange-400/30",
      text: "text-white",
    },
    totalSpent: {
      border: "border-[#1a2332]",
      borderHover: "hover:border-green-400/30",
      text: "text-green-400",
    },
    remainingBudget: {
      border: "border-[#1a2332]",
      borderHover: "hover:border-blue-400/30",
      text: "text-blue-400",
    },
    teamPoints: {
      border: "border-[#1a2332]",
      borderHover: "hover:border-yellow-400/30",
      text: "text-yellow-400",
    },
  },
  
  // Text colors
  text: {
    label: "text-gray-300",
    primary: "text-white",
    warning: "text-yellow-400",
    error: "text-red-400",
    success: "text-green-400",
    info: "text-gray-400",
  },
  
  // Status indicators
  status: {
    exceeded: "ring-2 ring-red-500",
    eligible: "ring-2 ring-green-400/30",
    notEligible: "ring-2 ring-red-400/30",
  },
};

// ========================================
// HELPER FUNCTIONS
// ========================================

export const getConfigText = {
  squadSize: () => AUCTION_RULES.squadSizeLabel.replace('{max}', String(AUCTION_RULES.maxPlayers)),
  qualification: () => AUCTION_RULES.qualificationLabel.replace('{count}', String(AUCTION_RULES.teamsQualifying)),
  minPlayers: () => AUCTION_RULES.minPlayersLabel.replace('{min}', String(AUCTION_RULES.minPlayers)),
};

// Re-export for backward compatibility
export const AUCTION_CONFIG = AUCTION_RULES;
export const TEAM_CARD_CONFIG = TEAM_CARD_STYLE;
