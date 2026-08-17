export interface Unit {
  id: string;
  title: string;
  topics: string[];
  completedTopics: number;
  totalTopics: number;
  questionsAttempted: number;
  totalQuestions: number;
}

export interface Subject {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  units: Unit[];
  description: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  accentColor: string;
  progress: number;
  completedTopics: number;
  totalTopics: number;
  quizScore: number;
  studyHours: number;
  badges: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: string;
  unit: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  unit: string;
  tags: string[];
  type: 'personal' | 'study';
  createdAt: string;
  isImportant: boolean;
  isShared: boolean;
}

export const Friends: Friend[] = [
  {
    id: 'f1',
    name: 'Friend 01',
    avatar: 'F1',
    accentColor: '#00E5FF',
    progress: 70,
    completedTopics: 42,
    totalTopics: 60,
    quizScore: 85,
    studyHours: 120,
    badges: ['Early Bird', 'Quiz Master', 'Night Owl'],
  },
  {
    id: 'f2',
    name: 'Friend 02',
    avatar: 'F2',
    accentColor: '#7C4DFF',
    progress: 63,
    completedTopics: 38,
    totalTopics: 60,
    quizScore: 78,
    studyHours: 95,
    badges: ['Streak King', 'Team Player'],
  },
  {
    id: 'f3',
    name: 'Friend 03',
    avatar: 'F3',
    accentColor: '#00E676',
    progress: 71,
    completedTopics: 43,
    totalTopics: 60,
    quizScore: 82,
    studyHours: 110,
    badges: ['Top Scorer', 'Coder', 'Note Taker'],
  },
];

export const Semester3Subjects: Subject[] = [
  {
    id: 'os',
    name: 'Operating System',
    shortName: 'OS',
    icon: '💻',
    color: '#00E5FF',
    description: 'Process management, memory management, file systems, and more',
    units: [
      {
        id: 'os-u1',
        title: 'UNIT 01 — Introduction to OS',
        topics: ['OS Concepts', 'Types of OS', 'OS Structure', 'System Calls', 'OS Operations'],
        completedTopics: 4,
        totalTopics: 5,
        questionsAttempted: 12,
        totalQuestions: 20,
      },
      {
        id: 'os-u2',
        title: 'UNIT 02 — Process Management',
        topics: ['Process Concept', 'Process Scheduling', 'Operations on Processes', 'Interprocess Communication', 'Threads'],
        completedTopics: 3,
        totalTopics: 5,
        questionsAttempted: 8,
        totalQuestions: 20,
      },
      {
        id: 'os-u3',
        title: 'UNIT 03 — CPU Scheduling',
        topics: ['Scheduling Concepts', 'Scheduling Algorithms', 'Multilevel Queue', 'Thread Scheduling', 'Real-Time Scheduling'],
        completedTopics: 2,
        totalTopics: 5,
        questionsAttempted: 5,
        totalQuestions: 18,
      },
      {
        id: 'os-u4',
        title: 'UNIT 04 — Memory Management',
        topics: ['Background', 'Swapping', 'Contiguous Allocation', 'Paging', 'Segmentation'],
        completedTopics: 1,
        totalTopics: 5,
        questionsAttempted: 3,
        totalQuestions: 20,
      },
      {
        id: 'os-u5',
        title: 'UNIT 05 — File System & Deadlocks',
        topics: ['File Concepts', 'Directory Structure', 'Deadlocks', 'Deadlock Prevention', 'Deadlock Avoidance'],
        completedTopics: 0,
        totalTopics: 5,
        questionsAttempted: 0,
        totalQuestions: 18,
      },
    ],
  },
  {
    id: 'dbms',
    name: 'Database Management System',
    shortName: 'DBMS',
    icon: '🗄️',
    color: '#7C4DFF',
    description: 'Relational databases, SQL, normalization, and transaction management',
    units: [
      {
        id: 'dbms-u1',
        title: 'UNIT 01 — Introduction to DBMS',
        topics: ['DBMS Concepts', 'Database Models', 'Relational Model', 'ER Diagrams', 'Normalization'],
        completedTopics: 4,
        totalTopics: 5,
        questionsAttempted: 15,
        totalQuestions: 20,
      },
      {
        id: 'dbms-u2',
        title: 'UNIT 02 — SQL Basics',
        topics: ['DDL Commands', 'DML Commands', 'DCL Commands', 'TCL Commands', 'Joins'],
        completedTopics: 3,
        totalTopics: 5,
        questionsAttempted: 10,
        totalQuestions: 20,
      },
      {
        id: 'dbms-u3',
        title: 'UNIT 03 — Advanced SQL',
        topics: ['Subqueries', 'Views', 'Indexes', 'Stored Procedures', 'Triggers'],
        completedTopics: 2,
        totalTopics: 5,
        questionsAttempted: 6,
        totalQuestions: 18,
      },
      {
        id: 'dbms-u4',
        title: 'UNIT 04 — Transaction Management',
        topics: ['ACID Properties', 'Transaction Control', 'Concurrency Control', 'Locking', 'Recovery'],
        completedTopics: 1,
        totalTopics: 5,
        questionsAttempted: 3,
        totalQuestions: 20,
      },
      {
        id: 'dbms-u5',
        title: 'UNIT 05 — Advanced Concepts',
        topics: ['Normalization Forms', 'Functional Dependencies', 'BCNF', 'NoSQL Introduction', 'Database Security'],
        completedTopics: 0,
        totalTopics: 5,
        questionsAttempted: 0,
        totalQuestions: 16,
      },
    ],
  },
  {
    id: 'networking',
    name: 'Computer Networking',
    shortName: 'NET',
    icon: '🌐',
    color: '#00E676',
    description: 'Network models, protocols, TCP/IP, and network security',
    units: [
      {
        id: 'net-u1',
        title: 'UNIT 01 — Network Basics',
        topics: ['Network Types', 'Topologies', 'OSI Model', 'TCP/IP Model', 'Network Devices'],
        completedTopics: 3,
        totalTopics: 5,
        questionsAttempted: 10,
        totalQuestions: 20,
      },
      {
        id: 'net-u2',
        title: 'UNIT 02 — Data Link Layer',
        topics: ['Framing', 'Error Detection', 'Flow Control', 'MAC Addresses', 'Switches'],
        completedTopics: 2,
        totalTopics: 5,
        questionsAttempted: 6,
        totalQuestions: 18,
      },
      {
        id: 'net-u3',
        title: 'UNIT 03 — Network Layer',
        topics: ['IP Addressing', 'Subnetting', 'Routing', 'ICMP', 'ARP'],
        completedTopics: 2,
        totalTopics: 5,
        questionsAttempted: 8,
        totalQuestions: 20,
      },
      {
        id: 'net-u4',
        title: 'UNIT 04 — Transport Layer',
        topics: ['TCP', 'UDP', 'Port Numbers', 'Flow Control', 'Congestion Control'],
        completedTopics: 1,
        totalTopics: 5,
        questionsAttempted: 3,
        totalQuestions: 18,
      },
      {
        id: 'net-u5',
        title: 'UNIT 05 — Application Layer & Security',
        topics: ['HTTP/HTTPS', 'DNS', 'FTP', 'SMTP', 'Network Security'],
        completedTopics: 0,
        totalTopics: 5,
        questionsAttempted: 0,
        totalQuestions: 16,
      },
    ],
  },
  {
    id: 'c',
    name: 'Computer Programming Using C',
    shortName: 'C',
    icon: '⌨️',
    color: '#FFD600',
    description: 'C programming fundamentals, data structures, and algorithms',
    units: [
      {
        id: 'c-u1',
        title: 'UNIT 01 — C Basics',
        topics: ['Data Types', 'Variables', 'Operators', 'Input/Output', 'Control Flow'],
        completedTopics: 5,
        totalTopics: 5,
        questionsAttempted: 20,
        totalQuestions: 20,
      },
      {
        id: 'c-u2',
        title: 'UNIT 02 — Functions & Arrays',
        topics: ['Functions', 'Recursion', 'Arrays', '2D Arrays', 'Strings'],
        completedTopics: 4,
        totalTopics: 5,
        questionsAttempted: 15,
        totalQuestions: 20,
      },
      {
        id: 'c-u3',
        title: 'UNIT 03 — Pointers',
        topics: ['Pointer Basics', 'Pointer Arithmetic', 'Pointers & Arrays', 'Pointers & Functions', 'Dynamic Memory'],
        completedTopics: 2,
        totalTopics: 5,
        questionsAttempted: 8,
        totalQuestions: 20,
      },
      {
        id: 'c-u4',
        title: 'UNIT 04 — Structures & File Handling',
        topics: ['Structures', 'Unions', 'File Operations', 'File Modes', 'Error Handling'],
        completedTopics: 1,
        totalTopics: 5,
        questionsAttempted: 4,
        totalQuestions: 18,
      },
      {
        id: 'c-u5',
        title: 'UNIT 05 — Data Structures',
        topics: ['Linked Lists', 'Stacks', 'Queues', 'Trees', 'Sorting Algorithms'],
        completedTopics: 0,
        totalTopics: 5,
        questionsAttempted: 0,
        totalQuestions: 20,
      },
    ],
  },
  {
    id: 'web',
    name: 'Web Technology',
    shortName: 'WEB',
    icon: '🌍',
    color: '#FF5252',
    description: 'HTML, CSS, JavaScript, and modern web development',
    units: [
      {
        id: 'web-u1',
        title: 'UNIT 01 — HTML Basics',
        topics: ['HTML Structure', 'HTML Elements', 'Forms', 'Tables', 'Semantic HTML'],
        completedTopics: 4,
        totalTopics: 5,
        questionsAttempted: 14,
        totalQuestions: 20,
      },
      {
        id: 'web-u2',
        title: 'UNIT 02 — CSS',
        topics: ['CSS Selectors', 'Box Model', 'Flexbox', 'Grid', 'Responsive Design'],
        completedTopics: 3,
        totalTopics: 5,
        questionsAttempted: 10,
        totalQuestions: 20,
      },
      {
        id: 'web-u3',
        title: 'UNIT 03 — JavaScript Basics',
        topics: ['Variables & Types', 'Functions', 'DOM Manipulation', 'Events', 'Forms Validation'],
        completedTopics: 2,
        totalTopics: 5,
        questionsAttempted: 6,
        totalQuestions: 18,
      },
      {
        id: 'web-u4',
        title: 'UNIT 04 — Advanced JavaScript',
        topics: ['ES6 Features', 'Promises', 'Fetch API', 'JSON', 'Local Storage'],
        completedTopics: 1,
        totalTopics: 5,
        questionsAttempted: 3,
        totalQuestions: 18,
      },
      {
        id: 'web-u5',
        title: 'UNIT 05 — Web Security & Hosting',
        topics: ['Web Security', 'Cookies', 'Sessions', 'Web Hosting', 'Version Control'],
        completedTopics: 0,
        totalTopics: 5,
        questionsAttempted: 0,
        totalQuestions: 16,
      },
    ],
  },
];

export const BackPaperSubjects: Subject[] = [
  {
    id: 'math',
    name: 'Applied Mathematics',
    shortName: 'MATH',
    icon: '📐',
    color: '#BB86FC',
    description: 'Calculus, linear algebra, and discrete mathematics',
    units: [
      {
        id: 'math-u1',
        title: 'UNIT 01 — Calculus',
        topics: ['Differentiation', 'Integration', 'Applications', 'Multivariable', 'Differential Equations'],
        completedTopics: 2,
        totalTopics: 5,
        questionsAttempted: 6,
        totalQuestions: 20,
      },
      {
        id: 'math-u2',
        title: 'UNIT 02 — Linear Algebra',
        topics: ['Matrices', 'Determinants', 'Systems of Equations', 'Eigen Values', 'Vector Spaces'],
        completedTopics: 1,
        totalTopics: 5,
        questionsAttempted: 3,
        totalQuestions: 18,
      },
    ],
  },
  {
    id: 'physics',
    name: 'Applied Physics',
    shortName: 'PHY',
    icon: '⚛️',
    color: '#03DAC6',
    description: 'Mechanics, thermodynamics, and modern physics',
    units: [
      {
        id: 'phy-u1',
        title: 'UNIT 01 — Mechanics',
        topics: ['Newton Laws', 'Work & Energy', 'Rotational Motion', 'Oscillations', 'Waves'],
        completedTopics: 3,
        totalTopics: 5,
        questionsAttempted: 10,
        totalQuestions: 20,
      },
      {
        id: 'phy-u2',
        title: 'UNIT 02 — Modern Physics',
        topics: ['Quantum Theory', 'Relativity', 'Nuclear Physics', 'Semiconductors', 'Superconductivity'],
        completedTopics: 0,
        totalTopics: 5,
        questionsAttempted: 0,
        totalQuestions: 18,
      },
    ],
  },
  {
    id: 'chemistry',
    name: 'Applied Chemistry',
    shortName: 'CHEM',
    icon: '🧪',
    color: '#CF6679',
    description: 'Chemical bonding, polymers, and engineering chemistry',
    units: [
      {
        id: 'chem-u1',
        title: 'UNIT 01 — Atomic Structure',
        topics: ['Atomic Models', 'Electronic Configuration', 'Chemical Bonding', 'Molecular Geometry', 'Intermolecular Forces'],
        completedTopics: 2,
        totalTopics: 5,
        questionsAttempted: 6,
        totalQuestions: 18,
      },
    ],
  },
  {
    id: 'comm',
    name: 'Communication Skills',
    shortName: 'COMM',
    icon: '📢',
    color: '#FFAB40',
    description: 'Technical communication, presentations, and writing skills',
    units: [
      {
        id: 'comm-u1',
        title: 'UNIT 01 — Communication Basics',
        topics: ['Communication Process', 'Barriers', 'Non-Verbal', 'Listening Skills', 'Technical Writing'],
        completedTopics: 3,
        totalTopics: 5,
        questionsAttempted: 8,
        totalQuestions: 15,
      },
    ],
  },
];

export const SampleQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which scheduling algorithm gives the minimum average waiting time?',
    options: ['FCFS', 'SJF', 'Round Robin', 'Priority'],
    correctIndex: 1,
    explanation: 'Shortest Job First (SJF) gives the minimum average waiting time for a given set of processes.',
    subject: 'os',
    unit: 'os-u3',
    difficulty: 'medium',
  },
  {
    id: 'q2',
    question: 'What does ACID stand for in DBMS?',
    options: [
      'Atomicity, Consistency, Isolation, Durability',
      'Association, Consistency, Isolation, Durability',
      'Atomicity, Concurrency, Isolation, Durability',
      'Atomicity, Consistency, Integration, Durability',
    ],
    correctIndex: 0,
    explanation: 'ACID stands for Atomicity, Consistency, Isolation, and Durability — the four key properties of database transactions.',
    subject: 'dbms',
    unit: 'dbms-u4',
    difficulty: 'easy',
  },
  {
    id: 'q3',
    question: 'Which layer of the OSI model is responsible for end-to-end communication?',
    options: ['Network Layer', 'Transport Layer', 'Session Layer', 'Application Layer'],
    correctIndex: 1,
    explanation: 'The Transport Layer (Layer 4) is responsible for end-to-end communication and error recovery.',
    subject: 'networking',
    unit: 'net-u4',
    difficulty: 'medium',
  },
  {
    id: 'q4',
    question: 'What is the output of: printf("%d", sizeof(NULL)); on a 64-bit system?',
    options: ['0', '4', '8', 'Undefined'],
    correctIndex: 2,
    explanation: 'On a 64-bit system, NULL is a pointer and pointers are 8 bytes in size.',
    subject: 'c',
    unit: 'c-u3',
    difficulty: 'hard',
  },
  {
    id: 'q5',
    question: 'Which HTML element is used for the largest heading?',
    options: ['<heading>', '<h6>', '<h1>', '<head>'],
    correctIndex: 2,
    explanation: 'The <h1> element defines the largest/most important heading in HTML.',
    subject: 'web',
    unit: 'web-u1',
    difficulty: 'easy',
  },
  {
    id: 'q6',
    question: 'In a relational database, a tuple is equivalent to:',
    options: ['Column', 'Table', 'Row', 'Schema'],
    correctIndex: 2,
    explanation: 'A tuple represents a single row in a relational database table.',
    subject: 'dbms',
    unit: 'dbms-u1',
    difficulty: 'easy',
  },
  {
    id: 'q7',
    question: 'What is the primary purpose of a semaphore?',
    options: ['Memory Allocation', 'Process Synchronization', 'File Management', 'Error Handling'],
    correctIndex: 1,
    explanation: 'Semaphores are used for process synchronization to avoid race conditions.',
    subject: 'os',
    unit: 'os-u2',
    difficulty: 'medium',
  },
  {
    id: 'q8',
    question: 'Which protocol is used for secure web browsing?',
    options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
    correctIndex: 2,
    explanation: 'HTTPS (HTTP Secure) uses SSL/TLS encryption for secure web browsing.',
    subject: 'networking',
    unit: 'net-u5',
    difficulty: 'easy',
  },
];

export const SampleNotes: Note[] = [
  {
    id: 'n1',
    title: 'OS Process Scheduling',
    content: 'Process scheduling is the activity of the process manager that handles the removal of the running process from CPU and the selection of another process.\n\nTypes: Preemptive, Non-preemptive\nAlgorithms: FCFS, SJF, Round Robin, Priority, Multilevel Queue',
    subject: 'os',
    unit: 'os-u2',
    tags: ['scheduling', 'os', 'important'],
    type: 'study',
    createdAt: '2026-08-10',
    isImportant: true,
    isShared: true,
  },
  {
    id: 'n2',
    title: 'SQL JOIN Types',
    content: 'INNER JOIN — Returns matching rows from both tables\nLEFT JOIN — Returns all rows from left table\nRIGHT JOIN — Returns all rows from right table\nFULL JOIN — Returns all rows when there is a match\nCROSS JOIN — Returns Cartesian product',
    subject: 'dbms',
    unit: 'dbms-u2',
    tags: ['sql', 'joins', 'dbms'],
    type: 'study',
    createdAt: '2026-08-12',
    isImportant: false,
    isShared: true,
  },
  {
    id: 'n3',
    title: 'TCP vs UDP',
    content: 'TCP: Connection-oriented, reliable, ordered, slower\nUDP: Connectionless, unreliable, unordered, faster\n\nTCP uses 3-way handshake: SYN, SYN-ACK, ACK\nUDP is used in video streaming, gaming, DNS',
    subject: 'networking',
    unit: 'net-u4',
    tags: ['tcp', 'udp', 'networking'],
    type: 'study',
    createdAt: '2026-08-14',
    isImportant: true,
    isShared: false,
  },
  {
    id: 'n4',
    title: 'Pointers in C',
    content: 'A pointer is a variable that stores the address of another variable.\n\nSyntax: int *ptr = &var;\nDereference: *ptr\nPointer arithmetic: ptr++, ptr--\n\nDynamic memory: malloc(), calloc(), free()',
    subject: 'c',
    unit: 'c-u3',
    tags: ['pointers', 'c', 'memory'],
    type: 'study',
    createdAt: '2026-08-15',
    isImportant: true,
    isShared: true,
  },
  {
    id: 'n5',
    title: 'CSS Flexbox',
    content: 'display: flex;\njustify-content: center | space-between | space-around\nalign-items: center | flex-start | flex-end\nflex-direction: row | column\nflex-wrap: wrap | nowrap',
    subject: 'web',
    unit: 'web-u2',
    tags: ['css', 'flexbox', 'layout'],
    type: 'study',
    createdAt: '2026-08-16',
    isImportant: false,
    isShared: false,
  },
  {
    id: 'n6',
    title: 'Exam Strategy Reminder',
    content: 'Start with easy questions first. Allocate 1.5 min per MCQ. Leave time for revision. Focus on OS and DBMS — highest weightage.',
    subject: '',
    unit: '',
    tags: ['exam', 'strategy'],
    type: 'personal',
    createdAt: '2026-08-16',
    isImportant: true,
    isShared: false,
  },
  {
    id: 'n7',
    title: 'Weekly Goals',
    content: 'Complete OS Unit 5\nRevise SQL queries\nPractice 5 C programs\nWatch networking videos\nTake 2 mock tests',
    subject: '',
    unit: '',
    tags: ['goals', 'weekly'],
    type: 'personal',
    createdAt: '2026-08-17',
    isImportant: false,
    isShared: false,
  },
];

export const CProgramExamples = [
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
    title: 'Array Sorting (Bubble Sort)',
    code: '#include <stdio.h>\n\nvoid bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n-1; i++)\n        for (int j = 0; j < n-i-1; j++)\n            if (arr[j] > arr[j+1]) {\n                int temp = arr[j];\n                arr[j] = arr[j+1];\n                arr[j+1] = temp;\n            }\n}\n\nint main() {\n    int arr[] = {64, 34, 25, 12, 22};\n    int n = 5;\n    bubbleSort(arr, n);\n    for (int i = 0; i < n; i++)\n        printf("%d ", arr[i]);\n    return 0;\n}',
    output: '12 22 25 34 64',
  },
  {
    title: 'Linked List Implementation',
    code: '#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node {\n    int data;\n    struct Node* next;\n};\n\nvoid printList(struct Node* n) {\n    while (n != NULL) {\n        printf("%d -> ", n->data);\n        n = n->next;\n    }\n    printf("NULL\\n");\n}\n\nint main() {\n    struct Node* head = (struct Node*)malloc(sizeof(struct Node));\n    head->data = 1;\n    head->next = (struct Node*)malloc(sizeof(struct Node));\n    head->next->data = 2;\n    head->next->next = NULL;\n    printList(head);\n    return 0;\n}',
    output: '1 -> 2 -> NULL',
  },
];

export const Challenges = [
  {
    id: 'ch1',
    title: '7-Day Study Challenge',
    description: 'Study at least 2 hours every day for 7 days',
    type: 'group',
    duration: '7 days',
    points: 500,
    participants: ['f1', 'f2', 'f3'],
    progress: 3,
    total: 7,
  },
  {
    id: 'ch2',
    title: 'C Programming Sprint',
    description: 'Complete 10 C programs in 3 days',
    type: 'individual',
    duration: '3 days',
    points: 300,
    participants: ['f1'],
    progress: 7,
    total: 10,
  },
  {
    id: 'ch3',
    title: 'DBMS Quiz Battle',
    description: 'Score above 80% in DBMS unit tests',
    type: 'group',
    duration: '1 week',
    points: 400,
    participants: ['f1', 'f2', 'f3'],
    progress: 1,
    total: 5,
  },
];
