import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../src/hooks/useApp';
import { Semester3Subjects, BackPaperSubjects } from '../src/data';
import { SubjectVideos } from '../src/data/videos';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const allSubjects = [...Semester3Subjects, ...BackPaperSubjects];

export default function VideosScreen() {
  const { colors } = useApp();
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState('os');
  const videos = SubjectVideos[selectedSubject] || [];
  const subject = allSubjects.find(s => s.id === selectedSubject);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.title, { color: colors.text }]}>Video Lectures</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Best tutorials for every subject</Text>
          </View>
        </View>

        {/* Subject Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectScroll}>
          {allSubjects.map(s => (
            <TouchableOpacity key={s.id}
              style={[styles.subjectChip, {
                backgroundColor: selectedSubject === s.id ? s.color + '20' : colors.card,
                borderColor: selectedSubject === s.id ? s.color : colors.border,
              }]}
              onPress={() => setSelectedSubject(s.id)}>
              <Text style={styles.chipIcon}>{s.icon}</Text>
              <Text style={[styles.chipText, { color: selectedSubject === s.id ? s.color : colors.textSecondary }]}>
                {s.shortName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Subject Info */}
        {subject && (
          <LinearGradient colors={[subject.color + '12', 'transparent']} style={[styles.subjectInfo, { borderColor: colors.border }]}>
            <Text style={[styles.subjectInfoName, { color: colors.text }]}>{subject.name}</Text>
            <Text style={[styles.subjectInfoCount, { color: subject.color }]}>{videos.length} Videos Available</Text>
          </LinearGradient>
        )}

        {/* Video List */}
        <View style={styles.videoList}>
          {videos.map((video, index) => (
            <TouchableOpacity key={video.id}
              style={[styles.videoCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => Linking.openURL(video.url)}>
              <LinearGradient colors={[subject?.color + '08', 'transparent']} style={styles.videoGradient}>
                <View style={styles.videoThumbnail}>
                  <Ionicons name="play-circle" size={40} color={subject?.color || colors.accent} />
                  <View style={[styles.videoDuration, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.videoDurationText, { color: colors.text }]}>{video.duration}</Text>
                  </View>
                </View>
                <View style={styles.videoInfo}>
                  <Text style={[styles.videoNumber, { color: subject?.color || colors.accent }]}>#{index + 1}</Text>
                  <Text style={[styles.videoTitle, { color: colors.text }]} numberOfLines={2}>{video.title}</Text>
                  <Text style={[styles.videoChannel, { color: colors.textSecondary }]}>{video.channel}</Text>
                  <Text style={[styles.videoDesc, { color: colors.textSecondary }]} numberOfLines={2}>{video.description}</Text>
                </View>
                <Ionicons name="open-outline" size={18} color={colors.textSecondary} style={styles.videoLink} />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

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
  subjectScroll: { paddingHorizontal: 20, marginBottom: 20 },
  subjectChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, marginRight: 10 },
  chipIcon: { fontSize: 16 },
  chipText: { fontSize: 13, fontWeight: '700' },
  subjectInfo: { marginHorizontal: 20, padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 20 },
  subjectInfoName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  subjectInfoCount: { fontSize: 13, fontWeight: '600' },
  videoList: { paddingHorizontal: 20, gap: 14 },
  videoCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  videoGradient: { padding: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  videoThumbnail: { width: 100, height: 70, borderRadius: 10, backgroundColor: '#0A0C10', alignItems: 'center', justifyContent: 'center' },
  videoDuration: { position: 'absolute', bottom: 4, right: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  videoDurationText: { fontSize: 9, fontWeight: '700' },
  videoInfo: { flex: 1 },
  videoNumber: { fontSize: 11, fontWeight: '800', marginBottom: 2 },
  videoTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4, lineHeight: 18 },
  videoChannel: { fontSize: 11, marginBottom: 4 },
  videoDesc: { fontSize: 11, lineHeight: 15 },
  videoLink: { marginTop: 4 },
});
