import { Pressable, StyleSheet, Text } from 'react-native';

import { cores, espacamentos, raios, tipografia } from '../theme';

export type VarianteBotao = 'primario' | 'contorno' | 'suave';

interface BotaoProps {
  titulo: string;
  aoPressionar: () => void;
  variante?: VarianteBotao;
  largo?: boolean;
}

export default function Botao({ titulo, aoPressionar, variante = 'primario', largo = false }: BotaoProps) {
  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      style={({ pressed }) => [
        styles.base,
        variante === 'primario' && styles.primario,
        variante === 'contorno' && styles.contorno,
        variante === 'suave' && styles.suave,
        largo && styles.largo,
        pressed && styles.pressionado,
      ]}
    >
      <Text
        style={[
          styles.texto,
          variante === 'contorno' && styles.textoContorno,
          variante === 'suave' && styles.textoSuave,
        ]}
      >
        {titulo}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: espacamentos.lg,
    paddingHorizontal: espacamentos.xl,
    borderRadius: raios.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  largo: {
    alignSelf: 'stretch',
  },
  primario: {
    backgroundColor: cores.primaria,
  },
  contorno: {
    backgroundColor: 'transparent',
    borderColor: cores.primaria,
  },
  suave: {
    backgroundColor: cores.primariaClara,
  },
  pressionado: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  texto: {
    ...tipografia.corpo,
    color: cores.textoInvertido,
  },
  textoContorno: {
    color: cores.primaria,
  },
  textoSuave: {
    color: cores.primariaEscura,
  },
});
