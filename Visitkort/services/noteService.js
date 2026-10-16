import {
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Al kommunikation med Firestore samlet ét sted.
// Skærmene kalder bare disse funktioner og ved ikke noget om Firebase.

// En "collection" svarer til en tabel. Hver note er et "document" i den.
const noterRef = collection(db, 'noter');

// CREATE: opret en ny note. Firestore giver den selv et unikt id.
export function opretNote(tekst) {
  return addDoc(noterRef, {
    text: tekst,
    oprettet: serverTimestamp(), // tidspunktet sættes af Firebase-serveren
  });
}

// READ (realtid): kald callback med den nyeste liste, hver gang noget ændrer sig.
// Returnerer en funktion, der stopper lytningen igen.
export function lytTilNoter(callback) {
  const q = query(noterRef, orderBy('oprettet', 'asc'));

  return onSnapshot(q, (snapshot) => {
    // Lav Firestore-dokumenterne om til almindelige objekter: { id, text, oprettet }
    const noter = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(noter);
  });
}

// READ (én gang): hent en enkelt note ud fra dens id
export async function hentNote(id) {
  const snapshot = await getDoc(doc(db, 'noter', id));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

// UPDATE: ret teksten på en eksisterende note
export function opdaterNote(id, nyTekst) {
  return updateDoc(doc(db, 'noter', id), { text: nyTekst });
}

// DELETE: slet en note
export function sletNote(id) {
  return deleteDoc(doc(db, 'noter', id));
}
