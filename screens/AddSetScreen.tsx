import React, {useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'uuid-random';

export default function AddSetScreen({navigation}) {
  const [setTitle, setSetTitle] = useState('');
  const [rows, setRows] = useState([
    {id: Date.now(), left: '', right: '', typed: false},
  ]);
  const MAX_ROWS = 15;

  const getTypedRowsCount = list => list.filter(row => row.typed).length;

  const handleChangeText = (index, side, text) => {
    const updated = [...rows];
    const row = updated[index];

    row[side] = text;
    const hasAnyValue = row.left.trim() !== '' || row.right.trim() !== '';
    row.typed = hasAnyValue;

    // Dodawanie nowego wiersza (placeholdera), jeśli wypełniono ostatni i nie osiągnięto limitu
    if (hasAnyValue && index === updated.length - 1) {
      const typedCount = getTypedRowsCount(updated);
      if (typedCount < MAX_ROWS) {
        updated.push({
          id: Date.now() + 1,
          left: '',
          right: '',
          typed: false,
        });
      }
    }

    setRows(updated);
  };

  const removeRow = index => {
    const updated = [...rows];
    updated.splice(index, 1);

    // Jeśli wszystko usunięte, dodaj jeden pusty
    if (updated.length === 0) {
      updated.push({
        id: Date.now(),
        left: '',
        right: '',
        typed: false,
      });
    }

    // Dodaj placeholder, jeśli usunięto wypełniony wiersz i jest miejsce
    const typedCount = getTypedRowsCount(updated);
    if (typedCount < MAX_ROWS) {
      const lastRow = updated[updated.length - 1];
      if (lastRow.typed) {
        updated.push({
          id: Date.now() + 2,
          left: '',
          right: '',
          typed: false,
        });
      }
    }

    setRows(updated);
  };

  // Dynamicznie zwraca styl tła (białe lub półprzezroczyste),
  // zależnie od tego, czy pole jest puste
  const getContainerDynamicStyle = value => ({
    backgroundColor: value.trim() === '' ? 'rgba(255,255,255,0.5)' : '#fff',
  });

  // Funkcja zapisu nowego zestawu w AsyncStorage
  const handleSaveSet = async () => {
    try {
      // 1. Pobierz istniejące zestawy z AsyncStorage
      const storedSets = await AsyncStorage.getItem('customSets');
      let sets = [];

      if (storedSets) {
        sets = JSON.parse(storedSets); // Parsujemy, jeśli coś było
      }

      // 2. Zbuduj nowy obiekt zestawu
      const newSet = {
        // id: Date.now().toString(),
        id: uuid(),
        name: setTitle || 'Własny zestaw 💪',
        isCustom: true,
        words: rows
          .filter(row => row.typed)
          .map(row => ({
            id: uuid(),
            source: row.left,
            translation: row.right,
          })),
      };

      // 3. Dodajemy nowy zestaw do istniejącej tablicy
      sets.push(newSet);

      // 4. Zapisujemy z powrotem w AsyncStorage
      await AsyncStorage.setItem('customSets', JSON.stringify(sets));

      // 5. Przechodzimy na ekran CustomSets
      navigation.navigate('CustomSets');
    } catch (error) {
      console.error('Błąd przy zapisie zestawu:', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header />

      <View style={styles.centeredContainer}>
        <Text style={styles.greetingText}>Utwórz Zbiór</Text>

        {/* Ikona ZAPISU */}
        <TouchableOpacity onPress={handleSaveSet}>
          <MaterialIcons
            name="save"
            size={45}
            color="#e44645"
            style={styles.iconSpacing}
          />
        </TouchableOpacity>

        {/* Ikona X – powrót do ekranu CustomSets */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CustomSets');
          }}>
          <MaterialCommunityIcons
            name="close-box"
            size={45}
            color="white"
            style={styles.iconSpacing}
          />
        </TouchableOpacity>
      </View>

      {/* Input na nazwę zestawu */}
      <View style={styles.titleSetContainer}>
        <TextInput
          style={styles.titleSet}
          placeholder="Nazwa zbioru"
          placeholderTextColor="#aaa"
          value={setTitle}
          onChangeText={text => setSetTitle(text)}
        />
      </View>

      <ScrollView contentContainerStyle={styles.wordsContainer}>
        {rows.map((row, index) => (
          <View key={row.id} style={styles.row}>
            {/* Kontener pierwszego inputu */}
            <View
              style={[
                styles.wordInputContainer,
                getContainerDynamicStyle(row.left),
              ]}>
              <TextInput
                style={styles.wordInput}
                placeholder="Słówko"
                placeholderTextColor="#888"
                value={row.left}
                onChangeText={text => handleChangeText(index, 'left', text)}
              />
            </View>

            {/* Kontener drugiego inputu */}
            <View
              style={[
                styles.wordInputContainer,
                getContainerDynamicStyle(row.right),
                {marginRight: 0},
              ]}>
              <TextInput
                style={styles.wordInput}
                placeholder="Tłumaczenie (PL)"
                placeholderTextColor="#888"
                value={row.right}
                onChangeText={text => handleChangeText(index, 'right', text)}
              />
            </View>

            {/* Stałe miejsce na ikonę X */}
            <View style={styles.iconContainer}>
              {row.typed && (
                <TouchableOpacity onPress={() => removeRow(index)}>
                  <MaterialCommunityIcons
                    name="close-box"
                    size={30}
                    color="#e44645"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 30,
  },
  greetingText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
  },
  iconSpacing: {
    marginLeft: 10,
  },
  titleSetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width - 20,
    paddingHorizontal: 15,
    alignSelf: 'center',
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  titleSet: {
    flex: 1,
    fontSize: 20,
    color: '#aaa',
  },
  wordsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    padding: 5,
    backgroundColor: 'transparent',
  },
  // Kontener białego (lub półprzezroczystego) pola z podkreśleniem wewnątrz
  wordInputContainer: {
    flex: 1,
    marginRight: 5,
    borderRadius: 5,
    borderBottomWidth: 2, // linia wewnątrz białego pola
    borderBottomColor: '#666',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  // Samo pole tekstowe, bez dodatkowego marginesu na dole
  wordInput: {
    color: '#000',
    fontSize: 16,
    padding: 0, // dzięki temu linia jest tuż pod tekstem
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
