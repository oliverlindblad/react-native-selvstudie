import { View, Text, StyleSheet } from 'react-native';
import { HVID } from '../constants/farver';

// react-native-maps virker ikke i browseren og ville crashe hele appen på localhost.
// Filer der ender på .web.js bruges automatisk i stedet, når appen kører på web.
// På telefonen bruges KortScreen.js som normalt.
export default function KortScreen() {
  return (
    <View style={styles.side}>
      <Text style={styles.tekst}>Kortet virker kun på telefonen. Åbn appen i Expo Go.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  side: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  tekst: {
    color: HVID,
    fontSize: 16,
    textAlign: 'center',
  },
});
