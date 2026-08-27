import { Account, HealthScoreResult, SignalData, SignalId, WaterfallItem } from '../types';

export interface SignalScoreBreakdown {
  id: SignalId;
  name: string;
  label: string;
  weight: number;
  rawValue: string;
  delta: string;
  penalty: number;
  maxWeight: number;
  severity: 'critical' | 'warning' | 'healthy';
  description: string;
  benchmark?: string;
}

export interface ScoreExplanation {
  health: number;
  status: 'critical' | 'warning' | 'healthy';
  totalPenalties: number;
  baseScore: number;
  formula: string;
  signalsBreakdown: SignalScoreBreakdown[];
}

export const SIGNAL_METADATA: Record<SignalId, { label: string; defaultWeight: number; description: string }> = {
  usage: {
    label: 'Usage Decline (WAU)',
    defaultWeight: 30,
    description: 'Weekly Active Users (WAU) drop relative to licensed seat threshold'
  },
  support: {
    label: 'Support Escalations',
    defaultWeight: 20,
    description: 'Open P1/P2 tickets and critical SLA response breaches'
  },
  championChange: {
    label: 'Champion Churn',
    defaultWeight: 15,
    description: 'Loss of key executive sponsor or stakeholder turnover without designated successor'
  },
  adoption: {
    label: 'Adoption & Feature Breadth',
    defaultWeight: 15,
    description: 'Core product module utilization and workflow integration breadth'
  },
  execEngagement: {
    label: 'Exec Disengagement',
    defaultWeight: 10,
    description: 'Days since last Executive Business Review (EBR) or C-level touchpoint'
  },
  commercial: {
    label: 'Commercial Utilization Risk',
    defaultWeight: 10,
    description: 'License shelfware, unassigned seat capacity, and contract term posture'
  }
};

export const SIGNAL_KEYS: SignalId[] = [
  'usage',
  'support',
  'championChange',
  'adoption',
  'execEngagement',
  'commercial'
];

export const SCORING_FORMULA = 'Health Score = MAX(0, 100 − Σ(Points Deducted))';

export function getScoreExplanation(account: Account): ScoreExplanation {
  const breakdown: SignalScoreBreakdown[] = SIGNAL_KEYS.map((key) => {
    const signal: SignalData | undefined = account.signals[key];
    const meta = SIGNAL_METADATA[key];
    const weight = signal?.weight ?? meta.defaultWeight;
    const penalty = Math.max(0, signal ? signal.penalty : 0);
    const rawValue = signal?.value ?? 'N/A';
    const delta = signal?.delta ?? '—';
    const name = signal?.name ?? meta.label;
    const severity = signal?.severity ?? 'healthy';
    const description = signal?.description ?? meta.description;
    const benchmark = signal?.benchmark;

    return {
      id: key,
      name,
      label: meta.label,
      weight,
      maxWeight: weight,
      rawValue,
      delta,
      penalty,
      severity,
      description,
      benchmark
    };
  });

  const totalPenalties = breakdown.reduce((sum, item) => sum + item.penalty, 0);
  const health = Math.max(0, Math.min(100, Math.round(100 - totalPenalties)));

  let status: 'critical' | 'warning' | 'healthy' = 'healthy';
  if (health < 50) {
    status = 'critical';
  } else if (health < 75) {
    status = 'warning';
  }

  return {
    health,
    status,
    totalPenalties,
    baseScore: 100,
    formula: SCORING_FORMULA,
    signalsBreakdown: breakdown
  };
}

export function calculateHealthScore(account: Account): HealthScoreResult {
  let totalPenalties = 0;
  const waterfallItems: WaterfallItem[] = [];

  for (const key of SIGNAL_KEYS) {
    const signal = account.signals[key];
    const meta = SIGNAL_METADATA[key];
    const penalty = Math.max(0, signal ? signal.penalty : 0);
    totalPenalties += penalty;

    waterfallItems.push({
      id: key,
      signal: signal ? signal.name : key,
      label: meta.label,
      penalty,
      percentage: penalty, // Raw percentage out of 100 points
      severity: signal ? signal.severity : 'healthy'
    });
  }

  // Sort descending by penalty (highest penalty first for waterfall chart)
  waterfallItems.sort((a, b) => b.penalty - a.penalty);

  // Clamp calculated health score between 0 and 100
  const health = Math.max(0, Math.min(100, Math.round(100 - totalPenalties)));

  let status: 'critical' | 'warning' | 'healthy' = 'healthy';
  let statusLabel: 'At Risk' | 'Watch' | 'Healthy' = 'Healthy';

  if (health < 50) {
    status = 'critical';
    statusLabel = 'At Risk';
  } else if (health < 75) {
    status = 'warning';
    statusLabel = 'Watch';
  } else {
    status = 'healthy';
    statusLabel = 'Healthy';
  }

  // Calculate 30-day delta estimate based on severity
  let trend30d = 0;
  if (health < 30) {
    trend30d = -23;
  } else if (health < 50) {
    trend30d = -16;
  } else if (health < 75) {
    trend30d = -7;
  } else {
    trend30d = +4;
  }

  return {
    health,
    status,
    statusLabel,
    totalPenalties,
    waterfall: waterfallItems,
    trend30d
  };
}

