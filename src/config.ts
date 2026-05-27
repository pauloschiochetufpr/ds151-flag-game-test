import Constants from 'expo-constants';
import { Platform } from 'react-native';

const obterUrlApi = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:3000';
  }
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const enderecoIp = hostUri.split(':')[0];
    return `http://${enderecoIp}:3000`;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  return 'http://localhost:3000';
};

export const URL_API = obterUrlApi();
export const API_URL = URL_API;

