import { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import Knap from '../components/Knap';
import NoteKort from '../components/NoteKort';
import { HVID } from '../constants/farver';

// Side 3: listen med smagsnoter
export default function NoterScreen({ navigation, noter, setNoter }) {
  const [tekst, setTekst] = useState('');

  function tilfoejNote() {
    if (tekst.trim() === '') return;
    const nyNote = { id: Date.now().toString(), text: tekst.trim() };
    setNoter([...noter, nyNote]);
    setTekst('');
  }

  return (
    <View style={styles.side}>
      <View style={styles.inputRaekke}>
        <TextInput
          style={styles.input}
          placeholder="Skriv en note om en øl..."
          placeholderTextColor="#999"
          value={tekst}
          onChangeText={setTekst}
          onSubmitEditing={tilfoejNote}
          returnKeyType="done"
        />
        <Knap tekst="Tilføj" onPress={tilfoejNote} style={styles.tilfoejKnap} />
      </View>

      <FlatList
        style={styles.liste}
        data={noter}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteKort
            note={item}
            // Send kun id'et med. Detaljesiden slår selv noten op i listen,
            // så den altid viser den nyeste version.
            onPress={() => navigation.navigate('Detalje', { noteId: item.id })}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.tomTekst}>Ingen noter endnu. Skriv den første!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  side: {
    flex: 1,
    padding: 24,
    paddingBottom: 40,
  },
  inputRaekke: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: HVID,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  tilfoejKnap: {
    marginTop: 0,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 0,
  },
  liste: {
    flex: 1,
  },
  tomTekst: {
    color: HVID,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 20,
  },
});
