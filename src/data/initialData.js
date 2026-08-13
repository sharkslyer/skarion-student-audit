export const RATING_CONFIG = {
  placed: {
    label: 'Placed',
    badgeClass: 'badge-placed',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    icon: '',
    desc: 'Hired & Placed in tech company!'
  },
  excellent: {
    label: 'Excellent',
    badgeClass: 'badge-excellent',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    icon: '',
    desc: 'Top performer, high code quality & ready for tech rounds'
  },
  good: {
    label: 'Good',
    badgeClass: 'badge-good',
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd',
    icon: '',
    desc: 'Steady progress, good comprehension & attendance'
  },
  needs_attention: {
    label: 'Needs Attention',
    badgeClass: 'badge-attention',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    icon: '',
    desc: 'Needs push in assignments, projects or mock practice'
  },
  bad: {
    label: 'At Risk',
    badgeClass: 'badge-bad',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    icon: '',
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
    icon: ''
  },
  Mayukh: {
    label: 'Mayukh',
    bg: '#ffe4e6',       // Light Red
    text: '#e11d48',
    border: '#fecdd3',
    badgeBg: '#e11d48',
    badgeText: '#ffffff',
    icon: ''
  },
  Faisal: {
    label: 'Faisal',
    bg: '#dcfce7',       // Green
    text: '#15803d',
    border: '#86efac',
    badgeBg: '#15803d',
    badgeText: '#ffffff',
    icon: ''
  },
  Saki: {
    label: 'Saki',
    bg: '#fef9c3',       // Light Yellow
    text: '#a16207',
    border: '#fef08a',
    badgeBg: '#ca8a04',
    badgeText: '#ffffff',
    icon: ''
  },
  Ferdous: {
    label: 'Ferdous',
    bg: '#f3e8ff',       // Purple / Violet
    text: '#7c3aed',
    border: '#ddd6fe',
    badgeBg: '#7c3aed',
    badgeText: '#ffffff',
    icon: ''
  },
  Piyas: {
    label: 'Piyas',
    bg: '#ffedd5',       // Orange / Amber
    text: '#ea580c',
    border: '#fed7aa',
    badgeBg: '#ea580c',
    badgeText: '#ffffff',
    icon: ''
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
  'Behavioral',
  'Practical',
  'Technological',
  'Overall',
  'Other'
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
      { id: 'mock-213-1', date: '2026-06-10', score: 6.0, evaluator: 'Ferdous', category: 'Technological', feedback: 'Good understanding of JS fundamentals, needs practice on async patterns.', strengths: 'Syntax fluency', improvement: 'Async/Await error handling' },
      { id: 'mock-213-2', date: '2026-06-25', score: 7.5, evaluator: 'Saki', category: 'Technological', feedback: 'Solid component hierarchy design. Improved state management.', strengths: 'UI component modularity', improvement: 'Caching strategies' },
      { id: 'mock-213-3', date: '2026-07-08', score: 8.5, evaluator: 'Piyas', category: 'Practical', feedback: 'Great portfolio project demonstration. Clean code presentation.', strengths: 'Portfolio projects', improvement: 'Live API demo confidence' },
      { id: 'mock-213-4', date: '2026-07-12', score: 9.0, evaluator: 'Faisal', category: 'Technological', feedback: 'High quality code with clean Time/Space complexity analysis.', strengths: 'Clean code & recursion', improvement: 'Edge case validation' },
      { id: 'mock-213-5', date: '2026-07-28', score: 10.0, evaluator: 'Mayukh', category: 'Behavioral', feedback: 'Passed final round! Flawless live coding & technical communication.', strengths: 'Complete tech mastery', improvement: 'None - Ready for job market', transcript: 'Interviewer (Mayukh): Welcome Ananya to your final round! Let’s jump straight into live coding.\n\nCandidate (Ananya): Thanks Mayukh! Ready when you are.\n\nInterviewer (Mayukh): Build a custom React hook `useDebounce` with TypeScript and demonstrate it on an input field.\n\nCandidate (Ananya): I will define `useDebounce<T>(value: T, delay: number): T`. Inside the hook, we store `debouncedValue` state and use `useEffect` to trigger a `setTimeout`. In the effect cleanup function, we call `clearTimeout(timer)` to cancel pending timeouts on rapid keystrokes.\n\nInterviewer (Mayukh): Perfect execution! 10/10.' }
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
      { id: 'mock-212-1', date: '2026-07-16', score: 7.0, evaluator: 'Mayukh', category: 'Technological', feedback: 'Good grasp of basic system architecture, needs work on load balancer failover details.', strengths: 'Database schema modeling', improvement: 'Load balancer failover' },
      { id: 'mock-212-2', date: '2026-07-20', score: 8.0, evaluator: 'Ferdous', category: 'Behavioral', feedback: 'Very confident in articulating technical trade-offs.', strengths: 'Technical storytelling', improvement: 'Pacing during Q&A' },
      { id: 'mock-212-3', date: '2026-07-22', score: 8.5, evaluator: 'Kasshaf', category: 'Technological', feedback: 'Excellent algorithm optimization, clean dynamic programming solution.', strengths: 'DP algorithms', improvement: 'Time complexity explanation' },
      { id: 'mock-212-4', date: '2026-07-29', score: 9.5, evaluator: 'Piyas', category: 'Practical', feedback: 'Flawless database sharding and caching strategy. Outstanding performer ready for tech rounds.', strengths: 'Distributed systems & sharding', improvement: 'Polishing verbal delivery', transcript: 'Mayukh [00:04]: All right, so I\'m going to keep the rest of the meeting in English so that I can extract the transcript and give you the summary of it. So let\'s assume in this mock interview, you are attending an OSP design engineer interview. Try to answer questions carefully and beat around the bush in an accurate way. Remember, your current role is OSP design engineer at Bayshore Communications using AutoCAD, ArcGIS, etc.\n\nAvirup [00:48]: Okay.\n\nMayukh [00:49]: Okay, let\'s start. So, tell me about yourself and your journey into OSP Design Engineering.\n\nAvirup [00:57]: To start off, I am currently working as an OSP design engineer at Bayshore Communications, based out of Tampa, Florida. In my day-to-day work, I have led the design and drafting of more than 400,000 linear feet of fiber optic infrastructure for multi-phase XGSPON and STTX residential rollouts covering over 40 miles for 500+ premises. I produce HLD and LLD packages, fiber splice matrices, and splitter configs for 1x32 network architectures.\n\nFaisal [34:02]: Yeah, we can definitely add that under Skarion that you did GIS work here.\n\nAvirup [34:03]: Okay, yeah. Definitely.\n\nFaisal [34:09]: Ferdous, do you think we should be able to do it?\n\nFerdous [34:13]: Yep, we can.\n\nKasshaf [34:13]: I compared the resume accordingly with the requirement we had, I got it ready for you.\n\nFerdous [34:21]: Alright.\n\nFaisal [34:25]: I think we have another call to jump into. Did you have any other questions over here?\n\nAvirup [34:29]: Not a problem. No, that\'s what I wanted to let you all know about.\n\nFaisal [34:34]: All right, perfect. Akash will be in touch with you to make sure we do it right.\n\nMayukh [34:57]: Take care, man.\n\nAvirup [35:00]: Thank you so much for joining in, everyone.' }
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
    id: 'skr-214',
    name: 'Ahmed Chowdhury',
    joiningDate: '2026-08-01',
    progress: 85,
    mockInterviews: 1,
    rating: 'good',
    placementCompany: '',
    placementRole: '',
    placementDate: '',
    mockSessions: [
      {
        id: 'mock-214-1',
        date: '2026-08-13',
        score: 8.0,
        evaluator: 'Mayukh',
        category: 'Overall',
        feedback: 'Preliminary OSP mock interview. Above average performance for a first-timer. Good technical foundation and clear explanation of FTTX and right-of-way concepts.',
        strengths: 'Handhold & ROW domain concept comprehension, adaptable learning mindset',
        improvement: 'Articulating CV experience alignment with deeper technical context',
        transcript: `Mayukh [00:04]: Hello!

Ahmed Chowdhury [00:07]: Hello?

Mayukh [00:08]: Yeah, can you hear me?

Ahmed Chowdhury [00:09]: Yes.

Mayukh [00:11]: All right, how's everything back?

Ahmed Chowdhury [00:14]: Good, a bit nervous with the interview because not really not great in interviews.

Mayukh [00:18]: Ohh, it's fine. Yeah, no one is great actually. Even if I'm just put in a chair to attend an interview, I'm going to mess up real bad. I'm going to stutter. But it's absolutely fine. The more you practice, the more you improve, all right? So it's a preliminary mock, not because it's a first one, but because your resume is not ready.

Ahmed Chowdhury [00:28]: Yes. Ms.

Mayukh [00:40]: We're going to run this mock with your old resume for now with just some preliminary stuff, but we're going to prepare another resume and we're going to schedule another mock based on your new and more strong resume that's appropriate for OSP Engineering role.

Ahmed Chowdhury [01:03]: Gotcha.

Mayukh [01:04]: All right, yeah. All right, so I'm going to keep the recording on and I'm going to keep the rest of the meeting in English so that I can generate a summary out of it. Tell me about yourself.

Ahmed Chowdhury [02:06]: I'm an OSP engineer. My name is Ahmed. I do designing for in top level.

Mayukh [02:32]: Just remember, this interview is going to be based on your old resume.

Ahmed Chowdhury [02:48]: Okay, my name is Ahmed. I am currently doing data Engineering at freelance. I build ETL pipelines using Azure Data Factory.

Mayukh [03:18]: All right. Why are you interested in OSP design engineering when your background is in computer engineering?

Ahmed Chowdhury [03:25]: I found it interesting working with fiber, seeing how fiber optic cables work and how it is built around cities.

Mayukh [03:54]: All right, do you know what is FTTX?

Ahmed Chowdhury [04:01]: Yes, it's basically fiber to home users.

Mayukh [04:19]: Can you explain what is the ROW?

Ahmed Chowdhury [04:25]: So the right of way is basically the boundary where we cannot work after. We have to work between the right of way and the easement.

Mayukh [04:38]: And what is a handhold?

Ahmed Chowdhury [04:46]: A handhold is a small dugout where we do splicing and where we store extra wires in case of future growth.

Mayukh [05:05]: Have you worked with AutoCAD?

Ahmed Chowdhury [05:10]: Yes, I have built high-level designs and diagrams laying out handholds, fiber distribution hubs, and splice points.

Mayukh [06:03]: How does your data engineering experience relate to OSP?

Ahmed Chowdhury [06:16]: In data engineering we require a lot of automation and efficiency. OSP engineering has similar needs to automate recurring issues.

Mayukh [07:00]: How do you approach learning a software that is unfamiliar?

Ahmed Chowdhury [07:15]: Hands-on learning. I choose a small project and learn the primary tools within that software.

Mayukh [07:51]: Why should we hire you over someone who has direct OSP experience?

Ahmed Chowdhury [08:03]: In my previous roles I brought productivity and efficiency increases, bringing reliability and accountability.

Mayukh [09:05]: All right, I think we can wrap it up here. As a first timer, you were able to answer some questions seamlessly. Above average performance.

Ahmed Chowdhury [15:15]: Alright, perfect. Thank you.

Mayukh [15:17]: You're welcome. Take care.

Ahmed Chowdhury [15:18]: Alright, bye.

Mayukh [15:24]: Today, more.

Piyas [15:27]: Let me stop.`
      }
    ],
    stickyNotes: [
      {
        id: 'note-214-1',
        date: '2026-08-13',
        content: 'Preliminary OSP mock interview completed. 8/10 rating. Above average first-time performance.',
        category: 'Mock Feedback',
        author: 'Mayukh',
        accent: 'blue',
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
      { id: 'mock-206-1', date: '2026-07-18', score: 5.5, evaluator: 'Ferdous', category: 'Technological', feedback: 'Needs assistance with project completion and array manipulation.', strengths: 'Loops & basics', improvement: 'Project submission' }
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
      { id: 'mock-208-1', date: '2026-07-05', score: 5.5, evaluator: 'Piyas', category: 'Technological', feedback: 'Initial assessment okay, needs faster coding speed.', strengths: 'Basic syntax', improvement: 'Coding speed' },
      { id: 'mock-208-2', date: '2026-07-15', score: 6.0, evaluator: 'Mayukh', category: 'Practical', feedback: 'Hasn’t submitted HLD Project 1, 2 mock interviews attended.', strengths: 'Basic syntax', improvement: 'Project submission & consistency' }
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
      { id: 'mock-209-1', date: '2026-07-05', score: 6.5, evaluator: 'Kasshaf', category: 'Technological', feedback: 'Good problem-solving approach, needs faster implementation.', strengths: 'Logic formulation', improvement: 'Coding speed' },
      { id: 'mock-209-2', date: '2026-07-12', score: 7.2, evaluator: 'Ferdous', category: 'Behavioral', feedback: 'Clear articulation of past project experiences.', strengths: 'Communication', improvement: 'STAR framework' },
      { id: 'mock-209-3', date: '2026-07-15', score: 7.8, evaluator: 'Faisal', category: 'Technological', feedback: 'Solid understanding of microservices architecture.', strengths: 'API design', improvement: 'Database scaling' },
      { id: 'mock-209-4', date: '2026-07-24', score: 8.8, evaluator: 'Mayukh', category: 'Practical', feedback: 'Great response on database indexing and API rate limiting. 88% progress.', strengths: 'Indexing & rate limiting', improvement: 'Minor edge cases' }
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
      { id: 'mock-210-1', date: '2026-07-02', score: 5.0, evaluator: 'Saki', category: 'Technological', feedback: 'Struggled with tree traversal edge cases.', strengths: 'Recursion basics', improvement: 'Tree traversal' },
      { id: 'mock-210-2', date: '2026-07-10', score: 4.0, evaluator: 'Faisal', category: 'Technological', feedback: 'Could not explain message queue partitioning.', strengths: 'High level concepts', improvement: 'Queue partitioning' },
      { id: 'mock-210-3', date: '2026-07-18', score: 5.5, evaluator: 'Mayukh', category: 'Behavioral', feedback: 'Improved communication, but technical answers lacked structure.', strengths: 'Enthusiasm', improvement: 'Structured answers' },
      { id: 'mock-210-4', date: '2026-07-25', score: 4.5, evaluator: 'Piyas', category: 'Other', feedback: 'Had 4 mock interviews, performing poorly in interviews, need more attention.', strengths: 'Persistence', improvement: 'Core problem solving' }
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
      { id: 'mock-211-1', date: '2026-06-15', score: 5.0, evaluator: 'Mayukh', category: 'Technological', feedback: 'Initial assessment okay, but lacks project submissions.', strengths: 'Basic syntax', improvement: 'Project work' },
      { id: 'mock-211-2', date: '2026-07-02', score: 4.0, evaluator: 'Saki', category: 'Behavioral', feedback: 'Needs more regular attendance and practice.', strengths: 'Punctuality', improvement: 'Active participation' },
      { id: 'mock-211-3', date: '2026-07-22', score: 3.0, evaluator: 'Ferdous', category: 'Other', feedback: 'Joined 3 mock interviews, hasn’t done any projects and doesn’t responds to texts.', strengths: 'None noted', improvement: 'Communication & responsiveness' }
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
