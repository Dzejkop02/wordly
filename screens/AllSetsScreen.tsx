import React, {useState} from 'react';
import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput, Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DefaultSets from '../default-sets.json';
import Header from '../components/Header';

export default function AllSetsScreen({navigation}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSets =
    searchQuery.trim() === ''
      ? DefaultSets
      : DefaultSets.filter(set =>
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

      <Text style={styles.greetingText}>Witaj ponownie !!</Text>

      <Text style={styles.setHeading}>Przeglądaj zbiory</Text>
      <ScrollView>
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

// export default function AllSetsScreen({navigation}) {
//   const [sets, setSets] = useState([...predefinedSets, ...userSets]);
//
//   const renderItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.setItem}
//       onPress={() => navigation.navigate('Learning', {set: item})}>
//       <Text style={styles.setTitle}>{item.name}</Text>
//       <Text>{item.words.length} słów</Text>
//     </TouchableOpacity>
//   );
//
//   return (
//     <FlatList
//       data={sets}
//       renderItem={renderItem}
//       keyExtractor={item => item.id}
//     />
//   );
// }
