-- Fix RLS policies for blocked_slots table to resolve 406 Not Acceptable errors

-- First, check current RLS status
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'blocked_slots';

-- Disable RLS temporarily
ALTER TABLE blocked_slots DISABLE ROW LEVEL SECURITY;

-- Drop any existing problematic policies
DROP POLICY IF EXISTS "Public read access for blocked_slots" ON blocked_slots;
DROP POLICY IF EXISTS "Public write access for blocked_slots" ON blocked_slots;
DROP POLICY IF EXISTS "Public update access for blocked_slots" ON blocked_slots;
DROP POLICY IF EXISTS "Public delete access for blocked_slots" ON blocked_slots;
DROP POLICY IF EXISTS "Allow all operations on blocked_slots" ON blocked_slots;

-- Re-enable RLS
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;

-- Create permissive policies that allow all operations
CREATE POLICY "Allow all operations on blocked_slots" ON blocked_slots
  FOR ALL USING (true) WITH CHECK (true);

-- Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'blocked_slots';
