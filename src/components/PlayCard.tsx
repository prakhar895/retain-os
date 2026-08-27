import React from 'react';
import { RetentionPlay } from '../types';
import { Mail, Calendar, MessageSquare, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

interface PlayCardProps {
  play: RetentionPlay;
  index: number;
  isEnabled: boolean;
  onToggle: (playId: string) => void;
  onPreviewAsset: (play: RetentionPlay) => void;
}

export const PlayCard: React.FC<PlayCardProps> = ({
  play,
  index,
  isEnabled,
  onToggle,
  onPreviewAsset
}) => {
  const getChannelIcon = () => {
    switch (play.asset.type) {
      case 'email':
        return <Mail className="w-3 h-3 text-[#2DD4BF]" />;
      case 'sequence':
        return <MessageSquare className="w-3 h-3 text-[#2DD4BF]" />;
      case 'agenda':
        return <Calendar className="w-3 h-3 text-[#2DD4BF]" />;
      case 'deck':
        return <FileText className="w-3 h-3 text-[#2DD4BF]" />;
      default:
        return <Mail className="w-3 h-3 text-[#2DD4BF]" />;
    }
  };

  return (
    <div
      className={`rounded-xl p-3.5 flex flex-col gap-2.5 transition-all duration-200 border ${
        isEnabled
          ? 'bg-[#141A24] border-[#232B38] hover:border-[#2DD4BF]/40 shadow-sm'
          : 'bg-[#0D1C2D]/70 border-[#232B38]/50 opacity-60'
      }`}
    >
      {/* Top Header: Rank, Title, Owner, Toggle */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          {/* Priority Circle */}
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5 ${
              isEnabled
                ? index === 0
                  ? 'bg-[#2DD4BF] text-[#0B0F17]'
                  : 'bg-[#1C2B3C] text-[#2DD4BF] border border-[#232B38]'
                : 'bg-[#232B38] text-[#859490]'
            }`}
          >
            {index + 1}
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-[#d4e4fa] leading-snug truncate">
              {play.title}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-4 h-4 rounded-full bg-[#1C2B3C] overflow-hidden border border-[#232B38] shrink-0">
                <img
                  src={play.ownerAvatar}
                  alt={play.ownerName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] text-[#bacac5] truncate">
                {play.ownerName} · <span className="font-mono">Due in {play.dueInDays}d</span>
              </span>
            </div>
          </div>
        </div>

        {/* Custom Accessible Toggle Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={isEnabled}
          onClick={() => onToggle(play.id)}
          className={`w-9 h-5 rounded-full transition-colors relative p-0.5 shrink-0 focus:outline-none focus:ring-1 focus:ring-[#2DD4BF] ${
            isEnabled ? 'bg-[#2DD4BF]' : 'bg-[#232B38]'
          }`}
          title={isEnabled ? 'Deactivate play' : 'Activate play'}
        >
          <div
            className={`w-4 h-4 rounded-full bg-[#0B0F17] shadow-sm transform transition-transform ${
              isEnabled ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Badges & Impact */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {play.evidenceLabels.map((label, i) => (
          <span
            key={i}
            className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/20"
          >
            {label}
          </span>
        ))}
        <span className="ml-auto text-[11px] font-mono font-bold text-[#2DD4BF] bg-[#2DD4BF]/10 px-1.5 py-0.2 rounded border border-[#2DD4BF]/30">
          +{play.impactPoints} pts
        </span>
      </div>

      {/* Rationale */}
      <p className="text-[11px] text-[#bacac5] leading-relaxed line-clamp-2">
        {play.rationale}
      </p>

      {/* Preview Asset Action */}
      <div className="pt-1 flex items-center justify-between">
        <button
          onClick={() => onPreviewAsset(play)}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#2DD4BF] hover:text-[#57f1db] hover:bg-[#2DD4BF]/10 px-2 py-1 rounded transition-colors border border-[#2DD4BF]/30"
        >
          {getChannelIcon()}
          <span>Preview {play.asset.type} asset</span>
          <ChevronRight className="w-3 h-3" />
        </button>

        <span className="text-[10px] font-mono text-[#859490]">
          {play.channel}
        </span>
      </div>
    </div>
  );
};
