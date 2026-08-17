import React, { useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useApp } from '../hooks/useApp';

interface SubjectOption {
  id: string;
  label: string;
  color: string;
}

const ALL_SUBJECTS: SubjectOption[] = [
  { id: 'all', label: 'All', color: '#8892A4' },
  { id: 'os', label: 'OS', color: '#00E5FF' },
  { id: 'dbms', label: 'DBMS', color: '#7C4DFF' },
  { id: 'networking', label: 'Networking', color: '#00E676' },
  { id: 'c', label: 'C', color: '#FFD600' },
  { id: 'web', label: 'Web', color: '#FF5252' },
  { id: 'math', label: 'Math', color: '#BB86FC' },
  { id: 'physics', label: 'Physics', color: '#03DAC6' },
  { id: 'chemistry', label: 'Chemistry', color: '#CF6679' },
  { id: 'comm', label: 'Comm', color: '#FFAB40' },
];

interface Props {
  selected: string;
  onSelect: (subject: string) => void;
  showAll?: boolean;
}

export default function SubjectSelector({ selected, onSelect, showAll = true }: Props) {
  const { colors } = useApp();
  const subjects = showAll ? ALL_SUBJECTS : ALL_SUBJECTS.filter(s => s.id !== 'all');

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {subjects.map((subject) => {
        const isActive = selected === subject.id;
        return (
          <TouchableOpacity
            key={subject.id}
            style={[
              styles.pill,
              {
                backgroundColor: isActive ? subject.color + '25' : colors.card,
                borderColor: isActive ? subject.color : colors.border,
              },
            ]}
            onPress={() => onSelect(subject.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.dot, { backgroundColor: subject.color }]} />
            <Text
              style={[
                styles.label,
                { color: isActive ? subject.color : colors.textSecondary },
              ]}
            >
              {subject.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 8,
    paddingVertical: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
