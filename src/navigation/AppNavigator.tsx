import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FormularioTimeScreen from '../screens/FormularioTimeScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
import IniciarPartidaScreen from '../screens/IniciarPartidaScreen';
import MeusTimesScreen from '../screens/MeusTimesScreen';
import PlacarScreen from '../screens/PlacarScreen';
import { cores } from '../theme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Iniciar"
        screenOptions={{
          headerStyle: { backgroundColor: cores.primaria },
          headerTintColor: cores.textoInvertido,
          headerTitleStyle: {
            fontSize: 17,
            fontWeight: '800',
            color: cores.textoInvertido,
          },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: cores.fundo },
        }}
      >
        <Stack.Screen
          name="Iniciar"
          component={IniciarPartidaScreen}
          options={{ title: 'Iniciar partida' }}
        />
        <Stack.Screen
          name="Placar"
          component={PlacarScreen}
          options={{ title: 'Placar ao vivo' }}
        />
        <Stack.Screen
          name="Historico"
          component={HistoricoScreen}
          options={{ title: 'Histórico' }}
        />
        <Stack.Screen
          name="MeusTimes"
          component={MeusTimesScreen}
          options={{ title: 'Meus Times' }}
        />
        <Stack.Screen
          name="FormularioTime"
          component={FormularioTimeScreen}
          options={{ title: 'Time' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
