import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';

import { carregarHistorico } from '../services/storage';
import type { Partida } from '../types';

type Estado = 'carregando' | 'erro' | 'dados';

export default function HistoricoScreen() {
  const [estado, setEstado] = useState<Estado>('carregando');
  const [partidas, setPartidas] = useState<Partida[]>([]);

  const carregar = useCallback(async () => {
    setEstado('carregando');
    try {
      const dados = await carregarHistorico();
      setPartidas(dados);
      setEstado('dados');
    } catch {
      setEstado('erro');
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const renderItem: ListRenderItem<Partida> = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemPlacar}>
        {item.gols['Grêmio']} a {item.gols['Internacional']}
      </Text>
      <Text style={styles.itemMandante}>Mandante: {item.mandante}</Text>
      <Text style={styles.itemData}>{new Date(item.finalizadaEm).toLocaleDateString('pt-BR')}</Text>
    </View>
  );

  if (estado === 'carregando') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#006633" />
        <Text style={styles.mensagem}>Carregando histórico...</Text>
      </View>
    );
  }

  if (estado === 'erro') {
    return (
      <View style={styles.container}>
        <Text style={styles.erro}>Não foi possível carregar o histórico.</Text>
        <Pressable onPress={() => void carregar()} style={styles.botao}>
          <Text style={styles.botaoTexto}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.lista}
      data={partidas}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={partidas.length === 0 ? styles.listaVazia : styles.listaComDados}
      ListEmptyComponent={
        <Text style={styles.vazio}>Nenhuma partida registrada ainda.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  lista: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listaVazia: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  listaComDados: {
    padding: 16,
  },
  mensagem: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  erro: {
    fontSize: 16,
    color: '#B00020',
    textAlign: 'center',
    marginBottom: 16,
  },
  vazio: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  item: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  itemPlacar: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  itemMandante: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  itemData: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  botao: {
    backgroundColor: '#006633',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
