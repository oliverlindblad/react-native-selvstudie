import { View, Pressable, Text, Image, StyleSheet } from 'react-native';
import { GULD, HVID } from '../constants/farver';

const MAKS_TEGN = 25;

// Én note i listen. Tryk åbner noten, krydset sletter den.
export default function NoteKort({ note, onPress, onSlet }) {
  const kortTekst =
    note.text.length > MAKS_TEGN ? note.text.slice(0, MAKS_TEGN) + '...' : note.text;

  return (
    <View style={styles.note}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.tekstOmraade, pressed && styles.trykket]}
      >
        {/* Lille thumbnail, hvis noten har et billede */}
        {note.billedUrl && <Image source={{ uri: note.billedUrl }} style={styles.thumbnail} />}
        <Text style={styles.tekst}>{kortTekst}</Text>
      </Pressable>

      <Pressable onPress={onSlet} hitSlop={10} style={styles.slet}>
        <Text style={styles.sletTekst}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HVID,
    borderRadius: 10,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: GULD,
  },
  tekstOmraade: {
    flex: 1,
    flexDirection: 'row', // thumbnail og tekst ved siden af hinanden
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  trykket: {
    opacity: 0.6,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  tekst: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  slet: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sletTekst: {
    fontSize: 18,
    color: '#999',
  },
});
