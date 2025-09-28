import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Player } from '@/services/googleSheetsService';

interface PlayerDetailsModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerDetailsModal: React.FC<PlayerDetailsModalProps> = ({ 
  player, 
  isOpen, 
  onClose 
}) => {
  if (!player) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount).replace('₹', '');
  };

  const hasImage = player.images && player.images.trim() !== '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px] xl:max-w-[520px] max-h-[95vh] sm:max-h-[90vh] mx-auto bg-gradient-to-br from-slate-800/95 via-slate-700/90 to-slate-600/85 border-slate-600/50 backdrop-blur-md rounded-xl sm:rounded-2xl overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="sr-only">
          <DialogTitle>{player.name} Details</DialogTitle>
          <DialogDescription>Player information and statistics</DialogDescription>
        </DialogHeader>

        
        {/* Player Details Content */}
        <div className="flex flex-col max-h-full overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 text-center space-y-3 sm:space-y-4">
          {/* Player Name */}
          <motion.div 
            className="flex-shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white" data-testid="text-player-name">
              {player.name}
            </h2>
            
            {/* Country and Role */}
            <p className="text-sm sm:text-base md:text-lg text-white/90 mt-1" data-testid="text-player-info">
              {player.nation} - {player.role}
            </p>
          </motion.div>

          {/* Player Image */}
          <motion.div 
            className="flex justify-center flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="relative w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 overflow-hidden rounded-lg bg-slate-700 border-2 border-white/20">
              {hasImage ? (
                <img
                  src={player.images}
                  alt={player.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`${hasImage ? 'hidden' : 'flex'} absolute inset-0 items-center justify-center bg-slate-700 text-white font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl`}>
                {player.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 bg-slate-800/30 rounded-lg p-2 sm:p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {/* Age */}
            <div className="text-center">
              <p className="text-white/60 text-xs sm:text-sm uppercase tracking-wide">Age</p>
              <p className="text-white text-sm sm:text-base md:text-lg font-semibold">{player.age || 'N/A'}</p>
            </div>
            
            {/* Matches */}
            <div className="text-center">
              <p className="text-white/60 text-xs sm:text-sm uppercase tracking-wide">Matches</p>
              <p className="text-white text-sm sm:text-base md:text-lg font-semibold">{player.t20Matches || 'N/A'}</p>
            </div>
          </motion.div>

          {/* Price and Points Grid */}
          <motion.div 
            className="grid grid-cols-2 gap-2 sm:gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {/* Base Price */}
            <div className="bg-slate-800/30 rounded-lg p-2 sm:p-3 text-center">
              <p className="text-white/60 text-xs sm:text-sm uppercase tracking-wide">Base Price</p>
              <p className="text-white text-sm sm:text-base md:text-lg font-bold" data-testid="text-base-price">
                ₹{formatCurrency(player.basePrice)}
              </p>
            </div>

            {/* Points */}
            <div className="bg-slate-800/30 rounded-lg p-2 sm:p-3 text-center">
              <p className="text-white/60 text-xs sm:text-sm uppercase tracking-wide">Points</p>
              <p className="text-white text-sm sm:text-base md:text-lg font-bold" data-testid="text-points">
                {player.points || 0}
              </p>
            </div>
          </motion.div>

          {/* Final Bid Price if sold */}
          {player.status === 'sold' && player.soldPrice > 0 && (
            <div className="bg-green-600/20 rounded-lg border border-green-500/30 p-2 sm:p-3 text-center">
              <p className="text-green-400 text-sm sm:text-base md:text-lg font-semibold" data-testid="text-sold-price">
                Sold for: ₹{formatCurrency(player.soldPrice)}
              </p>
              <p className="text-green-300 text-xs sm:text-sm" data-testid="text-team">
                Team: {player.team}
              </p>
            </div>
          )}

          {/* Overseas indicator */}
          {player.overseas && (
            <div className="flex justify-center">
              <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-600/20 text-blue-400 border border-blue-500/30">
                Overseas Player
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};