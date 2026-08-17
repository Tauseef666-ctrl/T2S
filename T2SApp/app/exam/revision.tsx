import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/hooks/useApp';
import { Semester3Subjects, BackPaperSubjects } from '../../src/data';
import { ALL_QUESTIONS, Question } from '../../src/data/questions';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { TopicProgress } from '../../src/store/types';

type RevisionStatus = 'learning' | 'completed' | 'mastered';

const SUBJECT_COLORS: Record<string, string> = {
  os: '#00E5FF', dbms: '#7C4DFF', networking: '#00E676', c: '#FFD600', web: '#FF5252',
  math: '#BB86FC', physics: '#03DAC6', chemistry: '#CF6679', comm: '#FFAB40',
};

const STATUS_CONFIG: Record<RevisionStatus, { label: string; color: string; icon: string }> = {
  learning: { label: 'Learning', color: '#FFD600', icon: 'book' },
  completed: { label: 'Completed', color: '#00E676', icon: 'checkmark-circle' },
  mastered: { label: 'Mastered', color: '#00E5FF', icon: 'diamond' },
};

interface RevisionRecommendation {
  subject: string;
  topic: string;
  unit: string;
  reason: string;
  reasonIcon: string;
  lastScore: number;
  status: RevisionStatus;
  topicId: string;
}

function daysSince(isoDate: string | null): number {
  if (!isoDate) return 999;
  const d = new Date(isoDate);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

export default function RevisionScreen() {
  const { colors, state, dispatch } = useApp();
  const router = useRouter();
  const [filterSubject, setFilterSubject] = useState('all');
  const [showChecklist, setShowChecklist] = useState(false);

  const allSubjects = [...Semester3Subjects, ...BackPaperSubjects];

  const recommendations = useMemo(() => {
    const recs: RevisionRecommendation[] = [];
    const mistakesByTopic: Record<string, number> = {};
    const lowScores: Record<string, number> = {};

    state.mistakes.forEach((m) => {
      const key = `${m.subject}:${m.topic}`;
      mistakesByTopic[key] = (mistakesByTopic[key] || 0) + 1;
    });

    state.quizAttempts.forEach((attempt) => {
      const key = `${attempt.subject}:${attempt.unit}`;
      if (!lowScores[key] || attempt.percentage < lowScores[key]) {
        lowScores[key] = attempt.percentage;
      }
    });

    allSubjects.forEach((subject) => {
      subject.units.forEach((unit) => {
        unit.topics.forEach((topic) => {
          const topicId = `${unit.id}:${topic}`;
          const progress = state.topicProgress[topicId];
          const mistakeKey = `${subject.id}:${topic}`;
          const unitKey = `${subject.id}:${unit.id}`;
          const mistakeCount = mistakesByTopic[mistakeKey] || 0;
          const lastScore = lowScores[unitKey] ?? -1;
          const days = progress?.lastStudied ? daysSince(progress.lastStudied) : 999;
          const status: RevisionStatus = progress?.status === 'mastered' ? 'mastered' : progress?.status === 'completed' ? 'completed' : 'learning';

          let reason = '';
          let reasonIcon = '';

          if (mistakeCount >= 2) {
            reason = `${mistakeCount} wrong answers`;
            reasonIcon = 'alert-circle';
          } else if (lastScore >= 0 && lastScore < 50) {
            reason = `Last score: ${lastScore}%`;
            reasonIcon = 'trending-down';
          } else if (progress?.status === 'needs_revision') {
            reason = 'Marked for revision';
            reasonIcon = 'refresh';
          } else if (days >= 7) {
            reason = `Not studied for ${days} days`;
            reasonIcon = 'time';
          } else {
            return;
          }

          recs.push({
            subject: subject.id,
            topic,
            unit: unit.id,
            reason,
            reasonIcon,
            lastScore,
            status,
            topicId,
          });
        });
      });
    });

    recs.sort((a, b) => {
      if (a.status === 'mastered' && b.status !== 'mastered') return 1;
      if (a.status !== 'mastered' && b.status === 'mastered') return -1;
      if (a.status === 'completed' && b.status === 'learning') return 1;
      return 0;
    });

    return recs;
  }, [state]);

  const filteredRecs = useMemo(() => {
    if (filterSubject === 'all') return recommendations;
    return recommendations.filter((r) => r.subject === filterSubject);
  }, [recommendations, filterSubject]);

  const getSubjectName = (id: string) => allSubjects.find((s) => s.id === id)?.shortName || id.toUpperCase();

  const updateTopicStatus = (topicId: string, status: RevisionStatus) => {
    dispatch({
      type: 'UPDATE_TOPIC_PROGRESS',
      payload: {
        topicId,
        progress: { status, lastStudied: new Date().toISOString() },
      },
    });
  };

  const allTopicsForChecklist = useMemo(() => {
    const topics: { subject: string; unit: string; topic: string; topicId: string; progress?: TopicProgress }[] = [];
    allSubjects.forEach((subject) => {
      if (filterSubject !== 'all' && subject.id !== filterSubject) return;
      subject.units.forEach((unit) => {
        unit.topics.forEach((topic) => {
          const topicId = `${unit.id}:${topic}`;
          topics.push({
            subject: subject.id,
            unit: unit.id,
            topic,
            topicId,
            progress: state.topicProgress[topicId],
          });
        });
      });
    });
    return topics;
  }, [state, filterSubject]);

  // Calculate mistake-based subject stats
  const mistakeStats = useMemo(() => {
    const stats: Record<string, number> = {};
    state.mistakes.forEach((m) => { stats[m.subject] = (stats[m.subject] || 0) + 1; });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  }, [state.mistakes]);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.title, { color: colors.text }]}>Smart Revision</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Personalized recommendations</Text>
          </View>
        </View>

        {/* Summary Stats */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="bulb" size={22} color={colors.warning} />
            <Text style={[styles.summaryValue, { color: colors.warning }]}>{recommendations.length}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Recommendations</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="book" size={22} color={colors.accent} />
            <Text style={[styles.summaryValue, { color: colors.accent }]}>
              {recommendations.filter((r) => r.status === 'learning').length}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Learning</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="diamond" size={22} color={colors.success} />
            <Text style={[styles.summaryValue, { color: colors.success }]}>
              {recommendations.filter((r) => r.status === 'mastered').length}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Mastered</Text>
          </View>
        </View>

        {/* Mistake Hotspots */}
        {mistakeStats.length > 0 && (
          <View style={[styles.hotspotCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.hotspotHeader}>
              <Ionicons name="warning" size={18} color={colors.error} />
              <Text style={[styles.hotspotTitle, { color: colors.error }]}>Mistake Hotspots</Text>
            </View>
            {mistakeStats.map(([subj, count]) => (
              <View key={subj} style={styles.hotspotRow}>
                <View style={[styles.hotspotDot, { backgroundColor: SUBJECT_COLORS[subj] || colors.accent }]} />
                <Text style={[styles.hotspotName, { color: colors.text }]}>{getSubjectName(subj)}</Text>
                <Text style={[styles.hotspotCount, { color: colors.error }]}>{count} mistakes</Text>
              </View>
            ))}
          </View>
        )}

        {/* Toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, {
              backgroundColor: !showChecklist ? colors.accent + '20' : colors.card,
              borderColor: !showChecklist ? colors.accent : colors.border,
            }]}
            onPress={() => setShowChecklist(false)}
          >
            <Ionicons name="bulb" size={16} color={!showChecklist ? colors.accent : colors.textSecondary} />
            <Text style={[styles.toggleText, { color: !showChecklist ? colors.accent : colors.textSecondary }]}>Recommendations</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, {
              backgroundColor: showChecklist ? colors.accent + '20' : colors.card,
              borderColor: showChecklist ? colors.accent : colors.border,
            }]}
            onPress={() => setShowChecklist(true)}
          >
            <Ionicons name="checkbox" size={16} color={showChecklist ? colors.accent : colors.textSecondary} />
            <Text style={[styles.toggleText, { color: showChecklist ? colors.accent : colors.textSecondary }]}>Checklist</Text>
          </TouchableOpacity>
        </View>

        {/* Subject Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {[{ id: 'all', label: 'All' }, ...allSubjects.map((s) => ({ id: s.id, label: s.shortName }))].map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.filterChip, {
                backgroundColor: filterSubject === s.id ? colors.accent + '20' : colors.card,
                borderColor: filterSubject === s.id ? colors.accent : colors.border,
              }]}
              onPress={() => setFilterSubject(s.id)}
            >
              <Text style={[styles.filterText, { color: filterSubject === s.id ? colors.accent : colors.textSecondary }]}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recommendations View */}
        {!showChecklist && (
          <View style={styles.listContent}>
            {filteredRecs.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="checkmark-done-outline" size={48} color={colors.success} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>All Caught Up!</Text>
                <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>No revision topics needed right now.</Text>
              </View>
            ) : (
              filteredRecs.map((rec, i) => {
                const statusConf = STATUS_CONFIG[rec.status];
                return (
                  <View key={`${rec.topicId}-${i}`} style={[styles.recCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.recHeader}>
                      <View style={[styles.recSubjectBadge, { backgroundColor: (SUBJECT_COLORS[rec.subject] || colors.accent) + '15' }]}>
                        <Text style={[styles.recSubjectText, { color: SUBJECT_COLORS[rec.subject] || colors.accent }]}>
                          {getSubjectName(rec.subject)}
                        </Text>
                      </View>
                      <View style={[styles.recStatusBadge, { backgroundColor: statusConf.color + '15' }]}>
                        <Ionicons name={statusConf.icon as any} size={12} color={statusConf.color} />
                        <Text style={[styles.recStatusText, { color: statusConf.color }]}>{statusConf.label}</Text>
                      </View>
                    </View>
                    <Text style={[styles.recTopic, { color: colors.text }]}>{rec.topic}</Text>
                    <View style={styles.recReasonRow}>
                      <Ionicons name={rec.reasonIcon as any} size={14} color={colors.warning} />
                      <Text style={[styles.recReason, { color: colors.textSecondary }]}>{rec.reason}</Text>
                    </View>

                    {/* Status Buttons */}
                    <View style={styles.recActions}>
                      {(Object.keys(STATUS_CONFIG) as RevisionStatus[]).map((s) => {
                        const conf = STATUS_CONFIG[s];
                        const isActive = rec.status === s;
                        return (
                          <TouchableOpacity
                            key={s}
                            style={[styles.recActionBtn, {
                              backgroundColor: isActive ? conf.color + '20' : colors.secondary,
                              borderColor: isActive ? conf.color : colors.border,
                            }]}
                            onPress={() => updateTopicStatus(rec.topicId, s)}
                          >
                            <Ionicons name={conf.icon as any} size={12} color={isActive ? conf.color : colors.textSecondary} />
                            <Text style={[styles.recActionText, { color: isActive ? conf.color : colors.textSecondary }]}>{conf.label}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* Checklist View */}
        {showChecklist && (
          <View style={styles.listContent}>
            {allTopicsForChecklist.map((item) => {
              const status: RevisionStatus = item.progress?.status === 'mastered' ? 'mastered' : item.progress?.status === 'completed' ? 'completed' : 'learning';
              const conf = STATUS_CONFIG[status];
              return (
                <View key={item.topicId} style={[styles.checkItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.checkDot, { backgroundColor: conf.color }]} />
                  <View style={styles.checkInfo}>
                    <Text style={[styles.checkSubject, { color: SUBJECT_COLORS[item.subject] || colors.accent }]}>
                      {getSubjectName(item.subject)}
                    </Text>
                    <Text style={[styles.checkTopic, { color: colors.text }]}>{item.topic}</Text>
                  </View>
                  <View style={styles.checkActions}>
                    {(Object.keys(STATUS_CONFIG) as RevisionStatus[]).map((s) => {
                      const sConf = STATUS_CONFIG[s];
                      const isActive = status === s;
                      return (
                        <TouchableOpacity
                          key={s}
                          style={[styles.checkBtn, {
                            backgroundColor: isActive ? sConf.color + '20' : 'transparent',
                            borderColor: isActive ? sConf.color : colors.border,
                          }]}
                          onPress={() => updateTopicStatus(item.topicId, s)}
                        >
                          <Ionicons name={sConf.icon as any} size={12} color={isActive ? sConf.color : colors.textSecondary} />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}
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

  summaryRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  summaryCard: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  summaryValue: { fontSize: 22, fontWeight: '800', marginTop: 6 },
  summaryLabel: { fontSize: 10, marginTop: 2 },

  hotspotCard: { marginHorizontal: 20, padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 16 },
  hotspotHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  hotspotTitle: { fontSize: 14, fontWeight: '800' },
  hotspotRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  hotspotDot: { width: 8, height: 8, borderRadius: 4 },
  hotspotName: { flex: 1, fontSize: 13, fontWeight: '600' },
  hotspotCount: { fontSize: 12, fontWeight: '700' },

  toggleRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 12 },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 10, borderRadius: 10, borderWidth: 1 },
  toggleText: { fontSize: 12, fontWeight: '700' },

  filterScroll: { paddingHorizontal: 20, marginBottom: 16 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  filterText: { fontSize: 12, fontWeight: '700' },

  listContent: { paddingHorizontal: 20 },

  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '800', marginTop: 12, marginBottom: 4 },
  emptySubtitle: { fontSize: 13 },

  recCard: { padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 12 },
  recHeader: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  recSubjectBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  recSubjectText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  recStatusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  recStatusText: { fontSize: 10, fontWeight: '700' },
  recTopic: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
  recReasonRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  recReason: { fontSize: 12 },
  recActions: { flexDirection: 'row', gap: 6 },
  recActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 8, borderRadius: 8, borderWidth: 1 },
  recActionText: { fontSize: 10, fontWeight: '700' },

  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 8 },
  checkDot: { width: 8, height: 8, borderRadius: 4 },
  checkInfo: { flex: 1 },
  checkSubject: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 2 },
  checkTopic: { fontSize: 13, fontWeight: '600' },
  checkActions: { flexDirection: 'row', gap: 4 },
  checkBtn: { width: 28, height: 28, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
