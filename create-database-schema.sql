-- Create the database schema for V&SKY SPA booking system

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  time_hour INTEGER NOT NULL CHECK (time_hour >= 0 AND time_hour <= 23),
  time_minute INTEGER NOT NULL CHECK (time_minute >= 0 AND time_minute <= 59),
  service TEXT NOT NULL,
  people INTEGER NOT NULL CHECK (people >= 1 AND people <= 2),
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  notes TEXT,
  price INTEGER,
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'online')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blocked_slots table
CREATE TABLE IF NOT EXISTS blocked_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  time_hour INTEGER NOT NULL CHECK (time_hour >= 0 AND time_hour <= 23),
  time_minute INTEGER NOT NULL CHECK (time_minute >= 0 AND time_minute <= 59),
  reason TEXT,
  created_by TEXT NOT NULL,
  blocked_spots INTEGER NOT NULL DEFAULT 2 CHECK (blocked_spots >= 1 AND blocked_spots <= 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_blocked_slots_date ON blocked_slots(date);
CREATE INDEX IF NOT EXISTS idx_blocked_slots_created_at ON blocked_slots(created_at);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for bookings table
CREATE POLICY "Allow all operations on bookings" ON bookings
  FOR ALL USING (true) WITH CHECK (true);

-- Create RLS policies for blocked_slots table
CREATE POLICY "Allow all operations on blocked_slots" ON blocked_slots
  FOR ALL USING (true) WITH CHECK (true);

-- Create function to cancel past bookings
CREATE OR REPLACE FUNCTION cancel_past_bookings()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE bookings
  SET status = 'cancelled'
  WHERE status = 'pending'
    AND (date < CURRENT_DATE
         OR (date = CURRENT_DATE
             AND (time_hour < EXTRACT(hour FROM NOW())
                  OR (time_hour = EXTRACT(hour FROM NOW())
                      AND time_minute < EXTRACT(minute FROM NOW())))));
END;
$$;

-- Grant necessary permissions
GRANT ALL ON bookings TO anon, authenticated;
GRANT ALL ON blocked_slots TO anon, authenticated;
GRANT EXECUTE ON FUNCTION cancel_past_bookings() TO anon, authenticated;
