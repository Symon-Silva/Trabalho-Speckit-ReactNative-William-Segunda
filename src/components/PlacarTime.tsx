import { Pressable, StyleSheet, Text, View } from 'react-native';

import EscudoTime from './EscudoTime';
import { cores, espacamentos, raios, sombra, tipografia } from '../theme';
import type { PartidaParticipante } from '../types';

interface PlacarTimeProps {
  participante: PartidaParticipante;
  gols: number;
  onAdicionarGol: () => void;
}

export default function PlacarTime({ participante, gols, onAdicionarGol }: PlacarTimeProps) {
  return (
    <View style={styles.container}>
      <EscudoTime
        nome={participante.nome}
        escudoUrl={participante.escudoUrl}
        id={participante.id}
        tamanho={56}
      />

      <Text style={styles.equipe} numberOfLines={1}>
        {participante.nome}
      </Text>

      <Text style={styles.gols}>{gols}</Text>

      <Pressable
        onPress={onAdicionarGol}
        accessibilityRole="button"
        accessibilityLabel={`Adicionar gol do ${participante.nome}`}
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
      >
        <Text style={styles.botaoTexto}>+1</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  equipe: {
    ...tipografia.rotulo,
    color: cores.textoSuave,
    textAlign: 'center',
    marginTop: espacamentos.sm,
    marginBottom: espacamentos.xs,
  },
  gols: {
    fontSize: 60,
    fontWeight: '800',
    letterSpacing: -2,
    color: cores.texto,
    lineHeight: 68,
  },
  botao: {
    marginTop: espacamentos.md,
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.primaria,
    borderRadius: raios.pill,
    paddingVertical: espacamentos.sm,
    paddingHorizontal: espacamentos.xl,
    ...sombra.baixa,
  },
  botaoPressionado: {
    backgroundColor: cores.primariaEscura,
    transform: [{ scale: 0.94 }],
  },
  botaoTexto: {
    fontSize: 18,
    fontWeight: '800',
    color: cores.textoInvertido,
  },
});
