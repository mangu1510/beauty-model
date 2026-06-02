import "dotenv/config";

const DB_CLIENT = process.env.DB_CLIENT || (process.env.DB_FILE ? 'sqlite' : 'mysql');

let _query: (sql: string, params?: any[]) => Promise<any[]>;
let _queryOne: (sql: string, params?: any[]) => Promise<any | undefined>;
let pool: any;

if (DB_CLIENT === 'sqlite') {
  const Database = await import('better-sqlite3');
  const dbFile = process.env.DB_FILE || './dev.sqlite3';
  const db = new Database.default(dbFile, { verbose: undefined });

  _query = async (sql: string, params: any[] = []) => {
    const stmt = db.prepare(sql);
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return stmt.all(...params);
    }
    const info = stmt.run(...params);
    return [info];
  };

  _queryOne = async (sql: string, params: any[] = []) => {
    const stmt = db.prepare(sql);
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return stmt.get(...params);
    }
    const info = stmt.run(...params);
    return info;
  };

  pool = {
    async getConnection() {
      let pending: Array<{ sql: string; params: any[] }> = [];
      let inTx = false;
      return {
        async beginTransaction() {
          pending = [];
          inTx = true;
        },
        async execute(sql: string, params: any[] = []) {
          if (inTx) {
            pending.push({ sql, params });
            return { affectedRows: 1 };
          }
          const stmt = db.prepare(sql);
          if (sql.trim().toUpperCase().startsWith('SELECT')) return stmt.all(...params);
          return stmt.run(...params);
        },
        async commit() {
          try {
            db.exec('BEGIN');
            for (const p of pending) {
              const stmt = db.prepare(p.sql);
              stmt.run(...p.params);
            }
            db.exec('COMMIT');
          } catch (err) {
            db.exec('ROLLBACK');
            throw err;
          } finally {
            inTx = false;
            pending = [];
          }
        },
        async rollback() {
          pending = [];
          inTx = false;
        },
        release() {},
      };
    }
  };
} else {
  const mysql = await import('mysql2/promise');
  pool = mysql.createPool({
    host: process.env.DB_HOST ?? '127.0.0.1',
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'beauty_model',
    port: Number(process.env.DB_PORT ?? 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4_unicode_ci',
  });

  _query = async (sql: string, params: any[] = []) => {
    const [rows] = await pool.execute(sql, params as any);
    return rows as any[];
  };

  _queryOne = async (sql: string, params: any[] = []) => {
    const rows = await _query(sql, params);
    return rows[0];
  };
}

export const query = async <T = any>(sql: string, params: any[] = []): Promise<T[]> => {
  return (await _query(sql, params)) as T[];
};

export const queryOne = async <T = any>(sql: string, params: any[] = []): Promise<T | undefined> => {
  return (await _queryOne(sql, params)) as T | undefined;
};

export { pool };
