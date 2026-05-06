import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '.env.staging' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.staging');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('🚀 Starting Staging Seed...');

  const password = 'VotteryTest2026!';

  const testAccounts = [
    { email: 'admin@vottery.test', role: 'super_admin', username: 'admin_master' },
    { email: 'senator.smith@vottery.test', role: 'creator', username: 'senator_smith' },
    { email: 'voter.verified@vottery.test', role: 'voter', username: 'verified_voter_01' },
    { email: 'voter.new@vottery.test', role: 'voter', username: 'new_voter_99' },
    { email: 'social.star@vottery.test', role: 'creator', username: 'social_star' },
  ];

  for (const acc of testAccounts) {
    console.log(`Creating user: ${acc.email}...`);
    
    // 1. Create Auth User
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: acc.email,
      password: password,
      email_confirm: true
    });

    if (authError && !authError.message.includes('already registered')) {
      console.error(`Failed to create auth user ${acc.email}:`, authError.message);
      continue;
    }

    const userId = authUser?.user?.id || (await getUserIdByEmail(acc.email));

    // 2. Create Profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        email: acc.email,
        username: acc.username,
        full_name: acc.username.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        role: acc.role,
        is_verified: acc.email.includes('verified') || acc.role === 'super_admin'
      });

    if (profileError) {
      console.error(`Failed to create profile for ${acc.email}:`, profileError.message);
    }
  }

  // 3. Seed Hubs
  console.log('Seeding Hubs...');
  const hubs = [
    { name: 'Politics & Governance', slug: 'politics' },
    { name: 'Entertainment & Social', slug: 'social' },
    { name: 'Corporate & HR', slug: 'corporate' }
  ];

  await supabase.from('navigation_hubs').upsert(hubs, { onConflict: 'slug' });

  // 4. Seed Elections
  console.log('Seeding Elections...');
  const creatorId = await getUserIdByEmail('senator.smith@vottery.test');
  if (creatorId) {
    const electionId = uuidv4();
    await supabase.from('elections').upsert({
      id: electionId,
      title: 'Staging Test Election: The Future of Vottery',
      description: 'A non-gamified election to test core voting mechanics.',
      creator_id: creatorId,
      status: 'active',
      visibility: 'public',
      election_type: 'approval',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 86400000 * 7).toISOString() // 7 days from now
    });
    
    // Gamified election
    const gamifiedId = uuidv4();
    await supabase.from('elections').upsert({
      id: gamifiedId,
      title: 'Monthly Mega Draw: Gamification Test',
      description: 'Vote to enter the lottery! Test the slot machine behavior.',
      creator_id: creatorId,
      status: 'active',
      visibility: 'public',
      election_type: 'ranked',
      is_gamified: true,
      gamification_config: {
        prize_pool: 1000000,
        winners_count: 3
      },
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 86400000 * 30).toISOString()
    });
  }

  console.log('✅ Staging Seed Complete!');
}

async function getUserIdByEmail(email) {
  const { data } = await supabase.from('user_profiles').select('id').eq('email', email).single();
  return data?.id;
}

seed().catch(err => {
  console.error('Fatal Seeding Error:', err);
  process.exit(1);
});
