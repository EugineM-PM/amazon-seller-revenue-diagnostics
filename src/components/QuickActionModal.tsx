import React from 'react';
import { CheckCircle2, X, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionTitle: string;
  actionType: string;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  actionTitle,
  actionType,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Action Dispatched Successfully
          </span>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            {actionTitle}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Rule command has been synchronized with the Amazon Seller Central SP-API (Selling Partner API). Changes typically propagate across catalog nodes within 15 minutes.
          </p>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-500">
            <span>Transmission ID:</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">SP-API-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Expected Buy Box Impact:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">+18% to +24% rotation recovery</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-all cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};
