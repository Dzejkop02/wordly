import React, {useState, useEffect} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Header from '../components/Header';
import LearningHeader from '../components/LearningHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Funkcja tasująca
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function LearningScreen({route, navigation}) {
  const {selectedSet} = route.params;

  const [wordsToLearn, setWordsToLearn] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  const [totalWords, setTotalWords] = useState(0);
  const [incorrectlyAnswered, setIncorrectlyAnswered] = useState(new Set());

  const [attemptedThisRound, setAttemptedThisRound] = useState(0);
  const [wordsInCurrentRound, setWordsInCurrentRound] = useState(0);

  const startNewSession = () => {
    if (!selectedSet || !selectedSet.words) {
      return;
    }
    const shuffled = shuffleArray(selectedSet.words);
    setWordsToLearn(shuffled);
    setTotalWords(shuffled.length);
    setWordsInCurrentRound(shuffled.length);
    setAttemptedThisRound(0);
    setIncorrectlyAnswered(new Set());
    setUserAnswer('');
    setFeedback('');
    setAnswerSubmitted(false);
  };

  useEffect(() => {
    startNewSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSet]);

  const isSessionComplete = wordsToLearn.length === 0;
  const currentWord = !isSessionComplete ? wordsToLearn[0] : null;

  // Funkcja aktualizująca licznik w AsyncStorage
  const incrementDailyCount = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const statsString = await AsyncStorage.getItem('dailyStats');
      let stats;
      if (statsString) {
        stats = JSON.parse(statsString);
        if (stats.date !== today) {
          stats = {date: today, count: 0};
        }
      } else {
        stats = {date: today, count: 0};
      }
      stats.count += 1;
      await AsyncStorage.setItem('dailyStats', JSON.stringify(stats));
    } catch (error) {
      console.error('Error updating daily stats', error);
    }
  };

  const updateRegularityStat = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const regString = await AsyncStorage.getItem('regularityStats');
      let regStat;
      if (regString) {
        regStat = JSON.parse(regString);
        // Jeśli ostatni zapis jest już dzisiaj – nie robimy nic
        if (regStat.date === today) return;
        // Jeśli ostatni zapis był wczoraj – zwiększamy licznik
        if (regStat.date === yesterday) {
          regStat = { date: today, count: regStat.count + 1 };
        } else {
          // Brak regularności – resetujemy licznik
          regStat = { date: today, count: 1 };
        }
      } else {
        // Brak statystyki – inicjujemy ją
        regStat = { date: today, count: 1 };
      }
      await AsyncStorage.setItem('regularityStats', JSON.stringify(regStat));
    } catch (error) {
      console.error('Error updating regularity stat', error);
    }
  };

  useEffect(() => {
    if (isSessionComplete) {
      updateRegularityStat();
    }
  }, [isSessionComplete]);

  // Zmodyfikowana funkcja handleConfirm
  const handleConfirm = async () => {
    if (!currentWord) {
      return;
    }
    const userAnsNormalized = userAnswer.trim().toLowerCase();
    const correctAnsNormalized = currentWord.source.trim().toLowerCase();

    if (userAnsNormalized === correctAnsNormalized) {
      setFeedback(currentWord.source);
      // Zwiększamy licznik statystyk przy poprawnej odpowiedzi
      await incrementDailyCount();
    } else {
      setFeedback(`Poprawna odpowiedź: ${currentWord.source}`);
      setIncorrectlyAnswered(prev => new Set([...prev, currentWord.id]));
    }
    setAnswerSubmitted(true);
  };

  const handleNext = () => {
    if (!currentWord) {
      return;
    }
    const userAnsNormalized = userAnswer.trim().toLowerCase();
    const correctAnsNormalized = currentWord.source.trim().toLowerCase();
    const isCorrect = userAnsNormalized === correctAnsNormalized;

    let newQueue = [...wordsToLearn];
    newQueue.shift();
    if (!isCorrect) {
      newQueue.push(currentWord);
    }
    setWordsToLearn(newQueue);
    setUserAnswer('');
    setFeedback('');
    setAnswerSubmitted(false);

    const newAttemptCount = attemptedThisRound + 1;
    setAttemptedThisRound(newAttemptCount);

    if (newAttemptCount === wordsInCurrentRound) {
      if (newQueue.length > 0) {
        const shuffled = shuffleArray(newQueue);
        setWordsToLearn(shuffled);
        setAttemptedThisRound(0);
        setWordsInCurrentRound(shuffled.length);
      }
    }
  };

  const handleClear = () => {
    setUserAnswer('');
    setFeedback('');
  };

  const correctlyOnFirstTryCount = totalWords - incorrectlyAnswered.size;
  const correctColor = '#658f8f';
  const wrongColor = '#e54545';
  const isAnswerCorrect =
    answerSubmitted && !feedback.startsWith('Poprawna odpowiedź:');

  return (
    <View style={{flex: 1}}>
      {isSessionComplete ? (
        <Header />
      ) : (
        <LearningHeader
          attempted={attemptedThisRound + 1}
          total={wordsInCurrentRound}
        />
      )}

      {/* Tytuł zbioru */}
      <Text style={styles.setTitle}>{selectedSet?.name}</Text>

      <View style={styles.container}>
        {isSessionComplete ? (
          <View style={styles.completeContainer}>
            <Text style={styles.doneText}>Koniec nauki! 🎉</Text>
            <Text style={styles.resultText}>
              Trafiłeś {correctlyOnFirstTryCount} / {totalWords} słówek za
              pierwszym razem!
            </Text>

            <View style={styles.completeButtonsColumn}>
              <TouchableOpacity
                style={[styles.buttonPrimary, styles.halfButton]}
                onPress={startNewSession}>
                <Text style={styles.buttonText}>Spróbuj ponownie</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonBack, styles.halfButton]}
                onPress={() => navigation.navigate('AllSets')}>
                <Text style={styles.buttonText}>Powrót</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <Text
              style={[
                styles.translationText,
                answerSubmitted && isAnswerCorrect && {color: correctColor},
              ]}>
              {currentWord?.translation}
            </Text>

            <View style={styles.feedbackContainer}>
              {feedback.startsWith('Poprawna odpowiedź:') ? (
                <>
                  <Text style={[styles.feedbackText, {color: wrongColor}]}>
                    Poprawna odpowiedź:
                  </Text>
                  <Text
                    style={[
                      styles.feedbackText,
                      styles.bold,
                      {color: wrongColor},
                    ]}>
                    {feedback.replace('Poprawna odpowiedź: ', '')}
                  </Text>
                </>
              ) : (
                <Text
                  style={[
                    styles.feedbackText,
                    answerSubmitted &&
                      (isAnswerCorrect
                        ? {color: correctColor}
                        : {color: wrongColor}),
                  ]}>
                  {feedback}
                </Text>
              )}
            </View>

            <TextInput
              style={[
                styles.answerInput,
                answerSubmitted &&
                  (isAnswerCorrect
                    ? {color: correctColor, borderBottomColor: correctColor}
                    : {color: wrongColor, borderBottomColor: wrongColor}),
              ]}
              value={userAnswer}
              onChangeText={setUserAnswer}
              editable={!answerSubmitted}
              placeholder="Wpisz słówko..."
              placeholderTextColor="#ccc"
            />

            <View
              style={[
                styles.buttonsRow,
                answerSubmitted && {justifyContent: 'center'},
              ]}>
              {!answerSubmitted ? (
                <>
                  <TouchableOpacity
                    style={styles.buttonClear}
                    onPress={handleClear}>
                    <Text style={styles.buttonText}>Wyczyść</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonPrimary}
                    onPress={handleConfirm}>
                    <Text style={styles.buttonText}>Potwierdź</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.buttonPrimary}
                  onPress={handleNext}>
                  <Text style={styles.buttonText}>Dalej</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  setTitle: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  completeContainer: {
    alignItems: 'center',
    width: '100%',
  },
  doneText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  resultText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 100,
  },
  completeButtonsColumn: {
    flexDirection: 'column',
    width: '100%',
  },
  halfButton: {
    width: '75%',
    alignSelf: 'center',
    marginVertical: 5,
  },
  translationText: {
    fontSize: 42,
    marginTop: 20,
    marginBottom: 10,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  feedbackContainer: {
    minHeight: 30,
    justifyContent: 'center',
    marginBottom: 10,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 24,
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  answerInput: {
    width: '100%',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    fontSize: 22,
    paddingVertical: 10,
    marginBottom: 10,
    color: '#fff',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  buttonPrimary: {
    backgroundColor: '#e54545',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonClear: {
    backgroundColor: '#658f8f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonBack: {
    backgroundColor: '#112c2c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
});
