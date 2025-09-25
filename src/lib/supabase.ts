import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL! ||
  'https://dxpkkikicfxpzxzyygqq.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY! ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4cGtraWtpY2Z4cHp4enl5Z3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MzQ3MzQsImV4cCI6MjA3NDMxMDczNH0.xBauHy1NzPupwDRthJWDOXk07GdnzyPNC8M6lTjedy8';

console.log(supabaseUrl, supabaseKey);
export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});
