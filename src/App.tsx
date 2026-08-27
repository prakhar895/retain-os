import React, { useState, useEffect } from 'react';
import { ACCOUNTS, getAccountById } from './data/accounts';
import { Account, RetentionPlay, ToastMessage } from './types';
import { calculateHealthScore } from './lib/scoring';
import { TopBar } from './components/TopBar';
import { AccountRail, FilterCategory, SortOption } from './components/AccountRail';
import { HealthGauge } from './components/HealthGauge';
import { ScoreExplanationCard } from './components/ScoreExplanationCard';
import { RiskWaterfall } from './components/RiskWaterfall';
import { SignalCard } from './components/SignalCard';
import { PlaybookPanel } from './components/PlaybookPanel';
import { AssetModal } from './components/AssetModal';
import { RecentActivity } from './components/RecentActivity';
import { ToastStack } from './components/ToastStack';
import { CommandPalette } from './components/CommandPalette';
import { 
  Building2, 
  Calendar, 
  DollarSign, 
  UserCheck, 
  AlertTriangle, 
  Layers, 
  Sparkles,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export default function App() {
  // Active Account State
  const [selectedAccountId, setSelectedAccountId] = useState<string>('nexus-logistics');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('At Risk');
  const [sortOption, setSortOption] = useState<SortOption>('arr-risk-desc');

  // Modal & Overlay State
  const [previewPlay, setPreviewPlay] = useState<RetentionPlay | null>(null);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Mobile View Tabs ('overview' | 'playbook' | 'watchlist')
  const [mobileTab, setMobileTab] = useState<'overview' | 'playbook' | 'watchlist'>('overview');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const selectedAccount = getAccountById(selectedAccountId) || ACCOUNTS[0];
  const scoreResult = calculateHealthScore(selectedAccount);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (title: string, description?: string, type: ToastMessage['type'] = 'default') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      description,
      type
    };
    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss after 4.5s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleOpenAssetPreview = (play: RetentionPlay) => {
    setPreviewPlay(play);
    setIsAssetModalOpen(true);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0B0F17] text-[#d4e4fa] font-sans antialiased overflow-hidden select-none">
      {/* Top Bar with Brand, KPIs, Search */}
      <TopBar
        accounts={ACCOUNTS}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onFilterAtRisk={() => setActiveFilter('At Risk')}
        activeFilter={activeFilter}
      />

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex bg-[#122131] border-b border-[#232B38] px-3 py-1.5 justify-between items-center shrink-0">
        <div className="flex gap-1 bg-[#0D1C2D] p-1 rounded-lg border border-[#232B38] flex-1 mr-2">
          <button
            onClick={() => setMobileTab('watchlist')}
            className={`flex-1 py-1 text-[11px] font-medium rounded ${
              mobileTab === 'watchlist' ? 'bg-[#273647] text-[#57f1db]' : 'text-[#bacac5]'
            }`}
          >
            Accounts
          </button>
          <button
            onClick={() => setMobileTab('overview')}
            className={`flex-1 py-1 text-[11px] font-medium rounded ${
              mobileTab === 'overview' ? 'bg-[#273647] text-[#57f1db]' : 'text-[#bacac5]'
            }`}
          >
            Diagnostics
          </button>
          <button
            onClick={() => setMobileTab('playbook')}
            className={`flex-1 py-1 text-[11px] font-medium rounded flex items-center justify-center gap-1 ${
              mobileTab === 'playbook' ? 'bg-[#273647] text-[#2DD4BF]' : 'text-[#bacac5]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#2DD4BF]" />
            Playbook
          </button>
        </div>
      </div>

      {/* Main 3-Column Command Center Layout */}
      <main className="flex-1 flex gap-4 p-3 lg:p-4 overflow-hidden min-h-0">
        {/* Left Column: Account Rail (280px) */}
        <div
          className={`${
            mobileTab === 'watchlist' ? 'flex w-full' : 'hidden'
          } lg:flex lg:w-[280px] shrink-0 h-full flex-col`}
        >
          <AccountRail
            accounts={ACCOUNTS}
            selectedAccountId={selectedAccountId}
            onSelectAccount={(id) => {
              setSelectedAccountId(id);
              setMobileTab('overview');
            }}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            sortOption={sortOption}
            onSortChange={setSortOption}
          />
        </div>

        {/* Center Column: Account Diagnostics & Telemetry (Flexible) */}
        <div
          className={`${
            mobileTab === 'overview' ? 'flex' : 'hidden'
          } lg:flex flex-1 flex-col min-w-0 h-full overflow-y-auto pr-1 space-y-4 pb-6`}
        >
          {/* Header Card with Account Metadata, Circular Health Gauge, and Explain This Score */}
          <div className="surface-card px-5 py-3.5 bg-[#141A24] border border-[#232B38] rounded-xl flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex items-center gap-3.5">
                {/* Account Initials Avatar */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-extrabold text-lg shrink-0 border ${
                    scoreResult.status === 'critical'
                      ? 'bg-[#F87171]/15 text-[#F87171] border-[#F87171]/40 shadow-[0_0_15px_rgba(248,113,113,0.15)]'
                      : scoreResult.status === 'warning'
                      ? 'bg-[#FBBF24]/15 text-[#FBBF24] border-[#FBBF24]/40'
                      : 'bg-[#34D399]/15 text-[#34D399] border-[#34D399]/40'
                  }`}
                >
                  {selectedAccount.initials}
                </div>

                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-xl font-bold tracking-tight text-[#d4e4fa]">
                      {selectedAccount.name}
                    </h1>
                    <span className="font-mono text-sm font-bold text-[#57f1db] bg-[#0D1C2D] px-2 py-0.5 rounded border border-[#232B38]">
                      {selectedAccount.arrFormatted} ARR
                    </span>
                  </div>

                  {/* Account Badges & Tags */}
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap text-[11px]">
                    <span className="px-2 py-0.5 bg-[#1C2B3C] text-[#d4e4fa] rounded border border-[#232B38] font-medium">
                      {selectedAccount.tier}
                    </span>
                    <span className="px-2 py-0.5 bg-[#1C2B3C] text-[#bacac5] rounded border border-[#232B38]">
                      {selectedAccount.industry}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-medium ${
                        selectedAccount.renewalDays <= 35
                          ? 'bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30'
                          : 'bg-[#1C2B3C] text-[#bacac5] border border-[#232B38]'
                      }`}
                    >
                      Renewal in {selectedAccount.renewalDays} days ({selectedAccount.renewalDate})
                    </span>
                    <span className="text-[#859490] hidden sm:inline">• CSM: {selectedAccount.csmName}</span>
                  </div>
                </div>
              </div>

              {/* Health Score Gauge Component */}
              <div className="shrink-0 self-end md:self-center">
                <HealthGauge scoreResult={scoreResult} />
              </div>
            </div>

            {/* Explain This Score Expandable */}
            <ScoreExplanationCard account={selectedAccount} />
          </div>

          {/* Churn Driver Summary Banner (if critical) */}
          {selectedAccount.churnDriversSummary && scoreResult.status === 'critical' && (
            <div className="bg-[#F87171]/10 border border-[#F87171]/30 rounded-lg px-3 py-1.5 flex items-start gap-2 text-[10.5px] leading-snug">
              <AlertTriangle className="w-3.5 h-3.5 text-[#F87171] shrink-0 mt-0.5" />
              <div className="text-[#d4e4fa]">
                <span className="font-semibold text-[#F87171] mr-1">Primary Churn Drivers:</span>
                <span>{selectedAccount.churnDriversSummary}</span>
              </div>
            </div>
          )}

          {/* Risk Contribution Waterfall (Horizontal Bar Chart) */}
          <RiskWaterfall
            waterfall={scoreResult.waterfall}
            totalPenalties={scoreResult.totalPenalties}
          />

          {/* 6 Weighted Signals Grid (2 Columns) */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#2DD4BF]" />
                <h3 className="text-xs font-semibold text-[#d4e4fa] uppercase tracking-wider font-mono">
                  Telemetry Signal Matrix (6 Dimensions)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#859490]">
                12-week telemetry trendlines
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <SignalCard signal={selectedAccount.signals.usage} />
              <SignalCard signal={selectedAccount.signals.support} />
              <SignalCard signal={selectedAccount.signals.championChange} />
              <SignalCard signal={selectedAccount.signals.adoption} />
              <SignalCard signal={selectedAccount.signals.execEngagement} />
              <SignalCard signal={selectedAccount.signals.commercial} />
            </div>
          </div>

          {/* Recent Activity Log & Support Telemetry Table */}
          <RecentActivity
            activities={selectedAccount.activities}
            accountName={selectedAccount.name}
          />
        </div>

        {/* Right Column: AI Retention Playbook (380px) */}
        <div
          className={`${
            mobileTab === 'playbook' ? 'flex w-full' : 'hidden'
          } lg:flex lg:w-[380px] shrink-0 h-full flex-col`}
        >
          <PlaybookPanel
            account={selectedAccount}
            currentHealth={scoreResult.health}
            onPreviewAsset={handleOpenAssetPreview}
            onShowToast={showToast}
          />
        </div>
      </main>

      {/* Asset Preview Modal */}
      <AssetModal
        play={previewPlay}
        account={selectedAccount}
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        onAddToPlaybook={(play) => {
          showToast('Added to Active Playbook', `${play.title} queued for dispatch`, 'success');
        }}
        onShowToast={showToast}
      />

      {/* Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        accounts={ACCOUNTS}
        onSelectAccount={(id) => {
          setSelectedAccountId(id);
          setMobileTab('overview');
        }}
        onFilterCategory={(cat) => {
          setActiveFilter(cat);
        }}
      />

      {/* Toast Notification Stack */}
      <ToastStack
        toasts={toasts}
        onDismiss={handleDismissToast}
      />
    </div>
  );
}
