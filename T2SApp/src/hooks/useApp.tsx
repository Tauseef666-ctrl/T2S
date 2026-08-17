import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Colors, ThemeName, ThemeColors } from '../theme';

interface AppState {
  themeName: ThemeName;
  colors: ThemeColors;
  setTheme: (name: ThemeName) => void;
  currentSemester: number;
  setCurrentSemester: (s: number) => void;
  selectedFriend: string | null;
  setSelectedFriend: (id: string | null) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('cyberNight');
  const [currentSemester, setCurrentSemester] = useState(3);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const setTheme = (name: ThemeName) => setThemeName(name);
  const toggleSound = () => setSoundEnabled(prev => !prev);

  return (
    <AppContext.Provider
      value={{
        themeName,
        colors: Colors[themeName],
        setTheme,
        currentSemester,
        setCurrentSemester,
        selectedFriend,
        setSelectedFriend,
        soundEnabled,
        toggleSound,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
