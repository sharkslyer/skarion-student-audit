// Vercel Serverless Function connected directly to NeonDB PostgreSQL Database
// Handles real-time CRUD operations (including deletions and pin status updates) across all devices worldwide

import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_GUOit1hYe4KD@ep-tiny-heart-aypn21gt.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const client = await pool.connect();

  try {
    // POST / PUT: Sync candidate roster and sticky notes (with deletion & multi-pin support)
    if (req.method === 'POST' || req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const studentsList = Array.isArray(body) ? body : (body?.students || []);

      await client.query('BEGIN');

      if (studentsList.length > 0) {
        const activeIds = studentsList.map(s => s?.id).filter(Boolean);

        // 1. Delete removed candidates from NeonDB
        if (activeIds.length > 0) {
          const placeholders = activeIds.map((_, i) => `$${i + 1}`).join(',');
          await client.query(`DELETE FROM students WHERE id NOT IN (${placeholders});`, activeIds);
        }

        // 2. Upsert active candidates
        for (const student of studentsList) {
          if (!student || !student.id || !student.name) continue;

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
            student.joiningDate || new Date().toISOString().split('T')[0],
            student.progress || 0,
            student.mockInterviews || 0,
            student.rating || 'good',
            student.placementCompany || '',
            student.placementRole || '',
            student.placementDate || ''
          ]);

          // 3. Upsert sticky notes & pin statuses
          if (Array.isArray(student.stickyNotes)) {
            const activeNoteIds = student.stickyNotes.map(n => n?.id).filter(Boolean);
            if (activeNoteIds.length > 0) {
              const notePlaceholders = activeNoteIds.map((_, i) => `$${i + 2}`).join(',');
              await client.query(`DELETE FROM sticky_notes WHERE student_id = $1 AND id NOT IN (${notePlaceholders});`, [student.id, ...activeNoteIds]);
            } else {
              await client.query(`DELETE FROM sticky_notes WHERE student_id = $1;`, [student.id]);
            }

            for (const note of student.stickyNotes) {
              if (!note || !note.id || !note.content) continue;
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
                note.date || new Date().toISOString().split('T')[0],
                note.content,
                note.category || 'General',
                note.author || 'Mayukh',
                note.accent || 'navy',
                Boolean(note.pinned)
              ]);
            }
          }
        }
      } else {
        await client.query('DELETE FROM sticky_notes;');
        await client.query('DELETE FROM students;');
      }

      await client.query('COMMIT');
      return res.status(200).json({ success: true, count: studentsList.length, students: studentsList });
    }

    // GET: Query all students and their sticky notes from NeonDB
    const studentsRes = await client.query(`
      SELECT 
        id, 
        name, 
        joining_date as "joiningDate", 
        progress, 
        mock_interviews as "mockInterviews", 
        rating, 
        placement_company as "placementCompany", 
        placement_role as "placementRole", 
        placement_date as "placementDate"
      FROM students 
      ORDER BY created_at DESC;
    `);

    const notesRes = await client.query(`
      SELECT 
        id, 
        student_id as "studentId", 
        date, 
        content, 
        category, 
        author, 
        accent, 
        pinned 
      FROM sticky_notes 
      ORDER BY date DESC;
    `);

    const students = studentsRes.rows.map(student => {
      const notes = notesRes.rows
        .filter(n => n.studentId === student.id)
        .map(n => ({
          id: n.id,
          date: n.date,
          content: n.content,
          category: n.category,
          author: n.author,
          accent: n.accent,
          pinned: Boolean(n.pinned)
        }));

      return {
        ...student,
        stickyNotes: notes
      };
    });

    return res.status(200).json({ students });

  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('NeonDB Query Error:', err);
    return res.status(500).json({ error: 'Database query error', details: err.message });
  } finally {
    client.release();
  }
}
