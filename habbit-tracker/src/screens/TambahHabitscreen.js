// src/screens/TambahHabitScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker'; // dropdown
import { tambahHabit } from '../database/models/habit';

const TambahHabitScreen = ({ navigation }) => {
  // state untuk simpan input pengguna
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState('HARIAN'); // default

  // fungsi validasi
  const isValid = () => {
    if (habitName.trim() === '') {
      Alert.alert('Gagal', 'Nama kebiasaan tidak boleh kosong!');
      return false;
    }
    return true;
  };

  // fungsi untuk reset form
  const resetForm = () => {
    setHabitName('');
    setFrequency('HARIAN');
  };

  // fungsi utama untuk simpan habit ke database
  const simpanHabit = () => {
    if (!isValid()) return;

    try {
      const idBaru = tambahHabit({
        nama: habitName,
        frekuensi: frequency,
      });
      Alert.alert('Sukses', 'Kebiasaan baru berhasil ditambahkan!');

      resetForm();
      if (navigation) navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan kebiasaan.');
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#1E2A3D" />
        </TouchableOpacity>
        <Text style={styles.title}>Kebiasaan Baru</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Input Nama */}
      <Text style={styles.label}>Nama Kebiasaan</Text>
      <TextInput
        style={styles.input}
        placeholder="Contoh: Olahraga pagi"
        placeholderTextColor="#8A94A6"
        value={habitName}
        onChangeText={setHabitName}
      />

      {/* Dropdown Frekuensi */}
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

      {/* Tombol Simpan */}
      <View style={styles.bottomAction}>
        <TouchableOpacity style={styles.saveButton} onPress={simpanHabit}>
          <Text style={styles.saveButtonText}>Simpan Kebiasaan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F7FE', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  backButton: { padding: 8 },
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
    marginBottom: 24,
  },
  dropdown: {
    height: 50,
    paddingHorizontal: 8,
  },
  bottomAction: { marginTop: 'auto' },
  saveButton: {
    backgroundColor: '#4A72FF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default TambahHabitScreen;