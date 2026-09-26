import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

/* Replace these two values with your Supabase project credentials. */
export const SUPABASE_URL = 'https://jjqxnsidbnibfnneaqwo.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_xa0AdT0m9SJ1Mrpiou4Nmw_Rby3-614';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const configured = !SUPABASE_URL.startsWith('YOUR_') && !SUPABASE_ANON_KEY.startsWith('YOUR_');
