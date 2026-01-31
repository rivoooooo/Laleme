
import React, { useEffect, useRef } from 'react';
import { PoopRecord } from '../types';
import { locales } from '../locales';

interface GithubCalendarProps {
  records: PoopRecord[];
  lang: 'zh' | 'en';
}

const GithubCalendar: React.FC<GithubCalendarProps> = ({ records, lang }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = locales[lang];

  // Generate last 365 days
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  const days = Array.from({ length: 365 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (364 - i));
    return d;
  });

  // Auto-scroll to the end (today) on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  const getCountForDay = (date: Date) => {
    return records.filter(r => {
      const rd = new Date(r.timestamp);
      return rd.getFullYear() === date.getFullYear() &&
             rd.getMonth() === date.getMonth() &&
             rd.getDate() === date.getDate();
    }).length;
  };

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count === 1) return 'bg-[var(--md-sys-color-primary)] opacity-30';
    if (count === 2) return 'bg-[var(--md-sys-color-primary)] opacity-60';
    return 'bg-[var(--md-sys-color-primary)] opacity-100';
  };

  return (
    <div className="flex flex-col">
      {/* Scrollable grid area */}
      <div 
        ref={scrollRef}
        className="overflow-x-auto pb-4 polaroid-scrollbar cursor-grab active:cursor-grabbing"
      >
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 w-max px-1 pt-1">
          {days.map((day, idx) => {
            const count = getCountForDay(day);
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div
                key={idx}
                title={`${day.toLocaleDateString()}: ${count}`}
                className={`w-3.5 h-3.5 rounded-sm ${getColor(count)} transition-all hover:scale-125 cursor-help ${isToday ? 'ring-2 ring-offset-1 ring-[var(--md-sys-color-primary)] dark:ring-offset-gray-900' : ''}`}
              />
            );
          })}
        </div>
      </div>

      {/* Fixed legend area - Outside the scroll div */}
      <div className="flex justify-between items-center text-[9px] font-black text-gray-300 dark:text-gray-600 px-1 uppercase tracking-widest pt-4 border-t border-vintage-border/50 dark:border-gray-800/50 mt-2">
        <span>{t.min}</span>
        <div className="flex gap-1.5 items-center">
          <div className="w-2.5 h-2.5 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-[var(--md-sys-color-primary)] opacity-30 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-[var(--md-sys-color-primary)] opacity-60 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-[var(--md-sys-color-primary)] rounded-sm"></div>
          <span className="ml-1">{t.max}</span>
        </div>
      </div>
    </div>
  );
};

export default GithubCalendar;
