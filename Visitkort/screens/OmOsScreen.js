import { View, Text, ScrollView } from 'react-native';
import Knap from '../components/Knap';
import { faelles } from '../constants/faellesStyles';

// Side 2: om virksomheden
export default function OmOsScreen({ onTilbage }) {
  return (
    <ScrollView contentContainerStyle={faelles.side}>
      <View style={faelles.kort}>
        <Text style={faelles.titel}>Om Carlsberg</Text>
        <View style={faelles.streg} />
        <Text style={faelles.tekst}>
          Carlsberg blev grundlagt i 1847 af brygger J.C. Jacobsen, som opkaldte
          bryggeriet efter sin søn Carl.
        </Text>
        <Text style={faelles.tekst}>
          I dag er Carlsberg en af verdens største bryggerikoncerner med øl som
          Carlsberg, Tuborg og Kronenbourg 1664.
        </Text>
      </View>

      <Knap tekst="Tilbage" onPress={onTilbage} />
    </ScrollView>
  );
}
