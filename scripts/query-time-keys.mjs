import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data } = await supabase.from('elections').select('*').limit(1);
  if (data && data[0]) {
    const keys = Object.keys(data[0]);
    const timeKeys = keys.filter(k => /date|time|at/i.test(k));
    console.log('Time-related Keys:', timeKeys);
  }
}

run();
