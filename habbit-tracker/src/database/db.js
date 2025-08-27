// db.js
import * as SQLite from 'expo-sqlite';

export const TABEL_HABIT = 'habit';
export const TABEL_HABIT_LOG = 'habit_log';

// Buat tabel habit
const BUAT_TABEL_HABIT = `
  CREATE TABLE IF NOT EXISTS ${TABEL_HABIT} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    frekuensi TEXT, -- "HARIAN" / "MINGGUAN"
    dibuat_pada TEXT,
    diperbarui_pada TEXT
  );
`;

// Buat tabel habit_log
const BUAT_TABEL_HABIT_LOG = `
  CREATE TABLE IF NOT EXISTS ${TABEL_HABIT_LOG} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    habit_id INTEGER NOT NULL,
    tanggal TEXT NOT NULL, -- format YYYY-MM-DD
    status INTEGER DEFAULT 0, -- 0 = belum, 1 = selesai
    FOREIGN KEY (habit_id) REFERENCES ${TABEL_HABIT}(id) ON DELETE CASCADE
  );
`;

const db = SQLite.openDatabaseSync('habit_v3.db');

// Getter untuk akses DB
export const getDB = () => {
  return db;
};

// Inisialisasi DB (buat tabel kalau belum ada)
export const initDB = () => {
  try {
    db.execSync(BUAT_TABEL_HABIT);
    db.execSync(BUAT_TABEL_HABIT_LOG);
    console.log(`✅ Tabel "${TABEL_HABIT}" & "${TABEL_HABIT_LOG}" berhasil disiapkan.`);
  } catch (error) {
    console.error('❌ Gagal inisialisasi database:', error);
  }
};