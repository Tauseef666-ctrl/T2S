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

export const WEB_DATA: SubjectData = {
  id: 'web',
  name: 'Web Technology',
  shortName: 'WEB',
  color: '#FF5252',
  icon: '🌍',
  semester: 'sem3',
  units: [
    {
      id: 'web-u1',
      name: 'UNIT 01 — HTML Basics',
      description: 'HTML structure, elements, forms, tables, and semantic HTML',
      topics: [
        { id: 'web-u1-t1', name: 'HTML Document Structure and DOCTYPE', status: 'not_started' },
        { id: 'web-u1-t2', name: 'HTML Elements and Tags', status: 'not_started' },
        { id: 'web-u1-t3', name: 'Forms and Input Elements', status: 'not_started' },
        { id: 'web-u1-t4', name: 'Tables and Lists', status: 'not_started' },
        { id: 'web-u1-t5', name: 'Semantic HTML (header, nav, article, section)', status: 'not_started' },
      ],
    },
    {
      id: 'web-u2',
      name: 'UNIT 02 — CSS',
      description: 'CSS selectors, box model, flexbox, grid, and responsive design',
      topics: [
        { id: 'web-u2-t1', name: 'CSS Selectors (Class, ID, Attribute, Pseudo)', status: 'not_started' },
        { id: 'web-u2-t2', name: 'Box Model (margin, padding, border)', status: 'not_started' },
        { id: 'web-u2-t3', name: 'Flexbox Layout', status: 'not_started' },
        { id: 'web-u2-t4', name: 'CSS Grid Layout', status: 'not_started' },
        { id: 'web-u2-t5', name: 'Responsive Design and Media Queries', status: 'not_started' },
      ],
    },
    {
      id: 'web-u3',
      name: 'UNIT 03 — JavaScript Basics',
      description: 'Variables, functions, DOM manipulation, and events',
      topics: [
        { id: 'web-u3-t1', name: 'Variables and Data Types (var, let, const)', status: 'not_started' },
        { id: 'web-u3-t2', name: 'Functions (declarations, expressions, arrow)', status: 'not_started' },
        { id: 'web-u3-t3', name: 'DOM Manipulation (getElementById, querySelector)', status: 'not_started' },
        { id: 'web-u3-t4', name: 'Events (click, submit, keydown, mouseover)', status: 'not_started' },
        { id: 'web-u3-t5', name: 'Form Validation with JavaScript', status: 'not_started' },
      ],
    },
    {
      id: 'web-u4',
      name: 'UNIT 04 — Advanced JavaScript',
      description: 'ES6 features, promises, fetch API, JSON, and local storage',
      topics: [
        { id: 'web-u4-t1', name: 'ES6 Features (destructuring, spread, template literals)', status: 'not_started' },
        { id: 'web-u4-t2', name: 'Promises and Async/Await', status: 'not_started' },
        { id: 'web-u4-t3', name: 'Fetch API and REST Concepts', status: 'not_started' },
        { id: 'web-u4-t4', name: 'JSON Parsing and Stringify', status: 'not_started' },
        { id: 'web-u4-t5', name: 'Local Storage and Session Storage', status: 'not_started' },
      ],
    },
    {
      id: 'web-u5',
      name: 'UNIT 05 — Web Security and Hosting',
      description: 'Web security, cookies, sessions, hosting, and version control',
      topics: [
        { id: 'web-u5-t1', name: 'Web Security (XSS, CSRF, SQL Injection)', status: 'not_started' },
        { id: 'web-u5-t2', name: 'Cookies and Sessions', status: 'not_started' },
        { id: 'web-u5-t3', name: 'HTTPS and SSL/TLS', status: 'not_started' },
        { id: 'web-u5-t4', name: 'Web Hosting Basics', status: 'not_started' },
        { id: 'web-u5-t5', name: 'Version Control with Git', status: 'not_started' },
      ],
    },
  ],
};
