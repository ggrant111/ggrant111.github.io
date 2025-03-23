# Supabase Integration for CRM MVP

This document explains how to set up and integrate Supabase as the database backend for the CRM MVP application.

## What is Supabase?

Supabase is an open-source Firebase alternative providing database, authentication, storage, and real-time capabilities. We're using it to replace our mock data with a real, persistent database.

## Prerequisites

1. You need a Supabase account. Visit [https://supabase.com/](https://supabase.com/) to sign up.
2. You should have already created a Supabase project for this application.

## Setup Steps

### 1. Get Your Supabase Credentials

1. In your Supabase dashboard, go to your project.
2. Click on the "Settings" icon (gear) in the left sidebar.
3. Click on "API" in the submenu.
4. Find and copy your:
   - Project URL
   - `anon` public key (not the secret key)

### 2. Update Environment Variables

1. Open the `.env` file in the root of your project.
2. Add your Supabase credentials:
   ```
   SUPABASE_URL=your_project_url
   SUPABASE_KEY=your_anon_key
   ```

### 3. Create Database Tables

In your Supabase dashboard:

1. Go to the "Table Editor" in the left sidebar.
2. Create the following tables:

#### users Table

Create a new table named `users` with the following columns:

- `id` - uuid, primary key
- `name` - text
- `email` - text, unique
- `password` - text (note: in a production app, you'd use Supabase Auth)
- `role` - text (e.g., "Salesperson", "Manager", "Admin", etc.)
- `created_at` - timestamp with time zone, default: now()

#### customers Table

Create a new table named `customers` with the following columns:

- `id` - uuid, primary key
- `name` - text
- `email` - text
- `phone` - text
- `funnelStage` - text (e.g., "Initial Contact", "Test Drive", etc.)
- `lastContact` - timestamp with time zone
- `leadDate` - timestamp with time zone
- `vehicle` - text
- `sourceType` - text
- `sourceDetails` - text
- `salespersonId` - uuid, references users(id)
- `created_at` - timestamp with time zone, default: now()

### 4. Run the Setup Script

We've provided a setup script to populate your Supabase tables with initial data:

```bash
node setup-supabase.js
```

This will:

- Insert default users into the `users` table
- Provide detailed setup instructions

## Using Supabase in the Application

After completing the setup, the application will automatically use Supabase for:

1. User authentication
2. Storing and retrieving customer data
3. Fetching salespeople lists
4. Checking user permissions

## Notes for Development

- **API Changes**: The backend API endpoints remain the same, but their implementations now use Supabase.
- **Error Handling**: Check the browser console for any errors related to Supabase connectivity.
- **Local Storage**: User authentication still uses session storage for simplicity, but in production, you should use JWT tokens or Supabase Auth.

## Next Steps

1. Implement proper authentication using Supabase Auth
2. Add Row Level Security (RLS) policies in Supabase for data protection
3. Implement real-time updates using Supabase's real-time subscriptions

## Troubleshooting

**Cannot connect to Supabase**:

- Verify your `SUPABASE_URL` and `SUPABASE_KEY` in the `.env` file
- Check if your IP is allowed in Supabase (if you've restricted access)

**Authentication issues**:

- Make sure users exist in the users table
- Verify email/password combinations

**Data not showing up**:

- Check browser console for errors
- Verify your tables have the correct columns and relationships
