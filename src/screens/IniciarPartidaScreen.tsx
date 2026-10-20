import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { EQUIPES, type Equipe } from '../types';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Iniciar'>;

export default function IniciarPartidaScreen({ navigation }: Props) {
  const [mandante, setMandante] = useState<Equipe | null>(null);
  const [erro, setErro] = useState(false);

  const selecionar = (equipe: Equipe) => {
    setMandante(equipe);
    setErro(false);
  };

  const iniciarPartida = () => {
    if (mandante === null) {
      setErro(true);
      return;
    }
    navigation.replace('Placar', { mandante });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gre-Nais</Text>
      <Text style={styles.subtitulo}>Escolha o time mandante</Text>

      {EQUIPES.map((equipe) => {
        const selecionado = mandante === equipe;
        return (
          <Pressable
            key={equipe}
            onPress={() => selecionar(equipe)}
            style={[styles.opcao, selecionado && styles.opcaoSelecionada]}
          >
            <Text style={[styles.opcaoTexto, selecionado && styles.opcaoTextoSelecionado]}>
              {equipe}
            </Text>
          </Pressable>
        );
      })}

      {erro ? <Text style={styles.erro}>Selecione o time mandante para continuar.</Text> : null}

      <Pressable onPress={iniciarPartida} style={styles.botao}>
        <Text style={styles.botaoTexto}>Iniciar partida</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#555',
  },
  opcao: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  opcaoSelecionada: {
    borderColor: '#006633',
    backgroundColor: '#E6F4EA',
  },
  opcaoTexto: {
    fontSize: 18,
  },
  opcaoTextoSelecionado: {
    fontWeight: 'bold',
    color: '#006633',
  },
  erro: {
    color: '#B00020',
    textAlign: 'center',
    marginBottom: 12,
  },
  botao: {
    backgroundColor: '#006633',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
