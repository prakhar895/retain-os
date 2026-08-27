import React, { useState } from 'react';
import { Account } from '../types';
import { getScoreExplanation, SignalScoreBreakdown } from '../lib/scoring';
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  MinusCircle, 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon,
  Layers,
  ArrowDownRight
} from 'lucide-react';

interface ScoreExplanationCardProps {
  account: Account;
}

export const ScoreExplanationCard: React.FC<ScoreExplanationCardProps> = ({ account }) => {
  const [isOpen, setIsOpen] = useState(false);
  const explanation = getScoreExplanation(account);

  const getSeverityBadge = (severity: SignalScoreBreakdown['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          icon: <AlertOctagon className="w-3.5 h-3.5 text-[#F87171]" />,
          text: 'text-[#F87171]',
          bg: 'bg-[#F87171]/15 border-[#F87171]/30'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-[#FBBF24]" />,
          text: 'text-[#FBBF24]',
          bg: 'bg-[#FBBF24]/15 border-[#FBBF24]/30'
        };
      case 'healthy':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />,
          text: 'text-[#34D399]',
          bg: 'bg-[#34D399]/15 border-[#34D399]/30'
        };
    }
  };

  return (
    <div className="w-full mt-3 pt-3 border-t border-[#232B38]/80 select-none">
      {/* Accordion Toggle Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-3 rounded-lg bg-[#0D1C2D] hover:bg-[#142335] border border-[#232B38] text-xs transition-colors group cursor-pointer whitespace-nowrap"
      >
        <div className="flex items-center gap-2 min-w-0">
          <HelpCircle className="w-4 h-4 text-[#2DD4BF] shrink-0 group-hover:scale-105 transition-transform" />
          <span className="font-bold text-[#d4e4fa] shrink-0">Explain this score</span>
          <span className="text-[#859490] truncate">
            Base {explanation.baseScore} − {explanation.totalPenalties} deductions = {explanation.health} · from {explanation.signalsBreakdown.length} telemetry signals
          </span>
        </div>

        <div className="shrink-0 ml-3">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-[#2DD4BF]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#859490] group-hover:text-[#d4e4fa]" />
          )}
        </div>
      </button>

      {/* Expandable Explanation Drawer */}
      {isOpen && (
        <div className="mt-2.5 bg-[#09131F] border border-[#232B38] rounded-xl p-3.5 space-y-3.5 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Section Subtitle */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#bacac5] flex items-center gap-1.5 font-medium">
              <Layers className="w-3.5 h-3.5 text-[#2DD4BF]" />
              Signal Penalty Ledger & Weight Allocations
            </span>
            <span className="text-[10px] font-mono text-[#859490]">
              Scoring Model v2.4 · Source: scoring.ts
            </span>
          </div>

          {/* Signals Table */}
          <div className="overflow-x-auto rounded-lg border border-[#232B38]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0D1C2D] border-b border-[#232B38] text-[10px] font-mono uppercase tracking-wider text-[#859490]">
                  <th className="py-2 px-3 font-semibold">Signal & Dimension</th>
                  <th className="py-2 px-2.5 font-semibold text-center">Max Weight</th>
                  <th className="py-2 px-3 font-semibold">Raw Observed Value</th>
                  <th className="py-2 px-3 font-semibold">Delta / Trend</th>
                  <th className="py-2 px-3 font-semibold text-right">Points Deducted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232B38]/60 text-[11px] font-sans">
                {explanation.signalsBreakdown.map((item) => {
                  const badge = getSeverityBadge(item.severity);
                  const isDeducted = item.penalty > 0;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#141E2B] transition-colors"
                    >
                      {/* Signal Name + Description */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="shrink-0">{badge.icon}</span>
                          <div>
                            <div className="font-semibold text-[#d4e4fa]">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-[#859490] font-mono leading-tight">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Max Weight */}
                      <td className="py-2.5 px-2.5 font-mono text-center text-[#bacac5]">
                        <span className="px-1.5 py-0.5 bg-[#141A24] border border-[#232B38] rounded text-[10px]">
                          {item.weight} pts
                        </span>
                      </td>

                      {/* Raw Observed Value */}
                      <td className="py-2.5 px-3 font-mono font-medium text-[#d4e4fa]">
                        {item.rawValue}
                        {item.benchmark && (
                          <div className="text-[9px] text-[#859490] font-sans">
                            Goal: {item.benchmark}
                          </div>
                        )}
                      </td>

                      {/* Delta */}
                      <td className="py-2.5 px-3 font-mono">
                        <span className={badge.text}>
                          {item.delta}
                        </span>
                      </td>

                      {/* Points Deducted */}
                      <td className="py-2.5 px-3 font-mono text-right whitespace-nowrap">
                        {isDeducted ? (
                          <span className="inline-flex items-center gap-1 font-bold text-[#F87171] px-1.5 py-0.5 rounded bg-[#F87171]/10 border border-[#F87171]/20">
                            <MinusCircle className="w-3 h-3 text-[#F87171]" />
                            −{item.penalty} pts
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#34D399] font-medium px-1.5 py-0.5 rounded bg-[#34D399]/10 border border-[#34D399]/20 text-[10px]">
                            0 pts (Healthy)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Mathematical Formula Card */}
          <div className="p-3 bg-[#0D1C2D] border border-[#2DD4BF]/30 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-[#141A24] border border-[#232B38] text-[#2DD4BF] shrink-0">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-[#859490] tracking-wider">
                  Scoring Engine Formula
                </div>
                <div className="font-mono font-semibold text-[#57f1db] text-[11px]">
                  {explanation.formula}
                </div>
              </div>
            </div>

            {/* Arithmetic Evaluation Strip */}
            <div className="flex items-center gap-2 font-mono text-xs bg-[#09131F] px-3 py-1.5 rounded-md border border-[#232B38] self-stretch sm:self-auto justify-between sm:justify-end">
              <span className="text-[#859490]">100</span>
              <span className="text-[#859490]">−</span>
              <span className="text-[#F87171] font-bold">
                ({explanation.signalsBreakdown.filter(s => s.penalty > 0).map(s => s.penalty).join(' + ') || '0'})
              </span>
              <span className="text-[#859490]">=</span>
              <span className="text-[#2DD4BF] font-black text-sm">
                {explanation.health}/100
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
