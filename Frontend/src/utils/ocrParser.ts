import { CATEGORY_KEYWORDS } from '../constants/categories';
import { ExpenseCategory } from '../types/models';

/**
 * Looks for the most likely "total" amount on a receipt. Receipts print many
 * numbers (subtotal, tax, line items) — we bias toward lines containing a
 * total-like keyword, and fall back to the largest currency-shaped number
 * found anywhere in the text.
 */
export function parseAmountFromReceipt(text: string): number | null {
  const lines = text.split('\n');
  const totalKeywords = /\b(total|amount due|grand total|balance due|amount)\b/i;
  const currencyNumber = /(?:[$€£₹]\s?)?(\d{1,3}(?:[,.\s]\d{3})*(?:[.,]\d{2})?)/g;

  let bestFromKeywordLine: number | null = null;
  for (const line of lines) {
    if (totalKeywords.test(line)) {
      const matches = [...line.matchAll(currencyNumber)];
      if (matches.length) {
        const last = matches[matches.length - 1][1];
        const value = normalizeNumber(last);
        if (value !== null) {
          bestFromKeywordLine = value;
        }
      }
    }
  }
  if (bestFromKeywordLine !== null) return bestFromKeywordLine;

  // Fallback: largest plausible currency amount in the whole receipt.
  const allMatches = [...text.matchAll(currencyNumber)]
    .map(m => normalizeNumber(m[1]))
    .filter((n): n is number => n !== null && n > 0 && n < 100000);

  if (!allMatches.length) return null;
  return Math.max(...allMatches);
}

function normalizeNumber(raw: string): number | null {
  // Strip thousands separators, keep last dot/comma as decimal point.
  const cleaned = raw.replace(/\s/g, '');
  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');
  let normalized = cleaned;
  if (lastComma > lastDot) {
    normalized = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    normalized = cleaned.replace(/,/g, '');
  }
  const value = parseFloat(normalized);
  return Number.isFinite(value) ? value : null;
}

const DATE_PATTERNS: RegExp[] = [
  /\b(\d{4})[-/](\d{1,2})[-/](\d{1,2})\b/, // yyyy-mm-dd
  /\b(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})\b/, // dd-mm-yyyy or mm-dd-yyyy
  /\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{2,4})\b/i,
];

export function parseDateFromReceipt(text: string): Date | null {
  for (const pattern of DATE_PATTERNS) {
    const match = text.match(pattern);
    if (!match) continue;

    if (pattern === DATE_PATTERNS[0]) {
      const [, y, m, d] = match;
      const date = new Date(Number(y), Number(m) - 1, Number(d));
      if (isValidDate(date)) return date;
    } else if (pattern === DATE_PATTERNS[1]) {
      const [, a, b, y] = match;
      const year = y.length === 2 ? 2000 + Number(y) : Number(y);
      // Assume day/month order (common outside the US); if day > 12 this is
      // unambiguous, otherwise it's a best guess.
      const day = Number(a) > 12 ? Number(a) : Number(a);
      const month = Number(a) > 12 ? Number(b) : Number(a);
      const date = new Date(year, (Number(a) > 12 ? Number(b) : month) - 1, day);
      if (isValidDate(date)) return date;
    } else {
      const [, d, mon, y] = match;
      const year = y.length === 2 ? 2000 + Number(y) : Number(y);
      const monthIndex = MONTHS.findIndex(m =>
        mon.toLowerCase().startsWith(m),
      );
      if (monthIndex >= 0) {
        const date = new Date(year, monthIndex, Number(d));
        if (isValidDate(date)) return date;
      }
    }
  }
  return null;
}

const MONTHS = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
];

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime()) && date <= new Date();
}

export function suggestCategoryFromReceipt(text: string): ExpenseCategory {
  const lower = text.toLowerCase();
  let bestCategory: ExpenseCategory = 'OTHER';
  let bestScore = 0;

  (Object.keys(CATEGORY_KEYWORDS) as ExpenseCategory[]).forEach(category => {
    const keywords = CATEGORY_KEYWORDS[category];
    const score = keywords.reduce(
      (count, keyword) => (lower.includes(keyword) ? count + 1 : count),
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  });

  return bestCategory;
}
