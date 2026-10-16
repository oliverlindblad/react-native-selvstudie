import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ForsideScreen from './screens/ForsideScreen';
import OmOsScreen from './screens/OmOsScreen';
import NoterScreen from './screens/NoterScreen';
import DetaljeScreen from './screens/DetaljeScreen';
import { GROEN, HVID } from './constants/farver';

const Stack = createNativeStackNavigator();

// Noterne ligger ikke længere i App. De ligger i Firestore, og hver skærm
// henter selv det, den skal bruge. Derfor kan alle skærme nu bruge
// component={...} igen, og vi skal ikke sende noter og funktioner rundt.
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Forside"
        screenOptions={{
          headerStyle: { backgroundColor: GROEN },
          headerTintColor: HVID,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: GROEN },
        }}
      >
        <Stack.Screen
          name="Forside"
          component={ForsideScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="OmOs" component={OmOsScreen} options={{ title: 'Om os' }} />
        <Stack.Screen name="Noter" component={NoterScreen} options={{ title: 'Smagsnoter' }} />
        <Stack.Screen name="Detalje" component={DetaljeScreen} options={{ title: 'Note' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
