import { ExpenseCategory } from '../types/models';

export interface CategoryMeta {
  label: string;
  icon: string; // MaterialCommunityIcons name
}

export const CATEGORY_META: Record<ExpenseCategory, CategoryMeta> = {
  FOOD: { label: 'Food & Dining', icon: 'food-fork-drink' },
  RENT: { label: 'Rent', icon: 'home-city-outline' },
  TRANSPORT: { label: 'Transport', icon: 'bus' },
  SHOPPING: { label: 'Shopping', icon: 'shopping-outline' },
  ENTERTAINMENT: { label: 'Entertainment', icon: 'movie-open-outline' },
  LIFESTYLE: { label: 'Lifestyle', icon: 'spa-outline' },
  HEALTH: { label: 'Health', icon: 'heart-pulse' },
  EDUCATION: { label: 'Education', icon: 'school-outline' },
  UTILITIES: { label: 'Utilities', icon: 'flash-outline' },
  TRAVEL: { label: 'Travel', icon: 'airplane' },
  DATING: { label: 'Dating', icon: 'ring' },
  OTHER: { label: 'Other', icon: 'shape-outline' },
};

/** Keyword → category, used by the OCR auto-suggest step. */
export const CATEGORY_KEYWORDS: Record<ExpenseCategory, string[]> = {
  FOOD: [
    'restaurant', 'cafe', 'coffee', 'diner', 'kitchen', 'food', 'pizza',
    'burger', 'grocery', 'supermarket', 'bakery', 'bar', 'starbucks',
  ],
  RENT: ['rent', 'lease', 'landlord', 'apartment'],
  TRANSPORT: [
    'uber', 'lyft', 'taxi', 'cab', 'fuel', 'petrol', 'gas station',
    'parking', 'metro', 'transit', 'toll',
  ],
  SHOPPING: [
    'mall', 'store', 'shop', 'mart', 'amazon', 'clothing', 'apparel',
    'electronics',
  ],
  ENTERTAINMENT: [
    'cinema', 'movie', 'theatre', 'netflix', 'spotify', 'concert', 'game',
  ],
  LIFESTYLE: ['salon', 'spa', 'gym', 'fitness', 'beauty'],
  HEALTH: [
    'pharmacy', 'hospital', 'clinic', 'doctor', 'medical', 'drug', 'health',
  ],
  EDUCATION: ['school', 'college', 'university', 'course', 'tuition', 'book'],
  UTILITIES: [
    'electricity', 'water bill', 'internet', 'utility', 'broadband', 'phone bill',
  ],
  TRAVEL: ['airlines', 'hotel', 'flight', 'airbnb', 'booking', 'resort'],
  DATING: ['dating'],
  OTHER: [],
};
