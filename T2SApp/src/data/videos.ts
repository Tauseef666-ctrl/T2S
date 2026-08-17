export interface Video {
  id: string;
  title: string;
  channel: string;
  url: string;
  duration: string;
  description: string;
}

export interface ExamQuestion {
  id: string;
  question: string;
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'short' | 'long' | 'numerical' | 'mcq';
  unit: string;
  subject: string;
  answer?: string;
}

export interface QuestionPaper {
  id: string;
  title: string;
  year: string;
  semester: string;
  totalMarks: number;
  time: string;
  subjects: string[];
  url: string;
}

export const SubjectVideos: Record<string, Video[]> = {
  os: [
    {
      id: 'os-1',
      title: 'Operating System Full Course | One Shot',
      channel: 'GeeksforGeeks GATE English',
      url: 'https://www.youtube.com/watch?v=m0cCNegLnPk',
      duration: '3:45:00',
      description: 'Complete OS concepts — processes, memory, scheduling, deadlocks',
    },
    {
      id: 'os-2',
      title: 'CPU Scheduling Algorithms | OS Complete',
      channel: 'Sunil Yadav Sir Computech',
      url: 'https://www.youtube.com/watch?v=93j-kkkPCKU',
      duration: '1:15:23',
      description: 'SJF, SRTF, FCFS, Round Robin — numericals & Gantt charts',
    },
    {
      id: 'os-3',
      title: 'OS Syllabus Discussion — Complete Overview',
      channel: 'Easy Semester',
      url: 'https://www.youtube.com/watch?v=b7d6ZkIiynI',
      duration: '2:30:00',
      description: 'Full syllabus breakdown — all 5 units explained',
    },
    {
      id: 'os-4',
      title: 'Process Management — Threads & Scheduling',
      channel: 'Neso Academy',
      url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XRw78UA8qnv6jEx',
      duration: 'Playlist',
      description: 'Detailed playlist covering process management concepts',
    },
  ],
  dbms: [
    {
      id: 'dbms-1',
      title: 'Complete DBMS in 1 Video (With Notes)',
      channel: 'CodeHelp — by Babbar',
      url: 'https://www.youtube.com/watch?v=dl00fOOYLOM',
      duration: '5:30:00',
      description: 'Full DBMS course — relational model, SQL, normalization, transactions',
    },
    {
      id: 'dbms-2',
      title: 'Databases In-Depth — Complete Course',
      channel: 'freeCodeCamp.org',
      url: 'https://www.youtube.com/watch?v=pPqazMTzNOM',
      duration: '8:00:00',
      description: 'Deep dive into database concepts, indexing, query optimization',
    },
    {
      id: 'dbms-3',
      title: 'DBMS Full Overview — Syllabus Discussion',
      channel: 'College Wallah',
      url: 'https://www.youtube.com/watch?v=k8eGWxJZ6vM',
      duration: '2:00:00',
      description: 'Complete syllabus overview with exam-focused topics',
    },
    {
      id: 'dbms-4',
      title: 'SQL Tutorial for Beginners',
      channel: 'Programming with Mosh',
      url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
      duration: '1:15:00',
      description: 'Hands-on SQL — SELECT, JOIN, GROUP BY, subqueries',
    },
  ],
  networking: [
    {
      id: 'net-1',
      title: 'Computer Networking Full Course 2026',
      channel: 'Simplilearn',
      url: 'https://www.youtube.com/watch?v=PSX61FxgCzw',
      duration: '4:21:40',
      description: 'OSI model, protocols, routing, security — complete networking',
    },
    {
      id: 'net-2',
      title: 'Network Engineering — CompTIA Network+ Prep',
      channel: 'freeCodeCamp.org',
      url: 'https://www.youtube.com/watch?v=qiQR5rTSshw',
      duration: '12:00:00',
      description: 'Complete networking course from fundamentals to advanced',
    },
    {
      id: 'net-3',
      title: 'Computer Networking Fundamentals',
      channel: 'Kunal Kushwaha',
      url: 'https://www.youtube.com/watch?v=k9ZigsW9il0',
      duration: '6:00:00',
      description: 'IP addressing, TCP/UDP, DNS, HTTP — explained simply',
    },
    {
      id: 'net-4',
      title: 'Networking Full Course for Beginners',
      channel: 'Simplilearn',
      url: 'https://www.youtube.com/watch?v=fErDcUtd8fA',
      duration: '5:30:00',
      description: 'IP classes, subnetting, IPv4 vs IPv6, routing algorithms',
    },
  ],
  c: [
    {
      id: 'c-1',
      title: 'C Programming Full Course — Learn C in 5 Hours',
      channel: 'Amit Thinks',
      url: 'https://www.youtube.com/watch?v=CobHIiQXMtQ',
      duration: '5:13:06',
      description: 'Data types, pointers, arrays, functions, file handling — complete C',
    },
    {
      id: 'c-2',
      title: 'C Language Full Course in 50 Hours',
      channel: 'WsCube Tech',
      url: 'https://www.youtube.com/watch?v=xDHSP_hyWJA',
      duration: '47:27:34',
      description: 'Most detailed C course — beginners to advanced with practicals',
    },
    {
      id: 'c-3',
      title: 'C Programming Full Course for Beginners',
      channel: 'Programiz',
      url: 'https://www.youtube.com/watch?v=0Sg6QHmlFJE',
      duration: '4:45:36',
      description: 'Clean, visual C tutorial — great for quick revision',
    },
    {
      id: 'c-4',
      title: 'C Language Tutorial — Complete with Notes',
      channel: 'CodeWithHarry',
      url: 'https://www.youtube.com/watch?v=aZb0iu4uGwA',
      duration: '6:00:00',
      description: 'Hindi + English — data types, operators, loops, pointers',
    },
    {
      id: 'c-5',
      title: 'C Language Full Course — 100+ Questions',
      channel: 'College Wallah',
      url: 'https://www.youtube.com/watch?v=i0ovgS-jCQ8',
      duration: '8:56:29',
      description: 'Beginner to advanced — conditionals, loops, pattern printing',
    },
  ],
  web: [
    {
      id: 'web-1',
      title: 'HTML & CSS Full Course — Beginner to Pro',
      channel: 'SuperSimpleDev',
      url: 'https://www.youtube.com/watch?v=G3e-cpL7ofc',
      duration: '11:00:00',
      description: 'Complete HTML & CSS — build YouTube clone at the end',
    },
    {
      id: 'web-2',
      title: 'HTML, CSS & JavaScript — Build 15 Projects',
      channel: 'Codesistency',
      url: 'https://www.youtube.com/watch?v=kAiX0itnonM',
      duration: '12:00:00',
      description: 'Learn by building 15 real projects — hands-on approach',
    },
    {
      id: 'web-3',
      title: 'Fullstack Developer from Scratch',
      channel: 'freeCodeCamp.org',
      url: 'https://www.youtube.com/watch?v=LzMnsfqjzkA',
      duration: '14:00:00',
      description: 'HTML, CSS, JS — from zero to full stack developer',
    },
    {
      id: 'web-4',
      title: 'JavaScript Full Course',
      channel: 'SuperSimpleDev',
      url: 'https://www.youtube.com/watch?v=SBmSRMn0MGo',
      duration: '8:00:00',
      description: 'Variables, functions, DOM, async — complete JS tutorial',
    },
  ],
  math: [
    {
      id: 'math-1',
      title: 'Applied Mathematics — Complete Diploma Course',
      channel: 'Engineers Academy',
      url: 'https://www.youtube.com/watch?v=HQpCMS4d3TQ',
      duration: '10:00:00',
      description: 'Calculus, linear algebra, differential equations — complete',
    },
  ],
  physics: [
    {
      id: 'phy-1',
      title: 'Applied Physics — Full Course',
      channel: 'Physics Wallah',
      url: 'https://www.youtube.com/watch?v=G6zBMJUdKcI',
      duration: '8:00:00',
      description: 'Mechanics, thermodynamics, modern physics — diploma level',
    },
  ],
  chemistry: [
    {
      id: 'chem-1',
      title: 'Applied Chemistry — Complete',
      channel: 'Unacademy',
      url: 'https://www.youtube.com/watch?v=2sI1mIdK3pI',
      duration: '6:00:00',
      description: 'Atomic structure, polymers, engineering chemistry',
    },
  ],
  comm: [
    {
      id: 'comm-1',
      title: 'Communication Skills — Complete Course',
      channel: 'Study IQ',
      url: 'https://www.youtube.com/watch?v=h02D3eJNhYs',
      duration: '4:00:00',
      description: 'Technical communication, presentation skills, writing',
    },
  ],
};

export const Semester3ExamQuestions: ExamQuestion[] = [
  // OS
  { id: 'eq1', question: 'Explain the types of operating systems with examples. What is the difference between multiprogramming and multitasking?', marks: 10, difficulty: 'medium', type: 'long', unit: 'os-u1', subject: 'os', answer: 'Types: Batch, Time-sharing, Real-time, Distributed, Embedded. Multiprogramming keeps multiple programs in memory; Multitasking divides CPU time among processes.' },
  { id: 'eq2', question: 'Consider 5 processes with arrival and burst times. Calculate average waiting time using FCFS, SJF, and Round Robin (quantum=2).', marks: 15, difficulty: 'hard', type: 'numerical', unit: 'os-u3', subject: 'os', answer: 'Draw Gantt charts for each algorithm. Waiting time = Start time - Arrival time. Average = Sum/5.' },
  { id: 'eq3', question: 'What is a deadlock? Explain necessary conditions with examples. How is deadlock prevented?', marks: 10, difficulty: 'medium', type: 'long', unit: 'os-u5', subject: 'os', answer: 'Deadlock: process waiting indefinitely. Conditions: Mutual exclusion, Hold & wait, No preemption, Circular wait. Prevention: break any condition.' },
  { id: 'eq4', question: 'Explain paging with example. What is the difference between paging and segmentation?', marks: 8, difficulty: 'medium', type: 'long', unit: 'os-u4', subject: 'os' },
  { id: 'eq5', question: 'What is semaphore? Explain binary and counting semaphore with example.', marks: 8, difficulty: 'medium', type: 'long', unit: 'os-u2', subject: 'os' },

  // DBMS
  { id: 'eq6', question: 'What is normalization? Explain 1NF, 2NF, 3NF and BCNF with examples.', marks: 12, difficulty: 'medium', type: 'long', unit: 'dbms-u1', subject: 'dbms', answer: '1NF: atomic values. 2NF: no partial dependency. 3NF: no transitive dependency. BCNF: every determinant is candidate key.' },
  { id: 'eq7', question: 'Write SQL queries for: (a) Find all students with marks > 80 (b) Count students per department (c) Find max salary per department (d) Join two tables', marks: 10, difficulty: 'easy', type: 'long', unit: 'dbms-u2', subject: 'dbms' },
  { id: 'eq8', question: 'Explain ACID properties with examples. What happens if a transaction fails mid-way?', marks: 8, difficulty: 'medium', type: 'long', unit: 'dbms-u4', subject: 'dbms' },
  { id: 'eq9', question: 'What are views? How are they different from tables? Create a view for semester 3 students.', marks: 6, difficulty: 'easy', type: 'long', unit: 'dbms-u3', subject: 'dbms' },

  // Networking
  { id: 'eq10', question: 'Explain the OSI model with all 7 layers. What is the role of each layer?', marks: 10, difficulty: 'medium', type: 'long', unit: 'net-u1', subject: 'networking', answer: 'Physical, Data Link, Network, Transport, Session, Presentation, Application — each handles specific networking functions.' },
  { id: 'eq11', question: 'Differentiate between TCP and UDP. When would you use each?', marks: 6, difficulty: 'easy', type: 'short', unit: 'net-u4', subject: 'networking' },
  { id: 'eq12', question: 'An IP address is 192.168.1.100/26. Find network address, broadcast address, and number of usable hosts.', marks: 8, difficulty: 'hard', type: 'numerical', unit: 'net-u3', subject: 'networking', answer: '/26 means 255.255.255.192 subnet mask. Network: 192.168.1.64, Broadcast: 192.168.1.127, Hosts: 62' },
  { id: 'eq13', question: 'Explain TCP 3-way handshake with a diagram. What happens if one step fails?', marks: 8, difficulty: 'medium', type: 'long', unit: 'net-u4', subject: 'networking' },

  // C Programming
  { id: 'eq14', question: 'Write a C program to find factorial using recursion. Explain the stack behavior.', marks: 6, difficulty: 'easy', type: 'long', unit: 'c-u2', subject: 'c' },
  { id: 'eq15', question: 'Explain pointer arithmetic. What is the output of the following code?', marks: 8, difficulty: 'medium', type: 'long', unit: 'c-u3', subject: 'c' },
  { id: 'eq16', question: 'Write a program to implement bubble sort using pointers.', marks: 10, difficulty: 'medium', type: 'long', unit: 'c-u3', subject: 'c' },
  { id: 'eq17', question: 'Explain structures in C. Create a structure for Student and write a program to read and display details.', marks: 8, difficulty: 'easy', type: 'long', unit: 'c-u4', subject: 'c' },

  // Web Technology
  { id: 'eq18', question: 'Explain the CSS box model with a diagram. What is the difference between margin and padding?', marks: 6, difficulty: 'easy', type: 'long', unit: 'web-u2', subject: 'web' },
  { id: 'eq19', question: 'Write JavaScript code to validate an email form. Explain DOM manipulation.', marks: 10, difficulty: 'medium', type: 'long', unit: 'web-u3', subject: 'web' },
  { id: 'eq20', question: 'Differentiate between GET and POST methods. When would you use each?', marks: 6, difficulty: 'easy', type: 'short', unit: 'web-u1', subject: 'web' },
];

export const QuestionPapers: QuestionPaper[] = [
  {
    id: 'qp1',
    title: 'Operating System — Mid-Term 2025',
    year: '2025',
    semester: 'Semester 3',
    totalMarks: 50,
    time: '3 Hours',
    subjects: ['os'],
    url: 'https://www.google.com/search?q=BTEUP+operating+system+question+paper+2025+diploma+CSE',
  },
  {
    id: 'qp2',
    title: 'DBMS — Mid-Term 2025',
    year: '2025',
    semester: 'Semester 3',
    totalMarks: 50,
    time: '3 Hours',
    subjects: ['dbms'],
    url: 'https://www.google.com/search?q=BTEUP+DBMS+question+paper+2025+diploma+CSE',
  },
  {
    id: 'qp3',
    title: 'Computer Networking — Mid-Term 2025',
    year: '2025',
    semester: 'Semester 3',
    totalMarks: 50,
    time: '3 Hours',
    subjects: ['networking'],
    url: 'https://www.google.com/search?q=BTEUP+computer+networking+question+paper+2025+diploma',
  },
  {
    id: 'qp4',
    title: 'C Programming — Mid-Term 2025',
    year: '2025',
    semester: 'Semester 3',
    totalMarks: 50,
    time: '3 Hours',
    subjects: ['c'],
    url: 'https://www.google.com/search?q=BTEUP+C+programming+question+paper+2025+diploma',
  },
  {
    id: 'qp5',
    title: 'Web Technology — Mid-Term 2025',
    year: '2025',
    semester: 'Semester 3',
    totalMarks: 50,
    time: '3 Hours',
    subjects: ['web'],
    url: 'https://www.google.com/search?q=BTEUP+web+technology+question+paper+2025+diploma',
  },
  {
    id: 'qp6',
    title: 'Semester 3 — All Subjects (Expected Questions)',
    year: '2026',
    semester: 'Semester 3',
    totalMarks: 100,
    time: '3 Hours',
    subjects: ['os', 'dbms', 'networking', 'c', 'web'],
    url: 'https://www.google.com/search?q=BTEUP+semester+3+all+subjects+question+paper+2026',
  },
  {
    id: 'qp7',
    title: 'Applied Mathematics — Back Paper 2025',
    year: '2025',
    semester: 'Back Paper',
    totalMarks: 50,
    time: '3 Hours',
    subjects: ['math'],
    url: 'https://www.google.com/search?q=BTEUP+applied+mathematics+back+paper+question+2025',
  },
  {
    id: 'qp8',
    title: 'Applied Physics — Back Paper 2025',
    year: '2025',
    semester: 'Back Paper',
    totalMarks: 50,
    time: '3 Hours',
    subjects: ['physics'],
    url: 'https://www.google.com/search?q=BTEUP+applied+physics+back+paper+question+2025',
  },
];
