import React, { useState, useEffect } from 'react';
import { Account, RetentionPlay } from '../types';
import { 
  generatePlaybookForAccount, 
  calculatePlaybookTrajectory,
  calculateBaselineDecline,
  calculate30DayProjection 
} from '../lib/playbookEngine';
import { REASONING_STEPS } from '../lib/simulateStream';
import { PlayCard } from './PlayCard';
import { ProjectionChart } from './ProjectionChart';
import { 
  Sparkles, 
  Bot, 
  Send, 
  CheckCircle2, 
  RotateCcw,
  ExternalLink
} from 'lucide-react';

interface PlaybookPanelProps {
  account: Account;
  currentHealth: number;
  onPreviewAsset: (play: RetentionPlay) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'default' | 'info' | 'warning') => void;
}

export const PlaybookPanel: React.FC<PlaybookPanelProps> = ({
  account,
  currentHealth,
  onPreviewAsset,
  onShowToast
}) => {
  // All generated plays for current account
  const [allPlays, setAllPlays] = useState<RetentionPlay[]>([]);
  // Active enabled play IDs (for toggle)
  const [enabledPlayIds, setEnabledPlayIds] = useState<Set<string>>(new Set());
  
  // Generation state
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentReasoningStep, setCurrentReasoningStep] = useState<number>(0);
  const [visiblePlayCount, setVisiblePlayCount] = useState<number>(0);
  
  // Deployment state
  const [isDeployed, setIsDeployed] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  // Auto-generate default plays whenever account changes
  useEffect(() => {
    const plays = generatePlaybookForAccount(account);
    setAllPlays(plays);
    setEnabledPlayIds(new Set(plays.map(p => p.id)));
    
    setIsDeployed(false);
    setIsDeploying(false);
    setIsGenerating(false);
    setHasGenerated(false);
    setVisiblePlayCount(0);
    setCurrentReasoningStep(0);
  }, [account.id]);

  // Start deterministic generation
  const handleStartGeneration = () => {
    setIsGenerating(true);
    setCurrentReasoningStep(0);
    setVisiblePlayCount(0);
    setHasGenerated(false);

    // Reasoning progress animation
    setTimeout(() => setCurrentReasoningStep(1), 400);
    setTimeout(() => setCurrentReasoningStep(2), 900);
    setTimeout(() => setCurrentReasoningStep(3), 1400);

    const deterministicPlays = generatePlaybookForAccount(account);
    setAllPlays(deterministicPlays);
    setEnabledPlayIds(new Set(deterministicPlays.map(p => p.id)));

    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
      setVisiblePlayCount(1);
    }, 1800);

    setTimeout(() => setVisiblePlayCount(2), 2200);
    setTimeout(() => {
      setVisiblePlayCount(deterministicPlays.length);
      onShowToast('Playbook Synthesized', `3 targeted intervention plays generated for ${account.name}`, 'success');
    }, 2600);
  };

  // Toggle play active state
  const handleTogglePlay = (playId: string) => {
    setEnabledPlayIds(prev => {
      const next = new Set(prev);
      if (next.has(playId)) {
        next.delete(playId);
      } else {
        next.add(playId);
      }
      return next;
    });
  };

  // Filter active enabled plays
  const enabledPlays = allPlays.filter(p => enabledPlayIds.has(p.id));

  // Single function computing projectedHealth, recoveryPoints, baselineHealth, saveProbability
  const { projectedHealth, recoveryPoints, baselineHealth, saveProbability } = calculatePlaybookTrajectory(
    account,
    enabledPlays
  );

  const baselineDecline = calculateBaselineDecline(account);
  const projectionData = calculate30DayProjection(
    currentHealth, 
    recoveryPoints, 
    account.renewalDays,
    baselineDecline
  );

  // Deploy Playbook Sequence
  const handleDeployPlaybook = () => {
    if (isDeploying || isDeployed) return;
    setIsDeploying(true);

    // Sequence of toasts 600ms apart
    setTimeout(() => {
      onShowToast('Tasks Created in Salesforce', `Assigned to ${account.csmName} & Solutions team`, 'success');
    }, 600);

    setTimeout(() => {
      onShowToast('Owners Notified in Slack', '#cs-escalations channel pinged with SLA countdown', 'info');
    }, 1200);

    setTimeout(() => {
      onShowToast('Re-onboarding Campaign Queued', 'Touchpoint sequence scheduled in Outreach/Salesloft', 'success');
      setIsDeploying(false);
      setIsDeployed(true);
    }, 1800);
  };

  return (
    <aside className="w-full lg:w-[380px] shrink-0 flex flex-col gap-3 bg-[#0B0F17] select-none h-full overflow-hidden">
      {/* Panel Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#d4e4fa] tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2DD4BF]" />
            <span>AI Retention Playbook</span>
          </h2>
          {hasGenerated && (
            <span className="px-2 py-0.5 bg-[#1C2B3C] text-[10px] font-mono text-[#2DD4BF] rounded border border-[#232B38]">
              {allPlays.length} Plays
            </span>
          )}
        </div>
        <div className="text-[11px] text-[#bacac5] truncate">
          {hasGenerated
            ? `Projected health recovery +${recoveryPoints} pts over 30d · Save prob ${saveProbability}%`
            : `Deterministic intervention engine for ${account.name}`}
        </div>
      </div>

      {/* Main Playbook Card Container */}
      <div className="surface-card flex-1 flex flex-col overflow-hidden bg-[#141A24] border border-[#232B38] rounded-xl">
        {/* State 1: Not Generated (Empty state with Call-to-Action) */}
        {!hasGenerated && !isGenerating && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#0D1C2D] border border-[#232B38] flex items-center justify-center text-[#2DD4BF] mb-4 shadow-inner">
              <Bot className="w-6 h-6" />
            </div>

            <h3 className="text-sm font-semibold text-[#d4e4fa] mb-1.5">
              Ready to Synthesize Playbook
            </h3>
            <p className="text-xs text-[#bacac5] max-w-[280px] leading-relaxed mb-6">
              Correlate {Object.keys(account.signals).length} critical telemetry signals for {account.name} against 47 historical churn patterns to generate tailored plays.
            </p>

            <button
              onClick={handleStartGeneration}
              className="w-full btn-primary-teal py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Retention Playbook</span>
            </button>

            <div className="mt-6 flex flex-col gap-2 w-full text-left text-[11px] text-[#859490] border-t border-[#232B38] pt-4">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#34D399]" />
                <span className="truncate">Deterministic rules • Zero external dependencies</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] shrink-0" />
                <span>Calculates auditable 30-day recovery trajectory</span>
              </div>
            </div>
          </div>
        )}

        {/* State 2: Phased Reasoning / Simulated Inference */}
        {isGenerating && (
          <div className="flex-1 flex flex-col justify-center p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-[#2DD4BF] border-t-transparent animate-spin" />
              <span className="text-xs font-semibold text-[#d4e4fa]">
                Synthesizing Intervention Strategy...
              </span>
            </div>

            <div className="space-y-2.5 bg-[#0D1C2D] p-3.5 rounded-xl border border-[#232B38] font-mono text-[11px]">
              {REASONING_STEPS.map((step, idx) => {
                const isStepActive = currentReasoningStep >= idx + 1;
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 transition-all duration-300 ${
                      isStepActive ? 'text-[#2DD4BF] opacity-100' : 'text-[#859490] opacity-40'
                    }`}
                  >
                    <span className="mt-0.5">
                      {isStepActive ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-[#859490]/40 flex items-center justify-center text-[9px]">
                          {idx + 1}
                        </div>
                      )}
                    </span>
                    <span className="leading-snug">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* State 3: Generated Playbook View */}
        {hasGenerated && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 30-Day Projection Chart at Top */}
            <div className="p-3 border-b border-[#232B38] shrink-0">
              <ProjectionChart
                data={projectionData}
                currentHealth={currentHealth}
                projectedHealth={projectedHealth}
                baselineHealth={baselineHealth}
                recoveryPoints={recoveryPoints}
                saveProbability={saveProbability}
                renewalDays={account.renewalDays}
                renewalDate={account.renewalDate}
                enabledPlaysCount={enabledPlayIds.size}
                totalPlaysCount={allPlays.length}
              />
            </div>

            {/* Play Cards List with Streaming Effect */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {allPlays.slice(0, visiblePlayCount).map((play, index) => (
                <div
                  key={play.id}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <PlayCard
                    play={play}
                    index={index}
                    isEnabled={enabledPlayIds.has(play.id)}
                    onToggle={handleTogglePlay}
                    onPreviewAsset={onPreviewAsset}
                  />
                </div>
              ))}

              {/* Deployed State Timeline if Deployed */}
              {isDeployed && (
                <div className="mt-4 p-3.5 bg-[#0D1C2D] border border-[#34D399]/40 rounded-xl space-y-2.5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#34D399]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Playbook Active • Touchpoint Schedule</span>
                  </div>
                  <div className="space-y-2 text-[11px] font-mono text-[#bacac5] pl-1 border-l-2 border-[#34D399]/40 ml-2">
                    <div className="pl-3">
                      <div className="text-[#d4e4fa] font-semibold">T+0h · Salesforce Tasks Created</div>
                      <div className="text-[#859490]">Priya Nair & Marcus Webb assigned</div>
                    </div>
                    <div className="pl-3">
                      <div className="text-[#d4e4fa] font-semibold">T+24h · Executive Sponsor Sync</div>
                      <div className="text-[#859490]">Invitation dispatched to {account.newExecName || 'Executive Sponsor'}</div>
                    </div>
                    <div className="pl-3">
                      <div className="text-[#d4e4fa] font-semibold">T+48h · Engineering RCA Standup</div>
                      <div className="text-[#859490]">Dana Ortiz resolving open P1 tickets</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-3 border-t border-[#232B38] bg-[#0D1C2D] shrink-0 space-y-2">
              {!isDeployed ? (
                <button
                  onClick={handleDeployPlaybook}
                  disabled={isDeploying || enabledPlayIds.size === 0}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    enabledPlayIds.size > 0
                      ? 'btn-primary-teal'
                      : 'bg-[#232B38] text-[#859490] cursor-not-allowed'
                  }`}
                >
                  {isDeploying ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-[#0B0F17] border-t-transparent animate-spin" />
                      <span>Deploying Orchestration...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Deploy Retention Playbook ({enabledPlayIds.size} Active)</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onShowToast('Exported to Salesforce', `Created Opportunity Retain plan #OPP-8492`, 'success');
                    }}
                    className="flex-1 py-2 px-3 bg-[#141A24] hover:bg-[#1C2B3C] border border-[#232B38] text-[#d4e4fa] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#2DD4BF]" />
                    <span>Salesforce Sync</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDeployed(false);
                      handleStartGeneration();
                    }}
                    className="p-2 bg-[#141A24] hover:bg-[#1C2B3C] border border-[#232B38] text-[#bacac5] hover:text-[#2DD4BF] rounded-lg transition-colors cursor-pointer"
                    title="Regenerate Playbook"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  onShowToast('Exported to Salesforce', `Linked 3 tasks to ${account.name} CRM record`, 'info');
                }}
                className="w-full text-center text-[11px] text-[#bacac5] hover:text-[#2DD4BF] transition-colors py-0.5 cursor-pointer"
              >
                Export to Salesforce · Retain OS Sync
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
