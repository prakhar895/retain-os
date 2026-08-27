import React, { useState, useEffect, useRef } from 'react';
import { Account } from '../types';
import { calculateHealthScore } from '../lib/scoring';
import { Search, Sparkles, ShieldAlert, ArrowRight, X, Building, Check } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  onSelectAccount: (id: string) => void;
  onFilterCategory: (category: 'All' | 'At Risk' | 'Watch' | 'Healthy') => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  accounts,
  onSelectAccount,
  onFilterCategory
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Compute matches
  const filteredAccounts = accounts.filter(account => {
    const q = query.toLowerCase();
    return (
      account.name.toLowerCase().includes(q) ||
      account.industry.toLowerCase().includes(q) ||
      account.tier.toLowerCase().includes(q) ||
      account.csmName.toLowerCase().includes(q) ||
      account.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  const actions = [
    {
      id: 'action-at-risk',
      title: 'Filter: Show only At Risk accounts',
      category: 'Quick Filter',
      icon: <ShieldAlert className="w-4 h-4 text-[#F87171]" />,
      action: () => {
        onFilterCategory('At Risk');
        onClose();
      }
    },
    {
      id: 'action-watch',
      title: 'Filter: Show Watchlist accounts',
      category: 'Quick Filter',
      icon: <ShieldAlert className="w-4 h-4 text-[#FBBF24]" />,
      action: () => {
        onFilterCategory('Watch');
        onClose();
      }
    },
    {
      id: 'action-all',
      title: 'Filter: Show All accounts',
      category: 'Quick Filter',
      icon: <Building className="w-4 h-4 text-[#2DD4BF]" />,
      action: () => {
        onFilterCategory('All');
        onClose();
      }
    }
  ].filter(a => a.title.toLowerCase().includes(query.toLowerCase()));

  const totalItems = filteredAccounts.length + actions.length;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, totalItems));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalItems) % Math.max(1, totalItems));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex < filteredAccounts.length) {
          const selected = filteredAccounts[selectedIndex];
          if (selected) {
            onSelectAccount(selected.id);
            onClose();
          }
        } else {
          const actionIdx = selectedIndex - filteredAccounts.length;
          const selectedAction = actions[actionIdx];
          if (selectedAction) {
            selectedAction.action();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, totalItems, selectedIndex, filteredAccounts, actions, onClose, onSelectAccount]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#141A24] border border-[#232B38] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search bar input */}
        <div className="p-3.5 border-b border-[#232B38] flex items-center gap-3 bg-[#122131]">
          <Search className="w-4 h-4 text-[#2DD4BF]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search accounts, industries, CSMs or commands..."
            className="flex-1 bg-transparent border-0 text-sm text-[#d4e4fa] placeholder-[#859490] outline-none font-sans"
          />
          <kbd className="px-1.5 py-0.5 bg-[#0D1C2D] border border-[#232B38] rounded text-[10px] font-mono text-[#859490]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto space-y-1 text-xs">
          {filteredAccounts.length > 0 && (
            <div className="px-2 py-1 text-[10px] font-mono uppercase text-[#859490]">
              Accounts ({filteredAccounts.length})
            </div>
          )}

          {filteredAccounts.map((account, idx) => {
            const isSelected = idx === selectedIndex;
            const scoreResult = calculateHealthScore(account);

            return (
              <div
                key={account.id}
                onClick={() => {
                  onSelectAccount(account.id);
                  onClose();
                }}
                className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#1C2B3C] text-[#57f1db] border border-[#2DD4BF]/40'
                    : 'text-[#d4e4fa] hover:bg-[#19212E]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-[#0D1C2D] border border-[#232B38] flex items-center justify-center font-mono font-bold text-xs text-[#2DD4BF]">
                    {account.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{account.name}</div>
                    <div className="text-[11px] text-[#bacac5] flex items-center gap-2">
                      <span>{account.arrFormatted} ARR</span>
                      <span>•</span>
                      <span>{account.industry}</span>
                      <span>•</span>
                      <span>CSM: {account.csmName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      scoreResult.health < 50
                        ? 'bg-[#F87171]/20 text-[#F87171]'
                        : scoreResult.health < 75
                        ? 'bg-[#FBBF24]/20 text-[#FBBF24]'
                        : 'bg-[#34D399]/20 text-[#34D399]'
                    }`}
                  >
                    {scoreResult.health}/100
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#859490]" />
                </div>
              </div>
            );
          })}

          {actions.length > 0 && (
            <div className="px-2 pt-2 pb-1 text-[10px] font-mono uppercase text-[#859490]">
              Commands & Filters
            </div>
          )}

          {actions.map((act, idx) => {
            const itemIdx = filteredAccounts.length + idx;
            const isSelected = itemIdx === selectedIndex;

            return (
              <div
                key={act.id}
                onClick={act.action}
                className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#1C2B3C] text-[#57f1db] border border-[#2DD4BF]/40'
                    : 'text-[#d4e4fa] hover:bg-[#19212E]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-[#0D1C2D] border border-[#232B38]">
                    {act.icon}
                  </div>
                  <div>
                    <div className="font-medium">{act.title}</div>
                    <div className="text-[10px] text-[#859490] font-mono">{act.category}</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#859490]" />
              </div>
            );
          })}

          {totalItems === 0 && (
            <div className="p-8 text-center text-xs text-[#859490]">
              No accounts or commands found matching &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Keyboard hints footer */}
        <div className="p-2.5 border-t border-[#232B38] bg-[#0D1C2D] flex items-center justify-between text-[11px] font-mono text-[#859490]">
          <div className="flex items-center gap-3">
            <span>&uarr;&darr; Navigate</span>
            <span>&crarr; Select</span>
          </div>
          <span>Retain OS Command Palette</span>
        </div>
      </div>
    </div>
  );
};
