-- Add price column to existing bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0;

-- Add payment_method column if it doesn't exist
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'online'));

-- Update existing records to have a default price of 0 if they don't have one
UPDATE bookings SET price = 0 WHERE price IS NULL;
