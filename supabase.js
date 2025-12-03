import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";


export const supabase = createClient(
"https://uyrhqxztuymnsoqdjtyw.supabase.co",
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cmhxeHp0dXltbnNvcWRqdHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MzgxMjEsImV4cCI6MjA4MDMxNDEyMX0.jkad7Tpplc0CxrWym8zrjhdCohRIAv89uLyeA5u6-_o"
);