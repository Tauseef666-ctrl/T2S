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

export const CHEMISTRY_DATA: SubjectData = {
  id: 'chemistry',
  name: 'Applied Chemistry',
  shortName: 'CHEM',
  color: '#CF6679',
  icon: '🧪',
  semester: 'backpaper',
  units: [
    {
      id: 'chem-u1',
      name: 'UNIT 01 — Atomic Structure',
      description: 'Atomic models, quantum numbers, electronic configuration',
      topics: [
        { id: 'chem-u1-t1', name: 'Bohr Model and Electronic Configuration', status: 'not_started' },
        { id: 'chem-u1-t2', name: 'Quantum Numbers (n, l, m, s)', status: 'not_started' },
        { id: 'chem-u1-t3', name: 'Aufbau Principle, Pauli, Hund Rules', status: 'not_started' },
        { id: 'chem-u1-t4', name: 'Periodic Trends (Atomic Radius, Ionization Energy)', status: 'not_started' },
        { id: 'chem-u1-t5', name: 'Isotopes and Isobars', status: 'not_started' },
      ],
    },
    {
      id: 'chem-u2',
      name: 'UNIT 02 — Chemical Bonding',
      description: 'Ionic, covalent, coordinate bonds, and molecular geometry',
      topics: [
        { id: 'chem-u2-t1', name: 'Ionic Bond and Lattice Energy', status: 'not_started' },
        { id: 'chem-u2-t2', name: 'Covalent Bond (Lewis Structures)', status: 'not_started' },
        { id: 'chem-u2-t3', name: 'VSEPR Theory and Molecular Geometry', status: 'not_started' },
        { id: 'chem-u2-t4', name: 'Hybridization (sp, sp2, sp3)', status: 'not_started' },
        { id: 'chem-u2-t5', name: 'Hydrogen Bonding and Van der Waals Forces', status: 'not_started' },
      ],
    },
    {
      id: 'chem-u3',
      name: 'UNIT 03 — Solutions',
      description: 'Types of solutions, concentration, colligative properties',
      topics: [
        { id: 'chem-u3-t1', name: 'Types of Solutions (Saturated, Unsaturated)', status: 'not_started' },
        { id: 'chem-u3-t2', name: 'Concentration Units (Molarity, Molality, Normality)', status: 'not_started' },
        { id: 'chem-u3-t3', name: 'Colligative Properties (Boiling Point Elevation)', status: 'not_started' },
        { id: 'chem-u3-t4', name: 'Osmosis and Reverse Osmosis', status: 'not_started' },
        { id: 'chem-u3-t5', name: 'Solubility and Solubility Products', status: 'not_started' },
      ],
    },
    {
      id: 'chem-u4',
      name: 'UNIT 04 — Electrochemistry',
      description: 'Electrochemical cells, Nernst equation, batteries',
      topics: [
        { id: 'chem-u4-t1', name: 'Electrochemical Cells (Galvanic, Electrolytic)', status: 'not_started' },
        { id: 'chem-u4-t2', name: 'Electrode Potentials and EMF', status: 'not_started' },
        { id: 'chem-u4-t3', name: 'Nernst Equation', status: 'not_started' },
        { id: 'chem-u4-t4', name: 'Electrolysis and Faraday Laws', status: 'not_started' },
        { id: 'chem-u4-t5', name: 'Batteries and Fuel Cells', status: 'not_started' },
      ],
    },
    {
      id: 'chem-u5',
      name: 'UNIT 05 — Corrosion, Water, and Materials',
      description: 'Corrosion prevention, water treatment, and engineering materials',
      topics: [
        { id: 'chem-u5-t1', name: 'Corrosion (Types, Mechanism, Prevention)', status: 'not_started' },
        { id: 'chem-u5-t2', name: 'Cathodic Protection and Galvanization', status: 'not_started' },
        { id: 'chem-u5-t3', name: 'Water Treatment (Softening, Demineralization)', status: 'not_started' },
        { id: 'chem-u5-t4', name: 'Engineering Materials (Polymers, Ceramics, Composites)', status: 'not_started' },
        { id: 'chem-u5-t5', name: 'Refractories and Lubricants', status: 'not_started' },
      ],
    },
  ],
};
