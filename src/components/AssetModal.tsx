import React, { useState, useEffect } from 'react';
import { RetentionPlay, Account } from '../types';
import { interpolateTemplate } from '../lib/playbookEngine';
import { X, Copy, Check, Sparkles, ChevronDown, Mail, Layers, FileText, Calendar } from 'lucide-react';

interface AssetModalProps {
  play: RetentionPlay | null;
  account: Account;
  isOpen: boolean;
  onClose: () => void;
  onAddToPlaybook?: (play: RetentionPlay) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'default') => void;
}

export const AssetModal: React.FC<AssetModalProps> = ({
  play,
  account,
  isOpen,
  onClose,
  onAddToPlaybook,
  onShowToast
}) => {
  const [selectedTone, setSelectedTone] = useState<'consultative' | 'urgent' | 'executive' | 'collaborative'>('consultative');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Reset state on open
    setSelectedTone('consultative');
    setCopied(false);
  }, [play]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !play) return null;

  // Determine active body text based on tone selection
  let rawBody = play.asset.body;
  if (play.asset.toneOptions && play.asset.toneOptions.length > 0) {
    const toneMatch = play.asset.toneOptions.find(t => t.toneKey === selectedTone);
    if (toneMatch) {
      rawBody = toneMatch.body;
    }
  }

  // Highlight merge fields in teal pills
  const renderHighlightedBody = (text: string) => {
    // Split by merge field syntax {{field_name}}
    const parts = text.split(/(\{\{[a-zA-Z0-9_]+\}\})/g);

    return parts.map((part, index) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        return (
          <span
            key={index}
            className="inline-block px-1.5 py-0.5 mx-0.5 bg-[#2DD4BF] text-[#0B0F17] rounded text-xs font-mono font-bold select-all tracking-tight align-baseline shadow-sm"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleCopy = async () => {
    const resolvedText = interpolateTemplate(rawBody, account);
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(resolvedText);
      }
      setCopied(true);
      onShowToast('Asset Copied to Clipboard', `Interpolated template for ${account.name}`, 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getAssetTypeIcon = () => {
    switch (play.asset.type) {
      case 'email':
        return <Mail className="w-4 h-4 text-[#2DD4BF]" />;
      case 'sequence':
        return <Layers className="w-4 h-4 text-[#2DD4BF]" />;
      case 'agenda':
        return <Calendar className="w-4 h-4 text-[#2DD4BF]" />;
      case 'deck':
        return <FileText className="w-4 h-4 text-[#2DD4BF]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div
        className="w-full max-w-2xl bg-[#141A24] border border-[#232B38] rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#232B38] flex justify-between items-center bg-[#122131]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#0D1C2D] border border-[#232B38]">
              {getAssetTypeIcon()}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#d4e4fa]">
                Preview: {play.asset.typeLabel || play.title}
              </h2>
              <div className="text-[11px] text-[#bacac5]">
                Targeting <span className="text-[#57f1db] font-semibold">{account.name}</span> · Generated via Retain OS Rules Engine
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#bacac5] hover:text-[#d4e4fa] hover:bg-[#232B38] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Metadata Block (From / To / Subject) */}
          <div className="space-y-2 bg-[#0D1C2D] p-3.5 rounded-lg border border-[#232B38]">
            {play.asset.from && (
              <div className="flex gap-4">
                <span className="w-14 text-[11px] font-mono text-[#859490]">From</span>
                <span className="text-[#d4e4fa] font-mono">{play.asset.from}</span>
              </div>
            )}
            <div className="flex gap-4">
              <span className="w-14 text-[11px] font-mono text-[#859490]">To</span>
              <span className="text-[#d4e4fa] font-mono">
                {play.asset.to ? (
                  renderHighlightedBody(play.asset.to)
                ) : (
                  renderHighlightedBody(`{{new_exec_name}} <${account.contacts[0]?.email || 'sponsor@account.com'}>`)
                )}
              </span>
            </div>
            {play.asset.subject && (
              <div className="flex gap-4">
                <span className="w-14 text-[11px] font-mono text-[#859490]">Subject</span>
                <span className="text-[#d4e4fa] font-medium">
                  {renderHighlightedBody(play.asset.subject)}
                </span>
              </div>
            )}
          </div>

          {/* Merge Field Legend */}
          <div className="flex items-center justify-between text-[11px] text-[#859490] px-1">
            <span>Dynamic merge tags highlighted in teal. Values auto-populate on dispatch.</span>
            <span className="font-mono text-[#2DD4BF]">Template Mode</span>
          </div>

          {/* Asset Body / Content */}
          <div className="bg-[#0B0F17] p-4 rounded-lg border border-[#232B38] text-[#d4e4fa] font-sans leading-relaxed whitespace-pre-wrap select-text">
            {renderHighlightedBody(rawBody)}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#232B38] flex justify-between items-center bg-[#0D1C2D] rounded-b-xl">
          {/* Tone Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#bacac5]">Tone:</span>
            <div className="relative">
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value as any)}
                className="appearance-none bg-[#141A24] border border-[#232B38] rounded-lg px-3 py-1.5 pr-7 text-xs text-[#d4e4fa] font-medium outline-none hover:border-[#2DD4BF] focus:ring-1 focus:ring-[#2DD4BF] cursor-pointer"
              >
                <option value="consultative">Consultative</option>
                <option value="executive">Executive</option>
                <option value="urgent">Urgent</option>
                <option value="collaborative">Collaborative</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#859490] absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#bacac5] hover:text-[#2DD4BF] hover:bg-[#141A24] rounded-lg transition-colors border border-[#232B38] flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#34D399]" />
                  <span className="text-[#34D399]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Body</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                if (onAddToPlaybook) onAddToPlaybook(play);
                onClose();
                onShowToast('Play Confirmed', `${play.title} ready for deployment`, 'success');
              }}
              className="px-4 py-1.5 bg-[#2DD4BF] text-[#0B0F17] rounded-lg text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Confirm in Playbook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
