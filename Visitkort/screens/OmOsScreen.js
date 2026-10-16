import { View, Text, ScrollView } from 'react-native';
import { faelles } from '../constants/faellesStyles';

// Side 2: om virksomheden
// Ingen "Tilbage"-knap længere: headeren har sin egen tilbage-pil
export default function OmOsScreen() {
  return (
    <ScrollView contentContainerStyle={[faelles.side, { paddingTop: 24 }]}>
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
    </ScrollView>
  );
}
