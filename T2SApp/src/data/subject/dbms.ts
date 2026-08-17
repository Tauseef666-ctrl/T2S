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

export const DBMS_DATA: SubjectData = {
  id: 'dbms',
  name: 'Database Management System',
  shortName: 'DBMS',
  color: '#7C4DFF',
  icon: '🗄️',
  semester: 'sem3',
  units: [
    {
      id: 'dbms-u1',
      name: 'UNIT 01 — Introduction to DBMS',
      description: 'DBMS concepts, database models, ER diagrams, and relational model',
      topics: [
        { id: 'dbms-u1-t1', name: 'DBMS Concepts & Architecture', status: 'not_started' },
        { id: 'dbms-u1-t2', name: 'Database Models (Hierarchical, Network, Relational)', status: 'not_started' },
        { id: 'dbms-u1-t3', name: 'ER Model & ER Diagrams', status: 'not_started' },
        { id: 'dbms-u1-t4', name: 'Relational Model & Keys', status: 'not_started' },
        { id: 'dbms-u1-t5', name: 'Introduction to Normalization', status: 'not_started' },
      ],
    },
    {
      id: 'dbms-u2',
      name: 'UNIT 02 — SQL Basics',
      description: 'DDL, DML, DCL, TCL commands and JOINs',
      topics: [
        { id: 'dbms-u2-t1', name: 'DDL Commands (CREATE, ALTER, DROP)', status: 'not_started' },
        { id: 'dbms-u2-t2', name: 'DML Commands (SELECT, INSERT, UPDATE, DELETE)', status: 'not_started' },
        { id: 'dbms-u2-t3', name: 'DCL & TCL Commands (GRANT, REVOKE, COMMIT)', status: 'not_started' },
        { id: 'dbms-u2-t4', name: 'JOINs (INNER, LEFT, RIGHT, FULL, CROSS)', status: 'not_started' },
        { id: 'dbms-u2-t5', name: 'Aggregate Functions & GROUP BY', status: 'not_started' },
      ],
    },
    {
      id: 'dbms-u3',
      name: 'UNIT 03 — Advanced SQL',
      description: 'Subqueries, views, indexes, stored procedures, and triggers',
      topics: [
        { id: 'dbms-u3-t1', name: 'Subqueries & Nested SELECT', status: 'not_started' },
        { id: 'dbms-u3-t2', name: 'Views & Materialized Views', status: 'not_started' },
        { id: 'dbms-u3-t3', name: 'Indexes (B-tree, Hash)', status: 'not_started' },
        { id: 'dbms-u3-t4', name: 'Stored Procedures & Functions', status: 'not_started' },
        { id: 'dbms-u3-t5', name: 'Triggers & Cursors', status: 'not_started' },
      ],
    },
    {
      id: 'dbms-u4',
      name: 'UNIT 04 — Transaction Management',
      description: 'ACID properties, concurrency control, locking, and recovery',
      topics: [
        { id: 'dbms-u4-t1', name: 'ACID Properties', status: 'not_started' },
        { id: 'dbms-u4-t2', name: 'Transaction Control (COMMIT, ROLLBACK)', status: 'not_started' },
        { id: 'dbms-u4-t3', name: 'Concurrency Control & Serializability', status: 'not_started' },
        { id: 'dbms-u4-t4', name: 'Locking Protocols (2PL, Timestamp)', status: 'not_started' },
        { id: 'dbms-u4-t5', name: 'Recovery & Checkpoints', status: 'not_started' },
      ],
    },
    {
      id: 'dbms-u5',
      name: 'UNIT 05 — Advanced Concepts',
      description: 'Functional dependencies, normalization forms, BCNF, and security',
      topics: [
        { id: 'dbms-u5-t1', name: 'Functional Dependencies', status: 'not_started' },
        { id: 'dbms-u5-t2', name: 'Normalization (1NF, 2NF, 3NF)', status: 'not_started' },
        { id: 'dbms-u5-t3', name: 'BCNF & 4NF', status: 'not_started' },
        { id: 'dbms-u5-t4', name: 'NoSQL Introduction', status: 'not_started' },
        { id: 'dbms-u5-t5', name: 'Database Security & Authorization', status: 'not_started' },
      ],
    },
  ],
};
