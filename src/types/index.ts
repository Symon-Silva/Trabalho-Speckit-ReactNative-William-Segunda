export interface Time {
  id: string;
  nome: string;
  escudoUrl: string | null;
  padrao: boolean;
}

export const ID_PADRAO_GREMIO = 'padrao-gremio';
export const ID_PADRAO_INTERNACIONAL = 'padrao-internacional';

export const TIMES_PADRAO: Time[] = [
  { id: ID_PADRAO_GREMIO, nome: 'Grêmio', escudoUrl: null, padrao: true },
  { id: ID_PADRAO_INTERNACIONAL, nome: 'Internacional', escudoUrl: null, padrao: true },
];

export interface PartidaParticipante {
  id: string;
  nome: string;
  escudoUrl: string | null;
}

export interface Partida {
  id: string;
  participantes: [PartidaParticipante, PartidaParticipante];
  gols: Record<string, number>;
  finalizadaEm: string;
}
