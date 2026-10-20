import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import PlacarTime from '../components/PlacarTime';
import type { RootStackParamList } from '../navigation/types';
import { salvarPartida } from '../services/storage';
import { EQUIPES, type Equipe, type Partida } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Placar'>;

const placarInicial: Record<Equipe, number> = { Grêmio: 0, Internacional: 0 };

export default function PlacarScreen({ navigation, route }: Props) {
  const { mandante } = route.params;
  const [gols, setGols] = useState<Record<Equipe, number>>(placarInicial);

  const adicionarGol = (equipe: Equipe) => {
    setGols((prev) => ({ ...prev, [equipe]: prev[equipe] + 1 }));
  };

  const finalizarPartida = () => {
    Alert.alert('Finalizar partida', 'Deseja encerrar e salvar o resultado?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Finalizar',
        onPress: async () => {
          const partida: Partida = {
            id: String(Date.now()),
            mandante,
            gols,
            finalizadaEm: new Date().toISOString(),
          };
          try {
            await salvarPartida(partida);
            Alert.alert('Partida salva', 'Resultado registrado no histórico.', [
              {
                text: 'OK',
                onPress: () => {
                  navigation.reset({ index: 0, routes: [{ name: 'Iniciar' }] });
                },
              },
            ]);
          } catch {
            Alert.alert('Erro', 'Não foi possível salvar a partida. Tente novamente.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mandante}>{mandante} (mandante)</Text>
      <Text style={styles.placar}>
        {gols['Grêmio']} a {gols['Internacional']}
      </Text>
      {EQUIPES.map((equipe) => (
        <PlacarTime
          key={equipe}
          equipe={equipe}
          gols={gols[equipe]}
          onAdicionarGol={() => adicionarGol(equipe)}
        />
      ))}
      <Pressable onPress={finalizarPartida} style={styles.botaoFinalizar}>
        <Text style={styles.botaoFinalizarTexto}>Finalizar partida</Text>
      </Pressable>
    </View>
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
  mandante: {
    fontSize: 18,
    color: '#555',
    marginBottom: 8,
  },
  placar: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  botaoFinalizar: {
    marginTop: 24,
    backgroundColor: '#B00020',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  botaoFinalizarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
