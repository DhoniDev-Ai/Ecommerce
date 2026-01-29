
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};

envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        let value = match[2].trim();
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
        }
        envVars[match[1].trim()] = value;
    }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);


async function fixAdminRole() {
    const email = 'hardikjain2030@gmail.com';
    console.log(`Checking public.users for ${email}...`);

    // 1. Check Public Users
    const { data: publicUsers, error: publicError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);

    if (publicUsers && publicUsers.length > 0) {
        const user = publicUsers[0];
        console.log('Found Public User:', { id: user.id, email: user.email, role: user.role });

        if (user.role !== 'admin') {
            console.log('Updating role to ADMIN...');
            const { error: updateError } = await supabase
                .from('users')
                .update({ role: 'admin' })
                .eq('id', user.id);

            if (updateError) console.error('Update failed:', updateError);
            else console.log('SUCCESS: User is now an Admin.');
        } else {
            console.log('User is already an Admin.');
        }
        return;
    }

    console.log("User NOT found in public.users. Checking Auth...");
    
    // 2. Check Auth Users (Requires Service Role)
    console.log("Listing all Auth Users...");
    const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    
    if (authError) {
        console.error("Auth API Error:", authError);
        return;
    }

    console.log(`Found ${authUsers.length} users in Auth:`);
    authUsers.forEach(u => console.log(` - ${u.email} (ID: ${u.id})`));

    const authUser = authUsers.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!authUser) {
        console.error(`User ${email} NOT FOUND in Auth.`);
        return;
    }

    console.log("Found Auth User:", authUser.id);
    console.log("Creating Public User entry...");

    // 3. Insert into Public Users
    const { error: insertError } = await supabase
        .from('users')
        .insert({
            id: authUser.id,
            email: authUser.email,
            full_name: 'Admin User',
            role: 'admin'
        });

    if (insertError) {
        console.error("Insert into public.users FAILED:", insertError);
    } else {
        console.log("SUCCESS: Created Public User with Admin Role.");
    }
}

fixAdminRole();
