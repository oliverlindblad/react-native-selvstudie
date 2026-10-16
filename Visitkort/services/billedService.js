import { supabase } from "../config/supabase";

// Navnet på den bucket (mappe), du opretter i Supabase
const BUCKET = "Billeder";

// Upload et billede fra telefonen til Supabase Storage.
// Returnerer både stien (bruges til at slette) og en offentlig URL (bruges til at vise).
export async function uploadBillede(noteId, billede) {
  // Billedet fra image-picker er en lokal fil på telefonen (file://...).
  // Vi læser filen ind som rå bytes (ArrayBuffer), som Supabase kan uploade.
  const respons = await fetch(billede.uri);
  const bytes = await respons.arrayBuffer();

  const contentType = billede.mimeType ?? "image/jpeg";
  const endelse = contentType.split("/")[1] ?? "jpg";

  // Unikt filnavn: notens id + tidspunkt. Så overskriver et nyt billede
  // aldrig et gammelt, og telefonen viser ikke en gammel cachet version.
  const sti = `noter/${noteId}-${Date.now()}.${endelse}`;

  const { error } = await supabase.storage.from(BUCKET).upload(sti, bytes, { contentType });
  if (error) throw error;

  // Bucket'en er offentlig, så billedet kan hentes med en almindelig URL
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(sti);

  return { sti, url: data.publicUrl };
}

// Slet et billede fra Supabase Storage ud fra dets sti
export async function sletBillede(sti) {
  const { error } = await supabase.storage.from(BUCKET).remove([sti]);
  if (error) throw error;
}
