import { Question, OS_QUESTIONS } from './os';
import { DBMS_QUESTIONS } from './dbms';
import { NETWORKING_QUESTIONS } from './networking';
import { C_QUESTIONS } from './c';
import { WEB_QUESTIONS } from './web';
import { MATH_QUESTIONS } from './math';
import { PHYSICS_QUESTIONS } from './physics';
import { CHEMISTRY_QUESTIONS } from './chemistry';
import { COMM_QUESTIONS } from './comm';

export type { Question };

export const ALL_QUESTIONS: Question[] = [
  ...OS_QUESTIONS,
  ...DBMS_QUESTIONS,
  ...NETWORKING_QUESTIONS,
  ...C_QUESTIONS,
  ...WEB_QUESTIONS,
  ...MATH_QUESTIONS,
  ...PHYSICS_QUESTIONS,
  ...CHEMISTRY_QUESTIONS,
  ...COMM_QUESTIONS,
];

export const QUESTIONS_BY_SUBJECT: Record<string, Question[]> = {
  os: OS_QUESTIONS,
  dbms: DBMS_QUESTIONS,
  networking: NETWORKING_QUESTIONS,
  c: C_QUESTIONS,
  web: WEB_QUESTIONS,
  math: MATH_QUESTIONS,
  physics: PHYSICS_QUESTIONS,
  chemistry: CHEMISTRY_QUESTIONS,
  comm: COMM_QUESTIONS,
};

export function getQuestionsBySubject(subject: string): Question[] {
  if (subject === 'all') return ALL_QUESTIONS;
  return QUESTIONS_BY_SUBJECT[subject] ?? [];
}

export function getQuestionsByDifficulty(difficulty: string): Question[] {
  if (difficulty === 'all') return ALL_QUESTIONS;
  return ALL_QUESTIONS.filter((q) => q.difficulty === difficulty);
}

export function getQuestionsByUnit(unit: string): Question[] {
  if (unit === 'all') return ALL_QUESTIONS;
  return ALL_QUESTIONS.filter((q) => q.unit === unit);
}

export interface RandomQuestionFilters {
  subject?: string;
  unit?: string;
  difficulty?: string;
}

export function getRandomQuestions(count: number, filters?: RandomQuestionFilters): Question[] {
  let pool = ALL_QUESTIONS;

  if (filters) {
    if (filters.subject && filters.subject !== 'all') {
      pool = pool.filter((q) => q.subject === filters.subject);
    }
    if (filters.unit && filters.unit !== 'all') {
      pool = pool.filter((q) => q.unit === filters.unit);
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      pool = pool.filter((q) => q.difficulty === filters.difficulty);
    }
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getUniqueUnits(subject?: string): string[] {
  const questions = subject && subject !== 'all' ? QUESTIONS_BY_SUBJECT[subject] ?? [] : ALL_QUESTIONS;
  return [...new Set(questions.map((q) => q.unit))];
}

export function getUniqueTopics(subject?: string): string[] {
  const questions = subject && subject !== 'all' ? QUESTIONS_BY_SUBJECT[subject] ?? [] : ALL_QUESTIONS;
  return [...new Set(questions.map((q) => q.topic))];
}
