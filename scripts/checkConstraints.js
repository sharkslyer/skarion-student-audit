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
      SELECT conname, contype, pg_get_constraintdef(oid)
      FROM pg_constraint
      WHERE conrelid = 'sticky_notes'::regclass;
    `);
    console.log('NeonDB sticky_notes constraints:', res.rows);
  } catch (err) {
    console.error('Error querying constraints:', err);
  } finally {
    client.release();
    pool.end();
  }
}

main();
