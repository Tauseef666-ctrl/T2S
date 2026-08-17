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

export const PHYSICS_DATA: SubjectData = {
  id: 'physics',
  name: 'Applied Physics',
  shortName: 'PHY',
  color: '#03DAC6',
  icon: '⚛️',
  semester: 'backpaper',
  units: [
    {
      id: 'phy-u1',
      name: 'UNIT 01 — Units and Measurements',
      description: 'SI units, dimensional analysis, error analysis, and significant figures',
      topics: [
        { id: 'phy-u1-t1', name: 'SI Units and Derived Units', status: 'not_started' },
        { id: 'phy-u1-t2', name: 'Dimensional Analysis', status: 'not_started' },
        { id: 'phy-u1-t3', name: 'Significant Figures and Rounding', status: 'not_started' },
        { id: 'phy-u1-t4', name: 'Error Analysis (Absolute, Relative Errors)', status: 'not_started' },
        { id: 'phy-u1-t5', name: 'Vernier and Screw Gauge Measurements', status: 'not_started' },
      ],
    },
    {
      id: 'phy-u2',
      name: 'UNIT 02 — Force and Motion',
      description: "Newton's laws, friction, circular motion, and gravitation",
      topics: [
        { id: 'phy-u2-t1', name: "Newton's Laws of Motion", status: 'not_started' },
        { id: 'phy-u2-t2', name: 'Friction (Static, Kinetic, Rolling)', status: 'not_started' },
        { id: 'phy-u2-t3', name: 'Circular Motion and Centripetal Force', status: 'not_started' },
        { id: 'phy-u2-t4', name: 'Work, Energy, and Power', status: 'not_started' },
        { id: 'phy-u2-t5', name: "Law of Gravitation and Applications", status: 'not_started' },
      ],
    },
    {
      id: 'phy-u3',
      name: 'UNIT 03 — Properties of Matter',
      description: 'Elasticity, viscosity, surface tension, and fluid mechanics',
      topics: [
        { id: 'phy-u3-t1', name: 'Elasticity (Stress, Strain, Young Modulus)', status: 'not_started' },
        { id: 'phy-u3-t2', name: 'Viscosity and Poiseuille Formula', status: 'not_started' },
        { id: 'phy-u3-t3', name: 'Surface Tension and Capillarity', status: 'not_started' },
        { id: 'phy-u3-t4', name: 'Bernoulli Theorem and Applications', status: 'not_started' },
        { id: 'phy-u3-t5', name: 'Archimedes Principle and Buoyancy', status: 'not_started' },
      ],
    },
    {
      id: 'phy-u4',
      name: 'UNIT 04 — Heat and Thermometry',
      description: 'Thermal expansion, calorimetry, laws of thermodynamics',
      topics: [
        { id: 'phy-u4-t1', name: 'Temperature Scales and Thermometers', status: 'not_started' },
        { id: 'phy-u4-t2', name: 'Thermal Expansion (Linear, Areal, Volume)', status: 'not_started' },
        { id: 'phy-u4-t3', name: 'Calorimetry and Specific Heat', status: 'not_started' },
        { id: 'phy-u4-t4', name: "Laws of Thermodynamics (Zeroth, First, Second)", status: 'not_started' },
        { id: 'phy-u4-t5', name: 'Carnot Engine and Entropy', status: 'not_started' },
      ],
    },
    {
      id: 'phy-u5',
      name: 'UNIT 05 — Waves and Semiconductors',
      description: 'Sound waves, superposition, diodes, transistors',
      topics: [
        { id: 'phy-u5-t1', name: 'Simple Harmonic Motion and Wave Motion', status: 'not_started' },
        { id: 'phy-u5-t2', name: 'Sound Waves and Doppler Effect', status: 'not_started' },
        { id: 'phy-u5-t3', name: 'Superposition and Standing Waves', status: 'not_started' },
        { id: 'phy-u5-t4', name: 'Semiconductor Physics (PN Junction Diode)', status: 'not_started' },
        { id: 'phy-u5-t5', name: 'Transistors (NPN, PNP, Working)', status: 'not_started' },
      ],
    },
  ],
};
