# V&SKY SPA Booking System

A complete booking system for V&SKY SPA built with React, Vite, Supabase, and TailwindCSS.

## Features

✅ **Real-time availability** - Live updates when slots are booked
✅ **2-room limit** - Maximum 2 clients per hour slot
✅ **Minute-level booking** - Choose exact time (9:00, 9:15, 9:30, 9:45, etc.)
✅ **Multi-person booking** - Book for 1 or 2 people simultaneously
✅ **Admin availability management** - Block/unblock time slots
✅ **Automatic cleanup** - Past bookings are automatically cancelled
✅ **Real-time updates** - Instant UI updates via Supabase subscriptions

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase-schema.sql`
3. Go to Settings > API and copy your project URL and anon key
4. Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 3. Database Schema

The system uses two main tables:

- `bookings` - Stores all booking information
- `blocked_slots` - Stores admin-blocked time slots

Both tables have Row Level Security (RLS) enabled with public read access and authenticated admin write access.

### 4. Admin Access

For admin functionality:
1. Enable email/password authentication in Supabase Auth settings
2. Create admin users through Supabase Auth
3. Admin pages require authentication

## Usage

### Customer Booking

1. Visit `/booking-new` for the new Supabase-powered booking system
2. Select a date from the calendar
3. Choose an available time slot (green = available, yellow = 1 spot left, red = blocked/unavailable)
4. Select number of people (1 or 2)
5. Fill in details for each person (name, phone, service)
6. Add optional notes
7. Confirm booking

### Admin Management

1. Visit `/admin/availability`
2. Select a date
3. View all time slots with their current status
4. Click on available slots to block them (requires reason and admin email)
5. Click on blocked slots to unblock them

## API Functions

### Core Functions

- `getAvailability(date)` - Get all time slots with availability status
- `createBooking(bookingData)` - Create a new booking
- `blockTimeSlot(date, hour, minute, reason, adminEmail)` - Block a time slot
- `unblockTimeSlot(date, hour, minute)` - Unblock a time slot
- `subscribeToAvailabilityChanges(callback)` - Real-time updates

### Availability Logic

- **Available**: `remainingSpots > 0` and not blocked and not past time
- **Only 1 spot left**: `remainingSpots === 1`
- **Fully booked**: `remainingSpots === 0`
- **Blocked**: Admin has blocked the slot
- **Past time**: Time slot is in the past

### Booking Rules

- Maximum 2 people per time slot
- Bookings are ignored if past their time
- Blocked slots override all availability
- Each person gets their own booking record

## File Structure

```
src/
├── lib/
│   └── supabase.ts          # Supabase client and API functions
├── pages/
│   ├── BookingNew.tsx       # New booking interface
│   └── AdminAvailability.tsx # Admin availability management
├── components/
│   └── ui/                  # Shadcn/ui components
└── App.tsx                  # Route configuration
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Security

- Row Level Security (RLS) enabled on all tables
- Public read access for availability data
- Authenticated admin access for write operations
- Input validation on all forms
- SQL injection prevention via Supabase client

## Real-time Features

The system uses Supabase's real-time capabilities to:
- Update availability instantly when bookings are made
- Reflect admin block/unblock actions immediately
- Prevent double booking through live updates

## Future Enhancements

- Email notifications for bookings
- SMS confirmations
- Calendar integration
- Recurring bookings
- Customer accounts and booking history
- Payment integration
- Staff scheduling
- Analytics dashboard
