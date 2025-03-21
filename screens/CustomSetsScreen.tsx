import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Dimensions,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomSetsScreen({navigation}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [customSets, setCustomSets] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Funkcja pobierająca zestawy z AsyncStorage
  const fetchSets = async () => {
    try {
      const storedSets = await AsyncStorage.getItem('customSets');
      if (storedSets) {
        const parsedSets = JSON.parse(storedSets);
        const onlyCustomSets = parsedSets.filter(set => set.isCustom);
        setCustomSets(onlyCustomSets);
      } else {
        // Jeśli brak danych w AsyncStorage, wyczyść listę
        setCustomSets([]);
      }
    } catch (error) {
      console.log('Błąd przy pobieraniu zestawów:', error);
    }
  };

  // useEffect, aby pobrać zestawy przy pierwszym montowaniu ekranu
  useEffect(() => {
    fetchSets();
  }, []);

  const toggleDeleteMode = () => {
    setDeleteMode(prev => !prev);
  };

  // Funkcja usuwająca wybrany zestaw
  const handleDeleteSet = async id => {
    try {
      const updatedSets = customSets.filter(set => set.id !== id);
      setCustomSets(updatedSets);
      await AsyncStorage.setItem('customSets', JSON.stringify(updatedSets));
    } catch (error) {
      console.log('Błąd przy usuwaniu zestawu:', error);
    }
  };

  // Funkcja obsługująca swipe to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSets();
    setRefreshing(false);
  };

  // Filtrowanie według wpisanego tekstu
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

      <View style={styles.headingContainer}>
        <Text style={styles.setHeading}>Przeglądaj zbiory</Text>
        <TouchableOpacity
          onPress={toggleDeleteMode}
          style={styles.settingsButton}>
          <Icon name="cog" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Przycisk dodawania nowego zbioru */}
        <TouchableOpacity
          style={styles.setContainer}
          onPress={() => navigation.navigate('AddSet')}>
          <Text style={styles.setText}>--- Dodaj zbiór ---</Text>
        </TouchableOpacity>

        {/* Wyświetlenie wszystkich zbiorów z AsyncStorage */}
        {filteredSets.map(item => (
          <View key={item.id} style={styles.setRow}>
            <TouchableOpacity
              style={[styles.setContainer, {flex: 1}]}
              onPress={() => navigation.navigate('EditSet', {setId: item.id})}>
              <Text style={styles.setText}>{item.name}</Text>
            </TouchableOpacity>

            {deleteMode && (
              <TouchableOpacity
                style={styles.trashIconContainer}
                onPress={() => handleDeleteSet(item.id)}>
                <Icon name="trash" size={28} color="#e44645" />
              </TouchableOpacity>
            )}
          </View>
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
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  setHeading: {
    color: '#bbb',
    fontSize: 24,
  },
  settingsButton: {
    padding: 5,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width - 20,
    alignSelf: 'center',
    marginVertical: 5,
  },
  setContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 25,
    borderRadius: 30,
    marginVertical: 5,
    marginRight: 5,
  },
  setText: {
    fontSize: 18,
    color: '#000',
  },
  trashIconContainer: {
    padding: 10,
  },
});
