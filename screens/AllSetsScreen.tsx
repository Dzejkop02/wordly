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
import DefaultSets from '../default-sets.json';

export default function AllSetsScreen({navigation}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [allSets, setAllSets] = useState([...DefaultSets]);
  const [refreshing, setRefreshing] = useState(false);

  // Funkcja pobierająca zestawy użytkownika z AsyncStorage i łącząca je z DefaultSets
  const fetchUserSets = async () => {
    try {
      const storedSets = await AsyncStorage.getItem('customSets');
      if (storedSets) {
        const parsedSets = JSON.parse(storedSets);
        const combined = [...DefaultSets, ...parsedSets];
        setAllSets(combined);
      } else {
        setAllSets([...DefaultSets]);
      }
    } catch (error) {
      console.log('Błąd podczas wczytywania zestawów użytkownika:', error);
    }
  };

  // Ładujemy zestawy przy pierwszym uruchomieniu ekranu
  useEffect(() => {
    fetchUserSets();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserSets();
    setRefreshing(false);
  };

  // Filtrowanie
  const filteredSets =
    searchQuery.trim() === ''
      ? allSets
      : allSets.filter(set =>
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

      <Text style={styles.greetingText}>Powtórz słówka !!</Text>
      <Text style={styles.setHeading}>Przeglądaj zbiory</Text>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {filteredSets.map(set => (
          <TouchableOpacity
            key={set.id}
            style={styles.setContainer}
            onPress={() => navigation.navigate('Learning', {setId: set.id})}>
            <Text style={styles.setText}>{set.name}</Text>
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
