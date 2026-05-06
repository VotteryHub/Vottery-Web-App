import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log('Fetching all elections to filter in JS...');
  const { data, error } = await supabase
    .from('elections')
    .select('id, title, voting_type, status, end_date')
    .limit(1000);
    
  if (error) {
    console.error('Error:', error);
  } else {
    const diverse = data.filter(e => 
      e.voting_type && (
        e.voting_type.toLowerCase().includes('approval') || 
        e.voting_type.toLowerCase().includes('ranked')
      )
    );
    console.log('Diverse Elections:', JSON.stringify(diverse, null, 2));
  }
}

run();
