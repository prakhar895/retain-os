import React from 'react';
import { Account, SignalSeverity } from '../types';
import { calculateHealthScore } from '../lib/scoring';
import { ArrowUpDown, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

export type FilterCategory = 'All' | 'At Risk' | 'Watch' | 'Healthy';
export type SortOption = 'arr-risk-desc' | 'arr-desc' | 'health-asc' | 'renewal-asc';

interface AccountRailProps {
  accounts: Account[];
  selectedAccountId: string;
  onSelectAccount: (id: string) => void;
  activeFilter: FilterCategory;
  onFilterChange: (filter: FilterCategory) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const AccountRail: React.FC<AccountRailProps> = ({
  accounts,
  selectedAccountId,
  onSelectAccount,
  activeFilter,
  onFilterChange,
  sortOption,
  onSortChange
}) => {
  // Precompute health scores for each account
  const accountsWithScores = accounts.map(account => {
    const scoreResult = calculateHealthScore(account);
    return {
      account,
      scoreResult
    };
  });

  // Filter accounts
  const filtered = accountsWithScores.filter(({ scoreResult }) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'At Risk') return scoreResult.statusLabel === 'At Risk';
    if (activeFilter === 'Watch') return scoreResult.statusLabel === 'Watch';
    if (activeFilter === 'Healthy') return scoreResult.statusLabel === 'Healthy';
    return true;
  });

  // Sort accounts
  filtered.sort((a, b) => {
    if (sortOption === 'arr-risk-desc') {
      const aArrAtRisk = (a.account.arr * (100 - a.scoreResult.health)) / 100;
      const bArrAtRisk = (b.account.arr * (100 - b.scoreResult.health)) / 100;
      return bArrAtRisk - aArrAtRisk;
    }
    if (sortOption === 'arr-desc') {
      return b.account.arr - a.account.arr;
    }
    if (sortOption === 'health-asc') {
      return a.scoreResult.health - b.scoreResult.health;
    }
    if (sortOption === 'renewal-asc') {
      return a.account.renewalDays - b.account.renewalDays;
    }
    return 0;
  });

  const getStatusColor = (severity: SignalSeverity) => {
    switch (severity) {
      case 'critical':
        return {
          pill: 'bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30',
          accent: 'bg-[#F87171]'
        };
      case 'warning':
        return {
          pill: 'bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30',
          accent: 'bg-[#FBBF24]'
        };
      case 'healthy':
        return {
          pill: 'bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30',
          accent: 'bg-[#34D399]'
        };
    }
  };

  return (
    <section className="w-full lg:w-[280px] shrink-0 flex flex-col gap-3 bg-[#0B0F17] select-none h-full overflow-hidden">
      {/* Rail Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-[#d4e4fa] tracking-tight">
          Account Watchlist
        </h2>
        <span className="text-[11px] font-mono text-[#bacac5]">
          {filtered.length} of {accounts.length}
        </span>
      </div>

      {/* Segmented Filter */}
      <div className="flex bg-[#0D1C2D] p-0.5 rounded-lg border border-[#232B38]">
        {(['All', 'At Risk', 'Watch', 'Healthy'] as FilterCategory[]).map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`flex-1 py-1 px-1 text-[11px] font-medium rounded transition-all text-center ${
                isActive
                  ? 'bg-[#273647] text-[#d4e4fa] font-semibold shadow-sm'
                  : 'text-[#bacac5] hover:text-[#2DD4BF] hover:bg-[#141A24]'
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Sort Control */}
      <div className="flex items-center justify-between px-1 text-[11px] text-[#bacac5]">
        <span className="flex items-center gap-1">
          <ArrowUpDown className="w-3 h-3 text-[#859490]" />
          Sort by:
        </span>
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="bg-transparent text-[#d4e4fa] text-[11px] outline-none cursor-pointer hover:text-[#2DD4BF] font-medium border-0 py-0 pr-2"
        >
          <option value="arr-risk-desc" className="bg-[#141A24] text-[#d4e4fa]">Highest ARR at risk</option>
          <option value="arr-desc" className="bg-[#141A24] text-[#d4e4fa]">Highest ARR</option>
          <option value="health-asc" className="bg-[#141A24] text-[#d4e4fa]">Lowest Health</option>
          <option value="renewal-asc" className="bg-[#141A24] text-[#d4e4fa]">Next Renewal</option>
        </select>
      </div>

      {/* Account List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {filtered.map(({ account, scoreResult }) => {
          const isSelected = account.id === selectedAccountId;
          const colors = getStatusColor(scoreResult.status);

          return (
            <div
              key={account.id}
              onClick={() => onSelectAccount(account.id)}
              className={`group relative rounded-xl p-3 cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-[#1C2B3C] border-[#2DD4BF]/40 shadow-sm'
                  : 'bg-[#141A24] border-[#232B38] hover:bg-[#19212E] hover:border-[#3C4A46]'
              }`}
            >
              {/* Left Accent Bar on Selected Row */}
              {isSelected && (
                <div
                  className={`absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r ${colors.accent}`}
                />
              )}

              <div className="flex justify-between items-start mb-1 pl-1">
                <div className="font-semibold text-xs text-[#d4e4fa] group-hover:text-[#57f1db] transition-colors truncate max-w-[170px]">
                  {account.name}
                </div>
                {/* Computed Health Pill */}
                <div
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${colors.pill}`}
                >
                  {scoreResult.health}/100
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono text-[#bacac5] pl-1">
                <span>{account.arrFormatted} ARR</span>
                <span className={account.renewalDays <= 35 ? 'text-[#F87171] font-semibold' : ''}>
                  {account.renewalDays}d renewal
                </span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-6 text-center text-xs text-[#859490] border border-dashed border-[#232B38] rounded-xl">
            No accounts match the selected filter.
          </div>
        )}
      </div>
    </section>
  );
};
