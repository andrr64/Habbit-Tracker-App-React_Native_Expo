// src/screens/EditHabitScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView, // Import ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { updateHabit, hapusHabit } from '../database/models/habit';
import { getLogHarian, getLogMingguan } from '../database/models/habit_log';

// --- NEW COMPONENT: HabitLogDisplay ---
// This component renders the habit log based on the frequency.

// Helper to get short day names from a YYYY-MM-DD string
const getDayName = (dateString) => {
  // Create date in UTC to avoid timezone shifting the day
  const date = new Date(`${dateString}T12:00:00Z`);
  const days = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
  return days[date.getUTCDay()];
};


const HabitLogDisplay = ({ logData, frequency }) => {
  if (!logData || Object.keys(logData).length === 0) {
    return <Text style={styles.noDataText}>Belum ada data log untuk ditampilkan.</Text>;
  }

  // --- Daily View ---
  if (frequency === 'HARIAN') {
    // Sort keys to ensure days are in chronological order
    const sortedDates = Object.keys(logData).sort();
    return (
      <View>
        <Text style={styles.logTitle}>Aktivitas Minggu Ini</Text>
        <View style={styles.logContainer}>
          {sortedDates.map((date) => (
            <View key={date} style={styles.logItem}>
              <Text style={styles.logLabelDay}>{getDayName(date)}</Text>
              <View
                style={[
                  styles.statusBox,
                  logData[date] === 1 ? styles.statusDone : styles.statusNotDone,
                ]}
              />
            </View>
          ))}
        </View>
      </View>
    );
  }

  // --- Weekly View ---
  if (frequency === 'MINGGUAN') {
    return (
      <View>
        <Text style={styles.logTitle}>Aktivitas Bulan Ini</Text>
        <View style={styles.logContainer}>
          {Object.keys(logData).map((week) => (
            <View key={week} style={styles.logItem}>
              <View
                style={[
                  styles.statusBox,
                  styles.weeklyBox, // Make weekly boxes larger
                  logData[week] === 1 ? styles.statusDone : styles.statusNotDone,
                ]}
              />
              <Text style={styles.logLabelWeek}>Minggu {week}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return null;
};


// --- Main Screen Component ---
const EditHabitScreen = ({ navigation, route }) => {
  const { habit } = route.params;

  const [habitName, setHabitName] = useState(habit.nama);
  const [frequency, setFrequency] = useState(habit.frekuensi);
  const [habitLog, setHabitLog] = useState({});

  // Effect to fetch log data when the frequency changes or on initial load
  useEffect(() => {
    const fetchHabitLog = () => {
      console.log(`Fetching log for frequency: ${frequency}`);
      if (frequency === 'HARIAN') {
        setHabitLog(getLogHarian(habit.id));
      } else {
        setHabitLog(getLogMingguan(habit.id));
      }
    };
    fetchHabitLog();
  }, [frequency, habit.id]); // Rerun when frequency or habit ID changes

  const isValid = () => {
    if (habitName.trim() === '') {
      Alert.alert('Gagal', 'Nama kebiasaan tidak boleh kosong!');
      return false;
    }
    return true;
  };

  const ketikaSimpanPerubahan = () => {
    if (!isValid()) return;
    try {
      const berhasil = updateHabit({
        id: habit.id,
        nama: habitName,
        frekuensi: frequency,
      });
      if (berhasil) {
        Alert.alert('Sukses', 'Kebiasaan berhasil diperbarui!');
        navigation.goBack();
      } else {
        Alert.alert('Gagal', 'Tidak ada perubahan disimpan.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Terjadi kesalahan saat update kebiasaan.');
    }
  };

  const ketikaHapusData = () => {
    const tombolCancel = {
      text: 'Batal',
      style: 'cancel'
    }

    const tombolHapus = {
      text: 'Hapus',
      style: 'destructive',
      onPress: () => {
        try {
          const berhasil = hapusHabit(habit.id);
          if (berhasil) {
            Alert.alert('Sukses', 'Kebiasaan berhasil dihapus!');
            navigation.navigate('Home'); // Go back to home after deletion
          } else {
            Alert.alert('Gagal', 'Kebiasaan tidak ditemukan.');
          }
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Terjadi kesalahan saat menghapus.');
        }
      },
    };

    Alert.alert(
      'Konfirmasi',
      'Apakah kamu yakin ingin menghapus kebiasaan ini?',
      [
        tombolCancel,
        tombolHapus
      ]
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#1E2A3D" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Kebiasaan</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Nama Kebiasaan</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: Olahraga pagi"
          placeholderTextColor="#8A94A6"
          value={habitName}
          onChangeText={setHabitName}
        />

        <Text style={styles.label}>Frekuensi</Text>
        <View style={styles.dropdownWrapper}>
          <Picker
            selectedValue={frequency}
            onValueChange={(value) => setFrequency(value)}
            style={styles.dropdown}
          >
            <Picker.Item label="Harian" value="HARIAN" />
            <Picker.Item label="Mingguan" value="MINGGUAN" />
          </Picker>
        </View>

        {/* --- Render the new HabitLogDisplay component --- */}
        <HabitLogDisplay logData={habitLog} frequency={frequency} />

      </ScrollView>

      <View style={styles.bottomAction}>
        <TouchableOpacity style={styles.saveButton} onPress={ketikaSimpanPerubahan}>
          <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={ketikaHapusData}>
          <Text style={styles.deleteButtonText}>Hapus Kebiasaan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F7FE', paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  backButton: { padding: 8, marginLeft: -8 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1E2A3D' },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E2A3D',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  dropdownWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  dropdown: {
    height: 50,
    paddingHorizontal: 8,
  },
  bottomAction: { gap: 12, paddingTop: 16, paddingBottom: 8 },
  saveButton: {
    backgroundColor: '#4A72FF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  deleteButton: {
    backgroundColor: '#FF5A5A',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  deleteButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  // --- Styles for HabitLogDisplay ---
  logTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E2A3D',
    marginTop: 24,
    marginBottom: 12,
  },
  logContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  logItem: {
    alignItems: 'center',
    gap: 8,
  },
  logLabelDay: {
    fontSize: 12,
    color: '#8A94A6',
    fontWeight: '500',
  },
  logLabelWeek: {
    fontSize: 14,
    color: '#8A94A6',
    fontWeight: '500',
  },
  statusBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  weeklyBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  statusDone: {
    backgroundColor: '#34D399', // Green
  },
  statusNotDone: {
    backgroundColor: '#E0E7FF', // Light gray/blue
  },
  noDataText: {
    marginTop: 24,
    textAlign: 'center',
    color: '#8A94A6',
    fontStyle: 'italic',
  },
});

export default EditHabitScreen;