import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log('Registering test user...');
  const { data, error } = await supabase.auth.signUp({
    email: 'test.preview@vottery.test',
    password: 'VotteryTest2026!'
  });
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('User created:', data.user.email);
    console.log('Confirmation sent to email. If auto-confirm is off, you may need to confirm manually.');
  }
}

run();
