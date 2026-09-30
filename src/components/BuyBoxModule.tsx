import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  Star, 
  Copy, 
  RotateCcw, 
  TrendingDown, 
  TrendingUp, 
  DollarSign,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Currency, ProductItem, TimePeriod } from '../types/seller';
import { formatCurrency, formatPercent, formatPP, getAlertBadgeStyles } from '../utils/formatters';

interface BuyBoxModuleProps {
  products: ProductItem[];
  selectedProductId: string;
  currency: Currency;
  timePeriod: TimePeriod;
  onSelectProduct: (id: string) => void;
  onExecuteAction: (title: string, type: string) => void;
}

export const BuyBoxModule: React.FC<BuyBoxModuleProps> = ({
  products,
  selectedProductId,
  currency,
  timePeriod,
  onSelectProduct,
  onExecuteAction,
}) => {
  const activeProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const alertStyles = getAlertBadgeStyles(activeProduct.buyBoxAlert);

  // SVG chart calculation for historical trend
  const trendData = activeProduct.historicalTrends;
  const maxPct = 100;
  const minPct = 40;
  const chartHeight = 120;
  const chartWidth = 460;
  const points = trendData.map((d, index) => {
    const x = (index / (trendData.length - 1)) * chartWidth;
    const y = chartHeight - ((d.buyBoxPct - minPct) / (maxPct - minPct)) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Buy Box Win Rate & Health Drivers
            </h3>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${alertStyles.bg} ${alertStyles.text} ${alertStyles.border}`}>
              {alertStyles.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Algorithmic Buy Box ownership governed by reviews, shipping SLA, pricing, returns & listing integrity
          </p>
        </div>

        {/* Product selector */}
        <select
          value={activeProduct.id}
          onChange={(e) => onSelectProduct(e.target.value)}
          className="text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer self-start sm:self-auto"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main KPI Row: Current Buy Box %, Product Level Rank, Lost Revenue */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Buy Box % */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Current Buy Box %
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {activeProduct.buyBoxPct}%
            </span>
            <span className={`text-xs font-bold ${
              activeProduct.buyBoxPPChange < 0 ? 'text-rose-600' : 'text-emerald-600'
            }`}>
              {formatPP(activeProduct.buyBoxPPChange)}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Previous period: {activeProduct.prevBuyBoxPct}%
          </span>
        </div>

        {/* Product Buy Box Rank */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Product Buy Box Rank
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              #{activeProduct.buyBoxRank}
            </span>
            <span className="text-xs text-slate-500">
              in Featured Offers
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {activeProduct.buyBoxRank === 1 ? 'Dominant Offer (Winning)' : 'Trailing Competitor by Price'}
          </span>
        </div>

        {/* Lost/Gained Revenue from Buy Box shift */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Lost / Gained Revenue (Buy Box)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-3xl font-black ${
              activeProduct.revenueAtRisk > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {activeProduct.revenueAtRisk > 0 ? `-${formatCurrency(activeProduct.revenueAtRisk, currency)}` : '+AED 0'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {timePeriod === 'weekly' ? 'This week' : timePeriod === 'monthly' ? 'This month' : 'Last 90 days'}
          </span>
        </div>

        {/* Quick Action Trigger */}
        <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
              Immediate Buy Box Fix
            </span>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 leading-snug">
              {activeProduct.buyBoxPct < 70
                ? 'Match competitor price to reclaim up to 85% of rotations.'
                : 'Current Buy Box is well defended. Monitor stock levels.'}
            </p>
          </div>
          <button
            onClick={() => onExecuteAction(`Reclaim Buy Box for ${activeProduct.name}`, 'reprice')}
            className="mt-2 w-full py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Apply Repricing Rule
          </button>
        </div>
      </div>

      {/* Historical Buy Box Trend Chart */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Historical Buy Box % Trend (7-Day Velocity)
          </span>
          <span className="text-xs text-slate-400">
            Min: 59% · Max: 83%
          </span>
        </div>

        <div className="h-28 w-full overflow-hidden flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {/* Guide grid lines */}
            <line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
            <line x1="0" y1={chartHeight * 0.5} x2={chartWidth} y2={chartHeight * 0.5} stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
            <line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
            
            {/* Area polygon */}
            <polygon
              points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`}
              className={activeProduct.buyBoxPct < 70 ? 'fill-rose-500/10' : 'fill-emerald-500/10'}
            />

            {/* Main line */}
            <polyline
              fill="none"
              stroke={activeProduct.buyBoxPct < 70 ? '#f43f5e' : '#10b981'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />

            {/* Data points */}
            {trendData.map((d, index) => {
              const x = (index / (trendData.length - 1)) * chartWidth;
              const y = chartHeight - ((d.buyBoxPct - minPct) / (maxPct - minPct)) * chartHeight;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3.5"
                  className={activeProduct.buyBoxPct < 70 ? 'fill-rose-600 stroke-white' : 'fill-emerald-600 stroke-white'}
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>

        <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
          {trendData.map((d) => (
            <span key={d.period}>{d.period}: {d.buyBoxPct}%</span>
          ))}
        </div>
      </div>

      {/* 5 Determinant Factors Cards (Required by Prompt) */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Underlying Buy Box Algorithmic Factors
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          
          {/* Factor 1: Reviews & Ratings */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold">Reviews & Ratings</span>
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {activeProduct.rating} ★
            </div>
            <div className="text-[11px] text-slate-500">
              {activeProduct.reviewsCount.toLocaleString()} total reviews
            </div>
          </div>

          {/* Factor 2: Shipping SLA Adherence */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold">Shipping SLA</span>
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {activeProduct.shippingSlaOnTimePct}% On-Time
            </div>
            <div className="text-[11px] text-slate-500">
              Late shipment: {activeProduct.lateShipmentRate}% (SLA &lt;4%)
            </div>
          </div>

          {/* Factor 3: Duplicate Listing Detection */}
          <div className={`p-3.5 rounded-xl border space-y-1 ${
            activeProduct.duplicateListingsDetected > 0
              ? 'border-amber-300 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40'
          }`}>
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold">Duplicate Listings</span>
              <Copy className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {activeProduct.duplicateListingsDetected} Detected
            </div>
            <div className="text-[11px] text-slate-500">
              {activeProduct.duplicateListingsDetected > 0 ? 'Splitting traffic' : 'None detected'}
            </div>
          </div>

          {/* Factor 4: Fake / Hijacked Listing Alert */}
          <div className={`p-3.5 rounded-xl border space-y-1 ${
            activeProduct.fakeHijackedListingAlert
              ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40'
          }`}>
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold">Listing Hijack Alert</span>
              <ShieldAlert className={`w-3.5 h-3.5 ${activeProduct.fakeHijackedListingAlert ? 'text-rose-500' : 'text-emerald-500'}`} />
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {activeProduct.fakeHijackedListingAlert ? 'Active Hijack' : 'Protected'}
            </div>
            <div className="text-[11px] text-slate-500">
              {activeProduct.fakeHijackedListingAlert ? 'Action: Brand Registry' : 'Brand Registry verified'}
            </div>
          </div>

          {/* Factor 5: Number of Returns & Return Rate */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold">Return Rate</span>
              <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {activeProduct.returnRate}% ({activeProduct.returnsCount})
            </div>
            <div className="text-[11px] text-slate-500">
              Category threshold &lt;3.5%
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
