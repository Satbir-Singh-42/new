export const TOURNAMENT_CONFIG = {
  MAX_SQUAD_SIZE: 15,
  MAX_FOREIGN_PLAYERS: 7,
  MIN_SQUAD_SIZE: 11,
  TEAMS_QUALIFYING: 8,
  STARTING_BUDGET: 100000,
} as const;

export const getMaxSquadSize = () => TOURNAMENT_CONFIG.MAX_SQUAD_SIZE;
export const getMaxForeignPlayers = () => TOURNAMENT_CONFIG.MAX_FOREIGN_PLAYERS;
export const getMinSquadSize = () => TOURNAMENT_CONFIG.MIN_SQUAD_SIZE;
export const getTeamsQualifying = () => TOURNAMENT_CONFIG.TEAMS_QUALIFYING;
export const getStartingBudget = () => TOURNAMENT_CONFIG.STARTING_BUDGET;
