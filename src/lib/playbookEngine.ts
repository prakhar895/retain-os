import { Account, RetentionPlay } from '../types';
import { calculateHealthScore } from './scoring';

export interface ProjectionDataPoint {
  day: string;
  dayNum: number;
  baseline: number;
  projected: number;
  isRenewal?: boolean;
}

export interface PlaybookTrajectoryResult {
  projectedHealth: number;
  recoveryPoints: number;
  baselineHealth: number;
  saveProbability: number;
}

export function generatePlaybookForAccount(account: Account): RetentionPlay[] {
  const plays: RetentionPlay[] = [];
  const { signals } = account;

  // Rule 1: Champion Change severity high/critical
  if (signals.championChange && signals.championChange.severity === 'critical') {
    plays.push({
      id: 'play-champion-reanchor',
      title: 'Re-anchor executive sponsorship',
      rationale: `Schedule an executive alignment session with ${account.newExecName || 'the interim executive sponsor'} to identify the new champion and re-establish the strategic value proposition.`,
      ownerName: account.csmName || 'Priya Nair',
      ownerRole: 'Enterprise CSM',
      ownerAvatar: account.csmAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      dueInDays: 3,
      channel: 'Executive',
      impactPoints: 14,
      evidenceSignalIds: ['championChange', 'execEngagement'],
      evidenceLabels: ['Champion Churn', 'Exec Disengagement'],
      asset: {
        type: 'email',
        typeLabel: 'Executive Sponsor Re-anchor Email',
        subject: `Ensuring continued ROI for ${account.name}`,
        from: `${account.csmName || 'Priya Nair'} <${account.csmName ? account.csmName.toLowerCase().replace(' ', '.') : 'priya.nair'}@retainos.com>`,
        to: `{{new_exec_name}}`,
        body: `Hi {{new_exec_name}},

I'm reaching out from Retain OS. Following the recent organizational changes, I wanted to ensure you have complete executive visibility into the {{roi_metric}} we've been tracking for {{account_name}}.

Currently, we've identified approximately {{current_wasted_spend}} in potential efficiency gains that are currently unoptimized due to recent adoption gaps.

Would you have 15 minutes next Tuesday to discuss how we can re-align our platform to your Q3 operational objectives?

Best regards,
{{csm_name}}
Enterprise Customer Success`,
        toneOptions: [
          {
            label: 'Consultative',
            toneKey: 'consultative',
            body: `Hi {{new_exec_name}},

I'm reaching out from Retain OS. Following the recent leadership transition, I wanted to ensure you have clear visibility into the {{roi_metric}} we've been tracking for {{account_name}}.

Currently, we've identified approximately {{current_wasted_spend}} in potential efficiency gains that are currently unoptimized due to recent workflow gaps.

Would you have 15 minutes next Tuesday to discuss how we can re-align our platform to your Q3 strategic goals?

Best regards,
{{csm_name}}`
          },
          {
            label: 'Executive',
            toneKey: 'executive',
            body: `Dear {{new_exec_name}},

Congratulations on stepping into leadership at {{account_name}}. 

As your enterprise partner supporting {{roi_metric}}, I wanted to provide a concise executive summary of our operational impact and review {{current_wasted_spend}} in optimization opportunities prior to the upcoming renewal.

Please let me know if 15 minutes on Thursday fits your calendar for a strategic briefing.

Sincerely,
{{csm_name}}
Director, Enterprise Success`
          },
          {
            label: 'Urgent',
            toneKey: 'urgent',
            body: `Hi {{new_exec_name}},

With {{account_name}}'s renewal occurring in {{renewal_days}} days, I want to proactively address several open integration items and protect {{roi_metric}}.

We've noted {{current_wasted_spend}} in underutilized licenses that we can immediately recover with a brief 15-minute executive alignment this week.

Can we connect tomorrow afternoon at 2:00 PM?

Best,
{{csm_name}}`
          }
        ]
      }
    });
  }

  // Rule 2: Usage decline worse than -30%
  const usageDrop = signals.usage && signals.usage.metricNumber ? signals.usage.metricNumber : -10;
  if (usageDrop <= -30 || (signals.usage && signals.usage.severity === 'critical')) {
    plays.push({
      id: 'play-re-onboarding',
      title: 'Launch targeted re-onboarding campaign',
      rationale: `Deploy a high-touch email sequence and interactive training session focused on unused core features to reverse the ${signals.usage.delta} active user drop.`,
      ownerName: 'Marcus Webb',
      ownerRole: 'Solutions Architect',
      ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      dueInDays: 7,
      channel: 'Sequence',
      impactPoints: 18,
      evidenceSignalIds: ['usage', 'adoption'],
      evidenceLabels: ['Usage Decline', 'Adoption Gaps'],
      asset: {
        type: 'sequence',
        typeLabel: '3-Touch Re-activation Sequence',
        subject: `Step-by-step optimization blueprint for {{account_name}} team`,
        from: `Marcus Webb <marcus.webb@retainos.com>`,
        to: `All Team Leads at {{account_name}}`,
        body: `[Touchpoint 1 - Day 1: Automated Health Check Report]
Hi Team,
We noticed team activity on {{account_name}} has shifted recently. Here is a custom 3-minute video walkthrough showing how to save 4 hours/week on automated workflows and unlock {{roi_metric}}.

[Touchpoint 2 - Day 4: Interactive Live Workshop Invite]
Join our Senior Solutions Architect for a private 25-minute clinic tailored to your dispatcher and operations team. 

[Touchpoint 3 - Day 8: Direct Workflow Templates]
Pre-configured templates ready to import in 1 click to eliminate {{current_wasted_spend}} in unused compute capacity.`,
        toneOptions: [
          {
            label: 'Consultative',
            toneKey: 'consultative',
            body: `[Touchpoint 1 - Day 1: Workflow Health Digest]
Hi Team,
We've prepared a customized digest for {{account_name}} highlighting key shortcuts to unlock {{roi_metric}}.

[Touchpoint 2 - Day 4: Private Solutions Clinic]
Join Marcus Webb for a hands-on 20-minute workspace optimization session.

[Touchpoint 3 - Day 7: Pre-built Automation Templates]
Ready-to-use workflows to instantly recover {{current_wasted_spend}} in productivity.`
          },
          {
            label: 'Collaborative',
            toneKey: 'collaborative',
            body: `[Touchpoint 1: Co-working Invitation]
Hey {{account_name}} team! Let's get together for a quick 15-minute coffee & learn session on our latest features.

[Touchpoint 2: Custom Playbook Shared]
Here's the custom cheatsheet designed specifically for your daily operations to maximize {{roi_metric}}.`
          }
        ]
      }
    });
  }

  // Rule 3: 2 or more open P1 tickets (or severe support escalations)
  const p1Count = signals.support && signals.support.metricNumber ? signals.support.metricNumber : 0;
  if (p1Count >= 1 || (signals.support && signals.support.penalty >= 10)) {
    plays.push({
      id: 'play-p1-escalate',
      title: 'Escalate and close open P1 backlog',
      rationale: `Coordinate with Engineering leadership and assign dedicated escalation engineers to expedite resolution of open tickets and restore SLA trust.`,
      ownerName: 'Dana Ortiz',
      ownerRole: 'Head of Support Engineering',
      ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      dueInDays: 2,
      channel: 'Meeting',
      impactPoints: 9,
      evidenceSignalIds: ['support'],
      evidenceLabels: ['P1 Tickets', 'Support Escalations'],
      asset: {
        type: 'agenda',
        typeLabel: 'P1 Engineering Escalation War-Room Agenda',
        subject: `Critical Issue Resolution Plan — {{account_name}}`,
        from: `Dana Ortiz <dana.ortiz@retainos.com>`,
        to: `Engineering Escalation Team & {{account_name}} IT Lead`,
        body: `### Incident Review & Expedited Patch Plan: {{account_name}}
**Date:** Next 48 Hours | **Priority:** P1 Escalation Bridge

1. **Root-Cause Analysis (10 mins)**
   - Review root cause for active tickets (#8492, #8501) and API latency spikes.
2. **Immediate Patch Deployment (15 mins)**
   - Deploy hotfix container to dedicated tenant instance.
3. **SLA Credit & Remediation Commitment (10 mins)**
   - Issue formal RCA document and guarantee sub-15ms response latency for {{roi_metric}}.
4. **Daily Standup Cadence (5 mins)**
   - Daily 9:00 AM Slack updates until zero open blockers.`
      }
    });
  }

  // Rule 4: No QBR in 90+ days / Exec engagement gaps
  const daysSinceQbr = signals.execEngagement && signals.execEngagement.metricNumber ? signals.execEngagement.metricNumber : 60;
  if (daysSinceQbr >= 90 || (signals.execEngagement && signals.execEngagement.penalty >= 7)) {
    plays.push({
      id: 'play-value-qbr',
      title: 'Run value realization QBR',
      rationale: `Prepare and present an executive ROI deck showcasing verified savings and forward roadmap to ensure renewal confidence.`,
      ownerName: account.csmName || 'Priya Nair',
      ownerRole: 'Enterprise CSM',
      ownerAvatar: account.csmAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      dueInDays: 5,
      channel: 'Meeting',
      impactPoints: 11,
      evidenceSignalIds: ['execEngagement', 'commercial'],
      evidenceLabels: ['Exec Disengagement', 'Commercial Realization'],
      asset: {
        type: 'deck',
        typeLabel: 'Strategic Value Realization Deck Outline',
        subject: `Executive Value Realization: {{account_name}} Year-in-Review`,
        body: `### Executive Business Review: {{account_name}}
**Slides Architecture & Key Data Points:**

- **Slide 1:** Executive Summary — Delivering on {{roi_metric}}
- **Slide 2:** Historical Usage & Value Realized vs Initial Business Case
- **Slide 3:** Addressing Recent Support & Stability Commitments
- **Slide 4:** Unlocking {{current_wasted_spend}} in Untapped Feature Modules
- **Slide 5:** 12-Month Product Roadmap Alignment & VIP Feature Access
- **Slide 6:** Renewal Terms & Multi-Year Expansion Discount Proposal`
      }
    });
  }

  // Rule 5: Seat count declining / Commercial re-scoping
  if (signals.commercial && signals.commercial.penalty >= 5) {
    plays.push({
      id: 'play-commercial-rescope',
      title: 'Commercial re-scoping conversation',
      rationale: `Proactively restructure license tiers and seat allocation to eliminate shelfware objections before procurement issues a downscale notice.`,
      ownerName: account.csmName || 'Priya Nair',
      ownerRole: 'Commercial Account Director',
      ownerAvatar: account.csmAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      dueInDays: 4,
      channel: 'Email',
      impactPoints: 7,
      evidenceSignalIds: ['commercial'],
      evidenceLabels: ['Seat Utilization', 'Commercial Agreement'],
      asset: {
        type: 'email',
        typeLabel: 'Commercial Optimization Proposal',
        subject: `Optimizing {{account_name}}'s license structure for maximum value`,
        from: `${account.csmName || 'Priya Nair'} <priya.nair@retainos.com>`,
        to: `Procurement & Operations Lead at {{account_name}}`,
        body: `Hi Team,

Ahead of {{account_name}}'s upcoming renewal in {{renewal_days}} days, we conducted an audit of your workspace license efficiency.

Rather than letting unused seats sit idle, we propose reallocating {{current_wasted_spend}} in unused seats into our dedicated Enterprise Premium SLA and API Data Streaming package at no net increase to your annual contract.

Let me know if we can review this 1-page adjustment proposal on Thursday.

Best,
{{csm_name}}`
      }
    });
  }

  // Fallback Rule: Feature Breadth / Workshop if fewer than 3 plays
  if (plays.length < 3) {
    plays.push({
      id: 'play-feature-workshop',
      title: 'Deploy feature activation workshop',
      rationale: `Host a hands-on technical workshop for end-users to activate advanced unused modules and deepen product stickiness.`,
      ownerName: 'Marcus Webb',
      ownerRole: 'Solutions Architect',
      ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      dueInDays: 6,
      channel: 'Meeting',
      impactPoints: 12,
      evidenceSignalIds: ['adoption', 'usage'],
      evidenceLabels: ['Feature Breadth', 'Active Usage'],
      asset: {
        type: 'sequence',
        typeLabel: 'Hands-on Technical Activation Workshop',
        subject: `Deep Dive Workshop for {{account_name}} Operators`,
        body: `### Feature Activation Curriculum: {{account_name}}
1. Live configuration of advanced automation pipelines
2. Reducing manual dispatch time by 40%
3. Live Q&A and workflow custom certification for attendees`
      }
    });
  }

  // Sort descending by impact points and return top 3
  plays.sort((a, b) => b.impactPoints - a.impactPoints);
  return plays.slice(0, 3);
}

// Compute save probability as a bounded function of active impact relative to health deficit
export function calculateSaveProbability(currentHealth: number, activeImpactPoints: number): number {
  const deficit = Math.max(1, 100 - currentHealth);
  
  if (currentHealth >= 80) {
    return Math.min(98, Math.max(85, Math.round(88 + activeImpactPoints * 0.4)));
  }

  // Ratio of impact to deficit
  const ratio = activeImpactPoints / deficit;
  const rawProb = 35 + Math.round(ratio * 55);

  return Math.min(96, Math.max(18, rawProb));
}

// Derive baseline decline per-account from that account's usage decline severity / telemetry
export function calculateBaselineDecline(account: Account): number {
  const usage = account.signals?.usage;
  if (!usage) return 10;

  if (usage.severity === 'critical') {
    // For critical usage drops, scale from usage telemetry drop or penalty
    if (typeof usage.metricNumber === 'number' && usage.metricNumber < 0) {
      return Math.max(12, Math.round(Math.abs(usage.metricNumber) * 0.42));
    }
    return Math.max(12, Math.round((usage.penalty || 20) * 0.7));
  }

  if (usage.severity === 'warning') {
    if (typeof usage.metricNumber === 'number' && usage.metricNumber < 0) {
      return Math.max(4, Math.round(Math.abs(usage.metricNumber) * 0.5));
    }
    return Math.max(4, Math.round((usage.penalty || 10) * 0.6));
  }

  // Healthy / minor telemetry change
  return Math.max(1, Math.round((usage.penalty || 2) * 0.5));
}

// Single source of truth for all trajectory metrics: projectedHealth, recoveryPoints, baselineHealth, saveProbability
export function calculatePlaybookTrajectory(
  account: Account,
  enabledPlays: RetentionPlay[]
): PlaybookTrajectoryResult {
  const currentHealth = calculateHealthScore(account).health;
  
  // recoveryPoints must equal the exact sum of enabled plays' impactPoints, with no discount or decay applied
  const recoveryPoints = enabledPlays.reduce((sum, p) => sum + (p.impactPoints || 0), 0);
  
  const projectedHealth = Math.min(100, Math.max(0, currentHealth + recoveryPoints));
  
  const baselineDecline = calculateBaselineDecline(account);
  const baselineHealth = Math.max(0, currentHealth - baselineDecline);
  
  const saveProbability = calculateSaveProbability(currentHealth, recoveryPoints);

  return {
    projectedHealth,
    recoveryPoints,
    baselineHealth,
    saveProbability
  };
}

// Generate projection chart points comparing baseline decline vs recovery from enabled plays
export function calculate30DayProjection(
  currentHealth: number, 
  activeImpactPoints: number,
  renewalDays: number = 28,
  baselineDecline?: number
): ProjectionDataPoint[] {
  const data: ProjectionDataPoint[] = [];

  // Determine horizon: ensure it covers the renewal date plus a post-renewal buffer
  const maxDay = Math.max(30, Math.min(60, Math.ceil(renewalDays / 5) * 5 + 5));

  // Determine key milestone days, ensuring the exact renewal day is included
  const rawDays = [0, 5, 10, 15, 20, 25, 30];
  if (renewalDays > 30 && maxDay > 30) {
    for (let d = 35; d <= maxDay; d += 10) {
      if (!rawDays.includes(d)) rawDays.push(d);
    }
  }

  // Insert the exact renewal day milestone if not already present
  if (!rawDays.includes(renewalDays) && renewalDays <= maxDay) {
    rawDays.push(renewalDays);
  }
  rawDays.sort((a, b) => a - b);

  // Filter to keep a clean 6 to 8 points on the chart
  const milestoneDays = rawDays.filter(d => d <= maxDay);

  const totalDecline = baselineDecline !== undefined 
    ? baselineDecline 
    : (currentHealth < 50 ? 15 : (currentHealth < 75 ? 8 : 3));

  // Target recovery level is exactly currentHealth + activeImpactPoints
  const targetRecovery = Math.min(100, currentHealth + activeImpactPoints);

  for (const d of milestoneDays) {
    const timeRatio = Math.min(1, d / Math.max(20, renewalDays));
    const baselineDecay = Math.round(totalDecline * timeRatio);
    const baselineVal = Math.max(0, currentHealth - baselineDecay);

    let recoveryVal: number;
    if (d === 0) {
      recoveryVal = currentHealth;
    } else if (activeImpactPoints === 0) {
      // With NO enabled plays, the trajectory follows the declining baseline
      recoveryVal = baselineVal;
    } else {
      // S-curve ramp toward target recovery
      const progress = Math.min(1, d / Math.max(15, Math.min(30, renewalDays)));
      const smoothProgress = progress * progress * (3 - 2 * progress);
      
      const potentialUplift = (targetRecovery - currentHealth) * smoothProgress;
      recoveryVal = Math.min(
        100,
        Math.max(baselineVal, Math.round(currentHealth + potentialUplift))
      );
    }

    const isRenewal = d === renewalDays;
    const dayLabel = d === 0 ? 'Today' : `+${d}d`;

    data.push({
      day: dayLabel,
      dayNum: d,
      baseline: baselineVal,
      projected: recoveryVal,
      isRenewal
    });
  }

  return data;
}

// Helper to replace merge fields in templates
export function interpolateTemplate(template: string, account: Account): string {
  return template
    .replace(/\{\{account_name\}\}/g, account.name)
    .replace(/\{\{new_exec_name\}\}/g, account.newExecName || 'Executive Sponsor')
    .replace(/\{\{roi_metric\}\}/g, account.roiMetric)
    .replace(/\{\{current_wasted_spend\}\}/g, account.potentialWastedSpend)
    .replace(/\{\{renewal_days\}\}/g, account.renewalDays.toString())
    .replace(/\{\{csm_name\}\}/g, account.csmName || 'Priya Nair');
}
