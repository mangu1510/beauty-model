import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const sql = fs.readFileSync(new URL('../db/migrations/001_init.sql', import.meta.url), 'utf8');

async function run() {
  const dbClient = process.env.DB_CLIENT || (process.env.DB_FILE ? 'sqlite' : 'mysql');

  if (dbClient === 'sqlite') {
    const Database = await import('better-sqlite3');
    const dbFile = process.env.DB_FILE || path.resolve(process.cwd(), 'dev.sqlite3');
    const db = new Database.default(dbFile);
    try {
      console.log('Running SQLite migration on', dbFile);
      // Use sqlite-specific migration file if present
      const sqliteSqlPath = new URL('../db/migrations/001_init.sqlite.sql', import.meta.url);
      let sqliteSql = fs.readFileSync(sqliteSqlPath, 'utf8');
      const statements = sqliteSql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean);
      db.exec('BEGIN');
      for (const stmt of statements) {
        db.exec(stmt);
      }
      db.exec('COMMIT');
      console.log('Migrations applied successfully.');
    } catch (err) {
      try { db.exec('ROLLBACK'); } catch {}
      console.error('Migration failed:', err.message || err);
      throw err;
    } finally {
      db.close();
    }
    return;
  }

  const mysql = await import('mysql2/promise');
  const host = process.env.DB_HOST || '127.0.0.1';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = Number(process.env.DB_PORT || 3306);

  const conn = await mysql.createConnection({ host, user, password, port, multipleStatements: true });
  try {
    console.log('Running migration...');
    // split statements and execute sequentially
    const statements = sql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean);
    for (const stmt of statements) {
      try {
        await conn.query(stmt);
      } catch (err) {
        console.error('Statement failed:', err.message || err);
        throw err;
      }
    }
    console.log('Migrations applied successfully.');
  } finally {
    await conn.end();
  }
}

run().catch(err => { console.error(err); process.exit(1); });
