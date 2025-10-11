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
        <div className="flex flex-col p-5 sm:p-6 md:p-8">
          {/* Player Name and Info - Centered */}
          <motion.div 
            className="text-center mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3" data-testid="text-player-name">
              {player.name}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-white/80" data-testid="text-player-info">
              {player.nation} - {player.role}
            </p>
          </motion.div>

          {/* Two Column Layout: Image Left, Stats Right */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10 items-center md:items-center">
            
            {/* Player Image - Left Side */}
            <motion.div 
              className="flex justify-center flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 overflow-hidden bg-white/5 border-2 border-white/10">
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
                <div className={`${hasImage ? 'hidden' : 'flex'} absolute inset-0 items-center justify-center bg-white/5 text-white/70 font-bold text-4xl sm:text-5xl md:text-6xl`}>
                  {player.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </div>
              </div>
            </motion.div>

            {/* Stats - Right Side */}
            <motion.div 
              className="flex-1 flex flex-col justify-center space-y-5 md:space-y-6 w-full md:w-auto text-center md:text-left"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {/* Age and Matches - Same Line */}
              <div className="flex justify-center md:justify-start gap-8 md:gap-12 flex-wrap">
                <div>
                  <p className="text-white text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold">
                    Age: {player.age || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-white text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold">
                    Matches: {player.t20Matches || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Base Price */}
              <div>
                <p className="text-white text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold" data-testid="text-base-price">
                  Base Price: {formatCurrency(player.basePrice)}
                </p>
              </div>

              {/* Points */}
              <div>
                <p className="text-white text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold" data-testid="text-points">
                  Points: {player.points || 0}
                </p>
              </div>

              {/* Sold Price if applicable */}
              {player.status === 'sold' && player.soldPrice > 0 && (
                <div className="mt-2">
                  <p className="text-emerald-400 text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold" data-testid="text-sold-price">
                    Sold for: ₹{formatCurrency(player.soldPrice)}
                  </p>
                  <p className="text-emerald-300/80 text-lg sm:text-xl md:text-xl mt-2" data-testid="text-team">
                    {player.team}
                  </p>
                </div>
              )}

              {/* Overseas indicator */}
              {player.overseas && (
                <div className="flex justify-center md:justify-start mt-2">
                  <span className="inline-flex items-center px-5 py-2 rounded-full text-sm sm:text-base font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
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