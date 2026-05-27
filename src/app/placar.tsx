import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Button 
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { URL_API } from '../config';

interface ScoreEntry {
  id: string | number;
  name: string;
  score: number;
}

type TabType = 'normal' | 'timed';

export default function PlacarScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('normal');
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const fetchScores = async (tab: TabType) => {
    setLoading(true);
    setError(null);
    const endpoint = tab === 'normal' ? 'scores' : 'timedscores';
    try {
      const response = await fetch(`${URL_API}/${endpoint}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do servidor');
      }
      const data: ScoreEntry[] = await response.json();
      const sortedData = data.sort((a, b) => b.score - a.score);
      setScores(sortedData);
    } catch (err: any) {
      setError(err.message || 'Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores(activeTab);
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}>
          <Text style={styles.backButtonText}>VOLTAR</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Placar</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={activeTab === 'normal' ? styles.tabActive : styles.tabInactive}
          onPress={() => setActiveTab('normal')}
        >
          <Text style={activeTab === 'normal' ? styles.tabActiveText : styles.tabInactiveText}>
            Normal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={activeTab === 'timed' ? styles.tabActive : styles.tabInactive}
          onPress={() => setActiveTab('timed')}
        >
          <Text style={activeTab === 'timed' ? styles.tabActiveText : styles.tabInactiveText}>
            Temporizado
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#008" />
          <Text style={styles.stateText}>Carregando pontuações...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={[styles.stateText, { color: 'red', marginBottom: 10 }]}>{error}</Text>
          <Button title="Tentar Novamente" onPress={() => fetchScores(activeTab)} />
        </View>
      ) : (
        <FlatList
          data={scores}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma pontuação encontrada.</Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <View style={styles.leftContainer}>
                <Text style={styles.positionText}>{index + 1}º</Text>
                <Text style={styles.playerName} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>
              <Text style={styles.playerScore}>
                {item.score} pts
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 20,
    color: '#000',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabActive: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 8,
  },
  tabInactive: {
    paddingHorizontal: 25,
    paddingVertical: 8,
  },
  tabActiveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabInactiveText: {
    color: '#555',
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  stateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  listContent: {
    paddingHorizontal: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  positionText: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 40,
    color: '#000',
  },
  playerName: {
    fontSize: 18,
    color: '#000',
    flex: 1,
  },
  playerScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
