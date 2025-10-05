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
 * Helper function to get formatted config text
 */
export const getConfigText = {
  squadSize: () => AUCTION_CONFIG.squadSizeLabel.replace('{max}', String(AUCTION_CONFIG.maxPlayers)),
  qualification: () => AUCTION_CONFIG.qualificationLabel.replace('{count}', String(AUCTION_CONFIG.teamsQualifying)),
  minPlayers: () => AUCTION_CONFIG.minPlayersLabel.replace('{min}', String(AUCTION_CONFIG.minPlayers)),
};
