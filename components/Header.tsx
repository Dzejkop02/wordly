import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Header() {
  const number = 100;

  return (
    <View style={styles.container}>
      <Text style={styles.wordlyText}>Wordly</Text>
      <View style={styles.rightSection}>
        <Icon name="local-fire-department" size={32} color="#e44645" />
        <Text style={styles.numberText}>{number}</Text>
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
    fontWeight: 'bold',
    color: '#f0f0f0',
  },
});
