import React, { useState } from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Check, 
  SlidersHorizontal, 
  Layers, 
  ChevronRight, 
  Bell, 
  Filter, 
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Currency, ProductItem, TrendAlert } from '../types/seller';
import { formatCurrency } from '../utils/formatters';

interface TrendAlertsProps {
  alerts: TrendAlert[];
  products: ProductItem[];
  currency: Currency;
  onSelectProduct: (productId: string) => void;
  onExecuteAction: (title: string, type: string) => void;
}

export const TrendAlerts: React.FC<TrendAlertsProps> = ({
  alerts: initialAlerts,
  products,
  currency,
  onSelectProduct,
  onExecuteAction,
}) => {
  const [alerts, setAlerts] = useState<TrendAlert[]>(initialAlerts);
  const [filterType, setFilterType] = useState<'all' | 'drop' | 'spike'>('all');
  const [thresholdPct, setThresholdPct] = useState<number>(25); // Sensitivity threshold
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);

  // Filter alerts by sensitivity threshold and tab filter
  const visibleAlerts = alerts
    .filter((a) => !dismissedAlertIds.includes(a.id))
    .filter((a) => Math.abs(a.changePct) >= thresholdPct)
    .filter((a) => {
      if (filterType === 'all') return true;
      return a.type === filterType;
    });

  const spikeCount = alerts.filter((a) => a.type === 'spike' && !dismissedAlertIds.includes(a.id)).length;
  const dropCount = alerts.filter((a) => a.type === 'drop' && !dismissedAlertIds.includes(a.id)).length;
  const unreadCount = alerts.filter((a) => a.unread && !dismissedAlertIds.includes(a.id)).length;

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, unread: false })));
  };

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedAlertIds((prev) => [...prev, id]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Bell className="w-5 h-5 animate-bounce-short" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Trend Alerts & Volume Anomalies
              </h3>
              {unreadCount > 0 && (
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                  {unreadCount} NEW
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Proactive anomaly detection flagging abnormal drops and unexpected sales spikes in real time
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline cursor-pointer px-2 py-1"
            >
              Mark all as read
            </button>
          )}

          {/* Anomaly sensitivity threshold picker */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Sensitivity:</span>
            <select
              value={thresholdPct}
              onChange={(e) => setThresholdPct(Number(e.target.value))}
              aria-label="Anomaly sensitivity threshold"
              className="bg-transparent font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value={15} className="dark:bg-slate-900">±15% (High)</option>
              <option value={25} className="dark:bg-slate-900">±25% (Standard)</option>
              <option value={40} className="dark:bg-slate-900">±40% (Extreme)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Summary Counter */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Alerts ({visibleAlerts.length})
          </button>
          <button
            onClick={() => setFilterType('drop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              filterType === 'drop'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Sales Drops ({dropCount})</span>
          </button>
          <button
            onClick={() => setFilterType('spike')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              filterType === 'spike'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Spikes & Surges ({spikeCount})</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-medium">
          Threshold filter: <span className="font-bold text-slate-700 dark:text-slate-300">|Δ| ≥ {thresholdPct}%</span>
        </span>
      </div>

      {/* Alerts Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {visibleAlerts.length === 0 ? (
          <div className="col-span-2 py-8 text-center bg-slate-50 dark:bg-slate-850 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <Check className="w-8 h-8 mx-auto text-emerald-500 mb-1" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No Volume Anomalies Detected</p>
            <p className="text-xs text-slate-400">All SKU sales velocities are trending within normal standard deviations.</p>
          </div>
        ) : (
          visibleAlerts.map((alert) => {
            const isDrop = alert.type === 'drop';
            const matchedProduct = products.find((p) => p.id === alert.productId);

            return (
              <div
                key={alert.id}
                onClick={() => onSelectProduct(alert.productId)}
                className={`group relative p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                  isDrop
                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 hover:border-rose-300'
                    : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-300'
                }`}
              >
                {/* Top Row: Tag, Time, Dismiss */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        isDrop
                          ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
                          : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                      }`}
                    >
                      {isDrop ? (
                        <>
                          <TrendingDown className="w-3.5 h-3.5" />
                          <span>ANOMALOUS DROP</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>SALES SURGE</span>
                        </>
                      )}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {alert.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      {alert.detectedAt}
                    </span>
                    <button
                      onClick={(e) => handleDismiss(alert.id, e)}
                      title="Dismiss alert"
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 rounded cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Main Headline & Change */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {alert.headline}
                    </h4>
                    <span className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {alert.productName}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-base font-black flex items-center justify-end ${
                        isDrop ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {isDrop ? (
                        <ArrowDownRight className="w-4 h-4 mr-0.5" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 mr-0.5" />
                      )}
                      {alert.changePct > 0 ? `+${alert.changePct}%` : `${alert.changePct}%`}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {alert.currentVolume} units vs {alert.expectedVolume} expected
                    </span>
                  </div>
                </div>

                {/* Metric Context Pill */}
                <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 mb-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Time window:</span>
                    <span className="font-semibold">{alert.timeframe}</span>
                  </div>
                  <div className="text-[11px] leading-relaxed">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Cause: </span>
                    {alert.rootCause}
                  </div>
                </div>

                {/* Action button bar */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-800">
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" />
                    Proactive Action:
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onExecuteAction(alert.recommendedAction.title, alert.recommendedAction.actionType);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                      isDrop
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <span>{alert.recommendedAction.title}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
