import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log('Searching for any active diverse elections...');
  const { data, error } = await supabase
    .from('elections')
    .select('id, title, voting_type, status, end_date')
    .eq('status', 'active');
    
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('All Active:', JSON.stringify(data.slice(0, 20), null, 2));
  }
}

run();
