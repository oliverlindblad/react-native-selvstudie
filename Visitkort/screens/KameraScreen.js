import { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  Linking,
  StyleSheet,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Knap from '../components/Knap';
import { GULD, HVID } from '../constants/farver';
import { skiftBillede } from '../services/billedService';

// Side 5: tag et billede med kameraet og gem det på en note
export default function KameraScreen({ route, navigation }) {
  const { noteId, gammelSti } = route.params;

  // useCameraPermissions fortæller, om appen har lov til at bruge kameraet,
  // og giver en funktion til at spørge brugeren
  const [tilladelse, spoergOmTilladelse] = useCameraPermissions();

  // useRef giver adgang til selve kamera-komponenten, så vi kan kalde
  // takePictureAsync() på den. En ref ændrer sig ikke mellem renders.
  const kameraRef = useRef(null);

  const [retning, setRetning] = useState('back'); // 'back' = bagkamera, 'front' = selfie
  const [billede, setBillede] = useState(null); // det billede, der lige er taget
  const [uploader, setUploader] = useState(false);

  // 1) Tilladelsen er ikke hentet endnu
  if (!tilladelse) {
    return <View style={styles.sort} />;
  }

  // 2) Ingen tilladelse: forklar hvorfor, og giv brugeren mulighed for at give den
  if (!tilladelse.granted) {
    return (
      <View style={styles.centreret}>
        <Text style={styles.besked}>
          Appen skal bruge kameraet for at tage billeder til dine smagsnoter.
        </Text>
        {tilladelse.canAskAgain ? (
          <Knap tekst="Giv adgang" onPress={spoergOmTilladelse} />
        ) : (
          // Har brugeren sagt nej for altid, kan appen ikke spørge igen.
          // Så må brugeren selv slå det til i telefonens indstillinger.
          <Knap tekst="Åbn indstillinger" onPress={() => Linking.openSettings()} />
        )}
      </View>
    );
  }

  async function tagBillede() {
    if (!kameraRef.current) return;
    const foto = await kameraRef.current.takePictureAsync({ quality: 0.7 });
    setBillede(foto); // foto.uri peger på en lokal fil på telefonen
  }

  async function brugBillede() {
    setUploader(true);
    try {
      // Samme flow som i opgave 5: upload, gem på noten, slet det gamle billede
      await skiftBillede(noteId, billede, gammelSti);
      navigation.goBack();
    } catch (fejl) {
      console.log('Kunne ikke gemme billede:', fejl);
      setUploader(false);
    }
  }

  // 3) Et billede er taget: vis preview, så brugeren kan vælge
  if (billede) {
    return (
      <View style={styles.sort}>
        <Image source={{ uri: billede.uri }} style={StyleSheet.absoluteFill} />
        <View style={styles.bundRaekke}>
          {uploader ? (
            <ActivityIndicator color={HVID} size="large" />
          ) : (
            <>
              <Knap tekst="Tag igen" onPress={() => setBillede(null)} />
              <Knap tekst="Brug billede" onPress={brugBillede} />
            </>
          )}
        </View>
      </View>
    );
  }

  // 4) Kameraet er klar
  return (
    <View style={styles.sort}>
      {/* Kameraet fylder hele skærmen. Knapperne ligger ovenpå som søskende,
          ikke inde i CameraView. */}
      <CameraView ref={kameraRef} facing={retning} style={StyleSheet.absoluteFill} />

      <View style={styles.bundRaekke}>
        <Pressable
          onPress={() => setRetning(retning === 'back' ? 'front' : 'back')}
          style={styles.vendKnap}
          hitSlop={10}
        >
          <Text style={styles.vendTekst}>Vend</Text>
        </Pressable>

        {/* Den store runde udløserknap */}
        <Pressable
          onPress={tagBillede}
          style={({ pressed }) => [styles.udloeser, pressed && styles.udloeserTrykket]}
        />

        {/* Tom boks, så udløseren står i midten */}
        <View style={styles.vendKnap} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sort: {
    flex: 1,
    backgroundColor: '#000',
  },
  centreret: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  besked: {
    color: HVID,
    fontSize: 16,
    textAlign: 'center',
  },
  bundRaekke: {
    position: 'absolute', // ligger ovenpå kameraet
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  udloeser: {
    width: 76,
    height: 76,
    borderRadius: 38, // halvdelen af bredden giver en cirkel
    backgroundColor: HVID,
    borderWidth: 5,
    borderColor: GULD,
  },
  udloeserTrykket: {
    transform: [{ scale: 0.9 }],
  },
  vendKnap: {
    width: 70,
    alignItems: 'center',
  },
  vendTekst: {
    color: HVID,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
