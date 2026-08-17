import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/hooks/useApp';
import { Ionicons } from '@expo/vector-icons';

type TimerMode = 'focus' | 'short' | 'long';

const TimerPresets: Record<TimerMode, { duration: number; label: string }> = {
  focus: { duration: 25 * 60, label: 'Focus Session' },
  short: { duration: 5 * 60, label: 'Short Break' },
  long: { duration: 15 * 60, label: 'Long Break' },
};

export default function TimerScreen() {
  const { colors } = useApp();
  const router = useRouter();
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(TimerPresets.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const progressAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
        const totalTime = TimerPresets[mode].duration;
        progressAnim.setValue(timeLeft / totalTime);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === 'focus') setSessionsCompleted(s => s + 1);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isRunning, timeLeft, mode]);

  useEffect(() => {
    if (isRunning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRunning]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalTime = TimerPresets[mode].duration;
  const progress = timeLeft / totalTime;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  const handleModeChange = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(TimerPresets[newMode].duration);
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TimerPresets[mode].duration);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Focus Timer</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Mode Selector */}
      <View style={[styles.modeSelector, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
        {(Object.keys(TimerPresets) as TimerMode[]).map(m => (
          <TouchableOpacity key={m} style={[styles.modeBtn, mode === m && { backgroundColor: colors.accent + '20' }]}
            onPress={() => handleModeChange(m)}>
            <Text style={[styles.modeText, { color: mode === m ? colors.accent : colors.textSecondary }]}>
              {TimerPresets[m].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timer Circle */}
      <View style={styles.timerContainer}>
        <Animated.View style={[styles.timerOuter, { transform: [{ scale: pulseAnim }] }]}>
          <View style={[styles.timerCircle, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* SVG-like progress ring using View */}
            <View style={[styles.progressRing, { borderColor: isRunning ? colors.accent : colors.border }]}>
              <View style={[styles.progressInner, {
                borderColor: mode === 'focus' ? colors.accent : mode === 'short' ? colors.success : colors.accentSecondary
              }]} />
            </View>

            <Text style={[styles.timerLabel, { color: colors.textSecondary }]}>{TimerPresets[mode].label}</Text>
            <Text style={[styles.timerValue, { color: colors.text }]}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </Text>
            <Text style={[styles.timerStatus, { color: isRunning ? colors.accent : colors.textSecondary }]}>
              {isRunning ? 'In Progress' : timeLeft === 0 ? 'Complete!' : 'Paused'}
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={[styles.controlBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={resetTimer}>
          <Ionicons name="refresh" size={22} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.playBtn, { backgroundColor: isRunning ? colors.error : colors.accent }]}
          onPress={toggleTimer}>
          <Ionicons name={isRunning ? 'pause' : 'play'} size={32} color="#050505" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.controlBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => {}}>
          <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Session Stats */}
      <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.statItem}>
          <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
          <Text style={[styles.statValue, { color: colors.text }]}>{sessionsCompleted}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sessions</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Ionicons name="flame" size={20} color={colors.warning} />
          <Text style={[styles.statValue, { color: colors.text }]}>{sessionsCompleted * 25}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Minutes</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Ionicons name="trophy" size={20} color={colors.accentSecondary} />
          <Text style={[styles.statValue, { color: colors.text }]}>{sessionsCompleted * 50}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Points</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800' },
  modeSelector: { flexDirection: 'row', marginHorizontal: 20, borderRadius: 12, padding: 4, borderWidth: 1, marginBottom: 40 },
  modeBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  modeText: { fontSize: 12, fontWeight: '700' },
  timerContainer: { alignItems: 'center', marginBottom: 40 },
  timerOuter: {},
  timerCircle: {
    width: 260, height: 260, borderRadius: 130, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  progressRing: {
    position: 'absolute', width: 240, height: 240, borderRadius: 120,
    borderWidth: 6, borderColor: '#00E5FF30',
  },
  progressInner: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    borderWidth: 6, borderColor: '#00E5FF',
  },
  timerLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  timerValue: { fontSize: 56, fontWeight: '900', letterSpacing: 2 },
  timerStatus: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24, marginBottom: 40 },
  controlBtn: { width: 52, height: 52, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  playBtn: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  statsCard: { flexDirection: 'row', marginHorizontal: 20, borderRadius: 16, borderWidth: 1, padding: 20, justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 4 },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 11 },
  statDivider: { width: 1, height: 40 },
});
