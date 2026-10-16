import { useState } from "react";
import { StyleSheet, Text, View, Image, Pressable, ScrollView, Linking } from "react-native";
import { StatusBar } from "expo-status-bar";

// Carlsbergs farver samlet ét sted, så de er nemme at ændre
const GROEN = "#00653A";
const MOERKEGROEN = "#00452A";
const GULD = "#C8A951";
const HVID = "#FFFFFF";

export default function App() {
  // useState husker hvilken side der vises. Når setSide kaldes, tegnes appen igen.
  const [side, setSide] = useState("forside");

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {side === "forside" ? <Forside onOmOs={() => setSide("om")} /> : <OmOs onTilbage={() => setSide("forside")} />}
    </View>
  );
}

// Side 1: selve visitkortet
function Forside({ onOmOs }) {
  return (
    <View style={styles.side}>
      <View style={styles.kort}>
        {/* Skift til ./assets/carlsberg-logo.png når du har gemt logoet i assets-mappen */}
        <Image source={require("./assets/carlsberg.png")} style={styles.logo} />

        <Text style={styles.titel}>Carlsberg</Text>
        <Text style={styles.undertitel}>Siden 1847</Text>

        <View style={styles.streg} />

        <Text style={styles.tekst}>Dansk bryggeri grundlagt af J.C. Jacobsen i Valby, København.</Text>

        <View style={styles.kontakt}>
          <Text style={styles.kontaktLinje}>J.C. Jacobsens Gade 1, København V</Text>
          <Pressable onPress={() => Linking.openURL("https://www.carlsberggroup.com")}>
            <Text style={[styles.kontaktLinje, styles.link]}>carlsberggroup.com</Text>
          </Pressable>
        </View>
      </View>

      <Knap tekst="Om os" onPress={onOmOs} />
    </View>
  );
}

// Side 2: om virksomheden
function OmOs({ onTilbage }) {
  return (
    <ScrollView contentContainerStyle={styles.side}>
      <View style={styles.kort}>
        <Text style={styles.titel}>Om Carlsberg</Text>
        <View style={styles.streg} />
        <Text style={styles.tekst}>Carlsberg blev grundlagt i 1847 af brygger J.C. Jacobsen, som opkaldte bryggeriet efter sin søn Carl.</Text>
        <Text style={styles.tekst}>I dag er Carlsberg en af verdens største bryggerikoncerner med øl som Carlsberg, Tuborg og Kronenbourg 1664.</Text>
      </View>

      <Knap tekst="Tilbage" onPress={onTilbage} />
    </ScrollView>
  );
}

// Genbrugelig knap. Pressable giver os fuld kontrol over udseendet, i modsætning til Button.
function Knap({ tekst, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.knap, pressed && styles.knapTrykket]}>
      <Text style={styles.knapTekst}>{tekst}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // fylder hele skærmen
    backgroundColor: GROEN,
  },
  side: {
    flexGrow: 1,
    justifyContent: "center", // centrerer lodret (fordi flexDirection er column)
    alignItems: "center", // centrerer vandret
    padding: 24,
    paddingTop: 60, // plads til statuslinjen på iPhone
  },
  kort: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: HVID,
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    // skygge på iOS
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    // skygge på Android
    elevation: 8,
  },
  logo: {
    width: 100,
    height: 93,
    marginBottom: 16,
  },
  titel: {
    fontSize: 32,
    fontWeight: "bold",
    color: GROEN,
  },
  undertitel: {
    fontSize: 14,
    color: GULD,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 4,
  },
  streg: {
    width: 60,
    height: 2,
    backgroundColor: GULD,
    marginVertical: 20,
  },
  tekst: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  kontakt: {
    marginTop: 8,
    alignItems: "center",
  },
  kontaktLinje: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  link: {
    color: GROEN,
    textDecorationLine: "underline",
  },
  knap: {
    marginTop: 24,
    backgroundColor: GULD,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  knapTrykket: {
    backgroundColor: MOERKEGROEN,
  },
  knapTekst: {
    color: HVID,
    fontSize: 16,
    fontWeight: "bold",
  },
});
