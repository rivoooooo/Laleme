
import React, { useState } from 'react';
import { PoopRecord, BristolType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon 
} from 'lucide-react';

interface PoopCalendarProps {
  records: PoopRecord[];
  t: any;
}

type ViewType = 'week' | 'month' | 'year';

const StatusBlock: React.FC<{ type: BristolType; className?: string }> = ({ type, className }) => {
  // 1-2: Constipation (Amber), 3-4: Ideal (Green), 5-7: Loose (Yellow)
  let bgColor = 'bg-green-500';
  if (type <= 2) bgColor = 'bg-amber-700';
  else if (type >= 5) bgColor = 'bg-yellow-500';
  
  return (
    <div className={`w-full h-1.5 rounded-full ${bgColor} ${className}`} />
  );
};

const PoopCalendar: React.FC<PoopCalendarProps> = ({ records, t }) => {
  const [viewType, setViewType] = useState<ViewType>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const navigate = (direction: number) => {
    const next = new Date(currentDate);
    if (viewType === 'week') next.setDate(next.getDate() + direction * 7);
    else if (viewType === 'month') next.setMonth(next.getMonth() + direction);
    else next.setFullYear(next.getFullYear() + direction);
    setCurrentDate(next);
  };

  const resetToToday = () => setCurrentDate(new Date());

  const getRecordsForDate = (date: Date) => {
    return records.filter(r => {
      const d = new Date(r.timestamp);
      return d.getFullYear() === date.getFullYear() &&
             d.getMonth() === date.getMonth() &&
             d.getDate() === date.getDate();
    });
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    return (
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {Array.from({ length: 7 }).map((_, i) => {
          const day = new Date(startOfWeek);
          day.setDate(startOfWeek.getDate() + i);
          const isToday = day.getTime() === today.getTime();
          const dayRecords = getRecordsForDate(day);

          return (
            <div 
              key={i} 
              className={`flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all min-h-[100px] sm:min-h-[120px] ${
                isToday 
                ? 'bg-[var(--md-sys-color-primary)]/10 ring-2 ring-[var(--md-sys-color-primary)]' 
                : 'bg-gray-50/50 dark:bg-gray-800/30'
              }`}
            >
              <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase mb-2">
                {day.toLocaleDateString(t.language === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'short' })}
              </span>
              <span className={`text-lg sm:text-xl font-black mb-3 sm:mb-4 ${isToday ? 'text-[var(--md-sys-color-primary)]' : 'text-gray-700 dark:text-gray-200'}`}>
                {day.getDate()}
              </span>
              <div className="flex flex-col gap-1 w-full px-0.5 sm:px-1">
                {dayRecords.map(r => (
                  <StatusBlock key={r.id} type={r.bristolType} />
                ))}
                {dayRecords.length === 0 && <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full opacity-10" />}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    return (
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {(t.language === 'zh' ? ['日', '一', '二', '三', '四', '五', '六'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S']).map(d => (
          <div key={d} className="text-center text-[9px] sm:text-[10px] font-black text-gray-300 py-1 sm:py-2">{d}</div>
        ))}
        {Array.from({ length: 42 }).map((_, i) => {
          const dayNum = i - startOffset + 1;
          if (dayNum < 1 || dayNum > daysInMonth) return <div key={i} className="aspect-square opacity-0"></div>;
          
          const day = new Date(year, month, dayNum);
          const isToday = day.getTime() === today.getTime();
          const dayRecords = getRecordsForDate(day);
          
          return (
            <div 
              key={i} 
              className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-all ${
                isToday 
                ? 'bg-[var(--md-sys-color-primary)] text-white shadow-lg' 
                : 'bg-gray-50/50 dark:bg-gray-800/20 text-gray-400'
              }`}
            >
              <span className="text-[10px] sm:text-xs font-black">{dayNum}</span>
              <div className="flex flex-wrap justify-center gap-0.5 mt-0.5 sm:mt-1 w-full px-0.5 sm:px-1">
                {dayRecords.slice(0, 3).map(r => (
                  <div key={r.id} className={`w-0.5 sm:w-1 h-0.5 sm:h-1 rounded-full ${isToday ? 'bg-white' : 'bg-[var(--md-sys-color-primary)]'}`} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderYearView = () => {
    const months = Array.from({ length: 12 });
    return (
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {months.map((_, mIdx) => {
          const monthDate = new Date(currentDate.getFullYear(), mIdx, 1);
          const monthRecords = records.filter(r => new Date(r.timestamp).getMonth() === mIdx && new Date(r.timestamp).getFullYear() === currentDate.getFullYear());
          return (
            <div key={mIdx} className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl p-3 sm:p-4 text-center">
              <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 sm:mb-2">
                {monthDate.toLocaleDateString(t.language === 'zh' ? 'zh-CN' : 'en-US', { month: 'short' })}
              </div>
              <div className="text-xl sm:text-2xl font-black text-[var(--md-sys-color-primary)]">{monthRecords.length}</div>
              <div className="text-[7px] sm:text-[8px] font-bold text-gray-300 uppercase tracking-tighter mt-1">{t.hits}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Navigation */}
      <div className="flex flex-col justify-between items-center gap-4 sm:gap-6 border-b border-vintage-border dark:border-gray-800 pb-6 sm:pb-8">
        <div className="flex items-center gap-3">
          <div className="p-1.5 sm:p-2 bg-[var(--md-sys-color-primary)]/10 rounded-lg text-[var(--md-sys-color-primary)]">
            <CalendarIcon size={18} />
          </div>
          <h3 className="text-base sm:text-lg font-black tracking-tight text-gray-800 dark:text-gray-100">
            {currentDate.toLocaleDateString(t.language === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: viewType !== 'year' ? 'long' : undefined })}
          </h3>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* View Switcher */}
          <div className="flex bg-gray-100 dark:bg-gray-900/50 p-1 rounded-full border border-vintage-border dark:border-gray-800">
            {(['week', 'month', 'year'] as ViewType[]).map(v => (
              <button
                key={v}
                onClick={() => setViewType(v)}
                className={`px-4 sm:px-5 py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
                  viewType === v ? 'bg-white dark:bg-gray-700 shadow-sm text-vintage-ink dark:text-white' : 'text-gray-400'
                }`}
              >
                {t[`view${v.charAt(0).toUpperCase() + v.slice(1)}`]}
              </button>
            ))}
          </div>
          
          {/* Nav Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400">
              <ChevronLeft size={18} />
            </button>
            <button onClick={resetToToday} className="px-3 sm:px-4 py-1.5 text-[9px] sm:text-[10px] font-black uppercase bg-vintage-paper dark:bg-gray-800 border border-vintage-border dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm whitespace-nowrap">
              {t.today}
            </button>
            <button onClick={() => navigate(1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewType}-${currentDate.getTime()}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="min-h-[260px] sm:min-h-[300px]"
        >
          {viewType === 'week' && renderWeekView()}
          {viewType === 'month' && renderMonthView()}
          {viewType === 'year' && renderYearView()}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div className="flex justify-center flex-wrap gap-4 sm:gap-8 pt-6 border-t border-vintage-border/30">
        <div className="flex items-center gap-2">
           <div className="w-6 sm:w-8 h-1.5 sm:h-2 rounded-full bg-amber-700" />
           <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.slow}</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-6 sm:w-8 h-1.5 sm:h-2 rounded-full bg-green-500" />
           <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.ideal}</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-6 sm:w-8 h-1.5 sm:h-2 rounded-full bg-yellow-500" />
           <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.loose}</span>
        </div>
      </div>
    </div>
  );
};

export default PoopCalendar;
