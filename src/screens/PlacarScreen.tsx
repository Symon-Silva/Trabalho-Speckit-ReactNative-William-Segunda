
import { Fragment, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Botao from '../components/Botao';
import Dialogo, { type BotaoDialogo } from '../components/Dialogo';
import PlacarTime from '../components/PlacarTime';
import type { RootStackParamList } from '../navigation/types';
import { salvarPartida } from '../services/storage';
import { cores, espacamentos, raios, sombra, tipografia } from '../theme';
import type { EventoGol, Partida } from '../types';

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
  const [eventosGols, setEventosGols] = useState<EventoGol[]>([]);
  const [minuto, setMinuto] = useState(1);
  const [simulacaoEncerrada, setSimulacaoEncerrada] = useState(false);
  const [dialogo, setDialogo] = useState<DialogoEstado | null>(null);

  const minutoRef = useRef(1);
  const encerradaRef = useRef(false);
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervaloRef.current = setInterval(() => {
      if (encerradaRef.current) {
        return;
      }

      const proximoMinuto = minutoRef.current + 1;
      minutoRef.current = proximoMinuto;
      setMinuto(proximoMinuto);

      if (Math.random() < 0.05) {
        const participante =
          participantes[Math.floor(Math.random() * participantes.length)];

        setGols((anteriores) => ({
          ...anteriores,
          [participante.id]: (anteriores[participante.id] ?? 0) + 1,
        }));

        setEventosGols((anteriores) => [
          ...anteriores,
          {
            participanteId: participante.id,
            minuto: proximoMinuto,
          },
        ]);
      }

      if (proximoMinuto >= 90) {
        encerradaRef.current = true;
        setSimulacaoEncerrada(true);

        if (intervaloRef.current !== null) {
          clearInterval(intervaloRef.current);
          intervaloRef.current = null;
        }
      }
    }, 1000);

    return () => {
      if (intervaloRef.current !== null) {
        clearInterval(intervaloRef.current);
        intervaloRef.current = null;
      }
    };
  }, [participantes]);

  const adicionarGol = (id: string) => {
    if (encerradaRef.current) {
      return;
    }

    setGols((anteriores) => ({
      ...anteriores,
      [id]: (anteriores[id] ?? 0) + 1,
    }));

    setEventosGols((anteriores) => [
      ...anteriores,
      {
        participanteId: id,
        minuto: minutoRef.current,
      },
    ]);
  };

  const salvarResultado = async () => {
    encerradaRef.current = true;

    if (intervaloRef.current !== null) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }

    const partida: Partida = {
      id: String(Date.now()),
      participantes,
      gols,
      eventosGols,
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
              navigation.reset({
                index: 0,
                routes: [{ name: 'Iniciar' }],
              });
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
      mensagem: simulacaoEncerrada
        ? 'A partida chegou ao minuto 90. Deseja salvar o resultado?'
        : 'Deseja encerrar a partida agora e salvar o resultado?',
      botoes: [
        { texto: 'Cancelar', variante: 'contorno' },
        { texto: 'Finalizar', aoPressionar: () => void salvarResultado() },
      ],
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mandanteCartao}>
          <Text style={styles.mandanteRotulo}>Confronto</Text>
          <Text style={styles.mandante} numberOfLines={1}>
            {participantes[0].nome} x {participantes[1].nome}
          </Text>

          <Text style={styles.relogio}>
            {simulacaoEncerrada ? 'FIM DE JOGO' : `${minuto}'`}
          </Text>
        </View>

        <View style={styles.placarCartao}>
          <View style={styles.placar}>
            {participantes.map((participante, indice) => (
              <Fragment key={participante.id}>
                {indice > 0 ? (
                  <View style={styles.separador}>
                    <Text style={styles.separadorTexto}>X</Text>
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

        <View style={styles.eventosCartao}>
          <Text style={styles.eventosTitulo}>Gols da partida</Text>

          {eventosGols.length === 0 ? (
            <Text style={styles.eventosVazio}>Nenhum gol marcado ainda.</Text>
          ) : (
            [...eventosGols].reverse().map((evento, indice) => {
              const participante = participantes.find(
                (item) => item.id === evento.participanteId,
              );

              return (
                <Text
                  key={`${evento.participanteId}-${evento.minuto}-${indice}`}
                  style={styles.eventoGol}
                >
                  ⚽ {evento.minuto}{'′'} — {participante?.nome ?? 'Time'}
                </Text>
              );
            })
          )}
        </View>

        {simulacaoEncerrada ? (
          <Text style={styles.fimTexto}>
            A simulação terminou. Salve o resultado para registrá-lo no histórico.
          </Text>
        ) : (
          <Text style={styles.ajudaTexto}>
            A partida avança automaticamente. Tu também pode adicionar gols
            manualmente pelos botões dos times.
          </Text>
        )}

        <View style={styles.acoes}>
          <Botao
            titulo={simulacaoEncerrada ? 'Salvar resultado' : 'Finalizar partida'}
            aoPressionar={finalizarPartida}
            largo
          />
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
  relogio: {
    fontSize: 32,
    fontWeight: '800',
    color: cores.primaria,
    marginTop: espacamentos.md,
  },
  placarCartao: {
    backgroundColor: cores.superficie,
    borderRadius: raios.lg,
    paddingVertical: espacamentos.xl,
    paddingHorizontal: espacamentos.lg,
    marginBottom: espacamentos.lg,
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
  eventosCartao: {
    backgroundColor: cores.superficie,
    borderRadius: raios.lg,
    padding: espacamentos.lg,
    marginBottom: espacamentos.lg,
    ...sombra.baixa,
  },
  eventosTitulo: {
    ...tipografia.subtitulo,
    fontWeight: '800',
    marginBottom: espacamentos.sm,
  },
eventosVazio: {
  ...tipografia.corpo,
  color: cores.texto,
},
  eventoGol: {
    ...tipografia.corpo,
    marginVertical: espacamentos.xs,
  },
  ajudaTexto: {
    ...tipografia.corpo,
    textAlign: 'center',
    marginBottom: espacamentos.lg,
  },
  fimTexto: {
    ...tipografia.corpo,
    textAlign: 'center',
    marginBottom: espacamentos.lg,
    fontWeight: '700',
  },
  acoes: {
    gap: espacamentos.md,
  },
});
