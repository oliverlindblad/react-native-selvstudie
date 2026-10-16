import { StyleSheet } from 'react-native';
import { GROEN, GULD, HVID } from './farver';

// Styles, som flere skærme bruger. Så skal de kun rettes ét sted.
export const faelles = StyleSheet.create({
  side: {
    flexGrow: 1,
    justifyContent: 'center', // centrerer lodret (fordi flexDirection er column)
    alignItems: 'center', // centrerer vandret
    padding: 24,
    paddingTop: 60, // plads til statuslinjen på iPhone
  },
  kort: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: HVID,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    // skygge på iOS
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    // skygge på Android
    elevation: 8,
  },
  titel: {
    fontSize: 32,
    fontWeight: 'bold',
    color: GROEN,
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
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
});
