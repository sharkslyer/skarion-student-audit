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
    id: 'skr-216',
    name: 'Bhaskar Roy',
    joiningDate: '2026-08-13',
    progress: 85,
    mockInterviews: 1,
    rating: 'good',
    placementCompany: '',
    placementRole: '',
    placementDate: '',
    mockSessions: [
      {
        id: 'mock-216-1',
        date: '2026-08-13',
        score: 8.0,
        evaluator: 'Mayukh',
        category: 'Technological',
        feedback: 'Mock interview for OSP Design Engineer and Splicing Technician role. Evaluated AutoCAD drafting fundamentals, spatial manager, HLD/LLD packages, and interview communication.',
        strengths: 'AutoCAD fundamentals, Mechanical engineering management background, adaptability',
        improvement: 'Concise intro presentation, connecting mechanical CAD to OSP network drafting',
        transcript: "Bhaskar: First, the thing is, like, you know, tomorrow's should is someone the interviews with, like, maybe some technician or spicer technicians, right?\n\nMayukh: Mhm.\n\nBhaskar: So, like, can you give me the death resume? Like, if... I don't have that that ones, you know.\n\nMayukh: Okay. All right. Yeah, alright, so I'm gonna message.\n\nBhaskar: Because we can equal them on better of the.\n\nMayukh: Sure. And I'm hit this key to both the same. Splicing technology rule, right?\n\nBhaskar: No, technician, you know.\n\nMayukh: I mean, technician. Right, so that allows you to always, is that always been?\n\nBhaskar: I mean, I don't know, like. What does the key?\n\nMayukh: Are you scared about learning AutoCAD or something like that?\n\nBhaskar: No, no, no, I applying in the jobs in the like make mechanical auto get drafted in these steps. This type of job.\n\nMayukh: Yeah, so you do not want to apply in jobs like where you need AutoCAD drafting or something like that.\n\nBhaskar: Yeah, like, I'm not confident in the designing and stuffs, you know, that's why telling you guys, I don't know.\n\nMayukh: All right, but that's actually one of the most promising sides. So that's why maybe they're applying because they accept entry-level candidates much more than other positions.\n\nBhaskar: But they are like that will be in kind of different, right? The... whatever they like, yeah, here is like a cat camp programming. There is a job. Like, I don't know what. The cat camp programmer, then I say. Like this kind of job, that's why then Rubayet modeler. Then... You know, you know.\n\nMayukh: Uh, did you, did you, did any of them reply or schedule an interview with you?\n\nBhaskar: No, no, no, no.\n\nMayukh: All right, if they do, then we're going to take a specialized interview so that you can ace that one. We're going to give you the guidelines so that you can actually ace that interview. But we do that after you actually, after this interview gets scheduled. And so we try to schedule a mock interview based on exactly that. position, we're going to guide you through it. So, yep, no worries. And I would also recommend getting your hang on the AutoCAD because if you know one drafting tool, you will know the 10 other drafting tools because all those are identical almost.\n\nBhaskar: Yeah, but you know, the thing is, is like, is very like, I don't know, is this AutoCAD side works is very much skill thing, you know, like where I... I don't know, like I have to go through more things. Like it's not, we know that, right? It's not like one month thing. Like, when I design designer, like preference packet.\n\nMayukh: Well, actually... Mhm. I understand. Well, basically, AutoCAD, you do not need to actually dive much deep because actually the surface level information is enough if you can draw lines, make offsets, that you can do 50% of the drawings, you know. Actually, no, actually more than that. If you just know lines. and offsetting, then you can do the project one easily. So like Saki Bhai, Saki Bhai learned AutoCAD overnight. He had an interview next day, he spent the whole night learning AutoCAD, and then he aced the interview and got the job. So you do not, the interview was very simple according to his words. He learned a lot of it, but the interview was very easy. He just needed to draw some simple, silly stuff. So if you know some basic knowledge about it, that's going to be enough. Yeah.\n\nBhaskar: Yeah, the thing is, like when I watch the videos of the like from the project, like it doesn't match with the what I see in the auto get the projects, like in my auto opens up, you know, like, like when when you gonna talk about that then?\n\nMayukh: Mhm.\n\nBhaskar: then I'll explain that. That'll be fine.\n\nMayukh: Yeah, sure.\n\nBhaskar: I tell you last week message like I make a GMA. From Jim and processing, we cannot make the interview this last week, thank you.\n\nMayukh: Oh, how did it go?\n\nBhaskar: A like, like, they didn't from the interview didn't go went up from the GM, but their vendor took the interview. I can remember, like, didn't get any reply, but yeah, we just bothered, you know, just to... You know, to transfer it, like, I got an opportunity, so why not just get like same, same processing, you know, like, why not just to be transparent?\n\nMayukh: Yeah, yeah. Thank you so much, Mitee. Try to keep the group updated about it. Just send the text that you attended this interview and this is how it will go. Then maybe Saki and Mustafa can help you out with this. And yeah, so should try to update in the group. All right.\n\nBhaskar: Yeah, sure, yeah, okay.\n\nMayukh: So. Alright, alrighty.\n\nBhaskar: I'm OK, just give me that that explain sir one like explain sir technician, yeah, resume. If I get that, like, it'll be very easy, yeah.\n\nMayukh: Yeah. Sure, just give them a minute. They're going to search it up and they're going to send. I have always sent.\n\nBhaskar: Ohh yeah, sure, sure, yeah, and other questions is last time with Ahmad Islam, maybe Kasshaf maybe, so he said he gonna give me some like whatever in like the thing we have in.\n\nMayukh: Mhm. Yep, pass the page.\n\nBhaskar: The resume, like the projects, the like the 4000, like 400,000 feet, the projects, so if they ask for which employer, you know, like the web for which, and whoever like T-Mobile and stuff, like how I'm gonna answer those things, like...\n\nMayukh: Yeah.\n\nBhaskar: I don't know. Like, if they ask for, why are you like, where did you for whom you work those projects and stuffs, but...\n\nMayukh: All right. All right, it's in the CV actually like the 4000, 400,000 plus feet.\n\nBhaskar: Ha ha ha ha, I like this, like I have in the job description in the like swap technologies they can let the design of the 400,000 feet of aerial underground HGS spawn this stuff.\n\nMayukh: Yeah, you should just say that I did the design in Soft Technologies. I used AutoCAD for the HLD and LLD part. Just exactly what you will be doing in the projects, just say that. But you know, there's a part in the project where we have to draw the conduit lines and the fibers. So basically, it should say that the fibers... You should, it should actually not say like, but more like present like this, that those fibers that you design, those were 400,000 plus miles in total. I'm sorry, the 4000, 400,000 feet plus in total. Yep, that'll be enough. They're not going to verify it. And if they do, but then I...\n\nBhaskar: No, yeah, yeah, yeah, like, but by you able to, like, they gonna acts like usually did not, but it's like it's gonna come like out of interest, you know, like you did for which project, like which for which county and stuff, you know.\n\nMayukh: Yeah, it's going to be Williamson County, Texas. All right, you did a project for Williamson County, Texas, at the whatever the CV says. It says SOP technology, right?\n\nBhaskar: That that was. Yeah, yeah, yeah.\n\nMayukh: Yeah, so the county or the market is Williamson County, Texas. Though they do not usually ask it, but if they do, then it's going to be a really turning point if you cannot answer it. So just remember, the projects that you're going to do is in Williamson County, Texas. Right, so they're gonna share the resume. So, meanwhile, can we start the mock interview with the previous resume? All right, so this...\n\nBhaskar: Yeah, yeah, sure. Yeah, yeah. From the, I opened the, yeah, the maybe the normal one, right? The swap technologies, voicemail, yeah.\n\nMayukh: Yeah. Yes, so based on that, let's assume you have applied for the OSP Design Engineering interviews and interview, and I'm the recruiter. So, you should, your current role is OSP Design Engineering at Soft Technologies. You should mention your key skills as AutoCAD, Spatial Manager, GIS, FTTX, XGS Pawn, etc. And you have to remember the track record of 400,000 plus feet of XGS Pawn, 100 plus permits.\n\nBhaskar: Mhm.\n\nMayukh: Three $1,000,000 plus POMs, and you should also remember the educational background, like masters and bachelors, alright? So that, but remember the target role is OSP design engineer, alright?\n\nBhaskar: Okay, so the main skills are AutoCAD. I need to like say this, right? AutoCAD and 3 AM, yeah.\n\nMayukh: Yes, of course. Right, let's start. Tell me about yourself and your journey into OSP Design Engineering.\n\nBhaskar: Yeah, sure. I'm a mechanical engineer with Masters in Engineering Management from Central Michigan University. I started my career as OSP CAD drafter, like where I worked with the AutoCAD, like 2D and plan view and\n\nMayukh: Rupom. Yes. Mhm.\n\nBhaskar: Detailed drawing with also like something GIS data like red lines with the like with the documentations, you know, so then I moved to OSP design engine app printings role. where I gained more experience with aerial and underground fiber design. Currently, I'm working as an OSP design engineer, where I have been involved in designing like more than 400 feet of AGS PON fiber networks across like multiple. Municipalities, I can say like, you said Williamton, Texas. So, my responsibilities include was preparing construction drawings and permit packages, then coordinating with engineering and permit teams, permitting teams. I also worked on a residential deployment, covering more than like... 40 route miles serving over 500 homes. Yeah.\n\nMayukh: All right, this way. So, why do you choose to specialize in outside band Engineering?\n\nBhaskar: Yeah. Sorry.\n\nMayukh: Why did you choose to specialize in outside plant engineering, even though your degree is in mechanical engineering?\n\nBhaskar: Basically. This is, I can say. Yeah, this waste thing fiber thing is kind of a niche sector, which I like I love. So in my bachelor's, I love drawing and I worked with the AutoCAD service thing. So I always into design and things stuff.\n\nMayukh: Ahmad.\n\nBhaskar: So I choose to specialize in the OSP, because I found that it gave me a practical way to apply my engineering background to real infrastructure projects. So like my strong, although my strong foundation.\n\nMayukh: Yes.\n\nBhaskar: in was in engineering fundamentals, technical drawings, problem solving. So in that way, I started like OSP CAD drafter, then became interested in the like how engineering drawings and translate into actual construction in the field. From there, I progressed with the OSP engineering. Fill design field.\n\nMayukh: All right, that's great. What software tools do you use daily?\n\nBhaskar: Software tools I use for like AutoCAD, mainly for the 2D designs and also the construction documents, documents, then the HLD drawings to like to prepare the aerial.\n\nMayukh: Mm-hmm.\n\nBhaskar: and the underground fiber layouts. Ohh. And I can say, but mainly I use the AutoCAD for like all those projects. And I can say I work with also the spatial manager and the GS base maps to bring like. the raw details into the AutoCAD to improve the accuracy.\n\nMayukh: All right, how do you decide whether to design an aerial route or an underground conduit rule?\n\nBhaskar: A real. First, I can say first reviewing the existing conditions, the the existing the right right of what I can say existing condition and like available utility you say like whatever what is the available utility information. For the for the aerial route, you know, for some like Rd. crossings, then the attachment locations, and for the aerial, these are for the aerial route, and for the underground route, I consider like duck.\n\nMayukh: Mhm.\n\nBhaskar: bank configuration, board location, and like potential like utility conflicts. So this, that's how I work.\n\nMayukh: All right, that's great. When designing underground routes, how do you determine handhold placements?\n\nBhaskar: And so like for underground roots, handle placements. Based on the proposed alignment, like project designs criteria, then the right of way limits, then the I can say like the construction accessibility of the constructions and. And also consider the record spacing and locations.\n\nMayukh: Mmh.\n\nBhaskar: where I can say like the fiber routes go through. On with, yeah, I can fiber goes to. And also, like, I also look after in the GIS, like, so that there is no conflict over any existing infrastructure.\n\nMayukh: Yes, exactly. All right. So there is a harder question. How do you design splice matrices and ensure fiber codes are documented accurately? Can you answer it?\n\nBhaskar: Sorry, right, currently.\n\nMayukh: All right, we're going to skip that, skip this one. So how do you calculate bills of materials for large fiber deployments?\n\nBhaskar: You say the bills of large?\n\nMayukh: Bills of materials, BOM.\n\nBhaskar: Yeah, okay, yeah, bomb, so...\n\nMayukh: Das.\n\nBhaskar: Like bomb from comes. Can you just repeat the question? Sorry, how do you calculate BOM for large fiber?\n\nMayukh: Hills of materials or bombs?\n\nBhaskar: OK, so Sajid, I can say. It is. Form actions.\n\nMayukh: All right, I think we can skip this question then.\n\nBhaskar: Okay.\n\nMayukh: All right. Can you describe a time when you encountered an unexpected design challenge and how did you solve it?\n\nBhaskar: And, yeah, yeah, like one, I can say one design challenge I encountered, like... Like, we uh, we uh, underground fiber route.\n\nMayukh: Mmh.\n\nBhaskar: Where, like, where I couldn't find the actual GIS data and the field data, so that time I like it was kind of difficult to review the conflicts, what's going on, the where doing the underground. Routing, you know, so that time I, I, I get this challenge to encounter.\n\nMayukh: Okay, so we're at the end of the interview. Where do you see your career progressing in the OSP Engineering field over the next three to five years?\n\nBhaskar: I can see. Ohh. I would like to like take on like greater responsibility over the like over three to five years. So like H from like HLD, LLD and development through bar meeting construction documents. I can also like I would like to explore the QA, QC.\n\nMayukh: Mhm.\n\nBhaskar: Yeah, department also, like, yeah, so... through my, also through my better knowledge, you know, so, and deepen, also I can say, become more involved in the complex projects.\n\nMayukh: Right, so I think we can conclude the interview here. You did well, but there are some areas to improve. I'm going to walk you through it. So, do you have any questions before I begin the review?\n\nBhaskar: No.\n\nMayukh: All right, that's great. So, at first, I asked you about, tell me about yourself and your journey into OSP design engine. This answer was really perfect, but try to keep it short. Try to keep it within 60 to 90 seconds. Do not increase the length of the question. Do not increase the length of the answer. Keep it within 60 seconds. 90 seconds. So here you mentioned your bachelor's degree in mechanical engineering and your master's in engineering management from Central Machine University, which was good. You should, yeah, you did good when you mentioned the CAD drafting position and the OSP design engineer position. So here we should show steady progress, like you were a cat drafter, then you become an apprentice, then it become then it became an OS design engineer. All right, so in this case, when they ask you about, tell me about yourself, you do not need to actually describe all the responsibilities all the way down to the numbers. Try to just give them a quick overview. I do this. I did that. I have proficiency in AutoCAD. I have this degree, that degree, that's it. That's going to be enough. Try to keep it a little bit short. Okay, so my next question was, why did you choose to specialize in outside plant engineering? So your answer here was also good, but you should connect that your degree aligns with it very well. You should say I have always been fascinated by. physical infrastructure and how engineering designs come to life in real world. And OSP design is the exact bridge between physical root engineering and modern telecom connectivity. You should say you enjoy working with AutoCAD and GIS, and that's why you chose outside that engineering, because this position actually has an integration. Of both together, alright?\n\nBhaskar: OK, and like I uh, the second question was why, right? Why I get in with low speed?\n\nMayukh: OK, so the next question. Yeah.\n\nBhaskar: Yeah, so like I try to like connect with the my like whatever like my bachelor like the or design thing so that's why you know.\n\nMayukh: Yeah, yeah, that's a strong point as well. You have a bachelor's degree in mechanical engineering and mechanical engineers, if I'm not wrong, they do most of the work in CAD, not AutoCAD. I think they use another SolidWorks. Yes, exactly. You know, that's almost similar to AutoCAD.\n\nBhaskar: Mhm. Soy works, soy works, yeah, yeah.\n\nMayukh: If you have used it, then you're also gonna Ace in AutoCAD, alright?\n\nBhaskar: Yeah.\n\nMayukh: The next question was, what software tools do you use daily? So you should mention only AutoCAD is your primary or core software. And then you should talk about GIS. If they ask you about the specific software, you should talk about ArcGIS Pro. You should only mention these two. so that you can guide the interview to your advantage. All right.\n\nKasshaf: Or, it is with the GSM was simple to see.\n\nMayukh: Not yet, but I think we should because we are selling GIS. So, to the software.\n\nKasshaf: Can I, can I have the access to the resume that that she is getting prepped on this to link?\n\nMayukh: Yeah, sure.\n\nKasshaf: How to break this up?\n\nMayukh: Suva.\n\nKasshaf: Sorry to bring the flow.\n\nMayukh: Oh, no, no, no worries. Let me share the resumes. It target for just a second. Okay. Yeah, here is it.\n\nKasshaf: Chat about Kundi.\n\nMayukh: Yep, I have. I have pinged in path.\n\nKasshaf: Yeah, you can't even plug.\n\nMayukh: They're not, yeah, all right. So your core software should be AutoCAD. Like if they, you should guide the interview so that they should only stick to AutoCAD. And you should say that sometimes I use GIS to verify, but if they ask about software, you should say I do not use it that much. I'm not a proficient as much as I'm proficient in AutoCAD. but I use GIS to verify the locations and everything. All right. Okay, the next question was, how do you decide whether to design an aerial route or an underground conduit rule? So this answer was almost perfect. So here you have to evaluate 4 things. Existing infrastructure, like are there usable utility poles with available attachment spaces? It was good. It was a good answer. We should also talk about municipal regulations and project cost as well here, because those are also important, especially the project cost, because aerial design is way cheaper than the underground design. So yeah, you should consider infrastructure regulations. and total project cost. All right? Okay, the next question was, when designing underground routes, how do you determine handhold placement and directional board paths? So I didn't ask about directional board paths, I only asked you about handhold placements. So here you should mention something like that. The standard is handholds are placed at 500 to 800 foot intervals. And while placing them, you should be aware that they are placed at the right of way boundary, at the right of way area, sorry, at the right of way area. And you should avoid placing handholds at driveways or roadways. That's it. That's going to be enough. So the interval should be 500 to 800 feet. and you should avoid driveways. That's it. All right, the next question was, how do you design splice matrices and ensure fiber color codes are documented accurately? So it was the hardest question of today's interview because it's purely technical. So you should mention that you follow the TIA 598 color code standard. All right, TIA 598 color code standard. So it has blue, orange, green, brown, slate, white, red, black, yellow, violet, rose, at why you're going to see it in the PDF. So you do not have to actually memorize them. You just mentioned TIA 598 color code standard. All right. And then how do you ensure the accuracy?\n\nBhaskar: Yeah.\n\nMayukh: You should say in AutoCAD, I create details, slides, matrix charts. All right, just say you are familiar with splice matrix charts, where you map feeder fiber strands to distribution speeders and customer drops. That's it. You should say that you organize it very well in AutoCAD. So. You mentioned accuracy that way. Next question was, how do you calculate fields of materials or BOM for larger fiber deployments? So you should talk about your experience at Swap Technology. You should say, I built at Swap Technology, I built BOMs estimating fiber footage, quantitrons, handles, etc. Totaling over 3 million plus dollar. All right, so here you have gave them a proof, a testament of your of your proficiency with calculating bills. Then, how do you calculate the bill BOM? You should say I extract route lengths from AutoCAD, like in the AutoCAD drawing. you take out the lens, you take out all the details that you need, like how many hand holds are there, what's the length of the conduit, et cetera, et cetera. And then you apply the waste factor because you know some.\n\nBhaskar: So first I will say about the swap, you said swap.\n\nMayukh: Mhm. Yeah, you should mention that you have worked with BOMs at Swap Technologies, because that's in your CV. And you should also mention the numerical amount, like $3 million plus. You should mention that you have built detailed BOMs of over 3 million plus dollar in total. And for the...\n\nBhaskar: Yeah. OK, then I like, then I'll tell the, like, for the thing, first take off the major materials such as fiber footage, conduct footage handles, right?\n\nMayukh: Workflow. Lens? Yeah, you should take the lens and the number of equipments in the from the AutoCAD drawing, and then you apply a waste factor. Usually the waste factors ranges from 3% to 5%, so that's it. It's a very simple answer. You just simply say, you look at the drawing, you count the things that are there, and then you apply a waste factor, and then you...\n\nBhaskar: ONIKA. Lames.\n\nMayukh: do the total calculation. That's it. All right, and the last question was, where do you see your career progressing in the OSP engineering field over the three to five years? So, it's a very short and simple answer. In the next three to five years, I plan to continue mastering complex OSP network architectures and... large multi-county fiber expansions. Like you should say that you want to be more experienced, you want to work on bigger projects, more complex projects of OSP design engineering fields. All right, you should say that you are trying to leverage your masters in engineering management. so that you can turn into a senior OSP design engineer or a design manager roles. All right, you should connect your degree a little bit here so that it's actually believable and everything. All right, so this was at the end of the interview. Let me know if you have any other questions.\n\nBhaskar: So, the questions you ask, like, can you get the other PD, like, can I get the answers and, like, like, what you suggest in the answers can I get in the PDP? Yeah, OK, OK.\n\nMayukh: Nuzhat.\n\nKasshaf: Exactly, yeah. You, you have you have answered so many questions for him, like when I lost him, so if you could document them and share it with him, that would be great.\n\nMayukh: Yeah, of course, of course, at the end of the meeting. Ayaat.\n\nBhaskar: And it's like it's kind of difficult now, you know, like I have to pretend I did, but it's very difficult.\n\nMayukh: Yeah, yeah. Mhm. I understand, that's what.\n\nKasshaf: Yeah, I... Yeah, it's totally understandable. He kind of like raps through all of them. And yeah, I lost him in the middle as well. So it's totally fine. Yeah, I wanted to ask you, like, so can it, like, can it tell me about yourself? Like you have the resume to yourself, like you're practicing. So if I ask you to...\n\nMayukh: Yeah. And. And.\n\nBhaskar: Yeah, yeah.\n\nKasshaf: Tell me about yourself. How do you answer that?\n\nBhaskar: So, I'll, uh, so this time I'll not ask about the mechanical noise, so, so... I start from, I'll say, I started my career as OSP CAD drafter, like where I worked with the AutoCAD 2D plan and drawings. Currently working as OSP design engineer at Soft Technologies, where I've been involved in designing more than like 400,000 feet. AGS Pond Fiber Networks, and I'm holding a Masters in Engineering Management in from Central Michigan University, like this out.\n\nKasshaf: It can be said in a little different way. Let me just... If you.\n\nBhaskar: Last time I mean my name bachelors and masters.\n\nKasshaf: And a bachelor, master's, now you talk about your experiences. So, uh, did you show to an interviewer? They don't have anything else than your resume, right?\n\nBhaskar: Mhm. Mhm.\n\nKasshaf: So, I want the best chance, Saki, I want the resume experience. If he can like talk about it, so it's our job. To make them believe, whatever written on the resume, I have already I have done those things, I have actually did work on those things. Okay, so I mean, it is an application, I mean, you can talk about it and discuss. And second, I had a question: Hello, they might ask you, what's the day-to-day job deal like at your current job or previous jobs?\n\nBhaskar: Like I designed fiber networks in AutoCAD, then the high level design routing placement and stuffs like this. JVG Flash Card director, you recommend the question answer maybe.\n\nKasshaf: No. Yeah, yeah. Exactly, even. You have to feel like you have actually done this work, relax, confidently, conveniently, or in the interview, half of the work is like they wanna see if you are culture fit. Are you a robot or not? Like, do you actually know what you have written on the resume or not? Because we'll catch our 4th question to that, Acha, decide it, because we have to reasonable the skill set by experience, by technology skills, sort out, that means you are halfway there. So, you just need to convince the person that you are the right fit, conversational, you have to be communicative, you have to like have filler words, have to respond to, okay, yeah, I can totally get answer that for you, like, yeah, I have worked on these things, I have worked on that thing. A question: What projects did you work on?\n\nBhaskar: So, like I worked in soft technologies, I worked in like 400 feet of aerial and underground AGS spawn networks producing HLDLLD packages from the bombs and splice matrix permit drawings. Uh, these projects.\n\nKasshaf: I got the technical words for them.\n\nBhaskar: Mhm.\n\nKasshaf: Yeah.\n\nBhaskar: I mean, like, they gonna ask you, like, what's the project for, and...\n\nKasshaf: No. So, ha. We call them in our industry markets. OK, I have worked on multiple markets. I have worked on the Williamson Company markets. I have worked on the Florida market. I have worked on Florida Tampa market. So, these are the market industry, right? Industry language, so Williamson County Akter Market, Tampa, Florida, at the market.\n\nBhaskar: Santander, Texas. OK.\n\nKasshaf: So, these are the markets you have worked on. Did you directly work on them? These are like projects from AT&T. Our company was a vendor to AT&T, and they, through our company, I had the privilege of working on this big projects, and I have the chance. A chance of contributing them to those. Bullet.\n\nBhaskar: A answer, questionnaire. A type of answer PDF about something like go through the paper.\n\nKasshaf: Tell us about ourselves, uh, I...\n\nBhaskar: Umhmm, and projected, and like this, maybe like gonna be asked, you know. Yeah, I mean, you gonna tell me, yeah, give me the list of the how you gonna answer the, like, whom do you work now for, like, for which projects and stuffs, so Akter Akter answered Turkey.\n\nKasshaf: I mean, technical knowledge, you need that.\n\nBhaskar: Mhm.\n\nKasshaf: But binary humanly conversation, right? So humanly conversation technical knowledge, you cannot have that humanly conversation technical part. You can redirect him towards the answer you wanted to answer, right? So, that's the notion. You don't answer, you cannot like drift away. Interviewer loses confidence. So, what I usually suggest to look, they tell us about yourself, especially a question and answer, tell us about yourself.\n\nBhaskar: Mhm.\n\nKasshaf: It are more than Onika. When you answer that in a mirror, not in a memorized way, but in a very calm, composed manner, just telling you, Zihad, how your day went, what are the things you did, how if... Things worked out for you. When you're speaking to the interviewer, always try to have that composure. When you are relaxed, you sound confident. Okay, and when you sound confident, you can convince the interviewer. Ask them question like, \"What's A day-to-day job like in your company? What are the job specification job requirement job requirement manager interview? Can I share that?\"\n\nMayukh: Yeah, it was a OSP design Engineering position and they needed AutoCAD.\n\nKasshaf: Big. A job requirement job poster link.\n\nMayukh: Hi, Ahmad, I have a job post on LinkedIn, and it was just a casual one assumption, and I assumed this.\n\nKasshaf: I had at the interview, so I am okay.\n\nBhaskar: Talk as a reactor.\n\nKasshaf: Yeah, job poster. Can I ping more, please ping fed us and take that interviews, take take the job requirement from that post, but post on LinkedIn though.\n\nMayukh: I have an issue.\n\nKasshaf: I can do it on the national.\n\nMayukh: Is this the one Bin person?\n\nKasshaf: But I'll fit those two. Sure, but so.\n\nMayukh: I asked for those.\n\nBhaskar: Fiber splicer technician.\n\nMayukh: Yeah, it it in difficulty, right?\n\nBhaskar: Next, next, next level LLC.\n\nKasshaf: I mean, Rupom of that document shared with us. Ohh, talk me in the share. All right. I cannot share that, just give me a second till I... Create a link on it. So let me just directly e-mail it to you. Easy, right? It's bhaskarroygmailcom, right? Yeah.\n\nBhaskar: Yeah.\n\nKasshaf: You should receive an e-mail from me now. On this e-mail address of yours. I see that, check.\n\nBhaskar: Mm. No. Yeah. I appreciate you.\n\nKasshaf: Sizan.\n\nBhaskar: Yeah, yeah, I got it.\n\nKasshaf: Oh, that's wonderful. Uh, yeah, link to share Golam.\n\nMayukh: They ask for the.\n\nKasshaf: Reply their name.\n\nMayukh: Not yet.\n\nKasshaf: Let me just bring him into this problem. We usually, uh, or interviews. This is a big concern.\n\nMayukh: Interview link, my interview, sorry, join link. Talking to Mir.\n\nKasshaf: J job interview with the job post job requirement. How would he prepare for the mock interviews he's conducting when he's taking off right?\n\nMayukh: Mhm. This man.\n\nKasshaf: What is he applying for?\n\nBhaskar: I got it, I got it by Simeone also. I wish it.\n\nMayukh: Yeah, bringing Ferdous to this call.\n\nBhaskar: Uh, I shared, I shared that this one, maybe.\n\nKasshaf: Good. It's a slice and technician rule. Are you sure? Let's go on.\n\nBhaskar: Yeah, yes, I got this from here, I don't know.\n\nFerdous: Is it the AMEC AMP Next Level LLC where the Company name?\n\nBhaskar: Yeah.\n\nFerdous: Orange.\n\nKasshaf: Yeah, it's a fiber splicer technician group. At Das.\n\nFerdous: Uh, yeah, but I can show, I can see J. Fly fiber.\n\nKasshaf: Uh, the resume, my resume, they apply, goes to, you know.\n\nFerdous: Ohh, it's in Talent as I'm looking, actually. Give me a minute.\n\nKasshaf: Share the day. As we are preparing for an OSP design engineer role, I guess, but this, this is a little different. It's a slicer technician. It's an onside job. Yeah, uh, but I give full experience so that way so we need to know that too. Blake.\n\nBhaskar: M.\n\nMayukh: 10 minutes of our actor meeting.\n\nKasshaf: And. Yeah, sure.\n\nMayukh: Alright, so we have to get all the screenshot that I had this project one.\n\nBhaskar: Akter. Hey, actually, I mean, I mean, first to that guy, Vijay, I can link it.\n\nMayukh: Oh yeah, sure. No, no, I need that. Is this a spatial manager that you're talking about?\n\nBhaskar: No.\n\nMayukh: Bhama ke bolta banana in booze.\n\nBhaskar: See, Ajami open call. Then the properties comes in the from the videos, you know, like comes up here, all the properties comes, then I work on it, right?\n\nMayukh: Oh. Mmhmm. Yeah, first of all, just with this, just cross this window so that it doesn't pop up. The one on the left, floating. Yeah, yeah, this is the one. Yeah, you should see a, yeah, cross it. Then click on home.\n\nBhaskar: This one?\n\nMayukh: The Home tab at the top. Okay, so I think your AutoCAD is a little bit different, but let me fix it. Let me check the fix. Did you download AutoCAD Lite?\n\nBhaskar: No, I don't know. This one.\n\nMayukh: Is this L.T.? No, it's 227. Alright.\n\nBhaskar: Yeah.\n\nMayukh: Let me check, just give me a second. All right, geolocation, yeah, white dropdown, yeah, dropdown. Okay, yeah, minimize the panel buttons. Let's see what happens. Now click on Home. K. All right, let's tackle through it. Try the other options. Yeah, yeah, yeah. Panel tiles, minimize the panel tiles.\n\nBhaskar: It was to some.\n\nMayukh: Showvik, but drop down and. Act is the option of sort of them.\n\nBhaskar: The minimum steps. Same thing, uh, adjust data.\n\nMayukh: Most probably that should occur with the algorithm. Yes, exactly. This is the one. Or, if, if customize, but the command then like to the line to the splice line to just command.\n\nBhaskar: Good.\n\nMayukh: That's it, man.\n\nBhaskar: Then, video, the property.\n\nMayukh: Yeah. Element a click, right click the properties click.\n\nBhaskar: Each year.\n\nMayukh: Project One. It, yeah.\n\nBhaskar: Easy eater.\n\nMayukh: So, for this, click on an element in the drawing. We show you. A time screenshot Didarul.\n\nBhaskar: Ahmed.\n\nMayukh: Okay. Do you see my screen? So, basically, properties, properties, I mean, select, right click, then I'm gonna go to properties, usually, just hit a drag and drop side panel is shift. That's it. Sorry, Mir.\n\nBhaskar: Like this, like this.\n\nMayukh: Uh, but uh that Hasan.\n\nBhaskar: Stock on.\n\nMayukh: How did it work? Automatic doc has left. Lipset. Yeah, to drag those side, then automatic dock, yeah, done.\n\nBhaskar: Okay.\n\nMayukh: That's it.\n\nBhaskar: Okay, okay.\n\nMayukh: Let me know if you need any other help, Ahmad Ahasanul, right? Okay, that again.\n\nKasshaf: Okay, then. I believe a post design engineer roller resume they applied for obviously, because on the tracker and type record, weirdly, but I have few concerns with your availability. On.\n\nBhaskar: Yo.\n\nKasshaf: Have. Huh?\n\nBhaskar: And they put a full different job, like to say, Nikki.\n\nKasshaf: Yeah, basically, after onsite rule, the theory models of force and fiber splice of technician, so...\n\nFerdous: Ohh. It basically lies on the same field, but actually it's in the... Field side, actually, where outside work.\n\nKasshaf: Okay. A interview to actually uploaded a directly relevant now, but this is a very, very good practice on how to speak in an interview. I have not interviewed quite at all.\n\nBhaskar: You think of it first?\n\nKasshaf: This is your first, this, this.\n\nBhaskar: Mhm, I, I, but Pierce.\n\nKasshaf: This, this, you may not get this through, but this is your first step on actually experience on how interview goes. Ahnaf, I need you to record the session and share it with us. A session is one of the record.\n\nFerdous: Yep.\n\nBhaskar: Mhm.\n\nKasshaf: Is time mark up to send focus for to convince the interview about interviewer better? OK, I have to go already to file this design engineer. I'm the we he would is only the apply according to our database, I believe, because they correct a miscommunication, you not being available.\n\nBhaskar: Mhm.\n\nKasshaf: Kinda confuse the team of the time sector, or it late call also, right? So, it direct which, so I urge you to be more present on the teams chat at least up there to the now.\n\nBhaskar: Mm-hmm. I went to Chile last week, though. I mean, I mean last week, though.\n\nKasshaf: Ahnaf, it's not about last week. Yeah, it's about you checking the messages on a daily basis.\n\nBhaskar: Yeah, yeah, yeah, yeah. I mean, you daily this is check with this in in Aalto, I'm doing really check with this.\n\nKasshaf: Into, and then I have to reach out to you.\n\nBhaskar: Not you on there, I mean, I mean, I mean the message error.\n\nKasshaf: Have you? No, no, no, no, it was on Tuesday, on Thursday, so...\n\nBhaskar: No, I mean, we gave last week, I mean, I did index it about the thing. Well, yeah, last week I went on Friday, Thursday, the message Islam, yeah, maybe on there.\n\nKasshaf: So. I will speak and Wafia at LinkedIn. Message for like when I need to respond, then I will do Wafia reply. Just Rupom of the available, okay? We don't require you to, like, respond to all the emails and the LinkedIn text. Our team can handle it for you, but you need to communicate with the team. It will request them available.\n\nBhaskar: Oh, okay, okay. Oh, I got it. Okay, babe.\n\nKasshaf: Reply all of the teammates hand over to the full team is designed and is dedicated towards your service, so they just need you to confirm few stuff for us.\n\nBhaskar: Okay.\n\nKasshaf: Talking about to work, the leader will respond to, but other than that, we can deal the, and the calculate interview to then calculate integrator then it's just a confidence boost, OK? And back with time, our team's gonna up there next week, mock interview schedule current available time for mock interview to book accordingly, just every time for mock interviews are available, mock interviews.\n\nBhaskar: Ddin.\n\nKasshaf: And I have the document to share, tell us about yourself. If formatted to the of the answer, technical question initial introduction, you tell them a lot of things that they need to hear from. OK. So, these are the feedbacks for you, so better prepared for them for the interviews.\n\nBhaskar: Okay.\n\nKasshaf: OK, OK, type it here, type it, he should be, he should be able to do that, and we currently upcoming week interview available times for the DM.\n\nBhaskar: I mean, like, I mean, Friday, Saturday, Sunday, I mean, just Friday, Saturday, Sunday, I mean, like, 10 PM, 11 PM, I mean, every 11, every other day, like, it's gonna be like 12, like, like 12 A.m. Like this.\n\nKasshaf: 00:18 I mean, on an average, after. On an average, when at 11 P.m. onwards, something daily available, right?\n\nBhaskar: 00:26 Have 11 P.m. then 12 A.m. every day, 12 A.m. I mean, my name part time, 12 A.m.\n\nKasshaf: 00:34 I think that's a wonderful. I mean, our team mentioned the sync for it. Upcoming, we can all get your mock interviews. Nate, Jay, I think preparing guidelines for practice for that.\n\nBhaskar: 00:39 Mhm. ONIKA.\n\nKasshaf: 00:49 We can, we can.\n\nBhaskar: 00:54 Okay.\n\nKasshaf: 00:55 And we can get to the sessions. Wish you all the best. Hopefully, next week, I will interview Sajid for preparation. OK, man, I got my question.\n\nBhaskar: 01:08 Talk it, no, no.\n\nKasshaf: 01:12 That's enough, Piyas. A loss. Ferdous.\n\nFerdous: 01:23 Yeah.\n\nKasshaf: 01:29 And I, you know, the, the, the, the, why is it not in the book chat?\n\nFerdous: 01:32 Per.\n\nKasshaf: 01:45 Forward us, J. A job interview, it it will get job post requirements, and this was the resume I applied to.\n\nFerdous: 01:45 Avatar song, \"Milki Kumkum\". No, usually, we take, but confused, so availability that then I told to over map up with the army also look, sorry, it doesn't work.\n\nKasshaf: 02:10 Available. Availability to find communication with this one, but the mock interview or calc interview, okay, design Engineering. In the back in my head, assign the design engine. Food delivery.\n\nFerdous: 02:45 I'm sorry, actually.\n\nKasshaf: 02:54 What is the dollar?\n\nFerdous: 02:57 Oliver.\n\nKasshaf: 02:57 What is that? Yeah.\n\nFerdous: 02:59 But I'm usually here, Kuru Ditam, but agent of Ahasanul.\n\nKasshaf: 03:03 No, no, not keep every responsibility to your Showvik, but you can keep the responsibility over seeing every responsibility conducted by your team.\n\nFerdous: 03:06 Hey, Ibna.\n\nKasshaf: 03:17 Shop.\n\nFerdous: 03:18 Alright, Nur. M.\n\nKasshaf: 03:31 You have worked as an exec, but now you have people under you, so you need to learn on how to be a supervisor too. Talk on, talk on to our team, so you become manager, suppose the senior exec.\n\nFerdous: 03:41 Yep. Understood, where, so yeah, I mean, it will fix going to go back.\n\nKasshaf: 04:01 Okay."
      }
    ],
    stickyNotes: [
      {
        id: 'note-215-1',
        date: '2026-08-13',
        content: 'Network Implementation Engineer mock completed. Scored 8.5/10. Faisal & Mayukh reviewed DOT permit & AutoLISP automation answers.',
        category: 'Mock Feedback',
        author: 'Faisal',
        accent: 'green',
        pinned: true
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
        transcript: "Mayukh [00:04]: Hello!\n\nAhmed [00:07]: Hello?\n\nMayukh [00:08]: Yeah, can you hear me?\n\nAhmed [00:09]: Yes.\n\nMayukh [00:11]: All right, how's everything back?\n\nAhmed [00:14]: Good, a bit nervous with the interview because not really not great in interviews.\n\nMayukh [00:18]: Ohh, it's fine. Yeah, no one is great actually. Even if I'm just put in a chair to attend an interview, I'm going to mess up real bad. I'm going to stutter. But it's absolutely fine. The more you practice, the more you improve, all right? So it's a preliminary mock, not because it's a first one, but because your resume is not ready.\n\nAhmed [00:28]: Yes. Ms.\n\nMayukh [00:40]: We're going to run this mock with your old resume for now with just some preliminary stuff, but we're going to prepare another resume and we're going to schedule another mock based on your new and more strong resume that's appropriate for OSP Engineering role.\n\nAhmed [01:03]: Gotcha.\n\nMayukh [01:04]: All right, yeah. All right, so I'm going to keep the recording on and I'm going to keep the rest of the meeting in English so that I can generate a summary out of it. Tell me about yourself.\n\nAhmed [02:06]: I'm an OSP engineer. My name is Ahmed. I do designing for in top level.\n\nMayukh [02:32]: Just remember, this interview is going to be based on your old resume.\n\nAhmed [02:48]: Okay, my name is Ahmed. I am currently doing data Engineering at freelance. I build ETL pipelines using Azure Data Factory.\n\nMayukh [03:18]: All right. Why are you interested in OSP design engineering when your background is in computer engineering?\n\nAhmed [03:25]: I found it interesting working with fiber, seeing how fiber optic cables work and how it is built around cities.\n\nMayukh [03:54]: All right, do you know what is FTTX?\n\nAhmed [04:01]: Yes, it's basically fiber to home users.\n\nMayukh [04:19]: Can you explain what is the ROW?\n\nAhmed [04:25]: So the right of way is basically the boundary where we cannot work after. We have to work between the right of way and the easement.\n\nMayukh [04:38]: And what is a handhold?\n\nAhmed [04:46]: A handhold is a small dugout where we do splicing and where we store extra wires in case of future growth.\n\nMayukh [05:05]: Have you worked with AutoCAD?\n\nAhmed [05:10]: Yes, I have built high-level designs and diagrams laying out handholds, fiber distribution hubs, and splice points.\n\nMayukh [06:03]: How does your data engineering experience relate to OSP?\n\nAhmed [06:16]: In data engineering we require a lot of automation and efficiency. OSP engineering has similar needs to automate recurring issues.\n\nMayukh [07:00]: How do you approach learning a software that is unfamiliar?\n\nAhmed [07:15]: Hands-on learning. I choose a small project and learn the primary tools within that software.\n\nMayukh [07:51]: Why should we hire you over someone who has direct OSP experience?\n\nAhmed [08:03]: In my previous roles I brought productivity and efficiency increases, bringing reliability and accountability.\n\nMayukh [09:05]: All right, I think we can wrap it up here. As a first timer, you were able to answer some questions seamlessly. Above average performance.\n\nAhmed [15:15]: Alright, perfect. Thank you.\n\nMayukh [15:17]: You're welcome. Take care.\n\nAhmed [15:18]: Alright, bye.\n\nMayukh [15:24]: Today, more.\n\nPiyas [15:27]: Let me stop."
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
