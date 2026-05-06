import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const REGRESSION_USER = 'test.preview@vottery.test';

async function run() {
  console.log('🚀 Seeding Regression Data...');

  // Sign in as the regression user to bypass RLS (if policy allows creator)
  const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
    email: REGRESSION_USER,
    password: 'VotteryTest2026!' // Standard test password from seed-staging
  });

  if (signInError) {
    console.error('Sign in failed:', signInError.message);
    return;
  }

  const userId = authData.user.id;

  const elections = [
    {
      title: 'Regression: Step 1 Hang Fix',
      description: 'Testing that this advances to ballot automatically.',
      voting_type: 'Approval',
      status: 'active',
      created_by: userId,
      require_mcq: false
    },
    {
      title: 'Regression: Normalization Test',
      description: 'Testing that Ranked Choice still works.',
      voting_type: 'Ranked Choice',
      status: 'active',
      created_by: userId
    },
    {
      title: 'Regression: Plus-Minus Test',
      description: 'Testing Plus-Minus voting.',
      voting_type: 'Plus-Minus',
      status: 'active',
      created_by: userId
    }
  ];

  for (const election of elections) {
    const { data, error } = await supabase
      .from('elections')
      .insert(election)
      .select()
      .single();

    if (error) {
      console.error(`Failed to insert ${election.title}:`, error.message);
      continue;
    }

    console.log(`✅ Created: ${election.title} (${data.id})`);
    
    // Add dummy options
    await supabase.from('election_options').insert([
      { election_id: data.id, title: 'Option 1', description: 'Test option' },
      { election_id: data.id, title: 'Option 2', description: 'Test option' }
    ]);
  }

  console.log('✨ Regression seeding complete!');
}

run();
