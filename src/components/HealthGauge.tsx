import React, { useEffect, useState } from 'react';
import { HealthScoreResult } from '../types';
import { TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

interface HealthGaugeProps {
  scoreResult: HealthScoreResult;
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({ scoreResult }) => {
  const { health, status, trend30d } = scoreResult;
  const [animatedHealth, setAnimatedHealth] = useState(0);

  // Smooth counter and SVG stroke animation
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setAnimatedHealth(health);
      return;
    }

    setAnimatedHealth(0);
    const duration = 600;
    const steps = 30;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedHealth(Math.round(health * eased));

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedHealth(health);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [health]);

  // Circumference for r=38
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76
  const strokeDashoffset = circumference - (animatedHealth / 100) * circumference;

  const getColorTheme = () => {
    switch (status) {
      case 'critical':
        return {
          stroke: '#F87171',
          text: 'text-[#F87171]',
          bgGlow: 'rgba(248, 113, 113, 0.1)',
          label: 'CRITICAL',
          labelBadge: 'bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30'
        };
      case 'warning':
        return {
          stroke: '#FBBF24',
          text: 'text-[#FBBF24]',
          bgGlow: 'rgba(251, 191, 36, 0.1)',
          label: 'WATCH',
          labelBadge: 'bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30'
        };
      case 'healthy':
        return {
          stroke: '#34D399',
          text: 'text-[#34D399]',
          bgGlow: 'rgba(52, 211, 153, 0.1)',
          label: 'HEALTHY',
          labelBadge: 'bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30'
        };
    }
  };

  const theme = getColorTheme();

  return (
    <div className="flex items-center gap-4 select-none">
      <div className="text-right">
        <div className="text-[11px] font-mono uppercase tracking-wider text-[#bacac5]">
          Health Score
        </div>
        <div className={`text-xs font-mono font-medium flex items-center justify-end gap-1 ${trend30d < 0 ? 'text-[#F87171]' : 'text-[#34D399]'}`}>
          {trend30d < 0 ? (
            <TrendingDown className="w-3 h-3" />
          ) : (
            <TrendingUp className="w-3 h-3" />
          )}
          <span>{trend30d > 0 ? `+${trend30d}` : trend30d} pts in 30d</span>
        </div>
        <div className="mt-1">
          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wide ${theme.labelBadge}`}>
            {theme.label}
          </span>
        </div>
      </div>

      {/* SVG Circular Animated Gauge */}
      <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
          {/* Background circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="transparent"
            stroke="#232B38"
            strokeWidth="7"
          />
          {/* Animated score circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="transparent"
            stroke={theme.stroke}
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.1s ease-out',
              filter: `drop-shadow(0 0 6px ${theme.bgGlow})`
            }}
          />
        </svg>

        {/* Center score typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`font-mono text-2xl font-black tracking-tight ${theme.text}`}>
            {animatedHealth}
          </span>
        </div>
      </div>
    </div>
  );
};
