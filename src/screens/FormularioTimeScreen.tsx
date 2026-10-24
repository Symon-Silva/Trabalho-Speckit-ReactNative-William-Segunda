import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Botao from '../components/Botao';
import type { RootStackParamList } from '../navigation/types';
import { carregarTimes, salvarTime, validarTime } from '../services/storage';
import { cores, espacamentos, raios, sombra, tipografia } from '../theme';
import type { Time } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'FormularioTime'>;

function gerarId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export default function FormularioTimeScreen({ navigation, route }: Props) {
  const timeId = route.params?.timeId;
  const editando = typeof timeId === 'string';

  const [nome, setNome] = useState('');
  const [escudoUrl, setEscudoUrl] = useState('');
  const [erroNome, setErroNome] = useState<string | null>(null);
  const [erroEscudo, setErroEscudo] = useState<string | null>(null);
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [carregado, setCarregado] = useState(!editando);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!editando || carregado) {
      return;
    }
    let ativo = true;
    void (async () => {
      try {
        const times = await carregarTimes();
        const alvo = times.find((time) => time.id === timeId);
        if (!ativo) {
          return;
        }
        if (alvo) {
          setNome(alvo.nome);
          setEscudoUrl(alvo.escudoUrl ?? '');
        } else {
          setErroGeral('Time não encontrado.');
        }
      } catch {
        if (ativo) {
          setErroGeral('Não foi possível carregar o time.');
        }
      } finally {
        if (ativo) {
          setCarregado(true);
        }
      }
    })();
    return () => {
      ativo = false;
    };
  }, [editando, carregado, timeId]);

  const salvar = async () => {
    setErroNome(null);
    setErroEscudo(null);
    setErroGeral(null);
    setSalvando(true);
    try {
      const times = await carregarTimes();
      const resultado = validarTime(nome, escudoUrl, times, editando ? timeId : undefined);
      if (!resultado.valido) {
        setErroNome(resultado.erroNome ?? null);
        setErroEscudo(resultado.erroEscudoUrl ?? null);
        return;
      }
      const link = escudoUrl.trim();
      const time: Time =
        editando
          ? { id: timeId, nome: nome.trim(), escudoUrl: link.length > 0 ? link : null, padrao: false }
          : { id: gerarId(), nome: nome.trim(), escudoUrl: link.length > 0 ? link : null, padrao: false };
      await salvarTime(time);
      navigation.goBack();
    } catch {
      setErroGeral('Não foi possível salvar o time. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <Text style={styles.rotulo}>Nome do time *</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder="Ex.: Aimoré"
          placeholderTextColor={cores.textoSuave}
          style={[styles.campo, erroNome !== null && styles.campoErro]}
          autoCapitalize="words"
          maxLength={60}
        />
        {erroNome !== null ? <Text style={styles.erroCampo}>{erroNome}</Text> : null}

        <Text style={styles.rotulo}>Link do escudo (opcional)</Text>
        <TextInput
          value={escudoUrl}
          onChangeText={setEscudoUrl}
          placeholder="https://..."
          placeholderTextColor={cores.textoSuave}
          style={[styles.campo, erroEscudo !== null && styles.campoErro]}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
        {erroEscudo !== null ? <Text style={styles.erroCampo}>{erroEscudo}</Text> : null}

        {erroGeral !== null ? (
          <View style={styles.caixaErro}>
            <Text style={styles.caixaErroTexto}>{erroGeral}</Text>
          </View>
        ) : null}

        <View style={styles.acoes}>
          <Botao
            titulo={salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Cadastrar time'}
            aoPressionar={() => void salvar()}
            largo
          />
          <Botao
            titulo="Cancelar"
            aoPressionar={() => navigation.goBack()}
            variante="contorno"
            largo
          />
        </View>

        <Pressable onPress={() => navigation.goBack()} style={styles.dica} />
      </ScrollView>
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
  rotulo: {
    ...tipografia.rotulo,
    marginBottom: espacamentos.sm,
  },
  campo: {
    backgroundColor: cores.superficie,
    borderWidth: 2,
    borderColor: cores.borda,
    borderRadius: raios.md,
    padding: espacamentos.md,
    fontSize: 16,
    color: cores.texto,
    marginBottom: espacamentos.xs,
    ...sombra.baixa,
  },
  campoErro: {
    borderColor: cores.destaque,
  },
  erroCampo: {
    ...tipografia.legenda,
    color: cores.destaque,
    marginBottom: espacamentos.md,
  },
  caixaErro: {
    backgroundColor: cores.destaqueClaro,
    borderLeftWidth: 4,
    borderLeftColor: cores.destaque,
    borderRadius: raios.sm,
    padding: espacamentos.md,
    marginTop: espacamentos.sm,
    marginBottom: espacamentos.lg,
  },
  caixaErroTexto: {
    ...tipografia.legenda,
    color: cores.destaque,
  },
  acoes: {
    gap: espacamentos.md,
    marginTop: espacamentos.lg,
  },
  dica: {
    height: espacamentos.xl,
  },
});
