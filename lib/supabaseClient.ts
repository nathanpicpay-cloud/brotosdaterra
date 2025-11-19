import { createClient } from '@supabase/supabase-js';

// ⚠️ IMPORTANT: You must set these in your project environment variables or .env file
// If running locally, creating a .env file with these values is recommended.
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key-here';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);