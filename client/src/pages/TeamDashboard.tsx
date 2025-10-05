import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import { queryClient } from '@/lib/queryClient';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayerCards } from '@/components/PlayerCards';
import { useIPLData } from '@/hooks/useIPLData';
import { LoadingPage } from '@/components/LoadingPage';
import { googleSheetsService, type Team } from '@/services/googleSheetsService';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { AUCTION_CONFIG, getConfigText, DASHBOARD_COLORS } from '@shared/config';

// Team Logo component
const TeamLogo = ({ logo, name, className = "" }: { logo: string; name: string; className?: string }) => {
  const isImageLogo = logo.startsWith('/') || logo.startsWith('http');
  
  if (isImageLogo) {
    return (
      <div
        className={`w-16 h-16 md:w-20 md:h-20 aspect-square bg-cover bg-center rounded-full flex-shrink-0 ${className}`}
        style={{ backgroundImage: `url(${logo})` }}
      />
    );
  } else {
    const teamGradient = googleSheetsService.getTeamGradient(name);
    return (
      <div className={`w-16 h-16 md:w-20 md:h-20 aspect-square flex items-center justify-center rounded-full flex-shrink-0 ${teamGradient} text-white text-lg md:text-xl font-bold ${className}`}>
        {logo}
      </div>
    );
  }
};

export const TeamDashboard = () => {
  const [, params] = useRoute('/team/:teamId');
  const teamId = params?.teamId;
  
  const [teamConfig, setTeamConfig] = useState<Team | null>(null);
  const [teamRank, setTeamRank] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { teamStats, isLoading, error, getSoldPlayersByTeam, refreshAllData } = useIPLData();
  const { data: soldPlayers, isLoading: loadingPlayers } = getSoldPlayersByTeam(teamConfig?.id || "");
  
  useEffect(() => {
    if (teamId) {
      googleSheetsService.getTeamConfigs().then(configs => {
        const team = configs.find(config => config.id === teamId);
        setTeamConfig(team || null);
      });
    }
  }, [teamId]);

  useEffect(() => {
    // Calculate team rank when teamStats and teamConfig are available
    if (teamStats && teamConfig) {
      googleSheetsService.getLeaderboard().then(leaderboard => {
        const teamIndex = leaderboard.findIndex(team => team.teamId === teamConfig.id);
        setTeamRank(teamIndex !== -1 ? teamIndex + 1 : null);
      });
    }
  }, [teamStats, teamConfig]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading || !teamConfig) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1629] p-4 md:p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-red-400 text-lg">Error loading team data: {error.message}</div>
        </div>
      </div>
    );
  }

  const teamStat = teamStats?.find(stat => stat.teamId === teamConfig.id);
  const teamPlayers = soldPlayers || [];
  const teamGradient = googleSheetsService.getTeamGradient(teamConfig.name);
  const teamBorderColor = googleSheetsService.getTeamBorderColor(teamConfig.name);
  const startingBudget = teamStat?.startingBudget || 100000;
  
  // Player limits from config (easily editable in shared/config.ts)
  const MAX_PLAYERS = AUCTION_CONFIG.maxPlayers;
  const MAX_OVERSEAS = AUCTION_CONFIG.maxOverseasPlayers;
  const MIN_PLAYERS = AUCTION_CONFIG.minPlayers;
  
  // Calculate current counts
  const currentPlayers = teamStat?.playersCount || 0;
  const currentOverseas = teamStat?.overseasCount || 0;
  
  // Check if limits are exceeded
  const playersExceeded = currentPlayers > MAX_PLAYERS;
  const overseasExceeded = currentOverseas > MAX_OVERSEAS;

  return (
    <motion.div 
      className="min-h-screen bg-[#0f1629] p-3 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header with Back Button and Refresh Button */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <Link href="/">
            <Button data-testid="button-back-overview" variant="outline" size="sm" className="bg-[#1a2332] border-[#2a3441] text-gray-300 hover:bg-[#1a2332] hover:text-gray-300 hover:border-[#2a3441] text-xs md:text-sm">
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Back to Overview
            </Button>
          </Link>
          <Button 
            data-testid="button-refresh-data" 
            variant="outline" 
            size="sm" 
            className="bg-[#1a2332] border-[#2a3441] text-gray-300 hover:bg-[#1a2332] hover:text-gray-300 hover:border-[#2a3441] text-xs md:text-sm"
            disabled={isRefreshing}
            onClick={async () => {
              setIsRefreshing(true);
              try {
                googleSheetsService.clearCache();
                refreshAllData();
                // Also refresh the team-specific sold players data
                if (teamConfig?.id) {
                  queryClient.invalidateQueries({ queryKey: ['soldPlayers', teamConfig.id] });
                }
                queryClient.invalidateQueries({ queryKey: ['unsoldPlayers'] });
                // Wait a moment for the refresh to complete
                await new Promise(resolve => setTimeout(resolve, 1000));
              } finally {
                setIsRefreshing(false);
              }
            }}
          >
            <RefreshCw className={`w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        {/* Team Header */}
        <Card className={`bg-[#0f1629] border-2 ${teamBorderColor} ${teamGradient} bg-opacity-95`}>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
              <TeamLogo logo={teamConfig.logo} name={teamConfig.name} />
              <div className="text-center sm:text-left flex-1">
                <h1 data-testid="text-team-name" className="text-xl md:text-3xl font-bold text-white mb-2">{teamConfig.name}</h1>
                <div className="text-white/90 space-y-1">
                  <p className="text-sm md:text-base font-medium">{getConfigText.squadSize()}</p>
                  <p className="text-xs md:text-sm text-yellow-300 font-medium">{getConfigText.qualification()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          <Card className={`${DASHBOARD_COLORS.card.background} ${DASHBOARD_COLORS.stats.startingBudget.border} ${DASHBOARD_COLORS.stats.startingBudget.borderHover} transition-colors`}>
            <CardContent className="p-3 md:p-4">
              <div className="text-center space-y-2">
                <p className={`${DASHBOARD_COLORS.text.label} text-xs md:text-sm`}>Starting Budget</p>
                <p data-testid="text-starting-budget" className={`text-lg md:text-2xl font-bold ${DASHBOARD_COLORS.stats.startingBudget.text}`}>{formatCurrency(startingBudget)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`${DASHBOARD_COLORS.card.background} ${DASHBOARD_COLORS.stats.currentRank.border} ${DASHBOARD_COLORS.stats.currentRank.borderHover} transition-colors`}>
            <CardContent className="p-3 md:p-4">
              <div className="text-center space-y-2">
                <p className={`${DASHBOARD_COLORS.text.label} text-xs md:text-sm`}>Current Rank</p>
                <p data-testid="text-current-rank" className={`text-lg md:text-2xl font-bold ${DASHBOARD_COLORS.stats.currentRank.text}`}>
                  {teamRank ? `#${teamRank}` : '--'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className={`${DASHBOARD_COLORS.card.background} ${DASHBOARD_COLORS.stats.totalSpent.border} ${DASHBOARD_COLORS.stats.totalSpent.borderHover} transition-colors`}>
            <CardContent className="p-3 md:p-4">
              <div className="text-center space-y-2">
                <p className={`${DASHBOARD_COLORS.text.label} text-xs md:text-sm`}>Total Spent</p>
                <p data-testid="text-total-spent" className={`text-lg md:text-2xl font-bold ${DASHBOARD_COLORS.stats.totalSpent.text}`}>{teamStat ? formatCurrency(teamStat.totalSpent) : formatCurrency(0)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`${DASHBOARD_COLORS.card.background} ${DASHBOARD_COLORS.stats.remainingBudget.border} ${DASHBOARD_COLORS.stats.remainingBudget.borderHover} transition-colors`}>
            <CardContent className="p-3 md:p-4">
              <div className="text-center space-y-2">
                <p className={`${DASHBOARD_COLORS.text.label} text-xs md:text-sm`}>Remaining Budget</p>
                <p data-testid="text-remaining-budget" className={`text-lg md:text-2xl font-bold ${DASHBOARD_COLORS.stats.remainingBudget.text}`}>{teamStat ? formatCurrency(teamStat.fundsRemaining) : formatCurrency(startingBudget)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`${DASHBOARD_COLORS.card.background} ${DASHBOARD_COLORS.stats.teamPoints.border} ${DASHBOARD_COLORS.stats.teamPoints.borderHover} transition-colors`}>
            <CardContent className="p-3 md:p-4">
              <div className="text-center space-y-2">
                <p className={`${DASHBOARD_COLORS.text.label} text-xs md:text-sm`}>Team Points</p>
                <p data-testid="text-team-points" className={`text-lg md:text-2xl font-bold ${DASHBOARD_COLORS.stats.teamPoints.text}`}>{teamStat?.totalPoints || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Composition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <Card className={`${DASHBOARD_COLORS.card.background} ${DASHBOARD_COLORS.card.border} ${DASHBOARD_COLORS.card.borderHover} transition-colors ${playersExceeded ? DASHBOARD_COLORS.status.exceeded : ''}`}>
            <CardContent className="p-3 md:p-4">
              <div className="text-center space-y-2">
                <p className={`${DASHBOARD_COLORS.text.label} text-xs md:text-sm`}>Total Players</p>
                <p data-testid="text-total-players" className={`text-xl md:text-2xl font-bold ${playersExceeded ? DASHBOARD_COLORS.text.error : DASHBOARD_COLORS.text.primary}`}>
                  {currentPlayers}/{MAX_PLAYERS}
                </p>
                {playersExceeded ? (
                  <p className={`text-xs ${DASHBOARD_COLORS.text.error} font-semibold`}>Limit exceeded!</p>
                ) : currentPlayers >= MAX_PLAYERS ? (
                  <p className={`text-xs ${DASHBOARD_COLORS.text.warning}`}>Squad full</p>
                ) : (
                  <p className={`text-xs ${DASHBOARD_COLORS.text.info}`}>
                    {currentPlayers < MIN_PLAYERS 
                      ? `Need ${MIN_PLAYERS - currentPlayers} more for eligibility`
                      : `Can add ${MAX_PLAYERS - currentPlayers} more`
                    }
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className={`${DASHBOARD_COLORS.card.background} ${DASHBOARD_COLORS.card.border} ${DASHBOARD_COLORS.card.borderHover} transition-colors ${overseasExceeded ? DASHBOARD_COLORS.status.exceeded : ''}`}>
            <CardContent className="p-3 md:p-4">
              <div className="text-center space-y-2">
                <p className={`${DASHBOARD_COLORS.text.label} text-xs md:text-sm`}>Foreign Players</p>
                <p data-testid="text-foreign-players" className={`text-xl md:text-2xl font-bold ${overseasExceeded ? DASHBOARD_COLORS.text.error : DASHBOARD_COLORS.text.primary}`}>
                  {currentOverseas}/{MAX_OVERSEAS}
                </p>
                {overseasExceeded ? (
                  <p className={`text-xs ${DASHBOARD_COLORS.text.error} font-semibold`}>Limit exceeded!</p>
                ) : currentOverseas >= MAX_OVERSEAS ? (
                  <p className={`text-xs ${DASHBOARD_COLORS.text.warning}`}>Foreign quota full</p>
                ) : (
                  <p className={`text-xs ${DASHBOARD_COLORS.text.info}`}>Can add {MAX_OVERSEAS - currentOverseas} more</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className={`${DASHBOARD_COLORS.card.background} ${DASHBOARD_COLORS.card.border} ${DASHBOARD_COLORS.card.borderHover} transition-colors ${currentPlayers >= MIN_PLAYERS ? DASHBOARD_COLORS.status.eligible : DASHBOARD_COLORS.status.notEligible}`}>
            <CardContent className="p-3 md:p-4">
              <div className="text-center space-y-2">
                <p className={`${DASHBOARD_COLORS.text.label} text-xs md:text-sm`}>Squad Status</p>
                <p data-testid="text-squad-status" className={`text-lg md:text-xl font-bold ${currentPlayers >= MIN_PLAYERS ? DASHBOARD_COLORS.text.success : DASHBOARD_COLORS.text.error}`}>
                  {currentPlayers >= MIN_PLAYERS ? 'Eligible' : 'Not Eligible'}
                </p>
                <p className={`text-xs ${DASHBOARD_COLORS.text.info}`}>{getConfigText.minPlayers()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Players Table */}
        <div className="space-y-4">
          {loadingPlayers ? (
            <Card className={`${DASHBOARD_COLORS.card.background} ${DASHBOARD_COLORS.card.border}`}>
              <CardContent className="p-6">
                <div className={`text-center ${DASHBOARD_COLORS.text.label}`}>Loading team players...</div>
              </CardContent>
            </Card>
          ) : (
            <PlayerCards 
              players={teamPlayers} 
              title={`${teamConfig.name} Squad (${teamPlayers.length} players)`}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};