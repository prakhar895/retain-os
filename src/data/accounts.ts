import { Account } from '../types';

export const ACCOUNTS: Account[] = [
  {
    id: 'nexus-logistics',
    name: 'Nexus Logistics',
    initials: 'NL',
    arr: 210000,
    arrFormatted: '$210,000',
    tier: 'Enterprise',
    industry: 'Logistics & Supply Chain',
    renewalDays: 34,
    renewalDate: 'Sep 28, 2026',
    csmName: 'Priya Nair',
    csmAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    tags: ['Enterprise', 'Logistics', 'Renewal in 34 days', 'Tier 1 Support'],
    roiMetric: '$1.4M dispatch efficiency',
    potentialWastedSpend: '$48,000/yr',
    newExecName: 'Robert Martinez (Interim VP Ops)',
    churnDriversSummary: 'VP of Ops departed without handover; 3 open P1 integration tickets breached SLA; WAU dropped 42% over last 6 weeks.',
    contacts: [
      { name: 'Robert Martinez', role: 'Interim VP Operations', email: 'r.martinez@nexuslogistics.com', isChampion: false, status: 'Unresponsive' },
      { name: 'Priya Nair', role: 'Enterprise CSM', email: 'priya.nair@retainos.com' },
      { name: 'Marcus Webb', role: 'Solutions Architect', email: 'marcus.webb@retainos.com' },
      { name: 'Dana Ortiz', role: 'Head of Support Engineering', email: 'dana.ortiz@retainos.com' }
    ],
    signals: {
      usage: {
        id: 'usage',
        name: 'Usage Telemetry (WAU)',
        weight: 30,
        value: '181 WAU',
        delta: '−42%',
        metricNumber: -42,
        description: '312 → 181 WAU over 6 weeks across dispatcher & analyst seats',
        severity: 'critical',
        penalty: 26,
        sparkline: [320, 318, 312, 290, 280, 265, 240, 220, 205, 195, 184, 181],
        benchmark: '320 target'
      },
      support: {
        id: 'support',
        name: 'Support Escalations',
        weight: 20,
        value: '3 Open P1s',
        delta: '3 SLA Breaches',
        metricNumber: 3,
        description: 'Oldest open 19 days on Route Optimization API downtime',
        severity: 'critical',
        penalty: 15,
        sparkline: [0, 0, 1, 0, 1, 2, 1, 2, 3, 3, 3, 3],
        benchmark: '0 SLA breaches'
      },
      championChange: {
        id: 'championChange',
        name: 'Champion Tracking',
        weight: 15,
        value: 'Departed',
        delta: 'Mar 4 (No successor)',
        description: 'VP Ops departed to competitor; no new sponsor designated',
        severity: 'critical',
        penalty: 15,
        sparkline: [100, 100, 100, 100, 100, 100, 20, 0, 0, 0, 0, 0],
        benchmark: 'Designated Sponsor'
      },
      adoption: {
        id: 'adoption',
        name: 'Feature Breadth',
        weight: 15,
        value: '2 of 9 modules',
        delta: 'Stagnant (120d)',
        description: 'Never activated Automated Route Optimization or Webhook API',
        severity: 'warning',
        penalty: 11,
        sparkline: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        benchmark: '6 of 9 recommended'
      },
      execEngagement: {
        id: 'execEngagement',
        name: 'Executive Engagement',
        weight: 10,
        value: '114 days ago',
        delta: 'Overdue QBR',
        metricNumber: 114,
        description: 'Last executive business review was Nov 2025; 2 invites declined',
        severity: 'warning',
        penalty: 8,
        sparkline: [90, 80, 70, 60, 50, 40, 30, 20, 10, 5, 0, 0],
        benchmark: '< 90 days'
      },
      commercial: {
        id: 'commercial',
        name: 'Commercial & Seats',
        weight: 10,
        value: '64% seat util',
        delta: '−18 seats idle',
        metricNumber: -18,
        description: '32 unassigned licenses; procurement inquiry on downgrade options',
        severity: 'warning',
        penalty: 6,
        sparkline: [95, 92, 90, 88, 82, 78, 74, 70, 68, 66, 65, 64],
        benchmark: '> 85%'
      }
    },
    activities: [
      { id: 'act-1', date: 'Today, 09:41', type: 'Support', description: 'Ticket #8492 updated (Severity: High - Route API Latency)', user: 'Dana Ortiz' },
      { id: 'act-2', date: 'Yesterday, 14:20', type: 'Product', description: 'Exported complete fleet user list to CSV', user: 'r.martinez@nexuslogistics.com' },
      { id: 'act-3', date: 'Sep 24, 11:05', type: 'Email', description: 'Quarterly Executive Review invitation declined with note "re-structuring team"', user: 'Automated Calendar' },
      { id: 'act-4', date: 'Sep 18, 16:30', type: 'Support', description: 'P1 Ticket #8501 logged: Webhook delivery failures on webhook endpoint #4', user: 'SysOps Alert' }
    ]
  },
  {
    id: 'acme-corp',
    name: 'Acme Corp',
    initials: 'AC',
    arr: 120000,
    arrFormatted: '$120,000',
    tier: 'Enterprise',
    industry: 'Manufacturing & Distribution',
    renewalDays: 61,
    renewalDate: 'Oct 25, 2026',
    csmName: 'Marcus Webb',
    csmAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    tags: ['Enterprise', 'Manufacturing', 'Renewal in 61 days', 'Legacy Migration'],
    roiMetric: '3,200 hrs/month automated assembly tracking',
    potentialWastedSpend: '$29,000/yr',
    newExecName: 'Elena Rostova (Chief Technology Officer)',
    churnDriversSummary: '2 unresolved P1 tickets with chronic data pipeline timeouts; weekly active users decreased by 34%; seat utilization dropped under 60%.',
    contacts: [
      { name: 'Elena Rostova', role: 'Chief Technology Officer', email: 'e.rostova@acmecorp.com', isChampion: true, status: 'At Risk' },
      { name: 'Marcus Webb', role: 'Senior CSM', email: 'marcus.webb@retainos.com' },
      { name: 'Dana Ortiz', role: 'Support Lead', email: 'dana.ortiz@retainos.com' }
    ],
    signals: {
      usage: {
        id: 'usage',
        name: 'Usage Telemetry (WAU)',
        weight: 30,
        value: '220 WAU',
        delta: '−34%',
        metricNumber: -34,
        description: 'Assembly line leads abandoned workflow dashboard in favor of legacy Excel',
        severity: 'critical',
        penalty: 22,
        sparkline: [330, 320, 310, 290, 275, 260, 250, 240, 235, 228, 222, 220],
        benchmark: '350 target'
      },
      support: {
        id: 'support',
        name: 'Support Escalations',
        weight: 20,
        value: '2 Open P1s',
        delta: 'Chronic timeout',
        metricNumber: 2,
        description: '2 active P1 tickets on ETL batch delays; 8 support tickets logged in 14 days',
        severity: 'critical',
        penalty: 18,
        sparkline: [0, 0, 0, 1, 1, 2, 2, 2, 3, 2, 2, 2],
        benchmark: '0 open P1'
      },
      championChange: {
        id: 'championChange',
        name: 'Champion Tracking',
        weight: 15,
        value: 'Engaged',
        delta: 'CTO present',
        description: 'Champion remains in role but expressing extreme frustration over support SLAs',
        severity: 'healthy',
        penalty: 0,
        sparkline: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        benchmark: 'Designated Sponsor'
      },
      adoption: {
        id: 'adoption',
        name: 'Feature Breadth',
        weight: 15,
        value: '3 of 8 modules',
        delta: 'Low pipeline depth',
        description: 'Only using Basic Inventory; Advanced Predictive Ordering uninstalled',
        severity: 'warning',
        penalty: 12,
        sparkline: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        benchmark: '6 of 8 recommended'
      },
      execEngagement: {
        id: 'execEngagement',
        name: 'Executive Engagement',
        weight: 10,
        value: '95 days ago',
        delta: 'QBR Pending',
        metricNumber: 95,
        description: 'Last executive check-in was 95 days ago; requested escalated SLA review',
        severity: 'warning',
        penalty: 8,
        sparkline: [85, 75, 65, 55, 45, 35, 25, 15, 10, 5, 0, 0],
        benchmark: '< 90 days'
      },
      commercial: {
        id: 'commercial',
        name: 'Commercial & Seats',
        weight: 10,
        value: '58% seat util',
        delta: '−22 unused seats',
        metricNumber: -22,
        description: 'Contract up for renewal with pending procurement request to downscale to 60 seats',
        severity: 'warning',
        penalty: 6,
        sparkline: [90, 88, 85, 80, 75, 70, 65, 62, 60, 59, 58, 58],
        benchmark: '> 85%'
      }
    },
    activities: [
      { id: 'act-201', date: 'Today, 11:15', type: 'Support', description: 'Ticket #9102 escalated: Production sync job timed out after 300s', user: 'Elena Rostova' },
      { id: 'act-202', date: '2 days ago', type: 'Commercial', description: 'Procurement requested renewal price breakdown for 60 seats instead of 100', user: 'Acme Procurement' },
      { id: 'act-203', date: 'Last week', type: 'Product', description: 'Failed deployment of Predictive Ordering v2 connector', user: 'System Telemetry' }
    ]
  },
  {
    id: 'starlight-media',
    name: 'Starlight Media',
    initials: 'SM',
    arr: 85000,
    arrFormatted: '$85,000',
    tier: 'Strategic',
    industry: 'Digital Streaming & Media',
    renewalDays: 22,
    renewalDate: 'Sep 16, 2026',
    csmName: 'Sarah Jenkins',
    csmAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    tags: ['Strategic', 'Media', 'Renewal in 22 days', 'Urgent Retention'],
    roiMetric: '1.2M daily media transcoding runs',
    potentialWastedSpend: '$18,500/yr',
    newExecName: 'David Kim (VP Content Ops)',
    churnDriversSummary: 'Renewal in 22 days; previous VP of Digital left last month; usage down 31%; lack of QBR in 105 days.',
    contacts: [
      { name: 'David Kim', role: 'VP Content Ops', email: 'd.kim@starlightmedia.com', isChampion: false, status: 'Needs Introduction' },
      { name: 'Sarah Jenkins', role: 'Senior CSM', email: 'sarah.j@retainos.com' }
    ],
    signals: {
      usage: {
        id: 'usage',
        name: 'Usage Telemetry (WAU)',
        weight: 30,
        value: '140 WAU',
        delta: '−31%',
        metricNumber: -31,
        description: 'Streaming render jobs dropped from 22k/day to 14k/day',
        severity: 'critical',
        penalty: 18,
        sparkline: [210, 205, 200, 190, 180, 170, 165, 155, 148, 145, 142, 140],
        benchmark: '200 target'
      },
      support: {
        id: 'support',
        name: 'Support Escalations',
        weight: 20,
        value: '1 Open P1',
        delta: '1 Escalation',
        metricNumber: 1,
        description: 'Single high-impact ticket regarding DRM ingest pipeline compatibility',
        severity: 'warning',
        penalty: 12,
        sparkline: [0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1],
        benchmark: '0 open P1'
      },
      championChange: {
        id: 'championChange',
        name: 'Champion Tracking',
        weight: 15,
        value: 'New VP',
        delta: 'Joined 3 wks ago',
        description: 'New VP Content Ops has history with competitive vendor (TranscodePro)',
        severity: 'critical',
        penalty: 15,
        sparkline: [100, 100, 100, 100, 100, 80, 40, 20, 10, 0, 0, 0],
        benchmark: 'Designated Sponsor'
      },
      adoption: {
        id: 'adoption',
        name: 'Feature Breadth',
        weight: 15,
        value: '4 of 7 modules',
        delta: 'Medium adoption',
        description: 'Core transcoding active, live syndication pipelines unconfigured',
        severity: 'warning',
        penalty: 6,
        sparkline: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        benchmark: '6 of 7 recommended'
      },
      execEngagement: {
        id: 'execEngagement',
        name: 'Executive Engagement',
        weight: 10,
        value: '105 days ago',
        delta: 'Overdue QBR',
        metricNumber: 105,
        description: 'No strategic touchpoint since Q1; renewal proposal pending signature',
        severity: 'warning',
        penalty: 4,
        sparkline: [80, 70, 60, 50, 40, 30, 20, 10, 5, 0, 0, 0],
        benchmark: '< 90 days'
      },
      commercial: {
        id: 'commercial',
        name: 'Commercial & Seats',
        weight: 10,
        value: '72% seat util',
        delta: '−8 seats',
        metricNumber: -8,
        description: 'Moderate utilization drop following post-production team restructuring',
        severity: 'healthy',
        penalty: 4,
        sparkline: [88, 85, 84, 82, 80, 78, 76, 75, 74, 73, 72, 72],
        benchmark: '> 85%'
      }
    },
    activities: [
      { id: 'act-301', date: '3 days ago', type: 'Executive', description: 'Introduction email sent to David Kim; awaiting meeting slot confirmation', user: 'Sarah Jenkins' },
      { id: 'act-302', date: 'Aug 14', type: 'Product', description: 'Monthly bandwidth quota reached 82%', user: 'System Telemetry' }
    ]
  },
  {
    id: 'orbit-financial',
    name: 'Orbit Financial',
    initials: 'OF',
    arr: 95000,
    arrFormatted: '$95,000',
    tier: 'Mid-Market',
    industry: 'Fintech & Wealth Management',
    renewalDays: 140,
    renewalDate: 'Jan 12, 2027',
    csmName: 'Alex Thorne',
    csmAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    tags: ['Mid-Market', 'Fintech', 'Watch Status', 'Compliance Audit'],
    roiMetric: '99.98% financial reconciliation uptime',
    potentialWastedSpend: '$12,000/yr',
    newExecName: 'Patricia Vance (VP Compliance)',
    churnDriversSummary: 'Recent SOC2 compliance query created minor friction; usage stable with slight drop in secondary reporting features.',
    contacts: [
      { name: 'Patricia Vance', role: 'VP Compliance & Risk', email: 'p.vance@orbitfinancial.com', isChampion: true, status: 'Active' },
      { name: 'Alex Thorne', role: 'CSM', email: 'alex.t@retainos.com' }
    ],
    signals: {
      usage: {
        id: 'usage',
        name: 'Usage Telemetry (WAU)',
        weight: 30,
        value: '310 WAU',
        delta: '−12%',
        metricNumber: -12,
        description: 'Steady core usage; drop confined to ad-hoc compliance export queries',
        severity: 'warning',
        penalty: 10,
        sparkline: [350, 345, 340, 335, 330, 325, 320, 318, 315, 312, 310, 310],
        benchmark: '350 target'
      },
      support: {
        id: 'support',
        name: 'Support Escalations',
        weight: 20,
        value: '0 Open P1s',
        delta: '2 P2 Open',
        metricNumber: 0,
        description: 'P2 tickets regarding custom CSV formatting for audit reports',
        severity: 'warning',
        penalty: 8,
        sparkline: [0, 0, 1, 1, 0, 0, 1, 2, 2, 2, 2, 2],
        benchmark: '0 open P1'
      },
      championChange: {
        id: 'championChange',
        name: 'Champion Tracking',
        weight: 15,
        value: 'Stable',
        delta: 'Champion active',
        description: 'VP of Compliance actively managing workspace and team permissions',
        severity: 'healthy',
        penalty: 0,
        sparkline: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        benchmark: 'Designated Sponsor'
      },
      adoption: {
        id: 'adoption',
        name: 'Feature Breadth',
        weight: 15,
        value: '5 of 8 modules',
        delta: 'Expansion opportunity',
        description: 'Audit logs active; automated risk score rule builder not yet turned on',
        severity: 'warning',
        penalty: 10,
        sparkline: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        benchmark: '6 of 8 recommended'
      },
      execEngagement: {
        id: 'execEngagement',
        name: 'Executive Engagement',
        weight: 10,
        value: '62 days ago',
        delta: 'Healthy cadence',
        metricNumber: 62,
        description: 'Last review completed 2 months ago; next sync scheduled for Q4',
        severity: 'healthy',
        penalty: 6,
        sparkline: [95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40],
        benchmark: '< 90 days'
      },
      commercial: {
        id: 'commercial',
        name: 'Commercial & Seats',
        weight: 10,
        value: '84% seat util',
        delta: '+4 seats added',
        metricNumber: 4,
        description: 'Good seat utilization with consistent monthly seat additions',
        severity: 'healthy',
        penalty: 4,
        sparkline: [78, 80, 80, 82, 82, 83, 83, 84, 84, 84, 84, 84],
        benchmark: '> 85%'
      }
    },
    activities: [
      { id: 'act-401', date: 'Aug 20', type: 'Support', description: 'Ticket #8821 resolved: SOC2 report download bundle generated', user: 'Support Team' },
      { id: 'act-402', date: 'Aug 10', type: 'Product', description: 'Admin added 4 new compliance analyst seats', user: 'Patricia Vance' }
    ]
  },
  {
    id: 'vantage-retail',
    name: 'Vantage Retail',
    initials: 'VR',
    arr: 140000,
    arrFormatted: '$140,000',
    tier: 'Enterprise',
    industry: 'Omnichannel Commerce & Retail',
    renewalDays: 210,
    renewalDate: 'Mar 23, 2027',
    csmName: 'Priya Nair',
    csmAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    tags: ['Enterprise', 'Retail', 'Healthy Account', 'Expansion Candidate'],
    roiMetric: '18.4% faster inventory turnaround',
    potentialWastedSpend: '$0/yr (Full ROI)',
    newExecName: 'Claire Duhamel (SVP Global Merchandising)',
    churnDriversSummary: 'Strong engagement, high adoption of 8 of 9 modules, 94% seat utilization with potential upsell for Asia-Pacific division.',
    contacts: [
      { name: 'Claire Duhamel', role: 'SVP Global Merchandising', email: 'c.duhamel@vantageretail.com', isChampion: true, status: 'Super Champion' },
      { name: 'Priya Nair', role: 'CSM Lead', email: 'priya.nair@retainos.com' }
    ],
    signals: {
      usage: {
        id: 'usage',
        name: 'Usage Telemetry (WAU)',
        weight: 30,
        value: '580 WAU',
        delta: '+18%',
        metricNumber: 18,
        description: 'Usage expanded to 14 regional merchandising teams ahead of schedule',
        severity: 'healthy',
        penalty: 4,
        sparkline: [480, 490, 500, 510, 520, 535, 545, 555, 565, 570, 575, 580],
        benchmark: '500 target'
      },
      support: {
        id: 'support',
        name: 'Support Escalations',
        weight: 20,
        value: '0 Open P1s',
        delta: 'Zero SLA breaches',
        metricNumber: 0,
        description: 'Support response times average 9 minutes with 100% CSAT',
        severity: 'healthy',
        penalty: 2,
        sparkline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        benchmark: '0 open P1'
      },
      championChange: {
        id: 'championChange',
        name: 'Champion Tracking',
        weight: 15,
        value: 'Promoted',
        delta: 'Promoted to SVP',
        description: 'Champion promoted to SVP and expanding our budget allocation for next fiscal year',
        severity: 'healthy',
        penalty: 0,
        sparkline: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        benchmark: 'Designated Sponsor'
      },
      adoption: {
        id: 'adoption',
        name: 'Feature Breadth',
        weight: 15,
        value: '8 of 9 modules',
        delta: 'Power User',
        description: 'Using Automated Forecasting, API, Multi-store Sync, and Custom ML rules',
        severity: 'healthy',
        penalty: 3,
        sparkline: [7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8],
        benchmark: '6 of 9 recommended'
      },
      execEngagement: {
        id: 'execEngagement',
        name: 'Executive Engagement',
        weight: 10,
        value: '18 days ago',
        delta: 'Executive Sync Completed',
        metricNumber: 18,
        description: 'Executive QBR held on Aug 7 with glowing feedback on ROI metrics',
        severity: 'healthy',
        penalty: 0,
        sparkline: [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 95, 100],
        benchmark: '< 90 days'
      },
      commercial: {
        id: 'commercial',
        name: 'Commercial & Seats',
        weight: 10,
        value: '94% seat util',
        delta: '+30 seats requested',
        metricNumber: 30,
        description: 'Adding 30 additional seats in October for APAC regional launch',
        severity: 'healthy',
        penalty: 3,
        sparkline: [82, 84, 85, 87, 88, 89, 90, 91, 92, 93, 94, 94],
        benchmark: '> 85%'
      }
    },
    activities: [
      { id: 'act-501', date: 'Aug 18', type: 'Executive', description: 'Executive QBR completed with Claire Duhamel; NPS 10 recorded', user: 'Priya Nair' },
      { id: 'act-502', date: 'Aug 12', type: 'Product', description: 'Activated APAC multi-region data connector module', user: 'System Telemetry' }
    ]
  },
  {
    id: 'cobalt-health',
    name: 'Cobalt Health',
    initials: 'CH',
    arr: 76000,
    arrFormatted: '$76,000',
    tier: 'Mid-Market',
    industry: 'Healthcare & Clinical Diagnostics',
    renewalDays: 185,
    renewalDate: 'Feb 26, 2027',
    csmName: 'Sarah Jenkins',
    csmAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    tags: ['Mid-Market', 'Healthcare', 'Healthy Account', 'HIPAA Certified'],
    roiMetric: '45,000 lab sample records processed/day',
    potentialWastedSpend: '$0/yr (Full ROI)',
    newExecName: 'Dr. Arthur Sterling (Chief Medical Officer)',
    churnDriversSummary: 'Exceptional health score of 91; full product adoption; daily active usage across all clinical teams; zero support escalations.',
    contacts: [
      { name: 'Dr. Arthur Sterling', role: 'Chief Medical Officer', email: 'a.sterling@cobalthealth.org', isChampion: true, status: 'Super Champion' },
      { name: 'Sarah Jenkins', role: 'Senior CSM', email: 'sarah.j@retainos.com' }
    ],
    signals: {
      usage: {
        id: 'usage',
        name: 'Usage Telemetry (WAU)',
        weight: 30,
        value: '420 WAU',
        delta: '+8%',
        metricNumber: 8,
        description: 'Daily clinical lab staff logging in with zero drop-off',
        severity: 'healthy',
        penalty: 2,
        sparkline: [380, 385, 390, 395, 400, 405, 410, 412, 415, 418, 420, 420],
        benchmark: '400 target'
      },
      support: {
        id: 'support',
        name: 'Support Escalations',
        weight: 20,
        value: '0 Open P1s',
        delta: 'Zero tickets',
        metricNumber: 0,
        description: 'Zero open tickets; last closed inquiry resolved in 4 minutes',
        severity: 'healthy',
        penalty: 2,
        sparkline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        benchmark: '0 open P1'
      },
      championChange: {
        id: 'championChange',
        name: 'Champion Tracking',
        weight: 15,
        value: 'Active',
        delta: 'CMO Champion',
        description: 'Dr. Sterling co-presented our joint case study at HealthTech 2026',
        severity: 'healthy',
        penalty: 0,
        sparkline: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        benchmark: 'Designated Sponsor'
      },
      adoption: {
        id: 'adoption',
        name: 'Feature Breadth',
        weight: 15,
        value: '7 of 7 modules',
        delta: '100% Adoption',
        description: 'All HIPAA analytics, encrypted patient intake and lab workflows active',
        severity: 'healthy',
        penalty: 2,
        sparkline: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
        benchmark: '6 of 7 recommended'
      },
      execEngagement: {
        id: 'execEngagement',
        name: 'Executive Engagement',
        weight: 10,
        value: '30 days ago',
        delta: 'Monthly Touchpoint',
        metricNumber: 30,
        description: 'Monthly sync held with CMO and IT Director on July 25',
        severity: 'healthy',
        penalty: 0,
        sparkline: [90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 90, 95],
        benchmark: '< 90 days'
      },
      commercial: {
        id: 'commercial',
        name: 'Commercial & Seats',
        weight: 10,
        value: '96% seat util',
        delta: 'Multi-year Contract',
        metricNumber: 96,
        description: 'Signed 3-year enterprise contract with annual prepayment',
        severity: 'healthy',
        penalty: 3,
        sparkline: [90, 91, 92, 93, 94, 94, 95, 95, 95, 96, 96, 96],
        benchmark: '> 85%'
      }
    },
    activities: [
      { id: 'act-601', date: 'July 25', type: 'Executive', description: 'Monthly Executive Touchpoint with Dr. Arthur Sterling; recorded NPS 10', user: 'Sarah Jenkins' },
      { id: 'act-602', date: 'July 10', type: 'Product', description: 'Completed annual HIPAA compliance certification audit', user: 'Security Bot' }
    ]
  }
];

// Helper to find account by ID
export function getAccountById(id: string): Account | undefined {
  return ACCOUNTS.find(a => a.id === id);
}
