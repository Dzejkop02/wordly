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
  // Zbiór ID słówek, które były źle odpowiedziane co najmniej raz
  const [incorrectlyAnswered, setIncorrectlyAnswered] = useState(new Set());

  const [attemptedThisRound, setAttemptedThisRound] = useState(0);
  const [wordsInCurrentRound, setWordsInCurrentRound] = useState(0);

  const startNewSession = () => {
    if (!selectedSet || !selectedSet.words) {
      return;
    }

    const shuffled = shuffleArray(selectedSet.words);

    // Nowa kolejka
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

  const handleConfirm = () => {
    if (!currentWord) {
      return;
    }

    const userAnsNormalized = userAnswer.trim().toLowerCase();
    const correctAnsNormalized = currentWord.source.trim().toLowerCase();

    if (userAnsNormalized === correctAnsNormalized) {
      setFeedback(currentWord.source);
    } else {
      setFeedback(`Poprawna odpowiedź: ${currentWord.source}`);
      setIncorrectlyAnswered(prev => new Set([...prev, currentWord.id]));
    }
    setAnswerSubmitted(true);
  };

  // Przejście do następnego słówka
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
      // Runda zakończona
      if (newQueue.length > 0) {
        const shuffled = shuffleArray(newQueue);
        setWordsToLearn(shuffled);
        setAttemptedThisRound(0);
        setWordsInCurrentRound(shuffled.length);
      }
    }
  };

  // Wyczyść odpowiedź
  const handleClear = () => {
    setUserAnswer('');
    setFeedback('');
  };

  const correctlyOnFirstTryCount = totalWords - incorrectlyAnswered.size;

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

      <View style={styles.container}>
        {isSessionComplete ? (
          <View style={{alignItems: 'center'}}>
            <Text style={styles.doneText}>Koniec nauki! 🎉</Text>
            <Text style={styles.doneText}>
              Trafiłeś {correctlyOnFirstTryCount} / {totalWords} słówek za
              pierwszym razem!
            </Text>

            <TouchableOpacity
              style={styles.backButton}
              onPress={startNewSession}>
              <Text style={styles.buttonText}>Spróbuj ponownie</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.backButton, {marginTop: 10}]}
              onPress={() => navigation.navigate('AllSets')}>
              <Text style={styles.buttonText}>Powrót</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.translationText}>
              {currentWord?.translation}
            </Text>

            <TextInput
              style={styles.answerInput}
              value={userAnswer}
              onChangeText={setUserAnswer}
              editable={!answerSubmitted}
            />

            {feedback !== '' && (
              <Text style={styles.feedbackText}>{feedback}</Text>
            )}

            <View style={styles.buttonsRow}>
              {!answerSubmitted ? (
                <>
                  <TouchableOpacity style={styles.button} onPress={handleClear}>
                    <Text style={styles.buttonText}>Wyczyść</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleConfirm}>
                    <Text style={styles.buttonText}>Potwierdź</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.button} onPress={handleNext}>
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
  },
  translationText: {
    fontSize: 28,
    marginBottom: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  answerInput: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    fontSize: 18,
    padding: 10,
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 18,
    marginTop: 10,
    color: '#ffcc00',
    textAlign: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#e44645',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  doneText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#666',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 30,
  },
});
