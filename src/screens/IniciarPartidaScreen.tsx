import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Botao from '../components/Botao';
import EscudoTime from '../components/EscudoTime';
import type { RootStackParamList } from '../navigation/types';
import { carregarTimes } from '../services/storage';
import { cores, espacamentos, raios, sombra, tipografia } from '../theme';
import type { PartidaParticipante, Time } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Iniciar'>;
type Estado = 'carregando' | 'erro' | 'dados';

function comoParticipante(time: Time): PartidaParticipante {
  return { id: time.id, nome: time.nome, escudoUrl: time.escudoUrl };
}

export default function IniciarPartidaScreen({ navigation }: Props) {
  const [estado, setEstado] = useState<Estado>('carregando');
  const [times, setTimes] = useState<Time[]>([]);
  const [mandante, setMandante] = useState<Time | null>(null);
  const [visitante, setVisitante] = useState<Time | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setEstado('carregando');
    try {
      const dados = await carregarTimes();
      setTimes(dados);
      setEstado('dados');
    } catch {
      setEstado('erro');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar]),
  );

  const selecionar = (time: Time, papel: 'mandante' | 'visitante') => {
    setErro(null);
    if (papel === 'mandante') {
      if (visitante?.id === time.id) {
        setVisitante(null);
      }
      setMandante(time);
      return;
    }
    if (mandante?.id === time.id) {
      setMandante(null);
    }
    setVisitante(time);
  };

  const iniciarPartida = () => {
    if (mandante === null || visitante === null) {
      setErro('Escolha o time mandante e o visitante para continuar.');
      return;
    }
    if (mandante.id === visitante.id) {
      setErro('Escolha dois times diferentes para a partida.');
      return;
    }
    navigation.replace('Placar', {
      participantes: [comoParticipante(mandante), comoParticipante(visitante)],
    });
  };

  if (estado === 'carregando') {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.centralizado}>
          <ActivityIndicator size="large" color={cores.primaria} />
          <Text style={styles.mensagem}>Carregando times...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (estado === 'erro') {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.centralizado}>
          <Text style={styles.erroTitulo}>Não foi possível carregar os times</Text>
          <Text style={styles.mensagem}>Verifique o armazenamento do aparelho e tente novamente.</Text>
          <View style={styles.erroAcao}>
            <Botao titulo="Tentar novamente" aoPressionar={() => void carregar()} variante="contorno" />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <View style={styles.cabecalho}>
          <View style={styles.brasao}>
            <Text style={styles.brasaoTexto}>GN</Text>
          </View>
          <Text style={styles.titulo}>Placar de partidas</Text>
          <Text style={styles.subtitulo}>Escolha mandante e visitante para começar.</Text>
        </View>

        <View style={styles.cartao}>
          <Text style={styles.cartaoRotulo}>Times disponíveis</Text>
          {times.map((time) => {
            const ehMandante = mandante?.id === time.id;
            const ehVisitante = visitante?.id === time.id;
            return (
              <View key={time.id} style={styles.linha}>
                <EscudoTime nome={time.nome} escudoUrl={time.escudoUrl} id={time.id} tamanho={40} />
                <Text style={styles.linhaNome} numberOfLines={1}>
                  {time.nome}
                </Text>
                <Pressable
                  onPress={() => selecionar(time, 'mandante')}
                  accessibilityRole="button"
                  accessibilityState={{ selected: ehMandante }}
                  accessibilityLabel={`Marcar ${time.nome} como mandante`}
                  style={[styles.chip, ehMandante && styles.chipAtivo]}
                >
                  <Text style={[styles.chipTexto, ehMandante && styles.chipTextoAtivo]}>Casa</Text>
                </Pressable>
                <Pressable
                  onPress={() => selecionar(time, 'visitante')}
                  accessibilityRole="button"
                  accessibilityState={{ selected: ehVisitante }}
                  accessibilityLabel={`Marcar ${time.nome} como visitante`}
                  style={[styles.chip, ehVisitante && styles.chipAtivo]}
                >
                  <Text style={[styles.chipTexto, ehVisitante && styles.chipTextoAtivo]}>Fora</Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        <View style={styles.confronto}>
          <View style={styles.confrontoLado}>
            <Text style={styles.confrontoRotulo}>Mandante</Text>
            <Text style={styles.confrontoNome} numberOfLines={1}>
              {mandante?.nome ?? '—'}
            </Text>
          </View>
          <Text style={styles.confrontoX}>x</Text>
          <View style={styles.confrontoLado}>
            <Text style={styles.confrontoRotulo}>Visitante</Text>
            <Text style={styles.confrontoNome} numberOfLines={1}>
              {visitante?.nome ?? '—'}
            </Text>
          </View>
        </View>

        {erro !== null ? (
          <View style={styles.caixaErro}>
            <Text style={styles.caixaErroTitulo}>Não foi possível iniciar</Text>
            <Text style={styles.caixaErroTexto}>{erro}</Text>
          </View>
        ) : null}

        <View style={styles.acoes}>
          <Botao titulo="Iniciar partida" aoPressionar={iniciarPartida} largo />
          <Botao
            titulo="Meus Times"
            aoPressionar={() => navigation.navigate('MeusTimes')}
            variante="contorno"
            largo
          />
          <Botao
            titulo="Ver histórico"
            aoPressionar={() => navigation.navigate('Historico')}
            variante="suave"
            largo
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  centralizado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espacamentos.xl,
  },
  conteudo: {
    flexGrow: 1,
    padding: espacamentos.xl,
    paddingBottom: espacamentos.xxl,
  },
  mensagem: {
    ...tipografia.subtitulo,
    marginTop: espacamentos.md,
    textAlign: 'center',
  },
  erroTitulo: {
    ...tipografia.titulo,
    textAlign: 'center',
    marginBottom: espacamentos.sm,
  },
  erroAcao: {
    marginTop: espacamentos.xl,
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: espacamentos.xl,
  },
  brasao: {
    width: 64,
    height: 64,
    borderRadius: raios.pill,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espacamentos.lg,
    ...sombra.cartao,
  },
  brasaoTexto: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
    color: cores.textoInvertido,
  },
  titulo: {
    ...tipografia.exibicao,
    textAlign: 'center',
  },
  subtitulo: {
    ...tipografia.subtitulo,
    textAlign: 'center',
    marginTop: espacamentos.xs,
  },
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raios.lg,
    padding: espacamentos.lg,
    marginBottom: espacamentos.lg,
    ...sombra.cartao,
  },
  cartaoRotulo: {
    ...tipografia.rotulo,
    marginBottom: espacamentos.md,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: cores.borda,
    borderRadius: raios.md,
    padding: espacamentos.sm,
    marginBottom: espacamentos.sm,
  },
  linhaNome: {
    ...tipografia.corpo,
    flex: 1,
    marginLeft: espacamentos.md,
    marginRight: espacamentos.sm,
  },
  chip: {
    borderWidth: 2,
    borderColor: cores.bordaForte,
    borderRadius: raios.pill,
    paddingVertical: espacamentos.xs,
    paddingHorizontal: espacamentos.md,
    marginLeft: espacamentos.xs,
  },
  chipAtivo: {
    borderColor: cores.primaria,
    backgroundColor: cores.primariaClara,
  },
  chipTexto: {
    fontSize: 12,
    fontWeight: '800',
    color: cores.textoSuave,
  },
  chipTextoAtivo: {
    color: cores.primariaEscura,
  },
  confronto: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.superficie,
    borderRadius: raios.lg,
    padding: espacamentos.lg,
    marginBottom: espacamentos.lg,
    ...sombra.baixa,
  },
  confrontoLado: {
    flex: 1,
    alignItems: 'center',
  },
  confrontoRotulo: {
    ...tipografia.rotulo,
    marginBottom: espacamentos.xs,
  },
  confrontoNome: {
    ...tipografia.titulo,
    fontSize: 18,
    textAlign: 'center',
  },
  confrontoX: {
    fontSize: 20,
    fontWeight: '800',
    color: cores.bordaForte,
    paddingHorizontal: espacamentos.md,
  },
  caixaErro: {
    backgroundColor: cores.destaqueClaro,
    borderLeftWidth: 4,
    borderLeftColor: cores.destaque,
    borderRadius: raios.sm,
    padding: espacamentos.md,
    marginBottom: espacamentos.lg,
  },
  caixaErroTitulo: {
    ...tipografia.corpo,
    color: cores.destaque,
    marginBottom: espacamentos.xs,
  },
  caixaErroTexto: {
    ...tipografia.legenda,
    color: cores.destaque,
  },
  acoes: {
    gap: espacamentos.md,
  },
});
