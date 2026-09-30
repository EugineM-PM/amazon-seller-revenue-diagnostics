export type TimePeriod = 'weekly' | 'monthly' | '90days';

export type Currency = 'AED' | 'USD' | 'INR' | 'EUR';

export type AlertLevel = 'red' | 'amber' | 'green';

export type ImpactLevel = 'high' | 'medium' | 'low';

export interface DriverBreakdown {
  name: string;
  weight: number; // 20%
  score: number; // 0-100 (e.g. 11/20)
  prevScore?: number; // e.g. 13/20
  deltaPts: number; // e.g. -2 pts (prev 13 -> now 11 = -2 pts)
  status: AlertLevel;
  primaryConcern?: boolean;
  insight: string;
}

export interface SellerHealthData {
  overallScore: number; // 0-100
  previousScore: number;
  scoreDelta: number; // e.g. -8
  totalRevenue: number;
  revenueDeltaPercent: number; // e.g. -12%
  revenueAtRisk: number; // e.g. AED 14.8K
  issuesCount: number;
  primaryConcern: string;
  drivers: {
    inventory: DriverBreakdown;
    conversion: DriverBreakdown;
    buyBox: DriverBreakdown;
    pricing: DriverBreakdown;
    searchVisibility: DriverBreakdown;
  };
}

export interface SearchTermItem {
  id: string;
  term: string;
  currentRank: number;
  prevRank: number;
  change: number; // +3, -5
  searchVolume: number;
  productViews: number;
  orders: number;
  alert: AlertLevel;
  lostGainedRevenue: number;
  isOpportunity?: boolean; // high-volume keyword where product has low visibility
}

export interface ProductItem {
  id: string;
  asin: string;
  sku: string;
  name: string;
  category: string;
  image: string;
  currentPrice: number;
  lowestCompetitorPrice: number;
  avgCompetitorPrice: number;
  competitorPriceDailyChangePct: number; // e.g. -8.3%
  revenue: number;
  revenueChangePct: number; // e.g. -18%
  revenueAtRisk: number;
  orders: number;
  unitsSold: number;
  returnsCount: number;
  returnRate: number; // e.g. 1.8%
  
  // Buy Box
  buyBoxPct: number; // e.g. 59%
  prevBuyBoxPct: number; // e.g. 82%
  buyBoxPPChange: number; // e.g. -23 PP
  buyBoxRank: number; // 1, 2, 3
  buyBoxAlert: AlertLevel;
  reviewsCount: number;
  rating: number; // e.g. 4.6
  shippingSlaOnTimePct: number; // 99.2%
  lateShipmentRate: number; // 0.4%
  duplicateListingsDetected: number;
  fakeHijackedListingAlert: boolean;

  // Conversion Funnel
  searchCtrPct: number; // e.g. 4.2%
  productViews: number; // e.g. 18,400
  addToCarts: number; // e.g. 2,120
  purchases: number; // e.g. 1,730
  currentConversionPct: number; // 9.4%
  historicalConversionPct: number; // 11.2%
  conversionAlert: AlertLevel;
  conversionLostGainedRev: number;

  // Inventory
  currentStockUnits: number;
  dailySellThroughRate: number; // e.g. 12 units/day
  daysOfCover: number; // DOC <=30 Red, 30-60 Amber, >60 Green
  inventoryAlert: AlertLevel;
  stockoutRiskText: string;
  inventoryLostGainedRev: number;

  // Search Visibility
  overallSearchRank: number;
  prevSearchRank: number;
  searchVisibilityAlert: AlertLevel;
  searchLostGainedRev: number;
  searchTerms: SearchTermItem[];

  // Historical data points for charts (7 days or weekly intervals)
  historicalTrends: {
    period: string;
    revenue: number;
    buyBoxPct: number;
    conversionPct: number;
    searchRank: number;
    competitorPrice: number;
    myPrice: number;
    stock: number;
  }[];

  // Root cause drilldown explanation
  diagnosisSummary: {
    primaryDriver: string;
    whyChain: {
      step: string;
      metric: string;
      change: string;
      status: AlertLevel;
    }[];
    verdict: string;
    actionItems: {
      id: string;
      title: string;
      actionText: string;
      urgency: 'critical' | 'moderate' | 'routine';
      type: 'reprice' | 'restock' | 'hijacker_report' | 'ppc_boost';
    }[];
  };

  // Double click impact details for Sales Performance
  impactDetails: {
    searchVisibility: { pctChange: number; impact: ImpactLevel };
    productViews: { pctChange: number; impact: ImpactLevel };
    buyBox: { ppChange: number; impact: ImpactLevel };
    conversion: { pctChange: number; impact: ImpactLevel };
    inventoryHealth: { pctChange: number; impact: ImpactLevel };
    lostGainedRevenue: number;
  };
}

export interface CategorySummary {
  id: string;
  name: string;
  productCount: number;
  totalGmv: number;
  gmvGrowthPct: number;
  avgBuyBoxPct: number;
  stockoutRiskCount: number;
}

export interface TrendAlert {
  id: string;
  productId: string;
  productName: string;
  category: string;
  sku: string;
  type: 'spike' | 'drop';
  severity: 'critical' | 'warning' | 'positive';
  metric: 'sales_volume' | 'velocity' | 'revenue' | 'conversion' | 'buy_box';
  headline: string;
  changePct: number; // e.g. -46.2 or +85.4
  currentVolume: number; // units or currency
  expectedVolume: number; // baseline benchmark
  timeframe: string; // e.g. 'Last 24h vs 7d avg'
  detectedAt: string; // e.g. '12 mins ago'
  rootCause: string;
  recommendedAction: {
    title: string;
    actionType: 'reprice' | 'restock' | 'ad_adjust' | 'investigate';
  };
  unread?: boolean;
}

export type SupportedLanguage = 
  | 'English'
  | 'Telugu (తెలుగు)'
  | 'Tamil (தமிழ்)'
  | 'Hindi (हिंदी)'
  | 'Malayalam (മലയാളം)'
  | 'French (Français)'
  | 'Spanish (Español)'
  | 'Arabic (العربية)';
