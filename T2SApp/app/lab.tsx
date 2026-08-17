import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../src/hooks/useApp';
import { CProgramExamples } from '../src/data';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function LabScreen() {
  const { colors } = useApp();
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.title, { color: colors.text }]}>C Programming Lab</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Futuristic Terminal Interface</Text>
          </View>
        </View>

        {/* Terminal Header */}
        <LinearGradient colors={[colors.accent + '10', colors.tertiary]} style={[styles.terminal, { borderColor: colors.accent + '30' }]}>
          <View style={styles.terminalHeader}>
            <View style={styles.terminalDots}>
              <View style={[styles.dot, { backgroundColor: '#FF5F57' }]} />
              <View style={[styles.dot, { backgroundColor: '#FEBC2E' }]} />
              <View style={[styles.dot, { backgroundColor: '#28C840' }]} />
            </View>
            <Text style={[styles.terminalTitle, { color: colors.textSecondary }]}>T2S Terminal v1.0</Text>
          </View>
          <View style={[styles.terminalBody, { backgroundColor: colors.primary }]}>
            <Text style={[styles.terminalPrompt, { color: colors.accent }]}>$ t2s-lab --ready</Text>
            <Text style={[styles.terminalOutput, { color: colors.textSecondary }]}>C Programming Environment Loaded</Text>
            <Text style={[styles.terminalOutput, { color: colors.textSecondary }]}>Compiler: GCC · Editor: T2S Code Editor</Text>
            <Text style={[styles.terminalPrompt, { color: colors.accent }]}>$ _</Text>
          </View>
        </LinearGradient>

        {/* Example Programs */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Example Programs</Text>
          {CProgramExamples.map((program, index) => (
            <TouchableOpacity key={index}
              style={[styles.programCard, { backgroundColor: colors.card, borderColor: selectedProgram === index ? colors.accent : colors.border }]}
              onPress={() => setSelectedProgram(selectedProgram === index ? null : index)}>
              <View style={styles.programHeader}>
                <Ionicons name="code-slash" size={20} color={colors.accent} />
                <Text style={[styles.programTitle, { color: colors.text }]}>{program.title}</Text>
                <Ionicons name={selectedProgram === index ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSecondary} />
              </View>

              {selectedProgram === index && (
                <View style={styles.programContent}>
                  <View style={[styles.codeBlock, { backgroundColor: colors.primary, borderColor: colors.border }]}>
                    <View style={styles.codeHeader}>
                      <Text style={[styles.codeLang, { color: colors.accent }]}>C</Text>
                      <TouchableOpacity style={[styles.copyBtn, { backgroundColor: colors.accent + '20' }]}
                        onPress={() => Alert.alert('Copied!', 'Code copied to clipboard')}>
                        <Ionicons name="copy" size={14} color={colors.accent} />
                        <Text style={[styles.copyText, { color: colors.accent }]}>Copy</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.codeText, { color: colors.text }]}>{program.code}</Text>
                  </View>
                  <View style={[styles.outputBlock, { backgroundColor: colors.tertiary, borderColor: colors.border }]}>
                    <Text style={[styles.outputLabel, { color: colors.success }]}>Output:</Text>
                    <Text style={[styles.outputText, { color: colors.text }]}>{program.output}</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Practice Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Practice Problems</Text>
          {[
            { title: 'Write a program to swap two numbers without temp', difficulty: 'Easy', points: 50 },
            { title: 'Implement bubble sort using pointers', difficulty: 'Medium', points: 100 },
            { title: 'Create a linked list and reverse it', difficulty: 'Hard', points: 200 },
            { title: 'Write a program for matrix multiplication', difficulty: 'Medium', points: 100 },
            { title: 'Implement binary search using recursion', difficulty: 'Hard', points: 200 },
          ].map((problem, index) => (
            <TouchableOpacity key={index} style={[styles.problemCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.problemLeft}>
                <View style={[styles.problemNumber, { backgroundColor: colors.accent + '20' }]}>
                  <Text style={[styles.problemNumberText, { color: colors.accent }]}>{index + 1}</Text>
                </View>
                <View style={styles.problemInfo}>
                  <Text style={[styles.problemTitle, { color: colors.text }]}>{problem.title}</Text>
                  <View style={styles.problemMeta}>
                    <Text style={[styles.problemDifficulty, {
                      color: problem.difficulty === 'Easy' ? colors.success : problem.difficulty === 'Medium' ? colors.warning : colors.error
                    }]}>{problem.difficulty}</Text>
                    <Text style={[styles.problemPoints, { color: colors.accent }]}>+{problem.points} pts</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={[styles.problemBtn, { backgroundColor: colors.accent + '15' }]}>
                <Ionicons name="play" size={16} color={colors.accent} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <LinearGradient colors={[colors.warning + '10', 'transparent']} style={[styles.tipCard, { borderColor: colors.warning + '30' }]}>
            <Ionicons name="bulb" size={22} color={colors.warning} />
            <View style={styles.tipContent}>
              <Text style={[styles.tipTitle, { color: colors.text }]}>C Programming Tips</Text>
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                Always initialize pointers before use. Use valgrind to detect memory leaks. Practice pointer arithmetic daily for mastery.
              </Text>
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, gap: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1 },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 12 },
  terminal: { marginHorizontal: 20, borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 24 },
  terminalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#2A2D35' },
  terminalDots: { flexDirection: 'row', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  terminalTitle: { fontSize: 11, fontWeight: '600' },
  terminalBody: { padding: 16 },
  terminalPrompt: { fontSize: 13, fontFamily: 'Courier', marginBottom: 4 },
  terminalOutput: { fontSize: 12, fontFamily: 'Courier', marginBottom: 4 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  programCard: { borderRadius: 14, borderWidth: 1, marginBottom: 10, overflow: 'hidden' },
  programHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  programTitle: { flex: 1, fontSize: 14, fontWeight: '600' },
  programContent: { padding: 16, paddingTop: 0 },
  codeBlock: { borderRadius: 10, borderWidth: 1, overflow: 'hidden', marginBottom: 10 },
  codeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#2A2D35' },
  codeLang: { fontSize: 12, fontWeight: '800' },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  copyText: { fontSize: 11, fontWeight: '600' },
  codeText: { fontSize: 12, fontFamily: 'Courier', padding: 14, lineHeight: 18 },
  outputBlock: { borderRadius: 10, borderWidth: 1, padding: 12 },
  outputLabel: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
  outputText: { fontSize: 13, fontFamily: 'Courier' },
  problemCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  problemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  problemNumber: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  problemNumberText: { fontSize: 14, fontWeight: '800' },
  problemInfo: { flex: 1 },
  problemTitle: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  problemMeta: { flexDirection: 'row', gap: 12 },
  problemDifficulty: { fontSize: 11, fontWeight: '600' },
  problemPoints: { fontSize: 11, fontWeight: '700' },
  problemBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  tipCard: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 14, borderWidth: 1, alignItems: 'flex-start' },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  tipText: { fontSize: 12, lineHeight: 17 },
});
