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
      <DialogContent className="w-[280px] sm:w-[320px] md:w-[400px] lg:w-[480px] xl:w-[600px] 2xl:w-[700px] max-h-[95vh] sm:max-h-[90vh] mx-auto bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden p-0 shadow-2xl">
        {/* Header */}
        <DialogHeader className="sr-only">
          <DialogTitle>{player.name} Details</DialogTitle>
          <DialogDescription>Player information and statistics</DialogDescription>
        </DialogHeader>

        
        {/* Player Details Content */}
        <div className="flex flex-col max-h-full overflow-y-auto p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-10 text-center space-y-4 sm:space-y-5 xl:space-y-6 2xl:space-y-7">
          {/* Player Name */}
          <motion.div 
            className="flex-shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white" data-testid="text-player-name">
              {player.name}
            </h2>
            
            {/* Country and Role */}
            <p className="text-sm sm:text-base md:text-lg xl:text-xl text-white/60 mt-2" data-testid="text-player-info">
              {player.nation} • {player.role}
            </p>
          </motion.div>

          {/* Player Image */}
          <motion.div 
            className="flex justify-center flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="relative w-28 h-28 xs:w-32 xs:h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 xl:w-52 xl:h-52 2xl:w-56 2xl:h-56 overflow-hidden rounded-full bg-white/5 border border-white/10">
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
              <div className={`${hasImage ? 'hidden' : 'flex'} absolute inset-0 items-center justify-center bg-white/5 text-white/70 font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl`}>
                {player.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            className="grid grid-cols-2 gap-3 sm:gap-4 xl:gap-5 2xl:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {/* Age */}
            <div className="text-center bg-white/5 rounded-xl p-3 sm:p-4 xl:p-5 2xl:p-6 border border-white/10">
              <p className="text-white/50 text-xs sm:text-sm xl:text-base uppercase tracking-wider font-medium">Age</p>
              <p className="text-white text-lg sm:text-xl md:text-2xl xl:text-3xl font-bold mt-1">{player.age || 'N/A'}</p>
            </div>
            
            {/* Matches */}
            <div className="text-center bg-white/5 rounded-xl p-3 sm:p-4 xl:p-5 2xl:p-6 border border-white/10">
              <p className="text-white/50 text-xs sm:text-sm xl:text-base uppercase tracking-wider font-medium">Matches</p>
              <p className="text-white text-lg sm:text-xl md:text-2xl xl:text-3xl font-bold mt-1">{player.t20Matches || 'N/A'}</p>
            </div>
          </motion.div>

          {/* Price and Points Grid */}
          <motion.div 
            className="grid grid-cols-2 gap-3 sm:gap-4 xl:gap-5 2xl:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {/* Base Price */}
            <div className="bg-white/5 rounded-xl p-3 sm:p-4 xl:p-5 2xl:p-6 text-center border border-white/10">
              <p className="text-white/50 text-xs sm:text-sm xl:text-base uppercase tracking-wider font-medium">Base Price</p>
              <p className="text-white text-lg sm:text-xl md:text-2xl xl:text-3xl font-bold mt-1" data-testid="text-base-price">
                ₹{formatCurrency(player.basePrice)}
              </p>
            </div>

            {/* Points */}
            <div className="bg-white/5 rounded-xl p-3 sm:p-4 xl:p-5 2xl:p-6 text-center border border-white/10">
              <p className="text-white/50 text-xs sm:text-sm xl:text-base uppercase tracking-wider font-medium">Points</p>
              <p className="text-white text-lg sm:text-xl md:text-2xl xl:text-3xl font-bold mt-1" data-testid="text-points">
                {player.points || 0}
              </p>
            </div>
          </motion.div>

          {/* Final Bid Price if sold */}
          {player.status === 'sold' && player.soldPrice > 0 && (
            <div className="bg-emerald-500/10 rounded-xl border border-emerald-500/20 p-4 sm:p-5 xl:p-6 2xl:p-7 text-center">
              <p className="text-emerald-400 text-base sm:text-lg md:text-xl xl:text-2xl font-bold mb-1" data-testid="text-sold-price">
                Sold for: ₹{formatCurrency(player.soldPrice)}
              </p>
              <p className="text-emerald-300/80 text-sm sm:text-base xl:text-lg" data-testid="text-team">
                {player.team}
              </p>
            </div>
          )}

          {/* Overseas indicator */}
          {player.overseas && (
            <div className="flex justify-center">
              <span className="inline-flex items-center px-4 sm:px-5 xl:px-6 py-2 xl:py-2.5 rounded-full text-xs sm:text-sm xl:text-base font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Overseas Player
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};