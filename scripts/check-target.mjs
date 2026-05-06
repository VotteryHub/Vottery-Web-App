import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data } = await supabase
    .from('elections')
    .select('id, title, voting_type, status, end_date')
    .eq('id', 'cc8b37a3-f859-45ab-ac8f-29d8c1d0af8c')
    .single();
    
  console.log('Target Election:', JSON.stringify(data, null, 2));
}

run();
