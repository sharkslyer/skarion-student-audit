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
    console.log('Adding mock_sessions_json column to students table in NeonDB PostgreSQL...');
    await client.query('ALTER TABLE students ADD COLUMN IF NOT EXISTS mock_sessions_json TEXT;');
    console.log('Successfully updated NeonDB table schema with mock_sessions_json column!');
  } catch (err) {
    console.error('Error updating NeonDB schema:', err);
  } finally {
    client.release();
    pool.end();
  }
}

main();
