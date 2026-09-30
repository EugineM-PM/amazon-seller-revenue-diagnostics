import React, { useState } from 'react';
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  Sparkles, 
  TrendingUp, 
  Eye, 
  ShoppingBag,
  ExternalLink,
  Zap,
  Target
} from 'lucide-react';
import { Currency, ProductItem, SearchTermItem, TimePeriod } from '../types/seller';
import { formatCurrency, getAlertBadgeStyles } from '../utils/formatters';

interface SearchVisibilityModuleProps {
  products: ProductItem[];
  selectedProductId: string;
  currency: Currency;
  timePeriod: TimePeriod;
  onSelectProduct: (id: string) => void;
  onExecuteAction: (title: string, type: string) => void;
}

export const SearchVisibilityModule: React.FC<SearchVisibilityModuleProps> = ({
  products,
  selectedProductId,
  currency,
  timePeriod,
  onSelectProduct,
  onExecuteAction,
}) => {
  const activeProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const [showKeywordOpportunityModal, setShowKeywordOpportunityModal] = useState<boolean>(false);

  const opportunityKeywords = activeProduct.searchTerms.filter((st) => st.isOpportunity);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Search Visibility & Keyword Rankings
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Organic & Sponsored Indexing
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            By product & search terms: Current rank, previous rank, change, attributed views, orders & revenue
          </p>
        </div>

        {/* Product Selector */}
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

      {/* Suggestion Card on Top Searched Keywords (Explicit prompt requirement) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 dark:border-amber-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Suggestion on Top Searched Keywords:
              </h4>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                High-Volume & Low Visibility Opportunity
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Your product has low visibility on high-volume keyword: <strong>"{opportunityKeywords[0]?.term || 'anc bluetooth headset for travel'}"</strong> (Search volume: ~{opportunityKeywords[0]?.searchVolume.toLocaleString() || '28,000'} monthly searches, Current Rank: #{opportunityKeywords[0]?.currentRank || '18'}).
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowKeywordOpportunityModal(true)}
          className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-colors cursor-pointer whitespace-nowrap self-start md:self-auto"
        >
          View Opportunity Keywords →
        </button>
      </div>

      {/* Keywords Breakdown Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="pb-3 pl-2">Search Term</th>
              <th className="pb-3 text-center">Current Rank</th>
              <th className="pb-3 text-center">Prev Rank</th>
              <th className="pb-3 text-center">Change</th>
              <th className="pb-3 text-right">Product Views</th>
              <th className="pb-3 text-right">Orders</th>
              <th className="pb-3 text-center">Alert Status</th>
              <th className="pb-3 text-right pr-2">Revenue Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {activeProduct.searchTerms.map((st) => {
              const alertStyle = getAlertBadgeStyles(st.alert);
              const rankDelta = st.prevRank - st.currentRank; // positive if improved

              return (
                <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 pl-2 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <span>{st.term}</span>
                    {st.isOpportunity && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                        High Opportunity
                      </span>
                    )}
                  </td>
                  
                  <td className="py-3 text-center font-bold text-slate-800 dark:text-slate-200">
                    #{st.currentRank}
                  </td>

                  <td className="py-3 text-center text-slate-500">
                    #{st.prevRank}
                  </td>

                  <td className="py-3 text-center">
                    {rankDelta > 0 ? (
                      <span className="inline-flex items-center text-emerald-600 font-bold">
                        <ArrowUpRight className="w-3 h-3 mr-0.5" />+{rankDelta}
                      </span>
                    ) : rankDelta < 0 ? (
                      <span className="inline-flex items-center text-rose-600 font-bold">
                        <ArrowDownRight className="w-3 h-3 mr-0.5" />{rankDelta}
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-slate-400">
                        <Minus className="w-3 h-3 mr-0.5" /> 0
                      </span>
                    )}
                  </td>

                  <td className="py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                    {st.productViews.toLocaleString()}
                  </td>

                  <td className="py-3 text-right font-bold text-slate-900 dark:text-white">
                    {st.orders}
                  </td>

                  <td className="py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${alertStyle.bg} ${alertStyle.text} ${alertStyle.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${alertStyle.dot}`} />
                      {alertStyle.label}
                    </span>
                  </td>

                  <td className={`py-3 text-right pr-2 font-bold ${
                    st.lostGainedRevenue < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {st.lostGainedRevenue !== 0 ? formatCurrency(st.lostGainedRevenue, currency) : 'AED 0'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Opportunity Modal / Drawer */}
      {showKeywordOpportunityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-500" />
                Keyword Expansion Opportunities
              </h4>
              <button
                onClick={() => setShowKeywordOpportunityModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              These high-volume keywords generate huge customer search queries on Amazon.ae where your product is currently indexed beyond page 1:
            </p>

            <div className="space-y-2.5">
              {opportunityKeywords.map((kw) => (
                <div key={kw.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{kw.term}</span>
                    <span className="text-[11px] font-bold text-amber-600">Rank #{kw.currentRank}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Est. Search Volume: ~{kw.searchVolume.toLocaleString()}/mo</span>
                    <span>Revenue Opportunity: ~{formatCurrency(Math.abs(kw.lostGainedRevenue) * 3, currency)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  onExecuteAction(`Launched Amazon Sponsored Products exact match campaign for ${opportunityKeywords[0]?.term}`, 'ppc_boost');
                  setShowKeywordOpportunityModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Launch Exact Match PPC Ad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
