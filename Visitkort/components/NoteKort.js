import { View, Text, StyleSheet } from 'react-native';
import { GULD, HVID } from '../constants/farver';

// Én note i listen. Får noten som prop og viser den.
export default function NoteKort({ note }) {
  return (
    <View style={styles.note}>
      <Text style={styles.tekst}>{note.text}</Text>
    </View>
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
  tekst: {
    fontSize: 16,
    color: '#333',
  },
});
