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

export const EVALUATORS = ['Mayukh', 'Saki', 'Faisal', 'Kasshaf'];

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
  }
};

// Complete dataset containing all 13 candidates
export const INITIAL_STUDENTS = [
  {
    id: 'skr-213',
    name: 'Ananya Roy',
    joiningDate: '2026-04-20',
    progress: 100,
    mockInterviews: 7,
    rating: 'placed',
    placementCompany: 'Innovate Tech Solutions',
    placementRole: 'Frontend Developer',
    placementDate: '2026-07-28',
    stickyNotes: [
      {
        id: 'note-213-1',
        date: '2026-07-28',
        content: 'OFFER ACCEPTED! Successfully placed at Innovate Tech Solutions as Frontend Developer!',
        category: 'General',
        author: 'Mayukh',
        accent: 'green',
        pinned: true
      }
    ]
  },
  {
    id: 'skr-212',
    name: 'Avirup',
    joiningDate: '2026-07-15',
    progress: 98,
    mockInterviews: 3,
    rating: 'excellent',
    placementCompany: '',
    placementRole: '',
    placementDate: '',
    stickyNotes: [
      {
        id: 'note-212-1',
        date: '2026-07-29',
        content: '98% course completion, 3 mock interviews attended. Outstanding performer ready for tech rounds.',
        category: 'Mock Feedback',
        author: 'Mayukh',
        accent: 'green',
        pinned: true
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
    stickyNotes: [
      {
        id: 'note-201-1',
        date: '2026-07-26',
        content: 'Needs a break of this week will return next week.',
        category: 'General',
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
    stickyNotes: [
      {
        id: 'note-202-1',
        date: '2026-07-24',
        content: 'Joined on 24 July. 0% progress.',
        category: 'Attendance',
        author: 'Mayukh',
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
    stickyNotes: [
      {
        id: 'note-203-1',
        date: '2026-07-20',
        content: 'Unresponsive.',
        category: 'Attendance',
        author: 'Mayukh',
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
    stickyNotes: [
      {
        id: 'note-204-1',
        date: '2026-07-15',
        content: 'Mother died, unresponsive.',
        category: 'General',
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
    stickyNotes: [
      {
        id: 'note-205-1',
        date: '2026-07-22',
        content: '2% progress. No progress left.',
        category: 'Technical',
        author: 'Mayukh',
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
    mockInterviews: 0,
    rating: 'needs_attention',
    placementCompany: '',
    placementRole: '',
    placementDate: '',
    stickyNotes: [
      {
        id: 'note-206-1',
        date: '2026-07-21',
        content: 'Progress halted after reaching projects.',
        category: 'Technical',
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
    stickyNotes: [
      {
        id: 'note-207-1',
        date: '2026-07-18',
        content: 'Had his house on fire so no progress for a long time, wants to get back but hasn’t replied.',
        category: 'General',
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
    mockInterviews: 1,
    rating: 'needs_attention',
    placementCompany: '',
    placementRole: '',
    placementDate: '',
    stickyNotes: [
      {
        id: 'note-208-1',
        date: '2026-07-15',
        content: 'Hasn’t submitted HLD Project 1, 1 mock interview attended.',
        category: 'Mock Feedback',
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
    mockInterviews: 3,
    rating: 'good',
    placementCompany: '',
    placementRole: '',
    placementDate: '',
    stickyNotes: [
      {
        id: 'note-209-1',
        date: '2026-07-24',
        content: '88% progress, 3 mock interviews attended.',
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
    stickyNotes: [
      {
        id: 'note-210-1',
        date: '2026-07-25',
        content: 'Had 4 mock interviews, performing poorly in interviews, need more attention.',
        category: 'Mock Feedback',
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
    stickyNotes: [
      {
        id: 'note-211-1',
        date: '2026-07-22',
        content: 'Joined 3 mock interviews, hasn’t done any projects and doesn’t responds to my texts.',
        category: 'Attendance',
        author: 'Mayukh',
        accent: 'orange',
        pinned: true
      }
    ]
  }
];
