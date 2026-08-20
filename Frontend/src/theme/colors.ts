/**
 * FinSight color tokens.
 * A deliberate "financial clarity" palette: deep indigo primary (trust, focus),
 * emerald for positive/income signals, amber/red reserved strictly for spend warnings.
 * Not the default Claude-orange-on-cream look — this is a finance app, so it leans
 * into ink, paper, and a single confident accent.
 */

export const palette = {
  indigo50: '#EEF1FF',
  indigo100: '#D9DFFF',
  indigo300: '#8C97F0',
  indigo500: '#4B4FDE',
  indigo600: '#3A3DC7',
  indigo700: '#2C2EA3',
  indigo900: '#1B1B5C',

  emerald300: '#7FDCB3',
  emerald500: '#2CB67D',
  emerald700: '#1E8A5C',

  amber400: '#F5B942',
  amber600: '#D89420',

  red400: '#F0776B',
  red500: '#E5534B',
  red700: '#B23A34',

  ink900: '#12131A',
  ink800: '#1B1D29',
  ink700: '#262838',
  ink600: '#383B52',
  ink400: '#6C6F8C',
  ink300: '#9497B3',
  ink100: '#DBDCE8',

  paper0: '#FFFFFF',
  paper50: '#F7F7FB',
  paper100: '#EFEFF6',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  card: string;
  border: string;
  divider: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  primary: string;
  primaryDark: string;
  primaryLight: string;
  onPrimary: string;

  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  danger: string;
  dangerBg: string;

  chartPalette: string[];

  shadow: string;
  overlay: string;
  skeleton: string;
  inputBg: string;
  tabInactive: string;
}

export const lightColors: ThemeColors = {
  background: palette.paper50,
  surface: palette.paper0,
  surfaceAlt: palette.paper100,
  card: palette.paper0,
  border: palette.ink100,
  divider: palette.ink100,

  textPrimary: palette.ink900,
  textSecondary: palette.ink600,
  textMuted: palette.ink300,
  textInverse: palette.paper0,

  primary: palette.indigo600,
  primaryDark: palette.indigo900,
  primaryLight: palette.indigo100,
  onPrimary: palette.white,

  success: palette.emerald700,
  successBg: '#E5F7EE',
  warning: palette.amber600,
  warningBg: '#FEF4E1',
  danger: palette.red500,
  dangerBg: '#FCEAE9',

  chartPalette: [
    palette.indigo500,
    palette.emerald500,
    palette.amber400,
    palette.red400,
    palette.indigo300,
    '#8E5CD9',
    '#28A7C9',
    '#D9738C',
    palette.ink400,
    '#5C8AD9',
    '#C97BD9',
    palette.ink300,
  ],

  shadow: 'rgba(18, 19, 26, 0.10)',
  overlay: 'rgba(18, 19, 26, 0.55)',
  skeleton: palette.paper100,
  inputBg: palette.paper50,
  tabInactive: palette.ink300,
};

export const darkColors: ThemeColors = {
  background: palette.ink900,
  surface: palette.ink800,
  surfaceAlt: palette.ink700,
  card: palette.ink800,
  border: palette.ink600,
  divider: palette.ink600,

  textPrimary: palette.paper0,
  textSecondary: palette.ink100,
  textMuted: palette.ink300,
  textInverse: palette.ink900,

  primary: palette.indigo300,
  primaryDark: palette.indigo500,
  primaryLight: palette.ink700,
  onPrimary: palette.ink900,

  success: palette.emerald300,
  successBg: 'rgba(44, 182, 125, 0.16)',
  warning: palette.amber400,
  warningBg: 'rgba(245, 185, 66, 0.16)',
  danger: palette.red400,
  dangerBg: 'rgba(229, 83, 75, 0.16)',

  chartPalette: [
    palette.indigo300,
    palette.emerald300,
    palette.amber400,
    palette.red400,
    palette.indigo100,
    '#B79BF0',
    '#6FC7E3',
    '#E3A0B3',
    palette.ink100,
    '#9CB6F0',
    '#E0B0F0',
    palette.ink300,
  ],

  shadow: 'rgba(0, 0, 0, 0.4)',
  overlay: 'rgba(0, 0, 0, 0.65)',
  skeleton: palette.ink700,
  inputBg: palette.ink700,
  tabInactive: palette.ink400,
};
