import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const CountdownTimer = ({ targetDate, label = 'Starts In' }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    if (!targetDate) return null;
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#15803D]/10 border border-[#15803D]/30 text-xs font-semibold text-[#15803D]">
        <span className="w-2 h-2 rounded-full bg-[#15803D] animate-ping" />
        Live or Ongoing
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-[#FAF9F7] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838]">
      <div className="flex items-center gap-1 text-[11px] font-bold text-[#800020] dark:text-[#D9A0AE] px-1 uppercase tracking-wider">
        <Clock className="w-3.5 h-3.5 text-[#C5A46D]" />
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex flex-col items-center justify-center px-2 py-1 rounded-lg bg-[#800020] text-white min-w-[34px]">
          <span className="text-xs font-bold leading-none">{timeLeft.days}</span>
          <span className="text-[9px] uppercase tracking-wider text-rose-200">d</span>
        </div>
        <span className="text-[#800020] font-bold text-xs">:</span>
        <div className="flex flex-col items-center justify-center px-2 py-1 rounded-lg bg-[#800020] text-white min-w-[34px]">
          <span className="text-xs font-bold leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-[9px] uppercase tracking-wider text-rose-200">h</span>
        </div>
        <span className="text-[#800020] font-bold text-xs">:</span>
        <div className="flex flex-col items-center justify-center px-2 py-1 rounded-lg bg-[#800020] text-white min-w-[34px]">
          <span className="text-xs font-bold leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-[9px] uppercase tracking-wider text-rose-200">m</span>
        </div>
        <span className="text-[#800020] font-bold text-xs">:</span>
        <div className="flex flex-col items-center justify-center px-2 py-1 rounded-lg bg-[#111111] text-[#C5A46D] min-w-[34px]">
          <span className="text-xs font-bold leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="text-[9px] uppercase tracking-wider text-[#A3A3A3]">s</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
