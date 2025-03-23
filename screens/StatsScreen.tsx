import React, {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function StatsScreen() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.profileContainer}>
        <Icon name="user-o" size={68} color="white" />
      </View>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Powtórzyłeś dzisiaj</Text>
        <Text style={styles.statsText}>
          <Text style={styles.numberText}>40</Text>{' '}
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
