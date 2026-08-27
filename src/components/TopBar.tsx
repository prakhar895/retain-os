import React from 'react';
import { 
  Search, 
  Bell, 
  Command, 
  ShieldAlert,
  Users,
  Activity,
  Calendar
} from 'lucide-react';
import { Account } from '../types';
import { calculateHealthScore } from '../lib/scoring';

interface TopBarProps {
  accounts: Account[];
  onOpenCommandPalette: () => void;
  onFilterAtRisk: () => void;
  activeFilter: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  accounts,
  onOpenCommandPalette,
  onFilterAtRisk,
  activeFilter
}) => {
  // Global aggregate metrics calculation
  const totalArrAtRisk = accounts
    .filter(a => a.signals.usage.severity === 'critical' || a.signals.support.severity === 'critical')
    .reduce((sum, a) => sum + a.arr, 0);

  const atRiskAccountsCount = accounts.filter(
    a => calculateHealthScore(a).health < 50
  ).length;

  const avgHealth = Math.round(
    accounts.reduce((sum, a) => {
      const h = calculateHealthScore(a).health;
      return sum + h;
    }, 0) / accounts.length
  );

  const renewalsIn90Days = accounts.filter(a => a.renewalDays <= 90).length;

  return (
    <header className="h-14 bg-[#122131] border-b border-[#232B38] flex items-center justify-between px-4 lg:px-6 select-none shrink-0 z-30">
      {/* Brand & Search */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2DD4BF] flex items-center justify-center text-[#0B0F17] font-black text-base shadow-[0_0_12px_rgba(45,212,191,0.3)]">
            R
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-[#d4e4fa]">Retain OS</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#1C2B3C] text-[#2DD4BF] border border-[#232B38]">
                B2B CS Command
              </span>
            </div>
          </div>
        </div>

        {/* Search / Command trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-3 bg-[#0B0F17] hover:bg-[#141A24] border border-[#232B38] hover:border-[#2DD4BF]/50 rounded-lg px-3 py-1.5 text-xs text-[#bacac5] transition-all w-60 group text-left"
          title="Search accounts or actions (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-[#859490] group-hover:text-[#2DD4BF]" />
          <span className="flex-1 truncate">Search accounts, plays...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[#141A24] text-[10px] text-[#859490] rounded border border-[#232B38] font-mono">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>
      </div>

      {/* Global KPI Strip (Desktop) */}
      <div className="hidden xl:flex items-center gap-6 h-full border-l border-r border-[#232B38] px-6">
        <button 
          onClick={onFilterAtRisk}
          className="flex flex-col justify-center text-left hover:opacity-80 transition-opacity"
        >
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#bacac5] flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-[#F87171]" />
            ARR at Risk
          </span>
          <span className="font-mono text-sm font-bold text-[#F87171]">
            ${Math.round(totalArrAtRisk / 1000)}K
          </span>
        </button>

        <div className="h-6 w-px bg-[#232B38]" />

        <div className="flex flex-col justify-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#bacac5] flex items-center gap-1">
            <Users className="w-3 h-3 text-[#F87171]" />
            Accounts at Risk
          </span>
          <span className="font-mono text-sm font-bold text-[#F87171]">
            {atRiskAccountsCount}
          </span>
        </div>

        <div className="h-6 w-px bg-[#232B38]" />

        <div className="flex flex-col justify-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#bacac5] flex items-center gap-1">
            <Activity className="w-3 h-3 text-[#34D399]" />
            Avg Health
          </span>
          <span className="font-mono text-sm font-semibold text-[#d4e4fa]">
            {avgHealth}/100
          </span>
        </div>

        <div className="h-6 w-px bg-[#232B38]" />

        <div className="flex flex-col justify-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#bacac5] flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#FBBF24]" />
            Renewals &le;90d
          </span>
          <span className="font-mono text-sm font-semibold text-[#FBBF24]">
            {renewalsIn90Days}
          </span>
        </div>
      </div>

      {/* Right Controls & Badge */}
      <div className="flex items-center gap-3">
        {/* Inference / Model badge */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#010F1F] border border-[#232B38] text-[11px] text-[#bacac5]"
        >
          <span className="w-2 h-2 rounded-full bg-[#34D399]" />
          <span className="text-[#bacac5]">
            Local Rules · Simulated inference
          </span>
        </div>

        <button 
          onClick={onOpenCommandPalette}
          className="md:hidden p-1.5 text-[#bacac5] hover:text-[#2DD4BF] transition-colors"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        <button 
          className="p-1.5 text-[#bacac5] hover:text-[#2DD4BF] transition-colors relative"
          title="Notifications (Simulated)"
          onClick={() => {}}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#F87171] rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#232B38]">
          <div className="w-7 h-7 rounded-full bg-[#1C2B3C] border border-[#232B38] overflow-hidden flex items-center justify-center text-xs font-semibold text-[#2DD4BF]">
            PN
          </div>
          <span className="hidden lg:inline text-xs font-medium text-[#d4e4fa]">Priya N.</span>
        </div>
      </div>
    </header>
  );
};
