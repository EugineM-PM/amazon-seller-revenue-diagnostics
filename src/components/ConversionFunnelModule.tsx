import React from 'react';
import { 
  Filter, 
  Eye, 
  ShoppingCart, 
  ShoppingBag, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  AlertCircle,
  HelpCircle,
  Layers
} from 'lucide-react';
import { Currency, ProductItem, TimePeriod } from '../types/seller';
import { formatCurrency, formatPercent, getAlertBadgeStyles } from '../utils/formatters';

interface ConversionFunnelModuleProps {
  products: ProductItem[];
  selectedProductId: string;
  currency: Currency;
  timePeriod: TimePeriod;
  onSelectProduct: (id: string) => void;
}

export const ConversionFunnelModule: React.FC<ConversionFunnelModuleProps> = ({
  products,
  selectedProductId,
  currency,
  timePeriod,
  onSelectProduct,
}) => {
  const activeProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Aggregated or active product stats
  const searchCtr = activeProduct.searchCtrPct;
  const views = activeProduct.productViews;
  const carts = activeProduct.addToCarts;
  const purchases = activeProduct.purchases;
  const currentConv = activeProduct.currentConversionPct;
  const histConv = activeProduct.historicalConversionPct;
  const convDelta = currentConv - histConv;
  const alertStyles = getAlertBadgeStyles(activeProduct.conversionAlert);

  // Conversion step rates
  const viewToCartRate = views > 0 ? (carts / views) * 100 : 0;
  const cartToPurchaseRate = carts > 0 ? (purchases / carts) * 100 : 0;
  const totalFunnelConversion = views > 0 ? (purchases / views) * 100 : 0;

  const funnelSteps = [
    {
      title: 'Search Listing Impressions',
      metric: `${Math.round(views / (searchCtr / 100)).toLocaleString()}`,
      sub: `CTR: ${searchCtr}%`,
      icon: Filter,
      color: 'bg-indigo-500',
    },
    {
      title: 'Product Detail Views',
      metric: views.toLocaleString(),
      sub: `${viewToCartRate.toFixed(1)}% proceed to cart`,
      icon: Eye,
      color: 'bg-blue-500',
    },
    {
      title: 'Added to Cart',
      metric: carts.toLocaleString(),
      sub: `${cartToPurchaseRate.toFixed(1)}% checkout completion`,
      icon: ShoppingCart,
      color: 'bg-amber-500',
    },
    {
      title: 'Purchases (Units)',
      metric: purchases.toLocaleString(),
      sub: `Current Conversion: ${currentConv}%`,
      icon: ShoppingBag,
      color: 'bg-emerald-500',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Conversion Funnel & Drop-Off
            </h3>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${alertStyles.bg} ${alertStyles.text} ${alertStyles.border}`}>
              {alertStyles.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            CTR on search listing page → Product views → Add to carts → Purchases (Current vs Historical)
          </p>
        </div>

        {/* Product selector for funnel */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Inspecting:</span>
          <select
            value={activeProduct.id}
            onChange={(e) => onSelectProduct(e.target.value)}
            className="text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Funnel Step Visualization */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {funnelSteps.map((step, index) => {
          const StepIcon = step.icon;
          return (
            <div
              key={step.title}
              className="relative p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Step 0{index + 1}
                </span>
                <div className={`w-7 h-7 rounded-lg ${step.color} text-white flex items-center justify-center shadow-xs`}>
                  <StepIcon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {step.title}
                </h4>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {step.metric}
                </div>
              </div>

              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                {step.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* KPI Cards: Current vs Historical Conversion & Financial Impact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Current Conversion Rate */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Current Product Conversion
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {currentConv}%
            </span>
            <span className={`text-xs font-bold flex items-center ${
              convDelta < 0 ? 'text-rose-600' : 'text-emerald-600'
            }`}>
              {convDelta < 0 ? <TrendingDown className="w-3 h-3 mr-0.5" /> : <TrendingUp className="w-3 h-3 mr-0.5" />}
              {convDelta > 0 ? `+${convDelta.toFixed(1)}%` : `${convDelta.toFixed(1)}%`}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Historical benchmark: {histConv}%
          </span>
        </div>

        {/* Search Listing CTR */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Search Listing Click-Through (CTR)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {searchCtr}%
            </span>
            <span className="text-xs font-bold text-emerald-600">
              Above avg (3.8% cat. median)
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Healthy main hero image & badge
          </span>
        </div>

        {/* Lost / Gained Revenue Impact */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Lost / Gained Revenue (Conversion Shift)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-black ${
              activeProduct.conversionLostGainedRev < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {formatCurrency(activeProduct.conversionLostGainedRev, currency)}
            </span>
            <span className="text-xs text-slate-500">
              {timePeriod === 'weekly' ? 'Weekly' : timePeriod === 'monthly' ? 'Monthly' : '90 Days'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {activeProduct.conversionLostGainedRev < 0
              ? 'Revenue leak from listing drop-off'
              : 'Conversion growth upside'}
          </span>
        </div>
      </div>
    </div>
  );
};
