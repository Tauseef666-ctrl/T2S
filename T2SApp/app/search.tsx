import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../src/hooks/useApp';
import { Semester3Subjects, BackPaperSubjects, SampleQuizQuestions } from '../src/data';
import { Ionicons } from '@expo/vector-icons';

const ALL_SUBJECTS = [...Semester3Subjects, ...BackPaperSubjects];

const recentSearchesStorage: string[] = [];

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'subject' | 'note' | 'quiz' | 'video' | 'topic';
  icon: string;
  color: string;
  route: string;
}

const popularSearches = [
  'OS scheduling algorithms',
  'SQL JOIN types',
  'TCP vs UDP',
  'Pointer in C',
  'CSS Flexbox',
  'Normalization DBMS',
  'Deadlock prevention',
  'ES6 features',
];

export default function SearchScreen() {
  const { colors, state } = useApp();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(recentSearchesStorage);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const addToRecent = (term: string) => {
    const updated = [term, ...recentSearches.filter((r) => r !== term)].slice(0, 5);
    setRecentSearches(updated);
    recentSearchesStorage.length = 0;
    recentSearchesStorage.push(...updated);
  };

  const buildResults = (): SearchResult[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: SearchResult[] = [];

    // Search subjects
    ALL_SUBJECTS.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.shortName.toLowerCase().includes(q)) {
        results.push({
          id: `sub-${s.id}`,
          title: s.name,
          subtitle: s.description,
          type: 'subject',
          icon: 'book',
          color: s.color,
          route: `/subject/${s.id}`,
        });
      }
      // Search topics within subjects
      s.units.forEach((u) => {
        u.topics.forEach((topic) => {
          if (topic.toLowerCase().includes(q)) {
            results.push({
              id: `topic-${s.id}-${topic}`,
              title: topic,
              subtitle: `${s.shortName} · ${u.title}`,
              type: 'topic',
              icon: 'layers',
              color: s.color,
              route: `/subject/${s.id}`,
            });
          }
        });
      });
    });

    // Search notes
    state.notes.forEach((n) => {
      if (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.tags || []).some((t: string) => t.toLowerCase().includes(q))
      ) {
        results.push({
          id: `note-${n.id}`,
          title: n.title,
          subtitle: n.content.substring(0, 60) + '...',
          type: 'note',
          icon: 'document-text',
          color: n.type === 'study' ? '#7C4DFF' : '#00E5FF',
          route: '/notes',
        });
      }
    });

    // Search quiz questions
    SampleQuizQuestions.forEach((qItem) => {
      if (qItem.question.toLowerCase().includes(q) || qItem.explanation.toLowerCase().includes(q)) {
        results.push({
          id: `quiz-${qItem.id}`,
          title: qItem.question,
          subtitle: `Quiz · ${qItem.subject.toUpperCase()} · ${qItem.difficulty}`,
          type: 'quiz',
          icon: 'help-circle',
          color: '#FFD600',
          route: '/quiz',
        });
      }
    });

    // Search lab topics
    const labKeywords = ['c programming', 'sql', 'networking', 'os lab', 'web lab', 'subnet', 'pointer', 'flexbox', 'join', 'scheduling'];
    labKeywords.forEach((kw) => {
      if (kw.includes(q) || q.includes(kw)) {
        results.push({
          id: `lab-${kw}`,
          title: `${kw.charAt(0).toUpperCase() + kw.slice(1)} Lab`,
          subtitle: 'Interactive practice environment',
          type: 'video',
          icon: 'flask',
          color: '#00E676',
          route: '/lab',
        });
      }
    });

    return results;
  };

  const results = buildResults();

  const groupedResults = results.reduce(
    (acc, r) => {
      if (!acc[r.type]) acc[r.type] = [];
      acc[r.type].push(r);
      return acc;
    },
    {} as Record<string, SearchResult[]>
  );

  const typeLabels: Record<string, string> = {
    subject: 'Subjects',
    topic: 'Topics',
    note: 'Notes',
    quiz: 'Questions',
    video: 'Labs',
  };

  const handleResultPress = (result: SearchResult) => {
    addToRecent(query);
    router.push(result.route as any);
  };

  const renderResult = (result: SearchResult) => (
    <TouchableOpacity
      key={result.id}
      style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => handleResultPress(result)}
      activeOpacity={0.7}
    >
      <View style={[styles.resultIcon, { backgroundColor: result.color + '20' }]}>
        <Ionicons name={result.icon as any} size={18} color={result.color} />
      </View>
      <View style={styles.resultInfo}>
        <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={1}>{result.title}</Text>
        <Text style={[styles.resultSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>{result.subtitle}</Text>
      </View>
      <View style={[styles.resultTypeBadge, { backgroundColor: result.color + '15' }]}>
        <Text style={[styles.resultTypeText, { color: result.color }]}>{typeLabels[result.type] || result.type}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.title, { color: colors.text }]}>Search</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Find anything across the app</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: query ? colors.accent : colors.border }]}>
          <Ionicons name="search" size={18} color={query ? colors.accent : colors.textSecondary} />
          <TextInput
            ref={inputRef}
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search subjects, notes, quizzes..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Results */}
        {query.trim().length > 0 ? (
          results.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={52} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No results found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Try different keywords or check spelling
              </Text>
              <View style={styles.suggestionBox}>
                <Text style={[styles.suggestionTitle, { color: colors.textSecondary }]}>Suggestions:</Text>
                {['OS scheduling', 'SQL JOIN', 'pointer in C', 'CSS flexbox'].map((s, i) => (
                  <TouchableOpacity key={i} onPress={() => setQuery(s)}>
                    <Text style={[styles.suggestionItem, { color: colors.accent }]}>• {s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.resultsContainer}>
              <Text style={[styles.resultCount, { color: colors.textSecondary }]}>{results.length} results</Text>
              {Object.entries(groupedResults).map(([type, items]) => (
                <View key={type} style={styles.resultGroup}>
                  <Text style={[styles.groupTitle, { color: colors.text }]}>{typeLabels[type] || type}</Text>
                  {items.map(renderResult)}
                </View>
              ))}
            </View>
          )
        ) : (
          <View style={styles.suggestionsContainer}>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={styles.suggestionSection}>
                <View style={styles.suggestionHeader}>
                  <Ionicons name="time" size={16} color={colors.textSecondary} />
                  <Text style={[styles.suggestionSectionTitle, { color: colors.textSecondary }]}>Recent</Text>
                  <TouchableOpacity onPress={() => { setRecentSearches([]); recentSearchesStorage.length = 0; }}>
                    <Text style={[styles.clearRecent, { color: colors.error }]}>Clear</Text>
                  </TouchableOpacity>
                </View>
                {recentSearches.map((term, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.suggestionRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => { setQuery(term); addToRecent(term); }}
                  >
                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.suggestionText, { color: colors.text }]}>{term}</Text>
                    <Ionicons name="arrow-forward" size={12} color={colors.textSecondary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Popular Searches */}
            <View style={styles.suggestionSection}>
              <View style={styles.suggestionHeader}>
                <Ionicons name="trending-up" size={16} color={colors.warning} />
                <Text style={[styles.suggestionSectionTitle, { color: colors.textSecondary }]}>Popular</Text>
              </View>
              <View style={styles.popularGrid}>
                {popularSearches.map((term, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.popularChip, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => { setQuery(term); addToRecent(term); }}
                  >
                    <Text style={[styles.popularText, { color: colors.text }]}>{term}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Quick Links */}
            <View style={styles.suggestionSection}>
              <View style={styles.suggestionHeader}>
                <Ionicons name="grid" size={16} color={colors.accentSecondary} />
                <Text style={[styles.suggestionSectionTitle, { color: colors.textSecondary }]}>Quick Links</Text>
              </View>
              <View style={styles.quickLinksGrid}>
                {[
                  { icon: 'school', label: 'Quizzes', route: '/quiz', color: '#FFD600' },
                  { icon: 'flask', label: 'Labs', route: '/lab', color: '#00E676' },
                  { icon: 'document-text', label: 'Notes', route: '/notes', color: '#7C4DFF' },
                  { icon: 'play-circle', label: 'Videos', route: '/videos', color: '#FF5252' },
                ].map((link, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.quickLinkCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => router.push(link.route as any)}
                  >
                    <Ionicons name={link.icon as any} size={24} color={link.color} />
                    <Text style={[styles.quickLinkLabel, { color: colors.text }]}>{link.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
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
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, borderWidth: 1.5, marginBottom: 20 },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },
  resultsContainer: { paddingHorizontal: 20 },
  resultCount: { fontSize: 11, fontWeight: '600', marginBottom: 12 },
  resultGroup: { marginBottom: 20 },
  groupTitle: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
  resultCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  resultIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  resultInfo: { flex: 1 },
  resultTitle: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  resultSubtitle: { fontSize: 11, lineHeight: 15 },
  resultTypeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  resultTypeText: { fontSize: 9, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: 50, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginTop: 12 },
  emptySubtitle: { fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 18 },
  suggestionBox: { marginTop: 24, alignSelf: 'flex-start' },
  suggestionTitle: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
  suggestionItem: { fontSize: 13, marginBottom: 6, lineHeight: 18 },
  suggestionsContainer: { paddingHorizontal: 20 },
  suggestionSection: { marginBottom: 24 },
  suggestionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  suggestionSectionTitle: { fontSize: 13, fontWeight: '700', flex: 1 },
  clearRecent: { fontSize: 12, fontWeight: '600' },
  suggestionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 6 },
  suggestionText: { flex: 1, fontSize: 13, fontWeight: '500' },
  popularGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  popularChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  popularText: { fontSize: 12, fontWeight: '600' },
  quickLinksGrid: { flexDirection: 'row', gap: 10 },
  quickLinkCard: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, gap: 8 },
  quickLinkLabel: { fontSize: 11, fontWeight: '700' },
});
