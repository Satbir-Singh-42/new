/**
 * Application Configuration
 * 
 * Edit auction rules, UI styling, and dashboard colors here
 */

export const AUCTION_CONFIG = {
  maxPlayers: 15,
  minPlayers: 11,
  maxOverseasPlayers: 7,
  teamsQualifying: 8,
  squadSizeLabel: "Squad Size: Max {max} players",
  qualificationLabel: "🏆 Qualification: Top {count} teams advance",
  minPlayersLabel: "Min: {min} players required",
};

export const TEAM_CARD_CONFIG = {
  container: {
    base: "h-full min-w-0 flex flex-col items-center gap-6 p-3 rounded-3xl overflow-hidden border-2 border-solid cursor-pointer transition-all duration-200",
    hover: "hover:ring-2 hover:ring-white/20",
  },
  logo: {
    container: "flex w-20 h-20 items-center justify-center rounded-full overflow-hidden border-2 border-white/20",
    size: "w-20 h-20",
  },
  teamName: {
    container: "text-center",
    text: "[font-family:'Work_Sans',Helvetica] font-semibold text-white text-sm tracking-[0] leading-5",
  },
  content: {
    background: "bg-wwwiplt20comblack-3",
    padding: "p-0",
  },
  stats: {
    divider: "border-[#ffffff1a]",
    label: "[font-family:'Work_Sans',Helvetica] font-normal text-wwwiplt-2-0comwhite text-sm text-center tracking-[0] leading-6",
    value: "[font-family:'Work_Sans',Helvetica] font-bold text-wwwiplt-2-0comwhite text-lg text-center tracking-[0] leading-7",
  },
};

export const DASHBOARD_COLORS = {
  card: {
    background: "bg-[#0f1629]",
    border: "border-[#1a2332]",
    borderHover: "hover:border-[#2a3441]",
  },
  stats: {
    startingBudget: {
      border: "border-[#1a2332]",
      borderHover: "hover:border-[#2a3441]",
      text: "text-white",
    },
    currentRank: {
      border: "border-[#1a2332]",
      borderHover: "hover:border-orange-400/70 hover:shadow-lg hover:shadow-orange-400/30",
      text: "text-white",
    },
    totalSpent: {
      border: "border-[#1a2332]",
      borderHover: "hover:border-green-400/70 hover:shadow-lg hover:shadow-green-400/30",
      text: "text-green-400",
    },
    remainingBudget: {
      border: "border-[#1a2332]",
      borderHover: "hover:border-blue-400/70 hover:shadow-lg hover:shadow-blue-400/30",
      text: "text-blue-400",
    },
    teamPoints: {
      border: "border-[#1a2332]",
      borderHover: "hover:border-yellow-400/70 hover:shadow-lg hover:shadow-yellow-400/30",
      text: "text-yellow-400",
    },
  },
  text: {
    label: "text-gray-300",
    primary: "text-white",
    warning: "text-yellow-400",
    error: "text-red-400",
    success: "text-green-400",
    info: "text-gray-400",
  },
  status: {
    exceeded: "ring-2 ring-red-500",
    eligible: "ring-2 ring-green-400/30",
    notEligible: "ring-2 ring-red-400/30",
  },
};

export const getConfigText = {
  squadSize: () => AUCTION_CONFIG.squadSizeLabel.replace('{max}', String(AUCTION_CONFIG.maxPlayers)),
  qualification: () => AUCTION_CONFIG.qualificationLabel.replace('{count}', String(AUCTION_CONFIG.teamsQualifying)),
  minPlayers: () => AUCTION_CONFIG.minPlayersLabel.replace('{min}', String(AUCTION_CONFIG.minPlayers)),
};
