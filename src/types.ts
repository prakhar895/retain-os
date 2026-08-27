export type SignalSeverity = 'critical' | 'warning' | 'healthy';

export type SignalId = 
  | 'usage'
  | 'support'
  | 'championChange'
  | 'adoption'
  | 'execEngagement'
  | 'commercial';

export interface SignalData {
  id: SignalId;
  name: string;
  weight: number; // Max penalty weight
  value: string;
  delta: string;
  metricNumber?: number; // e.g. -42 for -42%
  description: string;
  severity: SignalSeverity;
  penalty: number; // Current penalty subtracted from 100
  sparkline: number[]; // 12-point trend
  benchmark?: string;
  unit?: string;
}

export interface AccountContact {
  name: string;
  role: string;
  email: string;
  avatar?: string;
  isChampion?: boolean;
  status?: string;
}

export interface ActivityEvent {
  id: string;
  date: string;
  type: 'Support' | 'Product' | 'Email' | 'Executive' | 'Commercial' | 'Telemetry';
  description: string;
  user: string;
  badgeColor?: string;
}

export interface Account {
  id: string;
  name: string;
  initials: string;
  arr: number; // e.g. 210000
  arrFormatted: string; // e.g. "$210,000"
  tier: 'Enterprise' | 'Strategic' | 'Mid-Market' | 'Growth';
  industry: string;
  renewalDays: number;
  renewalDate: string;
  csmName: string;
  csmAvatar?: string;
  tags: string[];
  contacts: AccountContact[];
  signals: Record<SignalId, SignalData>;
  activities: ActivityEvent[];
  roiMetric: string;
  potentialWastedSpend: string;
  newExecName?: string;
  churnDriversSummary?: string;
}

export interface WaterfallItem {
  id: SignalId;
  signal: string;
  label: string;
  penalty: number;
  percentage: number;
  severity: SignalSeverity;
}

export interface HealthScoreResult {
  health: number; // 0 - 100
  status: 'critical' | 'warning' | 'healthy';
  statusLabel: 'At Risk' | 'Watch' | 'Healthy';
  totalPenalties: number;
  waterfall: WaterfallItem[];
  trend30d: number; // e.g. -23
}

export interface AssetTemplate {
  type: 'email' | 'sequence' | 'agenda' | 'deck';
  typeLabel: string;
  subject?: string;
  from?: string;
  to?: string;
  body: string;
  toneOptions?: {
    label: string;
    toneKey: 'consultative' | 'urgent' | 'executive' | 'collaborative';
    body: string;
  }[];
}

export interface RetentionPlay {
  id: string;
  title: string;
  rationale: string;
  ownerName: string;
  ownerRole: string;
  ownerAvatar?: string;
  dueInDays: number;
  channel: 'Email' | 'Sequence' | 'Meeting' | 'Slack' | 'Executive';
  impactPoints: number;
  evidenceSignalIds: SignalId[];
  evidenceLabels: string[];
  asset: AssetTemplate;
}

export interface PlaybookGenerationState {
  isGenerating: boolean;
  stepIndex: number;
  steps: string[];
  streamedPlayIds: string[];
  isComplete: boolean;
  deployed: boolean;
  deployedAt?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  type?: 'default' | 'success' | 'warning' | 'info';
}
