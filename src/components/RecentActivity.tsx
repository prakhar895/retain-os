import React from 'react';
import { ActivityEvent } from '../types';
import { Activity, Clock, ShieldAlert, Cpu, Mail, Calendar } from 'lucide-react';

interface RecentActivityProps {
  activities: ActivityEvent[];
  accountName: string;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities, accountName }) => {
  const getBadgeStyle = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'Support':
        return 'bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30';
      case 'Product':
        return 'bg-[#2DD4BF]/15 text-[#2DD4BF] border border-[#2DD4BF]/30';
      case 'Email':
        return 'bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30';
      case 'Executive':
        return 'bg-[#818CF8]/15 text-[#818CF8] border border-[#818CF8]/30';
      default:
        return 'bg-[#232B38] text-[#bacac5] border border-[#232B38]';
    }
  };

  return (
    <div className="surface-card bg-[#141A24] border border-[#232B38] rounded-xl overflow-hidden select-none">
      <div className="p-4 border-b border-[#232B38] flex justify-between items-center bg-[#122131]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#2DD4BF]" />
          <h3 className="text-xs font-semibold text-[#d4e4fa] tracking-tight">
            Recent Telemetry & Activity Log
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#bacac5]">
          {activities.length} Events Logged
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#232B38] text-[10px] font-mono uppercase tracking-wider text-[#859490] bg-[#0D1C2D]">
              <th className="py-2.5 px-4 font-semibold">Timestamp</th>
              <th className="py-2.5 px-3 font-semibold">Source</th>
              <th className="py-2.5 px-4 font-semibold">Event Description</th>
              <th className="py-2.5 px-4 font-semibold text-right">Actor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#232B38]/60 text-[11px]">
            {activities.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-[#1C2533] transition-colors group"
              >
                <td className="py-2.5 px-4 font-mono text-[#bacac5] whitespace-nowrap">
                  {item.date}
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${getBadgeStyle(item.type)}`}>
                    {item.type}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-[#d4e4fa] font-sans group-hover:text-[#57f1db] transition-colors">
                  {item.description}
                </td>
                <td className="py-2.5 px-4 font-mono text-[#859490] text-right whitespace-nowrap">
                  {item.user}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
