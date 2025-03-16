import React, {useState} from 'react';
import {FlatList, TouchableOpacity, View, Text} from 'react-native';

export default function AllSetsScreen() {
  return <Text>--- All Sets Screen ---</Text>;
}

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
