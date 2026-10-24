import type { PartidaParticipante } from '../types';

export type RootStackParamList = {
  Iniciar: undefined;
  Placar: { participantes: [PartidaParticipante, PartidaParticipante] };
  Historico: undefined;
  MeusTimes: undefined;
  FormularioTime: { timeId?: string };
};
