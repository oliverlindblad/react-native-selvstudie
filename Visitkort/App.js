import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ForsideScreen from './screens/ForsideScreen';
import OmOsScreen from './screens/OmOsScreen';
import NoterScreen from './screens/NoterScreen';
import DetaljeScreen from './screens/DetaljeScreen';
import { GROEN, HVID } from './constants/farver';

// En "stack" fungerer som en bunke kort: navigate() lægger en ny skærm øverst,
// og tilbage-knappen fjerner den igen.
const Stack = createNativeStackNavigator();

export default function App() {
  // Noterne ligger stadig her, så både listen og detaljesiden kan bruge dem
  const [noter, setNoter] = useState([]);

  // Kaldes fra detaljesiden, når man trykker GEM
  function opdaterNote(id, nyTekst) {
    // map() laver en NY liste: den note med det rigtige id får ny tekst,
    // alle andre noter kopieres uændret
    setNoter((gamleNoter) =>
      gamleNoter.map((note) => (note.id === id ? { ...note, text: nyTekst } : note))
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        // Fælles indstillinger for alle skærme
        screenOptions={{
          headerStyle: { backgroundColor: GROEN },
          headerTintColor: HVID, // farve på titel og tilbage-pil
          headerShadowVisible: false,
          contentStyle: { backgroundColor: GROEN },
        }}
      >
        <Stack.Screen
          name="Forside"
          component={ForsideScreen}
          options={{ headerShown: false }} // forsiden har ingen header
        />
        <Stack.Screen name="OmOs" component={OmOsScreen} options={{ title: 'Om os' }} />

        {/* Når en skærm skal have ekstra props (her noterne), bruger man
            en funktion som "children" i stedet for component={...} */}
        <Stack.Screen name="Noter" options={{ title: 'Smagsnoter' }}>
          {(props) => <NoterScreen {...props} noter={noter} setNoter={setNoter} />}
        </Stack.Screen>

        <Stack.Screen name="Detalje" options={{ title: 'Note' }}>
          {(props) => <DetaljeScreen {...props} noter={noter} opdaterNote={opdaterNote} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
