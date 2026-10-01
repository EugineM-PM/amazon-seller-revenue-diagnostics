import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Globe2, 
  RotateCcw, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Package, 
  TrendingUp, 
  Sparkles 
} from 'lucide-react';
import { Currency, ProductItem, SellerHealthData, SupportedLanguage, TimePeriod } from '../types/seller';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { Live3DAvatar } from './Live3DAvatar';

interface AiAdvisorCharacterProps {
  isEnabled: boolean;
  onToggle: () => void;
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  sellerHealth: SellerHealthData;
  activeProduct: ProductItem;
  currency: Currency;
  timePeriod: TimePeriod;
  onExecuteAction: (title: string, type: string) => void;
}

export type NarrationTopic = 'overview' | 'buybox' | 'inventory' | 'actions' | 'trend_alerts';

export const AiAdvisorCharacter: React.FC<AiAdvisorCharacterProps> = ({
  isEnabled,
  onToggle,
  language,
  onSelectLanguage,
  sellerHealth,
  activeProduct,
  currency,
  timePeriod,
  onExecuteAction,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeTopic, setActiveTopic] = useState<NarrationTopic>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<string>('');
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);

  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

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

  // Map language to BCP 47 voice code
  const getLanguageLocale = (lang: SupportedLanguage): string => {
    if (lang.includes('Telugu')) return 'te-IN';
    if (lang.includes('Tamil')) return 'ta-IN';
    if (lang.includes('Hindi')) return 'hi-IN';
    if (lang.includes('Malayalam')) return 'ml-IN';
    if (lang.includes('French')) return 'fr-FR';
    if (lang.includes('Spanish')) return 'es-ES';
    if (lang.includes('Arabic')) return 'ar-AE';
    return 'en-US';
  };

  // Concise prompt generator based on topic
  const getTopicPrompt = (topic: NarrationTopic): string => {
    switch (topic) {
      case 'overview':
        return `Explain the overall health score (${sellerHealth.overallScore}/100, dropping by ${Math.abs(sellerHealth.scoreDelta)} pts) and revenue (${formatCurrency(sellerHealth.totalRevenue, currency)}) in 3 quick sentences.`;
      case 'buybox':
        return `Explain why ${activeProduct.name} lost Buy Box (fell from ${activeProduct.prevBuyBoxPct}% to ${activeProduct.buyBoxPct}% due to competitor price ${formatCurrency(activeProduct.lowestCompetitorPrice, currency)}) in 3 quick sentences.`;
      case 'inventory':
        return `Explain inventory stock levels and days of cover (${activeProduct.daysOfCover} DOC) in 3 quick sentences.`;
      case 'trend_alerts':
        return `Explain the critical sales drop on Sony WH-1000XM5 (-46.2% units) vs the surge on Anker 737 (+84.6% units) and what the seller should proactively do in 3 quick sentences.`;
      case 'actions':
        return `Give the 3 fastest actions to recover revenue at risk (${formatCurrency(sellerHealth.revenueAtRisk, currency)}) today on Amazon Seller Central.`;
    }
  };

  // Fetch explanation from server
  const fetchAdvice = async (topic: NarrationTopic = activeTopic, autoSpeak: boolean = true) => {
    setIsLoading(true);
    stopSpeaking();

    try {
      const sellerContext = {
        healthScore: sellerHealth.overallScore,
        scoreChange: `${sellerHealth.scoreDelta > 0 ? '+' : ''}${sellerHealth.scoreDelta} pts`,
        revenue: formatCurrency(sellerHealth.totalRevenue, currency),
        revenueChange: formatPercent(sellerHealth.revenueDeltaPercent),
        revenueAtRisk: formatCurrency(sellerHealth.revenueAtRisk, currency),
        primaryIssue: sellerHealth.primaryConcern,
        buyBoxChange: `${sellerHealth.drivers.buyBox.deltaPts} pts`,
        searchChange: `${sellerHealth.drivers.searchVisibility.deltaPts} pts`,
        inventoryChange: `+${sellerHealth.drivers.inventory.deltaPts} pts`,
        convChange: `+${sellerHealth.drivers.conversion.deltaPts} pts`,
        priceChange: `+${sellerHealth.drivers.pricing.deltaPts} pt`,
      };

      const productContext = {
        name: activeProduct.name,
        revenue: formatCurrency(activeProduct.revenue, currency),
        revenueChange: formatPercent(activeProduct.revenueChangePct),
        buyBoxStatus: `${activeProduct.prevBuyBoxPct}% → ${activeProduct.buyBoxPct}% (${activeProduct.buyBoxPPChange} PP)`,
        competitorPrice: `Competitor undercut to ${formatCurrency(activeProduct.lowestCompetitorPrice, currency)} (vs ${formatCurrency(activeProduct.currentPrice, currency)})`,
        searchVisibility: `Rank #${activeProduct.overallSearchRank} (${activeProduct.searchTerms[0]?.term})`,
        conversionRate: `${activeProduct.currentConversionPct}% (${activeProduct.purchases} orders from ${activeProduct.productViews} views)`,
        inventoryStatus: `${activeProduct.daysOfCover} Days of Cover (${activeProduct.currentStockUnits} units in stock)`,
        diagnosis: activeProduct.diagnosisSummary.verdict,
      };

      const response = await fetch('/api/advisor/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          sellerContext,
          productContext,
          question: getTopicPrompt(topic),
        }),
      });

      const data = await response.json();
      if (data.explanation) {
        setExplanation(data.explanation);
        if (autoSpeak) {
          // Play speech with freshly loaded text
          speakCleanText(data.explanation);
        }
      }
    } catch (err) {
      console.error('Failed to load AI advice:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Switch narration topic and speak
  const handleSelectTopic = (topic: NarrationTopic) => {
    setActiveTopic(topic);
    fetchAdvice(topic, true);
  };

  // Reload advice whenever language, active product, or time period changes
  useEffect(() => {
    if (isEnabled) {
      fetchAdvice(activeTopic, false);
    }
    return () => {
      stopSpeaking();
    };
  }, [isEnabled, language, activeProduct.id, timePeriod]);

  // Voice narration helper using Web Speech Synthesis API
  const speakCleanText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown characters for crisp audio
    const cleanText = text
      .replace(/[*#_~`]/g, '')
      .replace(/•/g, ', ')
      .replace(/AED/g, 'AED ')
      .replace(/↓/g, 'down ')
      .replace(/↑/g, 'up ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = getLanguageLocale(language);
    utterance.rate = 1.05; // Quick and concise tempo
    utterance.pitch = 1.08; // Friendly Pillsbury dough tone

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) => v.lang.startsWith(utterance.lang.slice(0, 2)));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else if (explanation) {
      speakCleanText(explanation);
    } else {
      fetchAdvice(activeTopic, true);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  if (!isEnabled) {
    return (
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={onToggle}
          className="flex items-center gap-2.5 pl-2.5 pr-4 py-2 rounded-full bg-slate-900 text-white font-bold text-xs shadow-2xl border border-amber-500/40 hover:border-amber-400 hover:scale-105 transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border-2 border-amber-400 flex items-center justify-center">
            <Live3DAvatar isSpeaking={false} size={48} className="scale-75" />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="font-extrabold text-white flex items-center gap-1">
              Live Advisor Seller Genie
              <span className="text-[10px] text-amber-400">🧞</span>
            </span>
            <span className="text-[10px] text-amber-300 font-medium">Click to open 3D voice analysis</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <aside 
      aria-label="Live Advisor Seller Genie" 
      className={`fixed bottom-5 right-5 z-40 max-w-sm sm:max-w-md w-[calc(100vw-2.5rem)] shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-300 ${
        !isExpanded ? 'max-w-[320px] sm:max-w-[340px]' : ''
      }`}
    >
      
      {/* 3D Character Stage & Header */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-3.5 sm:p-4 text-white border-b border-slate-800">
        
        {/* Top Control Bar (Always visible, click header to toggle collapse) */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2.5">
          <div 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 cursor-pointer group select-none"
            title="Click to collapse or expand AI Advisor"
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-emerald-400'}`} />
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-wide text-white group-hover:text-amber-400 transition-colors">
                LIVE ADVISOR
              </span>
              <span className="text-[10px] text-amber-400 font-extrabold bg-amber-950/80 border border-amber-800 px-1.5 py-0.5 rounded shadow-xs">
                Seller Genie 🧞
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Quick voice mute / play */}
            <button
              onClick={toggleSpeak}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isSpeaking
                  ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={isSpeaking ? 'Pause Speaking' : `Speak in ${language}`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Collapse / Expand Toggle Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
              title={isExpanded ? 'Collapse window' : 'Expand window'}
            >
              {isExpanded ? (
                <>
                  <ChevronDown className="w-4 h-4" />
                </>
              ) : (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-[10px] font-bold text-amber-400">Expand</span>
                </>
              )}
            </button>

            {/* Turn off */}
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Live Advisor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsed Compact Preview Bar */}
        {!isExpanded ? (
          <div 
            onClick={() => setIsExpanded(true)}
            className="flex items-center justify-between gap-3 pt-1 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-500/40 overflow-hidden flex items-center justify-center p-0.5 shrink-0">
                <Live3DAvatar
                  isSpeaking={isSpeaking}
                  size={40}
                  className="scale-90"
                />
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Score: {sellerHealth.overallScore}/100</span>
                  <span className="text-[10px] text-rose-400">({sellerHealth.scoreDelta > 0 ? `+${sellerHealth.scoreDelta}` : sellerHealth.scoreDelta} pts)</span>
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[170px]">
                  {isSpeaking ? '🎙️ Speaking live...' : `Click to expand · ${language.split(' ')[0]}`}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSpeak();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                isSpeaking 
                  ? 'bg-rose-600 text-white' 
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {isSpeaking ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isSpeaking ? 'Pause' : 'Listen'}</span>
            </button>
          </div>
        ) : (
          /* Full 3D Character Hero Box when expanded */
          <div className="flex items-center gap-4">
            {/* Live Interactive 3D Canvas */}
            <div className="relative shrink-0 flex items-center justify-center bg-slate-900/90 rounded-2xl border border-slate-700/80 shadow-inner p-1 group">
              <Live3DAvatar
                isSpeaking={isSpeaking}
                onClick={toggleSpeak}
                size={135}
                className="rounded-xl overflow-hidden"
              />
              {isSpeaking && (
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-emerald-500/90 text-slate-950 text-[9px] font-extrabold flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                  SPEAKING
                </div>
              )}
              <div className="absolute bottom-1 inset-x-0 text-center">
                <span className="text-[9px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded-full">
                  Click to speak
                </span>
              </div>
            </div>

            {/* Quick Stats at a glance */}
            <div className="flex-1 flex flex-col justify-between py-1 space-y-2">
              <div>
                <div className="text-xs text-slate-400 font-medium">Health Score Breakdown</div>
                <div className="text-xl font-black text-white flex items-center gap-2">
                  <span>{sellerHealth.overallScore}/100</span>
                  <span className="text-xs font-bold text-rose-400">
                    {sellerHealth.scoreDelta > 0 ? `+${sellerHealth.scoreDelta}` : sellerHealth.scoreDelta} pts
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-300 line-clamp-2 leading-snug">
                Primary Concern: <strong className="text-amber-300">{sellerHealth.primaryConcern}</strong>
              </div>

              {/* Quick Action Audio Trigger */}
              <button
                onClick={toggleSpeak}
                className={`w-full py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                  isSpeaking
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause Live Speech</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Hear Live Explanation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Expanded Content: 1-Click Narration Topics + Concise Report Card */}
      {isExpanded && (
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          
          {/* Language Selector */}
          <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5 text-amber-500" />
              Voice Language:
            </span>
            <select
              value={language}
              onChange={(e) => onSelectLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent text-xs font-bold text-amber-600 dark:text-amber-400 focus:outline-none cursor-pointer text-right"
            >
              {languages.map((l) => (
                <option key={l} value={l} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium">
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Quick-Listen Topic Buttons (1-click to explain specific report areas) */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Select What You Want The Baker To Explain:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'overview', label: '📊 Health & Revenue', icon: TrendingUp },
                { id: 'trend_alerts', label: '🚨 Trend Alerts', icon: AlertTriangle },
                { id: 'buybox', label: '🛡️ Buy Box Loss', icon: ShieldCheck },
                { id: 'inventory', label: '📦 Stock & DOC', icon: Package },
                { id: 'actions', label: '⚡ Top Actions', icon: Sparkles },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleSelectTopic(id as NarrationTopic)}
                  className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border text-left ${
                    activeTopic === id
                      ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Spoken Narration Transcript & Summary */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed">
            {isLoading ? (
              <div className="flex items-center gap-2.5 py-3 text-slate-500">
                <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                <span>Preparing concise spoken report in {language}...</span>
              </div>
            ) : (
              <div className="space-y-2 whitespace-pre-line text-slate-800 dark:text-slate-200 font-normal">
                {explanation}
              </div>
            )}
          </div>

          {/* Quick Action Button */}
          <div className="pt-1 flex items-center justify-between">
            <button
              onClick={() => onExecuteAction(`Apply Automated Fix for ${activeProduct.name}`, 'reprice')}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Apply Recommended Reclaim Rule</span>
              <span>→</span>
            </button>
          </div>

        </div>
      )}
    </aside>
  );
};

