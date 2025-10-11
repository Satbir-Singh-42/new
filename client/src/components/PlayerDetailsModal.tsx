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
      <DialogContent className="w-[280px] sm:w-[320px] md:w-[500px] lg:w-[600px] xl:w-[750px] 2xl:w-[850px] max-h-[95vh] sm:max-h-[90vh] mx-auto bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden p-0 shadow-2xl">
        {/* Header */}
        <DialogHeader className="sr-only">
          <DialogTitle>{player.name} Details</DialogTitle>
          <DialogDescription>Player information and statistics</DialogDescription>
        </DialogHeader>

        
        {/* Player Details Content */}
        <div className="flex flex-col p-4 sm:p-5 md:p-6 xl:p-6">
          {/* Player Name and Info - Centered */}
          <motion.div 
            className="text-center mb-4 sm:mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl font-bold text-white mb-2" data-testid="text-player-name">
              {player.name}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/80" data-testid="text-player-info">
              {player.nation} - {player.role}
            </p>
          </motion.div>

          {/* Two Column Layout: Image Left, Stats Right */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start">
            
            {/* Player Image - Left Side */}
            <motion.div 
              className="flex justify-center flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 xl:w-56 xl:h-56 overflow-hidden bg-white/5">
                {hasImage ? (
                  <img
                    src={player.images}
                    alt={player.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`${hasImage ? 'hidden' : 'flex'} absolute inset-0 items-center justify-center bg-white/5 text-white/70 font-bold text-3xl sm:text-4xl md:text-5xl`}>
                  {player.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </div>
              </div>
            </motion.div>

            {/* Stats - Right Side */}
            <motion.div 
              className="flex-1 flex flex-col justify-center space-y-3 sm:space-y-4 w-full md:w-auto text-center md:text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {/* Age and Matches - Same Line */}
              <div className="flex justify-center md:justify-end gap-6 md:gap-8">
                <div>
                  <p className="text-white text-xl sm:text-2xl md:text-3xl font-semibold">
                    Age: <span className="font-bold">{player.age || 'N/A'}</span>
                  </p>
                </div>
                <div>
                  <p className="text-white text-xl sm:text-2xl md:text-3xl font-semibold">
                    Matches: <span className="font-bold">{player.t20Matches || 'N/A'}</span>
                  </p>
                </div>
              </div>

              {/* Base Price - Centered */}
              <div>
                <p className="text-white text-2xl sm:text-3xl md:text-4xl font-bold" data-testid="text-base-price">
                  Base Price: {formatCurrency(player.basePrice)}
                </p>
              </div>

              {/* Points - Centered */}
              <div>
                <p className="text-white text-2xl sm:text-3xl md:text-4xl font-bold" data-testid="text-points">
                  Points: {player.points || 0}
                </p>
              </div>

              {/* Sold Price if applicable */}
              {player.status === 'sold' && player.soldPrice > 0 && (
                <div className="mt-2">
                  <p className="text-emerald-400 text-xl sm:text-2xl md:text-3xl font-bold" data-testid="text-sold-price">
                    Sold for: ₹{formatCurrency(player.soldPrice)}
                  </p>
                  <p className="text-emerald-300/80 text-base sm:text-lg mt-1" data-testid="text-team">
                    {player.team}
                  </p>
                </div>
              )}

              {/* Overseas indicator */}
              {player.overseas && (
                <div className="flex justify-center md:justify-end mt-2">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Overseas Player
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};