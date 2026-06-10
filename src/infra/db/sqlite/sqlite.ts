import Database from "better-sqlite3";

const dbPath = process.env.DATABASE_URL || "@/../data/auth.sqlite";

export const initSQLite = () => {
  return new Database(dbPath);
};
