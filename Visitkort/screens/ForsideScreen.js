import { View, Text, Image, Pressable, Linking, StyleSheet } from 'react-native';
import Knap from '../components/Knap';
import { faelles } from '../constants/faellesStyles';
import { GROEN, GULD } from '../constants/farver';

// Side 1: selve visitkortet
export default function ForsideScreen({ onOmOs, onNoter }) {
  return (
    <View style={faelles.side}>
      <View style={faelles.kort}>
        {/* Stien starter med ../ fordi filen nu ligger i screens-mappen */}
        <Image
          source={require('../assets/carlsberg.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={faelles.titel}>Carlsberg</Text>
        <Text style={styles.undertitel}>Siden 1847</Text>

        <View style={faelles.streg} />

        <Text style={faelles.tekst}>
          Dansk bryggeri grundlagt af J.C. Jacobsen i Valby, København.
        </Text>

        <View style={styles.kontakt}>
          <Text style={styles.kontaktLinje}>J.C. Jacobsens Gade 1, København V</Text>
          <Pressable onPress={() => Linking.openURL('https://www.carlsberggroup.com')}>
            <Text style={[styles.kontaktLinje, styles.link]}>carlsberggroup.com</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.knapRaekke}>
        <Knap tekst="Om os" onPress={onOmOs} />
        <Knap tekst="Smagsnoter" onPress={onNoter} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 90,
    marginBottom: 16,
  },
  undertitel: {
    fontSize: 14,
    color: GULD,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  kontakt: {
    marginTop: 8,
    alignItems: 'center',
  },
  kontaktLinje: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  link: {
    color: GROEN,
    textDecorationLine: 'underline',
  },
  knapRaekke: {
    flexDirection: 'row', // knapperne ved siden af hinanden
    gap: 12,
  },
});
