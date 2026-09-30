import { AlertLevel, Currency, ImpactLevel } from '../types/seller';

// Currency conversion multipliers relative to AED (AED is base 1.0)
const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string; prefix: string }> = {
  AED: { rate: 1.0, symbol: 'AED', prefix: 'AED ' },
  USD: { rate: 0.272, symbol: '$', prefix: '$' },
  INR: { rate: 22.8, symbol: '₹', prefix: '₹' },
  EUR: { rate: 0.251, symbol: '€', prefix: '€' },
};

export function formatCurrency(amountAed: number, currency: Currency = 'AED', compact: boolean = false): string {
  const cfg = CURRENCY_RATES[currency] || CURRENCY_RATES.AED;
  const converted = amountAed * cfg.rate;

  if (compact) {
    if (Math.abs(converted) >= 1_000_000) {
      return `${cfg.prefix}${(converted / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(converted) >= 1_000) {
      return `${cfg.prefix}${(converted / 1_000).toFixed(1)}K`;
    }
  }

  return `${cfg.prefix}${converted.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatPercent(value: number, includeSign: boolean = true): string {
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function formatPoints(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value} pts`;
}

export function formatPP(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value} PP`;
}

export function getDaysOfCoverAlert(doc: number): AlertLevel {
  // Critical rule from prompt:
  // "If DOC is <= 30 days then mark it red. 30 - 60 is amber & DOC > 60 is green."
  if (doc <= 30) return 'red';
  if (doc <= 60) return 'amber';
  return 'green';
}

export function getAlertBadgeStyles(alert: AlertLevel): {
  bg: string;
  text: string;
  border: string;
  dot: string;
  label: string;
} {
  switch (alert) {
    case 'red':
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-200 dark:border-rose-900/50',
        dot: 'bg-rose-500',
        label: 'Critical Alert',
      };
    case 'amber':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-900/50',
        dot: 'bg-amber-500',
        label: 'Warning Alert',
      };
    case 'green':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-900/50',
        dot: 'bg-emerald-500',
        label: 'Healthy',
      };
  }
}

export function getImpactBadge(impact: ImpactLevel): { text: string; color: string } {
  switch (impact) {
    case 'high':
      return { text: 'High Impact', color: 'text-rose-600 dark:text-rose-400 font-semibold' };
    case 'medium':
      return { text: 'Medium Impact', color: 'text-amber-600 dark:text-amber-400 font-medium' };
    case 'low':
      return { text: 'Low Impact', color: 'text-slate-500 dark:text-slate-400' };
  }
}
