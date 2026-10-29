export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryMid: string;
  darkBlue: string;

  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  dangerLight: string;
  purple: string;
  purpleLight: string;
  teal: string;
  tealLight: string;

  background: string;
  white: string;
  cardBg: string;
  inputBg: string;

  text: string;
  textBody: string;
  textLight: string;
  textMuted: string;

  border: string;
  borderLight: string;

  tabBarActive: string;
  tabBarInactive: string;
  tabBarBg: string;
}

export const LightColors: ThemeColors = {
  // Brand
  primary: '#2F6BFF',
  primaryLight: '#EEF3FF',
  primaryMid: '#1A54E8',
  darkBlue: '#0D2B52',

  // Semantic
  success: '#10B981',
  successLight: '#E8FBF3',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  danger: '#EF4444',
  dangerLight: '#FFF0F0',
  purple: '#8B5CF6',
  purpleLight: '#F3F0FF',
  teal: '#0EA5C9',
  tealLight: '#F0F9FF',

  // Surfaces
  background: '#F4F5F7',
  white: '#FFFFFF',
  cardBg: '#FFFFFF',
  inputBg: '#F8F9FB',

  // Text
  text: '#0D2B52',
  textBody: '#334155',
  textLight: '#6B7280',
  textMuted: '#9CA3AF',

  // Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // Tab bar
  tabBarActive: '#2F6BFF',
  tabBarInactive: '#94A3B8',
  tabBarBg: '#FFFFFF',
};

export const DarkColors: ThemeColors = {
  // Brand
  primary: '#3B82F6',
  primaryLight: 'rgba(59, 130, 246, 0.15)',
  primaryMid: '#2563EB',
  darkBlue: '#0B132B',

  // Semantic
  success: '#34D399',
  successLight: 'rgba(52, 211, 153, 0.15)',
  warning: '#FBBF24',
  warningLight: 'rgba(251, 191, 36, 0.15)',
  danger: '#F87171',
  dangerLight: 'rgba(248, 113, 113, 0.15)',
  purple: '#A78BFA',
  purpleLight: 'rgba(167, 139, 250, 0.15)',
  teal: '#2DD4BF',
  tealLight: 'rgba(45, 212, 191, 0.15)',

  // Surfaces
  background: '#0F172A',
  white: '#1E293B',
  cardBg: '#1E293B',
  inputBg: '#334155',

  // Text
  text: '#F8FAFC',
  textBody: '#E2E8F0',
  textLight: '#94A3B8',
  textMuted: '#64748B',

  // Borders
  border: '#334155',
  borderLight: '#1E293B',

  // Tab bar
  tabBarActive: '#60A5FA',
  tabBarInactive: '#64748B',
  tabBarBg: '#1E293B',
};

export const Colors = LightColors;

export default Colors;
