import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList, // <-- Untuk menampilkan list
  TouchableOpacity, // <-- Untuk tombol
} from 'react-native';
import HabitItem from '../components/HabitItem';
import Icon from 'react-native-vector-icons/Feather'; // <-- Library ikon populer
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getSemuaDataHabit, updateHabit } from '../database/models/habit';
import { updateHabitLogStatus } from '../database/models/habit_log';

function getFormattedDate() {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

const AppHeader = ({ completedCount, totalCount }) => {
  const today = getFormattedDate();
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.dateText}>{today}</Text>
          <Text style={styles.title}>Habit</Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Progres</Text>
          <Text style={styles.progressCount}>{`${completedCount}/${totalCount}`}</Text>
        </View>
      </View>
      <View style={styles.progressBarBackground}>
        <View
          style={[styles.progressBarFill, { width: `${progressPercentage}%` }]}
        />
      </View>
    </View>
  );
};

export default function HomeScreen({ navigation }) {
  const [habits, setHabits] = useState([]);

  useFocusEffect(
    useCallback(() => {
      setHabits(getSemuaDataHabit());
    }, [])
  )

  const ketikaUserMenekanTombolCheckmark = (habit) => {
    updateHabitLogStatus(
      habit.log.id,
      habit.log.status === 1? 0 : 1
    )
    const dataTerbaru = getSemuaDataHabit();
    setHabits(dataTerbaru);
  };

  const ketikaTombolTambahHabitDitekan = () => {
    navigation.navigate("tambah-habit-screen")
  }

  const jumlahHabitSelesai = habits.filter((h) => h.log.status === 1).length;

  return (
    // SafeAreaView agar konten tidak nabrak status bar/notch
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <HabitItem
            habit={item}
            ketikaTombolCheckmarkDitekan={() => {
              ketikaUserMenekanTombolCheckmark(item)
            }}
            ketikaHabitDitekan={() => {
              navigation.navigate("edit-habit-screen", { habit: item })
            }}
          />
        )}
        ListHeaderComponent={
          <AppHeader completedCount={jumlahHabitSelesai} totalCount={habits.length} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada kebiasaan</Text>
            <Text style={styles.emptySubText}>Tekan tombol + untuk menambahkan habit baru</Text>
          </View>
        )}
        contentContainerStyle={[styles.container, habits.length === 0 && { flex: 1, justifyContent: 'center' }]}
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={ketikaTombolTambahHabitDitekan}
      >
        <Icon name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1, // <-- penting agar screen mengisi seluruh layar
    backgroundColor: '#F9FAFB', // bg-gray-50
  },
  container: {
    paddingHorizontal: 20, // px-5
    paddingBottom: 96, // pb-24
  },
  headerContainer: {
    marginBottom: 24, // mb-6
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20, // mt-5
    marginBottom: 16, // mb-4
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280', // text-gray-500
    fontWeight: '500', // font-medium
  },
  title: {
    fontSize: 30, // text-3xl
    fontWeight: 'bold',
    color: '#1F2937', // text-gray-800
  },
  progressContainer: {
    alignItems: 'flex-end', // text-right
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280', // text-gray-500
  },
  progressCount: {
    fontSize: 18, // text-lg
    fontWeight: 'bold',
    color: '#1F2937', // text-gray-800
  },
  progressBarBackground: {
    width: '100%',
    backgroundColor: '#E0E7FF', // bg-indigo-100
    borderRadius: 9999,
    height: 8, // h-2
  },
  progressBarFill: {
    backgroundColor: '#6366F1', // bg-indigo-500
    height: 8, // h-2
    borderRadius: 9999,
  },
  fab: {
    position: 'absolute', // setara 'fixed' di web
    bottom: 32, // bottom-8
    right: 32, // right-8
    width: 64, // w-16
    height: 64, // h-16
    backgroundColor: '#6366F1', // bg-indigo-500
    borderRadius: 32, // rounded-full
    alignItems: 'center',
    justifyContent: 'center',
    // shadow-lg
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8, // <-- shadow untuk Android
  },
});