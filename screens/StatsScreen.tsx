import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StatsScreen({navigation}) {
  const [isChecked, setIsChecked] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);

  const loadDailyStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const statsString = await AsyncStorage.getItem('dailyStats');
      let stats;
      if (statsString) {
        stats = JSON.parse(statsString);
        if (stats.date !== today) {
          stats = {date: today, count: 0};
          await AsyncStorage.setItem('dailyStats', JSON.stringify(stats));
        }
      } else {
        stats = {date: today, count: 0};
        await AsyncStorage.setItem('dailyStats', JSON.stringify(stats));
      }
      setDailyCount(stats.count);
    } catch (error) {
      console.error('Error loading daily stats', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDailyStats();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    loadDailyStats();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.profileContainer}>
        <Icon name="user-o" size={68} color="white" />
      </View>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Powtórzyłeś dzisiaj</Text>
        <Text style={styles.statsText}>
          <Text style={styles.numberText}>{dailyCount}</Text>{' '}
          <Text style={styles.numberDescText}>słówek !!! </Text>
        </Text>
      </View>
      <View style={styles.settingsContainer}>
        <View style={styles.settingsRow}>
          <Icon name="cog" size={44} color="white" />
          <Text style={styles.settingsText}> Ustawienia</Text>
        </View>
        <View style={styles.checkboxRow}>
          <CheckBox
            value={isChecked}
            onValueChange={setIsChecked}
            tintColors={{true: 'white', false: 'white'}}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxText}>Przypominaj o dniach serii</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    alignItems: 'flex-start',
    marginVertical: 20,
    marginHorizontal: 50,
  },
  statsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsText: {
    color: 'white',
    fontSize: 32,
    textAlign: 'center',
    marginVertical: 5,
  },
  numberDescText: {
    fontSize: 44,
    fontWeight: 'bold',
  },
  numberText: {
    color: '#e44645',
    fontSize: 44,
    fontWeight: 'bold',
  },
  settingsContainer: {
    marginLeft: 30,
    marginBottom: 20,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingsText: {
    color: 'white',
    fontSize: 40,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    color: 'white',
    fontSize: 20,
    marginLeft: 10,
  },
  checkbox: {
    transform: [{scaleX: 1.4}, {scaleY: 1.4}],
    margin: 5,
  },
});
