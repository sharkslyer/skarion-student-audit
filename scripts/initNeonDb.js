import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_GUOit1hYe4KD@ep-tiny-heart-aypn21gt.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';

const INITIAL_STUDENTS = [
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

async function main() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to NeonDB PostgreSQL database!');

    // Create students table
    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        joining_date VARCHAR(50) NOT NULL,
        progress INT DEFAULT 0,
        mock_interviews INT DEFAULT 0,
        rating VARCHAR(50) DEFAULT 'good',
        placement_company VARCHAR(255) DEFAULT '',
        placement_role VARCHAR(255) DEFAULT '',
        placement_date VARCHAR(50) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create sticky_notes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sticky_notes (
        id VARCHAR(50) PRIMARY KEY,
        student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
        date VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(50) DEFAULT 'General',
        author VARCHAR(50) DEFAULT 'Mayukh',
        accent VARCHAR(50) DEFAULT 'navy',
        pinned BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('NeonDB tables initialized successfully!');

    // Seed database if empty or refresh initial dataset
    for (const student of INITIAL_STUDENTS) {
      await client.query(`
        INSERT INTO students (id, name, joining_date, progress, mock_interviews, rating, placement_company, placement_role, placement_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          joining_date = EXCLUDED.joining_date,
          progress = EXCLUDED.progress,
          mock_interviews = EXCLUDED.mock_interviews,
          rating = EXCLUDED.rating,
          placement_company = EXCLUDED.placement_company,
          placement_role = EXCLUDED.placement_role,
          placement_date = EXCLUDED.placement_date;
      `, [
        student.id,
        student.name,
        student.joiningDate,
        student.progress,
        student.mockInterviews,
        student.rating,
        student.placementCompany || '',
        student.placementRole || '',
        student.placementDate || ''
      ]);

      if (student.stickyNotes && student.stickyNotes.length > 0) {
        for (const note of student.stickyNotes) {
          await client.query(`
            INSERT INTO sticky_notes (id, student_id, date, content, category, author, accent, pinned)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (id) DO UPDATE SET
              content = EXCLUDED.content,
              category = EXCLUDED.category,
              author = EXCLUDED.author,
              accent = EXCLUDED.accent,
              pinned = EXCLUDED.pinned;
          `, [
            note.id,
            student.id,
            note.date,
            note.content,
            note.category || 'General',
            note.author || 'Mayukh',
            note.accent || 'navy',
            Boolean(note.pinned)
          ]);
        }
      }
    }

    console.log('Seeded all candidate audit records and sticky notes into NeonDB!');

    const resStudents = await client.query('SELECT COUNT(*) FROM students;');
    const resNotes = await client.query('SELECT COUNT(*) FROM sticky_notes;');
    console.log(`NeonDB Status: ${resStudents.rows[0].count} Students, ${resNotes.rows[0].count} Sticky Notes in Database.`);

  } catch (err) {
    console.error('Error initializing NeonDB:', err);
  } finally {
    await client.end();
  }
}

main();
