const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Fail fast if misconfigured
if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL and Key must be provided in the environment variables');
}

// Initializing the client
// To avoid app crash in local dev without env vars set, we mock if missing
const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

module.exports = supabase;
