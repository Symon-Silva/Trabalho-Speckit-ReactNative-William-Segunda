import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Equipe } from '../types';

interface PlacarTimeProps {
  equipe: Equipe;
  gols: number;
  onAdicionarGol: () => void;
}

export default function PlacarTime({ equipe, gols, onAdicionarGol }: PlacarTimeProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.equipe}>{equipe}</Text>
      <Text style={styles.gols}>{gols}</Text>
      <Pressable onPress={onAdicionarGol} style={styles.botao}>
        <Text style={styles.botaoTexto}>+1</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 24,
  },
  equipe: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  gols: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  botao: {
    backgroundColor: '#006633',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
