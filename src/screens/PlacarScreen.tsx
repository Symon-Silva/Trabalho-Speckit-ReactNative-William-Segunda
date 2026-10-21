import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Dialogo, { type BotaoDialogo } from '../components/Dialogo';
import PlacarTime from '../components/PlacarTime';
import type { RootStackParamList } from '../navigation/types';
import { salvarPartida } from '../services/storage';
import { EQUIPES, type Equipe, type Partida } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Placar'>;

const placarInicial: Record<Equipe, number> = { Grêmio: 0, Internacional: 0 };

interface DialogoEstado {
  titulo: string;
  mensagem?: string;
  botoes: BotaoDialogo[];
}

export default function PlacarScreen({ navigation, route }: Props) {
  const { mandante } = route.params;
  const [gols, setGols] = useState<Record<Equipe, number>>(placarInicial);
  const [dialogo, setDialogo] = useState<DialogoEstado | null>(null);

  const adicionarGol = (equipe: Equipe) => {
    setGols((prev) => ({ ...prev, [equipe]: prev[equipe] + 1 }));
  };

  const salvarResultado = async () => {
    const partida: Partida = {
      id: String(Date.now()),
      mandante,
      gols,
      finalizadaEm: new Date().toISOString(),
    };
    try {
      await salvarPartida(partida);
      setDialogo({
        titulo: 'Partida salva',
        mensagem: 'Resultado registrado no histórico.',
        botoes: [
          {
            texto: 'OK',
            aoPressionar: () => {
              navigation.reset({ index: 0, routes: [{ name: 'Iniciar' }] });
            },
          },
        ],
      });
    } catch {
      setDialogo({
        titulo: 'Erro',
        mensagem: 'Não foi possível salvar a partida. Tente novamente.',
        botoes: [{ texto: 'OK' }],
      });
    }
  };

  const finalizarPartida = () => {
    setDialogo({
      titulo: 'Finalizar partida',
      mensagem: 'Deseja encerrar e salvar o resultado?',
      botoes: [
        { texto: 'Cancelar', variante: 'secundario' },
        { texto: 'Finalizar', aoPressionar: () => void salvarResultado() },
      ],
    });
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

      <Dialogo
        visivel={dialogo !== null}
        titulo={dialogo?.titulo ?? ''}
        mensagem={dialogo?.mensagem}
        botoes={dialogo?.botoes ?? []}
        aoFechar={() => setDialogo(null)}
      />
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
