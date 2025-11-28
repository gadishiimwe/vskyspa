-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create bookings table
CREATE TABLE bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date DATE NOT NULL,
  time_hour INTEGER NOT NULL CHECK (time_hour >= 0 AND time_hour <= 23),
  time_minute INTEGER NOT NULL CHECK (time_minute >= 0 AND time_minute <= 59),
  service TEXT NOT NULL,
  people INTEGER NOT NULL CHECK (people >= 1 AND people <= 2),
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  notes TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'online')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cancelled', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blocked_slots table
CREATE TABLE blocked_slots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date DATE NOT NULL,
  time_hour INTEGER NOT NULL CHECK (time_hour >= 0 AND time_hour <= 23),
  time_minute INTEGER NOT NULL CHECK (time_minute >= 0 AND time_minute <= 59),
  reason TEXT,
  created_by TEXT NOT NULL,
  blocked_spots INTEGER NOT NULL DEFAULT 2 CHECK (blocked_spots >= 1 AND blocked_spots <= 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_bookings_date_time ON bookings(date, time_hour, time_minute);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_blocked_slots_date_time ON blocked_slots(date, time_hour, time_minute);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings table
-- Allow public reads
CREATE POLICY "Public read access for bookings" ON bookings
  FOR SELECT USING (true);

-- Allow public writes for booking creation (no authentication required)
CREATE POLICY "Public write access for bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- Allow public updates (for admin panel)
CREATE POLICY "Public update access for bookings" ON bookings
  FOR UPDATE USING (true);

-- Allow public deletes (for admin panel)
CREATE POLICY "Public delete access for bookings" ON bookings
  FOR DELETE USING (true);

-- RLS Policies for blocked_slots table
-- Allow public reads
CREATE POLICY "Public read access for blocked_slots" ON blocked_slots
  FOR SELECT USING (true);

-- Allow public writes for blocked_slots (like bookings)
CREATE POLICY "Public write access for blocked_slots" ON blocked_slots
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update access for blocked_slots" ON blocked_slots
  FOR UPDATE USING (true);

CREATE POLICY "Public delete access for blocked_slots" ON blocked_slots
  FOR DELETE USING (true);

-- Simple function to create a booking (bypasses schema cache issues)
CREATE OR REPLACE FUNCTION create_booking_simple(
  p_date TEXT,
  p_time_hour INTEGER,
  p_time_minute INTEGER,
  p_service TEXT,
  p_people INTEGER,
  p_client_name TEXT,
  p_client_phone TEXT,
  p_notes TEXT,
  p_price NUMERIC,
  p_payment_method TEXT,
  p_status TEXT
)
RETURNS JSON AS $$
DECLARE
  new_booking_id UUID;
BEGIN
  INSERT INTO bookings (
    date,
    time_hour,
    time_minute,
    service,
    people,
    client_name,
    client_phone,
    notes,
    price,
    payment_method,
    status
  ) VALUES (
    p_date::DATE,
    p_time_hour,
    p_time_minute,
    p_service,
    p_people,
    p_client_name,
    p_client_phone,
    p_notes,
    p_price,
    p_payment_method,
    p_status
  )
  RETURNING id INTO new_booking_id;

  RETURN json_build_object(
    'id', new_booking_id,
    'date', p_date,
    'time_hour', p_time_hour,
    'time_minute', p_time_minute,
    'service', p_service,
    'people', p_people,
    'client_name', p_client_name,
    'client_phone', p_client_phone,
    'notes', p_notes,
    'price', p_price,
    'payment_method', p_payment_method,
    'status', p_status,
    'created_at', NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Function to automatically cancel past bookings
CREATE OR REPLACE FUNCTION cancel_past_bookings()
RETURNS void AS $$
BEGIN
  UPDATE bookings
  SET status = 'cancelled'
  WHERE status = 'active'
    AND (
      date < CURRENT_DATE
      OR (date = CURRENT_DATE AND (time_hour < EXTRACT(hour FROM CURRENT_TIME) OR (time_hour = EXTRACT(hour FROM CURRENT_TIME) AND time_minute <= EXTRACT(minute FROM CURRENT_TIME))))
    );
END;
$$ LANGUAGE plpgsql;

-- Create a function to call this periodically (you can set up a cron job or trigger)
-- For now, we'll call it manually when needed
