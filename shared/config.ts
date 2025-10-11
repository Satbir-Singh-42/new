/**
 * IPL Auction Configuration
 * 
 * Edit these values to customize your auction rules and limits.
 * Changes will automatically apply to all teams.
 */

export const AUCTION_CONFIG = {
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

/**
 * Team Card Styling Configuration
 * 
 * Customize the appearance of team cards across the application.
 * All classes use Tailwind CSS and proper color handling to avoid conflicts.
 */
export const TEAM_CARD_CONFIG = {
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
  
  // Card content background (consistent dark background for all teams)
  content: {
    background: "bg-wwwiplt20comblack-3", // Semi-transparent dark background
    padding: "p-0",
  },
  
  // Stats section styling
  stats: {
    divider: "border-[#ffffff1a]", // Subtle white divider
    label: "[font-family:'Work_Sans',Helvetica] font-normal text-wwwiplt-2-0comwhite text-sm text-center tracking-[0] leading-6",
    value: "[font-family:'Work_Sans',Helvetica] font-bold text-wwwiplt-2-0comwhite text-lg text-center tracking-[0] leading-7",
  },
};

/**
 * Team Dashboard Colors Configuration
 * 
 * Centralized color scheme for the team dashboard stat cards.
 * All colors use Tailwind CSS classes and hex values for consistency.
 */
export const DASHBOARD_COLORS = {
  // Card backgrounds and borders
  card: {
    background: "bg-[#0f1629]",           // Dark navy background
    border: "border-[#1a2332]",           // Subtle border
    borderHover: "hover:border-[#2a3441]", // Lighter border on hover
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

/**
 * Helper function to get formatted config text
 */
export const getConfigText = {
  squadSize: () => AUCTION_CONFIG.squadSizeLabel.replace('{max}', String(AUCTION_CONFIG.maxPlayers)),
  qualification: () => AUCTION_CONFIG.qualificationLabel.replace('{count}', String(AUCTION_CONFIG.teamsQualifying)),
  minPlayers: () => AUCTION_CONFIG.minPlayersLabel.replace('{min}', String(AUCTION_CONFIG.minPlayers)),
};
