import React from 'react';
import { SignalData, SignalSeverity } from '../types';
import { 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  UserX, 
  CheckCircle2, 
  Layers, 
  Calendar, 
  CreditCard,
  Flame,
  Activity
} from 'lucide-react';

interface SignalCardProps {
  signal: SignalData;
}

export const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  const getIcon = () => {
    switch (signal.id) {
      case 'usage':
        return <Activity className="w-4 h-4" />;
      case 'support':
        return <AlertTriangle className="w-4 h-4" />;
      case 'championChange':
        return <UserX className="w-4 h-4" />;
      case 'adoption':
        return <Layers className="w-4 h-4" />;
      case 'execEngagement':
        return <Calendar className="w-4 h-4" />;
      case 'commercial':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getSeverityStyle = (severity: SignalSeverity) => {
    switch (severity) {
      case 'critical':
        return {
          cardBorder: 'border-[#232B38] hover:border-[#F87171]/40',
          badge: 'bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30',
          iconColor: 'text-[#F87171]',
          sparkStroke: '#F87171',
          label: 'CRITICAL'
        };
      case 'warning':
        return {
          cardBorder: 'border-[#232B38] hover:border-[#FBBF24]/40',
          badge: 'bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30',
          iconColor: 'text-[#FBBF24]',
          sparkStroke: '#FBBF24',
          label: 'WARNING'
        };
      case 'healthy':
        return {
          cardBorder: 'border-[#232B38] hover:border-[#34D399]/40',
          badge: 'bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30',
          iconColor: 'text-[#34D399]',
          sparkStroke: '#34D399',
          label: 'OPTIMAL'
        };
    }
  };

  const theme = getSeverityStyle(signal.severity);

  // Generate SVG path for 12-point sparkline
  const generateSparklinePath = (points: number[]) => {
    if (!points || points.length === 0) return '';
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 100;
    const height = 24;
    const padding = 2;

    const coords = points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      // Invert Y because SVG 0 is top
      const y = height - padding - ((p - min) / range) * (height - 2 * padding);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${coords.join(' L ')}`;
  };

  const sparkPath = generateSparklinePath(signal.sparkline);

  return (
    <div
      className={`surface-card p-4 flex flex-col justify-between transition-all duration-200 bg-[#141A24] border rounded-xl ${theme.cardBorder}`}
    >
      <div>
        {/* Header with Icon and Severity Badge */}
        <div className="flex justify-between items-start mb-2">
          <div className={`p-1.5 rounded-lg bg-[#0D1C2D] border border-[#232B38] ${theme.iconColor}`}>
            {getIcon()}
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wide ${theme.badge}`}>
              {theme.label}
            </span>
            <span className="text-[11px] font-mono text-[#bacac5]">
              −{signal.penalty} pts
            </span>
          </div>
        </div>

        {/* Metric Headline */}
        <div className="font-semibold text-xs text-[#d4e4fa] tracking-tight">
          {signal.name}: <span className="font-mono text-[#57f1db]">{signal.value}</span> ({signal.delta})
        </div>

        {/* Detailed Context */}
        <div className="text-[11px] text-[#bacac5] mt-1 leading-relaxed line-clamp-2">
          {signal.description}
        </div>
      </div>

      {/* Sparkline & Benchmark */}
      <div className="mt-3 pt-2 border-t border-[#232B38]/60 flex items-center justify-between gap-3">
        <div className="text-[10px] font-mono text-[#859490] truncate max-w-[120px]">
          Target: {signal.benchmark || 'Optimal'}
        </div>
        <div className="h-6 w-24 shrink-0">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24">
            <path
              d={sparkPath}
              fill="none"
              stroke={theme.sparkStroke}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
