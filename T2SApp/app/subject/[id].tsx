import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '../../src/hooks/useApp';
import { Semester3Subjects, BackPaperSubjects } from '../../src/data';
import { SubjectVideos } from '../../src/data/videos';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const allSubjects = [...Semester3Subjects, ...BackPaperSubjects];

export default function SubjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useApp();
  const router = useRouter();
  const subject = allSubjects.find(s => s.id === id);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  if (!subject) return (
    <View style={[styles.container, { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={[styles.errorText, { color: colors.text }]}>Subject not found</Text>
    </View>
  );

  const totalTopics = subject.units.reduce((a, u) => a + u.totalTopics, 0);
  const completedTopics = subject.units.reduce((a, u) => a + u.completedTopics, 0);
  const overallProgress = totalTopics > 0 ? completedTopics / totalTopics : 0;

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.primary, opacity: fadeAnim }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Subject Hero */}
        <View style={styles.heroSection}>
          <LinearGradient colors={[subject.color + '25', 'transparent']} style={styles.heroGradient}>
            <Text style={styles.heroIcon}>{subject.icon}</Text>
            <Text style={[styles.heroName, { color: colors.text }]}>{subject.name}</Text>
            <Text style={[styles.heroDesc, { color: colors.textSecondary }]}>{subject.description}</Text>

            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Text style={[styles.heroStatValue, { color: subject.color }]}>{subject.units.length}</Text>
                <Text style={[styles.heroStatLabel, { color: colors.textSecondary }]}>Units</Text>
              </View>
              <View style={[styles.heroStatDivider, { backgroundColor: colors.border }]} />
              <View style={styles.heroStat}>
                <Text style={[styles.heroStatValue, { color: subject.color }]}>{completedTopics}/{totalTopics}</Text>
                <Text style={[styles.heroStatLabel, { color: colors.textSecondary }]}>Topics</Text>
              </View>
              <View style={[styles.heroStatDivider, { backgroundColor: colors.border }]} />
              <View style={styles.heroStat}>
                <Text style={[styles.heroStatValue, { color: subject.color }]}>{Math.round(overallProgress * 100)}%</Text>
                <Text style={[styles.heroStatLabel, { color: colors.textSecondary }]}>Complete</Text>
              </View>
            </View>

            {/* Overall Progress */}
            <View style={styles.progressSection}>
              <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                <View style={[styles.progressBarFill, { width: `${overallProgress * 100}%`, backgroundColor: subject.color }]} />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: subject.color + '15', borderColor: subject.color + '30' }]}
            onPress={() => router.push('/quiz')}>
            <Ionicons name="flash" size={20} color={subject.color} />
            <Text style={[styles.actionText, { color: subject.color }]}>Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.accentSecondary + '15', borderColor: colors.accentSecondary + '30' }]}
            onPress={() => router.push('/notes')}>
            <Ionicons name="document-text" size={20} color={colors.accentSecondary} />
            <Text style={[styles.actionText, { color: colors.accentSecondary }]}>Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.success + '15', borderColor: colors.success + '30' }]}
            onPress={() => router.push('/study/timer')}>
            <Ionicons name="timer" size={20} color={colors.success} />
            <Text style={[styles.actionText, { color: colors.success }]}>Study</Text>
          </TouchableOpacity>
        </View>

        {/* Units */}
        <View style={styles.unitsSection}>
          <Text style={[styles.unitsTitle, { color: colors.text }]}>Units</Text>
          {subject.units.map((unit, index) => {
            const unitProgress = unit.totalTopics > 0 ? unit.completedTopics / unit.totalTopics : 0;
            return (
              <TouchableOpacity key={unit.id}
                style={[styles.unitCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => router.push(`/subject/unit?subjectId=${subject.id}&unitId=${unit.id}`)}>
                <LinearGradient colors={[subject.color + '08', 'transparent']} style={styles.unitGradient}>
                  <View style={styles.unitHeader}>
                    <View style={[styles.unitNumber, { backgroundColor: subject.color + '20' }]}>
                      <Text style={[styles.unitNumberText, { color: subject.color }]}>{index + 1}</Text>
                    </View>
                    <View style={styles.unitInfo}>
                      <Text style={[styles.unitTitle, { color: colors.text }]}>{unit.title}</Text>
                      <Text style={[styles.unitMeta, { color: colors.textSecondary }]}>
                        {unit.completedTopics}/{unit.totalTopics} topics · {unit.questionsAttempted}/{unit.totalQuestions} questions
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                  </View>
                  <View style={[styles.unitProgressBar, { backgroundColor: colors.border }]}>
                    <View style={[styles.unitProgressFill, { width: `${unitProgress * 100}%`, backgroundColor: subject.color }]} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Video Lectures */}
        {SubjectVideos[subject.id] && SubjectVideos[subject.id].length > 0 && (
          <View style={styles.videosSection}>
            <View style={styles.videosSectionHeader}>
              <Text style={[styles.unitsTitle, { color: colors.text }]}>Video Lectures</Text>
              <TouchableOpacity onPress={() => router.push('/videos')}>
                <Text style={[styles.seeAllText, { color: subject.color }]}>See All</Text>
              </TouchableOpacity>
            </View>
            {SubjectVideos[subject.id].slice(0, 3).map((video, index) => (
              <TouchableOpacity key={video.id}
                style={[styles.videoCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => Linking.openURL(video.url)}>
                <LinearGradient colors={[subject.color + '08', 'transparent']} style={styles.videoCardGradient}>
                  <View style={styles.videoThumbnail}>
                    <Ionicons name="play-circle" size={32} color={subject.color} />
                  </View>
                  <View style={styles.videoInfo}>
                    <Text style={[styles.videoNumber, { color: subject.color }]}>#{index + 1}</Text>
                    <Text style={[styles.videoTitle, { color: colors.text }]} numberOfLines={2}>{video.title}</Text>
                    <Text style={[styles.videoChannel, { color: colors.textSecondary }]}>{video.channel} · {video.duration}</Text>
                  </View>
                  <Ionicons name="open-outline" size={16} color={colors.textSecondary} />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  errorText: { fontSize: 18 },
  header: { paddingHorizontal: 20, paddingTop: 60, flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  heroSection: { marginTop: 10 },
  heroGradient: { paddingHorizontal: 24, paddingBottom: 24 },
  heroIcon: { fontSize: 48, marginBottom: 12 },
  heroName: { fontSize: 26, fontWeight: '900', marginBottom: 6 },
  heroDesc: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  heroStats: { flexDirection: 'row', gap: 24, alignItems: 'center', marginBottom: 16 },
  heroStat: { alignItems: 'center' },
  heroStatValue: { fontSize: 20, fontWeight: '800' },
  heroStatLabel: { fontSize: 11, marginTop: 2 },
  heroStatDivider: { width: 1, height: 28 },
  progressSection: {},
  progressBarBg: { height: 8, borderRadius: 4 },
  progressBarFill: { height: 8, borderRadius: 4 },
  actions: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginVertical: 20 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12, borderWidth: 1 },
  actionText: { fontSize: 13, fontWeight: '700' },
  unitsSection: { paddingHorizontal: 20 },
  unitsTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  unitCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 10 },
  unitGradient: { padding: 16 },
  unitHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  unitNumber: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  unitNumberText: { fontSize: 16, fontWeight: '800' },
  unitInfo: { flex: 1 },
  unitTitle: { fontSize: 14, fontWeight: '700', marginBottom: 3 },
  unitMeta: { fontSize: 11 },
  unitProgressBar: { height: 4, borderRadius: 2, marginTop: 14 },
  unitProgressFill: { height: 4, borderRadius: 2 },
  videosSection: { paddingHorizontal: 20, marginTop: 28 },
  videosSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  seeAllText: { fontSize: 13, fontWeight: '700' },
  videoCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 10 },
  videoCardGradient: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  videoThumbnail: { width: 60, height: 44, borderRadius: 8, backgroundColor: '#0A0C10', alignItems: 'center', justifyContent: 'center' },
  videoInfo: { flex: 1 },
  videoNumber: { fontSize: 10, fontWeight: '800', marginBottom: 2 },
  videoTitle: { fontSize: 13, fontWeight: '700', lineHeight: 17, marginBottom: 3 },
  videoChannel: { fontSize: 11 },
});
