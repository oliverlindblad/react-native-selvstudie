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
// placering er valgfri: { latitude, longitude } når noten oprettes fra kortet.
export function opretNote(tekst, placering = null) {
  const nyNote = {
    text: tekst,
    oprettet: serverTimestamp(), // tidspunktet sættes af Firebase-serveren
  };
  if (placering) {
    nyNote.placering = placering;
  }
  return addDoc(noterRef, nyNote);
}

// READ (realtid): hele listen. Kalder callback, hver gang noget ændrer sig.
// Returnerer en funktion, der stopper lytningen igen.
export function lytTilNoter(callback) {
  const q = query(noterRef, orderBy('oprettet', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const noter = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(noter);
  });
}

// READ (realtid): én note. Kalder callback med noten, eller null hvis den er slettet.
export function lytTilNote(id, callback) {
  return onSnapshot(doc(db, 'noter', id), (snapshot) => {
    callback(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
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

// UPDATE: gem billedets sti og URL på noten.
// Selve billedet ligger i Supabase Storage. Firestore gemmer kun, hvor det ligger.
export function opdaterNoteBillede(id, billede) {
  return updateDoc(doc(db, 'noter', id), {
    billedSti: billede.sti,
    billedUrl: billede.url,
  });
}

// DELETE: slet en note
export function sletNote(id) {
  return deleteDoc(doc(db, 'noter', id));
}
