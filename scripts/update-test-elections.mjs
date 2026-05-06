import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const futureDate = 'Dec 31, 2026';
  
  console.log('Updating test elections...');
  
  const { error: error1 } = await supabase
    .from('elections')
    .update({ status: 'active', end_date: futureDate })
    .eq('id', 'd9c52b46-c643-4e11-8eb4-4072bcdafc27');
    
  if (error1) console.error('Error updating Approval election:', error1);
  else console.log('Approval election updated successfully.');

  const { error: error2 } = await supabase
    .from('elections')
    .update({ status: 'active', end_date: futureDate })
    .eq('id', 'cc8b37a3-f859-45ab-ac8f-29d8c1d0af8c');
    
  if (error2) console.error('Error updating Ranked Choice election:', error2);
  else console.log('Ranked Choice election updated successfully.');
}

run();
