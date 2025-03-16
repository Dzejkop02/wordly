import React, {useState} from 'react';
import {View, TextInput, Button, Text} from 'react-native';

export default function EditSetScreen() {
  return <Text>--- Ekran dodawania / edycji ---</Text>;
}

// export default function EditSetScreen({route, navigation}) {
//   const [name, setName] = useState(route.params?.set?.name || '');
//   const [words, setWords] = useState(route.params?.set?.words || []);
//
//   const saveSet = () => {
//     // Logika zapisywania do stanu/AsyncStorage
//     navigation.goBack();
//   };
//
//   return (
//     <View style={styles.container}>
//       <TextInput
//         placeholder="Nazwa zestawu"
//         value={name}
//         onChangeText={setName}
//       />
//       {/* Komponent do dodawania słówek */}
//       <Button title="Zapisz" onPress={saveSet} />
//     </View>
//   );
// }
