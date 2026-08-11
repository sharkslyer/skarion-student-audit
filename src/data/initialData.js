export const RATING_CONFIG = {
  placed: {
    label: 'Placed 🎓',
    badgeClass: 'badge-placed',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    icon: '🎓',
    desc: 'Hired & Placed in tech company!'
  },
  excellent: {
    label: 'Excellent',
    badgeClass: 'badge-excellent',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    icon: '🌟',
    desc: 'Top performer, high code quality & ready for tech rounds'
  },
  good: {
    label: 'Good',
    badgeClass: 'badge-good',
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd',
    icon: '👍',
    desc: 'Steady progress, good comprehension & attendance'
  },
  needs_attention: {
    label: 'Needs Attention',
    badgeClass: 'badge-attention',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    icon: '⚠️',
    desc: 'Needs push in assignments, projects or mock practice'
  },
  bad: {
    label: 'At Risk',
    badgeClass: 'badge-bad',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    icon: '🔴',
    desc: 'Immediate intervention required, unresponsive or missing deadlines'
  }
};

export const EVALUATORS = ['Mayukh', 'Kasshaf', 'Faisal', 'Saki', 'Ferdous', 'Piyas'];

export const EVALUATOR_CONFIG = {
  Kasshaf: {
    label: 'Kasshaf',
    bg: '#e0f2fe',       // Sky Blue
    text: '#0369a1',
    border: '#7dd3fc',
    badgeBg: '#0284c7',
    badgeText: '#ffffff',
    icon: '👤'
  },
  Mayukh: {
    label: 'Mayukh',
    bg: '#ffe4e6',       // Light Red
    text: '#e11d48',
    border: '#fecdd3',
    badgeBg: '#e11d48',
    badgeText: '#ffffff',
    icon: '👤'
  },
  Faisal: {
    label: 'Faisal',
    bg: '#dcfce7',       // Green
    text: '#15803d',
    border: '#86efac',
    badgeBg: '#15803d',
    badgeText: '#ffffff',
    icon: '👤'
  },
  Saki: {
    label: 'Saki',
    bg: '#fef9c3',       // Light Yellow
    text: '#a16207',
    border: '#fef08a',
    badgeBg: '#ca8a04',
    badgeText: '#ffffff',
    icon: '👤'
  },
  Ferdous: {
    label: 'Ferdous',
    bg: '#f3e8ff',       // Purple / Violet
    text: '#7c3aed',
    border: '#ddd6fe',
    badgeBg: '#7c3aed',
    badgeText: '#ffffff',
    icon: '👤'
  },
  Piyas: {
    label: 'Piyas',
    bg: '#ffedd5',       // Orange / Amber
    text: '#ea580c',
    border: '#fed7aa',
    badgeBg: '#ea580c',
    badgeText: '#ffffff',
    icon: '👤'
  }
};

export const CATEGORIES = [
  'Mock Feedback',
  'Technical',
  'Soft Skills',
  'Attendance',
  'Onboarding',
  'Interview Experience',
  'Course Progression',
  'Behavior',
  'Background',
  'Situation',
  'General'
];

export const CATEGORY_COLORS = {
  'Mock Feedback': { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },
  'Technical': { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
  'Soft Skills': { bg: '#f3e8ff', text: '#7e22ce', border: '#e9d5ff' },
  'Attendance': { bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5' },
  'Onboarding': { bg: '#dcfce7', text: '#15803d', border: '#86efac' },
  'Interview Experience': { bg: '#e0e7ff', text: '#4338ca', border: '#c7d2fe' },
  'Course Progression': { bg: '#ccfbf1', text: '#0f766e', border: '#99f6e4' },
  'Behavior': { bg: '#fae8ff', text: '#a21caf', border: '#f5d0fe' },
  'Background': { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' },
  'Situation': { bg: '#ffedd5', text: '#c2410c', border: '#fed7aa' },
  'General': { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' }
};

export const MOCK_ROUND_TYPES = [
  'System Design (HLD)',
  'Coding & Data Structures',
  'Behavioral & Soft Skills',
  'Resume & Portfolio'
];

// Complete dataset containing all 13 candidates with rich mock interview sessions from all evaluators
export const INITIAL_STUDENTS = [
  {
    id: 'skr-213',
    name: 'Ananya Roy',
    joiningDate: '2026-04-20',
    progress: 100,
    mockInterviews: 5,
    rating: 'placed',
    placementCompany: 'Innovate Tech Solutions',
    placementRole: 'Frontend Developer',
    placementDate: '2026-07-28',
    mockSessions: [
      { id: 'mock-213-1', date: '2026-06-10', score: 6.0, evaluator: 'Ferdous', category: 'Coding & Data Structures', feedback: 'Good understanding of JS fundamentals, needs practice on async patterns.', strengths: 'Syntax fluency', improvement: 'Async/Await error handling' },
      { id: 'mock-213-2', date: '2026-06-25', score: 7.5, evaluator: 'Saki', category: 'System Design (HLD)', feedback: 'Solid component hierarchy design. Improved state management.', strengths: 'UI component modularity', improvement: 'Caching strategies' },
      { id: 'mock-213-3', date: '2026-07-08', score: 8.5, evaluator: 'Piyas', category: 'Resume & Portfolio', feedback: 'Great portfolio project demonstration. Clean code presentation.', strengths: 'Portfolio projects', improvement: 'Live API demo confidence' },
      { id: 'mock-213-4', date: '2026-07-12', score: 9.0, evaluator: 'Faisal', category: 'Coding & Data Structures', feedback: 'High quality code with clean Time/Space complexity analysis.', strengths: 'Clean code & recursion', improvement: 'Edge case validation' },
      { id: 'mock-213-5', date: '2026-07-28', score: 10.0, evaluator: 'Mayukh', category: 'Interview Experience', feedback: 'Passed final round! Flawless live coding & technical communication.', strengths: 'Complete tech mastery', improvement: 'None - Ready for job market' }
    ],
    stickyNotes: [
      {
        id: 'note-213-1',
        date: '2026-07-28',
        content: 'OFFER ACCEPTED! Successfully placed at Innovate Tech Solutions as Frontend Developer!',
        category: 'Interview Experience',
        author: 'Mayukh',
        accent: 'green',
        pinned: true
      },
      {
        id: 'note-213-2',
        date: '2026-07-08',
        content: 'Portfolio review completed by Piyas. Resume is ready for top tier tech applications.',
        category: 'Technical',
        author: 'Piyas',
        accent: 'blue',
        pinned: false
      }
    ]
  },
  {
    id: 'skr-212',
    name: 'Avirup',
    joiningDate: '2026-07-15',
    progress: 98,
    mockInterviews: 4,
    rating: 'excellent',
    placementCompany: '',
    placementRole: '',
    placementDate: '',
    mockSessions: [
      { id: 'mock-212-1', date: '2026-07-16', score: 7.0, evaluator: 'Mayukh', category: 'System Design (HLD)', feedback: 'Good grasp of basic system architecture, needs work on load balancer failover details.', strengths: 'Database schema modeling', improvement: 'Load balancer failover' },
      { id: 'mock-212-2', date: '2026-07-20', score: 8.0, evaluator: 'Ferdous', category: 'Behavioral & Soft Skills', feedback: 'Very confident in articulating technical trade-offs.', strengths: 'Technical storytelling', improvement: 'Pacing during Q&A' },
      { id: 'mock-212-3', date: '2026-07-22', score: 8.5, evaluator: 'Kasshaf', category: 'Coding & Data Structures', feedback: 'Excellent algorithm optimization, clean dynamic programming solution.', strengths: 'DP algorithms', improvement: 'Time complexity explanation' },
      { id: 'mock-212-4', date: '2026-07-29', score: 9.5, evaluator: 'Piyas', category: 'System Design (HLD)', feedback: 'Flawless database sharding and caching strategy. Outstanding performer ready for tech rounds.', strengths: 'Distributed systems & sharding', improvement: 'Polishing verbal delivery' }
    ],
    stickyNotes: [
      {
        id: 'note-212-1',
        date: '2026-07-29',
        content: '98% course completion, 4 mock interviews attended. Outstanding performer ready for tech rounds.',
        category: 'Course Progression',
        author: 'Mayukh',
        accent: 'green',
        pinned: true
      },
      {
        id: 'note-212-2',
        date: '2026-07-20',
        content: 'Ferdous evaluated behavioral mock: Candidate communicates complex technical ideas clearly.',
        category: 'Soft Skills',
        author: 'Ferdous',
        accent: 'purple',
        pinned: false
      }
    ]
  },
  {
    id: 'skr-201',
    name: 'Saif Hasnath',
    joiningDate: '2026-07-25',
    progress: 4,
    mockInterviews: 0,
    rating: 'needs_attention',
    placementCompany: '',
    placementRole: '',
    placementDate: '',
    mockSessions: [],
    stickyNotes: [
      {
        id: 'note-201-1',
        date: '2026-07-26',
        content: 'Needs a break of this week will return next week.',
        category: 'Situation',
        author: 'Mayukh',
        accent: 'amber',
        pinned: true
      }
    ]
  },
  {
    id: 'skr-202',
    name: 'Saeed Ali',
    joiningDate: '2026-07-24',
    progress: 0,
    mockInterviews: 0,
    rating: 'good',
    placementCompany: '',
    placementRole: '',
    placementDate: '',
    mockSessions: [],
    stickyNotes: [
      {
        id: 'note-202-1',
        date: '2026-07-24',
        content: 'Joined on 24 July. 0% progress.',
        category: 'Onboarding',
        author: 'Piyas',
        accent: 'blue',
        pinned: false
      }
    ]
  },
  {
    id: 'skr-203',
    name: 'Nahida Sultana',
    joiningDate: '2026-07-09',
    progress: 4,
    mockInterviews: 0,
    rating: 'bad',
    placementCompany: '',
    placementRole: '',
    placementDate: '',
    mockSessions: [],
    stickyNotes: [
      {
        id: 'note-203-1',
        date: '2026-07-20',
        content: 'Unresponsive.',
        category: 'Behavior',
        author: 'Ferdous',
        accent: 'orange',
        pinned: true
      }
    ]
  },
  {
    id: 'skr-204',
    name: 'Aitymon Sholomer',
    joiningDate: '2026-07-08',
    progress: 0,
    mockInterviews: 0,
    rating: 'needs_attention',
    placementCompany: '',
    placementRole: '',
    placementDate: '',
    mockSessions: [],
    stickyNotes: [
      {
        id: 'note-204-1',
        date: '2026-07-15',
        content: 'Mother died, unresponsive.',
        category: 'Situation',
        author: 'Mayukh',
        accent: 'amber',
        pinned: true
      }
    ]
  },
  {
    id: 'skr-205',
    name: 'Tahsun',
    joiningDate: '2026-07-07',
    progress: 2,
    mockInterviews: 0,
    rating: 'bad',
    placementCompany: '',
    placementRole: '',
    placementDate: '',
    mockSessions: [],
    stickyNotes: [
      {
        id: 'note-205-1',
        date: '2026-07-22',
        content: '2% progress. No progress left.',
        category: 'Course Progression',
        author: 'Piyas',
        accent: 'orange',
        pinned: true
      }
    ]
  },
  {
    id: 'skr-206',
    name: 'Tahsin Mahi',
    joiningDate: '2026-07-05',
    progress: 22,
    mockInterviews: 1,
    rating: 'needs_attention',
    placementCompany: '',
    placementRole: '',
    placementDate: '',
    mockSessions: [
      { id: 'mock-206-1', date: '2026-07-18', score: 5.5, evaluator: 'Ferdous', category: 'Coding & Data Structures', feedback: 'Needs assistance with project completion and array manipulation.', strengths: 'Loops & basics', improvement: 'Project submission' }
    ],
    stickyNotes: [
      {
        id: 'note-206-1',
        date: '2026-07-21',
        content: 'Progress halted after reaching projects.',
        category: 'Course Progression',
        author: 'Mayukh',
        accent: 'amber',
        pinned: true
      }
    ]
  },
  {
    id: 'skr-207',
    name: 'Akash Dotel',
    joiningDate: '2026-06-22',
    progress: 8,
    mockInterviews: 0,
    rating: 'needs_attention',
    placementCompany: '',
    placementRole: '',
    placementDate: '',
    mockSessions: [],
    stickyNotes: [
      {
        id: 'note-207-1',
        date: '2026-07-18',
        content: 'Had his house on fire so no progress for a long time, wants to get back but hasn’t replied.',
        category: 'Situation',
        author: 'Mayukh',
        accent: 'amber',
        pinned: true
      }
    ]
  },
  {
    id: 'skr-208',
    name: 'Bhaskar Roy',
    joiningDate: '2026-05-20',
    progress: 25,
    mockInterviews: 2,
    rating: 'needs_attention',
    placementCompany: '',
    placementRole: '',
    placementDate: '',
    mockSessions: [
      { id: 'mock-208-1', date: '2026-07-05', score: 5.5, evaluator: 'Piyas', category: 'Coding & Data Structures', feedback: 'Initial assessment okay, needs faster coding speed.', strengths: 'Basic syntax', improvement: 'Coding speed' },
      { id: 'mock-208-2', date: '2026-07-15', score: 6.0, evaluator: 'Mayukh', category: 'Coding & Data Structures', feedback: 'Hasn’t submitted HLD Project 1, 2 mock interviews attended.', strengths: 'Basic syntax', improvement: 'Project submission & consistency' }
    ],
    stickyNotes: [
      {
        id: 'note-208-1',
        date: '2026-07-15',
        content: 'Hasn’t submitted HLD Project 1, 2 mock interviews attended.',
        category: 'Technical',
        author: 'Mayukh',
        accent: 'amber',
        pinned: true
      }
    ]
  },
  {
    id: 'skr-209',
    name: 'Najiur Rahman',
    joiningDate: '2026-04-29',
    progress: 88,
    mockInterviews: 4,
    rating: 'good',
    placementCompany: '',
    placementRole: '',
    placementDate: '',
    mockSessions: [
      { id: 'mock-209-1', date: '2026-07-05', score: 6.5, evaluator: 'Kasshaf', category: 'Coding & Data Structures', feedback: 'Good problem-solving approach, needs faster implementation.', strengths: 'Logic formulation', improvement: 'Coding speed' },
      { id: 'mock-209-2', date: '2026-07-12', score: 7.2, evaluator: 'Ferdous', category: 'Behavioral & Soft Skills', feedback: 'Clear articulation of past project experiences.', strengths: 'Communication', improvement: 'STAR framework' },
      { id: 'mock-209-3', date: '2026-07-15', score: 7.8, evaluator: 'Faisal', category: 'System Design (HLD)', feedback: 'Solid understanding of microservices architecture.', strengths: 'API design', improvement: 'Database scaling' },
      { id: 'mock-209-4', date: '2026-07-24', score: 8.8, evaluator: 'Mayukh', category: 'System Design (HLD)', feedback: 'Great response on database indexing and API rate limiting. 88% progress.', strengths: 'Indexing & rate limiting', improvement: 'Minor edge cases' }
    ],
    stickyNotes: [
      {
        id: 'note-209-1',
        date: '2026-07-24',
        content: '88% progress, 4 mock interviews attended.',
        category: 'Mock Feedback',
        author: 'Mayukh',
        accent: 'blue',
        pinned: true
      }
    ]
  },
  {
    id: 'skr-210',
    name: 'Arif',
    joiningDate: '2026-04-11',
    progress: 96,
    mockInterviews: 4,
    rating: 'needs_attention',
    placementCompany: '',
    placementRole: '',
    placementDate: '',
    mockSessions: [
      { id: 'mock-210-1', date: '2026-07-02', score: 5.0, evaluator: 'Saki', category: 'Coding & Data Structures', feedback: 'Struggled with tree traversal edge cases.', strengths: 'Recursion basics', improvement: 'Tree traversal' },
      { id: 'mock-210-2', date: '2026-07-10', score: 4.0, evaluator: 'Faisal', category: 'System Design (HLD)', feedback: 'Could not explain message queue partitioning.', strengths: 'High level concepts', improvement: 'Queue partitioning' },
      { id: 'mock-210-3', date: '2026-07-18', score: 5.5, evaluator: 'Mayukh', category: 'Behavioral & Soft Skills', feedback: 'Improved communication, but technical answers lacked structure.', strengths: 'Enthusiasm', improvement: 'Structured answers' },
      { id: 'mock-210-4', date: '2026-07-25', score: 4.5, evaluator: 'Piyas', category: 'Coding & Data Structures', feedback: 'Had 4 mock interviews, performing poorly in interviews, need more attention.', strengths: 'Persistence', improvement: 'Core problem solving' }
    ],
    stickyNotes: [
      {
        id: 'note-210-1',
        date: '2026-07-25',
        content: 'Had 4 mock interviews, performing poorly in interviews, need more attention.',
        category: 'Interview Experience',
        author: 'Mayukh',
        accent: 'amber',
        pinned: true
      }
    ]
  },
  {
    id: 'skr-211',
    name: 'Raisa',
    joiningDate: '2026-03-28',
    progress: 25,
    mockInterviews: 3,
    rating: 'bad',
    placementCompany: '',
    placementRole: '',
    placementDate: '',
    mockSessions: [
      { id: 'mock-211-1', date: '2026-06-15', score: 5.0, evaluator: 'Mayukh', category: 'Coding & Data Structures', feedback: 'Initial assessment okay, but lacks project submissions.', strengths: 'Basic syntax', improvement: 'Project work' },
      { id: 'mock-211-2', date: '2026-07-02', score: 4.0, evaluator: 'Saki', category: 'Behavioral & Soft Skills', feedback: 'Needs more regular attendance and practice.', strengths: 'Punctuality', improvement: 'Active participation' },
      { id: 'mock-211-3', date: '2026-07-22', score: 3.0, evaluator: 'Ferdous', category: 'Attendance', feedback: 'Joined 3 mock interviews, hasn’t done any projects and doesn’t responds to texts.', strengths: 'None noted', improvement: 'Communication & responsiveness' }
    ],
    stickyNotes: [
      {
        id: 'note-211-1',
        date: '2026-07-22',
        content: 'Joined 3 mock interviews, hasn’t done any projects and doesn’t responds to my texts.',
        category: 'Behavior',
        author: 'Mayukh',
        accent: 'orange',
        pinned: true
      }
    ]
  }
];
