export const Colors = {
  cyberNight: {
    primary: '#050505',
    secondary: '#111318',
    tertiary: '#181B22',
    text: '#F2F2F2',
    textSecondary: '#8892A4',
    accent: '#00E5FF',
    accentSecondary: '#7C4DFF',
    success: '#00E676',
    warning: '#FFD600',
    error: '#FF5252',
    border: '#2A2D35',
    card: '#1A1D24',
    cardHover: '#22252C',
    glow: 'rgba(0, 229, 255, 0.15)',
    glowPurple: 'rgba(124, 77, 255, 0.15)',
  },
  obsidian: {
    primary: '#050505',
    secondary: '#111318',
    tertiary: '#181B22',
    text: '#F2F2F2',
    textSecondary: '#8892A4',
    accent: '#C0C0C0',
    accentSecondary: '#4A90D9',
    success: '#00E676',
    warning: '#FFD600',
    error: '#FF5252',
    border: '#2A2D35',
    card: '#1A1D24',
    cardHover: '#22252C',
    glow: 'rgba(192, 192, 192, 0.15)',
    glowPurple: 'rgba(74, 144, 217, 0.15)',
  },
  midnightAurora: {
    primary: '#050505',
    secondary: '#111318',
    tertiary: '#181B22',
    text: '#F2F2F2',
    textSecondary: '#8892A4',
    accent: '#00E5FF',
    accentSecondary: '#BB86FC',
    success: '#00E676',
    warning: '#FFD600',
    error: '#FF5252',
    border: '#2A2D35',
    card: '#1A1D24',
    cardHover: '#22252C',
    glow: 'rgba(0, 229, 255, 0.15)',
    glowPurple: 'rgba(187, 134, 252, 0.15)',
  },
  minimalDark: {
    primary: '#050505',
    secondary: '#111318',
    tertiary: '#181B22',
    text: '#F2F2F2',
    textSecondary: '#8892A4',
    accent: '#FFFFFF',
    accentSecondary: '#4A6FA5',
    success: '#00E676',
    warning: '#FFD600',
    error: '#FF5252',
    border: '#2A2D35',
    card: '#1A1D24',
    cardHover: '#22252C',
    glow: 'rgba(255, 255, 255, 0.1)',
    glowPurple: 'rgba(74, 111, 165, 0.15)',
  },
};

export type ThemeName = keyof typeof Colors;
export type ThemeColors = typeof Colors.cyberNight;

export const Fonts = {
  regular: 'System',
  mono: 'Courier',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  }),
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};
