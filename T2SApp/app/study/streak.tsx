import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../src/hooks/useApp';
import { Ionicons } from '@expo/vector-icons';
import StatCard from '../../src/components/StatCard';
import EmptyState from '../../src/components/EmptyState';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function FireAnimation({ colors }: { colors: any }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.7, duration: 800, useNativeDriver: false }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.3, duration: 800, useNativeDriver: false }),
        ]),
      ]),
    ).start();
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0.3, 0.7],
    outputRange: [0.2, 0.5],
  });

  return (
    <Animated.View style={{ alignItems: 'center', transform: [{ scale: pulseAnim }] }}>
      <Animated.View style={[styles.fireGlow, { opacity: glowOpacity, backgroundColor: '#FF5252' }]} />
      <Text style={styles.fireEmoji}>🔥</Text>
    </Animated.View>
  );
}

function WeekDay({ label, studied, colors, isToday }: {
  label: string; studied: boolean; colors: any; isToday: boolean;
}) {
  return (
    <View style={styles.weekDay}>
      <Text style={[styles.weekLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View style={[
        styles.weekDot,
        {
          backgroundColor: studied ? colors.success : colors.card,
          borderColor: isToday ? colors.accent : studied ? colors.success : colors.border,
          borderWidth: isToday ? 2 : 1,
        },
      ]}>
        {studied && <Ionicons name="checkmark" size={12} color="#fff" />}
      </View>
    </View>
  );
}

function HeatmapDay({ active, colors }: { active: boolean; colors: any }) {
  return (
    <View style={[
      styles.heatCell,
      {
        backgroundColor: active ? colors.success + '80' : colors.border + '30',
      },
    ]} />
  );
}

export default function StudyStreakScreen() {
  const { state } = useApp();
  const { colors } = useApp();
  const { streak } = state;

  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    weekDays.push({
      label: dayNames[d.getDay()],
      studied: streak.lastStudyDate !== null && new Date(streak.lastStudyDate).toDateString() === d.toDateString(),
      isToday: i === 0,
    });
  }

  const heatmapDays = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const active = streak.totalStudyDays > 0 && streak.lastStudyDate !== null &&
      new Date(streak.lastStudyDate).toDateString() === d.toDateString();
    heatmapDays.push({ active, date: dateStr });
  }

  if (streak.totalStudyDays === 0 && streak.currentStreak === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Track Progress</Text>
            <Text style={[styles.title, { color: colors.text }]}>Study Streak</Text>
          </View>
          <EmptyState
            icon="flame-outline"
            title="Start Your Streak"
            message="Complete your first study session to begin tracking your streak. Consistency is key!"
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Track Progress</Text>
          <Text style={[styles.title, { color: colors.text }]}>Study Streak</Text>
        </View>

        {/* Streak Hero */}
        <LinearGradient
          colors={[colors.accent + '18', colors.accentSecondary + '10']}
          style={styles.streakHero}
        >
          <FireAnimation colors={colors} />
          <Text style={[styles.streakNumber, { color: colors.text }]}>{streak.currentStreak}</Text>
          <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Day Streak</Text>
          <View style={styles.streakSubRow}>
            <View style={styles.streakSubItem}>
              <Ionicons name="trophy" size={16} color="#FFD600" />
              <Text style={[styles.streakSubText, { color: colors.text }]}>Best: {streak.longestStreak}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Weekly Calendar */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>This Week</Text>
          <View style={[styles.weekRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {weekDays.map((day, i) => (
              <WeekDay key={i} label={day.label} studied={day.studied} colors={colors} isToday={day.isToday} />
            ))}
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>All-Time Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard icon="calendar" value={streak.totalStudyDays} label="Study Days" color={colors.accent} />
            <StatCard icon="help-circle" value={streak.totalQuestionsSolved} label="Questions" color="#FFD600" />
            <StatCard icon="book" value={streak.totalTopicsCompleted} label="Topics" color={colors.success} />
            <StatCard icon="play-circle" value={streak.totalVideosWatched} label="Videos" color="#FF5252" />
            <StatCard icon="document-text" value={streak.totalNotesCreated} label="Notes" color={colors.accentSecondary} />
            <StatCard icon="school" value={streak.totalMockTests} label="Mock Tests" color="#03DAC6" />
          </View>
        </View>

        {/* Activity Heatmap */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Activity (Last 30 Days)</Text>
          <View style={[styles.heatmapCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.heatRow}>
              {heatmapDays.map((day, i) => (
                <HeatmapDay key={i} active={day.active} colors={colors} />
              ))}
            </View>
            <View style={styles.heatLegend}>
              <View style={styles.heatLegendItem}>
                <View style={[styles.heatLegendDot, { backgroundColor: colors.border + '30' }]} />
                <Text style={[styles.heatLegendText, { color: colors.textSecondary }]}>No activity</Text>
              </View>
              <View style={styles.heatLegendItem}>
                <View style={[styles.heatLegendDot, { backgroundColor: colors.success + '80' }]} />
                <Text style={[styles.heatLegendText, { color: colors.textSecondary }]}>Studied</Text>
              </View>
            </View>
          </View>
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
  streakHero: {
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00000000',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  fireGlow: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'absolute',
    top: -10,
  },
  fireEmoji: { fontSize: 48, marginBottom: 8 },
  streakNumber: { fontSize: 64, fontWeight: '900' },
  streakLabel: { fontSize: 16, fontWeight: '600', marginTop: -4 },
  streakSubRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  streakSubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakSubText: { fontSize: 14, fontWeight: '600' },
  section: { paddingHorizontal: 20, marginTop: 28 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  weekDay: { alignItems: 'center', gap: 8 },
  weekLabel: { fontSize: 11, fontWeight: '600' },
  weekDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  heatmapCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  heatRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  heatCell: {
    width: (SCREEN_WIDTH - 100) / 8,
    height: (SCREEN_WIDTH - 100) / 8,
    borderRadius: 4,
  },
  heatLegend: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    justifyContent: 'center',
  },
  heatLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heatLegendDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  heatLegendText: { fontSize: 11 },
});
