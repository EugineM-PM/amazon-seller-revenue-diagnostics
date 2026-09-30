import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Search, 
  ShieldCheck, 
  Percent, 
  Package, 
  DollarSign, 
  X, 
  MousePointerClick,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { Currency, ProductItem, TimePeriod } from '../types/seller';
import { formatCurrency, formatPercent, formatPP, getImpactBadge } from '../utils/formatters';

interface SalesPerformanceModuleProps {
  products: ProductItem[];
  selectedCategory: string;
  currency: Currency;
  timePeriod: TimePeriod;
  onSelectProduct: (id: string) => void;
}

export const SalesPerformanceModule: React.FC<SalesPerformanceModuleProps> = ({
  products,
  selectedCategory,
  currency,
  timePeriod,
  onSelectProduct,
}) => {
  const [activeDrilldownProduct, setActiveDrilldownProduct] = useState<ProductItem | null>(null);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const totalGMV = filteredProducts.reduce((acc, p) => acc + p.revenue, 0);
  const totalOrders = filteredProducts.reduce((acc, p) => acc + p.orders, 0);
  const totalUnits = filteredProducts.reduce((acc, p) => acc + p.unitsSold, 0);
  const totalReturns = filteredProducts.reduce((acc, p) => acc + p.returnsCount, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Sales Performance & North Star GMV
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
              North Star: GMV per product by category
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            💡 Double-click any product row to inspect driver impacts (Search Visibility, Views, Buy Box, Conversion, Inventory)
          </p>
        </div>

        {/* Period badge */}
        <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
          Filtered by: {timePeriod === 'weekly' ? 'Weekly' : timePeriod === 'monthly' ? 'Monthly' : 'Last 90 Days'}
        </span>
      </div>

      {/* High-level rollups */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
          <span className="text-xs text-slate-500">Total Filtered GMV</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalGMV, currency)}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
          <span className="text-xs text-slate-500">Total Orders</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalOrders}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
          <span className="text-xs text-slate-500">Units Sold</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalUnits}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
          <span className="text-xs text-slate-500">Returns Count</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalReturns} <span className="text-xs font-normal text-slate-400">({((totalReturns / (totalUnits || 1)) * 100).toFixed(1)}%)</span>
          </div>
        </div>
      </div>

      {/* Product List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="pb-3 pl-2">Product</th>
              <th className="pb-3 text-right">Orders</th>
              <th className="pb-3 text-right">Units Sold</th>
              <th className="pb-3 text-right">Returns</th>
              <th className="pb-3 text-right">GMV (Revenue)</th>
              <th className="pb-3 text-center">Sales % Change</th>
              <th className="pb-3 text-right pr-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredProducts.map((p) => {
              const isNegative = p.revenueChangePct < 0;

              return (
                <tr
                  key={p.id}
                  onDoubleClick={() => setActiveDrilldownProduct(p)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  title="Double-click to inspect Search, Views, Buy Box, Conversion & Inventory impacts"
                >
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-1 max-w-[260px]">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {p.sku} · {p.asin}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 text-right font-medium text-slate-800 dark:text-slate-200">
                    {p.orders}
                  </td>

                  <td className="py-3 text-right font-medium text-slate-800 dark:text-slate-200">
                    {p.unitsSold}
                  </td>

                  <td className="py-3 text-right font-medium text-slate-500">
                    {p.returnsCount} ({p.returnRate}%)
                  </td>

                  <td className="py-3 text-right font-bold text-slate-900 dark:text-white">
                    {formatCurrency(p.revenue, currency)}
                  </td>

                  <td className="py-3 text-center">
                    <span className={`inline-flex items-center font-bold px-2 py-0.5 rounded text-xs ${
                      isNegative
                        ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400'
                        : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400'
                    }`}>
                      {isNegative ? (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      )}
                      {formatPercent(p.revenueChangePct)}
                    </span>
                  </td>

                  <td className="py-3 text-right pr-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDrilldownProduct(p);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Inspect Drivers 🔍
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Double Click Deep-Dive Modal (Explicit Requirement in Prompt) */}
      {activeDrilldownProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveDrilldownProduct(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={activeDrilldownProduct.image}
                  alt={activeDrilldownProduct.name}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {activeDrilldownProduct.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Sales Change: <strong className={activeDrilldownProduct.revenueChangePct < 0 ? 'text-rose-600' : 'text-emerald-600'}>
                      {formatPercent(activeDrilldownProduct.revenueChangePct)}
                    </strong> · {formatCurrency(activeDrilldownProduct.revenue, currency)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveDrilldownProduct(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Detailed Multi-Factor Driver Impacts
              </h5>
              <p className="text-xs text-slate-500">
                Quantitative contribution of each underlying engine to this SKU's sales change:
              </p>
            </div>

            {/* The 5 Required Dimensions */}
            <div className="space-y-2.5">
              
              {/* 1. Search Visibility */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Search Visibility
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Rank #{activeDrilldownProduct.overallSearchRank} in primary category
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {formatPercent(activeDrilldownProduct.impactDetails.searchVisibility.pctChange)}
                  </div>
                  <div className={`text-[10px] uppercase tracking-wider ${
                    getImpactBadge(activeDrilldownProduct.impactDetails.searchVisibility.impact).color
                  }`}>
                    {getImpactBadge(activeDrilldownProduct.impactDetails.searchVisibility.impact).text}
                  </div>
                </div>
              </div>

              {/* 2. Product Views */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-indigo-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Product Views (Sessions)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {activeDrilldownProduct.productViews.toLocaleString()} total buyer visits
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {formatPercent(activeDrilldownProduct.impactDetails.productViews.pctChange)}
                  </div>
                  <div className={`text-[10px] uppercase tracking-wider ${
                    getImpactBadge(activeDrilldownProduct.impactDetails.productViews.impact).color
                  }`}>
                    {getImpactBadge(activeDrilldownProduct.impactDetails.productViews.impact).text}
                  </div>
                </div>
              </div>

              {/* 3. Buy Box */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Buy Box Share
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {activeDrilldownProduct.buyBoxPct}% current win rate
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-xs font-bold ${
                    activeDrilldownProduct.impactDetails.buyBox.ppChange < 0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {formatPP(activeDrilldownProduct.impactDetails.buyBox.ppChange)}
                  </div>
                  <div className={`text-[10px] uppercase tracking-wider ${
                    getImpactBadge(activeDrilldownProduct.impactDetails.buyBox.impact).color
                  }`}>
                    {getImpactBadge(activeDrilldownProduct.impactDetails.buyBox.impact).text}
                  </div>
                </div>
              </div>

              {/* 4. Conversion */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Percent className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Conversion Rate
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {activeDrilldownProduct.currentConversionPct}% purchase rate
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {formatPercent(activeDrilldownProduct.impactDetails.conversion.pctChange)}
                  </div>
                  <div className={`text-[10px] uppercase tracking-wider ${
                    getImpactBadge(activeDrilldownProduct.impactDetails.conversion.impact).color
                  }`}>
                    {getImpactBadge(activeDrilldownProduct.impactDetails.conversion.impact).text}
                  </div>
                </div>
              </div>

              {/* 5. Inventory Health */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-purple-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Inventory Health (DOC)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {activeDrilldownProduct.daysOfCover} Days of Cover remaining
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {formatPercent(activeDrilldownProduct.impactDetails.inventoryHealth.pctChange)}
                  </div>
                  <div className={`text-[10px] uppercase tracking-wider ${
                    getImpactBadge(activeDrilldownProduct.impactDetails.inventoryHealth.impact).color
                  }`}>
                    {getImpactBadge(activeDrilldownProduct.impactDetails.inventoryHealth.impact).text}
                  </div>
                </div>
              </div>

            </div>

            {/* Net Lost or Gained Revenue */}
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Net Lost or Gained Revenue:
              </span>
              <span className={`text-base font-black ${
                activeDrilldownProduct.impactDetails.lostGainedRevenue < 0
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                {formatCurrency(activeDrilldownProduct.impactDetails.lostGainedRevenue, currency)}
              </span>
            </div>

            <button
              onClick={() => setActiveDrilldownProduct(null)}
              className="w-full py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold transition-opacity hover:opacity-90 cursor-pointer"
            >
              Done Inspecting
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
