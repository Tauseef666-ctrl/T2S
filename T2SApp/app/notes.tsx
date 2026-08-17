import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Alert, Animated, Modal, KeyboardAvoidingView, Platform, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../src/hooks/useApp';
import { Semester3Subjects, BackPaperSubjects } from '../src/data';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ALL_SUBJECTS = [...Semester3Subjects, ...BackPaperSubjects];
const subjectColors: Record<string, string> = {};
ALL_SUBJECTS.forEach((s) => { subjectColors[s.id] = s.color; });

type SortMode = 'newest' | 'oldest' | 'alphabetical';

const UNITS_FOR_SUBJECT: Record<string, string[]> = {};
ALL_SUBJECTS.forEach((s) => {
  UNITS_FOR_SUBJECT[s.id] = s.units.map((u) => u.title);
});

export default function NotesScreen() {
  const { colors, state, dispatch } = useApp();
  const router = useRouter();
  const notes = state.notes;

  const [activeTab, setActiveTab] = useState<'personal' | 'study'>('personal');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formSubject, setFormSubject] = useState('os');
  const [formUnit, setFormUnit] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formImportant, setFormImportant] = useState(false);
  const [formShared, setFormShared] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const resetForm = () => {
    setFormTitle('');
    setFormContent('');
    setFormSubject('os');
    setFormUnit('');
    setFormTags('');
    setFormImportant(false);
    setFormShared(false);
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (note: any) => {
    setEditingId(note.id);
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormSubject(note.subject || 'os');
    setFormUnit(note.unit || '');
    setFormTags((note.tags || []).join(', '));
    setFormImportant(note.isImportant);
    setFormShared(note.isShared);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formTitle.trim() || !formContent.trim()) return;
    const tags = formTags.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingId) {
      dispatch({
        type: 'UPDATE_NOTE',
        payload: {
          id: editingId,
          updates: {
            title: formTitle.trim(),
            content: formContent.trim(),
            subject: activeTab === 'study' ? formSubject : '',
            unit: activeTab === 'study' ? formUnit : '',
            tags,
            type: activeTab,
            isImportant: formImportant,
            isShared: formShared,
          },
        },
      });
    } else {
      const newNote = {
        id: `n${Date.now()}`,
        title: formTitle.trim(),
        content: formContent.trim(),
        subject: activeTab === 'study' ? formSubject : '',
        unit: activeTab === 'study' ? formUnit : '',
        tags,
        type: activeTab as 'personal' | 'study',
        createdAt: new Date().toISOString().split('T')[0],
        isImportant: formImportant,
        isShared: formShared,
      };
      dispatch({ type: 'ADD_NOTE', payload: newNote });
    }
    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      dispatch({ type: 'DELETE_NOTE', payload: deleteConfirm });
      setDeleteConfirm(null);
    }
  };

  const filteredNotes = notes
    .filter((n) => n.type === activeTab)
    .filter((n) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || (n.tags || []).some((t) => t.toLowerCase().includes(q));
      const matchesSubject = filterSubject === 'all' || n.subject === filterSubject;
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      if (sortMode === 'newest') return b.createdAt.localeCompare(a.createdAt);
      if (sortMode === 'oldest') return a.createdAt.localeCompare(b.createdAt);
      return a.title.localeCompare(b.title);
    });

  const totalNotes = notes.length;
  const studyNotes = notes.filter((n) => n.type === 'study').length;
  const personalNotes = notes.filter((n) => n.type === 'personal').length;
  const importantCount = notes.filter((n) => n.isImportant).length;

  const currentSubjectUnits = UNITS_FOR_SUBJECT[formSubject] || [];

  const renderStatCard = (label: string, value: number, icon: string, accent: string) => (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.statIconWrap, { backgroundColor: accent + '20' }]}>
        <Ionicons name={icon as any} size={16} color={accent} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );

  const renderNoteCard = (note: any) => (
    <TouchableOpacity
      key={note.id}
      style={[styles.noteCard, { backgroundColor: colors.card, borderColor: note.isImportant ? colors.warning + '60' : colors.border }]}
      onPress={() => openEdit(note)}
      activeOpacity={0.7}
    >
      <View style={styles.noteHeader}>
        {note.subject ? (
          <View style={[styles.subjectPill, { backgroundColor: (subjectColors[note.subject] || colors.accent) + '20' }]}>
            <Text style={[styles.subjectPillText, { color: subjectColors[note.subject] || colors.accent }]}>
              {note.subject.toUpperCase()}
            </Text>
          </View>
        ) : (
          <View style={[styles.subjectPill, { backgroundColor: colors.accentSecondary + '20' }]}>
            <Text style={[styles.subjectPillText, { color: colors.accentSecondary }]}>PERSONAL</Text>
          </View>
        )}
        <View style={styles.noteHeaderRight}>
          {note.isShared && (
            <Ionicons name="people" size={14} color={colors.accentSecondary} style={{ marginRight: 6 }} />
          )}
          {note.isImportant && (
            <Ionicons name="star" size={14} color={colors.warning} />
          )}
        </View>
      </View>
      <Text style={[styles.noteTitle, { color: colors.text }]} numberOfLines={1}>{note.title}</Text>
      <Text style={[styles.noteContentPreview, { color: colors.textSecondary }]} numberOfLines={2}>{note.content}</Text>
      {note.tags && note.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {note.tags.slice(0, 3).map((tag: string, i: number) => (
            <View key={i} style={[styles.tagChip, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>#{tag}</Text>
            </View>
          ))}
          {note.tags.length > 3 && (
            <Text style={[styles.tagMore, { color: colors.textSecondary }]}>+{note.tags.length - 3}</Text>
          )}
        </View>
      )}
      <View style={styles.noteFooter}>
        <Text style={[styles.noteDate, { color: colors.textSecondary }]}>{note.createdAt}</Text>
        <View style={styles.noteActions}>
          <TouchableOpacity
            style={[styles.noteActionBtn, { backgroundColor: colors.secondary }]}
            onPress={() => openEdit(note)}
          >
            <Ionicons name="pencil" size={13} color={colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.noteActionBtn, { backgroundColor: colors.error + '15' }]}
            onPress={() => handleDelete(note.id)}
          >
            <Ionicons name="trash" size={13} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.title, { color: colors.text }]}>Notes</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{totalNotes} total</Text>
          </View>
          <TouchableOpacity style={[styles.sortBtn, { backgroundColor: colors.card }]} onPress={() => setShowSortMenu(!showSortMenu)}>
            <Ionicons name="swap-vertical" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Sort Menu */}
        {showSortMenu && (
          <View style={[styles.sortMenu, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {(['newest', 'oldest', 'alphabetical'] as SortMode[]).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[styles.sortOption, sortMode === mode && { backgroundColor: colors.accent + '15' }]}
                onPress={() => { setSortMode(mode); setShowSortMenu(false); }}
              >
                <Text style={[styles.sortOptionText, { color: sortMode === mode ? colors.accent : colors.textSecondary }]}>
                  {mode === 'newest' ? 'Newest First' : mode === 'oldest' ? 'Oldest First' : 'Alphabetical'}
                </Text>
                {sortMode === mode && <Ionicons name="checkmark" size={16} color={colors.accent} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          {renderStatCard('Total', totalNotes, 'document-text', colors.accent)}
          {renderStatCard('Study', studyNotes, 'book', colors.accentSecondary)}
          {renderStatCard('Personal', personalNotes, 'person', colors.success)}
          {renderStatCard('Important', importantCount, 'star', colors.warning)}
        </View>

        {/* Tab Switcher */}
        <View style={[styles.tabBar, { backgroundColor: colors.secondary }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'personal' && { backgroundColor: colors.accent + '18' }]}
            onPress={() => { setActiveTab('personal'); setFilterSubject('all'); }}
          >
            <Ionicons name="person" size={16} color={activeTab === 'personal' ? colors.accent : colors.textSecondary} />
            <Text style={[styles.tabText, { color: activeTab === 'personal' ? colors.accent : colors.textSecondary }]}>Personal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'study' && { backgroundColor: colors.accentSecondary + '18' }]}
            onPress={() => { setActiveTab('study'); setFilterSubject('all'); }}
          >
            <Ionicons name="book" size={16} color={activeTab === 'study' ? colors.accentSecondary : colors.textSecondary} />
            <Text style={[styles.tabText, { color: activeTab === 'study' ? colors.accentSecondary : colors.textSecondary }]}>Study</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search notes, tags..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Subject Filter (Study Notes only) */}
        {activeTab === 'study' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
            {['all', ...ALL_SUBJECTS.map((s) => s.id)].map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.filterChip, {
                  backgroundColor: filterSubject === s ? (s === 'all' ? colors.accent : (subjectColors[s] || colors.accent) + '20') : colors.card,
                  borderColor: filterSubject === s ? (s === 'all' ? colors.accent : subjectColors[s] || colors.accent) : colors.border,
                }]}
                onPress={() => setFilterSubject(s)}
              >
                <Text style={[styles.filterText, {
                  color: filterSubject === s ? (s === 'all' ? colors.accent : subjectColors[s] || colors.accent) : colors.textSecondary,
                }]}>
                  {s === 'all' ? 'All' : s.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Notes List */}
        <View style={styles.notesList}>
          {filteredNotes.length === 0 ? (
            <View style={styles.emptyState}>
              <LinearGradient colors={[colors.accent + '08', 'transparent']} style={styles.emptyGradient}>
                <Ionicons name="document-text-outline" size={56} color={colors.textSecondary} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No notes yet</Text>
                <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                  {searchQuery ? 'Try a different search term' : `Tap + to create your first ${activeTab} note`}
                </Text>
              </LinearGradient>
            </View>
          ) : (
            filteredNotes.map(renderNoteCard)
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.accent }]} onPress={openCreate} activeOpacity={0.8}>
        <Ionicons name="add" size={26} color="#050505" />
      </TouchableOpacity>

      {/* Create/Edit Modal */}
      <Modal visible={showModal} animationType="slide" transparent onRequestClose={() => setShowModal(false)}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[styles.modalBackdrop, { backgroundColor: 'rgba(0,0,0,0.7)' }]} />
          <View style={[styles.modalContent, { backgroundColor: colors.primary, borderColor: colors.border }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingId ? 'Edit Note' : 'New Note'}
              </Text>
              <TouchableOpacity onPress={() => { setShowModal(false); resetForm(); }}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
              {/* Type indicator */}
              <View style={[styles.modalTypeBadge, { backgroundColor: activeTab === 'study' ? colors.accentSecondary + '20' : colors.accent + '20' }]}>
                <Ionicons name={activeTab === 'study' ? 'book' : 'person'} size={14} color={activeTab === 'study' ? colors.accentSecondary : colors.accent} />
                <Text style={[styles.modalTypeText, { color: activeTab === 'study' ? colors.accentSecondary : colors.accent }]}>
                  {activeTab === 'study' ? 'Study Note' : 'Personal Note'}
                </Text>
              </View>

              {/* Title */}
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Title</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: colors.secondary, color: colors.text, borderColor: colors.border }]}
                placeholder="Note title..."
                placeholderTextColor={colors.textSecondary}
                value={formTitle}
                onChangeText={setFormTitle}
              />

              {/* Content */}
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Content</Text>
              <TextInput
                style={[styles.formInput, styles.formTextArea, { backgroundColor: colors.secondary, color: colors.text, borderColor: colors.border }]}
                placeholder="Write your note..."
                placeholderTextColor={colors.textSecondary}
                value={formContent}
                onChangeText={setFormContent}
                multiline
                textAlignVertical="top"
              />

              {/* Subject Picker (Study Notes) */}
              {activeTab === 'study' && (
                <>
                  <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Subject</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectPickerScroll}>
                    {ALL_SUBJECTS.map((s) => (
                      <TouchableOpacity
                        key={s.id}
                        style={[styles.subjectPickerPill, {
                          backgroundColor: formSubject === s.id ? s.color + '25' : colors.secondary,
                          borderColor: formSubject === s.id ? s.color : colors.border,
                        }]}
                        onPress={() => { setFormSubject(s.id); setFormUnit(''); }}
                      >
                        <Text style={[styles.subjectPickerText, { color: formSubject === s.id ? s.color : colors.textSecondary }]}>
                          {s.shortName}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {/* Unit Picker */}
                  {currentSubjectUnits.length > 0 && (
                    <>
                      <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Unit</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectPickerScroll}>
                        {currentSubjectUnits.map((u, i) => (
                          <TouchableOpacity
                            key={i}
                            style={[styles.unitPill, {
                              backgroundColor: formUnit === u ? colors.accentSecondary + '20' : colors.secondary,
                              borderColor: formUnit === u ? colors.accentSecondary : colors.border,
                            }]}
                            onPress={() => setFormUnit(formUnit === u ? '' : u)}
                          >
                            <Text style={[styles.unitPillText, { color: formUnit === u ? colors.accentSecondary : colors.textSecondary }]} numberOfLines={1}>
                              Unit {i + 1}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </>
                  )}
                </>
              )}

              {/* Tags */}
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Tags (comma separated)</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: colors.secondary, color: colors.text, borderColor: colors.border }]}
                placeholder="e.g. important, revision, chapter-3"
                placeholderTextColor={colors.textSecondary}
                value={formTags}
                onChangeText={setFormTags}
              />

              {/* Toggles */}
              <View style={styles.togglesRow}>
                <TouchableOpacity
                  style={[styles.toggleBtn, { backgroundColor: formImportant ? colors.warning + '20' : colors.secondary, borderColor: formImportant ? colors.warning : colors.border }]}
                  onPress={() => setFormImportant(!formImportant)}
                >
                  <Ionicons name={formImportant ? 'star' : 'star-outline'} size={16} color={formImportant ? colors.warning : colors.textSecondary} />
                  <Text style={[styles.toggleText, { color: formImportant ? colors.warning : colors.textSecondary }]}>Important</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, { backgroundColor: formShared ? colors.accentSecondary + '20' : colors.secondary, borderColor: formShared ? colors.accentSecondary : colors.border }]}
                  onPress={() => setFormShared(!formShared)}
                >
                  <Ionicons name={formShared ? 'people' : 'people-outline'} size={16} color={formShared ? colors.accentSecondary : colors.textSecondary} />
                  <Text style={[styles.toggleText, { color: formShared ? colors.accentSecondary : colors.textSecondary }]}>Shared</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalCancelBtn, { backgroundColor: colors.secondary }]} onPress={() => { setShowModal(false); resetForm(); }}>
                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveBtn, { backgroundColor: (!formTitle.trim() || !formContent.trim()) ? colors.border : colors.accent }]}
                onPress={handleSave}
                disabled={!formTitle.trim() || !formContent.trim()}
              >
                <Ionicons name="checkmark" size={18} color="#050505" />
                <Text style={styles.modalSaveText}>{editingId ? 'Update' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={!!deleteConfirm} transparent animationType="fade" onRequestClose={() => setDeleteConfirm(null)}>
        <View style={styles.deleteOverlay}>
          <View style={[styles.deleteBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="warning" size={36} color={colors.error} />
            <Text style={[styles.deleteTitle, { color: colors.text }]}>Delete Note?</Text>
            <Text style={[styles.deleteMsg, { color: colors.textSecondary }]}>This action cannot be undone.</Text>
            <View style={styles.deleteActions}>
              <TouchableOpacity style={[styles.deleteCancelBtn, { backgroundColor: colors.secondary }]} onPress={() => setDeleteConfirm(null)}>
                <Text style={[styles.deleteCancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.deleteConfirmBtn, { backgroundColor: colors.error }]} onPress={confirmDelete}>
                <Text style={styles.deleteConfirmText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 12, gap: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1 },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 12 },
  sortBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sortMenu: { marginHorizontal: 20, marginBottom: 12, borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  sortOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  sortOptionText: { fontSize: 13, fontWeight: '600' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 16 },
  statCard: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1 },
  statIconWrap: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 10, fontWeight: '600', marginTop: 2 },
  tabBar: { flexDirection: 'row', marginHorizontal: 20, borderRadius: 12, padding: 4, marginBottom: 14 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
  tabText: { fontSize: 13, fontWeight: '700' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },
  filterScroll: { marginBottom: 14 },
  filterContent: { paddingHorizontal: 20, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 12, fontWeight: '700' },
  notesList: { paddingHorizontal: 20, gap: 12 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyGradient: { alignItems: 'center', padding: 30, borderRadius: 20 },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginTop: 12 },
  emptySubtitle: { fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 18 },
  noteCard: { padding: 16, borderRadius: 14, borderWidth: 1 },
  noteHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  subjectPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  subjectPillText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  noteHeaderRight: { flexDirection: 'row', alignItems: 'center' },
  noteTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  noteContentPreview: { fontSize: 12, lineHeight: 17, marginBottom: 8 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  tagChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  tagText: { fontSize: 10, fontWeight: '600' },
  tagMore: { fontSize: 10, fontWeight: '600', alignSelf: 'center' },
  noteFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  noteDate: { fontSize: 11 },
  noteActions: { flexDirection: 'row', gap: 8 },
  noteActionBtn: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  fab: { position: 'absolute', right: 24, bottom: 34, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderBottomWidth: 0, maxHeight: SCREEN_HEIGHT * 0.88 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#2A2D35' },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  modalScroll: { padding: 20 },
  modalTypeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginBottom: 16 },
  modalTypeText: { fontSize: 12, fontWeight: '700' },
  formLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 10 },
  formInput: { padding: 12, borderRadius: 10, borderWidth: 1, fontSize: 14, marginBottom: 4 },
  formTextArea: { height: 120 },
  subjectPickerScroll: { marginBottom: 8 },
  subjectPickerPill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16, borderWidth: 1, marginRight: 8 },
  subjectPickerText: { fontSize: 12, fontWeight: '700' },
  unitPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, marginRight: 8 },
  unitPillText: { fontSize: 11, fontWeight: '600' },
  togglesRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  toggleText: { fontSize: 12, fontWeight: '700' },
  modalActions: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingBottom: 30, paddingTop: 10 },
  modalCancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalCancelText: { fontSize: 14, fontWeight: '600' },
  modalSaveBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 12 },
  modalSaveText: { fontSize: 14, fontWeight: '700', color: '#050505' },
  deleteOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
  deleteBox: { width: 300, padding: 24, borderRadius: 20, borderWidth: 1, alignItems: 'center', gap: 8 },
  deleteTitle: { fontSize: 18, fontWeight: '800' },
  deleteMsg: { fontSize: 13, marginBottom: 8 },
  deleteActions: { flexDirection: 'row', gap: 10, width: '100%' },
  deleteCancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  deleteCancelText: { fontSize: 13, fontWeight: '600' },
  deleteConfirmBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  deleteConfirmText: { fontSize: 13, fontWeight: '700', color: '#fff' },
});
