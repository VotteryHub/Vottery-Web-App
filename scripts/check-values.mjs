import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data } = await supabase.from('elections').select('id, title, start_time, end_date, end_time').limit(1);
  if (data && data[0]) {
    console.log('Sample data:', data[0]);
  }
}

run();
