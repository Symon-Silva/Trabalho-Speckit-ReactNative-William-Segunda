import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Partida } from '../types';

const CHAVE_HISTORICO = '@grenais/historico';

export async function carregarHistorico(): Promise<Partida[]> {
  const bruto = await AsyncStorage.getItem(CHAVE_HISTORICO);
  if (bruto === null) {
    return [];
  }
  const dados: unknown = JSON.parse(bruto);
  if (!Array.isArray(dados)) {
    return [];
  }
  return (dados as Partida[]).sort((a, b) => {
    return new Date(b.finalizadaEm).getTime() - new Date(a.finalizadaEm).getTime();
  });
}

export async function salvarPartida(partida: Partida): Promise<void> {
  const historico = await carregarHistorico();
  historico.push(partida);
  await AsyncStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));
}
