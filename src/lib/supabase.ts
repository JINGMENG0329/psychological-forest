import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vcgzfsuynjfrrhxiqito.supabase.co';
const supabaseAnonKey = 'sb_publishable_geAWYU8rC6M-jmvdOzVtqg_U6Ucno2O';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
