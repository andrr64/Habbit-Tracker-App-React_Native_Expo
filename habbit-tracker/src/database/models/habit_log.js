import { ambilTanggal, formatTanggal } from '../../utils/formatter';
import { getDB, TABEL_HABIT_LOG } from '../db'

const db = getDB();

export const tambahHabitLog = ({ habit_id, tanggal, status = 0 }) => {
  const query = `
        INSERT INTO ${TABEL_HABIT_LOG} 
        (habit_id, tanggal, status) VALUES
        (?, ?, ?)
    `;
  // FIX: The original code hardcoded '0' instead of using the 'status' parameter.
  const result = db.runSync(query, [habit_id, tanggal, status]);
  return result;
};

export const apakahLogHariIniSudahAda = (habit_id) => {
  const hariIni = ambilTanggal(new Date());
  const query = `SELECT * FROM ${TABEL_HABIT_LOG} WHERE habit_id = ? AND tanggal = ?`;
  let result = db.getAllSync(query, [habit_id, hariIni]);

  if (result.length === 0) {
    const newLogId = tambahHabitLog({ habit_id, tanggal: hariIni, status: 0 });
    result = db.getAllSync(`SELECT * FROM ${TABEL_HABIT_LOG} WHERE id = ?`, [newLogId]);
  }

  return result[0];
};

// Helper: Get Monday and Sunday for the current week in YYYY-MM-DD format.
const getRangeMingguIni = () => {
  const sekarang = new Date();
  const hari = sekarang.getDay(); // 0 = Sunday, 1 = Monday
  const selisihSenin = hari === 0 ? -6 : 1 - hari; // Calculate offset to get to Monday

  const senin = new Date(sekarang);
  senin.setDate(sekarang.getDate() + selisihSenin);

  const minggu = new Date(senin);
  minggu.setDate(senin.getDate() + 6);

  return {
    senin: ambilTanggal(senin),
    minggu: ambilTanggal(minggu),
  };
};

export const apakahLogMingguIniSudahAda = (habit_id) => {
    // REFACTOR: Use the helper function to avoid repeating logic.
  const { senin, minggu } = getRangeMingguIni();

  const query = `
    SELECT * FROM ${TABEL_HABIT_LOG}
    WHERE habit_id = ? AND tanggal BETWEEN ? AND ?
    LIMIT 1
  `;
  let result = db.getAllSync(query, [habit_id, senin, minggu]);

  if (result.length === 0) {
    const newLogId = tambahHabitLog({ habit_id, tanggal: ambilTanggal(new Date()), status: 0 });
    result = db.getAllSync(`SELECT * FROM ${TABEL_HABIT_LOG} WHERE id = ?`, [newLogId]);
  }

  return result[0];
};

export const updateHabitLogStatus = (id, status) => {
  try {
    const query = `
      UPDATE ${TABEL_HABIT_LOG}
      SET status = ?
      WHERE id = ?
    `;
    const result = db.runSync(query, [status, id]);
    return result.changes > 0;
  } catch (error) {
    console.error('❌ Gagal memperbarui status habit log:', error);
    throw error;
  }
};

export const getLogHarian = (habit_id) => {
  const { senin, minggu } = getRangeMingguIni();

  const query = `
    SELECT * FROM ${TABEL_HABIT_LOG}
    WHERE habit_id = ? AND tanggal BETWEEN ? AND ?
    ORDER BY tanggal ASC
  `;
  const logs = db.getAllSync(query, [habit_id, senin, minggu]);
  
  let hasil = {};
  let current = new Date(senin);
    // Ensure we handle timezone correctly by setting hours
  current.setUTCHours(12);

  for (let i = 0; i < 7; i++) {
    hasil[formatTanggal(current)] = 0;
    current.setDate(current.getDate() + 1);
  }

  // Populate the map with actual data from the database.
  logs.forEach((log) => {
    const tgl = new Date(log.tanggal);
    // Adjust for timezone issues when creating a key from DB string
    tgl.setUTCHours(12); 
    const key = formatTanggal(tgl);
    if (hasil.hasOwnProperty(key)) {
        hasil[key] = log.status;
    }
  });

  return hasil;
};

export const getLogMingguan = (habit_id) => {
  const sekarang = new Date();
  const tahun = sekarang.getFullYear();
  const bulan = sekarang.getMonth();

  const awalBulan = ambilTanggal(new Date(tahun, bulan, 1));
  const akhirBulan = ambilTanggal(new Date(tahun, bulan + 1, 0)); // last day of the current month

  const query = `
    SELECT * FROM ${TABEL_HABIT_LOG}
    WHERE habit_id = ? AND tanggal BETWEEN ? AND ?
    ORDER BY tanggal ASC
  `;

  const logs = db.getAllSync(query, [habit_id, awalBulan, akhirBulan]);

  // Prepare the default result for weeks 1-4.
  let hasil = { 1: 0, 2: 0, 3: 0, 4: 0 };

  logs.forEach((log) => {
    const tgl = new Date(log.tanggal);
    const mingguKe = Math.ceil(tgl.getDate() / 7); // Week number within the month
    if (mingguKe >= 1 && mingguKe <= 4) {
      hasil[mingguKe] = log.status; // Overwrites with the last status found for that week
    }
  });

  return hasil;
};