export const TOURNAMENT_CONFIG = {
  MAX_SQUAD_SIZE: 15,
  MAX_FOREIGN_PLAYERS: 7,
  TEAMS_QUALIFYING: 8,
} as const;

export const getMaxSquadSize = () => TOURNAMENT_CONFIG.MAX_SQUAD_SIZE;
export const getMaxForeignPlayers = () => TOURNAMENT_CONFIG.MAX_FOREIGN_PLAYERS;
export const getTeamsQualifying = () => TOURNAMENT_CONFIG.TEAMS_QUALIFYING;
