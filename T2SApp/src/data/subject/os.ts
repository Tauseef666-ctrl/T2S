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

export const OS_DATA: SubjectData = {
  id: 'os',
  name: 'Operating System',
  shortName: 'OS',
  color: '#00E5FF',
  icon: '💻',
  semester: 'sem3',
  units: [
    {
      id: 'os-u1',
      name: 'UNIT 01 — Introduction to OS',
      description: 'OS concepts, types, structure, system calls, and operations',
      topics: [
        { id: 'os-u1-t1', name: 'OS Concepts & Functions', status: 'not_started' },
        { id: 'os-u1-t2', name: 'Types of OS (Batch, Time-sharing, Real-time, Distributed)', status: 'not_started' },
        { id: 'os-u1-t3', name: 'OS Structure (Monolithic, Microkernel, Layered)', status: 'not_started' },
        { id: 'os-u1-t4', name: 'System Calls & System Programs', status: 'not_started' },
        { id: 'os-u1-t5', name: 'OS Operations & Interrupts', status: 'not_started' },
      ],
    },
    {
      id: 'os-u2',
      name: 'UNIT 02 — Process Management',
      description: 'Processes, threads, synchronization, and interprocess communication',
      topics: [
        { id: 'os-u2-t1', name: 'Process Concept & PCB', status: 'not_started' },
        { id: 'os-u2-t2', name: 'Process Scheduling & States', status: 'not_started' },
        { id: 'os-u2-t3', name: 'Operations on Processes (Fork, Wait, Exit)', status: 'not_started' },
        { id: 'os-u2-t4', name: 'Interprocess Communication', status: 'not_started' },
        { id: 'os-u2-t5', name: 'Threads & Multithreading Models', status: 'not_started' },
      ],
    },
    {
      id: 'os-u3',
      name: 'UNIT 03 — CPU Scheduling',
      description: 'Scheduling algorithms, multilevel queues, and real-time scheduling',
      topics: [
        { id: 'os-u3-t1', name: 'Scheduling Concepts & Criteria', status: 'not_started' },
        { id: 'os-u3-t2', name: 'FCFS & SJF Scheduling', status: 'not_started' },
        { id: 'os-u3-t3', name: 'Round Robin & Priority Scheduling', status: 'not_started' },
        { id: 'os-u3-t4', name: 'Multilevel Queue & Feedback', status: 'not_started' },
        { id: 'os-u3-t5', name: 'Thread Scheduling & Real-Time', status: 'not_started' },
      ],
    },
    {
      id: 'os-u4',
      name: 'UNIT 04 — Memory Management',
      description: 'Swapping, contiguous allocation, paging, and segmentation',
      topics: [
        { id: 'os-u4-t1', name: 'Background & Address Binding', status: 'not_started' },
        { id: 'os-u4-t2', name: 'Swapping & Contiguous Allocation', status: 'not_started' },
        { id: 'os-u4-t3', name: 'Paging & Page Tables', status: 'not_started' },
        { id: 'os-u4-t4', name: 'Segmentation & Fragmentation', status: 'not_started' },
        { id: 'os-u4-t5', name: 'Virtual Memory & Page Replacement', status: 'not_started' },
      ],
    },
    {
      id: 'os-u5',
      name: 'UNIT 05 — File System & Deadlocks',
      description: 'File concepts, directory structure, deadlock handling',
      topics: [
        { id: 'os-u5-t1', name: 'File Concepts & Attributes', status: 'not_started' },
        { id: 'os-u5-t2', name: 'Directory Structure & Operations', status: 'not_started' },
        { id: 'os-u5-t3', name: 'Deadlock Concepts & Conditions', status: 'not_started' },
        { id: 'os-u5-t4', name: 'Deadlock Prevention & Avoidance', status: 'not_started' },
        { id: 'os-u5-t5', name: 'Deadlock Detection & Recovery', status: 'not_started' },
      ],
    },
  ],
};
