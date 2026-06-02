import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const dbFile = process.env.DB_FILE || './dev.sqlite3';
const db = new Database(dbFile);

function createUser(name, email, password) {
  const hash = bcrypt.hashSync(password, 10);
  try {
    const stmt = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
    const info = stmt.run(name, email, hash);
    console.log('Created user id:', info.lastInsertRowid);
    return info.lastInsertRowid;
  } catch (err) {
    console.error('Create user error:', err.message);
    return null;
  }
}

function login(email, password) {
  const row = db.prepare('SELECT id, name, email, password_hash FROM users WHERE email = ?').get(email);
  if (!row) return { ok: false, message: 'User not found' };
  const ok = bcrypt.compareSync(password, row.password_hash || '');
  return { ok, user: ok ? { id: row.id, name: row.name, email: row.email } : null };
}

(async () => {
  console.log('Using DB:', dbFile);
  const email = 'dev.user@example.com';
  const pw = 'password123';
  createUser('Dev User', email, pw);
  const res = login(email, pw);
  console.log('Login result:', res);
})();
