import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { countries } from '../data/countries';
// @ts-ignore
import _ from '../../underscore-esm-min';

import { FlagQuestion } from '../components/FlagQuestion';
import { OptionButton } from '../components/OptionButton';
import { FeedbackScreen } from '../components/FeedbackScreen';
import { useCronometro } from '../hooks/useCronometro';
import { API_URL } from '../config';

interface Country {
  name: string;
  code: string;
}

type GameStatus = 'question' | 'hit' | 'miss' | 'end' | 'saving';

const GameTimedScreen = ({ onRestart }: { onRestart: () => void }) => {
  const [points, setPoints] = useState<number>(0);
  const [status, setStatus] = useState<GameStatus>('question');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [chosenOption, setChosenOption] = useState<number>(-1);

  const router = useRouter();
  const { username } = useLocalSearchParams<{ username: string }>();

  const pointsRef = useRef(points);
  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  const handleTimeOut = useCallback(async () => {
    setStatus('saving');
    try {
      await fetch(`${API_URL}/timedscores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username || 'Jogador',
          score: pointsRef.current,
        }),
      });
    } catch (error) {
      console.error(error);
    }
    setStatus('end');
  }, [username]);

  const timeRemaining = useCronometro(30, handleTimeOut);

  const nextStep = () => {
    setStatus('question');
    setChosenOption(-1);
  };

  const confirmTry = () => {
    if (selectedCountry && options[chosenOption] && selectedCountry.name === options[chosenOption].name) {
      setPoints((p) => p + 1);
      setStatus('hit');
    } else {
      setStatus('miss');
    }
  };

  useEffect(() => {
    if (status === 'question') {
      const randomCountry = countries[Math.floor(Math.random() * countries.length)];
      setSelectedCountry(randomCountry);
    }
  }, [status]);

  useEffect(() => {
    if (selectedCountry) {
      let optionsArray = _.sample(countries, 3);
      optionsArray.push(selectedCountry);
      setOptions(_.shuffle(optionsArray));
    }
  }, [selectedCountry]);

  if (status === 'saving') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Salvando pontuação...</Text>
      </SafeAreaView>
    );
  }

  if (status !== 'question') {
    return (
      <FeedbackScreen
        status={status as any}
        username={username}
        points={points}
        onContinue={nextStep}
        onRestart={onRestart}
        onQuit={() => router.replace('/')}
      />
    );
  }

  if (!selectedCountry) return <Text>Carregando ...</Text>;

  const isLowTime = timeRemaining <= 5;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <AntDesign style={styles.buttonClose} name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text style={[styles.progress, isLowTime && { color: 'red', fontWeight: 'bold' }]}>
          Tempo: {timeRemaining}s
        </Text>
        <Text style={styles.score}>Pontos: {points}</Text>
      </View>
      
      <FlagQuestion 
        username={username || 'Jogador'}
        countryCode={selectedCountry.code}
      />

      <View style={styles.optionsContainer}>
        {options.map((option, idx) => (
          <OptionButton
            key={idx}
            label={option.name}
            isSelected={idx === chosenOption}
            onPress={() => setChosenOption(idx)}
          />
        ))}
      </View>

      <View style={styles.confirmContainer}>
        <Button
          title="Confirmar"
          color="green"
          disabled={chosenOption === -1}
          onPress={confirmTry}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    justifyContent: 'center',
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  buttonClose: {
    flex: 2,
  },
  progress: {
    flex: 4,
    textAlign: 'center',
    fontSize: 20,
  },
  score: {
    flex: 2,
    fontSize: 20,
  },
  optionsContainer: {
    flex: 4,
    justifyContent: 'space-evenly',
  },
  confirmContainer: {
    flex: 1,
    margin: 50,
  },
  loadingText: {
    fontSize: 24,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});

const GameTimedScreenWrapper = () => {
  const [key, setKey] = useState<number>(0);
  const handleRestart = () => setKey((k) => k + 1);

  return <GameTimedScreen key={key} onRestart={handleRestart} />;
};

export default GameTimedScreenWrapper;
