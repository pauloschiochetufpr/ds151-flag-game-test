import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const [username, setUsername] = useState<string>('');
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>BEM-VINDO</Text>
      <View style={styles.container_name}>
        <Text style={styles.labelName}>Digite seu nome</Text>
        <TextInput 
          style={styles.textInput}
          value={username}
          onChangeText={(t) => setUsername(t)}
        />
        <View style={styles.buttonContainer}>
          <Button 
            title="INICIAR MODO NORMAL"
            color="#008"
            disabled={username.trim() === ''}
            onPress={() => {
              router.push({
                pathname: '/game',
                params: { username: username.trim() }
              });
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button 
            title="INICIAR MODO TEMPORIZADO"
            color="#008"
            disabled={username.trim() === ''}
            onPress={() => {
              router.push({
                pathname: '/game-timed',
                params: { username: username.trim() }
              });
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button 
            title="VER PLACAR"
            color="#4A4A4A"
            onPress={() => {
              router.push({
                pathname: '/placar'
              });
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 50,
    color: '#004',
    fontFamily: 'monospace',
    textTransform: 'uppercase'
  },
  container_name: {
    justifyContent: 'center',
    width: '80%'
  },
  labelName: {
    fontSize: 30,
    fontFamily: 'monospace',
    textAlign: 'center'
  },
  textInput: {
    borderWidth: 2,
    marginVertical: 15,
    borderColor: '#008',
    borderRadius: 20,
    padding: 15,
    fontSize: 20,
    fontFamily: 'monospace',
    textAlign: 'center'
  },
  buttonContainer: {
    marginVertical: 8
  }
});

export default HomeScreen;

