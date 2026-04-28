'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { getActivityMap, getStreak } from '@/lib/streak';

export default function StreakHeatmap() {
  const activity = getActivityMap();
  const streak = getStreak();

  // Generate last 28 days (4 weeks)
  const days = useMemo(() => {
    const arr = [];
    const today = new Date();
    // Start from the most recent Sunday to keep the grid aligned
    const currentDay = today.getDay(); // 0 is Sunday
    const totalDays = 28;
    
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      arr.push({
        date: str,
        active: !!activity[str],
      });
    }
    return arr;
  }, [activity]);

  return (
    <div className="rounded-2xl border border-white/5 bg-brand-card p-4 shadow-xl shadow-black/20">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted">
          Padhai ki Progress
        </h3>
        <motion.div 
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-orange-400"
        >
          <Flame size={14} className={streak > 0 ? "animate-bounce" : ""} />
          <span className="text-[11px] font-bold">{streak} din ka streak!</span>
        </motion.div>
      </div>
      
      <div className="flex justify-between gap-1">
        {/* We'll render as columns of 7 days */}
        {[0, 1, 2, 3].map((weekIndex) => (
          <div key={weekIndex} className="grid grid-rows-7 gap-1.5">
            {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, i) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (weekIndex * 7 + i) * 0.01 }}
                whileHover={{ scale: 1.3, zIndex: 10 }}
                className={`h-2.5 w-2.5 rounded-[2px] transition-all duration-700 ${
                  day.active 
                    ? 'bg-brand-primary shadow-[0_0_10px_rgba(124,58,237,0.4)]' 
                    : 'bg-white/5'
                }`}
                title={day.date}
              />
            ))}
          </div>
        ))}
      </div>
      
      <div className="mt-3 flex items-center justify-between text-[9px] text-brand-muted/60">
        <span>Pichle 4 hafte</span>
        <div className="flex items-center gap-1">
          <span>Kam</span>
          <div className="h-2 w-2 rounded-[1px] bg-white/5" />
          <div className="h-2 w-2 rounded-[1px] bg-brand-primary/40" />
          <div className="h-2 w-2 rounded-[1px] bg-brand-primary" />
          <span>Zyada</span>
        </div>
      </div>
    </div>
  );
}
