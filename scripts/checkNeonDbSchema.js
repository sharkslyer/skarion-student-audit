import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_GUOit1hYe4KD@ep-tiny-heart-aypn21gt.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'sticky_notes';
    `);
    console.log('NeonDB sticky_notes columns:', res.rows);

    const notes = await client.query('SELECT id, student_id, content, pinned FROM sticky_notes LIMIT 5;');
    console.log('Sample sticky_notes rows:', notes.rows);
  } catch (err) {
    console.error('Error querying schema:', err);
  } finally {
    client.release();
    pool.end();
  }
}

main();
