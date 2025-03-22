import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import LearningHeader from '../components/LearningHeader';

// Funkcja tasująca (Fisher-Yates)
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

  // Kolejka słówek do nauki
  const [wordsToLearn, setWordsToLearn] = useState([]);
  // Wpisywana odpowiedź
  const [userAnswer, setUserAnswer] = useState('');
  // Komunikat zwrotny (poprawna / błędna odpowiedź)
  const [feedback, setFeedback] = useState('');
  // Czy odpowiedź została już potwierdzona (oczekujemy na kliknięcie "Dalej")
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  // Liczba wszystkich słówek (do statystyki)
  const [totalWords, setTotalWords] = useState(0);
  // Zbiór ID słówek, które były źle odpowiedziane co najmniej raz
  const [incorrectlyAnswered, setIncorrectlyAnswered] = useState(new Set());

  // Obsługa rund
  const [attemptedThisRound, setAttemptedThisRound] = useState(0);
  const [wordsInCurrentRound, setWordsInCurrentRound] = useState(0);

  // Funkcja inicjująca / resetująca sesję od początku
  const startNewSession = () => {
    if (!selectedSet || !selectedSet.words) {
      return;
    }

    // Tasujemy słówka
    const shuffled = shuffleArray(selectedSet.words);

    // Ustawiamy nową kolejkę
    setWordsToLearn(shuffled);
    // Całkowita liczba słówek
    setTotalWords(shuffled.length);

    // Runda
    setWordsInCurrentRound(shuffled.length);
    setAttemptedThisRound(0);

    // Czyścimy błędne odpowiedzi i pole, feedback
    setIncorrectlyAnswered(new Set());
    setUserAnswer('');
    setFeedback('');
    setAnswerSubmitted(false);
  };

  // Wywołujemy startNewSession tylko raz, gdy ekran się ładuje
  useEffect(() => {
    startNewSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSet]);

  // Czy skończyliśmy naukę (kolejka pusta)
  const isSessionComplete = wordsToLearn.length === 0;
  // Aktualne słówko (pierwsze w kolejce)
  const currentWord = !isSessionComplete ? wordsToLearn[0] : null;

  // Potwierdzenie odpowiedzi
  const handleConfirm = () => {
    if (!currentWord) {
      return;
    }

    const userAnsNormalized = userAnswer.trim().toLowerCase();
    const correctAnsNormalized = currentWord.source.trim().toLowerCase();

    if (userAnsNormalized === correctAnsNormalized) {
      setFeedback('Dobra odpowiedź!');
    } else {
      setFeedback(`Błędna odpowiedź! Prawidłowa: ${currentWord.source}`);
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

    // Kopiujemy kolejkę i usuwamy pierwsze słówko
    let newQueue = [...wordsToLearn];
    newQueue.shift();

    // Jeśli błędne, przenosimy słówko na koniec
    if (!isCorrect) {
      newQueue.push(currentWord);
    }

    setWordsToLearn(newQueue);
    setUserAnswer('');
    setFeedback('');
    setAnswerSubmitted(false);

    // Zwiększamy licznik prób w tej rundzie
    const newAttemptCount = attemptedThisRound + 1;
    setAttemptedThisRound(newAttemptCount);

    // Sprawdzamy, czy runda się skończyła
    if (newAttemptCount === wordsInCurrentRound) {
      // Runda zakończona
      if (newQueue.length > 0) {
        // Tasujemy i rozpoczynamy nową rundę
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

  // Obliczamy, ile słówek trafionych za pierwszym razem
  const correctlyOnFirstTryCount = totalWords - incorrectlyAnswered.size;

  return (
    <View style={{flex: 1}}>
      {/* Nowy nagłówek (LearningHeader) z info o rundzie */}
      <LearningHeader
        attempted={attemptedThisRound}
        total={wordsInCurrentRound}
      />

      <View style={styles.container}>
        {isSessionComplete ? (
          <View style={{alignItems: 'center'}}>
            <Text style={styles.doneText}>Koniec nauki! 🎉</Text>
            <Text style={styles.doneText}>
              Trafiłeś {correctlyOnFirstTryCount} / {totalWords} słówek za
              pierwszym razem!
            </Text>

            {/* Przycisk "Spróbuj ponownie" */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={startNewSession}>
              <Text style={styles.buttonText}>Spróbuj ponownie</Text>
            </TouchableOpacity>

            {/* Przycisk powrotu do AllSets */}
            <TouchableOpacity
              style={[styles.backButton, {marginTop: 10}]}
              onPress={() => navigation.navigate('AllSets')}>
              <Text style={styles.buttonText}>Wróć do AllSets</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Tłumaczenie (np. polskie) */}
            <Text style={styles.translationText}>
              {currentWord?.translation}
            </Text>

            {/* Pole do wpisania odpowiedzi */}
            <TextInput
              style={styles.answerInput}
              placeholder="Wpisz odpowiedź w języku docelowym"
              value={userAnswer}
              onChangeText={setUserAnswer}
              editable={!answerSubmitted}
            />

            {/* Komunikat zwrotny (poprawna/niepoprawna) */}
            {feedback !== '' && (
              <Text style={styles.feedbackText}>{feedback}</Text>
            )}

            {/* Przyciski */}
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
