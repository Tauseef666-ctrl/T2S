import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { useApp } from '../../src/hooks/useApp';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const InitialMessages: Message[] = [
  {
    id: '1',
    text: "Hey! I'm T2S AI — your personal study assistant. Ask me anything about your Diploma CSE subjects, and I'll help you understand it better.",
    isUser: false,
    timestamp: 'Now',
  },
  {
    id: '2',
    text: "You can ask me to:\n• Explain a concept\n• Summarize notes\n• Generate quiz questions\n• Help with C programs\n• Create a study plan",
    isUser: false,
    timestamp: 'Now',
  },
];

const QuickPrompts = [
  { text: 'Explain OS scheduling', icon: 'timer' },
  { text: 'SQL JOIN types', icon: 'git-merge' },
  { text: 'TCP vs UDP', icon: 'network' },
  { text: 'Pointer in C', icon: 'code' },
  { text: 'CSS Flexbox tips', icon: 'logo-css3' },
];

const AIResponses: Record<string, string> = {
  scheduling: "**CPU Scheduling Algorithms:**\n\n1. **FCFS** (First Come First Served) — Simple, non-preemptive. Tasks execute in arrival order.\n\n2. **SJF** (Shortest Job First) — Minimum average waiting time. Can be preemptive (SRTF) or non-preemptive.\n\n3. **Round Robin** — Each process gets a fixed time quantum. Fair but context switching overhead.\n\n4. **Priority** — Each process has a priority. Lower priority can starve.\n\n5. **Multilevel Queue** — Separate queues for different process types.\n\n**Key formula:**\nAverage Waiting Time = Total wait time / Number of processes\n\nSJF gives optimal waiting time!",
  sql: "**SQL JOIN Types:**\n\n```sql\n-- INNER JOIN: Only matching rows\nSELECT * FROM A INNER JOIN B ON A.id = B.id;\n\n-- LEFT JOIN: All from left + matching from right\nSELECT * FROM A LEFT JOIN B ON A.id = B.id;\n\n-- RIGHT JOIN: All from right + matching from left\nSELECT * FROM A RIGHT JOIN B ON A.id = B.id;\n\n-- FULL JOIN: All rows from both\nSELECT * FROM A FULL JOIN B ON A.id = B.id;\n```\n\n**Memory tip:** Think of it as set operations!\n- INNER = Intersection\n- LEFT = A only + Intersection\n- FULL = Union",
  tcp: "**TCP vs UDP:**\n\n| Feature | TCP | UDP |\n|---------|-----|-----|\n| Connection | 3-way handshake | Connectionless |\n| Reliability | Guaranteed | Best effort |\n| Order | Ordered | Unordered |\n| Speed | Slower | Faster |\n| Use Cases | Web, Email, FTP | Gaming, Streaming, DNS |\n\n**TCP 3-way handshake:**\n1. Client → SYN\n2. Server → SYN-ACK\n3. Client → ACK\n\nTCP header: 20-60 bytes\nUDP header: 8 bytes",
  pointer: "**Pointers in C:**\n\n```c\nint x = 10;\nint *ptr = &x;  // ptr stores address of x\n\nprintf(\"%d\", *ptr);  // Dereference: prints 10\nprintf(\"%p\", (void*)ptr);  // Prints address\n```\n\n**Pointer Arithmetic:**\n```c\nint arr[] = {10, 20, 30};\nint *p = arr;\np++;  // Points to arr[1] (20)\n```\n\n**Dynamic Memory:**\n```c\nint *p = (int*)malloc(5 * sizeof(int));\nfree(p);\n```\n\n**Common mistakes:**\n- Dereferencing NULL\n- Using freed memory\n- Memory leaks",
  flexbox: "**CSS Flexbox Essentials:**\n\n```css\n.container {\n  display: flex;\n  \n  /* Main Axis */\n  justify-content: center;\n  /* flex-start | flex-end | center | space-between | space-around */\n  \n  /* Cross Axis */\n  align-items: center;\n  /* flex-start | flex-end | center | stretch */\n  \n  flex-direction: row; /* row | column */\n  flex-wrap: wrap;\n  gap: 10px;\n}\n\n.item {\n  flex: 1; /* Takes equal space */\n  flex-shrink: 0;\n  flex-grow: 0;\n}\n```\n\n**Pro tip:** `flex: 1` = `flex-grow: 1; flex-shrink: 1; flex-basis: 0%`",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('schedul') || lower.includes('os')) return AIResponses.scheduling;
  if (lower.includes('sql') || lower.includes('join') || lower.includes('dbms')) return AIResponses.sql;
  if (lower.includes('tcp') || lower.includes('udp') || lower.includes('network')) return AIResponses.tcp;
  if (lower.includes('pointer') || lower.includes('c ') || lower.includes('malloc')) return AIResponses.pointer;
  if (lower.includes('flex') || lower.includes('css') || lower.includes('html')) return AIResponses.flexbox;
  return `Great question! Let me help you with that.\n\nBased on your query about "${input}", here's what I can tell you:\n\nThis is a topic from your Diploma CSE syllabus. To give you the most accurate answer, I recommend:\n\n1. Check your class notes for the specific topic\n2. Refer to the standard textbook\n3. Try the practice questions in the Quiz section\n\nWant me to generate some practice questions on this topic? 📚`;
}

export default function AIScreen() {
  const { colors } = useApp();
  const [messages, setMessages] = useState<Message[]>(InitialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: msg,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(msg),
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.primary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <View style={[styles.aiAvatar, { backgroundColor: colors.accentSecondary + '20', borderColor: colors.accentSecondary }]}>
          <Ionicons name="sparkles" size={24} color={colors.accentSecondary} />
        </View>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>T2S AI</Text>
          <Text style={[styles.status, { color: colors.success }]}>Online · Ready to help</Text>
        </View>
      </View>

      <ScrollView ref={scrollRef} style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}>
        {messages.map(msg => (
          <View key={msg.id} style={[styles.messageBubble, msg.isUser ? styles.userBubble : styles.aiBubble,
            { backgroundColor: msg.isUser ? colors.accent + '20' : colors.card, borderColor: colors.border }]}>
            {!msg.isUser && (
              <View style={[styles.aiMsgAvatar, { backgroundColor: colors.accentSecondary + '20' }]}>
                <Ionicons name="sparkles" size={14} color={colors.accentSecondary} />
              </View>
            )}
            <View style={styles.messageContent}>
              <Text style={[styles.messageText, { color: colors.text }]}>{msg.text}</Text>
              <Text style={[styles.timestamp, { color: colors.textSecondary }]}>{msg.timestamp}</Text>
            </View>
          </View>
        ))}

        {isTyping && (
          <View style={[styles.messageBubble, styles.aiBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.aiMsgAvatar, { backgroundColor: colors.accentSecondary + '20' }]}>
              <Ionicons name="sparkles" size={14} color={colors.accentSecondary} />
            </View>
            <Text style={[styles.typingText, { color: colors.textSecondary }]}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Quick Prompts */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickPromptsContainer}>
        {QuickPrompts.map((qp, i) => (
          <TouchableOpacity key={i} style={[styles.quickPrompt, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => sendMessage(qp.text)}>
            <Ionicons name={qp.icon as any} size={14} color={colors.accent} />
            <Text style={[styles.quickPromptText, { color: colors.text }]}>{qp.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
        <TextInput style={[styles.input, { color: colors.text }]} value={input} onChangeText={setInput}
          placeholder="Ask T2S AI..." placeholderTextColor={colors.textSecondary}
          onSubmitEditing={() => sendMessage()} returnKeyType="send" />
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: input.trim() ? colors.accent : colors.border }]}
          onPress={() => sendMessage()} disabled={!input.trim()}>
          <Ionicons name="send" size={18} color={input.trim() ? colors.primary : colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#2A2D35',
  },
  aiAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  title: { fontSize: 18, fontWeight: '800' },
  status: { fontSize: 12, fontWeight: '500' },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 20, gap: 16 },
  messageBubble: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 16, borderWidth: 1, maxWidth: '90%' },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  aiMsgAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  messageContent: { flex: 1 },
  messageText: { fontSize: 14, lineHeight: 20 },
  timestamp: { fontSize: 10, marginTop: 6, alignSelf: 'flex-end' },
  typingText: { fontSize: 13, fontStyle: 'italic' },
  quickPromptsContainer: { paddingHorizontal: 20, maxHeight: 50, marginBottom: 8 },
  quickPrompt: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  quickPromptText: { fontSize: 12, fontWeight: '600' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 20, marginTop: 8, borderRadius: 16, borderWidth: 1, paddingLeft: 16 },
  input: { flex: 1, height: 48, fontSize: 14 },
  sendBtn: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 6 },
});
