import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../src/hooks/useApp';
import { SampleQuizQuestions } from '../src/data';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function QuizScreen() {
  const { colors } = useApp();
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = SampleQuizQuestions[currentQ];

  const handleAnswer = (index: number) => {
    if (showAnswer) return;
    setSelected(index);
    setShowAnswer(true);
    if (index === question.correctIndex) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= SampleQuizQuestions.length) {
      setFinished(true);
      return;
    }
    setCurrentQ(c => c + 1);
    setSelected(null);
    setShowAnswer(false);
  };

  const restart = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowAnswer(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const percentage = Math.round((score / SampleQuizQuestions.length) * 100);
    return (
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <ScrollView contentContainerStyle={styles.centerContent}>
          <LinearGradient colors={[colors.accent + '15', colors.accentSecondary + '10']} style={[styles.resultCard, { borderColor: colors.border }]}>
            <Ionicons name={percentage >= 70 ? 'trophy' : 'school'} size={64} color={percentage >= 70 ? colors.warning : colors.accent} />
            <Text style={[styles.resultTitle, { color: colors.text }]}>Quiz Complete!</Text>
            <Text style={[styles.resultScore, { color: colors.accent }]}>{score}/{SampleQuizQuestions.length}</Text>
            <Text style={[styles.resultPercent, { color: colors.textSecondary }]}>{percentage}%</Text>
            <Text style={[styles.resultMsg, { color: percentage >= 70 ? colors.success : colors.warning }]}>
              {percentage >= 70 ? 'Great job! Keep it up!' : 'Keep practicing! You\'ll improve!'}
            </Text>
            <View style={styles.resultActions}>
              <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.accent }]} onPress={restart}>
                <Ionicons name="refresh" size={18} color="#050505" />
                <Text style={styles.primaryBtnText}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => router.back()}>
                <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Back to Study</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Quiz</Text>
            <Text style={[styles.headerSub, { color: colors.textSecondary }]}>
              {currentQ + 1} / {SampleQuizQuestions.length}
            </Text>
          </View>
          <View style={[styles.scoreBadge, { backgroundColor: colors.accent + '20' }]}>
            <Ionicons name="flash" size={16} color={colors.accent} />
            <Text style={[styles.scoreText, { color: colors.accent }]}>{score}</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View style={[styles.progressFill, { width: `${((currentQ + 1) / SampleQuizQuestions.length) * 100}%`, backgroundColor: colors.accent }]} />
        </View>

        {/* Difficulty Badge */}
        <View style={styles.difficultyRow}>
          <View style={[styles.diffBadge, { backgroundColor: question.difficulty === 'easy' ? colors.success + '20' : question.difficulty === 'medium' ? colors.warning + '20' : colors.error + '20' }]}>
            <Text style={[styles.diffText, { color: question.difficulty === 'easy' ? colors.success : question.difficulty === 'medium' ? colors.warning : colors.error }]}>
              {question.difficulty.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Question Card */}
        <LinearGradient colors={[colors.card, colors.secondary]} style={[styles.questionCard, { borderColor: colors.border }]}>
          <Text style={[styles.questionText, { color: colors.text }]}>{question.question}</Text>
        </LinearGradient>

        {/* Options */}
        <View style={styles.options}>
          {question.options.map((option, index) => {
            let optionStyle = { backgroundColor: colors.card, borderColor: colors.border };
            let textStyle = { color: colors.text };
            if (showAnswer) {
              if (index === question.correctIndex) {
                optionStyle = { backgroundColor: colors.success + '20', borderColor: colors.success };
                textStyle = { color: colors.success };
              } else if (index === selected && index !== question.correctIndex) {
                optionStyle = { backgroundColor: colors.error + '20', borderColor: colors.error };
                textStyle = { color: colors.error };
              }
            }
            return (
              <TouchableOpacity key={index} style={[styles.optionBtn, optionStyle]} onPress={() => handleAnswer(index)}
                activeOpacity={0.7}>
                <View style={[styles.optionLetter, { backgroundColor: showAnswer && index === question.correctIndex ? colors.success + '30' : showAnswer && index === selected ? colors.error + '30' : colors.secondary }]}>
                  <Text style={[styles.optionLetterText, { color: showAnswer && index === question.correctIndex ? colors.success : showAnswer && index === selected ? colors.error : colors.textSecondary }]}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text style={[styles.optionText, textStyle]}>{option}</Text>
                {showAnswer && index === question.correctIndex && <Ionicons name="checkmark-circle" size={20} color={colors.success} />}
                {showAnswer && index === selected && index !== question.correctIndex && <Ionicons name="close-circle" size={20} color={colors.error} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Explanation */}
        {showAnswer && (
          <View style={[styles.explanationCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="bulb" size={20} color={colors.warning} />
            <Text style={[styles.explanationText, { color: colors.textSecondary }]}>{question.explanation}</Text>
          </View>
        )}

        {/* Next Button */}
        {showAnswer && (
          <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.accent, marginHorizontal: 20, marginTop: 20 }]}
            onPress={nextQuestion}>
            <Text style={styles.primaryBtnText}>
              {currentQ + 1 >= SampleQuizQuestions.length ? 'See Results' : 'Next Question'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#050505" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, gap: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  headerSub: { fontSize: 12 },
  scoreBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  scoreText: { fontSize: 14, fontWeight: '800' },
  progressBar: { height: 4, marginHorizontal: 20, borderRadius: 2, marginBottom: 16 },
  progressFill: { height: 4, borderRadius: 2 },
  difficultyRow: { paddingHorizontal: 20, marginBottom: 16 },
  diffBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  diffText: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  questionCard: { marginHorizontal: 20, padding: 24, borderRadius: 20, borderWidth: 1, marginBottom: 20 },
  questionText: { fontSize: 18, fontWeight: '700', lineHeight: 26 },
  options: { paddingHorizontal: 20, gap: 10 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 14, borderWidth: 1 },
  optionLetter: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  optionLetterText: { fontSize: 14, fontWeight: '800' },
  optionText: { flex: 1, fontSize: 14, fontWeight: '500', lineHeight: 20 },
  explanationCard: { flexDirection: 'row', gap: 12, marginHorizontal: 20, marginTop: 16, padding: 16, borderRadius: 14, borderWidth: 1, alignItems: 'flex-start' },
  explanationText: { flex: 1, fontSize: 13, lineHeight: 18 },
  resultCard: { width: '100%', padding: 32, borderRadius: 24, borderWidth: 1, alignItems: 'center' },
  resultTitle: { fontSize: 24, fontWeight: '800', marginTop: 16, marginBottom: 8 },
  resultScore: { fontSize: 48, fontWeight: '900' },
  resultPercent: { fontSize: 16, marginBottom: 8 },
  resultMsg: { fontSize: 14, fontWeight: '600', marginBottom: 28 },
  resultActions: { width: '100%', gap: 12 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: 14 },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: '#050505' },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 14, borderWidth: 1 },
  secondaryBtnText: { fontSize: 15, fontWeight: '700' },
});
