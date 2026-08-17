import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../src/hooks/useApp';
import { Semester3Subjects, BackPaperSubjects } from '../../src/data';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const QuickActions = [
  { id: 'quiz', icon: 'flash', label: 'Quick Quiz', color: '#00E5FF', route: '/quiz' },
  { id: 'lab', icon: 'code-slash', label: 'C Lab', color: '#FFD600', route: '/lab' },
  { id: 'notes', icon: 'document-text', label: 'Notes', color: '#7C4DFF', route: '/notes' },
  { id: 'timer', icon: 'timer', label: 'Focus Timer', color: '#00E676', route: '/study/timer' },
  { id: 'exam', icon: 'school', label: 'Exam Prep', color: '#FF5252', route: '/exam' },
  { id: 'videos', icon: 'play-circle', label: 'Videos', color: '#BB86FC', route: '/videos' },
];

export default function StudyScreen() {
  const { colors } = useApp();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'semester3' | 'backpaper'>('semester3');

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Study</Text>
          <Text style={[styles.title, { color: colors.text }]}>What shall we learn?</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {QuickActions.map(qa => (
            <TouchableOpacity key={qa.id} style={[styles.quickAction, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push(qa.route as any)}>
              <View style={[styles.quickActionIcon, { backgroundColor: qa.color + '20' }]}>
                <Ionicons name={qa.icon as any} size={22} color={qa.color} />
              </View>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>{qa.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Selector */}
        <View style={[styles.tabBar, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <TouchableOpacity style={[styles.tab, activeTab === 'semester3' && { backgroundColor: colors.accent + '20' }]}
            onPress={() => setActiveTab('semester3')}>
            <Text style={[styles.tabText, { color: activeTab === 'semester3' ? colors.accent : colors.textSecondary }]}>Semester 3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'backpaper' && { backgroundColor: colors.warning + '20' }]}
            onPress={() => setActiveTab('backpaper')}>
            <Text style={[styles.tabText, { color: activeTab === 'backpaper' ? colors.warning : colors.textSecondary }]}>Back Papers</Text>
          </TouchableOpacity>
        </View>

        {/* Subjects */}
        <View style={styles.subjectsList}>
          {(activeTab === 'semester3' ? Semester3Subjects : BackPaperSubjects).map((subject, index) => {
            const totalTopics = subject.units.reduce((a, u) => a + u.totalTopics, 0);
            const completedTopics = subject.units.reduce((a, u) => a + u.completedTopics, 0);
            const progress = totalTopics > 0 ? completedTopics / totalTopics : 0;

            return (
              <TouchableOpacity key={subject.id} style={[styles.subjectRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => router.push(`/subject/${subject.id}`)}>
                <View style={[styles.subjectLeft, { borderLeftColor: subject.color }]}>
                  <Text style={styles.subjectEmoji}>{subject.icon}</Text>
                  <View style={styles.subjectInfo}>
                    <Text style={[styles.subjectRowName, { color: colors.text }]}>{subject.name}</Text>
                    <Text style={[styles.subjectUnits, { color: colors.textSecondary }]}>
                      {subject.units.length} Units · {completedTopics}/{totalTopics} topics
                    </Text>
                  </View>
                </View>
                <View style={styles.subjectRight}>
                  <View style={[styles.progressRing, { borderColor: subject.color + '30' }]}>
                    <Text style={[styles.progressRingText, { color: subject.color }]}>{Math.round(progress * 100)}%</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Study Tips */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Study Tips</Text>
          <LinearGradient colors={[colors.accent + '15', colors.accentSecondary + '10']} style={[styles.tipCard, { borderColor: colors.border }]}>
            <Ionicons name="bulb" size={24} color={colors.warning} />
            <View style={styles.tipContent}>
              <Text style={[styles.tipTitle, { color: colors.text }]}>Active Recall</Text>
              <Text style={[styles.tipDesc, { color: colors.textSecondary }]}>Test yourself frequently instead of just re-reading notes. It strengthens memory by 50%.</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1, paddingTop: 60 },
  header: { paddingHorizontal: 20, marginBottom: 24 },
  greeting: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  title: { fontSize: 28, fontWeight: '800' },
  quickActions: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 28 },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  tabBar: { flexDirection: 'row', marginHorizontal: 20, borderRadius: 12, padding: 4, marginBottom: 20, borderWidth: 1 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabText: { fontSize: 13, fontWeight: '700' },
  subjectsList: { paddingHorizontal: 20, gap: 10 },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  subjectLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, borderLeftWidth: 3, paddingLeft: 12 },
  subjectEmoji: { fontSize: 28, marginRight: 12 },
  subjectInfo: { flex: 1 },
  subjectRowName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  subjectUnits: { fontSize: 12, color: '#8892A4' },
  subjectRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingText: { fontSize: 12, fontWeight: '800' },
  section: { paddingHorizontal: 20, marginTop: 28 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  tipCard: { flexDirection: 'row', padding: 16, borderRadius: 14, borderWidth: 1, gap: 12, alignItems: 'flex-start' },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  tipDesc: { fontSize: 13, lineHeight: 18 },
});
