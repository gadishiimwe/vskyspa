import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Booking {
  id: string
  date: string
  time_hour: number
  time_minute: number
  service: string
  people: number
  client_name: string
  client_phone: string
  notes?: string
  price?: number // Made optional since column doesn't exist in database
  payment_method?: 'cash' | 'card' | 'online'
  status: 'pending' | 'active' | 'cancelled' | 'declined'
  created_at: string
}

export interface BlockedSlot {
  id: string
  date: string
  time_hour: number
  time_minute: number
  reason?: string
  created_by: string
  blocked_spots: number // 1 or 2 spots blocked
  created_at: string
}

export interface TimeSlot {
  hour: number
  minute: number
  timeString: string
  available: boolean
  remainingSpots: number
  isBlocked: boolean
  label: string
}

// Generate time slots based on day of week
// Weekends (Sat-Sun): 09:00 AM to 10:00 PM (hours 9-22)
// Weekdays (Mon-Fri): 10:00 AM to 10:00 PM (hours 10-22)
export const generateTimeSlots = (date?: Date): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const dayOfWeek = date ? date.getDay() : new Date().getDay() // 0 = Sunday, 6 = Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

  const startHour = isWeekend ? 9 : 10
  const endHour = 22 // 10:00 PM

  for (let hour = startHour; hour <= endHour; hour++) {
    // Generate slots every 15 minutes for more granular booking
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      slots.push({
        hour,
        minute,
        timeString,
        available: true,
        remainingSpots: 2,
        isBlocked: false,
        label: 'Available'
      })
    }
  }
  return slots
}

// Check if a time slot is in the past
export const isTimeSlotPast = (date: Date, hour: number, minute: number): boolean => {
  const now = new Date()
  const slotDate = new Date(date)
  slotDate.setHours(hour, minute, 0, 0)

  return slotDate < now
}

// Get availability for a specific date
export const getAvailability = async (date: Date): Promise<TimeSlot[]> => {
  const dateString = date.toISOString().split('T')[0]
  const slots = generateTimeSlots()

  try {
    // Fetch active bookings for the date
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('date', dateString)
      .eq('status', 'active')

    if (bookingsError) throw bookingsError

    // Fetch blocked slots for the date (only those created within the last hour)
    const oneHourAgo = new Date()
    oneHourAgo.setHours(oneHourAgo.getHours() - 1)

    // Try to select with blocked_spots first, fallback to without if column doesn't exist
    let blockedSlots: any[] = []
    try {
      const { data, error } = await supabase
        .from('blocked_slots')
        .select('*')
        .eq('date', dateString)
        .gte('created_at', oneHourAgo.toISOString())

      if (error) throw error
      blockedSlots = data || []
    } catch (error: any) {
      // If blocked_spots column doesn't exist in schema cache, try selecting without it
      if (error.message?.includes('blocked_spots') || error.code === '42703' || error.code === 'PGRST204') {
        console.warn('blocked_spots column not found in schema cache, fetching blocked slots without it')
        try {
          const { data, error: fallbackError } = await supabase
            .from('blocked_slots')
            .select('id, date, time_hour, time_minute, reason, created_by, created_at')
            .eq('date', dateString)
            .gte('created_at', oneHourAgo.toISOString())

          if (fallbackError) throw fallbackError
          blockedSlots = (data || []).map(slot => ({ ...slot, blocked_spots: 2 })) // Default to 2 if column doesn't exist
        } catch (fallbackError) {
          console.error('Error fetching blocked slots:', fallbackError)
          blockedSlots = []
        }
      } else {
        throw error
      }
    }

    // Process each time slot
    return slots.map(slot => {
      const isPast = isTimeSlotPast(date, slot.hour, slot.minute)

      // Check if slot is blocked and how many spots are blocked
      const blockedSlot = blockedSlots?.find(
        blocked => blocked.time_hour === slot.hour && blocked.time_minute === slot.minute
      )

      if (blockedSlot) {
        const blockedSpots = blockedSlot.blocked_spots || 2
        if (blockedSpots >= 2) {
          return {
            ...slot,
            available: false,
            remainingSpots: 0,
            isBlocked: true,
            label: 'Blocked'
          }
        }
        // Partial blocking - some spots still available
        const remainingSpots = Math.max(0, 2 - blockedSpots)
        return {
          ...slot,
          available: remainingSpots > 0,
          remainingSpots,
          isBlocked: false,
          label: remainingSpots === 1 ? 'Only 1 spot left' : 'Available'
        }
      }

      if (isPast) {
        return {
          ...slot,
          available: false,
          remainingSpots: 0,
          isBlocked: false,
          label: 'Past time'
        }
      }

      // Count booked people for this slot
      const bookedPeople = bookings
        ?.filter(booking =>
          booking.time_hour === slot.hour &&
          booking.time_minute === slot.minute
        )
        .reduce((total, booking) => total + booking.people, 0) || 0

      const remainingSpots = Math.max(0, 2 - bookedPeople)
      const available = remainingSpots > 0

      let label = 'Available'
      if (!available) {
        label = 'Fully booked'
      } else if (remainingSpots === 1) {
        label = 'Only 1 spot left'
      }

      return {
        ...slot,
        available,
        remainingSpots,
        isBlocked: false,
        label
      }
    })
  } catch (error) {
    console.error('Error fetching availability:', error)
    // Return slots with default unavailable state on error
    return slots.map(slot => ({
      ...slot,
      available: false,
      remainingSpots: 0,
      isBlocked: false,
      label: 'Error loading'
    }))
  }
}

// Create a new booking
export const createBooking = async (bookingData: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> => {
  try {
    // First try with price column included
    let insertData: any = {
      date: bookingData.date,
      time_hour: bookingData.time_hour,
      time_minute: bookingData.time_minute,
      service: bookingData.service,
      people: bookingData.people,
      client_name: bookingData.client_name,
      client_phone: bookingData.client_phone,
      notes: bookingData.notes,
      status: bookingData.status
    }

    // Try to include price if it exists in the schema
    if (bookingData.price !== undefined) {
      insertData.price = bookingData.price
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert(insertData)
      .select('*')
      .single()

    if (error) {
      // If price column doesn't exist, try without it
      if (error.message?.includes('price') || error.code === '42703') {
        console.warn('Price column not found, creating booking without price')
        delete insertData.price

        const { data: retryData, error: retryError } = await supabase
          .from('bookings')
          .insert(insertData)
          .select('*')
          .single()

        if (retryError) throw retryError
        return retryData
      }
      throw error
    }

    return data
  } catch (error: any) {
    console.error('Error creating booking:', error)
    throw error
  }
}

// Get all bookings for admin review (combined function)
export const getAllBookings = async (): Promise<Booking[]> => {
  try {
    // Use select('*') to avoid schema cache issues
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error: any) {
    console.error('Error fetching all bookings:', error)
    return []
  }
}

// Helper function to get service duration in minutes
const getServiceDuration = (serviceName: string): number => {
  const match = serviceName.match(/\((\d+)\s*min\)/);
  if (match) {
    return parseInt(match[1]);
  }
  // Default duration for services without specified time (like coffee)
  return 30; // 30 minutes default
};

// Block a time slot
export const blockTimeSlot = async (
  date: string,
  hour: number,
  minute: number,
  reason: string,
  createdBy: string,
  blockedSpots: number = 2
): Promise<BlockedSlot> => {
  try {
    // Validate business hours based on day of week
    const dateObj = new Date(date)
    const dayOfWeek = dateObj.getDay() // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const startHour = isWeekend ? 9 : 10
    const endHour = 22 // 10:00 PM

    if (hour < startHour || hour > endHour) {
      const dayType = isWeekend ? 'weekends (9 AM to 10 PM)' : 'weekdays (10 AM to 10 PM)'
      throw new Error(`Cannot block slots outside business hours for ${dayType}`)
    }

    // Use exact minute for precision (no rounding for range bookings)
    const exactMinute = minute;

    // First, check if there's already a blocked slot for this time
    const { data: existingBlock, error: fetchError } = await supabase
      .from('blocked_slots')
      .select('*')
      .eq('date', date)
      .eq('time_hour', hour)
      .eq('time_minute', exactMinute)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
      throw fetchError
    }

    if (existingBlock) {
      // Update existing block
      const newBlockedSpots = Math.min(2, (existingBlock.blocked_spots || 0) + blockedSpots)

      // Try to update with blocked_spots first, fallback without if column doesn't exist
      try {
        const { data, error } = await supabase
          .from('blocked_slots')
          .update({
            blocked_spots: newBlockedSpots,
            reason: reason || existingBlock.reason,
            created_by: createdBy
          })
          .eq('date', date)
          .eq('time_hour', hour)
          .eq('time_minute', exactMinute)
          .select('*')
          .single()

        if (error) throw error
        return data
      } catch (updateError: any) {
        // If blocked_spots column doesn't exist in schema cache, try without it
        if (updateError.message?.includes('blocked_spots') || updateError.code === '42703' || updateError.code === 'PGRST204') {
          console.warn('blocked_spots column not found in schema cache, updating without it')
          const { data, error } = await supabase
            .from('blocked_slots')
            .update({
              reason: reason || existingBlock.reason,
              created_by: createdBy
            })
            .eq('date', date)
            .eq('time_hour', hour)
            .eq('time_minute', exactMinute)
            .select('*')
            .single()

          if (error) throw error
          return data
        }
        throw updateError
      }
    } else {
      // Insert new block - try with blocked_spots first, fallback without if column doesn't exist
      let insertData: any = {
        date,
        time_hour: hour,
        time_minute: exactMinute,
        reason,
        created_by: createdBy
      }

      // Try to include blocked_spots if the column exists
      try {
        insertData.blocked_spots = blockedSpots
        const { data, error } = await supabase
          .from('blocked_slots')
          .insert([insertData])
          .select('*')
          .single()

        if (error) throw error
        return data
      } catch (insertError: any) {
        // If blocked_spots column doesn't exist, try without it
        if (insertError.message?.includes('blocked_spots') || insertError.code === '42703') {
          delete insertData.blocked_spots
          const { data, error } = await supabase
            .from('blocked_slots')
            .insert([insertData])
            .select('*')
            .single()

          if (error) throw error
          return data
        }
        throw insertError
      }
    }
  } catch (error) {
    console.error('Error in blockTimeSlot:', error)
    throw error
  }
};

// Approve a booking (change status to active and block all slots for service duration)
export const approveBooking = async (bookingId: string): Promise<void> => {
  console.log('approveBooking called with ID:', bookingId)

  // First get the booking details
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single()

  if (fetchError) {
    console.error('Error fetching booking:', fetchError)
    throw fetchError
  }
  if (!booking) {
    console.error('Booking not found:', bookingId)
    throw new Error('Booking not found')
  }

  console.log('Fetched booking:', booking)
  console.log('Current status:', booking.status)

  // Update booking status to active
  const { data: updatedBooking, error: updateError } = await supabase
    .from('bookings')
    .update({ status: 'active' })
    .eq('id', bookingId)
    .select('*')
    .single()

  if (updateError) {
    console.error('Error updating booking status:', updateError)
    throw updateError
  }

  console.log('Updated booking in database:', updatedBooking)
  console.log('New status:', updatedBooking.status)

  // Verify the update was successful by checking the database
  const { data: verifyBooking, error: verifyError } = await supabase
    .from('bookings')
    .select('id, status')
    .eq('id', bookingId)
    .single()

  if (verifyError) {
    console.error('Error verifying booking update:', verifyError)
  } else {
    console.log('Verification - booking status in DB:', verifyBooking.status)
  }

  // Get service duration and block all time slots for the service duration
  const serviceDuration = getServiceDuration(booking.service);
  console.log('Service duration:', serviceDuration, 'minutes')

  const startTime = new Date();
  startTime.setHours(booking.time_hour, booking.time_minute, 0, 0);

  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + serviceDuration);

  console.log('Blocking time slots from', startTime.toTimeString(), 'to', endTime.toTimeString())

  // Block all 15-minute slots that this service will occupy
  let currentTime = new Date(startTime);
  let slotsBlocked = 0;
  while (currentTime < endTime) {
    console.log('Blocking slot:', currentTime.getHours(), ':', currentTime.getMinutes())
    await blockTimeSlot(
      booking.date,
      currentTime.getHours(),
      currentTime.getMinutes(),
      `Approved booking for ${booking.client_name} - ${booking.service}`,
      'admin@vskyspa.com',
      booking.people
    );
    slotsBlocked++;

    // Move to next 15-minute slot
    currentTime.setMinutes(currentTime.getMinutes() + 15);
  }

  console.log('Total slots blocked:', slotsBlocked)
}

// Decline a booking
export const declineBooking = async (bookingId: string): Promise<void> => {
  console.log('declineBooking called with ID:', bookingId)

  try {
    // First check if booking exists and get its current data
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (fetchError) {
      console.error('Error fetching booking for decline:', fetchError)
      throw new Error('Booking not found')
    }

    if (!existingBooking) {
      console.error('Booking not found:', bookingId)
      throw new Error('Booking not found')
    }

    console.log('Fetched booking for decline:', existingBooking)

    if (existingBooking.status === 'cancelled') {
      console.warn('Booking is already cancelled')
      return
    }

    // Only update the status field to avoid schema issues with missing columns
    // Use 'cancelled' instead of 'declined' since the current database schema doesn't allow 'declined'
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .select('*')
      .single()

    if (updateError) {
      console.error('Error updating booking status:', updateError)
      throw updateError
    }

    console.log('Updated booking to cancelled in database:', updatedBooking)
  } catch (error: any) {
    console.error('Error declining booking:', error)
    throw error
  }
}

// Delete a booking
export const deleteBooking = async (bookingId: string): Promise<void> => {
  console.log('deleteBooking called with ID:', bookingId)

  // Check if this is a range booking ID (starts with 'range-')
  if (bookingId.startsWith('range-')) {
    // Parse the range ID to get date, start time, and end time
    // Format: range-START_TIME-END_TIME-DATE
    const parts = bookingId.split('-')
    if (parts.length >= 4) {
      const startTime = parts[1]
      const endTime = parts[2]
      const date = parts.slice(3).join('-') // Handle dates with hyphens

      console.log('Deleting booking range:', { date, startTime, endTime })

      // Parse start and end times
      const [startHour, startMinute] = startTime.split(':').map(Number)
      const [endHour, endMinute] = endTime.split(':').map(Number)

      // Find all cancelled bookings in this time range
      const { data: bookingsInRange, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', date)
        .eq('status', 'cancelled')
        .gte('time_hour', startHour)
        .lte('time_hour', endHour)

      if (fetchError) {
        console.error('Error fetching bookings in range:', fetchError)
        throw new Error('Failed to fetch bookings in range')
      }

      // Filter bookings that fall within the exact time range
      const bookingsToDelete = bookingsInRange?.filter(booking => {
        const bookingTime = booking.time_hour * 60 + booking.time_minute
        const rangeStart = startHour * 60 + startMinute
        const rangeEnd = endHour * 60 + endMinute
        return bookingTime >= rangeStart && bookingTime < rangeEnd
      }) || []

      if (bookingsToDelete.length === 0) {
        console.warn('No bookings found in the specified range')
        return
      }

      console.log('Found bookings to delete:', bookingsToDelete.map(b => b.id))

      // Delete all bookings in the range
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .in('id', bookingsToDelete.map(b => b.id))

      if (deleteError) {
        console.error('Error deleting booking range:', deleteError)
        throw deleteError
      }

      console.log('Successfully deleted', bookingsToDelete.length, 'bookings from range')
      return
    }
  }

  // Handle single booking deletion (original logic)
  // First verify the booking exists
  const { data: existingBooking, error: fetchError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single()

  if (fetchError) {
    console.error('Error fetching booking for deletion:', fetchError)
    throw new Error('Booking not found')
  }

  if (!existingBooking) {
    console.error('Booking not found for deletion:', bookingId)
    throw new Error('Booking not found')
  }

  console.log('Found booking to delete:', existingBooking)

  // Perform the delete operation
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId)

  if (error) {
    console.error('Error deleting booking from database:', error)
    throw error
  }

  console.log('Successfully deleted booking from database:', bookingId)

  // Verify the booking was actually deleted
  const { data: verifyBooking, error: verifyError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single()

  if (verifyBooking) {
    console.error('ERROR: Booking still exists after deletion!')
    throw new Error('Booking was not properly deleted')
  }

  console.log('Verified: Booking successfully removed from database')
}

// Unblock a time slot
export const unblockTimeSlot = async (
  date: string,
  hour: number,
  minute: number
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('blocked_slots')
      .delete()
      .eq('date', date)
      .eq('time_hour', hour)
      .eq('time_minute', minute)

    if (error) throw error
  } catch (error) {
    console.error('Error in unblockTimeSlot:', error)
    throw error
  }
}

// Subscribe to real-time availability changes
export const subscribeToAvailabilityChanges = (callback: () => void) => {
  const channel = supabase
    .channel('availability-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'bookings' },
      callback
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'blocked_slots' },
      callback
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

// Get all blocked slots for admin management
export const getAllBlockedSlots = async (): Promise<BlockedSlot[]> => {
  try {
    // Try to select with blocked_spots first, fallback to without if column doesn't exist
    let data: any[] = []
    try {
      const { data: result, error } = await supabase
        .from('blocked_slots')
        .select('*')
        .order('date', { ascending: false })
        .order('time_hour', { ascending: true })
        .order('time_minute', { ascending: true })

      if (error) throw error
      data = result || []
    } catch (error: any) {
      // If blocked_spots column doesn't exist in schema cache, try selecting without it
      if (error.message?.includes('blocked_spots') || error.code === '42703' || error.code === 'PGRST204') {
        console.warn('blocked_spots column not found in schema cache, fetching blocked slots without it')
        try {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('blocked_slots')
            .select('id, date, time_hour, time_minute, reason, created_by, created_at')
            .order('date', { ascending: false })
            .order('time_hour', { ascending: true })
            .order('time_minute', { ascending: true })

          if (fallbackError) throw fallbackError
          data = (fallbackData || []).map(slot => ({ ...slot, blocked_spots: 2 })) // Default to 2 if column doesn't exist
        } catch (fallbackError) {
          console.error('Error fetching blocked slots:', fallbackError)
          return []
        }
      } else {
        throw error
      }
    }

    return data
  } catch (error: any) {
    console.error('Error fetching blocked slots:', error)
    return []
  }
}

// Get pending bookings (raw data)
export const getPendingBookings = async (): Promise<Booking[]> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error: any) {
    console.error('Error fetching pending bookings:', error)
    return []
  }
}

// Get approved bookings (raw data)
export const getApprovedBookings = async (): Promise<Booking[]> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error: any) {
    console.error('Error fetching approved bookings:', error)
    return []
  }
}

// Get declined bookings (raw data)
export const getDeclinedBookings = async (): Promise<Booking[]> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'cancelled')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error: any) {
    console.error('Error fetching declined bookings:', error)
    return []
  }
}

// Cancel past bookings
export const cancelPastBookings = async (): Promise<void> => {
  const { error } = await supabase.rpc('cancel_past_bookings')
  if (error) throw error
}
