import React from 'react';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Truck, 
  TrendingDown,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Currency, ProductItem, TimePeriod } from '../types/seller';
import { formatCurrency, getAlertBadgeStyles, getDaysOfCoverAlert } from '../utils/formatters';

interface InventoryStockModuleProps {
  products: ProductItem[];
  selectedCategory: string;
  currency: Currency;
  timePeriod: TimePeriod;
  onExecuteAction: (title: string, type: string) => void;
}

export const InventoryStockModule: React.FC<InventoryStockModuleProps> = ({
  products,
  selectedCategory,
  currency,
  timePeriod,
  onExecuteAction,
}) => {
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Inventory Stock Levels & Days of Cover (DOC)
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              FBA Stock Forecasting
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Strict Alert Policy: DOC &le; 30 days (🔴 Red Stockout Risk) · 30–60 days (🟡 Amber) · &gt; 60 days (🟢 Green Healthy)
          </p>
        </div>

        {/* Legend pills */}
        <div className="flex items-center gap-2 text-[11px] font-medium">
          <span className="flex items-center gap-1 text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            &le;30d: Red (High Risk)
          </span>
          <span className="flex items-center gap-1 text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            30–60d: Amber
          </span>
          <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            &gt;60d: Green
          </span>
        </div>
      </div>

      {/* Product Inventory Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="pb-3 pl-2">Product & SKU</th>
              <th className="pb-3 text-right">Current Stock</th>
              <th className="pb-3 text-right">Sell-Through Rate</th>
              <th className="pb-3 text-center">Days of Cover (DOC)</th>
              <th className="pb-3 text-center">Stockout Risk Alert</th>
              <th className="pb-3 text-right">Lost / Gained Revenue</th>
              <th className="pb-3 text-right pr-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredProducts.map((p) => {
              // Apply strict rule: DOC <= 30 is red, 30-60 is amber, > 60 is green
              const dynamicAlert = getDaysOfCoverAlert(p.daysOfCover);
              const alertStyle = getAlertBadgeStyles(dynamicAlert);

              return (
                <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Product info */}
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[240px]">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {p.sku} · {p.category.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Current Stock */}
                  <td className="py-3 text-right font-bold text-slate-900 dark:text-white">
                    {p.currentStockUnits.toLocaleString()} units
                  </td>

                  {/* Daily Sell-Through Rate */}
                  <td className="py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                    {p.dailySellThroughRate.toFixed(1)} units/day
                  </td>

                  {/* Days of Cover with visual indicator */}
                  <td className="py-3 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className={`text-sm font-black ${
                        dynamicAlert === 'red' 
                          ? 'text-rose-600 dark:text-rose-400' 
                          : dynamicAlert === 'amber' 
                          ? 'text-amber-600 dark:text-amber-400' 
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {p.daysOfCover} Days
                      </span>
                      <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            dynamicAlert === 'red' ? 'bg-rose-500' : dynamicAlert === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, (p.daysOfCover / 90) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Stock Out Risk Alert */}
                  <td className="py-3 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${alertStyle.bg} ${alertStyle.text} ${alertStyle.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${alertStyle.dot}`} />
                      {dynamicAlert === 'red' ? 'Critical (≤30 Days)' : dynamicAlert === 'amber' ? 'Caution (30-60 Days)' : 'Optimal (>60 Days)'}
                    </span>
                  </td>

                  {/* Lost or Gained Revenue */}
                  <td className={`py-3 text-right font-bold ${
                    p.inventoryLostGainedRev < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'
                  }`}>
                    {p.inventoryLostGainedRev < 0
                      ? formatCurrency(p.inventoryLostGainedRev, currency)
                      : 'AED 0'}
                  </td>

                  {/* Action button */}
                  <td className="py-3 text-right pr-2">
                    <button
                      onClick={() => onExecuteAction(`Created FBA Inbound Shipment for ${p.name}`, 'restock')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        dynamicAlert === 'red'
                          ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {dynamicAlert === 'red' ? 'Urgent Restock' : 'Plan Inbound'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
