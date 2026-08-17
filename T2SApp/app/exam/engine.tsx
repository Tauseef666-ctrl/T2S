import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/hooks/useApp';
import { getRandomQuestions, getUniqueUnits, ALL_QUESTIONS, Question } from '../../src/data/questions';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { QuizAttempt, AnsweredQuestion, MistakeEntry } from '../../src/store/types';

type Phase = 'config' | 'exam' | 'results' | 'review';

interface ExamConfig {
  subject: string;
  unit: string;
  difficulty: string;
  questionCount: number;
  timeLimit: number;
  marksPerQuestion: number;
  negativeMarking: number;
}

const SUBJECTS = [
  { id: 'all', label: 'All' },
  { id: 'os', label: 'OS' },
  { id: 'dbms', label: 'DBMS' },
  { id: 'networking', label: 'Networking' },
  { id: 'c', label: 'C' },
  { id: 'web', label: 'Web' },
  { id: 'math', label: 'Math' },
  { id: 'physics', label: 'Physics' },
  { id: 'chemistry', label: 'Chemistry' },
  { id: 'comm', label: 'Comm' },
];

const DIFFICULTIES = [
  { id: 'all', label: 'All' },
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
];

const QUESTION_COUNTS = [10, 20, 30, 50];
const TIME_LIMITS = [
  { value: 900, label: '15 min' },
  { value: 1800, label: '30 min' },
  { value: 3600, label: '60 min' },
  { value: 5400, label: '90 min' },
  { value: 0, label: 'No limit' },
];
const NEGATIVE_OPTIONS = [0, 0.25, 0.5, 1];

const SUBJECT_COLORS: Record<string, string> = {
  os: '#00E5FF',
  dbms: '#7C4DFF',
  networking: '#00E676',
  c: '#FFD600',
  web: '#FF5252',
  math: '#BB86FC',
  physics: '#03DAC6',
  chemistry: '#CF6679',
  comm: '#FFAB40',
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function ExamEngineScreen() {
  const { colors, state, dispatch } = useApp();
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>('config');
  const [config, setConfig] = useState<ExamConfig>({
    subject: 'all',
    unit: 'all',
    difficulty: 'all',
    questionCount: 20,
    timeLimit: 1800,
    marksPerQuestion: 1,
    negativeMarking: 0.25,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [markedForReview, setMarkedForReview] = useState<boolean[]>([]);
  const [visited, setVisited] = useState<boolean[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showNavGrid, setShowNavGrid] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const availableUnits = getUniqueUnits(config.subject);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const startExam = useCallback(() => {
    const selected = getRandomQuestions(config.questionCount, {
      subject: config.subject,
      unit: config.unit,
      difficulty: config.difficulty,
    });

    if (selected.length === 0) {
      Alert.alert('No Questions', 'No questions match your filters. Try different settings.');
      return;
    }

    setQuestions(selected);
    setCurrentIndex(0);
    setAnswers(new Array(selected.length).fill(null));
    setMarkedForReview(new Array(selected.length).fill(false));
    setVisited(new Array(selected.length).fill(false).map((_, i) => i === 0));
    setTimeRemaining(config.timeLimit);
    setElapsedTime(0);
    setPhase('exam');
    fadeAnim.setValue(0);
  }, [config]);

  useEffect(() => {
    if (phase !== 'exam') return;

    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
      if (config.timeLimit > 0) {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            submitExam();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
    setVisited((prev) => prev.map((v, i) => (i === index ? true : v)));
    setShowNavGrid(false);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const selectAnswer = (optionIndex: number) => {
    setAnswers((prev) => prev.map((a, i) => (i === currentIndex ? optionIndex : a)));
  };

  const clearAnswer = () => {
    setAnswers((prev) => prev.map((a, i) => (i === currentIndex ? null : a)));
  };

  const toggleReview = () => {
    setMarkedForReview((prev) => prev.map((r, i) => (i === currentIndex ? !r : r)));
  };

  const submitExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowSubmitModal(false);
    setPhase('results');
  };

  const calculateResults = () => {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;
    let positiveMarks = 0;
    let negativeMarks = 0;
    const answeredQs: AnsweredQuestion[] = [];

    questions.forEach((q, i) => {
      const selected = answers[i];
      const isCorrect = selected === q.correctIndex;
      if (selected === null) {
        unattempted++;
      } else if (isCorrect) {
        correct++;
        positiveMarks += config.marksPerQuestion;
      } else {
        wrong++;
        negativeMarks += config.negativeMarking;
      }
      answeredQs.push({
        questionId: q.id,
        selectedIndex: selected,
        isCorrect: selected !== null ? isCorrect : false,
        timeSpent: 0,
      });
    });

    const totalPossible = questions.length * config.marksPerQuestion;
    const finalScore = positiveMarks - negativeMarks;
    const percentage = totalPossible > 0 ? Math.round((finalScore / totalPossible) * 100) : 0;
    const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

    const topicStats: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, i) => {
      const key = `${q.subject}:${q.topic}`;
      if (!topicStats[key]) topicStats[key] = { correct: 0, total: 0 };
      topicStats[key].total++;
      if (answers[i] === q.correctIndex) topicStats[key].correct++;
    });

    const weakTopics = Object.entries(topicStats)
      .filter(([_, s]) => s.correct / s.total < 0.5)
      .map(([k]) => k)
      .slice(0, 5);

    const strongTopics = Object.entries(topicStats)
      .filter(([_, s]) => s.correct / s.total >= 0.8)
      .map(([k]) => k)
      .slice(0, 5);

    return {
      correct,
      wrong,
      unattempted,
      positiveMarks,
      negativeMarks,
      finalScore,
      percentage,
      accuracy,
      answeredQs,
      weakTopics,
      strongTopics,
      totalPossible,
    };
  };

  const saveToHistory = () => {
    const results = calculateResults();
    const attempt: QuizAttempt = {
      id: `exam-${Date.now()}`,
      date: new Date().toISOString(),
      subject: config.subject,
      unit: config.unit,
      totalQuestions: questions.length,
      correct: results.correct,
      wrong: results.wrong,
      unattempted: results.unattempted,
      positiveMarks: results.positiveMarks,
      negativeMarks: results.negativeMarks,
      finalScore: results.finalScore,
      percentage: results.percentage,
      accuracy: results.accuracy,
      timeUsed: elapsedTime,
      questions: results.answeredQs,
    };
    dispatch({ type: 'ADD_QUIZ_ATTEMPT', payload: attempt });
    dispatch({ type: 'UPDATE_STREAK', payload: { totalMockTests: state.streak.totalMockTests + 1 } });
  };

  const addWrongToMistakes = () => {
    const results = calculateResults();
    questions.forEach((q, i) => {
      if (answers[i] !== null && answers[i] !== q.correctIndex) {
        const mistake: MistakeEntry = {
          id: `mistake-${Date.now()}-${i}`,
          questionId: q.id,
          subject: q.subject,
          topic: q.topic,
          question: q.question,
          correctAnswer: q.options[q.correctIndex],
          studentAnswer: answers[i] !== null ? q.options[answers[i]] : '',
          explanation: q.explanation,
          dateAdded: new Date().toISOString(),
          timesRepracticed: 0,
          lastPracticed: null,
        };
        dispatch({ type: 'ADD_MISTAKE', payload: mistake });
      }
    });
  };

  if (phase === 'config') {
    return (
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={[styles.title, { color: colors.text }]}>Mock Test</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Configure your exam</Text>
            </View>
          </View>

          <View style={styles.configContent}>
            {/* Subject */}
            <ConfigSection label="Subject" colors={colors}>
              <View style={styles.chipRow}>
                {SUBJECTS.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.chip, {
                      backgroundColor: config.subject === s.id ? colors.accent + '20' : colors.card,
                      borderColor: config.subject === s.id ? colors.accent : colors.border,
                    }]}
                    onPress={() => setConfig({ ...config, subject: s.id, unit: 'all' })}
                  >
                    <Text style={[styles.chipText, { color: config.subject === s.id ? colors.accent : colors.textSecondary }]}>{s.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ConfigSection>

            {/* Unit */}
            {config.subject !== 'all' && (
              <ConfigSection label="Unit" colors={colors}>
                <View style={styles.chipRow}>
                  <TouchableOpacity
                    style={[styles.chip, {
                      backgroundColor: config.unit === 'all' ? colors.accentSecondary + '20' : colors.card,
                      borderColor: config.unit === 'all' ? colors.accentSecondary : colors.border,
                    }]}
                    onPress={() => setConfig({ ...config, unit: 'all' })}
                  >
                    <Text style={[styles.chipText, { color: config.unit === 'all' ? colors.accentSecondary : colors.textSecondary }]}>All</Text>
                  </TouchableOpacity>
                  {availableUnits.map((u) => (
                    <TouchableOpacity
                      key={u}
                      style={[styles.chip, {
                        backgroundColor: config.unit === u ? colors.accentSecondary + '20' : colors.card,
                        borderColor: config.unit === u ? colors.accentSecondary : colors.border,
                      }]}
                      onPress={() => setConfig({ ...config, unit: u })}
                    >
                      <Text style={[styles.chipText, { color: config.unit === u ? colors.accentSecondary : colors.textSecondary }]}>{u.toUpperCase()}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ConfigSection>
            )}

            {/* Difficulty */}
            <ConfigSection label="Difficulty" colors={colors}>
              <View style={styles.chipRow}>
                {DIFFICULTIES.map((d) => (
                  <TouchableOpacity
                    key={d.id}
                    style={[styles.chip, {
                      backgroundColor: config.difficulty === d.id
                        ? (d.id === 'easy' ? colors.success : d.id === 'medium' ? colors.warning : d.id === 'hard' ? colors.error : colors.accent) + '20'
                        : colors.card,
                      borderColor: config.difficulty === d.id
                        ? (d.id === 'easy' ? colors.success : d.id === 'medium' ? colors.warning : d.id === 'hard' ? colors.error : colors.accent)
                        : colors.border,
                    }]}
                    onPress={() => setConfig({ ...config, difficulty: d.id })}
                  >
                    <Text style={[styles.chipText, {
                      color: config.difficulty === d.id
                        ? (d.id === 'easy' ? colors.success : d.id === 'medium' ? colors.warning : d.id === 'hard' ? colors.error : colors.accent)
                        : colors.textSecondary,
                    }]}>{d.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ConfigSection>

            {/* Question Count */}
            <ConfigSection label="Number of Questions" colors={colors}>
              <View style={styles.chipRow}>
                {QUESTION_COUNTS.map((c) => {
                  const available = ALL_QUESTIONS.filter((q) => {
                    if (config.subject !== 'all' && q.subject !== config.subject) return false;
                    if (config.unit !== 'all' && q.unit !== config.unit) return false;
                    if (config.difficulty !== 'all' && q.difficulty !== config.difficulty) return false;
                    return true;
                  }).length;
                  const disabled = c > available;
                  return (
                    <TouchableOpacity
                      key={c}
                      style={[styles.chip, {
                        backgroundColor: config.questionCount === c ? colors.accent + '20' : colors.card,
                        borderColor: config.questionCount === c ? colors.accent : colors.border,
                        opacity: disabled ? 0.4 : 1,
                      }]}
                      onPress={() => !disabled && setConfig({ ...config, questionCount: c })}
                      disabled={disabled}
                    >
                      <Text style={[styles.chipText, { color: config.questionCount === c ? colors.accent : colors.textSecondary }]}>{c}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={[styles.hint, { color: colors.textSecondary }]}>
                Available: {ALL_QUESTIONS.filter((q) => {
                  if (config.subject !== 'all' && q.subject !== config.subject) return false;
                  if (config.unit !== 'all' && q.unit !== config.unit) return false;
                  if (config.difficulty !== 'all' && q.difficulty !== config.difficulty) return false;
                  return true;
                }).length} questions
              </Text>
            </ConfigSection>

            {/* Time Limit */}
            <ConfigSection label="Time Limit" colors={colors}>
              <View style={styles.chipRow}>
                {TIME_LIMITS.map((t) => (
                  <TouchableOpacity
                    key={t.value}
                    style={[styles.chip, {
                      backgroundColor: config.timeLimit === t.value ? colors.success + '20' : colors.card,
                      borderColor: config.timeLimit === t.value ? colors.success : colors.border,
                    }]}
                    onPress={() => setConfig({ ...config, timeLimit: t.value })}
                  >
                    <Text style={[styles.chipText, { color: config.timeLimit === t.value ? colors.success : colors.textSecondary }]}>{t.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ConfigSection>

            {/* Marks Per Question */}
            <ConfigSection label="Marks per Question" colors={colors}>
              <View style={styles.chipRow}>
                {[1, 2].map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.chip, {
                      backgroundColor: config.marksPerQuestion === m ? colors.warning + '20' : colors.card,
                      borderColor: config.marksPerQuestion === m ? colors.warning : colors.border,
                    }]}
                    onPress={() => setConfig({ ...config, marksPerQuestion: m })}
                  >
                    <Text style={[styles.chipText, { color: config.marksPerQuestion === m ? colors.warning : colors.textSecondary }]}>{m} mark{m > 1 ? 's' : ''}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ConfigSection>

            {/* Negative Marking */}
            <ConfigSection label="Negative Marking" colors={colors}>
              <View style={styles.chipRow}>
                {NEGATIVE_OPTIONS.map((n) => (
                  <TouchableOpacity
                    key={n}
                    style={[styles.chip, {
                      backgroundColor: config.negativeMarking === n ? colors.error + '20' : colors.card,
                      borderColor: config.negativeMarking === n ? colors.error : colors.border,
                    }]}
                    onPress={() => setConfig({ ...config, negativeMarking: n })}
                  >
                    <Text style={[styles.chipText, { color: config.negativeMarking === n ? colors.error : colors.textSecondary }]}>
                      {n === 0 ? 'None' : `-${n}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ConfigSection>

            {/* Start Button */}
            <TouchableOpacity style={[styles.startBtn, { backgroundColor: colors.accent }]} onPress={startExam}>
              <Ionicons name="play" size={20} color="#050505" />
              <Text style={styles.startBtnText}>Start Exam</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    );
  }

  if (phase === 'results') {
    const results = calculateResults();
    return (
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setPhase('config')} style={[styles.backBtn, { backgroundColor: colors.card }]}>
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={[styles.title, { color: colors.text }]}>Results</Text>
            </View>
          </View>

          <View style={styles.resultsContent}>
            {/* Score Card */}
            <LinearGradient colors={[colors.accent + '10', colors.accentSecondary + '08']} style={[styles.scoreCard, { borderColor: colors.border }]}>
              <Ionicons name={results.percentage >= 70 ? 'trophy' : results.percentage >= 40 ? 'school' : 'bookmark'} size={48} color={results.percentage >= 70 ? colors.warning : colors.accent} />
              <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Final Score</Text>
              <Text style={[styles.scoreValue, { color: colors.accent }]}>{results.finalScore} / {results.totalPossible}</Text>
              <Text style={[styles.scorePercent, { color: colors.text }]}>{results.percentage}%</Text>
            </LinearGradient>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <StatCard icon="checkmark-circle" label="Correct" value={`${results.correct}`} color={colors.success} colors={colors} />
              <StatCard icon="close-circle" label="Wrong" value={`${results.wrong}`} color={colors.error} colors={colors} />
              <StatCard icon="remove-circle" label="Unattempted" value={`${results.unattempted}`} color={colors.textSecondary} colors={colors} />
              <StatCard icon="percent" label="Accuracy" value={`${results.accuracy}%`} color={colors.warning} colors={colors} />
              <StatCard icon="add-circle" label="Positive" value={`+${results.positiveMarks}`} color={colors.success} colors={colors} />
              <StatCard icon="remove-circle" label="Negative" value={`-${results.negativeMarks}`} color={colors.error} colors={colors} />
            </View>

            {/* Time */}
            <View style={[styles.timeRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="time" size={20} color={colors.accent} />
              <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Time Used</Text>
              <Text style={[styles.timeValue, { color: colors.text }]}>{formatTime(elapsedTime)}</Text>
            </View>

            {/* Weak Topics */}
            {results.weakTopics.length > 0 && (
              <View style={[styles.topicSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.topicHeader}>
                  <Ionicons name="trending-down" size={18} color={colors.error} />
                  <Text style={[styles.topicTitle, { color: colors.error }]}>Weak Topics</Text>
                </View>
                {results.weakTopics.map((t) => (
                  <Text key={t} style={[styles.topicItem, { color: colors.textSecondary }]}>{t}</Text>
                ))}
              </View>
            )}

            {/* Strong Topics */}
            {results.strongTopics.length > 0 && (
              <View style={[styles.topicSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.topicHeader}>
                  <Ionicons name="trending-up" size={18} color={colors.success} />
                  <Text style={[styles.topicTitle, { color: colors.success }]}>Strong Topics</Text>
                </View>
                {results.strongTopics.map((t) => (
                  <Text key={t} style={[styles.topicItem, { color: colors.textSecondary }]}>{t}</Text>
                ))}
              </View>
            )}

            {/* Action Buttons */}
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setPhase('review')}>
              <Ionicons name="eye" size={18} color={colors.accent} />
              <Text style={[styles.actionBtnText, { color: colors.accent }]}>Review Answers</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={saveToHistory}>
              <Ionicons name="save" size={18} color={colors.success} />
              <Text style={[styles.actionBtnText, { color: colors.success }]}>Save to History</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => { addWrongToMistakes(); Alert.alert('Done', 'Wrong answers added to My Mistakes notebook.'); }}>
              <Ionicons name="book" size={18} color={colors.warning} />
              <Text style={[styles.actionBtnText, { color: colors.warning }]}>Add Wrong to Mistakes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.accent }]} onPress={() => setPhase('config')}>
              <Ionicons name="refresh" size={18} color="#050505" />
              <Text style={styles.primaryBtnText}>New Exam</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    );
  }

  if (phase === 'review') {
    return (
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setPhase('results')} style={[styles.backBtn, { backgroundColor: colors.card }]}>
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={[styles.title, { color: colors.text }]}>Review Answers</Text>
            </View>
          </View>

          <View style={styles.reviewContent}>
            {questions.map((q, i) => {
              const selected = answers[i];
              const isCorrect = selected === q.correctIndex;
              const wasAttempted = selected !== null;
              return (
                <View key={q.id} style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: wasAttempted ? (isCorrect ? colors.success : colors.error) + '40' : colors.border }]}>
                  <View style={styles.reviewHeader}>
                    <Text style={[styles.reviewQNum, { color: colors.textSecondary }]}>Q{i + 1}</Text>
                    <View style={[styles.reviewStatusBadge, {
                      backgroundColor: wasAttempted ? (isCorrect ? colors.success : colors.error) + '20' : colors.textSecondary + '20',
                    }]}>
                      <Ionicons name={wasAttempted ? (isCorrect ? 'checkmark' : 'close') : 'remove'} size={14} color={wasAttempted ? (isCorrect ? colors.success : colors.error) : colors.textSecondary} />
                      <Text style={[styles.reviewStatusText, { color: wasAttempted ? (isCorrect ? colors.success : colors.error) : colors.textSecondary }]}>
                        {wasAttempted ? (isCorrect ? 'Correct' : 'Wrong') : 'Unattempted'}
                      </Text>
                    </View>
                    <View style={[styles.reviewDiffBadge, {
                      backgroundColor: q.difficulty === 'easy' ? colors.success + '15' : q.difficulty === 'medium' ? colors.warning + '15' : colors.error + '15',
                    }]}>
                      <Text style={[styles.reviewDiffText, { color: q.difficulty === 'easy' ? colors.success : q.difficulty === 'medium' ? colors.warning : colors.error }]}>
                        {q.difficulty.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.reviewQuestion, { color: colors.text }]}>{q.question}</Text>
                  {q.options.map((opt, oi) => {
                    const isThisCorrect = oi === q.correctIndex;
                    const isThisSelected = oi === selected;
                    let bg = colors.secondary;
                    let borderC = colors.border;
                    if (isThisCorrect) { bg = colors.success + '15'; borderC = colors.success; }
                    else if (isThisSelected && !isThisCorrect) { bg = colors.error + '15'; borderC = colors.error; }
                    return (
                      <View key={oi} style={[styles.reviewOption, { backgroundColor: bg, borderColor: borderC }]}>
                        <Text style={[styles.reviewOptionLetter, { color: isThisCorrect ? colors.success : isThisSelected ? colors.error : colors.textSecondary }]}>
                          {String.fromCharCode(65 + oi)}
                        </Text>
                        <Text style={[styles.reviewOptionText, { color: isThisCorrect ? colors.success : isThisSelected ? colors.error : colors.textSecondary }]}>{opt}</Text>
                        {isThisCorrect && <Ionicons name="checkmark-circle" size={16} color={colors.success} />}
                        {isThisSelected && !isThisCorrect && <Ionicons name="close-circle" size={16} color={colors.error} />}
                      </View>
                    );
                  })}
                  <View style={[styles.reviewExplanation, { backgroundColor: colors.tertiary, borderColor: colors.border }]}>
                    <Ionicons name="bulb" size={14} color={colors.warning} />
                    <Text style={[styles.reviewExplanationText, { color: colors.textSecondary }]}>{q.explanation}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    );
  }

  // Exam phase
  const q = questions[currentIndex];
  if (!q) return null;
  const isTimed = config.timeLimit > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Top Bar */}
      <View style={[styles.examTopBar, { backgroundColor: colors.secondary, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => setShowNavGrid(!showNavGrid)} style={[styles.navToggle, { backgroundColor: colors.card }]}>
          <Ionicons name="grid" size={18} color={colors.accent} />
        </TouchableOpacity>
        <View style={styles.timerContainer}>
          {isTimed && (
            <>
              <Ionicons name="time" size={16} color={timeRemaining < 60 ? colors.error : colors.accent} />
              <Text style={[styles.timerText, { color: timeRemaining < 60 ? colors.error : colors.accent }]}>
                {formatTime(timeRemaining)}
              </Text>
            </>
          )}
          {!isTimed && (
            <Text style={[styles.timerText, { color: colors.accent }]}>{formatTime(elapsedTime)}</Text>
          )}
        </View>
        <View style={[styles.qCounter, { backgroundColor: colors.accent + '15' }]}>
          <Text style={[styles.qCounterText, { color: colors.accent }]}>{currentIndex + 1}/{questions.length}</Text>
        </View>
      </View>

      {/* Navigation Grid Modal */}
      {showNavGrid && (
        <View style={[styles.navGridOverlay, { backgroundColor: colors.primary + 'E0' }]}>
          <View style={[styles.navGridContainer, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <View style={styles.navGridHeader}>
              <Text style={[styles.navGridTitle, { color: colors.text }]}>Question Navigator</Text>
              <TouchableOpacity onPress={() => setShowNavGrid(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendItem, { backgroundColor: colors.accent }]} /><Text style={[styles.legendLabel, { color: colors.textSecondary }]}>Current</Text>
              <View style={[styles.legendItem, { backgroundColor: colors.success }]} /><Text style={[styles.legendLabel, { color: colors.textSecondary }]}>Answered</Text>
              <View style={[styles.legendItem, { backgroundColor: colors.error }]} /><Text style={[styles.legendLabel, { color: colors.textSecondary }]}>Wrong</Text>
              <View style={[styles.legendItem, { backgroundColor: colors.warning }]} /><Text style={[styles.legendLabel, { color: colors.textSecondary }]}>Review</Text>
              <View style={[styles.legendItem, { backgroundColor: colors.textSecondary + '40' }]} /><Text style={[styles.legendLabel, { color: colors.textSecondary }]}>Unvisited</Text>
            </View>
            <View style={styles.navGrid}>
              {questions.map((_, i) => {
                let bg = colors.textSecondary + '30';
                if (i === currentIndex) bg = colors.accent;
                else if (markedForReview[i]) bg = colors.warning;
                else if (answers[i] !== null) {
                  bg = answers[i] === questions[i].correctIndex ? colors.success : colors.error;
                } else if (visited[i]) bg = colors.textSecondary + '60';
                return (
                  <TouchableOpacity key={i} style={[styles.navGridItem, { backgroundColor: bg }]} onPress={() => goToQuestion(i)}>
                    <Text style={[styles.navGridItemText, { color: bg === colors.accent || bg === colors.warning ? '#050505' : colors.text }]}>{i + 1}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} style={styles.examScroll}>
        <Animated.View style={[styles.examContent, { opacity: fadeAnim }]}>
          {/* Difficulty Badge */}
          <View style={[styles.diffBadgeExam, {
            backgroundColor: q.difficulty === 'easy' ? colors.success + '20' : q.difficulty === 'medium' ? colors.warning + '20' : colors.error + '20',
          }]}>
            <Text style={[styles.diffBadgeExamText, { color: q.difficulty === 'easy' ? colors.success : q.difficulty === 'medium' ? colors.warning : colors.error }]}>
              {q.difficulty.toUpperCase()}
            </Text>
            <Text style={[styles.qSubjectLabel, { color: SUBJECT_COLORS[q.subject] || colors.accent }]}>
              {q.subject.toUpperCase()}
            </Text>
          </View>

          {/* Question */}
          <Text style={[styles.examQuestionText, { color: colors.text }]}>{q.question}</Text>

          {/* Options */}
          <View style={styles.examOptions}>
            {q.options.map((opt, oi) => {
              const isSelected = answers[currentIndex] === oi;
              return (
                <TouchableOpacity
                  key={oi}
                  style={[styles.examOption, {
                    backgroundColor: isSelected ? colors.accent + '15' : colors.card,
                    borderColor: isSelected ? colors.accent : colors.border,
                  }]}
                  onPress={() => selectAnswer(oi)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.examOptionLetter, {
                    backgroundColor: isSelected ? colors.accent + '30' : colors.secondary,
                  }]}>
                    <Text style={[styles.examOptionLetterText, { color: isSelected ? colors.accent : colors.textSecondary }]}>
                      {String.fromCharCode(65 + oi)}
                    </Text>
                  </View>
                  <Text style={[styles.examOptionText, { color: isSelected ? colors.accent : colors.text }]}>{opt}</Text>
                  {isSelected && <Ionicons name="checkmark-circle" size={20} color={colors.accent} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Action Buttons */}
          <View style={styles.examActions}>
            <TouchableOpacity style={[styles.examActionBtn, {
              backgroundColor: markedForReview[currentIndex] ? colors.warning + '20' : colors.card,
              borderColor: markedForReview[currentIndex] ? colors.warning : colors.border,
            }]} onPress={toggleReview}>
              <Ionicons name="flag" size={16} color={markedForReview[currentIndex] ? colors.warning : colors.textSecondary} />
              <Text style={[styles.examActionText, { color: markedForReview[currentIndex] ? colors.warning : colors.textSecondary }]}>
                {markedForReview[currentIndex] ? 'Unmark Review' : 'Mark for Review'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.examActionBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={clearAnswer}>
              <Ionicons name="backspace" size={16} color={colors.textSecondary} />
              <Text style={[styles.examActionText, { color: colors.textSecondary }]}>Clear</Text>
            </TouchableOpacity>
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
          <Text style={[styles.bottomNavText, { color: colors.text }]}>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.submitExamBtn, { backgroundColor: colors.error }]} onPress={() => setShowSubmitModal(true)}>
          <Ionicons name="checkmark-done" size={18} color="#050505" />
          <Text style={styles.submitExamBtnText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bottomNavBtn, { opacity: currentIndex === questions.length - 1 ? 0.4 : 1 }]}
          onPress={() => currentIndex < questions.length - 1 && goToQuestion(currentIndex + 1)}
          disabled={currentIndex === questions.length - 1}
        >
          <Text style={[styles.bottomNavText, { color: colors.text }]}>Next</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Submit Modal */}
      <Modal visible={showSubmitModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <Ionicons name="alert-circle" size={40} color={colors.warning} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>Submit Exam?</Text>
            <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
              Answered: {answers.filter((a) => a !== null).length}/{questions.length} | Unanswered: {answers.filter((a) => a === null).length}
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalCancel, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setShowSubmitModal(false)}>
                <Text style={[styles.modalCancelText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalSubmit, { backgroundColor: colors.accent }]} onPress={submitExam}>
                <Text style={styles.modalSubmitText}>Confirm Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function ConfigSection({ label, colors, children }: { label: string; colors: any; children: React.ReactNode }) {
  return (
    <View style={styles.configSection}>
      <Text style={[styles.configLabel, { color: colors.text }]}>{label}</Text>
      {children}
    </View>
  );
}

function StatCard({ icon, label, value, color, colors }: { icon: string; label: string; value: string; color: string; colors: any }) {
  return (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Ionicons name={icon as any} size={20} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, gap: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1 },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 12 },

  // Config
  configContent: { paddingHorizontal: 20 },
  configSection: { marginBottom: 24 },
  configLabel: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: '700' },
  hint: { fontSize: 11, marginTop: 6 },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: 14, marginTop: 12 },
  startBtnText: { fontSize: 16, fontWeight: '800', color: '#050505' },

  // Exam
  examTopBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, gap: 12 },
  navToggle: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  timerContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timerText: { fontSize: 18, fontWeight: '800', fontVariant: ['tabular-nums'] },
  qCounter: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  qCounterText: { fontSize: 13, fontWeight: '700' },
  examScroll: { flex: 1 },
  examContent: { padding: 20 },
  diffBadgeExam: { flexDirection: 'row', gap: 8, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 16 },
  diffBadgeExamText: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  qSubjectLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  examQuestionText: { fontSize: 17, fontWeight: '700', lineHeight: 24, marginBottom: 20 },
  examOptions: { gap: 10 },
  examOption: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 14, borderWidth: 1 },
  examOptionLetter: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  examOptionLetterText: { fontSize: 14, fontWeight: '800' },
  examOptionText: { flex: 1, fontSize: 14, fontWeight: '500', lineHeight: 20 },
  examActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  examActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
  examActionText: { fontSize: 12, fontWeight: '700' },

  // Bottom Nav
  bottomNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1 },
  bottomNavBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 10 },
  bottomNavText: { fontSize: 14, fontWeight: '700' },
  submitExamBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  submitExamBtnText: { fontSize: 14, fontWeight: '800', color: '#050505' },

  // Nav Grid
  navGridOverlay: { ...StyleSheet.absoluteFill, justifyContent: 'center', padding: 20, zIndex: 100 },
  navGridContainer: { borderRadius: 20, borderWidth: 1, padding: 20 },
  navGridHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  navGridTitle: { fontSize: 16, fontWeight: '800' },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16, flexWrap: 'wrap' },
  legendItem: { width: 12, height: 12, borderRadius: 3 },
  legendLabel: { fontSize: 10, marginRight: 8 },
  navGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  navGridItem: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  navGridItemText: { fontSize: 13, fontWeight: '700' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { width: '100%', borderRadius: 20, borderWidth: 1, padding: 28, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '800', marginTop: 12, marginBottom: 8 },
  modalDesc: { fontSize: 13, marginBottom: 24, textAlign: 'center' },
  modalActions: { flexDirection: 'row', gap: 12, width: '100%' },
  modalCancel: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  modalCancelText: { fontSize: 14, fontWeight: '700' },
  modalSubmit: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
  modalSubmitText: { fontSize: 14, fontWeight: '800', color: '#050505' },

  // Results
  resultsContent: { paddingHorizontal: 20 },
  scoreCard: { padding: 28, borderRadius: 20, borderWidth: 1, alignItems: 'center', marginBottom: 20 },
  scoreLabel: { fontSize: 13, marginTop: 12, marginBottom: 4 },
  scoreValue: { fontSize: 32, fontWeight: '900' },
  scorePercent: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: { width: '31%', padding: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', marginTop: 6 },
  statLabel: { fontSize: 10, marginTop: 2 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  timeLabel: { flex: 1, fontSize: 13 },
  timeValue: { fontSize: 16, fontWeight: '800' },
  topicSection: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  topicHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  topicTitle: { fontSize: 14, fontWeight: '800' },
  topicItem: { fontSize: 12, marginLeft: 26, marginBottom: 4 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  actionBtnText: { fontSize: 14, fontWeight: '700' },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: 14, marginTop: 6 },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: '#050505' },

  // Review
  reviewContent: { paddingHorizontal: 20 },
  reviewCard: { padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 12 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  reviewQNum: { fontSize: 13, fontWeight: '800' },
  reviewStatusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  reviewStatusText: { fontSize: 11, fontWeight: '700' },
  reviewDiffBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  reviewDiffText: { fontSize: 10, fontWeight: '800' },
  reviewQuestion: { fontSize: 14, fontWeight: '600', lineHeight: 20, marginBottom: 12 },
  reviewOption: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 10, borderWidth: 1, marginBottom: 6 },
  reviewOptionLetter: { fontSize: 12, fontWeight: '800', width: 24, textAlign: 'center' },
  reviewOptionText: { flex: 1, fontSize: 12, lineHeight: 18 },
  reviewExplanation: { flexDirection: 'row', gap: 8, marginTop: 8, padding: 10, borderRadius: 8, borderWidth: 1 },
  reviewExplanationText: { flex: 1, fontSize: 11, lineHeight: 16 },
});
