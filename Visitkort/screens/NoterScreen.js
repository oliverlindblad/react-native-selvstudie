import { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import Knap from '../components/Knap';
import NoteKort from '../components/NoteKort';
import { HVID } from '../constants/farver';

// Side 3: smagsnoter (opgave 2)
export default function NoterScreen({ noter, setNoter, onTilbage }) {
  // Teksten i inputfeltet lige nu. Den behøver kun at leve på denne side.
  const [tekst, setTekst] = useState('');

  function tilfoejNote() {
    if (tekst.trim() === '') return; // ingen tomme noter

    // Hver note er et objekt med et unikt id, som FlatList bruger som key
    const nyNote = { id: Date.now().toString(), text: tekst.trim() };

    // Lav en NY liste med den nye note til sidst. Brug ikke noter.push(),
    // for så opdager React ikke ændringen.
    setNoter([...noter, nyNote]);
    setTekst(''); // ryd inputfeltet
  }

  return (
    <View style={styles.side}>
      <Text style={styles.overskrift}>Smagsnoter</Text>

      <View style={styles.inputRaekke}>
        <TextInput
          style={styles.input}
          placeholder="Skriv en note om en øl..."
          placeholderTextColor="#999"
          value={tekst} // feltet viser altid det, der ligger i state
          onChangeText={setTekst} // og opdaterer state, når man skriver
          onSubmitEditing={tilfoejNote} // Enter på tastaturet tilføjer også noten
          returnKeyType="done"
        />
        <Knap tekst="Tilføj" onPress={tilfoejNote} style={styles.tilfoejKnap} />
      </View>

      <FlatList
        style={styles.liste}
        data={noter}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteKort note={item} />}
        // Vises når listen er tom
        ListEmptyComponent={
          <Text style={styles.tomTekst}>Ingen noter endnu. Skriv den første!</Text>
        }
      />

      <View style={styles.centreret}>
        <Knap tekst="Tilbage" onPress={onTilbage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  side: {
    flex: 1, // vigtigt: ellers ved FlatList ikke hvor meget plads den har
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  overskrift: {
    fontSize: 28,
    fontWeight: 'bold',
    color: HVID,
    marginBottom: 16,
  },
  inputRaekke: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1, // inputfeltet tager den plads, knappen ikke bruger
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
  centreret: {
    alignItems: 'center',
  },
});
