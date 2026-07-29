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
    console.log('Testing pin update on NeonDB...');
    await client.query('UPDATE sticky_notes SET pinned = true WHERE id = $1', ['note-212-1']);
    const res = await client.query('SELECT id, content, pinned FROM sticky_notes WHERE id = $1', ['note-212-1']);
    console.log('QueryResult after update:', res.rows);
  } catch (err) {
    console.error('Error updating pin:', err);
  } finally {
    client.release();
    pool.end();
  }
}

main();
