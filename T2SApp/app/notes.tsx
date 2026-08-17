import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../src/hooks/useApp';
import { SampleNotes, Note } from '../src/data';
import { Ionicons } from '@expo/vector-icons';

const subjectColors: Record<string, string> = {
  os: '#00E5FF', dbms: '#7C4DFF', networking: '#00E676', c: '#FFD600', web: '#FF5252',
};

export default function NotesScreen() {
  const { colors } = useApp();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>(SampleNotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [showNewNote, setShowNewNote] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteSubject, setNewNoteSubject] = useState('os');
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);

  const subjects = ['all', 'os', 'dbms', 'networking', 'c', 'web'];
  const writableSubjects = ['os', 'dbms', 'networking', 'c', 'web'];

  const resetForm = () => {
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteSubject('os');
    setShowNewNote(false);
    setEditingNote(null);
  };

  const handleSave = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    if (editingNote) {
      setNotes(prev => prev.map(n =>
        n.id === editingNote
          ? { ...n, title: newNoteTitle.trim(), content: newNoteContent.trim(), subject: newNoteSubject }
          : n
      ));
    } else {
      const newNote: Note = {
        id: `n${Date.now()}`,
        title: newNoteTitle.trim(),
        content: newNoteContent.trim(),
        subject: newNoteSubject,
        unit: '',
        createdAt: new Date().toISOString().split('T')[0],
        isImportant: false,
        isShared: false,
      };
      setNotes(prev => [newNote, ...prev]);
    }
    resetForm();
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note.id);
    setNewNoteTitle(note.title);
    setNewNoteContent(note.content);
    setNewNoteSubject(note.subject);
    setShowNewNote(true);
  };

  const handleDelete = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const toggleImportant = (noteId: string) => {
    setNotes(prev => prev.map(n =>
      n.id === noteId ? { ...n, isImportant: !n.isImportant } : n
    ));
  };

  const toggleShared = (noteId: string) => {
    setNotes(prev => prev.map(n =>
      n.id === noteId ? { ...n, isShared: !n.isShared } : n
    ));
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.title, { color: colors.text }]}>Notes</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{notes.length} notes</Text>
          </View>
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.accent }]}
            onPress={() => { resetForm(); setShowNewNote(!showNewNote); }}>
            <Ionicons name={showNewNote ? 'close' : 'add'} size={22} color="#050505" />
          </TouchableOpacity>
        </View>

        {/* New/Edit Note Form */}
        {showNewNote && (
          <View style={[styles.newNoteForm, { backgroundColor: colors.card, borderColor: colors.accent }]}>
            <Text style={[styles.formTitle, { color: colors.text }]}>{editingNote ? 'Edit Note' : 'New Note'}</Text>

            {/* Subject Picker */}
            <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Subject</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectPicker}>
              {writableSubjects.map(s => (
                <TouchableOpacity key={s}
                  style={[styles.subjectPill, {
                    backgroundColor: newNoteSubject === s ? subjectColors[s] + '25' : colors.secondary,
                    borderColor: newNoteSubject === s ? subjectColors[s] : colors.border,
                  }]}
                  onPress={() => setNewNoteSubject(s)}>
                  <Text style={[styles.subjectPillText, { color: newNoteSubject === s ? subjectColors[s] : colors.textSecondary }]}>
                    {s.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TextInput style={[styles.input, { backgroundColor: colors.secondary, color: colors.text, borderColor: colors.border }]}
              placeholder="Note title..." placeholderTextColor={colors.textSecondary} value={newNoteTitle} onChangeText={setNewNoteTitle} />
            <TextInput style={[styles.input, styles.contentInput, { backgroundColor: colors.secondary, color: colors.text, borderColor: colors.border }]}
              placeholder="Write your note..." placeholderTextColor={colors.textSecondary} value={newNoteContent}
              onChangeText={setNewNoteContent} multiline textAlignVertical="top" />
            <View style={styles.formActions}>
              <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: colors.secondary }]} onPress={resetForm}>
                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.accent }]} onPress={handleSave}
                disabled={!newNoteTitle.trim() || !newNoteContent.trim()}>
                <Ionicons name="checkmark" size={18} color="#050505" />
                <Text style={styles.saveBtnText}>{editingNote ? 'Update' : 'Save Note'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput style={[styles.searchInput, { color: colors.text }]} placeholder="Search notes..."
            placeholderTextColor={colors.textSecondary} value={searchQuery} onChangeText={setSearchQuery} />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Subject Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {subjects.map(s => (
            <TouchableOpacity key={s} style={[styles.filterChip, {
              backgroundColor: selectedSubject === s ? colors.accent + '20' : colors.card,
              borderColor: selectedSubject === s ? colors.accent : colors.border
            }]} onPress={() => setSelectedSubject(s)}>
              <Text style={[styles.filterText, { color: selectedSubject === s ? colors.accent : colors.textSecondary }]}>
                {s === 'all' ? 'All' : s.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Notes List */}
        <View style={styles.notesList}>
          {filteredNotes.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {searchQuery ? 'No notes match your search' : 'No notes yet. Tap + to create one!'}
              </Text>
            </View>
          )}
          {filteredNotes.map(note => (
            <View key={note.id} style={[styles.noteCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.noteHeader}>
                <View style={[styles.noteSubject, { backgroundColor: (subjectColors[note.subject] || colors.accent) + '20' }]}>
                  <Text style={[styles.noteSubjectText, { color: subjectColors[note.subject] || colors.accent }]}>
                    {note.subject.toUpperCase()}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => toggleImportant(note.id)}>
                  <Ionicons name={note.isImportant ? 'star' : 'star-outline'} size={16}
                    color={note.isImportant ? colors.warning : colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleShared(note.id)}>
                  <Ionicons name={note.isShared ? 'people' : 'people-outline'} size={16}
                    color={note.isShared ? colors.accentSecondary : colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.noteTitle, { color: colors.text }]}>{note.title}</Text>
              <Text style={[styles.noteContent, { color: colors.textSecondary }]} numberOfLines={4}>{note.content}</Text>
              <View style={styles.noteFooter}>
                <Text style={[styles.noteDate, { color: colors.textSecondary }]}>{note.createdAt}</Text>
                <View style={styles.noteActions}>
                  <TouchableOpacity style={[styles.noteAction, { backgroundColor: colors.secondary }]}
                    onPress={() => handleEdit(note)}>
                    <Ionicons name="pencil" size={14} color={colors.accent} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.noteAction, { backgroundColor: colors.error + '20' }]}
                    onPress={() => handleDelete(note.id)}>
                    <Ionicons name="trash" size={14} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
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
  addBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  newNoteForm: { marginHorizontal: 20, marginBottom: 16, padding: 16, borderRadius: 14, borderWidth: 2 },
  formTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  formLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  subjectPicker: { marginBottom: 10 },
  subjectPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, borderWidth: 1, marginRight: 8 },
  subjectPillText: { fontSize: 12, fontWeight: '700' },
  input: { padding: 12, borderRadius: 10, borderWidth: 1, fontSize: 14, marginBottom: 10 },
  contentInput: { height: 120 },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  cancelBtnText: { fontSize: 14, fontWeight: '600' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#050505' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },
  filterScroll: { paddingHorizontal: 20, marginBottom: 20 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  filterText: { fontSize: 12, fontWeight: '700' },
  notesList: { paddingHorizontal: 20, gap: 12 },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyText: { fontSize: 14, textAlign: 'center' },
  noteCard: { padding: 18, borderRadius: 14, borderWidth: 1 },
  noteHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  noteSubject: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  noteSubjectText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  noteTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  noteContent: { fontSize: 13, lineHeight: 19, marginBottom: 12 },
  noteFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  noteDate: { fontSize: 11 },
  noteActions: { flexDirection: 'row', gap: 8 },
  noteAction: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});
