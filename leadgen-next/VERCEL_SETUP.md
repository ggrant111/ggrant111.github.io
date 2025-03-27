# Vercel Deployment Setup Guide

This project requires specific environment variables to be set in your Vercel project for proper functioning. Follow these steps to configure your Vercel deployment.

## Environment Variables

Add the following environment variables to your Vercel project's settings:

### Supabase Configuration

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase project anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase project service role key

### Email Configuration

- `EMAIL_USER` - Email address for sending leads
- `EMAIL_PASS` - Password or app-specific password for the email account

## Setting Environment Variables in Vercel

1. Go to your Vercel dashboard and select your project
2. Navigate to the "Settings" tab
3. Scroll down to the "Environment Variables" section
4. Add each environment variable with its corresponding value
5. Click "Save" to apply the changes

## Important Notes

- Environment variables added to Vercel will not be used during the build process, only at runtime
- The application will use mock data during build to avoid errors
- After deployment, the runtime will use the real environment variables for connecting to Supabase and sending emails
