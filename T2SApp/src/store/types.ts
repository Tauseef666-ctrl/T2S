export interface TopicProgress {
  topicId: string;
  status: 'not_started' | 'learning' | 'completed' | 'needs_revision' | 'mastered';
  lastStudied: string | null;
  quizScore: number;
  timesRevised: number;
}

export interface QuizAttempt {
  id: string;
  date: string;
  subject: string;
  unit: string;
  totalQuestions: number;
  correct: number;
  wrong: number;
  unattempted: number;
  positiveMarks: number;
  negativeMarks: number;
  finalScore: number;
  percentage: number;
  accuracy: number;
  timeUsed: number;
  questions: AnsweredQuestion[];
}

export interface AnsweredQuestion {
  questionId: string;
  selectedIndex: number | null;
  isCorrect: boolean;
  timeSpent: number;
}

export interface MistakeEntry {
  id: string;
  questionId: string;
  subject: string;
  topic: string;
  question: string;
  correctAnswer: string;
  studentAnswer: string;
  explanation: string;
  dateAdded: string;
  timesRepracticed: number;
  lastPracticed: string | null;
}

export interface StudyTodo {
  id: string;
  title: string;
  subject: string;
  unit: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  friend?: string;
}

export interface GroupTodo {
  id: string;
  title: string;
  subject: string;
  assignedTo: string[];
  completedBy: string[];
  dueDate: string | null;
  createdAt: string;
}

export interface DailyPractice {
  date: string;
  questionsAttempted: number;
  correct: number;
  wrong: number;
  accuracy: number;
  subjects: string[];
}

export interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  totalStudyDays: number;
  totalQuestionsSolved: number;
  totalTopicsCompleted: number;
  totalVideosWatched: number;
  totalNotesCreated: number;
  totalMockTests: number;
}

export interface VideoProgress {
  videoId: string;
  subject: string;
  watched: boolean;
  watchLater: boolean;
  important: boolean;
  dateWatched: string | null;
}

export interface TimerStats {
  totalSessions: number;
  totalMinutes: number;
  totalPoints: number;
  focusMinutes: number;
  breakMinutes: number;
}

export interface AppSettings {
  theme: string;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  offlineMode: boolean;
  studyReminderTime: string | null;
}

export interface NoteEntry {
  id: string;
  title: string;
  content: string;
  subject: string;
  unit: string;
  tags: string[];
  type: 'personal' | 'study';
  createdAt: string;
  isImportant: boolean;
  isShared: boolean;
}

export interface AppState {
  settings: AppSettings;
  topicProgress: Record<string, TopicProgress>;
  quizAttempts: QuizAttempt[];
  mistakes: MistakeEntry[];
  studyTodos: StudyTodo[];
  groupTodos: GroupTodo[];
  dailyPractice: DailyPractice[];
  streak: StudyStreak;
  videoProgress: Record<string, VideoProgress>;
  timerStats: TimerStats;
  notes: NoteEntry[];
  lastUpdated: string;
}
