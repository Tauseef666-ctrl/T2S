import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '../../src/hooks/useApp';
import { Semester3Subjects, BackPaperSubjects } from '../../src/data';
import { Ionicons } from '@expo/vector-icons';

const allSubjects = [...Semester3Subjects, ...BackPaperSubjects];

export default function UnitDetailScreen() {
  const { subjectId, unitId } = useLocalSearchParams<{ subjectId: string; unitId: string }>();
  const { colors } = useApp();
  const router = useRouter();
  const subject = allSubjects.find(s => s.id === subjectId);
  const unit = subject?.units.find(u => u.id === unitId);

  if (!subject || !unit) return (
    <View style={[styles.container, { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={{ color: colors.text }}>Unit not found</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={[styles.unitTitle, { color: colors.text }]}>{unit.title}</Text>
          <Text style={[styles.subjectName, { color: subject.color }]}>{subject.name}</Text>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: subject.color }]}>{unit.completedTopics}/{unit.totalTopics}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Topics</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: subject.color }]}>{unit.questionsAttempted}/{unit.totalQuestions}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Questions</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: subject.color }]}>
                {unit.totalTopics > 0 ? Math.round((unit.completedTopics / unit.totalTopics) * 100) : 0}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Complete</Text>
            </View>
          </View>

          <Text style={[styles.topicsTitle, { color: colors.text }]}>Topics</Text>
          {unit.topics.map((topic, index) => {
            const isCompleted = index < unit.completedTopics;
            return (
              <View key={index} style={[styles.topicItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.topicCheck, { backgroundColor: isCompleted ? subject.color + '20' : colors.secondary, borderColor: isCompleted ? subject.color : colors.border }]}>
                  {isCompleted && <Ionicons name="checkmark" size={14} color={subject.color} />}
                </View>
                <Text style={[styles.topicName, { color: isCompleted ? colors.textSecondary : colors.text, textDecorationLine: isCompleted ? 'line-through' : 'none' }]}>
                  {topic}
                </Text>
                <TouchableOpacity style={[styles.topicAction, { backgroundColor: colors.secondary }]}>
                  <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            );
          })}

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: subject.color }]}
              onPress={() => router.push('/study/timer')}>
              <Ionicons name="play" size={18} color="#050505" />
              <Text style={styles.primaryBtnText}>Start Study Session</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push('/quiz')}>
              <Ionicons name="flash" size={18} color={colors.accent} />
              <Text style={[styles.secondaryBtnText, { color: colors.accent }]}>Practice Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 60, flexDirection: 'row' },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  unitTitle: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  subjectName: { fontSize: 14, fontWeight: '600', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 11 },
  topicsTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
  topicItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  topicCheck: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  topicName: { flex: 1, fontSize: 14, fontWeight: '500' },
  topicAction: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  actions: { marginTop: 28, gap: 12, marginBottom: 100 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: 14 },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: '#050505' },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: 14, borderWidth: 1 },
  secondaryBtnText: { fontSize: 15, fontWeight: '700' },
});
