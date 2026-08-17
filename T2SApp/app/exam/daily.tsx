import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/hooks/useApp';
import { getRandomQuestions, Question } from '../../src/data/questions';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DailyPractice } from '../../src/store/types';

type Phase = 'intro' | 'quiz' | 'results' | 'history';

const SUBJECT_COLORS: Record<string, string> = {
  os: '#00E5FF', dbms: '#7C4DFF', networking: '#00E676', c: '#FFD600', web: '#FF5252',
  math: '#BB86FC', physics: '#03DAC6', chemistry: '#CF6679', comm: '#FFAB40',
};

const TIMER_OPTIONS = [
  { value: 1200, label: '20 min' },
  { value: 1800, label: '30 min' },
  { value: 0, label: 'No limit' },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export default function DailyPracticeScreen() {
  const { colors, state, dispatch } = useApp();
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(1200);
  const [timerOption, setTimerOption] = useState(1200);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const today = getToday();
  const todayPractice = state.dailyPractice.find((d) => d.date === today);

  const currentStreak = state.streak.currentStreak;

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  });

  const startQuiz = useCallback(() => {
    const selected = getRandomQuestions(20, {});
    if (selected.length === 0) {
      Alert.alert('No Questions', 'No questions available. Please add questions first.');
      return;
    }
    setQuestions(selected);
    setCurrentIndex(0);
    setAnswers(new Array(selected.length).fill(null));
    setTimeRemaining(timerOption);
    setElapsedTime(0);
    setPhase('quiz');
    fadeAnim.setValue(0);
  }, [timerOption]);

  useEffect(() => {
    if (phase !== 'quiz') return;
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
      if (timerOption > 0) {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  };

  const finishQuiz = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('results');
  }, []);

  const calculateResults = () => {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;
    questions.forEach((q, i) => {
      if (answers[i] === null) unattempted++;
      else if (answers[i] === q.correctIndex) correct++;
      else wrong++;
    });
    const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;
    const percentage = Math.round((correct / questions.length) * 100);
    return { correct, wrong, unattempted, accuracy, percentage };
  };

  const saveDailyPractice = () => {
    const results = calculateResults();
    const subjects = [...new Set(questions.map((q) => q.subject))];
    const record: DailyPractice = {
      date: today,
      questionsAttempted: questions.length,
      correct: results.correct,
      wrong: results.wrong,
      accuracy: results.accuracy,
      subjects,
    };
    dispatch({ type: 'ADD_DAILY_PRACTICE', payload: record });

    const lastDate = state.streak.lastStudyDate;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    let newStreak = state.streak.currentStreak;
    if (lastDate === today) {
      // already counted
    } else if (lastDate === yesterdayStr || lastDate === null) {
      newStreak = state.streak.currentStreak + 1;
    } else {
      newStreak = 1;
    }
    dispatch({
      type: 'UPDATE_STREAK',
      payload: {
        currentStreak: newStreak,
        longestStreak: Math.max(state.streak.longestStreak, newStreak),
        lastStudyDate: today,
        totalStudyDays: lastDate !== today ? state.streak.totalStudyDays + 1 : state.streak.totalStudyDays,
        totalQuestionsSolved: state.streak.totalQuestionsSolved + questions.length,
      },
    });
  };

  if (phase === 'intro') {
    return (
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={[styles.title, { color: colors.text }]}>Daily 20</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Practice 20 questions every day</Text>
            </View>
          </View>

          <View style={styles.introContent}>
            {/* Today's Status */}
            <LinearGradient colors={[colors.accent + '10', colors.accentSecondary + '08']} style={[styles.todayCard, { borderColor: colors.border }]}>
              <Ionicons name="calendar" size={32} color={colors.accent} />
              <Text style={[styles.todayDate, { color: colors.text }]}>{today}</Text>
              {todayPractice ? (
                <View style={styles.todayDone}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  <Text style={[styles.todayDoneText, { color: colors.success }]}>Completed! {todayPractice.correct}/{todayPractice.questionsAttempted}</Text>
                </View>
              ) : (
                <Text style={[styles.todayPending, { color: colors.warning }]}>Not completed yet</Text>
              )}
            </LinearGradient>

            {/* Streak */}
            <View style={[styles.streakCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.streakRow}>
                <View style={styles.streakItem}>
                  <Ionicons name="flame" size={28} color={colors.warning} />
                  <Text style={[styles.streakValue, { color: colors.warning }]}>{currentStreak}</Text>
                  <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Day Streak</Text>
                </View>
                <View style={[styles.streakDivider, { backgroundColor: colors.border }]} />
                <View style={styles.streakItem}>
                  <Ionicons name="trophy" size={28} color={colors.accent} />
                  <Text style={[styles.streakValue, { color: colors.accent }]}>{state.streak.longestStreak}</Text>
                  <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Best Streak</Text>
                </View>
                <View style={[styles.streakDivider, { backgroundColor: colors.border }]} />
                <View style={styles.streakItem}>
                  <Ionicons name="stats-chart" size={28} color={colors.success} />
                  <Text style={[styles.streakValue, { color: colors.success }]}>{state.dailyPractice.length}</Text>
                  <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Total Days</Text>
                </View>
              </View>
            </View>

            {/* Timer Selection */}
            <Text style={[styles.sectionLabel, { color: colors.text }]}>Timer</Text>
            <View style={styles.timerRow}>
              {TIMER_OPTIONS.map((t) => (
                <TouchableOpacity
                  key={t.value}
                  style={[styles.timerChip, {
                    backgroundColor: timerOption === t.value ? colors.accent + '20' : colors.card,
                    borderColor: timerOption === t.value ? colors.accent : colors.border,
                  }]}
                  onPress={() => setTimerOption(t.value)}
                >
                  <Ionicons name={t.value > 0 ? 'time' : 'infinite'} size={16} color={timerOption === t.value ? colors.accent : colors.textSecondary} />
                  <Text style={[styles.timerChipText, { color: timerOption === t.value ? colors.accent : colors.textSecondary }]}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Start Button */}
            <TouchableOpacity style={[styles.startBtn, { backgroundColor: colors.accent }]} onPress={startQuiz}>
              <Ionicons name="play" size={20} color="#050505" />
              <Text style={styles.startBtnText}>Start Daily Practice</Text>
            </TouchableOpacity>

            {/* History Button */}
            <TouchableOpacity style={[styles.historyBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setPhase('history')}>
              <Ionicons name="time" size={18} color={colors.accentSecondary} />
              <Text style={[styles.historyBtnText, { color: colors.accentSecondary }]}>View Practice History</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    );
  }

  if (phase === 'quiz') {
    const q = questions[currentIndex];
    if (!q) return null;
    const isTimed = timerOption > 0;

    return (
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        {/* Top Bar */}
        <View style={[styles.quizTopBar, { backgroundColor: colors.secondary, borderBottomColor: colors.border }]}>
          <View style={styles.timerContainer}>
            {isTimed && <Ionicons name="time" size={16} color={timeRemaining < 60 ? colors.error : colors.accent} />}
            <Text style={[styles.timerText, { color: isTimed && timeRemaining < 60 ? colors.error : colors.accent }]}>
              {isTimed ? formatTime(timeRemaining) : formatTime(elapsedTime)}
            </Text>
          </View>
          <Text style={[styles.qProgress, { color: colors.textSecondary }]}>
            {currentIndex + 1}/{questions.length}
          </Text>
        </View>

        {/* Progress */}
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View style={[styles.progressFill, { width: `${((currentIndex + 1) / questions.length) * 100}%`, backgroundColor: colors.accent }]} />
        </View>

        {/* Mini Nav */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.miniNavScroll}>
          {questions.map((_, i) => (
            <TouchableOpacity key={i} style={[styles.miniNavItem, {
              backgroundColor: i === currentIndex ? colors.accent : answers[i] !== null ? colors.success : colors.card,
              borderColor: i === currentIndex ? colors.accent : colors.border,
            }]} onPress={() => goToQuestion(i)}>
              <Text style={[styles.miniNavText, { color: i === currentIndex ? '#050505' : answers[i] !== null ? '#050505' : colors.textSecondary }]}>
                {i + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.quizScroll}>
          <Animated.View style={[styles.quizContent, { opacity: fadeAnim }]}>
            <View style={[styles.diffBadge, {
              backgroundColor: q.difficulty === 'easy' ? colors.success + '20' : q.difficulty === 'medium' ? colors.warning + '20' : colors.error + '20',
            }]}>
              <Text style={[styles.diffBadgeText, { color: q.difficulty === 'easy' ? colors.success : q.difficulty === 'medium' ? colors.warning : colors.error }]}>
                {q.difficulty.toUpperCase()}
              </Text>
              <Text style={[styles.qSubjectBadge, { color: SUBJECT_COLORS[q.subject] || colors.accent }]}>
                {q.subject.toUpperCase()}
              </Text>
            </View>

            <Text style={[styles.quizQuestionText, { color: colors.text }]}>{q.question}</Text>

            <View style={styles.quizOptions}>
              {q.options.map((opt, oi) => {
                const isSelected = answers[currentIndex] === oi;
                return (
                  <TouchableOpacity
                    key={oi}
                    style={[styles.quizOption, {
                      backgroundColor: isSelected ? colors.accent + '15' : colors.card,
                      borderColor: isSelected ? colors.accent : colors.border,
                    }]}
                    onPress={() => setAnswers((prev) => prev.map((a, i) => (i === currentIndex ? oi : a)))}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.quizOptionLetter, { backgroundColor: isSelected ? colors.accent + '30' : colors.secondary }]}>
                      <Text style={[styles.quizOptionLetterText, { color: isSelected ? colors.accent : colors.textSecondary }]}>
                        {String.fromCharCode(65 + oi)}
                      </Text>
                    </View>
                    <Text style={[styles.quizOptionText, { color: isSelected ? colors.accent : colors.text }]}>{opt}</Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={20} color={colors.accent} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </ScrollView>

        {/* Bottom Nav */}
        <View style={[styles.bottomNav, { backgroundColor: colors.secondary, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.bottomNavBtn, { opacity: currentIndex === 0 ? 0.4 : 1 }]}
            onPress={() => currentIndex > 0 && goToQuestion(currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.clearBtnSmall, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setAnswers((prev) => prev.map((a, i) => (i === currentIndex ? null : a)))}
          >
            <Ionicons name="backspace" size={14} color={colors.textSecondary} />
            <Text style={[styles.clearBtnSmallText, { color: colors.textSecondary }]}>Clear</Text>
          </TouchableOpacity>
          {currentIndex === questions.length - 1 ? (
            <TouchableOpacity style={[styles.finishBtn, { backgroundColor: colors.success }]} onPress={() => { finishQuiz(); }}>
              <Text style={styles.finishBtnText}>Finish</Text>
              <Ionicons name="checkmark-done" size={18} color="#050505" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.bottomNavBtn} onPress={() => goToQuestion(currentIndex + 1)}>
              <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  if (phase === 'results') {
    const results = calculateResults();
    return (
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <ScrollView contentContainerStyle={styles.resultsScroll}>
          <LinearGradient colors={[colors.accent + '10', colors.accentSecondary + '08']} style={[styles.resultsCard, { borderColor: colors.border }]}>
            <Ionicons name={results.percentage >= 70 ? 'trophy' : 'school'} size={52} color={results.percentage >= 70 ? colors.warning : colors.accent} />
            <Text style={[styles.resultsTitle, { color: colors.text }]}>Daily 20 Complete!</Text>
            <Text style={[styles.resultsScore, { color: colors.accent }]}>{results.correct}/20</Text>
            <Text style={[styles.resultsPercent, { color: colors.text }]}>{results.percentage}%</Text>
            <Text style={[styles.resultsAccuracy, { color: colors.textSecondary }]}>Accuracy: {results.accuracy}%</Text>
          </LinearGradient>

          <View style={styles.resultsStatsRow}>
            <View style={[styles.resultsStat, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={[styles.resultsStatValue, { color: colors.success }]}>{results.correct}</Text>
              <Text style={[styles.resultsStatLabel, { color: colors.textSecondary }]}>Correct</Text>
            </View>
            <View style={[styles.resultsStat, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="close-circle" size={20} color={colors.error} />
              <Text style={[styles.resultsStatValue, { color: colors.error }]}>{results.wrong}</Text>
              <Text style={[styles.resultsStatLabel, { color: colors.textSecondary }]}>Wrong</Text>
            </View>
            <View style={[styles.resultsStat, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="remove-circle" size={20} color={colors.textSecondary} />
              <Text style={[styles.resultsStatValue, { color: colors.textSecondary }]}>{results.unattempted}</Text>
              <Text style={[styles.resultsStatLabel, { color: colors.textSecondary }]}>Skipped</Text>
            </View>
          </View>

          <View style={[styles.timeUsedRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="time" size={18} color={colors.accent} />
            <Text style={[styles.timeUsedLabel, { color: colors.textSecondary }]}>Time Used</Text>
            <Text style={[styles.timeUsedValue, { color: colors.text }]}>{formatTime(elapsedTime)}</Text>
          </View>

          <View style={[styles.streakBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="flame" size={24} color={colors.warning} />
            <Text style={[styles.streakBadgeValue, { color: colors.warning }]}>{state.streak.currentStreak}</Text>
            <Text style={[styles.streakBadgeLabel, { color: colors.textSecondary }]}>Day Streak</Text>
          </View>

          <TouchableOpacity style={[styles.resultsActionBtn, { backgroundColor: colors.accent }]} onPress={() => { saveDailyPractice(); setPhase('intro'); }}>
            <Ionicons name="save" size={18} color="#050505" />
            <Text style={styles.resultsActionText}>Save & Done</Text>
          </TouchableOpacity>

          <View style={styles.resultsActionRow}>
            <TouchableOpacity style={[styles.resultsActionBtnHalf, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => { saveDailyPractice(); startQuiz(); }}>
              <Ionicons name="refresh" size={16} color={colors.accent} />
              <Text style={[styles.resultsActionHalfText, { color: colors.accent }]}>Practice More</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.resultsActionBtnHalf, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => { saveDailyPractice(); router.push('/exam/mistakes'); }}>
              <Ionicons name="book" size={16} color={colors.warning} />
              <Text style={[styles.resultsActionHalfText, { color: colors.warning }]}>Review Mistakes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (phase === 'history') {
    return (
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setPhase('intro')} style={[styles.backBtn, { backgroundColor: colors.card }]}>
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={[styles.title, { color: colors.text }]}>Practice History</Text>
            </View>
          </View>

          {state.dailyPractice.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No History Yet</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>Complete your first daily practice!</Text>
            </View>
          ) : (
            <View style={{ paddingHorizontal: 20 }}>
              {/* Last 7 days visualization */}
              <Text style={[styles.historySectionTitle, { color: colors.text }]}>Last 7 Days</Text>
              <View style={styles.historyGrid}>
                {last7Days.map((day) => {
                  const record = state.dailyPractice.find((d) => d.date === day);
                  const dayName = new Date(day).toLocaleDateString('en-US', { weekday: 'short' });
                  return (
                    <View key={day} style={styles.historyDayItem}>
                      <View style={[styles.historyDayCircle, {
                        backgroundColor: record ? colors.success + '20' : colors.card,
                        borderColor: record ? colors.success : colors.border,
                      }]}>
                        <Text style={[styles.historyDayIcon, { color: record ? colors.success : colors.textSecondary }]}>
                          {record ? '✓' : '–'}
                        </Text>
                      </View>
                      <Text style={[styles.historyDayLabel, { color: colors.textSecondary }]}>{dayName}</Text>
                      {record && (
                        <Text style={[styles.historyDayScore, { color: colors.accent }]}>{record.correct}/{record.questionsAttempted}</Text>
                      )}
                    </View>
                  );
                })}
              </View>

              {/* All records */}
              <Text style={[styles.historySectionTitle, { color: colors.text, marginTop: 24 }]}>All Records</Text>
              {[...state.dailyPractice].reverse().map((record, i) => (
                <View key={i} style={[styles.historyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={styles.historyCardHeader}>
                    <Ionicons name="calendar" size={16} color={colors.accent} />
                    <Text style={[styles.historyCardDate, { color: colors.text }]}>{record.date}</Text>
                    <Text style={[styles.historyCardAccuracy, { color: record.accuracy >= 70 ? colors.success : colors.warning }]}>{record.accuracy}%</Text>
                  </View>
                  <View style={styles.historyCardStats}>
                    <Text style={[styles.historyCardStat, { color: colors.success }]}>{record.correct} correct</Text>
                    <Text style={[styles.historyCardStat, { color: colors.error }]}>{record.wrong} wrong</Text>
                    <Text style={[styles.historyCardStat, { color: colors.textSecondary }]}>{record.questionsAttempted} total</Text>
                  </View>
                  <View style={styles.historyCardSubjects}>
                    {record.subjects.map((s) => (
                      <View key={s} style={[styles.historySubjectTag, { backgroundColor: (SUBJECT_COLORS[s] || colors.accent) + '15' }]}>
                        <Text style={[styles.historySubjectText, { color: SUBJECT_COLORS[s] || colors.accent }]}>{s.toUpperCase()}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, gap: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1 },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 12 },

  // Intro
  introContent: { paddingHorizontal: 20 },
  todayCard: { padding: 24, borderRadius: 20, borderWidth: 1, alignItems: 'center', marginBottom: 16 },
  todayDate: { fontSize: 16, fontWeight: '700', marginTop: 8, marginBottom: 4 },
  todayDone: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  todayDoneText: { fontSize: 13, fontWeight: '700' },
  todayPending: { fontSize: 13, marginTop: 4 },

  streakCard: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 24 },
  streakRow: { flexDirection: 'row', alignItems: 'center' },
  streakItem: { flex: 1, alignItems: 'center' },
  streakValue: { fontSize: 28, fontWeight: '900', marginTop: 6 },
  streakLabel: { fontSize: 11, marginTop: 2 },
  streakDivider: { width: 1, height: 40 },

  sectionLabel: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
  timerRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  timerChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 12, borderRadius: 12, borderWidth: 1 },
  timerChipText: { fontSize: 13, fontWeight: '700' },

  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: 14, marginBottom: 12 },
  startBtnText: { fontSize: 16, fontWeight: '800', color: '#050505' },
  historyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 14, borderRadius: 14, borderWidth: 1 },
  historyBtnText: { fontSize: 14, fontWeight: '700' },

  // Quiz
  quizTopBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1 },
  timerContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timerText: { fontSize: 18, fontWeight: '800', fontVariant: ['tabular-nums'] },
  qProgress: { fontSize: 14, fontWeight: '700' },
  progressBar: { height: 3, marginHorizontal: 20, marginTop: 4 },
  progressFill: { height: 3, borderRadius: 2 },

  miniNavScroll: { paddingHorizontal: 16, paddingVertical: 10 },
  miniNavItem: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 6, borderWidth: 1 },
  miniNavText: { fontSize: 11, fontWeight: '700' },

  quizScroll: { flex: 1 },
  quizContent: { padding: 20 },
  diffBadge: { flexDirection: 'row', gap: 8, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 16 },
  diffBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  qSubjectBadge: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  quizQuestionText: { fontSize: 17, fontWeight: '700', lineHeight: 24, marginBottom: 20 },
  quizOptions: { gap: 10 },
  quizOption: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 14, borderWidth: 1 },
  quizOptionLetter: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  quizOptionLetterText: { fontSize: 14, fontWeight: '800' },
  quizOptionText: { flex: 1, fontSize: 14, fontWeight: '500', lineHeight: 20 },

  bottomNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: 1 },
  bottomNavBtn: { padding: 10 },
  clearBtnSmall: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  clearBtnSmallText: { fontSize: 12, fontWeight: '700' },
  finishBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  finishBtnText: { fontSize: 14, fontWeight: '800', color: '#050505' },

  // Results
  resultsScroll: { padding: 20, paddingTop: 60, alignItems: 'center' },
  resultsCard: { width: '100%', padding: 28, borderRadius: 20, borderWidth: 1, alignItems: 'center', marginBottom: 20 },
  resultsTitle: { fontSize: 20, fontWeight: '800', marginTop: 12 },
  resultsScore: { fontSize: 40, fontWeight: '900', marginTop: 8 },
  resultsPercent: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  resultsAccuracy: { fontSize: 13, marginTop: 4 },

  resultsStatsRow: { flexDirection: 'row', gap: 10, width: '100%', marginBottom: 16 },
  resultsStat: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  resultsStatValue: { fontSize: 20, fontWeight: '800', marginTop: 6 },
  resultsStatLabel: { fontSize: 10, marginTop: 2 },

  timeUsedRow: { flexDirection: 'row', alignItems: 'center', gap: 10, width: '100%', padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  timeUsedLabel: { flex: 1, fontSize: 13 },
  timeUsedValue: { fontSize: 16, fontWeight: '800' },

  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 10, width: '100%', padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 20 },
  streakBadgeValue: { fontSize: 20, fontWeight: '900' },
  streakBadgeLabel: { fontSize: 13, color: '#8892A4' },

  resultsActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: 16, borderRadius: 14, marginBottom: 12 },
  resultsActionText: { fontSize: 15, fontWeight: '800', color: '#050505' },
  resultsActionRow: { flexDirection: 'row', gap: 10, width: '100%' },
  resultsActionBtnHalf: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 14, borderRadius: 12, borderWidth: 1 },
  resultsActionHalfText: { fontSize: 13, fontWeight: '700' },

  // History
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '800', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 13 },

  historySectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 16 },
  historyGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  historyDayItem: { alignItems: 'center', gap: 4 },
  historyDayCircle: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  historyDayIcon: { fontSize: 16, fontWeight: '800' },
  historyDayLabel: { fontSize: 10 },
  historyDayScore: { fontSize: 10, fontWeight: '700' },

  historyCard: { padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  historyCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  historyCardDate: { flex: 1, fontSize: 13, fontWeight: '700' },
  historyCardAccuracy: { fontSize: 14, fontWeight: '800' },
  historyCardStats: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  historyCardStat: { fontSize: 12 },
  historyCardSubjects: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  historySubjectTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  historySubjectText: { fontSize: 9, fontWeight: '800' },
});
