import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import ForsideScreen from './screens/ForsideScreen';
import OmOsScreen from './screens/OmOsScreen';
import NoterScreen from './screens/NoterScreen';
import { GROEN } from './constants/farver';

// App.js står nu kun for to ting: hvilken side der vises, og den state,
// som flere sider deler. Alt andet ligger i sine egne filer.
export default function App() {
  const [side, setSide] = useState('forside');

  // Noterne ligger her og ikke i NoterScreen.
  // Ellers ville de blive slettet, hver gang man forlader siden.
  const [noter, setNoter] = useState([]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {side === 'forside' && (
        <ForsideScreen onOmOs={() => setSide('om')} onNoter={() => setSide('noter')} />
      )}
      {side === 'om' && <OmOsScreen onTilbage={() => setSide('forside')} />}
      {side === 'noter' && (
        <NoterScreen noter={noter} setNoter={setNoter} onTilbage={() => setSide('forside')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GROEN,
  },
});
