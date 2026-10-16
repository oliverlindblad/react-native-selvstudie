import 'react-native-url-polyfill/auto'; // Supabase har brug for URL-funktioner, som React Native mangler
import { createClient } from '@supabase/supabase-js';

// Vi bruger kun Supabase til at gemme billeder, ikke til login.
// Derfor slår vi gemning af login-sessioner fra.
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
