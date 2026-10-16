import { useState, useEffect, useLayoutEffect, useRef } from 'react';
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
import { lytTilNote, opdaterNote } from '../services/noteService';
import { skiftBillede } from '../services/billedService';

// Side 4: hele noten med tekst og billede
export default function DetaljeScreen({ route, navigation }) {
  const { noteId } = route.params;

  const [tekst, setTekst] = useState('');
  const [billedUrl, setBilledUrl] = useState(null);
  const [billedSti, setBilledSti] = useState(null);
  const [indlaeser, setIndlaeser] = useState(true);
  const [uploader, setUploader] = useState(false);
  const [findes, setFindes] = useState(true);

  // Husker om teksten er hentet første gang. En ref i stedet for state,
  // fordi den ikke skal få skærmen til at tegne igen.
  const tekstHentet = useRef(false);

  // Lyt til noten i realtid i stedet for at hente den én gang.
  // Så opdateres billedet automatisk, når vi kommer tilbage fra kameraet.
  useEffect(() => {
    const stopLytning = lytTilNote(noteId, (note) => {
      if (!note) {
        setFindes(false);
      } else {
        // Teksten sættes kun første gang. Ellers ville en opdatering fra
        // Firestore overskrive det, brugeren er i gang med at skrive.
        if (!tekstHentet.current) {
          setTekst(note.text);
          tekstHentet.current = true;
        }
        setBilledUrl(note.billedUrl ?? null);
        setBilledSti(note.billedSti ?? null);
      }
      setIndlaeser(false);
    });
    return stopLytning;
  }, [noteId]);

  async function vaelgBillede() {
    const resultat = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });
    if (resultat.canceled) return;

    setUploader(true);
    try {
      await skiftBillede(noteId, resultat.assets[0], billedSti);
      // Billedet vises automatisk, fordi vi lytter til noten
    } catch (fejl) {
      console.log('Kunne ikke uploade billede:', fejl);
    } finally {
      setUploader(false);
    }
  }

  function aabnKamera() {
    // Send det gamle billedes sti med, så kameraskærmen kan slette det
    navigation.navigate('Kamera', { noteId, gammelSti: billedSti });
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
      {billedUrl && <Image source={{ uri: billedUrl }} style={styles.billede} />}

      {uploader ? (
        <ActivityIndicator color={HVID} style={styles.spinner} />
      ) : (
        <View style={styles.knapRaekke}>
          <Knap tekst="Tag billede" onPress={aabnKamera} style={styles.billedKnap} />
          <Knap tekst="Fra bibliotek" onPress={vaelgBillede} style={styles.billedKnap} />
        </View>
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
  knapRaekke: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },
  billedKnap: {
    marginTop: 0,
    paddingHorizontal: 20,
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
