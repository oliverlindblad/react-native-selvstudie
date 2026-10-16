import { Pressable, Text, StyleSheet } from 'react-native';
import { GULD, MOERKEGROEN, HVID } from '../constants/farver';

// Genbrugelig knap. Pressable giver fuld kontrol over udseendet, i modsætning til Button.
// "style" gør det muligt at tilpasse knappen udefra, fx <Knap style={{ marginTop: 0 }} />
export default function Knap({ tekst, onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.knap, style, pressed && styles.trykket]}
    >
      <Text style={styles.tekst}>{tekst}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  knap: {
    marginTop: 24,
    backgroundColor: GULD,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trykket: {
    backgroundColor: MOERKEGROEN,
  },
  tekst: {
    color: HVID,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
