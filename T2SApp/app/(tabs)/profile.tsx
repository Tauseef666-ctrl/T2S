import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useApp } from '../../src/hooks/useApp';
import { Colors, ThemeName } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';

const ThemeOptions: { name: ThemeName; label: string; colors: string[] }[] = [
  { name: 'cyberNight', label: 'Cyber Night', colors: ['#00E5FF', '#7C4DFF'] },
  { name: 'obsidian', label: 'Obsidian', colors: ['#C0C0C0', '#4A90D9'] },
  { name: 'midnightAurora', label: 'Midnight Aurora', colors: ['#00E5FF', '#BB86FC'] },
  { name: 'minimalDark', label: 'Minimal Dark', colors: ['#FFFFFF', '#4A6FA5'] },
];

export default function ProfileScreen() {
  const { colors, themeName, setTheme, soundEnabled, toggleSound } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Settings</Text>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.profileAvatar, { backgroundColor: colors.accent + '20', borderColor: colors.accent }]}>
            <Text style={[styles.profileAvatarText, { color: colors.accent }]}>T2S</Text>
          </View>
          <Text style={[styles.profileName, { color: colors.text }]}>T2S Study Group</Text>
          <Text style={[styles.profileInfo, { color: colors.textSecondary }]}>Diploma CSE · BTEUP · Semester 3</Text>
          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={[styles.profileStatValue, { color: colors.accent }]}>68%</Text>
              <Text style={[styles.profileStatLabel, { color: colors.textSecondary }]}>Overall</Text>
            </View>
            <View style={[styles.profileStatDivider, { backgroundColor: colors.border }]} />
            <View style={styles.profileStat}>
              <Text style={[styles.profileStatValue, { color: colors.accentSecondary }]}>9</Text>
              <Text style={[styles.profileStatLabel, { color: colors.textSecondary }]}>Subjects</Text>
            </View>
            <View style={[styles.profileStatDivider, { backgroundColor: colors.border }]} />
            <View style={styles.profileStat}>
              <Text style={[styles.profileStatValue, { color: colors.success }]}>42</Text>
              <Text style={[styles.profileStatLabel, { color: colors.textSecondary }]}>Study Days</Text>
            </View>
          </View>
        </View>

        {/* Theme Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Theme</Text>
          <View style={styles.themeGrid}>
            {ThemeOptions.map(theme => (
              <TouchableOpacity key={theme.name}
                style={[styles.themeOption, { backgroundColor: colors.card, borderColor: themeName === theme.name ? colors.accent : colors.border },
                  themeName === theme.name && styles.themeActive]}
                onPress={() => setTheme(theme.name)}>
                <View style={styles.themeColors}>
                  {theme.colors.map((c, i) => (
                    <View key={i} style={[styles.themeColorDot, { backgroundColor: c }]} />
                  ))}
                </View>
                <Text style={[styles.themeLabel, { color: themeName === theme.name ? colors.accent : colors.text }]}>{theme.label}</Text>
                {themeName === theme.name && <Ionicons name="checkmark-circle" size={18} color={colors.accent} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>

          <View style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="volume-high" size={20} color={colors.accent} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Sound Effects</Text>
            </View>
            <Switch value={soundEnabled} onValueChange={toggleSound}
              trackColor={{ false: colors.border, true: colors.accent + '50' }}
              thumbColor={soundEnabled ? colors.accent : colors.textSecondary} />
          </View>

          <View style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications" size={20} color={colors.accentSecondary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Notifications</Text>
            </View>
            <Switch value={true} trackColor={{ false: colors.border, true: colors.accentSecondary + '50' }}
              thumbColor={colors.accentSecondary} />
          </View>

          <View style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="cloud-offline" size={20} color={colors.success} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Offline Mode</Text>
            </View>
            <Switch value={true} trackColor={{ false: colors.border, true: colors.success + '50' }}
              thumbColor={colors.success} />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <View style={[styles.aboutCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Version</Text>
              <Text style={[styles.aboutValue, { color: colors.text }]}>1.0.0</Text>
            </View>
            <View style={[styles.aboutDivider, { backgroundColor: colors.border }]} />
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Build</Text>
              <Text style={[styles.aboutValue, { color: colors.text }]}>2026.08.17</Text>
            </View>
            <View style={[styles.aboutDivider, { backgroundColor: colors.border }]} />
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Board</Text>
              <Text style={[styles.aboutValue, { color: colors.text }]}>BTEUP</Text>
            </View>
            <View style={[styles.aboutDivider, { backgroundColor: colors.border }]} />
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Course</Text>
              <Text style={[styles.aboutValue, { color: colors.text }]}>Diploma CSE (2-Year Lateral)</Text>
            </View>
          </View>
        </View>

        {/* Study Goals */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Study Goals</Text>
          {[
            { goal: 'Complete Semester 3 syllabus', progress: 68, color: '#00E5FF', icon: 'school' },
            { goal: 'Clear all back papers', progress: 45, color: '#FF5252', icon: 'refresh-circle' },
            { goal: 'Practice 100 C programs', progress: 72, color: '#FFD600', icon: 'code-slash' },
            { goal: 'Score 80%+ in finals', progress: 0, color: '#00E676', icon: 'trophy' },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={[styles.goalItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.goalIcon, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={[styles.goalName, { color: colors.text }]}>{item.goal}</Text>
                <View style={styles.goalProgressRow}>
                  <View style={[styles.goalBarBg, { backgroundColor: colors.border }]}>
                    <View style={[styles.goalBarFill, { width: `${item.progress}%`, backgroundColor: item.color }]} />
                  </View>
                  <Text style={[styles.goalPercent, { color: item.color }]}>{item.progress}%</Text>
                </View>
              </View>
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
  scroll: { flex: 1, paddingTop: 60 },
  header: { paddingHorizontal: 20, marginBottom: 24 },
  greeting: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  title: { fontSize: 28, fontWeight: '800' },
  profileCard: { marginHorizontal: 20, borderRadius: 20, borderWidth: 1, padding: 24, alignItems: 'center', marginBottom: 8 },
  profileAvatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 3, marginBottom: 14 },
  profileAvatarText: { fontSize: 24, fontWeight: '900' },
  profileName: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  profileInfo: { fontSize: 13, marginBottom: 20 },
  profileStats: { flexDirection: 'row', gap: 24, alignItems: 'center' },
  profileStat: { alignItems: 'center' },
  profileStatValue: { fontSize: 22, fontWeight: '800' },
  profileStatLabel: { fontSize: 11, marginTop: 2 },
  profileStatDivider: { width: 1, height: 30 },
  section: { paddingHorizontal: 20, marginTop: 28 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  themeGrid: { gap: 10 },
  themeOption: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 16, borderRadius: 14, borderWidth: 1,
  },
  themeActive: { borderWidth: 2 },
  themeColors: { flexDirection: 'row', gap: 4 },
  themeColorDot: { width: 16, height: 16, borderRadius: 8 },
  themeLabel: { flex: 1, fontSize: 14, fontWeight: '600' },
  settingItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 10,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { fontSize: 14, fontWeight: '600' },
  aboutCard: { borderRadius: 14, borderWidth: 1, padding: 16 },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  aboutLabel: { fontSize: 13 },
  aboutValue: { fontSize: 13, fontWeight: '600' },
  aboutDivider: { height: 1 },
  goalItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 10 },
  goalIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  goalInfo: { flex: 1 },
  goalName: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  goalProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  goalBarBg: { flex: 1, height: 6, borderRadius: 3 },
  goalBarFill: { height: 6, borderRadius: 3 },
  goalPercent: { fontSize: 12, fontWeight: '800', minWidth: 36 },
});
