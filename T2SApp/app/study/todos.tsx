import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, Alert, Animated, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../src/hooks/useApp';
import { Ionicons } from '@expo/vector-icons';
import SubjectSelector from '../../src/components/SubjectSelector';
import EmptyState from '../../src/components/EmptyState';

type Priority = 'low' | 'medium' | 'high';

const PRIORITY_CONFIG: Record<Priority, { color: string; label: string }> = {
  low: { color: '#00E676', label: 'LOW' },
  medium: { color: '#FFD600', label: 'MED' },
  high: { color: '#FF5252', label: 'HIGH' },
};

const SUBJECTS = ['All', 'OS', 'DBMS', 'Networking', 'C', 'Web', 'Math', 'Physics', 'Chemistry', 'Comm'];
const SUBJECT_MAP: Record<string, string> = {
  All: 'all', OS: 'os', DBMS: 'dbms', Networking: 'networking',
  C: 'c', Web: 'web', Math: 'math', Physics: 'physics',
  Chemistry: 'chemistry', Comm: 'comm',
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isToday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d < new Date();
}

function TodoItem({ todo, colors, onToggle, onDelete }: {
  todo: any; colors: any; onToggle: () => void; onDelete: () => void;
}) {
  const translateX = useRef(new Animated.Value(0)).current;

  const panGesture = useRef({
    startX: 0,
  }).current;

  const handleTouchStart = (x: number) => {
    panGesture.startX = x;
  };

  const handleTouchEnd = (x: number) => {
    const dx = x - panGesture.startX;
    if (dx < -80) {
      onDelete();
    } else if (dx > 80) {
      onToggle();
    }
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
  };

  const priority = PRIORITY_CONFIG[todo.priority as Priority] || PRIORITY_CONFIG.medium;
  const dueLabel = formatDate(todo.dueDate);
  const overdue = isOverdue(todo.dueDate) && !isToday(todo.dueDate) && !todo.completed;

  return (
    <Animated.View style={{ transform: [{ translateX }] }}>
      <TouchableOpacity
        style={[styles.todoItem, { backgroundColor: colors.card, borderColor: colors.border },
          todo.completed && { opacity: 0.5 }]}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <TouchableOpacity onPress={onToggle} style={styles.checkbox}>
          <Ionicons
            name={todo.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={todo.completed ? colors.success : colors.textSecondary}
          />
        </TouchableOpacity>

        <View style={styles.todoContent}>
          <Text style={[styles.todoTitle, { color: colors.text }, todo.completed && styles.todoTitleDone]}>
            {todo.title}
          </Text>
          <View style={styles.todoMeta}>
            <View style={[styles.subjectPill, { backgroundColor: colors.accent + '15' }]}>
              <Text style={[styles.subjectPillText, { color: colors.accent }]}>{todo.subject?.toUpperCase()}</Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: priority.color + '20' }]}>
              <Text style={[styles.priorityText, { color: priority.color }]}>{priority.label}</Text>
            </View>
            {dueLabel ? (
              <Text style={[styles.dueDate, { color: overdue ? '#FF5252' : colors.textSecondary }]}>
                {dueLabel}
              </Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity onPress={onDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function StudyTodosScreen() {
  const { state, dispatch } = useApp();
  const { colors } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterSubject, setFilterSubject] = useState('all');

  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('os');
  const [newUnit, setNewUnit] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newDueDate, setNewDueDate] = useState('');

  const todos = state.studyTodos;
  const filteredTodos = filterSubject === 'all' ? todos : todos.filter(t => t.subject === filterSubject);

  const todayTodos = filteredTodos.filter(t => !t.completed && (isToday(t.dueDate) || isOverdue(t.dueDate)));
  const upcomingTodos = filteredTodos.filter(t => !t.completed && !isToday(t.dueDate) && !isOverdue(t.dueDate));
  const completedTodos = filteredTodos.filter(t => t.completed);

  const totalPending = todos.filter(t => !t.completed).length;
  const completedToday = todos.filter(t => t.completed).length;

  const handleAdd = () => {
    if (!newTitle.trim()) {
      Alert.alert('Error', 'Please enter a todo title');
      return;
    }
    dispatch({
      type: 'ADD_STUDY_TODO',
      payload: {
        id: `todo-${Date.now()}`,
        title: newTitle.trim(),
        subject: newSubject,
        unit: newUnit,
        priority: newPriority,
        dueDate: newDueDate || null,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    });
    setNewTitle('');
    setNewSubject('os');
    setNewUnit('');
    setNewPriority('medium');
    setNewDueDate('');
    setShowAddModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Study Planner</Text>
          <Text style={[styles.title, { color: colors.text }]}>My Todos</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="list" size={20} color={colors.accent} />
            <Text style={[styles.statValue, { color: colors.text }]}>{todos.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="time" size={20} color="#FFD600" />
            <Text style={[styles.statValue, { color: colors.text }]}>{totalPending}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.text }]}>{completedToday}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Done</Text>
          </View>
        </View>

        {/* Subject Filter */}
        <SubjectSelector selected={filterSubject} onSelect={setFilterSubject} />

        {/* Today's Tasks */}
        {todayTodos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="today" size={18} color="#FF5252" />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Today / Overdue</Text>
              <View style={[styles.countBadge, { backgroundColor: '#FF5252' + '20' }]}>
                <Text style={[styles.countText, { color: '#FF5252' }]}>{todayTodos.length}</Text>
              </View>
            </View>
            {todayTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                colors={colors}
                onToggle={() => dispatch({ type: 'TOGGLE_STUDY_TODO', payload: todo.id })}
                onDelete={() => dispatch({ type: 'DELETE_STUDY_TODO', payload: todo.id })}
              />
            ))}
          </View>
        )}

        {/* Upcoming Tasks */}
        {upcomingTodos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar" size={18} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming</Text>
              <View style={[styles.countBadge, { backgroundColor: colors.accent + '20' }]}>
                <Text style={[styles.countText, { color: colors.accent }]}>{upcomingTodos.length}</Text>
              </View>
            </View>
            {upcomingTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                colors={colors}
                onToggle={() => dispatch({ type: 'TOGGLE_STUDY_TODO', payload: todo.id })}
                onDelete={() => dispatch({ type: 'DELETE_STUDY_TODO', payload: todo.id })}
              />
            ))}
          </View>
        )}

        {/* Completed Tasks */}
        {completedTodos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="checkmark-done" size={18} color={colors.success} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Completed</Text>
              <View style={[styles.countBadge, { backgroundColor: colors.success + '20' }]}>
                <Text style={[styles.countText, { color: colors.success }]}>{completedTodos.length}</Text>
              </View>
            </View>
            {completedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                colors={colors}
                onToggle={() => dispatch({ type: 'TOGGLE_STUDY_TODO', payload: todo.id })}
                onDelete={() => dispatch({ type: 'DELETE_STUDY_TODO', payload: todo.id })}
              />
            ))}
          </View>
        )}

        {/* Empty State */}
        {todos.length === 0 && (
          <EmptyState
            icon="clipboard-outline"
            title="No Tasks Yet"
            message="Add your first study todo to start tracking your progress."
            actionLabel="Add First Task"
            onAction={() => setShowAddModal(true)}
          />
        )}

        {todos.length > 0 && filteredTodos.length === 0 && (
          <EmptyState
            icon="filter-outline"
            title="No Matching Tasks"
            message="No tasks match the selected subject filter."
          />
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.accent }]}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#000" />
      </TouchableOpacity>

      {/* Add Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>New Study Todo</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Title *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.primary, borderColor: colors.border, color: colors.text }]}
                placeholder="What do you need to study?"
                placeholderTextColor={colors.textSecondary}
                value={newTitle}
                onChangeText={setNewTitle}
              />

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Subject</Text>
              <SubjectSelector selected={newSubject} onSelect={setNewSubject} />

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Unit</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.primary, borderColor: colors.border, color: colors.text }]}
                placeholder="e.g. Unit 03"
                placeholderTextColor={colors.textSecondary}
                value={newUnit}
                onChangeText={setNewUnit}
              />

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Priority</Text>
              <View style={styles.priorityRow}>
                {(Object.keys(PRIORITY_CONFIG) as Priority[]).map(p => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.priorityBtn, {
                      backgroundColor: newPriority === p ? PRIORITY_CONFIG[p].color + '25' : colors.primary,
                      borderColor: newPriority === p ? PRIORITY_CONFIG[p].color : colors.border,
                    }]}
                    onPress={() => setNewPriority(p)}
                  >
                    <Text style={[styles.priorityBtnText, {
                      color: newPriority === p ? PRIORITY_CONFIG[p].color : colors.textSecondary,
                    }]}>{PRIORITY_CONFIG[p].label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Due Date (YYYY-MM-DD)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.primary, borderColor: colors.border, color: colors.text }]}
                placeholder="2026-08-20"
                placeholderTextColor={colors.textSecondary}
                value={newDueDate}
                onChangeText={setNewDueDate}
              />

              <TouchableOpacity
                style={[styles.addBtn, { backgroundColor: colors.accent }]}
                onPress={handleAdd}
                activeOpacity={0.8}
              >
                <Ionicons name="add-circle" size={20} color="#000" />
                <Text style={styles.addBtnText}>Add Todo</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1, paddingTop: 60 },
  header: { paddingHorizontal: 20, marginBottom: 16 },
  greeting: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  title: { fontSize: 28, fontWeight: '800' },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11 },
  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', flex: 1 },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: { fontSize: 12, fontWeight: '700' },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 12,
  },
  checkbox: { padding: 2 },
  todoContent: { flex: 1 },
  todoTitle: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  todoTitleDone: { textDecorationLine: 'line-through', opacity: 0.6 },
  todoMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  subjectPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  subjectPillText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityText: { fontSize: 10, fontWeight: '700' },
  dueDate: { fontSize: 11 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  inputLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
  },
  priorityRow: { flexDirection: 'row', gap: 10 },
  priorityBtn: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  priorityBtnText: { fontSize: 13, fontWeight: '700' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 14,
    marginTop: 24,
    marginBottom: 20,
  },
  addBtnText: { fontSize: 16, fontWeight: '700', color: '#000' },
});
