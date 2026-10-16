import { supabase } from '../config/supabase';
import { opdaterNoteBillede } from './noteService';

// Navnet på din bucket i Supabase (store og små bogstaver tæller)
const BUCKET = 'Billeder';

// Upload et billede fra telefonen til Supabase Storage.
// Returnerer både stien (bruges til at slette) og en offentlig URL (bruges til at vise).
export async function uploadBillede(noteId, billede) {
  // Billedet er en lokal fil på telefonen (file://...), både fra
  // billedbiblioteket og fra kameraet. Vi læser den ind som rå bytes.
  const respons = await fetch(billede.uri);
  const bytes = await respons.arrayBuffer();

  // Kameraet giver ingen mimeType, så vi går ud fra JPEG
  const contentType = billede.mimeType ?? 'image/jpeg';
  const endelse = contentType.split('/')[1] ?? 'jpg';

  // Unikt filnavn: notens id + tidspunkt
  const sti = `noter/${noteId}-${Date.now()}.${endelse}`;

  const { error } = await supabase.storage.from(BUCKET).upload(sti, bytes, { contentType });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(sti);
  return { sti, url: data.publicUrl };
}

// Slet et billede fra Supabase Storage ud fra dets sti
export async function sletBillede(sti) {
  const { error } = await supabase.storage.from(BUCKET).remove([sti]);
  if (error) throw error;
}

// Hele flowet for at give en note et nyt billede. Bruges både af
// billedbiblioteket (DetaljeScreen) og kameraet (KameraScreen).
export async function skiftBillede(noteId, billede, gammelSti) {
  // 1) Upload filen til Supabase Storage
  const nytBillede = await uploadBillede(noteId, billede);

  // 2) Gem stien og URL'en på noten i Firestore
  await opdaterNoteBillede(noteId, nytBillede);

  // 3) Slet det gamle billede, så der ikke ligger ubrugte filer
  if (gammelSti) {
    await sletBillede(gammelSti);
  }

  return nytBillede;
}
