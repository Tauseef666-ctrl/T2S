import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../src/hooks/useApp';
import { Semester3Subjects, BackPaperSubjects } from '../../src/data';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

function FloatingOrb({ color, size, x, y, delay }: { color: string; size: number; x: number; y: number; delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -15] });
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: 0.15,
        transform: [{ translateY }],
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
      }}
    />
  );
}

function SubjectCard({ subject, onPress }: { subject: any; onPress: () => void }) {
  const { colors } = useApp();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  const totalTopics = subject.units.reduce((a: number, u: any) => a + u.totalTopics, 0);
  const completedTopics = subject.units.reduce((a: number, u: any) => a + u.completedTopics, 0);
  const progress = totalTopics > 0 ? completedTopics / totalTopics : 0;

  return (
    <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={0.8}>
      <Animated.View style={[styles.subjectCard, { backgroundColor: colors.card, borderColor: colors.border }, { transform: [{ scale: scaleAnim }] }]}>
        <LinearGradient
          colors={[subject.color + '22', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.subjectGradient}
        >
          <View style={styles.subjectHeader}>
            <Text style={styles.subjectIcon}>{subject.icon}</Text>
            <View style={[styles.subjectBadge, { backgroundColor: subject.color + '30' }]}>
              <Text style={[styles.subjectBadgeText, { color: subject.color }]}>{subject.shortName}</Text>
            </View>
          </View>
          <Text style={[styles.subjectName, { color: colors.text }]} numberOfLines={1}>{subject.name}</Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
              <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: subject.color }]} />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>{Math.round(progress * 100)}%</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { colors } = useApp();
  const router = useRouter();
  const coreAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(coreAnim, { toValue: 1, duration: 4000, useNativeDriver: true })
    ).start();
  }, []);

  const coreScale = coreAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.08, 1] });
  const coreOpacity = coreAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.8, 1, 0.8] });

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <FloatingOrb color={colors.accent} size={200} x={-50} y={100} delay={0} />
      <FloatingOrb color={colors.accentSecondary} size={150} x={width - 120} y={300} delay={500} />
      <FloatingOrb color={colors.accent} size={100} x={50} y={500} delay={1000} />
      <FloatingOrb color={colors.accentSecondary} size={180} x={width - 180} y={150} delay={300} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* T2S Core Logo */}
        <View style={styles.coreSection}>
          <Animated.View style={[styles.coreLogo, { transform: [{ scale: coreScale }], opacity: coreOpacity }]}>
            <LinearGradient colors={[colors.accent + '40', colors.accentSecondary + '40']} style={styles.coreGradient}>
              <Text style={styles.coreText}>T2S</Text>
              <Text style={styles.coreSubtext}>Three Friends. One Journey.</Text>
            </LinearGradient>
          </Animated.View>

          {/* Connection Dots */}
          <View style={styles.connectionRow}>
            <View style={[styles.connectionDot, { backgroundColor: '#00E5FF' }]} />
            <View style={[styles.connectionLine, { backgroundColor: colors.border }]} />
            <View style={[styles.connectionDot, { backgroundColor: '#7C4DFF' }]} />
            <View style={[styles.connectionLine, { backgroundColor: colors.border }]} />
            <View style={[styles.connectionDot, { backgroundColor: '#00E676' }]} />
          </View>

          {/* Group Progress */}
          <View style={[styles.groupProgressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.groupProgressTitle, { color: colors.textSecondary }]}>GROUP PROGRESS</Text>
            <Text style={[styles.groupProgressValue, { color: colors.accent }]}>68%</Text>
            <Text style={[styles.groupProgressSub, { color: colors.textSecondary }]}>Semester 3 Syllabus</Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push('/exam')}>
              <Ionicons name="school" size={24} color={colors.warning} />
              <Text style={[styles.quickActionTitle, { color: colors.text }]}>Exam Prep</Text>
              <Text style={[styles.quickActionSub, { color: colors.textSecondary }]}>20 expected Qs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push('/videos')}>
              <Ionicons name="play-circle" size={24} color={colors.accent} />
              <Text style={[styles.quickActionTitle, { color: colors.text }]}>Videos</Text>
              <Text style={[styles.quickActionSub, { color: colors.textSecondary }]}>Best tutorials</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Semester 3 Subjects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Semester 3</Text>
            <View style={[styles.semesterBadge, { backgroundColor: colors.accent + '20' }]}>
              <Text style={[styles.semesterBadgeText, { color: colors.accent }]}>5 Subjects</Text>
            </View>
          </View>
          <View style={styles.subjectsGrid}>
            {Semester3Subjects.map(s => (
              <SubjectCard key={s.id} subject={s} onPress={() => router.push(`/subject/${s.id}`)} />
            ))}
          </View>
        </View>

        {/* Back Papers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Back Papers</Text>
            <View style={[styles.semesterBadge, { backgroundColor: colors.warning + '20' }]}>
              <Text style={[styles.semesterBadgeText, { color: colors.warning }]}>Year 1</Text>
            </View>
          </View>
          <View style={styles.subjectsGrid}>
            {BackPaperSubjects.map(s => (
              <SubjectCard key={s.id} subject={s} onPress={() => router.push(`/subject/${s.id}`)} />
            ))}
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
  coreSection: { alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  coreLogo: { marginBottom: 20 },
  coreGradient: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00E5FF40',
  },
  coreText: { fontSize: 42, fontWeight: '900', color: '#00E5FF', letterSpacing: 4 },
  coreSubtext: { fontSize: 11, color: '#8892A4', marginTop: 4, letterSpacing: 1 },
  connectionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  connectionDot: { width: 10, height: 10, borderRadius: 5 },
  connectionLine: { width: 60, height: 2, marginHorizontal: 4 },
  groupProgressCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  groupProgressTitle: { fontSize: 12, letterSpacing: 2, fontWeight: '600' },
  groupProgressValue: { fontSize: 48, fontWeight: '900', marginVertical: 4 },
  groupProgressSub: { fontSize: 13 },
  quickActionsRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  quickActionCard: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 1, gap: 6 },
  quickActionTitle: { fontSize: 13, fontWeight: '700' },
  quickActionSub: { fontSize: 11 },
  section: { paddingHorizontal: 20, marginTop: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  semesterBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  semesterBadgeText: { fontSize: 12, fontWeight: '600' },
  subjectsGrid: { gap: 12 },
  subjectCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 4,
  },
  subjectGradient: { padding: 18 },
  subjectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  subjectIcon: { fontSize: 28 },
  subjectBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  subjectBadgeText: { fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  subjectName: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressBg: { flex: 1, height: 6, borderRadius: 3 },
  progressFill: { height: 6, borderRadius: 3 },
  progressText: { fontSize: 12, fontWeight: '600', minWidth: 35, textAlign: 'right' },
});
