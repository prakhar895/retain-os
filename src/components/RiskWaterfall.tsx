import React from 'react';
import { WaterfallItem } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface RiskWaterfallProps {
  waterfall: WaterfallItem[];
  totalPenalties: number;
}

export const RiskWaterfall: React.FC<RiskWaterfallProps> = ({ waterfall, totalPenalties }) => {
  // Filter only items with penalty > 0 for high-signal view, or show all for full auditability
  const activeItems = waterfall.filter(item => item.penalty > 0);

  const getBarColor = (severity: string, penalty: number) => {
    if (penalty >= 15) return '#F87171'; // Critical red
    if (penalty >= 8) return '#FBBF24'; // Warning amber
    return '#64748B'; // Muted slate grey for low penalty
  };

  return (
    <div className="surface-card px-5 py-3.5 bg-[#141A24] border border-[#232B38] rounded-xl select-none">
      <div className="flex items-center justify-between mb-2.5">
        <div>
          <h3 className="text-sm font-semibold text-[#d4e4fa] tracking-tight">
            What is driving this score
          </h3>
          <p className="text-[11px] text-[#bacac5] mt-0.5">
            100 base score − {totalPenalties} total risk penalties = {Math.max(0, 100 - totalPenalties)} health score
          </p>
        </div>
        <span className="text-[11px] font-mono text-[#bacac5] bg-[#0D1C2D] px-2 py-0.5 rounded border border-[#232B38]">
          Sorted by impact
        </span>
      </div>

      <div className="space-y-1.5">
        {waterfall.map((item) => {
          // Max possible penalty across categories is 30 for usage
          const maxScale = 30;
          const barWidthPercent = Math.min(100, Math.max(2, (item.penalty / maxScale) * 100));
          const isCritical = item.penalty >= 15;
          const isWarning = item.penalty >= 8 && item.penalty < 15;

          return (
            <div key={item.id} className="flex items-center gap-3 group">
              {/* Category Label */}
              <div className="w-36 text-right text-[11px] font-medium text-[#bacac5] group-hover:text-[#d4e4fa] transition-colors truncate">
                {item.label}
              </div>

              {/* Bar track */}
              <div className="flex-1 h-4 bg-[#0D1C2D] rounded border border-[#232B38] overflow-hidden relative flex items-center">
                <div
                  className="h-full rounded-sm transition-all duration-500 ease-out flex items-center px-1.5"
                  style={{
                    width: `${item.penalty > 0 ? barWidthPercent : 0}%`,
                    backgroundColor: item.penalty > 0 ? getBarColor(item.severity, item.penalty) : 'transparent',
                    opacity: isCritical ? 0.95 : (isWarning ? 0.85 : 0.7)
                  }}
                />
                {item.penalty === 0 && (
                  <span className="text-[10px] font-mono text-[#34D399] pl-2 leading-none">
                    0 pts (Optimal)
                  </span>
                )}
              </div>

              {/* Penalty Value */}
              <div className="w-10 text-right text-xs font-mono font-bold">
                {item.penalty > 0 ? (
                  <span className={isCritical ? 'text-[#F87171]' : (isWarning ? 'text-[#FBBF24]' : 'text-[#bacac5]')}>
                    −{item.penalty}
                  </span>
                ) : (
                  <span className="text-[#34D399]">0</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
