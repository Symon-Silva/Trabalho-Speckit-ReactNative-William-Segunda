import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import Botao from '../components/Botao';
import EscudoTime from '../components/EscudoTime';
import { carregarHistorico, excluirPartida } from '../services/storage';
import { Pressable } from 'react-native';
import Dialogo from '../components/Dialogo';
import { cores, espacamentos, raios, sombra, tipografia } from '../theme';
import { ID_PADRAO_GREMIO, ID_PADRAO_INTERNACIONAL, type Partida, type PartidaParticipante } from '../types';

type Estado = 'carregando' | 'erro' | 'dados';

function idParaEscudoPadrao(nome: string): string | undefined {
  if (nome === 'Grêmio') {
    return ID_PADRAO_GREMIO;
  }
  if (nome === 'Internacional') {
    return ID_PADRAO_INTERNACIONAL;
  }
  return undefined;
}

function LinhaTime({ participante, gols }: { participante: PartidaParticipante; gols: number }) {
  return (
    <View style={styles.timeLinha}>
      <EscudoTime
        nome={participante.nome}
        escudoUrl={participante.escudoUrl}
        id={idParaEscudoPadrao(participante.nome)}
        tamanho={28}
      />
      <Text style={styles.timeNome} numberOfLines={1}>
        {participante.nome}
      </Text>
      <Text style={styles.timeGols}>{gols}</Text>
    </View>
  );
}

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

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar]),
  );

  const renderItem: ListRenderItem<Partida> = ({ item }) => {
    const [casa, fora] = item.participantes;
    return (
      <View style={styles.item}>
        <Text style={styles.itemData}>
          {new Date(item.finalizadaEm).toLocaleDateString('pt-BR')}
        </Text>
        <LinhaTime participante={casa} gols={item.gols[casa.id] ?? 0} />
        <View style={styles.divisor} />
        <LinhaTime participante={fora} gols={item.gols[fora.id] ?? 0} />
      </View>
    );
  };

  if (estado === 'carregando') {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.centralizado}>
          <ActivityIndicator size="large" color={cores.primaria} />
          <Text style={styles.mensagem}>Carregando histórico...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (estado === 'erro') {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.centralizado}>
          <View style={styles.erroIcone}>
            <Text style={styles.erroIconeTexto}>!</Text>
          </View>
          <Text style={styles.erroTitulo}>Não foi possível carregar o histórico</Text>
          <Text style={styles.erroTexto}>Verifique o armazenamento do aparelho e tente novamente.</Text>
          <View style={styles.erroAcao}>
            <Botao titulo="Tentar novamente" aoPressionar={() => void carregar()} variante="contorno" />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={partidas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={partidas.length === 0 ? styles.listaVazia : styles.listaComDados}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <View style={styles.vazioIcone}>
              <Text style={styles.vazioIconeTexto}>0</Text>
            </View>
            <Text style={styles.vazioTitulo}>Nenhuma partida registrada</Text>
            <Text style={styles.vazioTexto}>Finalize uma partida para ver o resultado aqui.</Text>
          </View>
        }
      />
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
  mensagem: {
    ...tipografia.subtitulo,
    marginTop: espacamentos.md,
  },
  listaVazia: {
    flexGrow: 1,
  },
  listaComDados: {
    padding: espacamentos.lg,
  },
  vazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espacamentos.xl,
  },
  vazioIcone: {
    width: 72,
    height: 72,
    borderRadius: raios.pill,
    backgroundColor: cores.primariaClara,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espacamentos.lg,
  },
  vazioIconeTexto: {
    fontSize: 30,
    fontWeight: '800',
    color: cores.primariaEscura,
  },
  vazioTitulo: {
    ...tipografia.titulo,
    textAlign: 'center',
    marginBottom: espacamentos.xs,
  },
  vazioTexto: {
    ...tipografia.subtitulo,
    textAlign: 'center',
  },
  erroIcone: {
    width: 56,
    height: 56,
    borderRadius: raios.pill,
    backgroundColor: cores.destaqueClaro,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espacamentos.lg,
  },
  erroIconeTexto: {
    fontSize: 28,
    fontWeight: '800',
    color: cores.destaque,
  },
  erroTitulo: {
    ...tipografia.titulo,
    textAlign: 'center',
    marginBottom: espacamentos.sm,
  },
  erroTexto: {
    ...tipografia.subtitulo,
    textAlign: 'center',
  },
  erroAcao: {
    marginTop: espacamentos.xl,
  },
  item: {
    backgroundColor: cores.superficie,
    borderRadius: raios.md,
    padding: espacamentos.lg,
    marginBottom: espacamentos.md,
    ...sombra.baixa,
  },
  itemData: {
    ...tipografia.legenda,
    marginBottom: espacamentos.sm,
  },
  timeLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeNome: {
    ...tipografia.corpo,
    flex: 1,
    marginLeft: espacamentos.md,
    marginRight: espacamentos.md,
  },
  timeGols: {
    fontSize: 20,
    fontWeight: '800',
    color: cores.texto,
    minWidth: 24,
    textAlign: 'right',
  },
  divisor: {
    height: 1,
    backgroundColor: cores.borda,
    marginVertical: espacamentos.sm,
    marginLeft: 28 + espacamentos.md,
  },
});
