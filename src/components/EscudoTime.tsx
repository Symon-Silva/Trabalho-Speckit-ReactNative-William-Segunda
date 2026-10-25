import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { cores, raios } from '../theme';
import {
  ID_PADRAO_GREMIO,
  ID_PADRAO_INTERNACIONAL,
  type PartidaParticipante,
} from '../types';

const ESCUDOS_PADRAO: Record<string, number> = {
  [ID_PADRAO_GREMIO]: require('../../assets/times/gremio.png'),
  [ID_PADRAO_INTERNACIONAL]: require('../../assets/times/internacional.png'),
};

interface EscudoTimeProps {
  nome: string;
  escudoUrl?: string | null;
  id?: string;
  tamanho?: number;
}

export function participanteParaEscudo(participante: PartidaParticipante) {
  return {
    id: participante.id,
    nome: participante.nome,
    escudoUrl: participante.escudoUrl,
  };
}

export default function EscudoTime({ nome, escudoUrl, id, tamanho = 40 }: EscudoTimeProps) {
  const [falhou, setFalhou] = useState(false);

  const fontePadrao = id ? ESCUDOS_PADRAO[id] : undefined;
  const linkLimpo = typeof escudoUrl === 'string' ? escudoUrl.trim() : '';
  const temLink = linkLimpo.length > 0;

  const dimensoes = {
    width: tamanho,
    height: tamanho,
    borderRadius: raios.pill,
  };

  if (temLink && !falhou) {
    return (
      <Image
        source={{ uri: linkLimpo }}
        style={[styles.escudo, dimensoes]}
        resizeMode="contain"
        onError={() => setFalhou(true)}
      />
    );
  }

  if (fontePadrao !== undefined) {
    return <Image source={fontePadrao} style={[styles.escudo, dimensoes]} resizeMode="contain" />;
  }

  return (
    <View style={[styles.fallback, dimensoes]}>
      <Text style={[styles.fallbackTexto, { fontSize: tamanho * 0.42 }]}>
        {nome.trim().charAt(0).toUpperCase() || '?'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  escudo: {
    backgroundColor: cores.fundo,
  },
  fallback: {
    backgroundColor: cores.primariaClara,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackTexto: {
    fontWeight: '800',
    color: cores.primariaEscura,
  },
});
