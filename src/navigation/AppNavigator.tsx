import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HistoricoScreen from '../screens/HistoricoScreen';
import IniciarPartidaScreen from '../screens/IniciarPartidaScreen';
import PlacarScreen from '../screens/PlacarScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Iniciar">
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
