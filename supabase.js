import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ---- IMPORTANT ----
// Replace with YOUR real Supabase URL + anon public key

const SUPABASE_URL = "https://qciazrzlnsiglnheyxos.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjaWF6cnpsbnNpZ2xuaGV5eG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNjEyNjcsImV4cCI6MjA4MDkzNzI2N30.0W3Bro5TiNQBfQspyRX8Yj8U7Kx_Dg24TUIjuVU5TSs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
