import { motion, AnimatePresence } from 'framer-motion';
import { Check, Image as ImageIcon, Star } from 'lucide-react';
import type { GridTemplate } from '@/types/grid';
import { cn, formatCurrency } from '@/utils/helpers';

type GridSelectorProps = {
  grids: GridTemplate[];
  selectedGridId: string | null;
  onSelect: (gridId: string) => void;
};

export function GridSelector({
  grids,
  selectedGridId,
  onSelect,
}: GridSelectorProps) {
  if (grids.length === 0) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <ImageIcon className="w-24 h-24 text-white/40 mx-auto mb-6" />
        <p className="text-3xl text-white/60 font-light">
          No layouts available for this photo count
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h2
          className="text-4xl font-black text-white mb-2 flex items-center justify-center gap-2"
          animate={{
            textShadow: [
              '0 0 20px rgba(255, 140, 26, 0.5)',
              '0 0 40px rgba(255, 140, 26, 0.7)',
              '0 0 20px rgba(255, 140, 26, 0.5)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Star className="w-8 h-8 text-pixxel-orange" />
          CHOOSE YOUR LAYOUT
          <Star className="w-8 h-8 text-pixxel-orange" />
        </motion.h2>
        <p className="text-xl text-pixxel-orange-light font-light tracking-wide">
          Pick your favorite style!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {grids.map((grid) => {
          const isSelected = selectedGridId === grid.id;

          // Divide slots into strips (Left: x < 50, Right: x >= 50)
          const leftSlots = grid.slots.filter(s => s.x < 50).sort((a, b) => a.y - b.y);
          const rightSlots = grid.slots.filter(s => s.x >= 50).sort((a, b) => a.y - b.y);

          return (
            <motion.button
              key={grid.id}
              onClick={() => onSelect(grid.id)}
              whileHover={{
                scale: 1.05,
                y: -12,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative rounded-[32px] border-4 transition-all duration-300',
                'overflow-hidden backdrop-blur-md min-h-[450px] flex flex-col',
                isSelected
                  ? 'bg-gradient-to-br from-pixxel-orange/30 to-pixxel-amber/30 border-pixxel-orange ring-4 ring-pixxel-orange/20'
                  : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
              )}
              style={isSelected ? {
                boxShadow: '0 0 50px rgba(255, 140, 26, 0.4), 0 20px 60px rgba(0,0,0,0.5)',
              } : {}}
            >
              {/* Camera Count Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-black text-white">{grid.stillCount}</span>
              </div>

              {/* Selection Indicator */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-4 right-4 z-20 w-12 h-12 bg-pixxel-orange rounded-full flex items-center justify-center shadow-lg shadow-pixxel-orange/50"
                  >
                    <Check className="w-7 h-7 text-white" strokeWidth={4} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tilted Strips Container */}
              <div className="flex-1 relative flex items-center justify-center p-8 mt-12 overflow-hidden">
                <div className="relative w-full h-[320px] flex items-center justify-center gap-4">

                  {/* Left Strip */}
                  <motion.div
                    className="flex flex-col gap-3 p-2 bg-white rounded-2xl shadow-2xl relative z-10"
                    style={{
                      rotate: -6,
                      translateY: -20,
                      width: '45%'
                    }}
                  >
                    {leftSlots.length > 0 ? leftSlots.map((slot, i) => (
                      <div
                        key={slot.id}
                        className="w-full aspect-square bg-[#121826] rounded-lg border-2 border-white/10 flex items-center justify-center relative overflow-hidden"
                      >
                        <span className="text-white/20 text-4xl font-black">{i + 1}</span>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                      </div>
                    )) : (
                      <div className="w-full aspect-square bg-[#121826] rounded-lg border-2 border-white/10 flex items-center justify-center opacity-30">
                        <span className="text-white/10 text-4xl font-black">?</span>
                      </div>
                    )}
                  </motion.div>

                  {/* Right Strip */}
                  <motion.div
                    className="flex flex-col gap-3 p-2 bg-white rounded-2xl shadow-2xl relative z-0"
                    style={{
                      rotate: 6,
                      translateY: 20,
                      marginLeft: '-10%',
                      width: '45%'
                    }}
                  >
                    {rightSlots.length > 0 ? rightSlots.map((slot, i) => (
                      <div
                        key={slot.id}
                        className="w-full aspect-square bg-[#121826] rounded-lg border-2 border-white/10 flex items-center justify-center relative overflow-hidden"
                      >
                        <span className="text-white/20 text-4xl font-black">{leftSlots.length + i + 1}</span>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                      </div>
                    )) : (
                      // Handle case where right strip might be empty (e.g. single photo grids)
                      // Show dummy slots to keep the "tilted strip" look if requested
                      [1, 2].map(n => (
                        <div key={n} className="w-full aspect-square bg-[#121826] rounded-lg border-2 border-white/10 flex items-center justify-center opacity-30">
                          <span className="text-white/10 text-4xl font-black">?</span>
                        </div>
                      ))
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Grid Info Section */}
              <div className="p-6 bg-black/40 backdrop-blur-md mt-auto border-t border-white/10">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1 tracking-tight">
                      {grid.name}
                    </h3>
                    <p className="text-pixxel-orange font-bold text-lg">
                      {grid.stillCount} Photo Slots
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/50 text-sm font-bold mb-1 uppercase tracking-widest">Price</p>
                    <span className="text-3xl font-black text-white">
                      {formatCurrency(grid.price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Glow for Selection */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-[32px] pointer-events-none"
                  animate={{
                    boxShadow: [
                      'inset 0 0 20px rgba(255, 140, 26, 0.2)',
                      'inset 0 0 40px rgba(255, 140, 26, 0.4)',
                      'inset 0 0 20px rgba(255, 140, 26, 0.2)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Fun Instruction */}
      <motion.p
        className="text-center text-2xl text-white/70 font-light"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ⚡ Tap your favorite layout ⚡
      </motion.p>
    </div>
  );
}
