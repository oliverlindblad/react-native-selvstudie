import { Pressable, Text, StyleSheet } from 'react-native';
import { GULD, HVID } from '../constants/farver';

const MAKS_TEGN = 25;

// Én note i listen. Viser kun starten af teksten, og kan trykkes på.
export default function NoteKort({ note, onPress }) {
  // Er teksten længere end 25 tegn, klippes den og får "..." til sidst
  const kortTekst =
    note.text.length > MAKS_TEGN ? note.text.slice(0, MAKS_TEGN) + '...' : note.text;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.note, pressed && styles.trykket]}
    >
      <Text style={styles.tekst}>{kortTekst}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  note: {
    backgroundColor: HVID,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: GULD,
  },
  trykket: {
    opacity: 0.7,
  },
  tekst: {
    fontSize: 16,
    color: '#333',
  },
});
