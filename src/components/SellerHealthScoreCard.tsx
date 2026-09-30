import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ArrowDownRight, 
  ArrowUpRight, 
  Info, 
  ChevronRight, 
  ShieldAlert, 
  CheckCircle2, 
  Activity, 
  TrendingDown, 
  Layers
} from 'lucide-react';
import { Currency, DriverBreakdown, SellerHealthData, TimePeriod } from '../types/seller';
import { formatCurrency, formatPercent, formatPoints } from '../utils/formatters';

interface SellerHealthScoreCardProps {
  healthData: SellerHealthData;
  timePeriod: TimePeriod;
  currency: Currency;
  onOpenRootCauseModal: () => void;
  onNavigateToModule: (moduleName: string) => void;
}

export const SellerHealthScoreCard: React.FC<SellerHealthScoreCardProps> = ({
  healthData,
  timePeriod,
  currency,
  onOpenRootCauseModal,
  onNavigateToModule,
}) => {
  const [hoveredDriver, setHoveredDriver] = useState<string | null>(null);

  const {
    overallScore,
    scoreDelta,
    totalRevenue,
    revenueDeltaPercent,
    revenueAtRisk,
    issuesCount,
    primaryConcern,
    drivers,
  } = healthData;

  const driverList: { key: string; data: DriverBreakdown; targetModule: string }[] = [
    { key: 'buyBox', data: drivers.buyBox, targetModule: 'buybox' },
    { key: 'searchVisibility', data: drivers.searchVisibility, targetModule: 'search' },
    { key: 'inventory', data: drivers.inventory, targetModule: 'inventory' },
    { key: 'conversion', data: drivers.conversion, targetModule: 'conversion' },
    { key: 'pricing', data: drivers.pricing, targetModule: 'pricing' },
  ];

  // Radial progress calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  const isScoreDropping = scoreDelta < 0;
  const timeLabel = timePeriod === 'weekly' ? 'this week' : timePeriod === 'monthly' ? 'this month' : 'last 90 days';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 relative overflow-hidden transition-all">
      {/* Top Banner with Diagnosis CTA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 mb-5 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Seller Revenue Health
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Weighted Index (5 Pillars × 20%)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Synthesized from Amazon Seller Central performance and competitive Buy Box & Search algorithms
          </p>
        </div>

        {/* Drill-down breadcrumb trigger */}
        <button
          onClick={onOpenRootCauseModal}
          className="group flex items-center gap-2.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 cursor-pointer self-start lg:self-auto"
        >
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-900">
            <span>Seller</span>
            <ChevronRight className="w-3 h-3" />
            <span>Category</span>
            <ChevronRight className="w-3 h-3" />
            <span>Product</span>
            <ChevronRight className="w-3 h-3" />
            <span>Search Term</span>
          </div>
          <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded text-[11px] font-bold group-hover:scale-105 transition-transform">
            Diagnose Why
          </span>
        </button>
      </div>

      {/* Main Grid: Score Gauge + High Level Financials + Drivers Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left: 0-100 Gauge */}
        <div className="md:col-span-3 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Background SVG circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="stroke-slate-200 dark:stroke-slate-700"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={`transition-all duration-1000 ease-out ${
                  overallScore >= 80 
                    ? 'text-emerald-500' 
                    : overallScore >= 70 
                    ? 'text-amber-500' 
                    : 'text-rose-500'
                }`}
              />
            </svg>

            {/* Score inside dial */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {overallScore}
              </span>
              <span className="text-xs font-semibold text-slate-400">/ 100 pts</span>
              
              <div className={`flex items-center gap-1 text-[11px] font-bold mt-0.5 ${
                isScoreDropping ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                {isScoreDropping ? (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                )}
                <span>{healthData.previousScore} → {overallScore} ({scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} pts)</span>
              </div>
            </div>
          </div>

          <div className="mt-2 text-center">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Status: {overallScore >= 80 ? 'Healthy' : overallScore >= 70 ? 'Action Needed' : 'Critical'}
            </span>
          </div>
        </div>

        {/* Center: Financials & At Risk stats */}
        <div className="md:col-span-4 flex flex-col justify-between space-y-4">
          
          {/* Revenue */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Total Marketplace Revenue</span>
              <span className="text-[11px] font-medium text-slate-400">vs prev period</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(totalRevenue, currency)}
              </span>
              <span className={`text-xs font-bold flex items-center ${
                revenueDeltaPercent < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                {revenueDeltaPercent < 0 ? <ArrowDownRight className="w-3 h-3 mr-0.5" /> : <ArrowUpRight className="w-3 h-3 mr-0.5" />}
                {formatPercent(revenueDeltaPercent)}
              </span>
            </div>
          </div>

          {/* Revenue at Risk */}
          <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40">
            <div className="flex items-center justify-between text-xs text-rose-800 dark:text-rose-300 mb-1">
              <span className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                Revenue at Risk
              </span>
              <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/50 px-1.5 py-0.5 rounded">
                {issuesCount} issues need attention
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
                {formatCurrency(revenueAtRisk, currency)}
              </span>
              <span className="text-xs text-rose-700 dark:text-rose-300 font-medium">
                Primary: <strong className="underline">{primaryConcern}</strong>
              </span>
            </div>
          </div>

        </div>

        {/* Right: Driver Waterfall (Mouse over to inspect positive & negative drivers) */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              What's Driving The Change?
            </span>
            <span className="text-[11px] text-slate-400">Hover pillar to inspect</span>
          </div>

          <div className="space-y-2">
            {driverList.map(({ key, data, targetModule }) => {
              const isNegative = data.deltaPts < 0;
              const isHovered = hoveredDriver === key;

              return (
                <div
                  key={key}
                  onMouseEnter={() => setHoveredDriver(key)}
                  onMouseLeave={() => setHoveredDriver(null)}
                  onClick={() => onNavigateToModule(targetModule)}
                  className={`group p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isHovered
                      ? 'bg-slate-100 dark:bg-slate-800 border-amber-500/50 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/70 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {isNegative ? '🔴' : '🟢'}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {data.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        (20% wt)
                      </span>
                      {data.primaryConcern && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-rose-500 text-white">
                          Primary Loss
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {data.prevScore !== undefined && (
                        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-400">
                          {data.prevScore} → <strong className="text-slate-700 dark:text-slate-200">{data.score}</strong>
                        </span>
                      )}
                      <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                        isNegative 
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {formatPoints(data.deltaPts)}
                      </span>
                      <span className="text-xs text-slate-400 group-hover:text-amber-500 transition-colors">
                        →
                      </span>
                    </div>
                  </div>

                  {/* Interactive detail when hovered or active concern */}
                  {(isHovered || data.primaryConcern) && (
                    <p className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                      {data.insight}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
