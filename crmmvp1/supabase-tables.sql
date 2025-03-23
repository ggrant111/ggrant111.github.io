-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  username TEXT,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  funnelStage TEXT NOT NULL DEFAULT 'Initial Contact',
  lastContact TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  leadDate TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  vehicle TEXT,
  sourceType TEXT,
  sourceDetails TEXT,
  salespersonId UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Additional fields from the mock data
  upType TEXT,
  interests TEXT[],
  salesHistory JSONB
);

-- Insert default users
INSERT INTO public.users (name, email, password, username, role)
VALUES
  ('Demo User', 'demo@example.com', 'password', 'demo', 'Manager'),
  ('Admin User', 'admin@example.com', 'admin123', 'admin', 'Admin');

-- Add Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
-- For now, let's disable RLS policies until we set up proper auth
-- We'll use application-level auth for the MVP

-- Allow public access to users table for now (for development)
CREATE POLICY "Allow public access to users" ON public.users
  FOR ALL USING (true);

-- Allow public access to customers table for now (for development)
CREATE POLICY "Allow public access to customers" ON public.customers
  FOR ALL USING (true);

-- Note: In a production environment, you would enable proper RLS policies
-- The following policies would be used with Supabase Auth:

/*
-- Create policies for users table
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid()::uuid = id);
  
CREATE POLICY "Admins can manage all users" ON public.users
  USING (EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()::uuid AND role = 'Admin'
  ));

-- Create policies for customers table
CREATE POLICY "Salespeople can view their assigned customers" ON public.customers
  FOR SELECT USING (
    salespersonId = auth.uid()::uuid OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()::uuid AND 
      (role = 'Manager' OR role = 'Admin' OR role = 'BDC Agent' OR role = 'BDC Manager')
    )
  );

CREATE POLICY "Salespeople can update their assigned customers" ON public.customers
  FOR UPDATE USING (
    salespersonId = auth.uid()::uuid OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()::uuid AND 
      (role = 'Manager' OR role = 'Admin')
    )
  );

CREATE POLICY "Managers and Admins can insert customers" ON public.customers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()::uuid AND 
      (role = 'Manager' OR role = 'Admin' OR role = 'BDC Agent' OR role = 'BDC Manager')
    )
  );
*/ 