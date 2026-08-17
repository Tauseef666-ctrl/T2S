export interface Topic {
  id: string;
  name: string;
  status: 'not_started' | 'learning' | 'completed' | 'needs_revision' | 'mastered';
}

export interface Unit {
  id: string;
  name: string;
  description: string;
  topics: Topic[];
}

export interface SubjectData {
  id: string;
  name: string;
  shortName: string;
  color: string;
  icon: string;
  semester: 'sem3' | 'backpaper';
  units: Unit[];
}

export const C_DATA: SubjectData = {
  id: 'c',
  name: 'Computer Programming Using C',
  shortName: 'C',
  color: '#FFD600',
  icon: '⌨️',
  semester: 'sem3',
  units: [
    {
      id: 'c-u1',
      name: 'UNIT 01 — C Basics',
      description: 'Data types, variables, operators, I/O, and control flow',
      topics: [
        { id: 'c-u1-t1', name: 'Introduction to C and Program Structure', status: 'not_started' },
        { id: 'c-u1-t2', name: 'Data Types and Variables', status: 'not_started' },
        { id: 'c-u1-t3', name: 'Operators (Arithmetic, Relational, Logical, Bitwise)', status: 'not_started' },
        { id: 'c-u1-t4', name: 'Input/Output (printf, scanf, gets, puts)', status: 'not_started' },
        { id: 'c-u1-t5', name: 'Control Flow (if, else, switch, loops)', status: 'not_started' },
      ],
    },
    {
      id: 'c-u2',
      name: 'UNIT 02 — Functions and Arrays',
      description: 'Functions, recursion, arrays, 2D arrays, and strings',
      topics: [
        { id: 'c-u2-t1', name: 'Functions and Function Prototypes', status: 'not_started' },
        { id: 'c-u2-t2', name: 'Recursion and Recursive Functions', status: 'not_started' },
        { id: 'c-u2-t3', name: 'Arrays (1D and 2D)', status: 'not_started' },
        { id: 'c-u2-t4', name: 'Strings and String Functions', status: 'not_started' },
        { id: 'c-u2-t5', name: 'Storage Classes (auto, static, extern, register)', status: 'not_started' },
      ],
    },
    {
      id: 'c-u3',
      name: 'UNIT 03 — Pointers',
      description: 'Pointer basics, arithmetic, pointers with arrays/functions, dynamic memory',
      topics: [
        { id: 'c-u3-t1', name: 'Pointer Basics and Dereferencing', status: 'not_started' },
        { id: 'c-u3-t2', name: 'Pointer Arithmetic', status: 'not_started' },
        { id: 'c-u3-t3', name: 'Pointers and Arrays', status: 'not_started' },
        { id: 'c-u3-t4', name: 'Pointers and Functions (Pass by Reference)', status: 'not_started' },
        { id: 'c-u3-t5', name: 'Dynamic Memory (malloc, calloc, free, realloc)', status: 'not_started' },
      ],
    },
    {
      id: 'c-u4',
      name: 'UNIT 04 — Structures and File Handling',
      description: 'Structures, unions, file operations, file modes, and error handling',
      topics: [
        { id: 'c-u4-t1', name: 'Structures and Nested Structures', status: 'not_started' },
        { id: 'c-u4-t2', name: 'Unions and Enums', status: 'not_started' },
        { id: 'c-u4-t3', name: 'File Operations (fopen, fclose, fread, fwrite)', status: 'not_started' },
        { id: 'c-u4-t4', name: 'File Modes and File Pointers', status: 'not_started' },
        { id: 'c-u4-t5', name: 'Error Handling and Buffer Flushing', status: 'not_started' },
      ],
    },
    {
      id: 'c-u5',
      name: 'UNIT 05 — Searching and Sorting',
      description: 'Linear search, binary search, bubble sort, selection sort, quicksort',
      topics: [
        { id: 'c-u5-t1', name: 'Linear Search', status: 'not_started' },
        { id: 'c-u5-t2', name: 'Binary Search', status: 'not_started' },
        { id: 'c-u5-t3', name: 'Bubble Sort and Selection Sort', status: 'not_started' },
        { id: 'c-u5-t4', name: 'Insertion Sort and Merge Sort', status: 'not_started' },
        { id: 'c-u5-t5', name: 'Quick Sort and Time Complexity', status: 'not_started' },
      ],
    },
  ],
};
