import {
  AppState,
  TopicProgress,
  QuizAttempt,
  MistakeEntry,
  StudyTodo,
  GroupTodo,
  DailyPractice,
  StudyStreak,
  VideoProgress,
  TimerStats,
  NoteEntry,
} from './types';
import { defaultState } from './defaultState';

export type StateAction =
  | { type: 'SET_THEME'; payload: string }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'TOGGLE_OFFLINE' }
  | { type: 'SET_STUDY_REMINDER'; payload: string | null }
  | { type: 'UPDATE_TOPIC_PROGRESS'; payload: { topicId: string; progress: Partial<TopicProgress> } }
  | { type: 'ADD_QUIZ_ATTEMPT'; payload: QuizAttempt }
  | { type: 'ADD_MISTAKE'; payload: MistakeEntry }
  | { type: 'REMOVE_MISTAKE'; payload: string }
  | { type: 'ADD_STUDY_TODO'; payload: StudyTodo }
  | { type: 'TOGGLE_STUDY_TODO'; payload: string }
  | { type: 'DELETE_STUDY_TODO'; payload: string }
  | { type: 'ADD_GROUP_TODO'; payload: GroupTodo }
  | { type: 'COMPLETE_GROUP_TODO'; payload: { todoId: string; friend: string } }
  | { type: 'UPDATE_STREAK'; payload: Partial<StudyStreak> }
  | { type: 'ADD_DAILY_PRACTICE'; payload: DailyPractice }
  | { type: 'UPDATE_VIDEO_PROGRESS'; payload: { videoId: string; progress: Partial<VideoProgress> } }
  | { type: 'UPDATE_TIMER_STATS'; payload: Partial<TimerStats> }
  | { type: 'ADD_NOTE'; payload: NoteEntry }
  | { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<NoteEntry> } }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'RESET_ALL' };

export function stateReducer(state: AppState, action: StateAction): AppState {
  const now = new Date().toISOString();

  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        settings: { ...state.settings, theme: action.payload },
        lastUpdated: now,
      };

    case 'TOGGLE_SOUND':
      return {
        ...state,
        settings: { ...state.settings, soundEnabled: !state.settings.soundEnabled },
        lastUpdated: now,
      };

    case 'TOGGLE_NOTIFICATIONS':
      return {
        ...state,
        settings: { ...state.settings, notificationsEnabled: !state.settings.notificationsEnabled },
        lastUpdated: now,
      };

    case 'TOGGLE_OFFLINE':
      return {
        ...state,
        settings: { ...state.settings, offlineMode: !state.settings.offlineMode },
        lastUpdated: now,
      };

    case 'SET_STUDY_REMINDER':
      return {
        ...state,
        settings: { ...state.settings, studyReminderTime: action.payload },
        lastUpdated: now,
      };

    case 'UPDATE_TOPIC_PROGRESS': {
      const existing = state.topicProgress[action.payload.topicId];
      const base: TopicProgress = {
        topicId: action.payload.topicId,
        status: 'not_started',
        lastStudied: null,
        quizScore: 0,
        timesRevised: 0,
      };
      return {
        ...state,
        topicProgress: {
          ...state.topicProgress,
          [action.payload.topicId]: { ...base, ...existing, ...action.payload.progress },
        },
        lastUpdated: now,
      };
    }

    case 'ADD_QUIZ_ATTEMPT':
      return {
        ...state,
        quizAttempts: [...state.quizAttempts, action.payload],
        lastUpdated: now,
      };

    case 'ADD_MISTAKE':
      return {
        ...state,
        mistakes: [...state.mistakes, action.payload],
        lastUpdated: now,
      };

    case 'REMOVE_MISTAKE':
      return {
        ...state,
        mistakes: state.mistakes.filter((m) => m.id !== action.payload),
        lastUpdated: now,
      };

    case 'ADD_STUDY_TODO':
      return {
        ...state,
        studyTodos: [...state.studyTodos, action.payload],
        lastUpdated: now,
      };

    case 'TOGGLE_STUDY_TODO':
      return {
        ...state,
        studyTodos: state.studyTodos.map((t) =>
          t.id === action.payload ? { ...t, completed: !t.completed } : t,
        ),
        lastUpdated: now,
      };

    case 'DELETE_STUDY_TODO':
      return {
        ...state,
        studyTodos: state.studyTodos.filter((t) => t.id !== action.payload),
        lastUpdated: now,
      };

    case 'ADD_GROUP_TODO':
      return {
        ...state,
        groupTodos: [...state.groupTodos, action.payload],
        lastUpdated: now,
      };

    case 'COMPLETE_GROUP_TODO':
      return {
        ...state,
        groupTodos: state.groupTodos.map((t) =>
          t.id === action.payload.todoId
            ? { ...t, completedBy: [...new Set([...t.completedBy, action.payload.friend])] }
            : t,
        ),
        lastUpdated: now,
      };

    case 'UPDATE_STREAK':
      return {
        ...state,
        streak: { ...state.streak, ...action.payload },
        lastUpdated: now,
      };

    case 'ADD_DAILY_PRACTICE': {
      const existing = state.dailyPractice.findIndex((d) => d.date === action.payload.date);
      if (existing >= 0) {
        const updated = [...state.dailyPractice];
        updated[existing] = action.payload;
        return { ...state, dailyPractice: updated, lastUpdated: now };
      }
      return {
        ...state,
        dailyPractice: [...state.dailyPractice, action.payload],
        lastUpdated: now,
      };
    }

    case 'UPDATE_VIDEO_PROGRESS': {
      const existing = state.videoProgress[action.payload.videoId];
      const base: VideoProgress = {
        videoId: action.payload.videoId,
        subject: '',
        watched: false,
        watchLater: false,
        important: false,
        dateWatched: null,
      };
      return {
        ...state,
        videoProgress: {
          ...state.videoProgress,
          [action.payload.videoId]: { ...base, ...existing, ...action.payload.progress },
        },
        lastUpdated: now,
      };
    }

    case 'UPDATE_TIMER_STATS':
      return {
        ...state,
        timerStats: { ...state.timerStats, ...action.payload },
        lastUpdated: now,
      };

    case 'ADD_NOTE':
      return {
        ...state,
        notes: [action.payload, ...state.notes],
        lastUpdated: now,
      };

    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.payload.id ? { ...n, ...action.payload.updates } : n
        ),
        lastUpdated: now,
      };

    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter((n) => n.id !== action.payload),
        lastUpdated: now,
      };

    case 'LOAD_STATE':
      return { ...action.payload, lastUpdated: now };

    case 'RESET_ALL':
      return { ...defaultState, lastUpdated: now };

    default:
      return state;
  }
}
