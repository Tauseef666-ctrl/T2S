import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/hooks/useApp';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MistakeEntry } from '../../src/store/types';

const SUBJECTS = ['all', 'os', 'dbms', 'networking', 'c', 'web', 'math', 'physics', 'chemistry', 'comm'];
const SUBJECT_LABELS: Record<string, string> = {
  all: 'All', os: 'OS', dbms: 'DBMS', networking: 'Net', c: 'C', web: 'Web', math: 'Math', physics: 'Phy', chemistry: 'Chem', comm: 'Comm',
};
const SUBJECT_COLORS: Record<string, string> = {
  os: '#00E5FF', dbms: '#7C4DFF', networking: '#00E676', c: '#FFD600', web: '#FF5252',
  math: '#BB86FC', physics: '#03DAC6', chemistry: '#CF6679', comm: '#FFAB40',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export default function MistakesScreen() {
  const { colors, state, dispatch } = useApp();
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const mistakes = state.mistakes;

  const filteredMistakes = useMemo(() => {
    let result = mistakes;
    if (selectedSubject !== 'all') {
      result = result.filter((m) => m.subject === selectedSubject);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m) => m.question.toLowerCase().includes(q) || m.topic.toLowerCase().includes(q));
    }
    return result;
  }, [mistakes, selectedSubject, searchQuery]);

  const subjectStats = useMemo(() => {
    const stats: Record<string, number> = {};
    mistakes.forEach((m) => {
      stats[m.subject] = (stats[m.subject] || 0) + 1;
    });
    return Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [mistakes]);

  const removeMistake = (id: string) => {
    Alert.alert('Remove', 'Remove this from mistakes?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => dispatch({ type: 'REMOVE_MISTAKE', payload: id }) },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.title, { color: colors.text }]}>My Mistakes</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Wrong answer notebook</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.error }]}>{mistakes.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.warning }]}>
              {subjectStats.length > 0 ? SUBJECT_LABELS[subjectStats[0][0]] : '-'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Most Wrong</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {mistakes.filter((m) => m.timesRepracticed > 0).length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Practiced</Text>
          </View>
        </View>

        {/* Subject Stats */}
        {subjectStats.length > 0 && (
          <View style={[styles.subjectStatsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Mistakes by Subject</Text>
            {subjectStats.map(([subj, count]) => (
              <View key={subj} style={styles.subjectStatRow}>
                <View style={[styles.subjectDot, { backgroundColor: SUBJECT_COLORS[subj] || colors.accent }]} />
                <Text style={[styles.subjectStatName, { color: colors.text }]}>{SUBJECT_LABELS[subj] || subj}</Text>
                <View style={[styles.subjectStatBar, { backgroundColor: colors.secondary }]}>
                  <View style={[styles.subjectStatBarFill, {
                    width: `${(count / mistakes.length) * 100}%`,
                    backgroundColor: SUBJECT_COLORS[subj] || colors.accent,
                  }]} />
                </View>
                <Text style={[styles.subjectStatCount, { color: colors.textSecondary }]}>{count}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Practice Button */}
        {mistakes.length > 0 && (
          <TouchableOpacity
            style={[styles.practiceBtn, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/quiz')}
          >
            <Ionicons name="flash" size={18} color="#050505" />
            <Text style={styles.practiceBtnText}>Practice My Mistakes ({mistakes.length})</Text>
          </TouchableOpacity>
        )}

        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={16} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search questions..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Subject Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {SUBJECTS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.filterChip, {
                backgroundColor: selectedSubject === s ? colors.accent + '20' : colors.card,
                borderColor: selectedSubject === s ? colors.accent : colors.border,
              }]}
              onPress={() => setSelectedSubject(s)}
            >
              <Text style={[styles.filterText, { color: selectedSubject === s ? colors.accent : colors.textSecondary }]}>
                {SUBJECT_LABELS[s]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Mistakes List */}
        {filteredMistakes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={48} color={colors.success} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {mistakes.length === 0 ? 'No Mistakes Yet!' : 'No Matching Mistakes'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {mistakes.length === 0 ? 'Keep practicing to build your mistake notebook.' : 'Try a different filter or search.'}
            </Text>
          </View>
        ) : (
          filteredMistakes.map((m) => (
            <View key={m.id} style={[styles.mistakeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.mistakeHeader}>
                <View style={[styles.mistakeSubjectBadge, { backgroundColor: (SUBJECT_COLORS[m.subject] || colors.accent) + '15' }]}>
                  <Text style={[styles.mistakeSubjectText, { color: SUBJECT_COLORS[m.subject] || colors.accent }]}>
                    {m.subject.toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.mistakeDate, { color: colors.textSecondary }]}>{formatDate(m.dateAdded)}</Text>
                <TouchableOpacity onPress={() => removeMistake(m.id)}>
                  <Ionicons name="trash-outline" size={16} color={colors.error} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.mistakeTopic, { color: colors.textSecondary }]}>{m.topic}</Text>
              <Text style={[styles.mistakeQuestion, { color: colors.text }]} numberOfLines={3}>{m.question}</Text>

              <View style={[styles.mistakeAnswerRow, { backgroundColor: colors.error + '10', borderColor: colors.error + '30' }]}>
                <Ionicons name="close-circle" size={14} color={colors.error} />
                <Text style={[styles.mistakeAnswer, { color: colors.error }]} numberOfLines={1}>Your answer: {m.studentAnswer}</Text>
              </View>
              <View style={[styles.mistakeAnswerRow, { backgroundColor: colors.success + '10', borderColor: colors.success + '30' }]}>
                <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                <Text style={[styles.mistakeAnswer, { color: colors.success }]} numberOfLines={1}>Correct: {m.correctAnswer}</Text>
              </View>

              <View style={styles.mistakeFooter}>
                <Text style={[styles.mistakePracticed, { color: colors.textSecondary }]}>
                  Practiced {m.timesRepracticed} time{m.timesRepracticed !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          ))
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

  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  statCard: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 2 },

  subjectStatsCard: { marginHorizontal: 20, padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 12 },
  subjectStatRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  subjectDot: { width: 8, height: 8, borderRadius: 4 },
  subjectStatName: { fontSize: 12, fontWeight: '700', width: 40 },
  subjectStatBar: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  subjectStatBarFill: { height: 6, borderRadius: 3 },
  subjectStatCount: { fontSize: 12, fontWeight: '700', width: 24, textAlign: 'right' },

  practiceBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginHorizontal: 20, padding: 14, borderRadius: 14, marginBottom: 16 },
  practiceBtnText: { fontSize: 14, fontWeight: '800', color: '#050505' },

  searchContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 13 },

  filterScroll: { paddingHorizontal: 20, marginBottom: 16 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  filterText: { fontSize: 12, fontWeight: '700' },

  emptyContainer: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '800', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 13, textAlign: 'center' },

  mistakeCard: { marginHorizontal: 20, padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 12 },
  mistakeHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  mistakeSubjectBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  mistakeSubjectText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  mistakeDate: { flex: 1, fontSize: 11, textAlign: 'right' },
  mistakeTopic: { fontSize: 11, marginBottom: 6 },
  mistakeQuestion: { fontSize: 13, fontWeight: '600', lineHeight: 18, marginBottom: 10 },

  mistakeAnswerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, marginBottom: 4 },
  mistakeAnswer: { flex: 1, fontSize: 11, fontWeight: '600' },

  mistakeFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 6 },
  mistakePracticed: { fontSize: 11 },
});
