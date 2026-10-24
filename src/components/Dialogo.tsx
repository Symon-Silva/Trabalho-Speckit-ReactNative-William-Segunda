import { Modal, StyleSheet, Text, View } from 'react-native';

import Botao, { type VarianteBotao } from './Botao';
import { cores, espacamentos, raios, sombra, tipografia } from '../theme';

export interface BotaoDialogo {
  texto: string;
  aoPressionar?: () => void;
  variante?: VarianteBotao;
}

interface DialogoProps {
  visivel: boolean;
  titulo: string;
  mensagem?: string;
  botoes: BotaoDialogo[];
  aoFechar: () => void;
}

export default function Dialogo({ visivel, titulo, mensagem, botoes, aoFechar }: DialogoProps) {
  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={aoFechar}>
      <View style={styles.fundo}>
        <View style={styles.caixa}>
          <View style={styles.faixa} />
          <Text style={styles.titulo}>{titulo}</Text>
          {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
          <View style={styles.botoes}>
            {botoes.map((botao) => (
              <Botao
                key={botao.texto}
                titulo={botao.texto}
                aoPressionar={() => {
                  aoFechar();
                  botao.aoPressionar?.();
                }}
                variante={botao.variante}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: cores.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espacamentos.xl,
  },
  caixa: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: cores.superficie,
    borderRadius: raios.lg,
    padding: espacamentos.xl,
    overflow: 'hidden',
    ...sombra.cartao,
  },
  faixa: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: cores.primaria,
  },
  titulo: {
    ...tipografia.titulo,
    marginBottom: espacamentos.sm,
  },
  mensagem: {
    ...tipografia.subtitulo,
    marginBottom: espacamentos.xl,
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: espacamentos.md,
  },
});
