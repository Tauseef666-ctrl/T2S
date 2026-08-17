import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,
  Animated, KeyboardAvoidingView, Platform, Dimensions, Alert,
} from 'react-native';
import { useApp } from '../../src/hooks/useApp';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const InitialMessages: Message[] = [
  {
    id: '1',
    text: "Hey! I'm T2S AI — your subject-aware study assistant. Ask me anything about your Diploma CSE subjects, and I'll give you a focused, educational answer.",
    isUser: false,
    timestamp: 'Now',
  },
  {
    id: '2',
    text: "I understand these subjects deeply:\n• OS — processes, scheduling, deadlocks, memory\n• DBMS — normalization, SQL, ACID, JOINs\n• Networking — OSI, TCP/UDP, IP, DNS\n• C — pointers, arrays, structs, file I/O\n• Web — HTML, CSS, JavaScript, ES6\n• Math, Physics, Chemistry, Communication\n\nWhat would you like to learn?",
    isUser: false,
    timestamp: 'Now',
  },
];

const QuickQuestions = [
  { text: 'Explain OS scheduling', icon: 'timer' as const, color: '#00E5FF' },
  { text: 'SQL JOIN types', icon: 'git-merge' as const, color: '#7C4DFF' },
  { text: 'TCP vs UDP', icon: 'network' as const, color: '#00E676' },
  { text: 'Pointers in C', icon: 'code' as const, color: '#FFD600' },
  { text: 'CSS Flexbox', icon: 'logo-css3' as const, color: '#FF5252' },
  { text: 'Deadlock prevention', icon: 'lock-closed' as const, color: '#00E5FF' },
  { text: 'Normalization', icon: 'albums' as const, color: '#7C4DFF' },
  { text: 'OSI model layers', icon: 'layers' as const, color: '#00E676' },
];

const StudyPaths: Record<string, string> = {
  os: "Recommended OS Study Path:\n1. OS Concepts & Types (U1)\n2. Process Management & IPC (U2)\n3. CPU Scheduling Algorithms (U3)\n4. Memory Management — Paging & Segmentation (U4)\n5. File Systems & Deadlocks (U5)\n\nMaster each unit before moving on. Focus on scheduling algorithms (SJF, RR, Priority) — they're frequently tested.",
  dbms: "Recommended DBMS Study Path:\n1. DBMS Concepts & ER Diagrams (U1)\n2. SQL Basics — DDL/DML/DCL (U2)\n3. Advanced SQL — Subqueries & Views (U3)\n4. ACID Properties & Transactions (U4)\n5. Normalization up to BCNF (U5)\n\nStart with SQL basics, then practice complex queries. Normalization rules are critical for exams.",
  networking: "Recommended Networking Study Path:\n1. Network Types & Topologies (U1)\n2. Data Link Layer & MAC (U2)\n3. IP Addressing & Subnetting (U3)\n4. TCP/UDP & Transport Layer (U4)\n5. HTTP, DNS & Security (U5)\n\nMaster subnetting early — it's used in every unit. Practice OSI vs TCP/IP comparison.",
  c: "Recommended C Programming Study Path:\n1. Data Types, Operators, Control Flow (U1)\n2. Functions, Recursion & Arrays (U2)\n3. Pointers — the core topic (U3)\n4. Structures & File Handling (U4)\n5. Data Structures — Linked Lists, Stacks (U5)\n\nPointers are the most important topic. Practice daily. Build small programs for each concept.",
  web: "Recommended Web Tech Study Path:\n1. HTML Structure & Semantic Elements (U1)\n2. CSS — Box Model, Flexbox, Grid (U2)\n3. JavaScript Basics & DOM (U3)\n4. ES6+ & Fetch API (U4)\n5. Web Security & Hosting (U5)\n\nBuild a mini project after each unit. Practice CSS layouts daily — employers test Flexbox/Grid heavily.",
};

const AIResponses: Record<string, string> = {
  scheduling: "**CPU Scheduling Algorithms:**\n\n1. **FCFS** (First Come First Served)\n   - Simple, non-preemptive\n   - Tasks execute in arrival order\n   - Can cause convoy effect\n\n2. **SJF** (Shortest Job First)\n   - Minimum average waiting time\n   - Preemptive version: SRTF (Shortest Remaining Time First)\n   - Can cause starvation of long processes\n\n3. **Round Robin**\n   - Each process gets a fixed time quantum (e.g., 4ms)\n   - Fair, preemptive\n   - Quantum too large → FCFS; too small → too many context switches\n\n4. **Priority Scheduling**\n   - Each process has a priority value\n   - Lower priority number = higher priority\n   - Can cause starvation → solved by aging\n\n5. **Multilevel Queue**\n   - Separate queues for different process types\n   - Foreground (interactive) vs Background (batch)\n\n**Key Formula:**\nAverage Waiting Time = Σ(wait times) / n\nAverage Turnaround Time = Σ(turnaround times) / n\n\n**Exam tip:** SJF gives optimal average waiting time!",

  sql: "**SQL JOIN Types — Complete Guide:**\n\n```sql\n-- INNER JOIN: Only matching rows\nSELECT s.name, c.course\nFROM students s INNER JOIN courses c\nON s.id = c.student_id;\n\n-- LEFT JOIN: All from left + matching from right\nSELECT s.name, c.course\nFROM students s LEFT JOIN courses c\nON s.id = c.student_id;\n\n-- RIGHT JOIN: All from right + matching from left\nSELECT s.name, c.course\nFROM students s RIGHT JOIN courses c\nON s.id = c.student_id;\n\n-- FULL OUTER JOIN: All from both\nSELECT * FROM s FULL OUTER JOIN c\nON s.id = c.student_id;\n\n-- SELF JOIN: Table joined with itself\nSELECT a.name, b.name AS friend\nFROM friends a, friends b\nWHERE a.id <> b.id;\n```\n\n**Remember:**\n- INNER = Intersection of sets\n- LEFT = A ∪ (A ∩ B)\n- FULL = A ∪ B\n\nPractice: Write a query to find students who haven't enrolled in any course (LEFT JOIN + WHERE NULL).",

  tcp: "**TCP vs UDP — Deep Dive:**\n\n| Feature | TCP | UDP |\n|---------|-----|-----|\n| Connection | 3-way handshake | Connectionless |\n| Reliability | Guaranteed delivery | Best effort |\n| Ordering | Byte-stream, ordered | Datagrams, unordered |\n| Speed | Slower (overhead) | Faster (no overhead) |\n| Header size | 20-60 bytes | 8 bytes |\n| Flow control | Yes (sliding window) | No |\n| Error checking | Checksum + ACK | Checksum only |\n| Use cases | Web, Email, FTP, SSH | DNS, VoIP, Gaming, Streaming |\n\n**TCP 3-Way Handshake:**\n1. Client → SYN (seq=x)\n2. Server → SYN-ACK (seq=y, ack=x+1)\n3. Client → ACK (ack=y+1)\n\n**TCP 4-Way Termination:**\n1. Client → FIN\n2. Server → ACK\n3. Server → FIN\n4. Client → ACK\n\n**Why UDP for gaming?** Low latency matters more than reliability. A dropped packet is better than waiting.",

  pointer: "**Pointers in C — Master Guide:**\n\n```c\n// Declaration & Basics\nint x = 10;\nint *ptr = &x;  // ptr stores address of x\nprintf(\"%d\", *ptr);  // Dereference: prints 10\nprintf(\"%p\", (void*)ptr);  // Prints address\n\n// Pointer Arithmetic\nint arr[] = {10, 20, 30, 40, 50};\nint *p = arr;       // Points to arr[0]\n*(p + 2);          // = arr[2] = 30\np++;                // Points to arr[1]\n\n// Pointers & Functions (pass by reference)\nvoid swap(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\n// Dynamic Memory Allocation\nint *p = (int*)malloc(5 * sizeof(int));  // 5 ints\nint *q = (int*)calloc(5, sizeof(int));  // 5 ints, init to 0\np = (int*)realloc(p, 10 * sizeof(int)); // Resize\nfree(p);  // MUST free!\n\n// Pointer to Pointer\nint x = 5;\nint *p = &x;\nint **pp = &p;  // pp -> p -> x\n```\n\n**Common Mistakes:**\n1. Dereferencing NULL pointer\n2. Using memory after free()\n3. Memory leaks (forgetting free)\n4. Dangling pointers\n\n**Exam question:** What is the output of pointer arithmetic on arrays vs single variables?",

  flexbox: "**CSS Flexbox — Complete Reference:**\n\n```css\n/* Container Properties */\n.container {\n  display: flex;\n  flex-direction: row;     /* row | column | row-reverse */\n  flex-wrap: wrap;          /* nowrap | wrap | wrap-reverse */\n  justify-content: center;  /* main axis */\n  align-items: center;      /* cross axis */\n  align-content: flex-start; /* multi-line cross axis */\n  gap: 10px;\n}\n\n/* Item Properties */\n.item {\n  flex: 1;           /* grow shrink basis */\n  flex-grow: 0;\n  flex-shrink: 1;\n  flex-basis: auto;\n  align-self: flex-end;\n  order: 2;\n}\n```\n\n**justify-content values:**\n- flex-start | flex-end | center\n- space-between | space-around | space-evenly\n\n**align-items values:**\n- flex-start | flex-end | center | stretch | baseline\n\n**Pro tips:**\n- `flex: 1` = `flex: 1 1 0%`\n- `flex: 0 0 auto` = fixed size\n- Use `gap` instead of margins\n- `margin-left: auto` pushes item to right\n\n**Common exam question:** Center a div both vertically and horizontally? → Use flexbox with justify-content: center + align-items: center on the parent.",

  deadlock: "**Deadlocks in OS:**\n\n**Four Necessary Conditions (Coffman):**\n1. **Mutual Exclusion** — Resource held exclusively\n2. **Hold and Wait** — Process holds resource while waiting\n3. **No Preemption** — Resources can't be forcibly taken\n4. **Circular Wait** — Cycle in resource allocation graph\n\n**Deadlock Handling Methods:**\n\n**Prevention** — Break one of the four conditions:\n- Mutual Exclusion: Use sharable resources (impossible for printers)\n- Hold & Wait: Request all resources at start\n- No Preemption: Allow OS to revoke resources\n- Circular Wait: Impose linear ordering on resources\n\n**Avoidance** — Banker's Algorithm:\n- OS checks if granting a resource request is safe\n- Safe state: exists a safe sequence where all processes can complete\n\n**Detection & Recovery:**\n- Allow deadlocks, detect them, then recover\n- Detection: Wait-for graph (single instance) or Resource Allocation Graph\n- Recovery: Kill processes or preempt resources\n\n**Banker's Algorithm:** Available ≥ Request? Then check if resulting state is safe.",

  normalization: "**Database Normalization:**\n\n**Purpose:** Eliminate redundancy & anomalies (insert, update, delete)\n\n**1NF (First Normal Form):**\n- All attributes are atomic (no multi-valued, no nested tables)\n- Each row is unique\n\n**2NF (Second Normal Form):**\n- Already in 1NF\n- No partial dependency (non-key attribute depends on FULL primary key)\n\n**3NF (Third Normal Form):**\n- Already in 2NF\n- No transitive dependency (non-key → non-key)\n\n**BCNF (Boyce-Codd Normal Form):**\n- Already in 3NF\n- For every functional dependency X→Y, X must be a superkey\n\n**Example:**\nTable: Student(StudentID, Name, DeptID, DeptName)\n- DeptName depends on DeptID (transitive: StudentID→DeptID→DeptName)\n- Fix: Move DeptName to Department table\n\n**Memory trick:** 1NF = atomic, 2NF = no partial, 3NF = no transitive, BCNF = every determinant is a key.",

  osi: "**OSI Model — 7 Layers (Top to Bottom):**\n\n| Layer | Name | PDU | Protocols | Key Function |\n|-------|------|-----|-----------|--------------|\n| 7 | Application | Data | HTTP, FTP, SMTP, DNS | User interface |\n| 6 | Presentation | Data | SSL/TLS, JPEG, ASCII | Encryption, compression |\n| 5 | Session | Data | NetBIOS, RPC | Session management |\n| 4 | Transport | Segment | TCP, UDP | End-to-end delivery |\n| 3 | Packet | Packet | IP, ICMP, ARP | Routing, addressing |\n| 2 | Data Link | Frame | Ethernet, WiFi | MAC addressing, error detection |\n| 1 | Physical | Bits | USB, Bluetooth | Raw bit transmission |\n\n**Remember: All People Seem To Need Data Processing** (7→1)\n\n**TCP/IP Model mapping:**\n- Application layer = OSI layers 5, 6, 7\n- Transport layer = OSI layer 4\n- Internet layer = OSI layer 3\n- Network Access = OSI layers 1, 2\n\n**PDU:** Data → Segment → Packet → Frame → Bits\n\n**Exam trick:** At which layer does encryption happen? → Presentation (Layer 6).",

  acid: "**ACID Properties in DBMS:**\n\n**A — Atomicity**\n- All or nothing transaction\n- Either all operations complete or none do\n- Example: Bank transfer — debit AND credit must both happen\n\n**C — Consistency**\n- Database moves from one valid state to another\n- Constraints (CHECK, FOREIGN KEY) are always satisfied\n- Example: Account balance can't go negative if constraint exists\n\n**I — Isolation**\n- Concurrent transactions don't interfere with each other\n- Level 0-3: Read Uncommitted → Read Committed → Repeatable Read → Serializable\n- Issues: Dirty reads, non-repeatable reads, phantom reads\n\n**D — Durability**\n- Once committed, changes persist even after crash\n- Implemented via write-ahead logging (WAL)\n\n**Isolation Anomalies:**\n- Dirty Read: T2 reads uncommitted data from T1\n- Non-repeatable Read: T1 reads same row twice, gets different values\n- Phantom Read: T1 runs query twice, second time has new rows\n\n**Implementation:** Logging, locking, MVCC (Multi-Version Concurrency Control)",

  c_arrays: "**Arrays in C — Complete Guide:**\n\n```c\n// Declaration & Initialization\nint arr[5];                    // Uninitialized\nint arr[5] = {1, 2, 3, 4, 5}; // Initialized\nint arr[] = {1, 2, 3};        // Size inferred: 3\n\n// Array & Pointer Relationship\nint arr[5] = {10, 20, 30, 40, 50};\nint *p = arr;      // arr decays to pointer to arr[0]\narr[i] == *(arr + i) == *(p + i) == p[i]\n\n// 2D Arrays\nint mat[3][4];\nmat[1][2] = 42;\n// Access: *(mat + row*cols + col)\n\n// String Arrays\nchar names[][20] = {\"Alice\", \"Bob\", \"Charlie\"};\n\n// Passing Arrays to Functions\nvoid printArr(int arr[], int size) {\n    for(int i = 0; i < size; i++)\n        printf(\"%d \", arr[i]);\n}\n\n// Matrix Multiplication\nvoid multiply(int A[][N], int B[][N], int C[][N]) {\n    for(int i = 0; i < N; i++)\n        for(int j = 0; j < N; j++) {\n            C[i][j] = 0;\n            for(int k = 0; k < N; k++)\n                C[i][j] += A[i][k] * B[k][j];\n        }\n}\n```\n\n**Key facts:**\n- Array name is a constant pointer (can't reassign)\n- Arrays are 0-indexed\n- sizeof(arr) = total bytes = element_size × number_of_elements\n- Arrays are stored in contiguous memory",

  html: "**HTML Semantic Elements & Structure:**\n\n```html\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Page Title</title>\n</head>\n<body>\n  <header>     <!-- Site header, nav -->\n    <nav>      <!-- Navigation links -->\n  </header>\n  \n  <main>       <!-- Main content -->\n    <article>  <!-- Self-contained content -->\n      <section><!-- Thematic grouping -->\n        <h2>Heading</h2>\n        <p>Content...</p>\n      </section>\n    </article>\n    <aside>    <!-- Sidebar content -->\n  </aside>\n  \n  <footer>     <!-- Site footer -->\n  </footer>\n</body>\n</html>\n```\n\n**Why semantic HTML?**\n- Accessibility (screen readers understand structure)\n- SEO (search engines index content better)\n- Readability (developers understand code faster)\n\n**Key semantic elements:**\n- header, nav, main, article, section, aside, footer\n- figure, figcaption\n- details, summary\n- mark, time, address\n\n**Form validation:** Use required, pattern, type, min, max attributes.",

  es6: "**JavaScript ES6+ Features:**\n\n```js\n// 1. let & const (block scope)\nlet x = 10;       // mutable\nconst y = 20;     // immutable binding\n\n// 2. Arrow Functions\nconst add = (a, b) => a + b;\nconst square = n => n * n;  // single param\n\n// 3. Template Literals\nconst name = 'T2S';\nconsole.log(`Hello, ${name}!`);\n\n// 4. Destructuring\nconst { name, age } = person;\nconst [first, second] = [1, 2, 3];\n\n// 5. Spread/Rest\nconst arr2 = [...arr1, 4, 5];\nconst { id, ...rest } = obj;\nfunction sum(...nums) { return nums.reduce((a,b) => a+b); }\n\n// 6. Promises & async/await\nasync function fetchData() {\n  try {\n    const res = await fetch(url);\n    const data = await res.json();\n  } catch (err) {\n    console.error(err);\n  }\n}\n\n// 7. Optional Chaining & Nullish\nuser?.address?.city\nvalue ?? 'default'\n\n// 8. Map, Set, WeakMap\nconst map = new Map();\nmap.set('key', 'value');\nconst set = new Set([1, 2, 3, 3]); // {1, 2, 3}\n\n// 9. Classes\nclass Animal {\n  constructor(name) { this.name = name; }\n  speak() { return `${this.name} makes a sound`; }\n}\n```\n\n**Exam favorite:** What's the difference between `var`, `let`, and `const`? → Scope, hoisting, reassignment.",

  calculus: "**Calculus — Key Concepts:**\n\n**Differentiation:**\n- Power Rule: d/dx(x^n) = nx^(n-1)\n- Product Rule: d/dx(uv) = u'v + uv'\n- Chain Rule: d/dx(f(g(x))) = f'(g(x)) * g'(x)\n\n**Applications:**\n- Max/Min: Set f'(x) = 0, check sign change\n- Rate of change problems\n- Tangent line: y - y₁ = f'(x₁)(x - x₁)\n\n**Integration:**\n- ∫x^n dx = x^(n+1)/(n+1) + C\n- ∫(1/x) dx = ln|x| + C\n- ∫e^x dx = e^x + C\n- ∫sin(x) dx = -cos(x) + C\n\n**Theorems:**\n- Mean Value Theorem: f'(c) = [f(b)-f(a)]/(b-a)\n- Rolle's Theorem: f'(c) = 0 if f(a) = f(b)\n\n**Differential Equations (Basics):**\n- Variable separable: ∫f(y)dy = ∫g(x)dx\n- Homogeneous: substitute y = vx\n- Linear: IF = e^(∫P dx)\n\n**Remember:** Integration is the reverse of differentiation!",

  newton: "**Newton's Laws & Applications:**\n\n**1st Law (Inertia):**\nAn object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force.\n\n**2nd Law:**\nF = ma → Force = mass × acceleration\nSI Unit: Newton (N) = kg·m/s²\n\n**3rd Law:**\nFor every action, there is an equal and opposite reaction.\nF₁₂ = -F₂₁\n\n**Applications:**\n- Free body diagrams: Draw all forces on object\n- Inclined plane: mg sinθ (down), mg cosθ (normal)\n- Friction: f ≤ μN (static), f = μN (kinetic)\n- Circular motion: F = mv²/r (centripetal)\n\n**Work-Energy:**\nW = F·d·cosθ\nKE = ½mv²\nPE = mgh\nWork-Energy Theorem: W_net = ΔKE\n\n**Conservation of Energy:**\nKE₁ + PE₁ = KE₂ + PE₂ (when only conservative forces act)",

  atomic: "**Atomic Structure:**\n\n**Bohr's Model:**\n- Electrons orbit in fixed energy levels\n- Energy of nth orbit: En = -13.6/n² eV\n- Hydrogen spectrum: 1/λ = R(1/n₁² - 1/n₂²)\n\n**Electronic Configuration:**\n- Aufbau principle: fill lowest energy first\n- Pauli exclusion: max 2 electrons per orbital\n- Hund's rule: fill orbitals singly first\n\n**Orbital shapes:**\n- s: spherical (l=0)\n- p: dumbbell (l=1)\n- d: clover (l=2)\n\n**Quantum Numbers:**\n- n (principal): shell number\n- l (azimuthal): subshell (0 to n-1)\n- m (magnetic): orbital (-l to +l)\n- s (spin): ±½\n\n**Chemical Bonding:**\n- Ionic: transfer of electrons (NaCl)\n- Covalent: sharing of electrons (H₂O)\n- Metallic: electron sea model (Fe)\n\n**VSEPR Theory:**\n- Predicts molecular geometry\n- 2 pairs → linear\n- 3 pairs → trigonal planar\n- 4 pairs → tetrahedral",

  communication: "**Communication Skills — Key Topics:**\n\n**Communication Process:**\nSender → Encoding → Message → Channel → Decoding → Receiver → Feedback\n\n**Types of Communication:**\n1. Verbal (oral & written)\n2. Non-verbal (body language, gestures, facial expressions)\n3. Visual (charts, graphs, infographics)\n\n**Barriers to Communication:**\n- Physical: noise, distance, technology\n- Psychological: prejudice, emotions, assumptions\n- Semantic: jargon, language differences\n- Organizational: hierarchy, information overload\n\n**Active Listening:**\n- Pay full attention\n- Show you're listening (nod, eye contact)\n- Provide feedback\n- Defer judgment\n- Respond appropriately\n\n**Technical Presentation Tips:**\n- Start with an attention-grabber\n- Structure: Introduction → Body → Conclusion\n- Use visual aids\n- Maintain eye contact\n- Practice time management\n- Handle Q&A confidently\n\n**Business Writing:**\n- 7 Cs: Clear, Concise, Concrete, Correct, Coherent, Complete, Courteous",

  subnetting: "**IP Subnetting — Quick Guide:**\n\n**IP Address Classes:**\n| Class | Range | Default Mask |\n|-------|-------|-------------|\n| A | 1.0.0.0 - 126.255.255.255 | 255.0.0.0 (/8) |\n| B | 128.0.0.0 - 191.255.255.255 | 255.255.0.0 (/16) |\n| C | 192.0.0.0 - 223.255.255.255 | 255.255.255.0 (/24) |\n\n**Subnetting Steps:**\n1. Determine needed subnets: 2^n ≥ needed subnets\n2. Determine hosts per subnet: 2^h - 2 ≥ needed hosts\n3. New subnet mask: n = borrowed bits, h = remaining bits\n\n**Example:** 192.168.1.0/26\n- Subnet mask: 255.255.255.192\n- Number of subnets: 2^2 = 4\n- Hosts per subnet: 2^6 - 2 = 62\n- Subnets: .0, .64, .128, .192\n\n**CIDR:** /24 = 255.255.255.0 = 256 addresses\n\n**Private IP ranges:**\n- 10.0.0.0/8\n- 172.16.0.0/12\n- 192.168.0.0/16\n\n**Exam trick:** /28 = 16 addresses, /27 = 32, /26 = 64, /25 = 128",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();

  // OS topics
  if (lower.includes('schedul') || lower.includes('fcfs') || lower.includes('sjf') || lower.includes('round robin')) return AIResponses.scheduling;
  if (lower.includes('deadlock') || lower.includes('semaphore') || lower.includes('mutex')) return AIResponses.deadlock;

  // DBMS topics
  if (lower.includes('join') || lower.includes('sql') || lower.includes('select') || lower.includes('insert')) return AIResponses.sql;
  if (lower.includes('normali') || lower.includes('1nf') || lower.includes('2nf') || lower.includes('3nf') || lower.includes('bcnf')) return AIResponses.normalization;
  if (lower.includes('acid') || lower.includes('transaction') || lower.includes('concurrency')) return AIResponses.acid;

  // Networking topics
  if (lower.includes('tcp') || lower.includes('udp')) return AIResponses.tcp;
  if (lower.includes('osi') || lower.includes('tcp/ip') || lower.includes('layer')) return AIResponses.osi;
  if (lower.includes('subnet') || lower.includes('ip address') || lower.includes('cidr')) return AIResponses.subnetting;

  // C topics
  if (lower.includes('pointer') || lower.includes('malloc') || lower.includes('dynamic') || lower.includes('memory leak')) return AIResponses.pointer;
  if (lower.includes('array') || lower.includes('matrix') || lower.includes('2d')) return AIResponses.c_arrays;

  // Web topics
  if (lower.includes('flex') || lower.includes('css') || lower.includes('grid') || lower.includes('layout')) return AIResponses.flexbox;
  if (lower.includes('html') || lower.includes('semantic') || lower.includes('dom') || lower.includes('element')) return AIResponses.html;
  if (lower.includes('es6') || lower.includes('javascript') || lower.includes('js') || lower.includes('promise') || lower.includes('async') || lower.includes('arrow')) return AIResponses.es6;

  // Math topics
  if (lower.includes('calc') || lower.includes('deriv') || lower.includes('integral') || lower.includes('differential')) return AIResponses.calculus;

  // Physics topics
  if (lower.includes('newton') || lower.includes('force') || lower.includes('motion') || lower.includes('energy') || lower.includes('wave')) return AIResponses.newton;

  // Chemistry topics
  if (lower.includes('atomic') || lower.includes('bond') || lower.includes('electron') || lower.includes('orbital')) return AIResponses.atomic;

  // Communication topics
  if (lower.includes('communication') || lower.includes('presentation') || lower.includes('barrier') || lower.includes('listening')) return AIResponses.communication;

  // Study path
  if (lower.includes('study path') || lower.includes('study order') || lower.includes('study plan')) {
    return "Which subject should I create a study path for?\n\n• Type 'OS study path'\n• Type 'DBMS study path'\n• Type 'Networking study path'\n• Type 'C study path'\n• Type 'Web study path'";
  }

  // Generic fallback
  return `Great question! Let me help you understand "${input}".\n\nHere are some things I can explain in depth:\n\n**Operating Systems:** scheduling, deadlocks, memory management, semaphores\n**DBMS:** SQL queries, normalization, ACID, JOINs, indexing\n**Networking:** OSI model, TCP/UDP, subnetting, DNS, HTTP\n**C Programming:** pointers, arrays, structs, file I/O, dynamic memory\n**Web Tech:** HTML semantics, CSS Flexbox/Grid, JavaScript ES6+, closures\n**Science:** Newton's laws, atomic structure, bonding, calculus\n**Communication:** presentation skills, barriers, active listening\n\nTry asking about any specific topic and I'll give you a detailed, exam-ready explanation! 📚`;
}

function TypingIndicator({ colors }: { colors: any }) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (val: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      );
    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);

  const y1 = dot1.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  const y2 = dot2.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  const y3 = dot3.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });

  return (
    <View style={[styles.typingWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.aiMsgAvatar, { backgroundColor: colors.accentSecondary + '20' }]}>
        <Ionicons name="sparkles" size={14} color={colors.accentSecondary} />
      </View>
      <View style={styles.typingDots}>
        <Animated.View style={[styles.typingDot, { backgroundColor: colors.textSecondary, transform: [{ translateY: y1 }] }]} />
        <Animated.View style={[styles.typingDot, { backgroundColor: colors.textSecondary, transform: [{ translateY: y2 }] }]} />
        <Animated.View style={[styles.typingDot, { backgroundColor: colors.textSecondary, transform: [{ translateY: y3 }] }]} />
      </View>
    </View>
  );
}

export default function AIScreen() {
  const { colors, dispatch } = useApp();
  const [messages, setMessages] = useState<Message[]>(InitialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showStudyPath, setShowStudyPath] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: msg,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(msg);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1400);
  };

  const sendStudyPath = (subject: string) => {
    setShowStudyPath(false);
    const userMsg: Message = {
      id: Date.now().toString(),
      text: `Give me the ${subject} study path`,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: StudyPaths[subject] || "Please specify: os, dbms, networking, c, or web.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const saveAsNote = (msg: Message) => {
    dispatch({
      type: 'ADD_NOTE',
      payload: {
        id: `n${Date.now()}`,
        title: `AI: ${msg.text.substring(0, 40)}...`,
        content: msg.text,
        subject: '',
        unit: '',
        tags: ['ai-generated'],
        type: 'personal',
        createdAt: new Date().toISOString().split('T')[0],
        isImportant: false,
        isShared: false,
      },
    });
    Alert.alert('Saved!', 'Message saved as a personal note.');
  };

  const clearChat = () => {
    Alert.alert('Clear Chat', 'Clear all messages?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          setMessages([
            {
              id: 'c1',
              text: "Chat cleared. Ask me anything about your subjects!",
              isUser: false,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.primary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={[styles.aiAvatar, { backgroundColor: colors.accentSecondary + '20', borderColor: colors.accentSecondary }]}>
          <Ionicons name="sparkles" size={22} color={colors.accentSecondary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>T2S AI</Text>
          <Text style={[styles.status, { color: colors.success }]}>Subject-Aware · Ready</Text>
        </View>
        <TouchableOpacity style={[styles.clearBtn, { backgroundColor: colors.error + '15' }]} onPress={clearChat}>
          <Ionicons name="trash-outline" size={18} color={colors.error} />
        </TouchableOpacity>
      </View>

      {/* Study Path Button */}
      <TouchableOpacity
        style={[styles.studyPathBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => setShowStudyPath(!showStudyPath)}
      >
        <Ionicons name="map" size={16} color={colors.accent} />
        <Text style={[styles.studyPathText, { color: colors.text }]}>Study Path</Text>
        <Ionicons name={showStudyPath ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary} />
      </TouchableOpacity>

      {showStudyPath && (
        <View style={[styles.studyPathGrid, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          {Object.keys(StudyPaths).map((subject) => (
            <TouchableOpacity
              key={subject}
              style={[styles.studyPathChip, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => sendStudyPath(subject)}
            >
              <Text style={[styles.studyPathChipText, { color: colors.text }]}>{subject.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[styles.messageBubble, msg.isUser ? styles.userBubble : styles.aiBubble,
              { backgroundColor: msg.isUser ? colors.accent + '15' : colors.card, borderColor: msg.isUser ? colors.accent + '30' : colors.border }]}
          >
            {!msg.isUser && (
              <View style={[styles.aiMsgAvatar, { backgroundColor: colors.accentSecondary + '20' }]}>
                <Ionicons name="sparkles" size={14} color={colors.accentSecondary} />
              </View>
            )}
            <View style={styles.messageContent}>
              <Text style={[styles.messageText, { color: colors.text }]}>{msg.text}</Text>
              <View style={styles.messageFooter}>
                <Text style={[styles.timestamp, { color: colors.textSecondary }]}>{msg.timestamp}</Text>
                {!msg.isUser && (
                  <TouchableOpacity style={[styles.saveMsgBtn, { backgroundColor: colors.accent + '15' }]} onPress={() => saveAsNote(msg)}>
                    <Ionicons name="bookmark-outline" size={12} color={colors.accent} />
                    <Text style={[styles.saveMsgText, { color: colors.accent }]}>Save</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
        {isTyping && <TypingIndicator colors={colors} />}
      </ScrollView>

      {/* Quick Questions */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickContainer} contentContainerStyle={styles.quickContent}>
        {QuickQuestions.map((qp, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.quickChip, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => sendMessage(qp.text)}
          >
            <Ionicons name={qp.icon as any} size={13} color={qp.color} />
            <Text style={[styles.quickChipText, { color: colors.text }]}>{qp.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about any subject..."
          placeholderTextColor={colors.textSecondary}
          onSubmitEditing={() => sendMessage()}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: input.trim() ? colors.accent : colors.border }]}
          onPress={() => sendMessage()}
          disabled={!input.trim()}
        >
          <Ionicons name="send" size={18} color={input.trim() ? '#050505' : colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 12, borderBottomWidth: 1,
  },
  aiAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  title: { fontSize: 17, fontWeight: '800' },
  status: { fontSize: 11, fontWeight: '500' },
  clearBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  studyPathBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 20, marginTop: 10, marginBottom: 6,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1,
  },
  studyPathText: { flex: 1, fontSize: 13, fontWeight: '700' },
  studyPathGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
    marginHorizontal: 20, marginBottom: 10, padding: 12, borderRadius: 12, borderWidth: 1,
  },
  studyPathChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  studyPathChipText: { fontSize: 12, fontWeight: '700' },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 20, gap: 14 },
  messageBubble: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 16, borderWidth: 1, maxWidth: '92%' },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  aiMsgAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  messageContent: { flex: 1 },
  messageText: { fontSize: 13.5, lineHeight: 20 },
  messageFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  timestamp: { fontSize: 10 },
  saveMsgBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  saveMsgText: { fontSize: 10, fontWeight: '600' },
  typingWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 16, borderWidth: 1, alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  typingDots: { flexDirection: 'row', gap: 4 },
  typingDot: { width: 7, height: 7, borderRadius: 4 },
  quickContainer: { maxHeight: 46, marginBottom: 6 },
  quickContent: { paddingHorizontal: 20, gap: 8 },
  quickChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 18, borderWidth: 1 },
  quickChipText: { fontSize: 11, fontWeight: '600' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 20, marginTop: 8, borderRadius: 16, borderWidth: 1, paddingLeft: 16 },
  input: { flex: 1, height: 48, fontSize: 14 },
  sendBtn: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 6 },
});
