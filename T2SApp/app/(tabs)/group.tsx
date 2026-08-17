import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../src/hooks/useApp';
import { Challenges } from '../../src/data';
import { Ionicons } from '@expo/vector-icons';

function ChallengeCard({ challenge, colors }: { challenge: any; colors: any }) {
  const progress = challenge.progress / challenge.total;
  return (
    <View style={[styles.challengeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.challengeHeader}>
        <Ionicons name={challenge.type === 'group' ? 'people' : 'person'} size={20} color={colors.accent} />
        <View style={styles.challengeInfo}>
          <Text style={[styles.challengeTitle, { color: colors.text }]}>{challenge.title}</Text>
          <Text style={[styles.challengeDesc, { color: colors.textSecondary }]}>{challenge.description}</Text>
        </View>
      </View>
      <View style={styles.challengeProgress}>
        <View style={[styles.challengeBarBg, { backgroundColor: colors.border }]}>
          <View style={[styles.challengeBarFill, { width: `${progress * 100}%`, backgroundColor: colors.accent }]} />
        </View>
        <Text style={[styles.challengePoints, { color: colors.accent }]}>+{challenge.points} pts</Text>
      </View>
      <View style={[styles.challengeFooter, { borderTopColor: colors.border }]}>
        <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
        <Text style={[styles.challengeDuration, { color: colors.textSecondary }]}>{challenge.duration}</Text>
        <Text style={[styles.challengeProgressText, { color: colors.textSecondary }]}>{challenge.progress}/{challenge.total}</Text>
      </View>
    </View>
  );
}

export default function GroupScreen() {
  const { colors } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Group Room</Text>
          <Text style={[styles.title, { color: colors.text }]}>Study Together</Text>
        </View>

        {/* Group Stats */}
        <View style={[styles.groupStats, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <LinearGradient colors={[colors.accent + '15', colors.accentSecondary + '10']} style={styles.groupStatsGradient}>
            <Text style={[styles.groupStatsTitle, { color: colors.textSecondary }]}>GROUP PROGRESS</Text>
            <Text style={[styles.groupStatsValue, { color: colors.accent }]}>68%</Text>
            <View style={styles.groupStatsRow}>
              <View style={styles.groupStatItem}>
                <Text style={[styles.groupStatValue, { color: colors.text }]}>153</Text>
                <Text style={[styles.groupStatLabel, { color: colors.textSecondary }]}>Topics Done</Text>
              </View>
              <View style={styles.groupStatItem}>
                <Text style={[styles.groupStatValue, { color: colors.text }]}>240</Text>
                <Text style={[styles.groupStatLabel, { color: colors.textSecondary }]}>Total Topics</Text>
              </View>
              <View style={styles.groupStatItem}>
                <Text style={[styles.groupStatValue, { color: colors.text }]}>325</Text>
                <Text style={[styles.groupStatLabel, { color: colors.textSecondary }]}>Quiz Score</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Study Groups */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Study Groups</Text>
          <View style={styles.groupsGrid}>
            <TouchableOpacity style={[styles.groupItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.groupIcon, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="people" size={28} color={colors.accent} />
              </View>
              <Text style={[styles.groupName, { color: colors.text }]}>OS Study Group</Text>
              <Text style={[styles.groupMembers, { color: colors.textSecondary }]}>3 members</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.groupItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.groupIcon, { backgroundColor: colors.accentSecondary + '20' }]}>
                <Ionicons name="people" size={28} color={colors.accentSecondary} />
              </View>
              <Text style={[styles.groupName, { color: colors.text }]}>DBMS Revision</Text>
              <Text style={[styles.groupMembers, { color: colors.textSecondary }]}>2 members</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.groupItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.groupIcon, { backgroundColor: colors.success + '20' }]}>
                <Ionicons name="people" size={28} color={colors.success} />
              </View>
              <Text style={[styles.groupName, { color: colors.text }]}>C Programming</Text>
              <Text style={[styles.groupMembers, { color: colors.textSecondary }]}>3 members</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Challenges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Challenges</Text>
            <TouchableOpacity>
              <Text style={[styles.viewAll, { color: colors.accent }]}>View All</Text>
            </TouchableOpacity>
          </View>
          {Challenges.map(c => (
            <ChallengeCard key={c.id} challenge={c} colors={colors} />
          ))}
        </View>

        {/* Shared Notes */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Shared Space</Text>
          <View style={styles.sharedGrid}>
            <TouchableOpacity style={[styles.sharedItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="document-text" size={28} color={colors.accent} />
              <Text style={[styles.sharedLabel, { color: colors.text }]}>Shared Notes</Text>
              <Text style={[styles.sharedCount, { color: colors.textSecondary }]}>12 notes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sharedItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="checkmark-circle" size={28} color={colors.success} />
              <Text style={[styles.sharedLabel, { color: colors.text }]}>Task List</Text>
              <Text style={[styles.sharedCount, { color: colors.textSecondary }]}>8 tasks</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sharedItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="library" size={28} color={colors.accentSecondary} />
              <Text style={[styles.sharedLabel, { color: colors.text }]}>Resources</Text>
              <Text style={[styles.sharedCount, { color: colors.textSecondary }]}>24 files</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sharedItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="trophy" size={28} color={colors.warning} />
              <Text style={[styles.sharedLabel, { color: colors.text }]}>Leaderboard</Text>
              <Text style={[styles.sharedCount, { color: colors.textSecondary }]}>Top 3</Text>
            </TouchableOpacity>
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
  groupStats: { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 8 },
  groupStatsGradient: { padding: 24, alignItems: 'center' },
  groupStatsTitle: { fontSize: 12, letterSpacing: 2, fontWeight: '600' },
  groupStatsValue: { fontSize: 52, fontWeight: '900', marginVertical: 4 },
  groupStatsRow: { flexDirection: 'row', gap: 32, marginTop: 12 },
  groupStatItem: { alignItems: 'center' },
  groupStatValue: { fontSize: 18, fontWeight: '800' },
  groupStatLabel: { fontSize: 11, marginTop: 2 },
  section: { paddingHorizontal: 20, marginTop: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  viewAll: { fontSize: 14, fontWeight: '600' },
  friendCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 12 },
  challengeCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 12 },
  challengeHeader: { flexDirection: 'row', gap: 12, marginBottom: 14, alignItems: 'flex-start' },
  challengeInfo: { flex: 1 },
  challengeTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  challengeDesc: { fontSize: 12, lineHeight: 16 },
  challengeProgress: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  challengeBarBg: { flex: 1, height: 6, borderRadius: 3 },
  challengeBarFill: { height: 6, borderRadius: 3 },
  challengePoints: { fontSize: 12, fontWeight: '800', minWidth: 50 },
  challengeFooter: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
  challengeDuration: { fontSize: 12, flex: 1 },
  challengeProgressText: { fontSize: 12, fontWeight: '600' },
  sharedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  sharedItem: { width: '47%', borderRadius: 14, borderWidth: 1, padding: 16, alignItems: 'center' },
  sharedLabel: { fontSize: 13, fontWeight: '600', marginTop: 10, marginBottom: 2 },
  sharedCount: { fontSize: 11 },
  groupsGrid: { gap: 12 },
  groupItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 14, borderWidth: 1 },
  groupIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  groupName: { flex: 1, fontSize: 14, fontWeight: '700' },
  groupMembers: { fontSize: 12 },
});
