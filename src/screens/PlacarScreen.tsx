import { Fragment, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Botao from '../components/Botao';
import Dialogo, { type BotaoDialogo } from '../components/Dialogo';
import PlacarTime from '../components/PlacarTime';
import type { RootStackParamList } from '../navigation/types';
import { salvarPartida } from '../services/storage';
import { cores, espacamentos, raios, sombra, tipografia } from '../theme';
import type { Partida } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Placar'>;

interface DialogoEstado {
  titulo: string;
  mensagem?: string;
  botoes: BotaoDialogo[];
}

export default function PlacarScreen({ navigation, route }: Props) {
  const { participantes } = route.params;
  const [gols, setGols] = useState<Record<string, number>>({
    [participantes[0].id]: 0,
    [participantes[1].id]: 0,
  });
  const [dialogo, setDialogo] = useState<DialogoEstado | null>(null);

  const adicionarGol = (id: string) => {
    setGols((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  const salvarResultado = async () => {
    const partida: Partida = {
      id: String(Date.now()),
      participantes,
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
        { texto: 'Cancelar', variante: 'contorno' },
        { texto: 'Finalizar', aoPressionar: () => void salvarResultado() },
      ],
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <View style={styles.mandanteCartao}>
          <Text style={styles.mandanteRotulo}>Confronto</Text>
          <Text style={styles.mandante} numberOfLines={1}>
            {participantes[0].nome} x {participantes[1].nome}
          </Text>
        </View>

        <View style={styles.placarCartao}>
          <View style={styles.placar}>
            {participantes.map((participante, indice) => (
              <Fragment key={participante.id}>
                {indice > 0 ? (
                  <View style={styles.separador}>
                    <Text style={styles.separadorTexto}>a</Text>
                  </View>
                ) : null}
                <PlacarTime
                  participante={participante}
                  gols={gols[participante.id] ?? 0}
                  onAdicionarGol={() => adicionarGol(participante.id)}
                />
              </Fragment>
            ))}
          </View>
        </View>

        <View style={styles.acoes}>
          <Botao titulo="Finalizar partida" aoPressionar={finalizarPartida} largo />
        </View>
      </ScrollView>

      <Dialogo
        visivel={dialogo !== null}
        titulo={dialogo?.titulo ?? ''}
        mensagem={dialogo?.mensagem}
        botoes={dialogo?.botoes ?? []}
        aoFechar={() => setDialogo(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    flexGrow: 1,
    padding: espacamentos.xl,
    paddingBottom: espacamentos.xxl,
  },
  mandanteCartao: {
    alignItems: 'center',
    backgroundColor: cores.superficie,
    borderRadius: raios.lg,
    paddingVertical: espacamentos.lg,
    paddingHorizontal: espacamentos.lg,
    marginBottom: espacamentos.lg,
    ...sombra.baixa,
  },
  mandanteRotulo: {
    ...tipografia.rotulo,
    marginBottom: espacamentos.xs,
  },
  mandante: {
    ...tipografia.titulo,
    textAlign: 'center',
  },
  placarCartao: {
    backgroundColor: cores.superficie,
    borderRadius: raios.lg,
    paddingVertical: espacamentos.xl,
    paddingHorizontal: espacamentos.lg,
    marginBottom: espacamentos.xl,
    ...sombra.cartao,
  },
  placar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separador: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: espacamentos.md,
  },
  separadorTexto: {
    fontSize: 20,
    fontWeight: '700',
    color: cores.bordaForte,
  },
  acoes: {
    gap: espacamentos.md,
  },
});
