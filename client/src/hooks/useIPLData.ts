import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  googleSheetsService,
  TeamStats,
  Player,
} from "@/services/googleSheetsService";

export const useIPLData = () => {
  const {
    data: teamStats,
    isLoading: isLoadingTeams,
    error: teamsError,
    refetch: refetchTeams,
  } = useQuery({
    queryKey: ["teamStats"],
    queryFn: () => googleSheetsService.getTeamStats(),
    refetchInterval: 5000, // Refetch every 30 seconds for real-time data
    staleTime: 15000, // Consider data stale after 15 seconds
  });

  const {
    data: players,
    isLoading: isLoadingPlayers,
    error: playersError,
    refetch: refetchPlayers,
  } = useQuery({
    queryKey: ["players"],
    queryFn: () => googleSheetsService.getPlayers(),
    refetchInterval: 5000,
    staleTime: 15000,
  });

  const {
    data: leaderboard,
    isLoading: isLoadingLeaderboard,
    error: leaderboardError,
    refetch: refetchLeaderboard,
  } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => googleSheetsService.getLeaderboard(),
    refetchInterval: 5000,
    staleTime: 15000,
  });

  const getSoldPlayersByTeam = (teamId: string) => {
    return useQuery({
      queryKey: ["soldPlayers", teamId],
      queryFn: () => googleSheetsService.getSoldPlayersByTeam(teamId),
      enabled: !!teamId,
      refetchInterval: 5000,
      staleTime: 15000,
    });
  };

  const getUnsoldPlayers = () => {
    return useQuery({
      queryKey: ["unsoldPlayers"],
      queryFn: () => googleSheetsService.getUnsoldPlayers(),
      refetchInterval: 5000,
      staleTime: 15000,
    });
  };

  const refreshAllData = () => {
    refetchTeams();
    refetchPlayers();
    refetchLeaderboard();
  };

  return {
    teamStats,
    players,
    leaderboard,
    isLoading: isLoadingTeams || isLoadingPlayers || isLoadingLeaderboard,
    error: teamsError || playersError || leaderboardError,
    getSoldPlayersByTeam,
    getUnsoldPlayers,
    refreshAllData,
  };
};
