import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  ArrowDownRight, 
  ShieldAlert, 
  DollarSign, 
  Search, 
  Package, 
  Check, 
  ArrowRight,
  ExternalLink,
  Flame,
  Zap
} from 'lucide-react';
import { Currency, ProductItem } from '../types/seller';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface RootCauseDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  currency: Currency;
  initialProductId?: string;
  onExecuteAction: (actionTitle: string, actionType: string) => void;
}

export const RootCauseDiagnosisModal: React.FC<RootCauseDiagnosisModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  initialProductId = 'prod-sony-xm5',
  onExecuteAction,
}) => {
  const [selectedProdId, setSelectedProdId] = useState<string>(initialProductId);
  const [selectedSearchTerm, setSelectedSearchTerm] = useState<string>('noise cancelling headphones');

  if (!isOpen) return null;

  const currentProduct = products.find((p) => p.id === selectedProdId) || products[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Root Cause Diagnosis & Resolution Engine
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated causal decomposition: What happened → Why it happened → What needs attention
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Breadcrumb drill-down bar: Seller -> Category -> Product -> Search term */}
          <div className="p-3 bg-slate-100 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Drill-Down Path:</span>
            
            <span className="font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-1 rounded shadow-xs">
              Amazon.ae Seller Account
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

            <span className="font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-1 rounded shadow-xs">
              {currentProduct.category === 'electronics' ? 'Electronics & Audio' : currentProduct.category === 'kitchen' ? 'Home & Kitchen' : 'Health & Personal Care'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

            {/* Product dropdown selector */}
            <select
              value={currentProduct.id}
              onChange={(e) => setSelectedProdId(e.target.value)}
              className="font-bold text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded border border-amber-300 dark:border-amber-700/60 focus:outline-none cursor-pointer"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

            {/* Search term selector */}
            <select
              value={selectedSearchTerm}
              onChange={(e) => setSelectedSearchTerm(e.target.value)}
              className="font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 focus:outline-none cursor-pointer"
            >
              {currentProduct.searchTerms.map((st) => (
                <option key={st.id} value={st.term}>
                  {st.term} (Rank #{st.currentRank})
                </option>
              ))}
            </select>
          </div>

          {/* Product Snapshot Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {currentProduct.name}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    ASIN: {currentProduct.asin}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <span>Current Price: <strong>{formatCurrency(currentProduct.currentPrice, currency)}</strong></span>
                  <span>·</span>
                  <span>Orders: <strong>{currentProduct.orders}</strong></span>
                  <span>·</span>
                  <span>Return Rate: <strong>{currentProduct.returnRate}%</strong></span>
                </div>
              </div>
            </div>

            {/* Revenue change metric badge */}
            <div className="text-right sm:self-center">
              <div className="text-xs text-slate-500">Product Revenue</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {formatCurrency(currentProduct.revenue, currency)}
                </span>
                <span className={`text-xs font-bold ${
                  currentProduct.revenueChangePct < 0 ? 'text-rose-600' : 'text-emerald-600'
                }`}>
                  ({formatPercent(currentProduct.revenueChangePct)})
                </span>
              </div>
            </div>
          </div>

          {/* Step-by-Step "Why" Diagnostic Tree */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              The Causal Decomposition ("5 Whys" Chain)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Step 1: What happened */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">1. Revenue Drop</span>
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    {formatPercent(currentProduct.revenueChangePct)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Gross sales dropped from previous run-rate to {formatCurrency(currentProduct.revenue, currency)}.
                </p>
              </div>

              {/* Step 2: Why? Buy Box drop */}
              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-rose-900 dark:text-rose-300">2. Why? Buy Box Loss</span>
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    {currentProduct.prevBuyBoxPct}% → {currentProduct.buyBoxPct}%
                  </span>
                </div>
                <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                  Buy Box share plummeted by {Math.abs(currentProduct.buyBoxPPChange)} percentage points, dropping rank to #{currentProduct.buyBoxRank}.
                </p>
              </div>

              {/* Step 3: Why? Competitor price change */}
              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-rose-900 dark:text-rose-300">3. Why? Price Undercut</span>
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    {formatCurrency(currentProduct.lowestCompetitorPrice, currency)}
                  </span>
                </div>
                <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                  Lowest competitor reduced price by {formatCurrency(currentProduct.currentPrice - currentProduct.lowestCompetitorPrice, currency)} ({formatPercent(currentProduct.competitorPriceDailyChangePct)} shift).
                </p>
              </div>
            </div>
          </div>

          {/* Cross Checks Matrix */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Independent Factor Cross-Checks (Rule Out Other Causes)
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Search Visibility</div>
                  <div className="text-slate-500 text-[11px]">Rank #{currentProduct.overallSearchRank} · Stable indexing</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Page Conversion</div>
                  <div className="text-slate-500 text-[11px]">{currentProduct.currentConversionPct}% · Stable buyer intent</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Inventory Status</div>
                  <div className="text-slate-500 text-[11px]">{currentProduct.daysOfCover} Days of Cover · In Stock</div>
                </div>
              </div>
            </div>
          </div>

          {/* Definitive Diagnosis Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-amber-500/10 border-2 border-rose-500/40">
            <div className="flex items-start gap-3">
              <span className="text-xl">🔴</span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Definitive Algorithmic Diagnosis
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {currentProduct.diagnosisSummary.verdict}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Search traffic and customer conversion remain strong. Immediate revenue recovery is achievable by matching competitor pricing or deploying automated repricing rules.
                </p>
              </div>
            </div>
          </div>

          {/* Action Items List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Recommended Next Actions on Amazon Seller Central
            </h4>
            <div className="space-y-2">
              {currentProduct.diagnosisSummary.actionItems.map((action) => (
                <div
                  key={action.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-amber-400 dark:hover:border-amber-600 transition-all gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        action.urgency === 'critical'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 border border-rose-200'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-200'
                      }`}>
                        {action.urgency}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {action.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {action.actionText}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onExecuteAction(action.title, action.type);
                      onClose();
                    }}
                    className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer whitespace-nowrap"
                  >
                    Execute Action
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Diagnosis refresh rate: Real-time API sync
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
          >
            Close Diagnosis
          </button>
        </div>
      </div>
    </div>
  );
};
