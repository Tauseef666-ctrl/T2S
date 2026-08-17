import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback, ReactNode } from 'react';
import { Colors, ThemeName, ThemeColors } from '../theme';
import { AppState as PersistedState } from '../store/types';
import { StateAction, stateReducer } from '../store/actions';
import { defaultState } from '../store/defaultState';
import { loadState, saveState } from '../store/storage';

interface AppContextValue {
  // Persisted state (raw)
  state: PersistedState;
  // Dispatch actions
  dispatch: React.Dispatch<StateAction>;

  // Legacy compatibility properties
  themeName: ThemeName;
  colors: ThemeColors;
  setTheme: (name: ThemeName) => void;
  currentSemester: number;
  setCurrentSemester: (s: number) => void;
  selectedFriend: string | null;
  setSelectedFriend: (id: string | null) => void;
  soundEnabled: boolean;
  toggleSound: () => void;

  // Loading indicator
  isLoaded: boolean;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const DEBOUNCE_MS = 500;

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(stateReducer, defaultState);
  const isLoadedRef = useRef(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Transient UI-only state (not persisted)
  const [currentSemester, setCurrentSemester] = React.useState(3);
  const [selectedFriend, setSelectedFriend] = React.useState<string | null>(null);

  // Load persisted state on mount
  useEffect(() => {
    loadState().then((saved) => {
      if (saved) {
        dispatch({ type: 'LOAD_STATE', payload: saved });
      }
      isLoadedRef.current = true;
      setIsLoaded(true);
    });
  }, []);

  // Debounced persistence
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!isLoadedRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      saveState(state);
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state]);

  // Legacy helpers
  const setTheme = useCallback(
    (name: ThemeName) => dispatch({ type: 'SET_THEME', payload: name }),
    [],
  );
  const toggleSound = useCallback(
    () => dispatch({ type: 'TOGGLE_SOUND' }),
    [],
  );

  const value: AppContextValue = {
    state,
    dispatch,

    // Legacy
    themeName: state.settings.theme as ThemeName,
    colors: Colors[state.settings.theme as ThemeName] ?? Colors.cyberNight,
    setTheme,
    currentSemester,
    setCurrentSemester,
    selectedFriend,
    setSelectedFriend,
    soundEnabled: state.settings.soundEnabled,
    toggleSound,

    isLoaded,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
