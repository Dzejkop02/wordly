import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomSetsScreen({navigation}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [customSets, setCustomSets] = useState([]);

  // pobierz zestawy z AsyncStorage
  useEffect(() => {
    const fetchSets = async () => {
      try {
        const storedSets = await AsyncStorage.getItem('customSets');
        if (storedSets) {
          const parsedSets = JSON.parse(storedSets);
          const onlyCustomSets = parsedSets.filter(set => set.isCustom);
          setCustomSets(onlyCustomSets);
        }
      } catch (error) {
        console.log('Błąd przy pobieraniu zestawów:', error);
      }
    };

    fetchSets();
  }, []);

  const filteredSets = customSets.filter(set =>
    set.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={{flex: 1}}>
      <Header />

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Szukaj"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>

      <Text style={styles.greetingText}>Zarządzaj zbiorami</Text>

      <Text style={styles.setHeading}>Przeglądaj zbiory</Text>
      <ScrollView>
        {/* Przycisk dodawania nowego zbioru */}
        <TouchableOpacity
          style={styles.setContainer}
          onPress={() => navigation.navigate('AddSet')}>
          <Text style={styles.setText}>--- Dodaj zbiór ---</Text>
        </TouchableOpacity>

        {/* Wyświetlenie wszystkich zbiorów z AsyncStorage */}
        {filteredSets.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.setContainer}
            onPress={() => navigation.navigate('EditSet', {setId: item.id})}>
            <Text style={styles.setText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width - 20,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
  },
  greetingText: {
    textAlign: 'center',
    fontSize: 32,
    marginTop: 60,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  setHeading: {
    color: '#bbb',
    marginBottom: 15,
    marginLeft: 15,
    fontSize: 24,
  },
  setContainer: {
    width: Dimensions.get('window').width - 20,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 25,
    borderRadius: 30,
    alignSelf: 'center',
    marginVertical: 10,
  },
  setText: {
    fontSize: 18,
    color: '#000',
  },
});
