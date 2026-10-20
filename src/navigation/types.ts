import type { Equipe } from '../types';

export type RootStackParamList = {
  Iniciar: undefined;
  Placar: { mandante: Equipe };
};
