import {useState, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useRegularity() {
  const [regularity, setRegularity] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadRegularity = async () => {
      try {
        const regString = await AsyncStorage.getItem('regularityStats');
        if (regString) {
          const reg = JSON.parse(regString);
          setRegularity(reg.count);
        } else {
          setRegularity(0);
        }
      } catch (error) {
        console.error('Error loading regularity stat', error);
      }
    };

    loadRegularity();
  }, [isFocused]);

  return regularity;
}
