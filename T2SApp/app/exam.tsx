import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../src/hooks/useApp';
import { Semester3ExamQuestions, QuestionPapers } from '../src/data/videos';
import { Semester3Subjects } from '../src/data';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const subjectColors: Record<string, string> = {
  os: '#00E5FF', dbms: '#7C4DFF', networking: '#00E676', c: '#FFD600', web: '#FF5252',
  math: '#BB86FC', physics: '#03DAC6', chemistry: '#CF6679', comm: '#FFAB40',
};

export default function ExamScreen() {
  const { colors } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState<'questions' | 'papers'>('questions');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [expandedQ, setExpandedQ] = useState<string | null>(null);

  const filteredQuestions = selectedSubject === 'all'
    ? Semester3ExamQuestions
    : Semester3ExamQuestions.filter(q => q.subject === selectedSubject);

  const filteredPapers = selectedSubject === 'all'
    ? QuestionPapers
    : QuestionPapers.filter(p => p.subjects.includes(selectedSubject));

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.title, { color: colors.text }]}>Exam Prep</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Expected questions & question papers</Text>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={[styles.tabBar, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <TouchableOpacity style={[styles.tab, tab === 'questions' && { backgroundColor: colors.accent + '20' }]}
            onPress={() => setTab('questions')}>
            <Ionicons name="help-circle" size={18} color={tab === 'questions' ? colors.accent : colors.textSecondary} />
            <Text style={[styles.tabText, { color: tab === 'questions' ? colors.accent : colors.textSecondary }]}>
              Expected Questions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, tab === 'papers' && { backgroundColor: colors.accentSecondary + '20' }]}
            onPress={() => setTab('papers')}>
            <Ionicons name="document-text" size={18} color={tab === 'papers' ? colors.accentSecondary : colors.textSecondary} />
            <Text style={[styles.tabText, { color: tab === 'papers' ? colors.accentSecondary : colors.textSecondary }]}>
              Question Papers
            </Text>
          </TouchableOpacity>
        </View>

        {/* Subject Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {[{ id: 'all', shortName: 'All', icon: '📋' },
            ...Semester3Subjects.map(s => ({ id: s.id, shortName: s.shortName, icon: s.icon }))].map(s => (
            <TouchableOpacity key={s.id}
              style={[styles.filterChip, {
                backgroundColor: selectedSubject === s.id ? colors.accent + '20' : colors.card,
                borderColor: selectedSubject === s.id ? colors.accent : colors.border,
              }]}
              onPress={() => setSelectedSubject(s.id)}>
              <Text style={styles.filterIcon}>{s.icon}</Text>
              <Text style={[styles.filterText, { color: selectedSubject === s.id ? colors.accent : colors.textSecondary }]}>
                {s.shortName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Questions Tab */}
        {tab === 'questions' && (
          <View style={styles.content}>
            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.statValue, { color: colors.accent }]}>{filteredQuestions.length}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Questions</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.statValue, { color: colors.warning }]}>
                  {filteredQuestions.filter(q => q.difficulty === 'hard').length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Hard</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.statValue, { color: colors.success }]}>
                  {filteredQuestions.reduce((a, q) => a + q.marks, 0)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Marks</Text>
              </View>
            </View>

            {/* Question Cards */}
            {filteredQuestions.map(q => (
              <TouchableOpacity key={q.id}
                style={[styles.questionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setExpandedQ(expandedQ === q.id ? null : q.id)}>
                <View style={styles.questionHeader}>
                  <View style={[styles.questionMeta, { backgroundColor: subjectColors[q.subject] + '15' }]}>
                    <Text style={[styles.questionSubject, { color: subjectColors[q.subject] }]}>
                      {q.subject.toUpperCase()}
                    </Text>
                  </View>
                  <View style={[styles.marksBadge, { backgroundColor: colors.warning + '15' }]}>
                    <Text style={[styles.marksText, { color: colors.warning }]}>{q.marks} marks</Text>
                  </View>
                  <View style={[styles.diffBadge, {
                    backgroundColor: q.difficulty === 'easy' ? colors.success + '15' : q.difficulty === 'medium' ? colors.warning + '15' : colors.error + '15'
                  }]}>
                    <Text style={[styles.diffText, {
                      color: q.difficulty === 'easy' ? colors.success : q.difficulty === 'medium' ? colors.warning : colors.error
                    }]}>{q.difficulty.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={[styles.questionText, { color: colors.text }]}>{q.question}</Text>

                {expandedQ === q.id && q.answer && (
                  <View style={[styles.answerBlock, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                    <View style={styles.answerHeader}>
                      <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                      <Text style={[styles.answerLabel, { color: colors.success }]}>Answer</Text>
                    </View>
                    <Text style={[styles.answerText, { color: colors.textSecondary }]}>{q.answer}</Text>
                  </View>
                )}

                <Ionicons name={expandedQ === q.id ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Papers Tab */}
        {tab === 'papers' && (
          <View style={styles.content}>
            {filteredPapers.map(paper => (
              <TouchableOpacity key={paper.id}
                style={[styles.paperCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <LinearGradient colors={[colors.accent + '08', 'transparent']} style={styles.paperGradient}>
                  <View style={styles.paperHeader}>
                    <Ionicons name="document-text" size={28} color={colors.accent} />
                    <View style={styles.paperInfo}>
                      <Text style={[styles.paperTitle, { color: colors.text }]}>{paper.title}</Text>
                      <Text style={[styles.paperMeta, { color: colors.textSecondary }]}>
                        {paper.year} · {paper.semester} · {paper.totalMarks} Marks · {paper.time}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.paperSubjects}>
                    {paper.subjects.map(s => (
                      <View key={s} style={[styles.paperSubjectTag, { backgroundColor: (subjectColors[s] || colors.accent) + '15' }]}>
                        <Text style={[styles.paperSubjectText, { color: subjectColors[s] || colors.accent }]}>
                          {s.toUpperCase()}
                        </Text>
                      </View>
                    ))}
                  </View>
              <TouchableOpacity style={[styles.paperAction, { backgroundColor: colors.accent + '15' }]}
                onPress={() => Linking.openURL(paper.url)}>
                <Ionicons name="open-outline" size={16} color={colors.accent} />
                <Text style={[styles.paperActionText, { color: colors.accent }]}>Open Question Paper</Text>
              </TouchableOpacity>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
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
  tabBar: { flexDirection: 'row', marginHorizontal: 20, borderRadius: 12, padding: 4, borderWidth: 1, marginBottom: 16 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
  tabText: { fontSize: 12, fontWeight: '700' },
  filterScroll: { paddingHorizontal: 20, marginBottom: 20 },
  filterChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  filterIcon: { fontSize: 14 },
  filterText: { fontSize: 12, fontWeight: '700' },
  content: { paddingHorizontal: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 2 },
  questionCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 12 },
  questionHeader: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  questionMeta: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  questionSubject: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  marksBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  marksText: { fontSize: 10, fontWeight: '700' },
  diffBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  diffText: { fontSize: 10, fontWeight: '700' },
  questionText: { fontSize: 14, fontWeight: '600', lineHeight: 20, marginBottom: 10 },
  answerBlock: { padding: 14, borderRadius: 10, borderWidth: 1, marginBottom: 10 },
  answerHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  answerLabel: { fontSize: 12, fontWeight: '700' },
  answerText: { fontSize: 13, lineHeight: 18 },
  paperCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 14 },
  paperGradient: { padding: 18 },
  paperHeader: { flexDirection: 'row', gap: 14, alignItems: 'flex-start', marginBottom: 14 },
  paperInfo: { flex: 1 },
  paperTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  paperMeta: { fontSize: 11 },
  paperSubjects: { flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  paperSubjectTag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  paperSubjectText: { fontSize: 10, fontWeight: '800' },
  paperAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, borderRadius: 10 },
  paperActionText: { fontSize: 13, fontWeight: '700' },
});
