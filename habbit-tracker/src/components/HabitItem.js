import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

function CheckmarkIcon({ isCompleted }) {
  if (isCompleted) {
    return <Icon name="check" size={14} color="white" />;
  }
  return null;
}

const HabitItem = ({ habit, ketikaTombolCheckmarkDitekan, ketikaHabitDitekan }) => {
  const isCompleted = habit.log?.status === 1;
  return (
    <View style={[styles.habitCardBase, isCompleted && styles.habitCardCompleted]}>
      <TouchableOpacity onPress={ketikaHabitDitekan} style={{ flex: 1 }}>
        <View style={styles.habitInfo}>
          <View>
            <Text style={[styles.habitNameBase, isCompleted && styles.habitNameCompleted]}>
              {habit.nama}
            </Text>
            <Text style={styles.habitFrequency}>{habit.frekuensi}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.checkmarkCircleBase, isCompleted && styles.checkmarkCircleCompleted]}
        onPress={ketikaTombolCheckmarkDitekan}
      >
        <CheckmarkIcon isCompleted={isCompleted} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  habitCardBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitCardCompleted: {
    backgroundColor: '#F0FDF4',
  },
  habitInfo: {
    flexDirection: 'column',
    gap: 4,
  },
  habitNameBase: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  habitNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  habitFrequency: {
    fontSize: 14,
    color: '#6B7280',
  },
  checkmarkCircleBase: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#C7D2FE',
  },
  checkmarkCircleCompleted: {
    backgroundColor: '#4ADE80',
    borderColor: '#4ADE80',
  },
});

export default HabitItem;
