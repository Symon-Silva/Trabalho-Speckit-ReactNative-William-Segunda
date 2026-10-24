import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Botao from '../components/Botao';
import Dialogo, { type BotaoDialogo } from '../components/Dialogo';
import EscudoTime from '../components/EscudoTime';
import type { RootStackParamList } from '../navigation/types';
import { carregarTimes, excluirTime } from '../services/storage';
import { cores, espacamentos, raios, sombra, tipografia } from '../theme';
import type { Time } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'MeusTimes'>;
type Estado = 'carregando' | 'erro' | 'dados';

interface DialogoEstado {
  titulo: string;
  mensagem?: string;
  botoes: BotaoDialogo[];
}

export default function MeusTimesScreen({ navigation }: Props) {
  const [estado, setEstado] = useState<Estado>('carregando');
  const [times, setTimes] = useState<Time[]>([]);
  const [dialogo, setDialogo] = useState<DialogoEstado | null>(null);

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

  const confirmarExclusao = (time: Time) => {
    setDialogo({
      titulo: 'Excluir time',
      mensagem: `Remover "${time.nome}" das próximas partidas? O histórico não será alterado.`,
      botoes: [
        { texto: 'Cancelar', variante: 'contorno' },
        {
          texto: 'Excluir',
          aoPressionar: () => {
            void (async () => {
              try {
                await excluirTime(time.id);
                await carregar();
              } catch {
                setDialogo({
                  titulo: 'Erro',
                  mensagem: 'Não foi possível excluir o time. Tente novamente.',
                  botoes: [{ texto: 'OK' }],
                });
              }
            })();
          },
        },
      ],
    });
  };

  const renderItem: ListRenderItem<Time> = ({ item }) => (
    <View style={styles.item}>
      <EscudoTime nome={item.nome} escudoUrl={item.escudoUrl} id={item.id} tamanho={44} />

      <View style={styles.itemInfo}>
        <Text style={styles.itemNome} numberOfLines={1}>
          {item.nome}
        </Text>
        <Text style={styles.itemTipo}>{item.padrao ? 'Time padrão' : 'Time personalizado'}</Text>
      </View>

      {item.padrao ? (
        <Text style={styles.bloqueado}>Padrão</Text>
      ) : (
        <View style={styles.itemAcoes}>
          <Pressable
            onPress={() => navigation.navigate('FormularioTime', { timeId: item.id })}
            accessibilityRole="button"
            accessibilityLabel={`Editar ${item.nome}`}
            style={({ pressed }) => [styles.acao, pressed && styles.acaoPressionada]}
          >
            <Text style={styles.acaoTexto}>Editar</Text>
          </Pressable>
          <Pressable
            onPress={() => confirmarExclusao(item)}
            accessibilityRole="button"
            accessibilityLabel={`Excluir ${item.nome}`}
            style={({ pressed }) => [styles.acao, styles.acaoExcluir, pressed && styles.acaoPressionada]}
          >
            <Text style={[styles.acaoTexto, styles.acaoTextoExcluir]}>Excluir</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

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
        data={times}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <View style={styles.acoes}>
            <Botao
              titulo="Cadastrar time"
              aoPressionar={() => navigation.navigate('FormularioTime', {})}
              largo
            />
          </View>
        }
      />

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
  erroTitulo: {
    ...tipografia.titulo,
    textAlign: 'center',
  },
  erroAcao: {
    marginTop: espacamentos.xl,
  },
  lista: {
    padding: espacamentos.lg,
  },
  acoes: {
    marginBottom: espacamentos.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.superficie,
    borderRadius: raios.md,
    padding: espacamentos.md,
    marginBottom: espacamentos.md,
    ...sombra.baixa,
  },
  itemInfo: {
    flex: 1,
    marginHorizontal: espacamentos.md,
  },
  itemNome: {
    ...tipografia.corpo,
    marginBottom: 2,
  },
  itemTipo: {
    ...tipografia.legenda,
  },
  bloqueado: {
    ...tipografia.legenda,
    color: cores.textoSuave,
    fontStyle: 'italic',
  },
  itemAcoes: {
    flexDirection: 'row',
    gap: espacamentos.sm,
  },
  acao: {
    borderWidth: 2,
    borderColor: cores.primaria,
    borderRadius: raios.pill,
    paddingVertical: espacamentos.xs,
    paddingHorizontal: espacamentos.md,
  },
  acaoExcluir: {
    borderColor: cores.destaque,
  },
  acaoPressionada: {
    opacity: 0.7,
  },
  acaoTexto: {
    fontSize: 12,
    fontWeight: '800',
    color: cores.primaria,
  },
  acaoTextoExcluir: {
    color: cores.destaque,
  },
});
