# Revised Supabase Setup Guide

## Issue with UUIDs

There were two issues with the original SQL script:

1. It attempted to insert string IDs ('1', '2') into a UUID field
2. The RLS policies were incorrectly comparing UUID types with text types

Both issues have been fixed in the updated SQL script.

## Step 1: Run the SQL Script

1. Log into your Supabase dashboard at https://app.supabase.com
2. Select your project "yvnemdjdhiihdwbijjfo"
3. Go to the SQL Editor tab in the left sidebar
4. Click "New Query"
5. Copy and paste the contents of the revised `supabase-tables.sql` file
6. Click "Run" to execute the script

## Important: RLS Changes

To simplify the MVP development, we've temporarily disabled Row Level Security (RLS) policies and replaced them with open access policies. This means your data will be accessible without authentication through the Supabase API. This is fine for development, but should be changed for production.

## Step 2: Run the Setup Script

After running the SQL script to create tables, run the setup script which will:

1. Connect to Supabase and verify the tables exist
2. Fetch the generated UUIDs for users
3. Import customer data with proper relationship mapping

```bash
node setup-supabase.js
```

## Step 3: What Changed?

1. The SQL script now:

   - Lets Supabase generate UUIDs automatically for all records
   - Uses simpler RLS policies for development
   - Properly handles type conversions between UUID and text

2. The setup script now:
   - Gets existing user IDs from Supabase
   - Maps old string IDs to actual UUIDs
   - Removes customer IDs and lets Supabase generate them
   - Properly links customers to salespeople using UUIDs

## Step 4: Verify Setup

1. After running both scripts:

   - Check the "users" table in Supabase - you should see 2 users
   - Check the "customers" table - you should see your customer data
   - Relationships between customers and salespeople should work

2. Run the application:

   ```bash
   npm run dev
   ```

3. Log in with:
   - Username: `demo`, Password: `password`
   - Or: Username: `admin`, Password: `admin123`

If everything is working, you should see your customer data loaded from Supabase!
