-- Add blocked_spots column to blocked_slots table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blocked_slots'
        AND column_name = 'blocked_spots'
    ) THEN
        ALTER TABLE blocked_slots ADD COLUMN blocked_spots INTEGER NOT NULL DEFAULT 2 CHECK (blocked_spots >= 1 AND blocked_spots <= 2);
    END IF;
END $$;
