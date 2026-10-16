import { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Keyboard,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { HVID } from '../constants/farver';
import { hentNote, opdaterNote } from '../services/noteService';

// Side 4: hele noten, hentet fra Firestore ud fra dens id
export default function DetaljeScreen({ route, navigation }) {
  const { noteId } = route.params;

  const [tekst, setTekst] = useState('');
  const [indlaeser, setIndlaeser] = useState(true);
  const [findes, setFindes] = useState(true);

  // Hent noten fra Firestore, når skærmen åbnes
  useEffect(() => {
    async function indlaes() {
      const note = await hentNote(noteId);
      if (note) {
        setTekst(note.text);
      } else {
        setFindes(false);
      }
      setIndlaeser(false);
    }
    indlaes();
  }, [noteId]);

  async function gem() {
    if (tekst.trim() === '') return;
    Keyboard.dismiss();
    try {
      await opdaterNote(noteId, tekst.trim());
      navigation.goBack();
      // Listen opdaterer sig selv via onSnapshot, så vi skal ikke sende noget tilbage
    } catch (fejl) {
      console.log('Kunne ikke gemme note:', fejl);
    }
  }

  // GEM-knap i headeren. [tekst] sørger for, at gem() altid bruger den nyeste tekst.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={gem} hitSlop={10}>
          <Text style={styles.gemTekst}>GEM</Text>
        </Pressable>
      ),
    });
  }, [navigation, tekst]);

  if (indlaeser) {
    return (
      <View style={styles.side}>
        <ActivityIndicator color={HVID} size="large" />
      </View>
    );
  }

  if (!findes) {
    return (
      <View style={styles.side}>
        <Text style={styles.fejl}>Noten findes ikke længere.</Text>
      </View>
    );
  }

  return (
    <View style={styles.side}>
      <TextInput
        style={styles.input}
        value={tekst}
        onChangeText={setTekst}
        multiline
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  side: {
    flex: 1,
    padding: 24,
  },
  input: {
    flex: 1,
    backgroundColor: HVID,
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
  },
  gemTekst: {
    color: HVID,
    fontSize: 17,
    fontWeight: 'bold',
  },
  fejl: {
    color: HVID,
    fontSize: 16,
    textAlign: 'center',
  },
});
