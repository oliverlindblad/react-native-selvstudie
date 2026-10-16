import { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  Keyboard,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Knap from '../components/Knap';
import { HVID } from '../constants/farver';
import { hentNote, opdaterNote, opdaterNoteBillede } from '../services/noteService';
import { uploadBillede, sletBillede } from '../services/billedService';

// Side 4: hele noten med tekst og billede
export default function DetaljeScreen({ route, navigation }) {
  const { noteId } = route.params;

  const [tekst, setTekst] = useState('');
  const [billedUrl, setBilledUrl] = useState(null);
  const [billedSti, setBilledSti] = useState(null);
  const [indlaeser, setIndlaeser] = useState(true);
  const [uploader, setUploader] = useState(false);
  const [findes, setFindes] = useState(true);

  // Hent noten fra Firestore, når skærmen åbnes
  useEffect(() => {
    async function indlaes() {
      const note = await hentNote(noteId);
      if (note) {
        setTekst(note.text);
        setBilledUrl(note.billedUrl ?? null); // ?? null: hvis noten ikke har et billede endnu
        setBilledSti(note.billedSti ?? null);
      } else {
        setFindes(false);
      }
      setIndlaeser(false);
    }
    indlaes();
  }, [noteId]);

  async function vaelgBillede() {
    // Åbn telefonens billedbibliotek
    const resultat = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true, // lad brugeren beskære billedet
      quality: 0.7, // komprimér lidt, så uploaden går hurtigere
    });

    if (resultat.canceled) return; // brugeren trykkede annuller

    setUploader(true);
    try {
      // 1) Upload filen til Supabase Storage
      const nytBillede = await uploadBillede(noteId, resultat.assets[0]);

      // 2) Gem stien og URL'en på noten i Firestore
      await opdaterNoteBillede(noteId, nytBillede);

      // 3) Slet det gamle billede, hvis der var et, så der ikke ligger filer og fylder
      if (billedSti) {
        await sletBillede(billedSti);
      }

      setBilledUrl(nytBillede.url);
      setBilledSti(nytBillede.sti);
    } catch (fejl) {
      console.log('Kunne ikke uploade billede:', fejl);
    } finally {
      setUploader(false); // kører både ved succes og fejl
    }
  }

  async function gem() {
    if (tekst.trim() === '') return;
    Keyboard.dismiss();
    try {
      await opdaterNote(noteId, tekst.trim());
      navigation.goBack();
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
      {/* Billedet vises fra sin URL i Supabase */}
      {billedUrl && <Image source={{ uri: billedUrl }} style={styles.billede} />}

      {uploader ? (
        <ActivityIndicator color={HVID} style={styles.spinner} />
      ) : (
        <Knap
          tekst={billedUrl ? 'Skift billede' : 'Tilføj billede'}
          onPress={vaelgBillede}
          style={styles.billedKnap}
        />
      )}

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
  billede: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    marginBottom: 12,
  },
  billedKnap: {
    marginTop: 0,
    marginBottom: 12,
    alignSelf: 'center',
  },
  spinner: {
    marginBottom: 12,
    height: 48,
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
