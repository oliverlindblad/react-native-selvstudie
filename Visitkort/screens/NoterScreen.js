import { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import Knap from '../components/Knap';
import NoteKort from '../components/NoteKort';
import { HVID } from '../constants/farver';
import { lytTilNoter, opretNote, sletNote } from '../services/noteService';

// Side 3: listen med smagsnoter, nu fra Firestore
export default function NoterScreen({ navigation }) {
  const [noter, setNoter] = useState([]);
  const [indlaeser, setIndlaeser] = useState(true);
  const [tekst, setTekst] = useState('');

  // Start med at lytte til Firestore, når skærmen vises.
  // Hver gang en note oprettes, rettes eller slettes (også fra en anden
  // telefon), kalder Firestore vores callback med den nye liste.
  useEffect(() => {
    const stopLytning = lytTilNoter((nyeNoter) => {
      setNoter(nyeNoter);
      setIndlaeser(false);
    });

    // Funktionen, der returneres fra useEffect, kører, når skærmen forlades.
    // Så stopper vi med at lytte, så vi ikke bruger data unødigt.
    return stopLytning;
  }, []);

  async function tilfoejNote() {
    if (tekst.trim() === '') return;
    const nyTekst = tekst.trim();
    setTekst(''); // ryd feltet med det samme, så appen føles hurtig

    try {
      await opretNote(nyTekst);
      // Vi behøver IKKE opdatere listen selv: onSnapshot gør det automatisk
    } catch (fejl) {
      console.log('Kunne ikke oprette note:', fejl);
    }
  }

  async function slet(id) {
    try {
      await sletNote(id);
    } catch (fejl) {
      console.log('Kunne ikke slette note:', fejl);
    }
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

      {indlaeser ? (
        <ActivityIndicator color={HVID} size="large" style={styles.spinner} />
      ) : (
        <FlatList
          style={styles.liste}
          data={noter}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoteKort
              note={item}
              onPress={() => navigation.navigate('Detalje', { noteId: item.id })}
              onSlet={() => slet(item.id)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.tomTekst}>Ingen noter endnu. Skriv den første!</Text>
          }
        />
      )}
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
  spinner: {
    marginTop: 40,
  },
  tomTekst: {
    color: HVID,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 20,
  },
});
