import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export interface BotaoDialogo {
  texto: string;
  aoPressionar?: () => void;
  variante?: 'primario' | 'secundario';
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
          <Text style={styles.titulo}>{titulo}</Text>
          {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
          <View style={styles.botoes}>
            {botoes.map((botao) => (
              <Pressable
                key={botao.texto}
                onPress={() => {
                  aoFechar();
                  botao.aoPressionar?.();
                }}
                style={[styles.botao, botao.variante === 'secundario' && styles.botaoSecundario]}
              >
                <Text
                  style={[
                    styles.botaoTexto,
                    botao.variante === 'secundario' && styles.botaoSecundarioTexto,
                  ]}
                >
                  {botao.texto}
                </Text>
              </Pressable>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  caixa: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  mensagem: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  botao: {
    backgroundColor: '#006633',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  botaoSecundario: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#006633',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoSecundarioTexto: {
    color: '#006633',
  },
});
