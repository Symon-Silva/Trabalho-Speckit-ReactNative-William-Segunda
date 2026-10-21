export type Equipe = 'Grêmio' | 'Internacional';

export const EQUIPES: Equipe[] = ['Grêmio', 'Internacional'];

export interface Partida {
  id: string;
  mandante: Equipe;
  gols: Record<Equipe, number>;
  finalizadaEm: string;
}
