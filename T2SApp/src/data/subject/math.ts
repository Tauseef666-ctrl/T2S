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

export const MATH_DATA: SubjectData = {
  id: 'math',
  name: 'Applied Mathematics',
  shortName: 'MATH',
  color: '#BB86FC',
  icon: '📐',
  semester: 'backpaper',
  units: [
    {
      id: 'math-u1',
      name: 'UNIT 01 — Matrices and Determinants',
      description: 'Matrix operations, types, determinants, and inverse',
      topics: [
        { id: 'math-u1-t1', name: 'Types of Matrices (Symmetric, Skew, Diagonal)', status: 'not_started' },
        { id: 'math-u1-t2', name: 'Matrix Operations (Add, Multiply, Transpose)', status: 'not_started' },
        { id: 'math-u1-t3', name: 'Determinants (2x2, 3x3, Properties)', status: 'not_started' },
        { id: 'math-u1-t4', name: 'Inverse of a Matrix (Adjoint, Gauss-Jordan)', status: 'not_started' },
        { id: 'math-u1-t5', name: 'System of Linear Equations (Cramer, Gauss Elimination)', status: 'not_started' },
      ],
    },
    {
      id: 'math-u2',
      name: 'UNIT 02 — Differentiation',
      description: 'Limits, continuity, derivatives, and applications',
      topics: [
        { id: 'math-u2-t1', name: 'Limits and Continuity', status: 'not_started' },
        { id: 'math-u2-t2', name: 'First Principles and Standard Derivatives', status: 'not_started' },
        { id: 'math-u2-t3', name: 'Chain Rule, Product Rule, Quotient Rule', status: 'not_started' },
        { id: 'math-u2-t4', name: 'Implicit and Parametric Differentiation', status: 'not_started' },
        { id: 'math-u2-t5', name: 'Applications (Maxima, Minima, Tangents)', status: 'not_started' },
      ],
    },
    {
      id: 'math-u3',
      name: 'UNIT 03 — Integration',
      description: 'Indefinite integral, definite integral, and applications',
      topics: [
        { id: 'math-u3-t1', name: 'Indefinite Integral (Standard Forms)', status: 'not_started' },
        { id: 'math-u3-t2', name: 'Integration by Substitution', status: 'not_started' },
        { id: 'math-u3-t3', name: 'Integration by Parts and Partial Fractions', status: 'not_started' },
        { id: 'math-u3-t4', name: 'Definite Integral (Fundamental Theorem)', status: 'not_started' },
        { id: 'math-u3-t5', name: 'Applications (Area Under Curve)', status: 'not_started' },
      ],
    },
    {
      id: 'math-u4',
      name: 'UNIT 04 — Differential Equations',
      description: 'First order, second order, and applications of DEs',
      topics: [
        { id: 'math-u4-t1', name: 'Order and Degree of DEs', status: 'not_started' },
        { id: 'math-u4-t2', name: 'First Order DEs (Variable Separable, Homogeneous)', status: 'not_started' },
        { id: 'math-u4-t3', name: 'Linear First Order DEs', status: 'not_started' },
        { id: 'math-u4-t4', name: 'Second Order Linear DEs with Constant Coefficients', status: 'not_started' },
        { id: 'math-u4-t5', name: 'Applications of Differential Equations', status: 'not_started' },
      ],
    },
    {
      id: 'math-u5',
      name: 'UNIT 05 — Statistics and Probability',
      description: 'Measures of central tendency, dispersion, and probability',
      topics: [
        { id: 'math-u5-t1', name: 'Mean, Median, Mode', status: 'not_started' },
        { id: 'math-u5-t2', name: 'Standard Deviation and Variance', status: 'not_started' },
        { id: 'math-u5-t3', name: 'Probability (Addition, Multiplication Rules)', status: 'not_started' },
        { id: 'math-u5-t4', name: 'Conditional Probability and Bayes Theorem', status: 'not_started' },
        { id: 'math-u5-t5', name: 'Correlation and Regression', status: 'not_started' },
      ],
    },
  ],
};
