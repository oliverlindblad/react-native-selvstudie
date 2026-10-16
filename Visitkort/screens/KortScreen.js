import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GULD, HVID } from '../constants/farver';
import { lytTilNoter, opretNote } from '../services/noteService';

// Startområde, før vi kender brugerens position: Carlsberg Byen i Valby.
// latitudeDelta/longitudeDelta bestemmer zoom: jo mindre tal, jo tættere på.
const CARLSBERG = {
  latitude: 55.6667,
  longitude: 12.5345,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

// Side 6: kort med alle noter, der har en placering
export default function KortScreen({ navigation }) {
  const [noter, setNoter] = useState([]);
  const [harTilladelse, setHarTilladelse] = useState(false);

  // Ref til kortet, så vi kan flytte det fra koden
  const kortRef = useRef(null);

  // Lyt til noterne i Firestore, præcis som på listen
  useEffect(() => {
    const stopLytning = lytTilNoter(setNoter);
    return stopLytning;
  }, []);

  // Spørg om lov til brugerens position, og flyt kortet derhen
  useEffect(() => {
    async function findPosition() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return; // uden tilladelse bliver kortet ved Carlsberg

      setHarTilladelse(true);
      const position = await Location.getCurrentPositionAsync({});
      kortRef.current?.animateToRegion(
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        800 // animationens længde i millisekunder
      );
    }
    findPosition();
  }, []);

  // Langt tryk på kortet: opret en ny note på det sted og åbn den
  async function opretNoteHer(event) {
    // event.nativeEvent.coordinate er det sted på kortet, man trykkede
    const { latitude, longitude } = event.nativeEvent.coordinate;
    try {
      const nyNote = await opretNote('Ny smagsnote', { latitude, longitude });
      // addDoc giver en reference tilbage med det nye id
      navigation.navigate('Detalje', { noteId: nyNote.id });
    } catch (fejl) {
      console.log('Kunne ikke oprette note:', fejl);
    }
  }

  // Kun noter med en placering kan vises på kortet
  const noterMedPlacering = noter.filter((note) => note.placering);

  return (
    <View style={styles.side}>
      <MapView
        ref={kortRef}
        style={StyleSheet.absoluteFill}
        initialRegion={CARLSBERG}
        showsUserLocation={harTilladelse} // den blå prik
        onLongPress={opretNoteHer}
      >
        {noterMedPlacering.map((note) => (
          <Marker
            key={note.id}
            coordinate={note.placering}
            title={note.text.length > 30 ? note.text.slice(0, 30) + '...' : note.text}
            description="Tryk for at åbne"
            pinColor={GULD}
            // Tryk på boblen over markøren åbner noten
            onCalloutPress={() => navigation.navigate('Detalje', { noteId: note.id })}
          />
        ))}
      </MapView>

      {/* Lille hjælpetekst nederst */}
      <View style={styles.hjaelp} pointerEvents="none">
        <Text style={styles.hjaelpTekst}>Hold fingeren på kortet for at tilføje en note</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  side: {
    flex: 1,
  },
  hjaelp: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  hjaelpTekst: {
    color: HVID,
    fontSize: 14,
  },
});
