import React from 'react';
import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  ComposedChart,
  ReferenceLine
} from 'recharts';
import { ProjectionDataPoint } from '../lib/playbookEngine';
import { ShieldCheck, Calendar, TrendingDown, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

interface ProjectionChartProps {
  data: ProjectionDataPoint[];
  currentHealth: number;
  projectedHealth: number;
  baselineHealth: number;
  recoveryPoints: number;
  saveProbability: number;
  renewalDays?: number;
  renewalDate?: string;
  enabledPlaysCount?: number;
  totalPlaysCount?: number;
}

export const ProjectionChart: React.FC<ProjectionChartProps> = ({
  data,
  currentHealth,
  projectedHealth,
  baselineHealth,
  recoveryPoints,
  saveProbability,
  renewalDays = 28,
  renewalDate = 'Nov 18, 2026',
  enabledPlaysCount = 0,
  totalPlaysCount = 3
}) => {
  // Identify renewal point and final horizon point
  const renewalPoint = data.find(p => p.isRenewal) || (data.length > 0 ? data[Math.min(data.length - 1, 4)] : null);
  const netGainOverBaseline = projectedHealth - baselineHealth;
  const renewalXKey = renewalPoint ? renewalPoint.day : `+${renewalDays}d`;

  return (
    <div className="bg-[#0D1C2D] border border-[#232B38] rounded-xl p-3.5 select-none shadow-lg relative overflow-hidden transition-all duration-300">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#2DD4BF]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Metric Strip */}
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2DD4BF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2DD4BF]"></span>
            </span>
            <span className="text-[11px] font-mono font-semibold text-[#d4e4fa] uppercase tracking-wider flex items-center gap-1.5">
              <span>Renewal Trajectory Simulation</span>
            </span>
          </div>

          {/* Renewal Date Pill */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#141A24] border border-[#FBBF24]/40 rounded text-[10px] font-mono text-[#FBBF24] shadow-sm">
            <Calendar className="w-3 h-3" />
            <span>Renewal: {renewalDate} ({renewalDays}d)</span>
          </div>
        </div>

        {/* Dynamic Outcome Banner comparing Baseline vs Enabled Plays */}
        <div className="grid grid-cols-2 gap-2 bg-[#09131F] p-2.5 rounded-lg border border-[#232B38]/80 text-[11px]">
          {/* Baseline Outcome */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-[10px] font-mono text-[#859490]">
              <TrendingDown className="w-3 h-3 text-[#F87171]" />
              <span>Baseline (No Action)</span>
            </div>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className="text-sm font-mono font-bold text-[#F87171]">
                {baselineHealth}/100
              </span>
              <span className="text-[10px] text-[#859490]">
                (-{currentHealth - baselineHealth} pts)
              </span>
            </div>
          </div>

          {/* Projected Recovery Outcome */}
          <div className="flex flex-col border-l border-[#232B38] pl-2.5">
            <div className="flex items-center gap-1 text-[10px] font-mono text-[#2DD4BF]">
              <TrendingUp className="w-3 h-3 text-[#2DD4BF]" />
              <span>Projected ({enabledPlaysCount}/{totalPlaysCount} Plays Active)</span>
            </div>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className="text-sm font-mono font-bold text-[#2DD4BF] transition-all duration-300">
                {projectedHealth}/100
              </span>
              <span className="text-[10px] font-mono font-semibold text-[#57f1db] transition-all duration-300">
                {recoveryPoints >= 0 ? `+${recoveryPoints}` : recoveryPoints} pts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 12, right: 12, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="projectedGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="day"
              stroke="#859490"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#232B38' }}
              fontFamily="JetBrains Mono"
            />
            <YAxis
              domain={[0, 100]}
              stroke="#859490"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#232B38' }}
              fontFamily="JetBrains Mono"
              ticks={[20, 50, 80]}
            />

            {/* Vertical Renewal Reference Line Annotation */}
            <ReferenceLine
              x={renewalXKey}
              stroke="#FBBF24"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              label={{
                value: `Renewal (${renewalDays}d)`,
                position: 'insideTopRight',
                fill: '#FBBF24',
                fontSize: 9,
                fontFamily: 'JetBrains Mono',
                fontWeight: 600
              }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as ProjectionDataPoint;
                  const isRen = item.isRenewal;
                  const itemDelta = item.projected - item.baseline;

                  return (
                    <div className="bg-[#141A24] border border-[#232B38] p-2.5 rounded-lg text-[11px] font-mono shadow-2xl space-y-1.5 min-w-[170px]">
                      <div className="flex items-center justify-between border-b border-[#232B38] pb-1 text-[#bacac5]">
                        <span className="font-semibold">{item.day} Trajectory</span>
                        {isRen && (
                          <span className="px-1 py-0.2 bg-[#FBBF24]/20 text-[#FBBF24] rounded text-[9px] font-bold">
                            RENEWAL
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 pt-0.5">
                        <div className="flex items-center justify-between text-[#2DD4BF]">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                            Projected:
                          </span>
                          <span className="font-bold">{item.projected}/100</span>
                        </div>

                        <div className="flex items-center justify-between text-[#F87171]">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F87171]" />
                            Baseline:
                          </span>
                          <span>{item.baseline}/100</span>
                        </div>

                        {itemDelta > 0 && (
                          <div className="flex items-center justify-between text-[#57f1db] text-[10px] border-t border-[#232B38]/60 pt-1">
                            <span>Intervention Uplift:</span>
                            <span className="font-bold">+{itemDelta} pts</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Area Fill for Active Recovery from Enabled Plays */}
            <Area
              type="monotone"
              dataKey="projected"
              fill="url(#projectedGlow)"
              stroke="none"
              isAnimationActive={true}
              animationDuration={600}
              animationEasing="ease-in-out"
            />

            {/* Dashed Baseline Series Declining toward Renewal */}
            <Line
              type="monotone"
              dataKey="baseline"
              name="Baseline Decline"
              stroke="#F87171"
              strokeWidth={1.75}
              strokeDasharray="4 4"
              dot={{ r: 2, fill: '#F87171', stroke: '#0D1C2D', strokeWidth: 1 }}
              isAnimationActive={true}
              animationDuration={600}
              animationEasing="ease-in-out"
            />

            {/* Solid Teal Series showing Recovery from Enabled Plays Only */}
            <Line
              type="monotone"
              dataKey="projected"
              name="Recovery from Enabled Plays"
              stroke="#2DD4BF"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#2DD4BF', stroke: '#0B0F17', strokeWidth: 1.5 }}
              activeDot={{ r: 5, fill: '#57f1db', stroke: '#2DD4BF', strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={600}
              animationEasing="ease-in-out"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend & Save Probability Meter */}
      <div className="mt-2.5 pt-2.5 border-t border-[#232B38] flex flex-col gap-2 text-[11px]">
        {/* Legend Row */}
        <div className="flex items-center justify-between text-[10px] font-mono text-[#859490]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 border-t-2 border-dashed border-[#F87171]" />
              <span>Baseline Decline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#2DD4BF] rounded-full" />
              <span className="text-[#d4e4fa]">Enabled Recovery</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[#FBBF24]">
            <span className="w-2 border-t-2 border-dashed border-[#FBBF24]" />
            <span>Renewal</span>
          </div>
        </div>

        {/* Probability & Net Gain Bar */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[#bacac5] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>Account Save Probability</span>
          </span>
          <div className="flex items-center gap-2">
            {netGainOverBaseline > 0 && (
              <span className="text-[10px] font-mono text-[#34D399] font-medium">
                +{netGainOverBaseline} pt advantage
              </span>
            )}
            <span className="font-mono font-bold text-[#2DD4BF] text-xs transition-all duration-300">
              {saveProbability}%
            </span>
          </div>
        </div>

        {/* Progress Bar for Save Probability */}
        <div className="w-full bg-[#141A24] h-1.5 rounded-full overflow-hidden border border-[#232B38]">
          <div
            className="h-full transition-all duration-500 rounded-full bg-gradient-to-r from-[#2DD4BF] to-[#34D399]"
            style={{ width: `${saveProbability}%` }}
          />
        </div>
      </div>
    </div>
  );
};
