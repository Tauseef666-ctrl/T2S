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

export const COMM_DATA: SubjectData = {
  id: 'comm',
  name: 'Communication Skills',
  shortName: 'COMM',
  color: '#FFAB40',
  icon: '📢',
  semester: 'backpaper',
  units: [
    {
      id: 'comm-u1',
      name: 'UNIT 01 — Communication Fundamentals',
      description: 'Communication process, barriers, and types of communication',
      topics: [
        { id: 'comm-u1-t1', name: 'Communication Process and Elements', status: 'not_started' },
        { id: 'comm-u1-t2', name: 'Types of Communication (Verbal, Non-Verbal, Visual)', status: 'not_started' },
        { id: 'comm-u1-t3', name: 'Barriers to Communication (Physical, Semantic, Psychological)', status: 'not_started' },
        { id: 'comm-u1-t4', name: 'Effective Listening Skills', status: 'not_started' },
        { id: 'comm-u1-t5', name: 'Feedback in Communication', status: 'not_started' },
      ],
    },
    {
      id: 'comm-u2',
      name: 'UNIT 02 — Verbal and Non-Verbal Communication',
      description: 'Verbal communication techniques and body language',
      topics: [
        { id: 'comm-u2-t1', name: 'Verbal Communication (Oral, Paralinguistic)', status: 'not_started' },
        { id: 'comm-u2-t2', name: 'Non-Verbal Communication (Body Language, Gestures)', status: 'not_started' },
        { id: 'comm-u2-t3', name: 'Kinesics and Proxemics', status: 'not_started' },
        { id: 'comm-u2-t4', name: 'Tone, Pitch, and Pace in Speech', status: 'not_started' },
        { id: 'comm-u2-t5', name: 'Cross-Cultural Communication', status: 'not_started' },
      ],
    },
    {
      id: 'comm-u3',
      name: 'UNIT 03 — Written Communication',
      description: 'Business letters, reports, emails, and technical writing',
      topics: [
        { id: 'comm-u3-t1', name: 'Principles of Good Writing', status: 'not_started' },
        { id: 'comm-u3-t2', name: 'Business Letter Format and Types', status: 'not_started' },
        { id: 'comm-u3-t3', name: 'Report Writing (Structure, Format)', status: 'not_started' },
        { id: 'comm-u3-t4', name: 'Email Etiquette and Professional Writing', status: 'not_started' },
        { id: 'comm-u3-t5', name: 'Technical Writing and Documentation', status: 'not_started' },
      ],
    },
    {
      id: 'comm-u4',
      name: 'UNIT 04 — Presentation Skills',
      description: 'Presentation techniques, visual aids, and public speaking',
      topics: [
        { id: 'comm-u4-t1', name: 'Planning and Structuring a Presentation', status: 'not_started' },
        { id: 'comm-u4-t2', name: 'Use of Visual Aids (Slides, Charts, Props)', status: 'not_started' },
        { id: 'comm-u4-t3', name: 'Public Speaking Techniques and Stage Presence', status: 'not_started' },
        { id: 'comm-u4-t4', name: 'Handling Q&A and Audience Engagement', status: 'not_started' },
        { id: 'comm-u4-t5', name: 'Overcoming Stage Fear and Anxiety', status: 'not_started' },
      ],
    },
    {
      id: 'comm-u5',
      name: 'UNIT 05 — Group Communication',
      description: 'Group discussions, teamwork, interviews, and interpersonal skills',
      topics: [
        { id: 'comm-u5-t1', name: 'Group Discussion (Types, Rules, Evaluation)', status: 'not_started' },
        { id: 'comm-u5-t2', name: 'Teamwork and Collaboration Skills', status: 'not_started' },
        { id: 'comm-u5-t3', name: 'Interpersonal Communication', status: 'not_started' },
        { id: 'comm-u5-t4', name: 'Interview Skills (Types, Preparation, Tips)', status: 'not_started' },
        { id: 'comm-u5-t5', name: 'Conflict Resolution and Negotiation', status: 'not_started' },
      ],
    },
  ],
};
