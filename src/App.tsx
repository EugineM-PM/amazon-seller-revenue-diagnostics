import React, { useState } from 'react';
import { 
  CATEGORIES_DATA, 
  INITIAL_SELLER_HEALTH, 
  PRODUCTS_DATA,
  INITIAL_TREND_ALERTS
} from './data/mockData';
import { 
  Currency, 
  ProductItem, 
  SupportedLanguage, 
  TimePeriod,
  TrendAlert
} from './types/seller';
import { Header } from './components/Header';
import { SellerHealthScoreCard } from './components/SellerHealthScoreCard';
import { RootCauseDiagnosisModal } from './components/RootCauseDiagnosisModal';
import { ConversionFunnelModule } from './components/ConversionFunnelModule';
import { BuyBoxModule } from './components/BuyBoxModule';
import { CompetitivePricingModule } from './components/CompetitivePricingModule';
import { SearchVisibilityModule } from './components/SearchVisibilityModule';
import { InventoryStockModule } from './components/InventoryStockModule';
import { SalesPerformanceModule } from './components/SalesPerformanceModule';
import { TrendAlerts } from './components/TrendAlerts';
import { AiAdvisorCharacter } from './components/AiAdvisorCharacter';
import { QuickActionModal } from './components/QuickActionModal';
import { 
  Zap, 
  Layers, 
  ShieldCheck, 
  Tag, 
  Search, 
  Package, 
  TrendingUp,
  AlertCircle,
  Bell
} from 'lucide-react';

export default function App() {
  // Global dashboard state
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('weekly');
  const [currency, setCurrency] = useState<Currency>('AED');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-sony-xm5');
  const [activeTab, setActiveTab] = useState<string>('all');

  // Aha Feature AI Advisor state
  const [isAiAdvisorEnabled, setIsAiAdvisorEnabled] = useState<boolean>(true);
  const [aiLanguage, setAiLanguage] = useState<SupportedLanguage>('English');

  // Modals state
  const [isRootCauseModalOpen, setIsRootCauseModalOpen] = useState<boolean>(false);
  const [executedAction, setExecutedAction] = useState<{ title: string; type: string } | null>(null);

  // Active dataset
  const sellerHealth = INITIAL_SELLER_HEALTH[timePeriod];
  const products = PRODUCTS_DATA;
  const activeProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleExecuteAction = (title: string, type: string) => {
    setExecutedAction({ title, type });
  };

  const navTabs = [
    { id: 'all', label: 'All Modules' },
    { id: 'sales', label: 'Sales & North Star', icon: Layers },
    { id: 'alerts', label: 'Trend Alerts', icon: Bell },
    { id: 'buybox', label: 'Buy Box', icon: ShieldCheck },
    { id: 'conversion', label: 'Conversion Funnel', icon: TrendingUp },
    { id: 'pricing', label: 'Pricing & Undercuts', icon: Tag },
    { id: 'search', label: 'Search Visibility', icon: Search },
    { id: 'inventory', label: 'Inventory (DOC)', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-amber-500 selection:text-slate-950 pb-24">
      {/* Header */}
      <Header
        categories={CATEGORIES_DATA}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        products={products}
        selectedProductId={selectedProductId}
        onSelectProduct={setSelectedProductId}
        timePeriod={timePeriod}
        onSelectTimePeriod={setTimePeriod}
        currency={currency}
        onSelectCurrency={setCurrency}
        isAiAdvisorEnabled={isAiAdvisorEnabled}
        onToggleAiAdvisor={() => setIsAiAdvisorEnabled(!isAiAdvisorEnabled)}
        aiLanguage={aiLanguage}
        onSelectLanguage={setAiLanguage}
        onOpenRootCauseModal={() => setIsRootCauseModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Module Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. Seller Health Scorecard (Always visible on Overview) */}
        <section id="seller-health">
          <SellerHealthScoreCard
            healthData={sellerHealth}
            timePeriod={timePeriod}
            currency={currency}
            onOpenRootCauseModal={() => setIsRootCauseModalOpen(true)}
            onNavigateToModule={(mod) => setActiveTab(mod)}
          />
        </section>

        {/* Proactive Trend Alerts & Volume Anomalies (Highlighting drops and spikes) */}
        {(activeTab === 'all' || activeTab === 'alerts' || activeTab === 'sales') && (
          <section id="trend-alerts">
            <TrendAlerts
              alerts={INITIAL_TREND_ALERTS}
              products={products}
              currency={currency}
              onSelectProduct={setSelectedProductId}
              onExecuteAction={handleExecuteAction}
            />
          </section>
        )}

        {/* Module Sections filtered or all */}
        {(activeTab === 'all' || activeTab === 'sales') && (
          <section id="sales">
            <SalesPerformanceModule
              products={products}
              selectedCategory={selectedCategory}
              currency={currency}
              timePeriod={timePeriod}
              onSelectProduct={setSelectedProductId}
            />
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'buybox') && (
          <section id="buybox">
            <BuyBoxModule
              products={products}
              selectedProductId={selectedProductId}
              currency={currency}
              timePeriod={timePeriod}
              onSelectProduct={setSelectedProductId}
              onExecuteAction={handleExecuteAction}
            />
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'conversion') && (
          <section id="conversion">
            <ConversionFunnelModule
              products={products}
              selectedProductId={selectedProductId}
              currency={currency}
              timePeriod={timePeriod}
              onSelectProduct={setSelectedProductId}
            />
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'pricing') && (
          <section id="pricing">
            <CompetitivePricingModule
              products={products}
              selectedProductId={selectedProductId}
              currency={currency}
              timePeriod={timePeriod}
              onSelectProduct={setSelectedProductId}
              onExecuteAction={handleExecuteAction}
            />
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'search') && (
          <section id="search">
            <SearchVisibilityModule
              products={products}
              selectedProductId={selectedProductId}
              currency={currency}
              timePeriod={timePeriod}
              onSelectProduct={setSelectedProductId}
              onExecuteAction={handleExecuteAction}
            />
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'inventory') && (
          <section id="inventory">
            <InventoryStockModule
              products={products}
              selectedCategory={selectedCategory}
              currency={currency}
              timePeriod={timePeriod}
              onExecuteAction={handleExecuteAction}
            />
          </section>
        )}

      </main>

      {/* Root Cause Diagnosis Modal */}
      <RootCauseDiagnosisModal
        isOpen={isRootCauseModalOpen}
        onClose={() => setIsRootCauseModalOpen(false)}
        products={products}
        currency={currency}
        initialProductId={selectedProductId}
        onExecuteAction={handleExecuteAction}
      />

      {/* Action Execution Confirmation Modal */}
      {executedAction && (
        <QuickActionModal
          isOpen={Boolean(executedAction)}
          onClose={() => setExecutedAction(null)}
          actionTitle={executedAction.title}
          actionType={executedAction.type}
        />
      )}

      {/* Aha Feature: Multilingual AI Seller Advisor */}
      <AiAdvisorCharacter
        isEnabled={isAiAdvisorEnabled}
        onToggle={() => setIsAiAdvisorEnabled(!isAiAdvisorEnabled)}
        language={aiLanguage}
        onSelectLanguage={setAiLanguage}
        sellerHealth={sellerHealth}
        activeProduct={activeProduct}
        currency={currency}
        timePeriod={timePeriod}
        onExecuteAction={handleExecuteAction}
      />
    </div>
  );
}
