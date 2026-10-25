import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  TIMES_PADRAO,
  type Partida,
  type PartidaParticipante,
  type Time,
} from '../types';

const CHAVE_TIMES = '@placar/times';
const CHAVE_HISTORICO = '@grenais/historico';

const ID_LEGADO_GREMIO = 'legado-gremio';
const ID_LEGADO_INTERNACIONAL = 'legado-internacional';

const LIMITE_MIN_NOME = 2;
const LIMITE_MAX_NOME = 50;

export interface ResultadoValidacao {
  valido: boolean;
  erroNome?: string;
  erroEscudoUrl?: string;
}

function normalizarNome(nome: string): string {
  return nome.trim();
}

export function validarTime(
  nome: string,
  escudoUrl: string,
  times: Time[],
  idAtual?: string,
): ResultadoValidacao {
  const nomeNormalizado = normalizarNome(nome);
  let erroNome: string | undefined;
  let erroEscudoUrl: string | undefined;

  if (nomeNormalizado.length === 0) {
    erroNome = 'Informe o nome do time.';
  } else if (nomeNormalizado.length < LIMITE_MIN_NOME) {
    erroNome = `O nome precisa ter ao menos ${LIMITE_MIN_NOME} caracteres.`;
  } else if (nomeNormalizado.length > LIMITE_MAX_NOME) {
    erroNome = `O nome pode ter no máximo ${LIMITE_MAX_NOME} caracteres.`;
  } else {
    const alvo = nomeNormalizado.toLowerCase();
    const duplicado = times.some(
      (time) => time.id !== idAtual && time.nome.trim().toLowerCase() === alvo,
    );
    if (duplicado) {
      erroNome = 'Já existe um time com esse nome.';
    }
  }

  const link = escudoUrl.trim();
  if (link.length > 0 && !/^https?:\/\/.+/i.test(link)) {
    erroEscudoUrl = 'Informe um link válido começando com http:// ou https://.';
  }

  return {
    valido: erroNome === undefined && erroEscudoUrl === undefined,
    erroNome,
    erroEscudoUrl,
  };
}

function ehTime(valor: unknown): valor is Time {
  if (typeof valor !== 'object' || valor === null) {
    return false;
  }
  const candidato = valor as Record<string, unknown>;
  return (
    typeof candidato.id === 'string' &&
    typeof candidato.nome === 'string' &&
    (candidato.escudoUrl === null || typeof candidato.escudoUrl === 'string') &&
    typeof candidato.padrao === 'boolean'
  );
}

function garantirTimesPadrao(times: Time[]): Time[] {
  const resultado = [...times];
  for (const padrao of TIMES_PADRAO) {
    if (!resultado.some((time) => time.id === padrao.id)) {
      resultado.unshift(padrao);
    }
  }
  return resultado;
}

export async function carregarTimes(): Promise<Time[]> {
  const bruto = await AsyncStorage.getItem(CHAVE_TIMES);
  if (bruto === null) {
    const iniciais = garantirTimesPadrao([]);
    await AsyncStorage.setItem(CHAVE_TIMES, JSON.stringify(iniciais));
    return iniciais;
  }
  const dados: unknown = JSON.parse(bruto);
  const lista = Array.isArray(dados) ? dados.filter(ehTime) : [];
  const comPadrao = garantirTimesPadrao(lista);
  if (comPadrao.length !== lista.length) {
    await AsyncStorage.setItem(CHAVE_TIMES, JSON.stringify(comPadrao));
  }
  return comPadrao;
}

export async function salvarTime(time: Time): Promise<void> {
  const times = await carregarTimes();
  const indice = times.findIndex((existente) => existente.id === time.id);
  if (indice >= 0) {
    times[indice] = time;
  } else {
    times.push(time);
  }
  await AsyncStorage.setItem(CHAVE_TIMES, JSON.stringify(times));
}

export async function excluirTime(id: string): Promise<void> {
  const times = await carregarTimes();
  const filtrados = times.filter((time) => time.id !== id || time.padrao);
  await AsyncStorage.setItem(CHAVE_TIMES, JSON.stringify(filtrados));
}

function migrarParticipante(id: string, nome: string): PartidaParticipante {
  return { id, nome, escudoUrl: null };
}

function migrarPartida(bruta: unknown): Partida | null {
  if (typeof bruta !== 'object' || bruta === null) {
    return null;
  }
  const candidato = bruta as Record<string, unknown>;

  if (
    typeof candidato.id === 'string' &&
    typeof candidato.finalizadaEm === 'string' &&
    Array.isArray(candidato.participantes) &&
    candidato.participantes.length === 2 &&
    typeof candidato.gols === 'object' &&
    candidato.gols !== null
  ) {
    return candidato as unknown as Partida;
  }

  const mandante = candidato.mandante;
  const gols = candidato.gols;
  if (
    typeof candidato.id === 'string' &&
    typeof candidato.finalizadaEm === 'string' &&
    (mandante === 'Grêmio' || mandante === 'Internacional') &&
    typeof gols === 'object' &&
    gols !== null
  ) {
    const mapaGols = gols as Record<string, unknown>;
    const golsGremio = typeof mapaGols['Grêmio'] === 'number' ? (mapaGols['Grêmio'] as number) : 0;
    const golsInter =
      typeof mapaGols['Internacional'] === 'number' ? (mapaGols['Internacional'] as number) : 0;
    return {
      id: candidato.id,
      participantes: [
        migrarParticipante(ID_LEGADO_GREMIO, 'Grêmio'),
        migrarParticipante(ID_LEGADO_INTERNACIONAL, 'Internacional'),
      ],
      gols: {
        [ID_LEGADO_GREMIO]: golsGremio,
        [ID_LEGADO_INTERNACIONAL]: golsInter,
      },
      finalizadaEm: candidato.finalizadaEm,
    };
  }

  return null;
}

export async function carregarHistorico(): Promise<Partida[]> {
  const bruto = await AsyncStorage.getItem(CHAVE_HISTORICO);
  if (bruto === null) {
    return [];
  }
  const dados: unknown = JSON.parse(bruto);
  if (!Array.isArray(dados)) {
    return [];
  }
  return dados
    .map((item) => migrarPartida(item))
    .filter((partida): partida is Partida => partida !== null)
    .sort((a, b) => new Date(b.finalizadaEm).getTime() - new Date(a.finalizadaEm).getTime());
}

export async function salvarPartida(partida: Partida): Promise<void> {
  const historico = await carregarHistorico();
  historico.push(partida);
  await AsyncStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));
}


export async function excluirPartida(id: string): Promise<void> {
  const bruto = await AsyncStorage.getItem(CHAVE_HISTORICO);
  if (bruto === null) { return; }
  const dados = JSON.parse(bruto);
  if (!Array.isArray(dados)) { return; }
  const filtrados = dados.filter((item: any) => {
    if (typeof item !== " object\ || item === null) { return false; }
 return item.id !== id;
 });
 await AsyncStorage.setItem(CHAVE_HISTORICO, JSON.stringify(filtrados));
}
