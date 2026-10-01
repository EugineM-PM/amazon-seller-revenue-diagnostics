import React from 'react';
import { 
  BarChart3, 
  Sparkles, 
  Globe2, 
  Layers, 
  Calendar, 
  Volume2, 
  VolumeX, 
  HelpCircle,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { CategorySummary, Currency, ProductItem, SupportedLanguage, TimePeriod } from '../types/seller';
import doughboyAvatar from '../assets/images/doughboy_avatar_1790775312390.jpg';

interface HeaderProps {
  categories: CategorySummary[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  products: ProductItem[];
  selectedProductId: string;
  onSelectProduct: (id: string) => void;
  timePeriod: TimePeriod;
  onSelectTimePeriod: (period: TimePeriod) => void;
  currency: Currency;
  onSelectCurrency: (curr: Currency) => void;
  isAiAdvisorEnabled: boolean;
  onToggleAiAdvisor: () => void;
  aiLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onOpenRootCauseModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  products,
  selectedProductId,
  onSelectProduct,
  timePeriod,
  onSelectTimePeriod,
  currency,
  onSelectCurrency,
  isAiAdvisorEnabled,
  onToggleAiAdvisor,
  aiLanguage,
  onSelectLanguage,
  onOpenRootCauseModal,
}) => {
  const languages: SupportedLanguage[] = [
    'English',
    'Telugu (తెలుగు)',
    'Tamil (தமிழ்)',
    'Hindi (हिंदी)',
    'Malayalam (മലയാളം)',
    'French (Français)',
    'Spanish (Español)',
    'Arabic (العربية)',
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-slate-100 border-b border-slate-800 shadow-md">
      {/* Top tier brand & controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Seller Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">AuraSeller</span>
                <span className="text-[11px] font-medium text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                  Amazon 3P Intelligence
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-300 font-medium">UAE Marketplace (Amazon.ae)</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                What Happened · Why It Happened · What Needs Attention
              </p>
            </div>
          </div>

          {/* Quick Actions & AI Advisor Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Quick 1-Click Root Cause Button */}
            <button
              onClick={onOpenRootCauseModal}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-500/50 transition-all cursor-pointer shadow-sm"
              title="Inspect Why Revenue Dropped for Flagship Products"
            >
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span>Root Cause Diagnosis</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </button>

            {/* Aha Feature AI Advisor Switch with Doughboy Avatar */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700/80">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img
                    src={doughboyAvatar}
                    alt="Aura Doughboy AI"
                    className="w-7 h-7 rounded-full object-cover border border-amber-400/80 shadow-xs"
                  />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-slate-900 ${
                    isAiAdvisorEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                  }`} />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xs font-bold text-slate-100 flex items-center gap-1">
                    Live Advisor
                    <span className="text-[9px] font-normal text-amber-400 px-1 py-0.2 bg-amber-950/70 rounded">Seller Genie</span>
                  </span>
                  <span className="text-[10px] text-slate-400">3D Voice Diagnostics</span>
                </div>
              </div>
              
              {/* On/Off Switch */}
              <button
                role="switch"
                aria-checked={isAiAdvisorEnabled}
                onClick={onToggleAiAdvisor}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isAiAdvisorEnabled ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isAiAdvisorEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>

              {/* Language Selector for the AI Character */}
              {isAiAdvisorEnabled && (
                <div className="flex items-center gap-1.5 border-l border-slate-700 pl-2">
                  <Globe2 className="w-3.5 h-3.5 text-amber-400" />
                  <select
                    value={aiLanguage}
                    onChange={(e) => onSelectLanguage(e.target.value as SupportedLanguage)}
                    className="bg-transparent text-xs text-amber-300 font-medium focus:outline-none cursor-pointer pr-1"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang} className="bg-slate-900 text-slate-200">
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Currency selector */}
            <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/80">
              {(['AED', 'USD', 'INR', 'EUR'] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => onSelectCurrency(curr)}
                  className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                    currency === curr
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Bottom tier: Global Filters (All products, Category, Product, Time period) */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Time Period Filter */}
            <div className="flex items-center gap-1.5 bg-slate-800 rounded-lg p-1 border border-slate-700/80">
              <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              {(['weekly', 'monthly', '90days'] as TimePeriod[]).map((period) => {
                const label = period === 'weekly' ? 'Weekly' : period === 'monthly' ? 'Monthly' : 'Last 90 Days';
                return (
                  <button
                    key={period}
                    onClick={() => onSelectTimePeriod(period)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                      timePeriod === period
                        ? 'bg-slate-700 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 rounded-lg px-2.5 py-1 border border-slate-700/80">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value)}
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-900 text-slate-200">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Filter */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 rounded-lg px-2.5 py-1 border border-slate-700/80">
              <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Product:</span>
              <select
                value={selectedProductId}
                onChange={(e) => onSelectProduct(e.target.value)}
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer max-w-[200px] truncate"
              >
                <option value="all" className="bg-slate-900 text-slate-200">
                  All Products ({products.length} SKUs)
                </option>
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id} className="bg-slate-900 text-slate-200">
                    {prod.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* North Star indicator */}
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
              North Star:
            </span>
            <span className="text-xs font-semibold text-amber-300">
              GMV per product by category
            </span>
          </div>

        </div>

      </div>
    </header>
  );
};
