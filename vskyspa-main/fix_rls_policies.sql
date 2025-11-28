-- Fix RLS policies for bookings table - DISABLE RLS TEMPORARILY FOR TESTING
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_slots DISABLE ROW LEVEL SECURITY;

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Public read access for bookings" ON bookings;
DROP POLICY IF EXISTS "Public write access for bookings" ON bookings;
DROP POLICY IF EXISTS "Public update access for bookings" ON bookings;
DROP POLICY IF EXISTS "Public delete access for bookings" ON bookings;

DROP POLICY IF EXISTS "Public read access for blocked_slots" ON blocked_slots;
DROP POLICY IF EXISTS "Public write access for blocked_slots" ON blocked_slots;
DROP POLICY IF EXISTS "Public update access for blocked_slots" ON blocked_slots;
DROP POLICY IF EXISTS "Public delete access for blocked_slots" ON blocked_slots;

-- Re-enable RLS with permissive policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;

-- Create new permissive policies
CREATE POLICY "Allow all operations on bookings" ON bookings
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on blocked_slots" ON blocked_slots
  FOR ALL USING (true) WITH CHECK (true);
