import React, {useState, useEffect} from 'react';
import {View, Text, TextInput} from 'react-native';

export default function LearningScreen({route}) {
  const {setId} = route.params;

  return <Text>--- Ekran nauki --- {setId}</Text>;
}

// export default function LearningScreen({route}) {
//   const {set} = route.params;
//   const [currentWordIndex, setCurrentWordIndex] = useState(0);
//   const [userAnswer, setUserAnswer] = useState('');
//
//   const checkAnswer = () => {
//     if (
//       userAnswer.toLowerCase() ===
//       set.words[currentWordIndex].translation.toLowerCase()
//     ) {
//       // Obsługa poprawnej odpowiedzi
//       if (currentWordIndex < set.words.length - 1) {
//         setCurrentWordIndex(prev => prev + 1);
//       } else {
//         // Zakończenie sesji
//       }
//     }
//   };
//
//   return (
//     <View style={styles.container}>
//       <Text style={styles.question}>{set.words[currentWordIndex].word}</Text>
//       <TextInput
//         style={styles.input}
//         value={userAnswer}
//         onChangeText={setUserAnswer}
//         onSubmitEditing={checkAnswer}
//       />
//     </View>
//   );
// }
