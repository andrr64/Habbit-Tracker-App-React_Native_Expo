// src/database/models/habit.js
import { getDB, TABEL_HABIT, TABEL_HABIT_LOG } from '../db';
import { tambahHabitLog, getHabitLogByDate, getHabitLogsByHabit, apakahLogHariIniSudahAda, apakahLogMingguIniSudahAda } from './habit_log';

const db = getDB();

export const tambahHabit = ({ nama, frekuensi }) => {
  const tanggalSekarang = new Date().toISOString().split('T')[0];
  try {
    const query = `INSERT 
          INTO ${TABEL_HABIT} 
          (nama, frekuensi, dibuat_pada, diperbarui_pada) 
          VALUES 
          (?, ?, ?, ?);
      `;
    const result = db.runSync(
      query,
      [nama, frekuensi, tanggalSekarang, tanggalSekarang]
    );
    tambahHabitLog(
      {
        habit_id: result.lastInsertRowId,
        tanggal: tanggalSekarang,
        status: 0
      }
    )

  } catch (error) {
    console.error('❌ Gagal menambah habit:', error);
    throw error;
  }
};

export const getSemuaDataHabit = () => {
  const result = db.getAllSync(
    `
      SELECT * FROM
        ${TABEL_HABIT}
      ORDER BY id DESC
    `
  );
  let dataHabitPlusLog = []
  for (let i = 0; i < result.length; i++) {
    const dataHabit = result[i];
    if (dataHabit.frekuensi === 'MINGGUAN') {
      const dataLog = apakahLogMingguIniSudahAda(dataHabit.id);
      dataHabitPlusLog.push(
        {
          ...dataHabit,
          log: dataLog
        }
      )
    
    } 
    else {
      const dataLog = apakahLogHariIniSudahAda(dataHabit.id);
      dataHabitPlusLog.push(
        {
          ...dataHabit,
          log: dataLog
        }
      )
    }
  }
  return dataHabitPlusLog;
};

export const updateHabit = ({ id, nama, frekuensi }) => {
  try {
    const tanggalSekarang = new Date().toISOString().split('T')[0];
    const query = `
      UPDATE ${TABEL_HABIT}
      SET nama = ?, frekuensi = ?, diperbarui_pada = ?
      WHERE id = ?
    `;
    const result = db.runSync(query, [nama, frekuensi, tanggalSekarang, id]);
    return result; // bisa mengembalikan info update, misal jumlah row yang diubah
  } catch (error) {
    console.error('❌ Gagal memperbarui habit:', error);
    throw error;
  }
};

export const hapusHabit = (id) => {
  try {
    // Hapus semua log yang terkait habit ini dulu
    const queryLog = `
      DELETE FROM ${TABEL_HABIT_LOG}
      WHERE habit_id = ?
    `;
    db.runSync(queryLog, [id]);

    // Baru hapus habit utamanya
    const queryHabit = `
      DELETE FROM ${TABEL_HABIT}
      WHERE id = ?
    `;
    const result = db.runSync(queryHabit, [id]);

    return result; // result.changes = 0 artinya tidak ada data yang dihapus
  } catch (error) {
    console.error('❌ Gagal menghapus habit:', error);
    throw error;
  }
};