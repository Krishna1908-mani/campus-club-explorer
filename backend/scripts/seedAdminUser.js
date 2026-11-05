import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function run() {
  console.log('--- Checking & Confirming Supabase Auth Users ---');

  const { data: { users }, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
  if (listErr) {
    console.error('Error listing users:', listErr.message);
    process.exit(1);
  }

  console.log(`Found ${users.length} registered users in Supabase.`);

  // Confirm all existing users who have pending confirmations
  for (const user of users) {
    if (!user.email_confirmed_at) {
      console.log(`Confirming email for: ${user.email}`);
      const { error: confErr } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        email_confirm: true,
      });
      if (confErr) {
        console.error(`Failed to confirm ${user.email}:`, confErr.message);
      } else {
        console.log(`Successfully confirmed: ${user.email}`);
      }
    } else {
      console.log(`User already confirmed: ${user.email} (Role: ${user.user_metadata?.role || 'student'})`);
    }
  }

  // Check if admin@campus.edu exists
  const adminUser = users.find((u) => u.email.toLowerCase() === 'admin@campus.edu');
  if (!adminUser) {
    console.log('Creating admin@campus.edu...');
    const { data: newAdmin, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@campus.edu',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        full_name: 'Campus Administrator',
        role: 'admin',
      },
    });

    if (createErr) {
      console.error('Failed to create admin:', createErr.message);
    } else {
      console.log('Successfully created admin@campus.edu (password: admin123)');

      // Also ensure profile exists in profiles table
      const { error: profErr } = await supabaseAdmin.from('profiles').upsert({
        id: newAdmin.user.id,
        email: 'admin@campus.edu',
        full_name: 'Campus Administrator',
        role: 'admin',
      });
      if (profErr) console.warn('Profile upsert notice:', profErr.message);
    }
  } else {
    console.log('Ensuring admin@campus.edu has admin role and confirmed status...');
    const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(adminUser.id, {
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        ...adminUser.user_metadata,
        role: 'admin',
        full_name: adminUser.user_metadata?.full_name || 'Campus Administrator',
      },
    });
    if (updateErr) {
      console.error('Failed to update admin:', updateErr.message);
    } else {
      console.log('admin@campus.edu credentials updated to password: admin123, role: admin');
    }

    // Ensure profile has role admin
    await supabaseAdmin.from('profiles').upsert({
      id: adminUser.id,
      email: 'admin@campus.edu',
      full_name: adminUser.user_metadata?.full_name || 'Campus Administrator',
      role: 'admin',
    });
  }

  console.log('--- Done! All users verified and Admin credentials ready. ---');
}

run().catch(console.error);

