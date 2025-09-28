import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useIPLData } from "@/hooks/useIPLData";
import { PlayerTable } from "@/components/PlayerTable";
import { LeaderboardView } from "@/components/LeaderboardView";
import { LoadingPage } from "@/components/LoadingPage";
import { googleSheetsService, type Team } from "@/services/googleSheetsService";

const navigationTabs = [
  { id: "overview", label: "OVERVIEW", active: true },
  { id: "sold", label: "SOLD PLAYERS", active: false },
  { id: "unsold", label: "UNSOLD PLAYERS", active: false },
  { id: "leaderboard", label: "LEADERBOARD", active: false },
];

// Create a component to display team logo or abbreviation
const TeamLogo = ({ logo, name, className = "" }: { logo: string; name: string; className?: string }) => {
  // Check if logo is a file path or abbreviation
  const isImageLogo = logo.startsWith('/') || logo.startsWith('http');
  
  if (isImageLogo) {
    return (
      <div
        className={`w-full h-full aspect-square bg-cover bg-center ${className}`}
        style={{ backgroundImage: `url(${logo})` }}
      />
    );
  } else {
    // Display abbreviation text with team-specific gradient
    const teamGradient = googleSheetsService.getTeamGradient(name);
    return (
      <div className={`w-full h-full aspect-square flex items-center justify-center text-2xl font-bold text-white ${teamGradient} ${className}`}>
        {logo}
      </div>
    );
  }
};

export const PlayerDetailsSection = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { teamStats, players, leaderboard, isLoading, error, getUnsoldPlayers, getSoldPlayersByTeam } = useIPLData();
  
  // Call all hooks unconditionally at the top level
  const { data: unsoldPlayers, isLoading: loadingUnsold } = getUnsoldPlayers();
  const { data: soldPlayers, isLoading: loadingPlayers } = getSoldPlayersByTeam(selectedTeam || "");
  
  // Generate team configs from leaderboard data (already sorted by ranking)
  const teamConfigs = React.useMemo(() => {
    if (!leaderboard) return [];
    return leaderboard.map(stat => ({
      id: stat.teamId,
      name: stat.teamName,
      logo: googleSheetsService.getTeamLogo(stat.teamName),
      fundsRemaining: stat.fundsRemaining,
      overseasPlayers: stat.overseasCount,
      totalPlayers: stat.playersCount,
      borderColor: googleSheetsService.getTeamBorderColor(stat.teamName),
      bgGradient: googleSheetsService.getTeamGradient(stat.teamName),
    }));
  }, [leaderboard]);
  
  // Show loading page only for initial load, not background refreshes
  const shouldShowLoading = () => {
    switch (activeTab) {
      case "sold":
        return !players && isLoading; // Only show if no cached data exists
      case "unsold":
        return !unsoldPlayers && loadingUnsold; // Only show if no cached data exists
      case "leaderboard":
        return !leaderboard && isLoading; // Only show if no cached data exists
      default: // overview
        return !leaderboard && isLoading; // Only show if no cached data exists
    }
  };

  if (shouldShowLoading()) {
    return <LoadingPage />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleTeamClick = (teamId: string) => {
    setLocation(`/team/${teamId}`);
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-red-400 text-lg">Error loading data: {error.message}</div>
        </div>
      );
    }

    switch (activeTab) {
      case "sold":
        // Show all sold players with team filtering, respecting pre-selected team
        const allSoldPlayers = players?.filter(p => p.status === 'sold') || [];
        const selectedTeamConfig = teamConfigs.find(team => team.id === selectedTeam);
        const teamDisplayName = selectedTeamConfig ? selectedTeamConfig.name : selectedTeam;
        return (
          <PlayerTable 
            players={allSoldPlayers} 
            title={selectedTeam ? `${teamDisplayName} Sold Players` : "Sold Players"}
            showTeam={true}
            showTeamFilter={true}
            teams={teamConfigs}
            selectedTeamFilter={selectedTeam}
            onTeamFilter={(teamId) => setSelectedTeam(teamId)}
          />
        );
        
      case "unsold":
        if (loadingUnsold) {
          return <div className="text-wwwiplt-2-0comwhite">Loading unsold players...</div>;
        }
        // Ensure only truly unsold players are shown here
        const confirmedUnsoldPlayers = (unsoldPlayers || []).filter(p => p.status === 'unsold');
        return (
          <PlayerTable 
            players={confirmedUnsoldPlayers} 
            title="Unsold Players" 
            showTeam={false}
            showTeamFilter={false}
            defaultSortField="sheetOrder"
            defaultSortDirection="asc"
          />
        );
        
      case "leaderboard":
        return <LeaderboardView leaderboard={leaderboard || []} />;
        
      default: // overview
        if (teamStats && teamStats.length > 0) {
          return (
            <main className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 sm:gap-6 content-start">
              {teamConfigs.map((teamConfig: Team) => {
              const teamStat = leaderboard?.find(stat => stat.teamId === teamConfig.id);
              return (
                <motion.div
                  key={teamConfig.id}
                  whileHover={{ 
                    scale: 1.05,
                    y: -8,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`h-full min-w-0 flex flex-col items-center gap-6 p-3 rounded-3xl overflow-hidden border-2 border-solid ${teamConfig.borderColor} ${teamConfig.bgGradient} cursor-pointer hover:ring-2 hover:ring-white/20 transition-all duration-200`}
                    onClick={() => handleTeamClick(teamConfig.id)}
                  >
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex w-20 h-20 items-center justify-center rounded-full overflow-hidden border-2 border-white/20">
                      <TeamLogo logo={teamConfig.logo} name={teamConfig.name} />
                    </div>
                    <div className="text-center">
                      <span className="[font-family:'Work_Sans',Helvetica] font-semibold text-white text-sm tracking-[0] leading-5">
                        {teamConfig.name}
                      </span>
                    </div>
                  </div>

                  <CardContent className="flex flex-col items-start w-full bg-wwwiplt20comblack-3 p-0 flex-1">
                    <div className="flex flex-col items-start pb-3 w-full border-b border-solid border-[#ffffff1a]">
                      <div className="flex flex-col items-center py-2 w-full">
                        <span className="[font-family:'Work_Sans',Helvetica] font-normal text-wwwiplt-2-0comwhite text-sm text-center tracking-[0] leading-6">
                          Funds Remaining
                        </span>
                      </div>

                      <div className="flex flex-col items-center w-full">
                        <span className="[font-family:'Work_Sans',Helvetica] font-bold text-wwwiplt-2-0comwhite text-lg text-center tracking-[0] leading-7">
                          {teamStat ? formatCurrency(teamStat.fundsRemaining) : '₹0'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-stretch justify-center w-full flex-1">
                      <div className="pr-2 border-r border-solid border-[#ffffff1a] flex flex-col justify-between flex-1">
                        <div className="flex flex-col items-center py-2 w-full">
                          <span className="[font-family:'Work_Sans',Helvetica] font-normal text-wwwiplt-2-0comwhite text-sm text-center tracking-[0] leading-6">
                            Overseas Players
                          </span>
                        </div>

                        <div className="flex flex-col items-center w-full">
                          <span className="[font-family:'Work_Sans',Helvetica] font-bold text-wwwiplt-2-0comwhite text-lg text-center tracking-[0] leading-7">
                            {teamStat?.overseasCount || 0}
                          </span>
                        </div>
                      </div>

                      <div className="pl-2 flex flex-col justify-between flex-1">
                        <div className="flex flex-col items-center py-2 w-full">
                          <span className="[font-family:'Work_Sans',Helvetica] font-normal text-wwwiplt-2-0comwhite text-sm text-center tracking-[0] leading-6">
                            Total Players
                          </span>
                        </div>

                        <div className="flex flex-col items-center w-full">
                          <span className="[font-family:'Work_Sans',Helvetica] font-bold text-wwwiplt-2-0comwhite text-lg text-center tracking-[0] leading-7">
                            {teamStat?.playersCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </motion.div>
              );
            })}
            </main>
          );
        } else {
          return (
            <div className="flex items-center justify-center h-32">
              <div className="text-wwwiplt-2-0comwhite text-lg">No teams available</div>
            </div>
          );
        }
    }
  };

  return (
    <motion.div 
      className="bg-[#18184a] w-full min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Unified Header */}
      <header 
        className="sticky top-0 z-50 w-full backdrop-blur bg-[#0b2a7d]/70 border-b border-white/10"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(24,24,74,0.9) 0%, rgba(12,28,158,0.8) 49%, rgba(24,24,74,0.9) 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-3 md:py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
            {/* Title Section */}
            <div className="flex items-center gap-2 md:gap-4">
              <h1 
                className="[font-family:'Work_Sans',Helvetica] font-bold text-[20px] sm:text-[24px] md:text-[28px] lg:text-[34px] leading-[24px] sm:leading-[28px] md:leading-[34px] lg:leading-[40.8px] tracking-[0]"
                data-testid="text-title"
              >
                <span className="text-white">TATA IPL 2025 </span>
                <span className="text-[#fe6804]">Player Auction</span>
              </h1>
            </div>

            {/* Navigation and Brand */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
              <nav 
                className="flex items-center gap-1 md:gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide"
                aria-label="Primary navigation"
                role="navigation"
              >
                <ul className="flex items-center gap-1 md:gap-2 min-w-max" role="tablist">
                  {navigationTabs.map((tab) => (
                    <li key={tab.id} role="none">
                      <div>
                        <Button
                          variant="ghost"
                          role="tab"
                          aria-selected={activeTab === tab.id}
                          aria-controls={`panel-${tab.id}`}
                          data-testid={`button-tab-${tab.id}`}
                          className={`h-auto px-2 md:px-3 lg:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#fe6804] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18184a] whitespace-nowrap ${
                            activeTab === tab.id
                              ? "bg-[linear-gradient(180deg,rgba(255,107,0,1)_0%,rgba(239,65,35,1)_100%)] text-white border-b-2 border-[#fe6804]"
                              : "bg-white/10 border border-[#90b6ff] text-white hover:text-white hover:bg-white/20 hover:border-[#fe6804]/50"
                          }`}
                          onClick={() => setActiveTab(tab.id)}
                        >
                          {tab.label}
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </nav>

            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Section */}
      <section className="w-full bg-[#18184a] p-4 sm:p-6 md:p-8 lg:p-[30px_47px] pt-6 md:pt-8">
        <div className="w-full bg-wwwiplt20comconcrete-80 rounded-[16px] md:rounded-[22.47px] backdrop-blur-[28.09px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(28.09px)_brightness(100%)] p-4 sm:p-6 md:p-[22px]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              id={`panel-${activeTab}`} 
              role="tabpanel" 
              aria-labelledby={`tab-${activeTab}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </motion.div>
  );
};
