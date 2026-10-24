/**
 * Tokens de design do aplicativo.
 * Fonte única de verdade para cores, espaçamentos, raios, tipografia e sombras.
 */

export const cores = {
  fundo: '#F1F5F2',
  superficie: '#FFFFFF',
  primaria: '#006633',
  primariaEscura: '#004C29',
  primariaClara: '#E3F1E9',
  destaque: '#B00020',
  destaqueClaro: '#FCECEE',
  texto: '#13201A',
  textoSuave: '#5E6E66',
  textoInvertido: '#FFFFFF',
  borda: '#DCE5E0',
  bordaForte: '#B9C9C1',
  overlay: 'rgba(6, 32, 20, 0.55)',
} as const;

export const espacamentos = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const raios = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const tipografia = {
  exibicao: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: cores.texto,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: cores.texto,
  },
  subtitulo: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    color: cores.textoSuave,
  },
  corpo: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.texto,
  },
  rotulo: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: cores.textoSuave,
  },
  legenda: {
    fontSize: 13,
    fontWeight: '500',
    color: cores.textoSuave,
  },
} as const;

export const sombra = {
  cartao: {
    shadowColor: '#05301F',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  baixa: {
    shadowColor: '#05301F',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
} as const;
