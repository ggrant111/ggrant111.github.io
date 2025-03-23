# CRM MVP Supabase Setup Instructions

## Step 1: Set Up Tables in Supabase

1. **Log in to Supabase**

   - Go to [Supabase](https://app.supabase.com/) and log in to your account.
   - Select your project "yvnemdjdhiihdwbijjfo" or navigate to it.

2. **Open the SQL Editor**

   - Click on the "SQL Editor" tab in the left sidebar.
   - Click "New Query" to create a new SQL query.

3. **Copy and Paste the SQL Script**

   - Copy the entire contents of the `supabase-tables.sql` file.
   - Paste it into the SQL Editor.

4. **Run the SQL Script**
   - Click "Run" to execute the script.
   - This will create the tables and insert the basic user records.

## Step 2: Import Mock Data

After creating the tables, run the setup script to import mock data:

```bash
node setup-supabase.js
```

This script will:

- Connect to your Supabase project
- Insert default users (if they haven't been added by the SQL script)
- Import all mock customer data
- Update you on the progress in the console

## Step 3: Verify the Setup

1. **Check Tables in Supabase**

   - Go to the "Table Editor" in the Supabase dashboard.
   - Verify that both `users` and `customers` tables exist.
   - Check that data has been imported correctly.

2. **Run the Application**
   - Start your application: `npm run dev`
   - Navigate to the application in your browser.
   - Log in with one of the default accounts:
     - Username: `demo`, Password: `password` (Manager role)
     - Username: `admin`, Password: `admin123` (Admin role)

## Troubleshooting

If you encounter any issues:

1. **SQL Errors**

   - Check the error message in the SQL Editor.
   - If you get a "relation already exists" error, that's fine - it means the table was already created.

2. **Data Import Errors**

   - Check the console output from the `setup-supabase.js` script.
   - Common issues include:
     - Table doesn't exist
     - Field type mismatch
     - Missing required fields
     - Duplicate primary keys

3. **Authentication Errors**
   - Ensure the Supabase URL and key in your `.env` file are correct.
   - Make sure the users table has the required users with correct credentials.

## Notes on Security

For this MVP, we're using simple password storage. In a production environment:

1. Use Supabase Auth for proper authentication
2. Implement Row Level Security (RLS) with more granular policies
3. Don't store plaintext passwords in the database

## Next Steps

Once your database is set up and working:

1. Test customer management functionality
2. Test user management (if you have admin access)
3. Explore Supabase's real-time capabilities for future enhancements
