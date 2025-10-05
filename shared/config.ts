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
 * Helper function to get formatted config text
 */
export const getConfigText = {
  squadSize: () => AUCTION_CONFIG.squadSizeLabel.replace('{max}', String(AUCTION_CONFIG.maxPlayers)),
  qualification: () => AUCTION_CONFIG.qualificationLabel.replace('{count}', String(AUCTION_CONFIG.teamsQualifying)),
  minPlayers: () => AUCTION_CONFIG.minPlayersLabel.replace('{min}', String(AUCTION_CONFIG.minPlayers)),
};
