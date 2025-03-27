import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRegularity} from '../hooks/useRegularity';

export default function LearningHeader({attempted, total}) {
  const regularity = useRegularity();

  return (
    <View style={styles.container}>
      <Text style={styles.wordlyText}>
        {attempted}/{total}
      </Text>
      <View style={styles.rightSection}>
        <Icon name="local-fire-department" size={32} color="#e44645" />
        <Text style={styles.numberText}>{regularity}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberText: {
    marginLeft: 5,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#e44645',
  },
  wordlyText: {
    fontSize: 32,
    color: '#f0f0f0',
  },
});
