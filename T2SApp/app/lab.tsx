import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../src/hooks/useApp';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface LabSubject {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const labSubjects: LabSubject[] = [
  { id: 'c', name: 'C Programming', icon: 'code-slash', color: '#FFD600' },
  { id: 'sql', name: 'SQL Lab', icon: 'server', color: '#7C4DFF' },
  { id: 'networking', name: 'Networking', icon: 'network', color: '#00E676' },
  { id: 'os', name: 'OS Lab', icon: 'cog', color: '#00E5FF' },
  { id: 'web', name: 'Web Lab', icon: 'globe', color: '#FF5252' },
];

interface CodeExample {
  title: string;
  code: string;
  output: string;
}

interface PracticeProblem {
  title: string;
  difficulty: string;
  points: number;
}

const cExamples: CodeExample[] = [
  {
    title: 'Hello World',
    code: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
    output: 'Hello, World!',
  },
  {
    title: 'Factorial using Recursion',
    code: '#include <stdio.h>\n\nint factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n\nint main() {\n    int num = 5;\n    printf("Factorial of %d = %d\\n", num, factorial(num));\n    return 0;\n}',
    output: 'Factorial of 5 = 120',
  },
  {
    title: 'Pointer Swap',
    code: '#include <stdio.h>\n\nvoid swap(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\nint main() {\n    int x = 10, y = 20;\n    swap(&x, &y);\n    printf("x=%d y=%d\\n", x, y);\n    return 0;\n}',
    output: 'x=20 y=10',
  },
  {
    title: 'Bubble Sort',
    code: '#include <stdio.h>\n\nvoid bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n-1; i++)\n        for (int j = 0; j < n-i-1; j++)\n            if (arr[j] > arr[j+1]) {\n                int t = arr[j];\n                arr[j] = arr[j+1];\n                arr[j+1] = t;\n            }\n}\n\nint main() {\n    int arr[] = {64, 34, 25, 12, 22};\n    bubbleSort(arr, 5);\n    for (int i = 0; i < 5; i++)\n        printf("%d ", arr[i]);\n    return 0;\n}',
    output: '12 22 25 34 64',
  },
  {
    title: 'Dynamic Memory Allocation',
    code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n = 5;\n    int *arr = (int*)malloc(n * sizeof(int));\n    for (int i = 0; i < n; i++)\n        arr[i] = (i + 1) * 10;\n    for (int i = 0; i < n; i++)\n        printf("%d ", arr[i]);\n    free(arr);\n    return 0;\n}',
    output: '10 20 30 40 50',
  },
];

const cProblems: PracticeProblem[] = [
  { title: 'Swap two numbers without temp variable', difficulty: 'Easy', points: 50 },
  { title: 'Reverse a string using pointers', difficulty: 'Medium', points: 100 },
  { title: 'Implement binary search recursively', difficulty: 'Hard', points: 200 },
  { title: 'Create a linked list and traverse', difficulty: 'Medium', points: 100 },
  { title: 'Matrix multiplication program', difficulty: 'Medium', points: 100 },
];

const sqlExamples: CodeExample[] = [
  {
    title: 'CREATE TABLE & INSERT',
    code: "CREATE TABLE students (\n  id INT PRIMARY KEY,\n  name VARCHAR(50),\n  age INT,\n  dept VARCHAR(30)\n);\n\nINSERT INTO students VALUES\n(1, 'Alice', 20, 'CSE'),\n(2, 'Bob', 21, 'ECE'),\n(3, 'Charlie', 19, 'CSE');",
    output: '3 rows inserted.',
  },
  {
    title: 'SELECT with WHERE',
    code: "SELECT name, age\nFROM students\nWHERE dept = 'CSE'\nORDER BY age DESC;",
    output: 'Alice 20\nCharlie 19',
  },
  {
    title: 'INNER JOIN',
    code: "SELECT s.name, c.course\nFROM students s\nINNER JOIN enrollments e\n  ON s.id = e.student_id\nINNER JOIN courses c\n  ON e.course_id = c.id;",
    output: 'Alice  — DBMS\nBob    — OS\nCharlie — Networking',
  },
  {
    title: 'Aggregate Functions',
    code: "SELECT dept,\n       COUNT(*) AS total,\n       AVG(age) AS avg_age\nFROM students\nGROUP BY dept\nHAVING COUNT(*) > 1;",
    output: 'CSE — 2 — 19.5',
  },
  {
    title: 'Subquery',
    code: "SELECT name FROM students\nWHERE dept IN (\n  SELECT dept FROM students\n  WHERE age > 20\n);",
    output: 'Bob',
  },
];

const sqlProblems: PracticeProblem[] = [
  { title: 'Write a query to find duplicates', difficulty: 'Easy', points: 50 },
  { title: 'Find second highest salary', difficulty: 'Medium', points: 100 },
  { title: 'Write a self-join query', difficulty: 'Hard', points: 200 },
  { title: 'Delete duplicate rows', difficulty: 'Medium', points: 100 },
  { title: 'Create a view with computed column', difficulty: 'Easy', points: 50 },
];

const netExamples: CodeExample[] = [
  {
    title: 'Subnet Calculator',
    code: 'Input: 192.168.1.0/26\n\nSubnet Mask: 255.255.255.192\nBinary: 11111111.11111111.11111111.11000000\n\nNumber of subnets: 4\nHosts per subnet: 62\n\nSubnet 1: 192.168.1.0   - 192.168.1.63\nSubnet 2: 192.168.1.64  - 192.168.1.127\nSubnet 3: 192.168.1.128 - 192.168.1.191\nSubnet 4: 192.168.1.192 - 192.168.1.255',
    output: '4 subnets, 62 hosts each',
  },
  {
    title: 'OSI Layer Explorer',
    code: 'Layer 7 — Application:    HTTP, FTP, DNS, SMTP\nLayer 6 — Presentation:    SSL/TLS, JPEG, ASCII\nLayer 5 — Session:         NetBIOS, RPC\nLayer 4 — Transport:       TCP, UDP\nLayer 3 — Network:         IP, ICMP, ARP\nLayer 2 — Data Link:       Ethernet, WiFi (MAC)\nLayer 1 — Physical:        USB, Bluetooth (Bits)\n\nPDU: Data → Segment → Packet → Frame → Bits',
    output: '7 layers mapped',
  },
  {
    title: 'TCP 3-Way Handshake',
    code: 'Step 1: Client → SYN (seq=1000)\n        "Hey server, let\'s connect!"\n\nStep 2: Server → SYN-ACK (seq=3000, ack=1001)\n        "Sure! I acknowledge your SYN."\n\nStep 3: Client → ACK (seq=1001, ack=3001)\n        "Connection established!"\n\nState: ESTABLISHED\n\nTermination: FIN → ACK → FIN → ACK (4-way)',
    output: 'Connection established!',
  },
];

const netProblems: PracticeProblem[] = [
  { title: 'Calculate subnets for 10.0.0.0/8 into 1000 subnets', difficulty: 'Medium', points: 100 },
  { title: 'List OSI layers for a web request', difficulty: 'Easy', points: 50 },
  { title: 'Compare TCP and UDP header fields', difficulty: 'Medium', points: 100 },
  { title: 'Design a subnetting scheme for 4 departments', difficulty: 'Hard', points: 200 },
  { title: 'Explain ARP resolution process', difficulty: 'Easy', points: 50 },
];

const osExamples: CodeExample[] = [
  {
    title: 'Process Scheduling Simulation',
    code: 'Processes: P1(24), P2(3), P3(3)\nAlgorithm: SJF (Non-preemptive)\n\nGantt Chart:\n| P2 | P3 | P1 |\n0    3    6    30\n\nWaiting Times:\nP1: 6, P2: 0, P3: 3\nAvg Wait = (6+0+3)/3 = 3.0\n\nTurnaround Times:\nP1: 30, P2: 3, P3: 6\nAvg TAT = (30+3+6)/3 = 13.0',
    output: 'Avg Wait: 3.0, Avg TAT: 13.0',
  },
  {
    title: 'Banker\'s Algorithm',
    code: 'Available: [3, 3, 2]\n\nProcess | Allocation | Max  | Need\nP0       | [0,1,0]    | [7,5,3] | [7,4,3]\nP1       | [2,0,0]    | [3,2,2] | [1,2,2]\nP2       | [3,0,2]    | [9,0,2] | [6,0,0]\nP3       | [2,1,1]    | [2,2,2] | [0,1,1]\nP4       | [0,0,2]    | [4,3,3] | [4,3,1]\n\nSafe Sequence: P1 → P3 → P4 → P0 → P2\nState: SAFE',
    output: 'Safe sequence found!',
  },
  {
    title: 'Memory Paging',
    code: 'Page Size: 1 KB (1024 bytes)\nLogical Address: 8196\n\nPage number = 8196 / 1024 = 8\nOffset = 8196 % 1024 = 4\n\nPage Table[8] → Frame 3\nPhysical Address = 3 × 1024 + 4 = 3076\n\nResult: Logical 8196 → Physical 3076',
    output: 'Physical address: 3076',
  },
];

const osProblems: PracticeProblem[] = [
  { title: 'Calculate avg waiting time for RR (q=4)', difficulty: 'Medium', points: 100 },
  { title: 'Check if Banker\'s state is safe', difficulty: 'Hard', points: 200 },
  { title: 'Convert logical to physical address', difficulty: 'Easy', points: 50 },
  { title: 'Simulate deadlock detection with wait-for graph', difficulty: 'Hard', points: 200 },
  { title: 'Compare paging vs segmentation', difficulty: 'Easy', points: 50 },
];

const webExamples: CodeExample[] = [
  {
    title: 'Semantic HTML Structure',
    code: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <header>\n    <nav>\n      <a href="#home">Home</a>\n      <a href="#about">About</a>\n    </nav>\n  </header>\n  <main>\n    <article>\n      <h1>Welcome</h1>\n      <p>Hello T2S!</p>\n    </article>\n  </main>\n  <footer>\n    <p>&copy; 2026</p>\n  </footer>\n</body>\n</html>',
    output: 'Rendered page with header, nav, main, footer',
  },
  {
    title: 'CSS Flexbox Layout',
    code: '.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n  padding: 20px;\n}\n\n.card {\n  flex: 1;\n  border-radius: 12px;\n  padding: 16px;\n}\n\n/* Center both axes */\n.center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}',
    output: 'Flex layout rendered',
  },
  {
    title: 'JavaScript ES6+ Features',
    code: '// Arrow functions\nconst add = (a, b) => a + b;\n\n// Template literals\nconst msg = `Sum: ${add(3, 4)}`;\n\n// Destructuring\nconst { name, age } = { name: "T2S", age: 1 };\n\n// Spread\nconst arr = [1, 2, ...[3, 4]];\n\n// Async/Await\nasync function getData() {\n  const res = await fetch(url);\n  return res.json();\n}\n\nconsole.log(msg); // "Sum: 7"',
    output: 'Sum: 7',
  },
  {
    title: 'DOM Manipulation',
    code: '// Select elements\nconst el = document.getElementById("app");\nconst items = document.querySelectorAll(".item");\n\n// Create & append\nconst div = document.createElement("div");\ndiv.textContent = "Hello!";\ndiv.classList.add("card");\nel.appendChild(div);\n\n// Event listener\ndiv.addEventListener("click", () => {\n  div.style.color = "red";\n});\n\n// Event delegation\nel.addEventListener("click", (e) => {\n  if (e.target.classList.contains("item")) {\n    console.log("Item clicked!");\n  }\n});',
    output: 'DOM element created & event bound',
  },
];

const webProblems: PracticeProblem[] = [
  { title: 'Build a responsive navbar with Flexbox', difficulty: 'Medium', points: 100 },
  { title: 'Create a form with HTML5 validation', difficulty: 'Easy', points: 50 },
  { title: 'Implement a todo list with vanilla JS', difficulty: 'Hard', points: 200 },
  { title: 'Write a fetch API call with error handling', difficulty: 'Medium', points: 100 },
  { title: 'Build a CSS Grid dashboard layout', difficulty: 'Medium', points: 100 },
];

const labData: Record<string, { title: string; description: string; examples: CodeExample[]; problems: PracticeProblem[] }> = {
  c: { title: 'C Programming Lab', description: 'Practice C programs, pointers, arrays, and data structures', examples: cExamples, problems: cProblems },
  sql: { title: 'SQL Lab', description: 'Write and execute SQL queries against sample databases', examples: sqlExamples, problems: sqlProblems },
  networking: { title: 'Networking Lab', description: 'Subnet calculators, OSI explorer, protocol analysis', examples: netExamples, problems: netProblems },
  os: { title: 'OS Lab', description: 'Process scheduling, memory paging, Banker\'s algorithm', examples: osExamples, problems: osProblems },
  web: { title: 'Web Lab', description: 'HTML, CSS, JavaScript playground with live concepts', examples: webExamples, problems: webProblems },
};

const difficultyColors: Record<string, string> = { Easy: '#00E676', Medium: '#FFD600', Hard: '#FF5252' };

export default function LabScreen() {
  const { colors } = useApp();
  const router = useRouter();
  const [activeSubject, setActiveSubject] = useState('c');
  const [expandedProgram, setExpandedProgram] = useState<number | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['$ t2s-lab --ready', `Loaded ${labData.c.title}`, '$ _']);
  const scrollRef = useRef<ScrollView>(null);

  const data = labData[activeSubject];
  const subjectColor = labSubjects.find((s) => s.id === activeSubject)?.color || colors.accent;

  const runExample = (example: CodeExample) => {
    const newLines = [
      `\n$ Running: ${example.title}...`,
      '...',
      `> ${example.output}`,
      '$ _',
    ];
    setTerminalOutput((prev) => [...prev, ...newLines]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const switchSubject = (id: string) => {
    setActiveSubject(id);
    setExpandedProgram(null);
    const d = labData[id];
    setTerminalOutput([`$ t2s-lab --ready`, `Loaded ${d.title}`, '$ _']);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.title, { color: colors.text }]}>Labs</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Interactive Subject Labs</Text>
          </View>
        </View>

        {/* Subject Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectScroll} contentContainerStyle={styles.subjectScrollContent}>
          {labSubjects.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.subjectPill, {
                backgroundColor: activeSubject === s.id ? s.color + '25' : colors.card,
                borderColor: activeSubject === s.id ? s.color : colors.border,
              }]}
              onPress={() => switchSubject(s.id)}
            >
              <Ionicons name={s.icon as any} size={14} color={activeSubject === s.id ? s.color : colors.textSecondary} />
              <Text style={[styles.subjectPillText, { color: activeSubject === s.id ? s.color : colors.textSecondary }]}>{s.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Terminal */}
        <LinearGradient colors={[subjectColor + '08', colors.tertiary]} style={[styles.terminal, { borderColor: subjectColor + '30' }]}>
          <View style={styles.terminalHeader}>
            <View style={styles.terminalDots}>
              <View style={[styles.dot, { backgroundColor: '#FF5F57' }]} />
              <View style={[styles.dot, { backgroundColor: '#FEBC2E' }]} />
              <View style={[styles.dot, { backgroundColor: '#28C840' }]} />
            </View>
            <Text style={[styles.terminalTitle, { color: colors.textSecondary }]}>T2S Terminal · {data.title}</Text>
          </View>
          <ScrollView
            style={[styles.terminalBody, { backgroundColor: colors.primary }]}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {terminalOutput.map((line, i) => (
              <Text key={i} style={[styles.terminalLine, { color: line.startsWith('$') ? subjectColor : line.startsWith('>') ? colors.success : colors.textSecondary }]}>
                {line}
              </Text>
            ))}
          </ScrollView>
        </LinearGradient>

        {/* Code Examples */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Examples</Text>
          {data.examples.map((example, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.programCard, { backgroundColor: colors.card, borderColor: expandedProgram === index ? subjectColor : colors.border }]}
              onPress={() => setExpandedProgram(expandedProgram === index ? null : index)}
            >
              <View style={styles.programHeader}>
                <Ionicons name="code-slash" size={18} color={subjectColor} />
                <Text style={[styles.programTitle, { color: colors.text }]}>{example.title}</Text>
                <Ionicons name={expandedProgram === index ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary} />
              </View>

              {expandedProgram === index && (
                <View style={styles.programContent}>
                  {/* Code Block */}
                  <View style={[styles.codeBlock, { backgroundColor: colors.primary, borderColor: colors.border }]}>
                    <View style={styles.codeHeader}>
                      <Text style={[styles.codeLang, { color: subjectColor }]}>{activeSubject.toUpperCase()}</Text>
                      <TouchableOpacity
                        style={[styles.codeAction, { backgroundColor: subjectColor + '20' }]}
                        onPress={() => Alert.alert('Copied!', 'Code copied to clipboard')}
                      >
                        <Ionicons name="copy" size={12} color={subjectColor} />
                        <Text style={[styles.codeActionText, { color: subjectColor }]}>Copy</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.codeText, { color: colors.text }]}>{example.code}</Text>
                  </View>

                  {/* Output Block */}
                  <View style={[styles.outputBlock, { backgroundColor: colors.tertiary, borderColor: colors.border }]}>
                    <Text style={[styles.outputLabel, { color: colors.success }]}>Expected Output:</Text>
                    <Text style={[styles.outputText, { color: colors.text }]}>{example.output}</Text>
                  </View>

                  {/* Run Button */}
                  <TouchableOpacity style={[styles.runBtn, { backgroundColor: subjectColor + '20', borderColor: subjectColor }]} onPress={() => runExample(example)}>
                    <Ionicons name="play" size={16} color={subjectColor} />
                    <Text style={[styles.runBtnText, { color: subjectColor }]}>Run in Terminal</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Practice Problems */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Practice Problems</Text>
          {data.problems.map((problem, index) => (
            <TouchableOpacity key={index} style={[styles.problemCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.problemLeft}>
                <View style={[styles.problemNumber, { backgroundColor: subjectColor + '20' }]}>
                  <Text style={[styles.problemNumberText, { color: subjectColor }]}>{index + 1}</Text>
                </View>
                <View style={styles.problemInfo}>
                  <Text style={[styles.problemTitle, { color: colors.text }]}>{problem.title}</Text>
                  <View style={styles.problemMeta}>
                    <Text style={[styles.problemDifficulty, { color: difficultyColors[problem.difficulty] || colors.textSecondary }]}>
                      {problem.difficulty}
                    </Text>
                    <Text style={[styles.problemPoints, { color: subjectColor }]}>+{problem.points} pts</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={[styles.problemBtn, { backgroundColor: subjectColor + '15' }]}>
                <Ionicons name="play" size={16} color={subjectColor} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <LinearGradient colors={[subjectColor + '10', 'transparent']} style={[styles.tipCard, { borderColor: subjectColor + '30' }]}>
            <Ionicons name="bulb" size={22} color={colors.warning} />
            <View style={styles.tipContent}>
              <Text style={[styles.tipTitle, { color: colors.text }]}>Lab Tip</Text>
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                {activeSubject === 'c' && 'Always free dynamically allocated memory. Use valgrind to detect leaks.'}
                {activeSubject === 'sql' && 'Practice JOIN queries on real datasets. Understand the difference between WHERE and HAVING.'}
                {activeSubject === 'networking' && 'Master subnetting by converting to binary first. Memorize OSI layer order.'}
                {activeSubject === 'os' && 'Practice Banker\'s algorithm step by step. Draw Gantt charts for scheduling.'}
                {activeSubject === 'web' && 'Build a mini project after each concept. Flexbox + Grid = responsive layouts.'}
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 12, gap: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1 },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 12 },
  subjectScroll: { marginBottom: 16 },
  subjectScrollContent: { paddingHorizontal: 20, gap: 8 },
  subjectPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  subjectPillText: { fontSize: 12, fontWeight: '700' },
  terminal: { marginHorizontal: 20, borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 24 },
  terminalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#2A2D35' },
  terminalDots: { flexDirection: 'row', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  terminalTitle: { fontSize: 11, fontWeight: '600' },
  terminalBody: { padding: 16, maxHeight: 180 },
  terminalLine: { fontSize: 12, fontFamily: 'Courier', marginBottom: 3, lineHeight: 18 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  programCard: { borderRadius: 14, borderWidth: 1, marginBottom: 10, overflow: 'hidden' },
  programHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  programTitle: { flex: 1, fontSize: 13, fontWeight: '600' },
  programContent: { padding: 16, paddingTop: 0 },
  codeBlock: { borderRadius: 10, borderWidth: 1, overflow: 'hidden', marginBottom: 10 },
  codeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#2A2D35' },
  codeLang: { fontSize: 11, fontWeight: '800' },
  codeAction: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  codeActionText: { fontSize: 10, fontWeight: '600' },
  codeText: { fontSize: 11, fontFamily: 'Courier', padding: 14, lineHeight: 17 },
  outputBlock: { borderRadius: 10, borderWidth: 1, padding: 12, marginBottom: 10 },
  outputLabel: { fontSize: 10, fontWeight: '700', marginBottom: 4 },
  outputText: { fontSize: 12, fontFamily: 'Courier', lineHeight: 17 },
  runBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  runBtnText: { fontSize: 13, fontWeight: '700' },
  problemCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  problemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  problemNumber: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  problemNumberText: { fontSize: 13, fontWeight: '800' },
  problemInfo: { flex: 1 },
  problemTitle: { fontSize: 12, fontWeight: '600', marginBottom: 3 },
  problemMeta: { flexDirection: 'row', gap: 10 },
  problemDifficulty: { fontSize: 10, fontWeight: '600' },
  problemPoints: { fontSize: 10, fontWeight: '700' },
  problemBtn: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  tipCard: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 14, borderWidth: 1, alignItems: 'flex-start' },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  tipText: { fontSize: 12, lineHeight: 17 },
});
