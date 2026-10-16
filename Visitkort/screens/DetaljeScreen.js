import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Knap from '../components/Knap';
import { HVID } from '../constants/farver';

// Side 4: hele noten, som kan redigeres og gemmes
export default function DetaljeScreen({ route, navigation, noter, opdaterNote }) {
  // route.params er det, der blev sendt med i navigation.navigate('Detalje', { noteId })
  const { noteId } = route.params;
  const note = noter.find((n) => n.id === noteId);

  // Startværdien er notens tekst. Herefter redigerer brugeren en lokal kopi,
  // som først gemmes i den rigtige liste, når der trykkes GEM.
  const [tekst, setTekst] = useState(note ? note.text : '');

  // Sikkerhedsnet, hvis noten ikke findes (fx hvis den er blevet slettet)
  if (!note) {
    return (
      <View style={styles.side}>
        <Text style={styles.fejl}>Noten findes ikke længere.</Text>
      </View>
    );
  }

  function gem() {
    if (tekst.trim() === '') return; // en note må ikke være tom
    opdaterNote(noteId, tekst.trim());
    navigation.goBack(); // tilbage til listen
  }

  return (
    <View style={styles.side}>
      <TextInput
        style={styles.input}
        value={tekst}
        onChangeText={setTekst}
        multiline // flere linjer, så hele noten kan ses
        textAlignVertical="top" // Android starter ellers teksten i midten
        autoFocus
      />
      <View style={styles.centreret}>
        <Knap tekst="GEM" onPress={gem} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  side: {
    flex: 1,
    padding: 24,
    paddingBottom: 40,
  },
  input: {
    flex: 1,
    backgroundColor: HVID,
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
  },
  centreret: {
    alignItems: 'center',
  },
  fejl: {
    color: HVID,
    fontSize: 16,
    textAlign: 'center',
  },
});
