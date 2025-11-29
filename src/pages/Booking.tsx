import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { pageSEO, faqContent } from "@/seo/seoConfig";
import {
  supabase,
  getAvailability,
  createBooking,
  subscribeToAvailabilityChanges,
  cancelPastBookings,
  TimeSlot,
  type Booking
} from '@/lib/supabase';
import { Plus, Minus, Clock, Users, Calendar as CalendarIcon } from 'lucide-react';

const Booking = () => {
  const { t } = useTranslation();
  const bookingSEO = pageSEO.booking;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqContent.booking.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Booking form state
  const [people, setPeople] = useState(1);
  const [clients, setClients] = useState([{ name: '', phone: '', service: '', selectedTime: '', preferredTime: '' }]);
  const [notes, setNotes] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<Array<{time: string, service: string, clientName: string}>>([]);
  const [fetchedBookedSlots, setFetchedBookedSlots] = useState<Array<{time: string, service: string, clientName: string, status: string}>>([]);
  const bookingInProgressRef = useRef(false);

  // Service pricing map
  const servicePrices = {
    "Deep Cleaning for Full Body (60 min)": "45,000RWF",
    "Face Cleaning & Moisturizing (60 min)": "40,000RWF",
    "Hair Braiding (60 min)": "25,000RWF",
    "Hair Braiding (90 min)": "35,000RWF",
    "Hair Treatment (45 min)": "30,000RWF",
    "Professional Styling (30 min)": "20,000RWF",
    "Professional Styling (60 min)": "30,000RWF",
    "Full Body Relax Massage (Oil) (60 min)": "30,000RWF",
    "Full Body Relax Massage (Oil) (90 min)": "40,000RWF",
    "Hot Stone Massage (Oil) (90 min)": "50,000RWF",
    "Hot Stone Massage (Oil) (120 min)": "70,000RWF",
    "Deep Tissue Massage (Oil) (60 min)": "30,000RWF",
    "Deep Tissue Massage (Oil) (90 min)": "40,000RWF",
    "Four Hands Massage (Oil) (30 min)": "30,000RWF",
    "Head Massage & Hair Wash (30 min)": "20,000RWF",
    "Professional Foot Bath Massage (60 min)": "40,000RWF",
    "Shoulder, Back, Head & Leg Massage (30 min)": "20,000RWF",
    "VIP 1 Card (200K → 230K)": "200,000RWF",
    "VIP 2 Card (300K → 350K)": "300,000RWF",
    "VIP 3 Card (400K → 500K)": "400,000RWF",
    "VIP 4 Card (500K → 600K)": "500,000RWF",
    "Cappuccino Coffee": "4000 RWF",
    "Café Latte": "4000 RWF",
    "Americano Coffee": "3000 RWF",
    "Hot Chocolate": "4500 RWF",
    "Black Coffee": "2500 RWF",
    "African Tea": "3000 RWF",
    "African Coffee": "4000 RWF",
    "Spice Tea": "4500 RWF",
    "Fruit Tea": "4500 RWF",
    "Iced Cappuccino": "4000 RWF",
    "Iced Café Mocha": "4000 RWF",
    "Iced Café Latte": "4000 RWF",
    "Iced Americano": "4000 RWF",
  };

  const services = Object.keys(servicePrices);

  // Helper function to get business hours for the selected date
  const getBusinessHours = () => {
    const dayOfWeek = selectedDate.getDay() // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const startHour = isWeekend ? '09:00' : '10:00'
    const endHour = '22:00' // 10:00 PM
    return { start: startHour, end: endHour }
  }

  // Helper function to generate available time slots
  const generateTimeSlots = () => {
    const { start, end } = getBusinessHours()
    const [startHour, startMinute] = start.split(':').map(Number)
    const [endHour, endMinute] = end.split(':').map(Number)

    const slots = []
    let currentHour = startHour
    let currentMinute = startMinute

    while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
      slots.push(timeString)

      currentMinute += 15
      if (currentMinute >= 60) {
        currentMinute = 0
        currentHour += 1
      }
    }

    return slots
  }

  // Helper function to check if a time slot is booked
  const isTimeSlotBooked = (timeString: string) => {
    return fetchedBookedSlots.some(slot => slot.time === timeString && slot.status === 'active')
  }

  // Helper function to check if a time slot is blocked
  const isTimeSlotBlocked = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number)
    const slot = timeSlots.find(slot => slot.hour === hours && slot.minute === minutes)
    return slot ? slot.isBlocked : false
  }

  // Helper function to check if a time slot is in the past
  const isTimeSlotInPast = (timeString: string) => {
    const slotTime = new Date(selectedDate)
    const [hours, minutes] = timeString.split(':').map(Number)
    slotTime.setHours(hours, minutes, 0, 0)
    return slotTime < new Date()
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

  // Helper function to check if a time slot is already booked
  const isTimeSlotConflicted = (timeString: string): boolean => {
    return fetchedBookedSlots.some(slot => slot.time === timeString);
  };

  // Helper function to check if a time slot falls within any booked time range
  const isTimeSlotInBookedRange = (timeString: string): boolean => {
    const bookedRanges = groupBookedSlotsIntoRanges(fetchedBookedSlots);
    const slotTime = new Date(`2000-01-01T${timeString}:00`);

    return bookedRanges.some(range => {
      const startTime = new Date(`2000-01-01T${range.startTime}:00`);
      const endTime = new Date(`2000-01-01T${range.endTime}:00`);
      return slotTime >= startTime && slotTime < endTime;
    });
  };

  // Helper function to calculate end time by adding duration to start time
  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = startTotalMinutes + durationMinutes;
    const endHour = Math.floor(endTotalMinutes / 60);
    const endMinute = endTotalMinutes % 60;
    return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
  };

  // Helper function to group consecutive booked slots into time ranges
  const groupBookedSlotsIntoRanges = (bookedSlots: Array<{time: string, service: string, clientName: string, status: string}>): Array<{startTime: string, endTime: string, service: string, clientName: string}> => {
    const ranges: Array<{startTime: string, endTime: string, service: string, clientName: string}> = []

    // Filter and sort booked slots by time (include both pending and active to prevent double booking)
    const bookedSlotsFiltered = bookedSlots
      .filter(slot => slot.status === 'active' || slot.status === 'pending')
      .sort((a, b) => {
        const [aHour, aMin] = a.time.split(':').map(Number)
        const [bHour, bMin] = b.time.split(':').map(Number)
        return aHour * 60 + aMin - (bHour * 60 + bMin)
      })

    if (bookedSlotsFiltered.length === 0) return ranges

    let currentRange: typeof bookedSlotsFiltered = [bookedSlotsFiltered[0]]

    for (let i = 1; i < bookedSlotsFiltered.length; i++) {
      const prevSlot = bookedSlotsFiltered[i - 1]
      const currentSlot = bookedSlotsFiltered[i]

      const prevTime = prevSlot.time.split(':').map(Number)
      const currentTime = currentSlot.time.split(':').map(Number)
      const prevMinutes = prevTime[0] * 60 + prevTime[1]
      const currentMinutes = currentTime[0] * 60 + currentTime[1]

      // Check if consecutive (15 minutes apart) and same service/client
      if (currentMinutes - prevMinutes === 15 &&
          prevSlot.service === currentSlot.service &&
          prevSlot.clientName === currentSlot.clientName) {
        currentRange.push(currentSlot)
      } else {
        // End current range and start new one
        const startTime = currentRange[0].time
        const serviceDuration = getServiceDuration(currentRange[0].service)
        const endTime = calculateEndTime(startTime, serviceDuration)

        ranges.push({
          startTime,
          endTime,
          service: currentRange[0].service,
          clientName: currentRange[0].clientName
        })

        currentRange = [currentSlot]
      }
    }

    // Add the last range
    if (currentRange.length > 0) {
      const startTime = currentRange[0].time
      const serviceDuration = getServiceDuration(currentRange[0].service)
      const endTime = calculateEndTime(startTime, serviceDuration)

      ranges.push({
        startTime,
        endTime,
        service: currentRange[0].service,
        clientName: currentRange[0].clientName
      })
    }

    return ranges
  }

  // Helper function to check if a selected time is blocked/booked
  const isTimeBlocked = (timeString: string) => {
    if (!timeString) return false
    const [hours, minutes] = timeString.split(':').map(Number)
    const slot = timeSlots.find(slot => slot.hour === hours && slot.minute === minutes)
    return slot ? !slot.available || slot.isBlocked : false
  }

  // Load availability for selected date
  const loadAvailability = async () => {
    setLoading(true);
    try {
      const slots = await getAvailability(selectedDate);
      setTimeSlots(slots);
    } catch (error) {
      console.error('Error loading availability:', error);
      toast.error('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  // Fetch booked slots for selected date
  const fetchBookedSlots = async () => {
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('time_hour, time_minute, service, client_name, status')
        .eq('date', dateString)
        .in('status', ['pending', 'active']); // Fetch both pending and approved bookings to prevent double booking

      if (error) throw error;

      const bookedSlots = bookings?.map(booking => ({
        time: `${booking.time_hour.toString().padStart(2, '0')}:${booking.time_minute.toString().padStart(2, '0')}`,
        service: booking.service,
        clientName: booking.client_name,
        status: booking.status
      })) || [];

      setFetchedBookedSlots(bookedSlots);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      setFetchedBookedSlots([]);
    }
  };

  useEffect(() => {
    loadAvailability();
    fetchBookedSlots();
  }, [selectedDate]);

  // Subscribe to real-time changes
  useEffect(() => {
    const unsubscribe = subscribeToAvailabilityChanges(() => {
      loadAvailability();
    });

    return unsubscribe;
  }, [selectedDate]);

  // Subscribe to real-time booking changes
  useEffect(() => {
    const channel = supabase
      .channel('booking-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('New booking inserted:', payload.new);
          // Refresh booked slots when a new booking is made
          fetchBookedSlots();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('Booking updated:', payload.new);
          // Refresh booked slots when a booking status changes
          fetchBookedSlots();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('Booking deleted');
          // Refresh booked slots when a booking is deleted
          fetchBookedSlots();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDate]);

  // Periodically cancel past bookings and refresh availability
  useEffect(() => {
    const cancelPastBookingsAndRefresh = async () => {
      try {
        await cancelPastBookings();
        // Only refresh if we're on today's date
        const today = new Date().toISOString().split('T')[0];
        const selectedDateStr = selectedDate.toISOString().split('T')[0];
        if (selectedDateStr === today) {
          loadAvailability();
          fetchBookedSlots();
        }
      } catch (error) {
        console.error('Error canceling past bookings:', error);
      }
    };

    // Cancel past bookings immediately when component mounts
    cancelPastBookingsAndRefresh();

    // Set up interval to check every 5 minutes
    const interval = setInterval(cancelPastBookingsAndRefresh, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [selectedDate]);

  // Update clients array when people count changes
  useEffect(() => {
    setClients(prev => {
      const newClients = [...prev];
      if (people > newClients.length) {
        // Add clients
        while (newClients.length < people) {
          newClients.push({ name: '', phone: '', service: '', selectedTime: '', preferredTime: '' });
        }
      } else if (people < newClients.length) {
        // Remove clients
        newClients.splice(people);
      }
      return newClients;
    });
  }, [people]);

  // Automatically clear selectedTime if it becomes booked or conflicted
  useEffect(() => {
    setClients(prev => prev.map(client => {
      if (client.selectedTime && (isTimeSlotConflicted(client.selectedTime) || isTimeSlotBlocked(client.selectedTime) || isTimeSlotInBookedRange(client.selectedTime))) {
        toast.error(`The selected time ${client.selectedTime} is no longer available and has been cleared. Please choose a different time.`);
        return { ...client, selectedTime: '' };
      }
      return client;
    }));
  }, [fetchedBookedSlots, timeSlots]);

  // Prefill service from query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const service = params.get("service");
    if (service) {
      setClients(prev => prev.map(client => ({ ...client, service })));
    }
  }, [location]);

  const handleClientChange = (index: number, field: string, value: string) => {
    if (field === 'selectedTime' && value) {
      // Validate time is not in the past
      const selectedDateTime = new Date(selectedDate);
      const [hours, minutes] = value.split(':').map(Number);
      selectedDateTime.setHours(hours, minutes, 0, 0);

      const now = new Date();
      if (selectedDateTime < now) {
        toast.error('Please select a future time');
        return;
      }

      // Check if time slot is booked or blocked
      if (isTimeBlocked(value)) {
        toast.error('This time slot is not available. Please choose a different time.');
        return;
      }

      // Check if time slot is conflicted (booked)
      if (isTimeSlotConflicted(value)) {
        toast.error('This time slot is already booked. Please choose a different time.');
        return;
      }
    }

    if (field === 'service') {
      // When service changes, validate existing selectedTime
      const client = clients[index];
      if (client.selectedTime && isTimeSlotConflicted(client.selectedTime)) {
        toast.error('The selected time is not available for this service. Please choose a different time.');
        setClients(prev => prev.map((c, i) =>
          i === index ? { ...c, [field]: value, selectedTime: '' } : c
        ));
        return;
      }
    }

    setClients(prev => prev.map((client, i) =>
      i === index ? { ...client, [field]: value } : client
    ));
  };

  const getSlotColor = (slot: TimeSlot) => {
    if (slot.isBlocked) return 'bg-red-100 border-red-300 text-red-800 cursor-not-allowed';
    if (!slot.available) return 'bg-gray-100 border-gray-300 text-gray-800 cursor-not-allowed';
    if (slot.remainingSpots === 1) return 'bg-yellow-100 border-yellow-300 text-yellow-800 cursor-pointer hover:bg-yellow-200';
    return 'bg-green-100 border-green-300 text-green-800 cursor-pointer hover:bg-green-200';
  };

  const isFormValid = clients.every(client =>
    client.name.trim() && client.phone.trim() && client.service && client.selectedTime
  );

  const handleSubmitBooking = async () => {
    // Prevent multiple submissions
    if (bookingInProgressRef.current) {
      return;
    }

    // Validate all clients have required info and selected timeslots
    for (let i = 0; i < people; i++) {
      const client = clients[i]
      if (!client.name.trim() || !client.phone.trim() || !client.service || !client.selectedTime) {
        toast.error(`Please fill in all information and select a time slot for person ${i + 1}`)
        return
      }
    }

    setBookingLoading(true)
    bookingInProgressRef.current = true;

    try {
      // Create bookings for each person with their individual timeslots
      const bookingPromises = clients.map(client => {
        // Parse time string to get hours and minutes
        const timeParts = client.selectedTime.split(':')
        const hours = parseInt(timeParts[0]) || 0
        const minutes = parseInt(timeParts[1]) || 0

        console.log('Creating booking:', {
          timeString: client.selectedTime,
          timeParts,
          hours,
          minutes,
          isHoursValid: hours >= 0 && hours <= 23,
          isMinutesValid: minutes >= 0 && minutes <= 59
        })

        // Additional validation
        if (isNaN(hours) || isNaN(minutes)) {
          throw new Error(`Invalid time format: ${client.selectedTime}`)
        }

        if (hours < 0 || hours > 23) {
          throw new Error(`Invalid hour: ${hours}`)
        }

        if (minutes < 0 || minutes > 59) {
          throw new Error(`Invalid minutes: ${minutes}. Minutes must be between 0 and 59.`)
        }

        // Ensure minutes are in valid increments (0, 15, 30, 45)
        if (minutes % 15 !== 0) {
          throw new Error(`Invalid minutes: ${minutes}. Minutes must be in 15-minute increments (0, 15, 30, 45).`)
        }

        // Get service duration
        const serviceDuration = getServiceDuration(client.service);

        // Get price from servicePrices map and convert to number
        const priceString = servicePrices[client.service as keyof typeof servicePrices];
        const price = priceString ? parseFloat(priceString.replace(/[^\d.]/g, '')) : 0;

        // If service has duration > 30 minutes, create bookings for all time slots
        if (serviceDuration > 30) {
          const bookingsForDuration = [];
          const startTime = new Date(selectedDate);
          startTime.setHours(hours, minutes, 0, 0);

          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + serviceDuration);

          // Create booking for each 15-minute slot that the service occupies
          let currentTime = new Date(startTime);
          while (currentTime < endTime) {
            bookingsForDuration.push(createBooking({
              date: selectedDate.toISOString().split('T')[0],
              time_hour: currentTime.getHours(),
              time_minute: currentTime.getMinutes(),
              service: client.service,
              people: 1, // Each booking is for 1 person
              client_name: client.name,
              client_phone: client.phone,
              notes: notes.trim() || undefined,
              price: price,
              status: 'pending'
            }));

            // Move to next 15-minute slot
            currentTime.setMinutes(currentTime.getMinutes() + 15);
          }

          return Promise.all(bookingsForDuration);
        } else {
          // For services 30 minutes or less, create single booking
          return createBooking({
            date: selectedDate.toISOString().split('T')[0],
            time_hour: hours,
            time_minute: minutes,
            service: client.service,
            people: 1, // Each booking is for 1 person
            client_name: client.name,
            client_phone: client.phone,
            notes: notes.trim() || undefined,
            price: price,
            status: 'pending'
          });
        }
      })

      // Flatten the array since some promises return arrays
      const flattenedPromises = bookingPromises.flat();
      await Promise.all(flattenedPromises)

      // Add booked slots to display immediately
      const newBookedSlots = clients.map(client => ({
        time: client.selectedTime,
        service: client.service,
        clientName: client.name
      }))
      setBookedSlots(prev => [...prev, ...newBookedSlots])

      toast.success('Booking request submitted! Our team will review and confirm your appointment within 24 hours.')
      setShowPaymentDialog(false)
      setPeople(1)
      setClients([{ name: '', phone: '', service: '', selectedTime: '', preferredTime: '' }])
      setNotes('')
      // Don't refresh availability since booking is pending

    } catch (error) {
      console.error('Error creating booking:', error)
      toast.error('Failed to create booking. Please try again.')
    } finally {
      setBookingLoading(false)
      bookingInProgressRef.current = false;
    }
  }

  const handleCashBooking = async () => {
    // Validate all clients have required info and selected timeslots
    for (let i = 0; i < people; i++) {
      const client = clients[i]
      if (!client.name.trim() || !client.phone.trim() || !client.service || !client.selectedTime) {
        toast.error(`Please fill in all information and select a time slot for person ${i + 1}`)
        return
      }
    }

    setBookingLoading(true)

    try {
      // Create bookings for each person with their individual timeslots
      const bookingPromises = clients.map(client => {
        // Parse time string to get hours and minutes
        const timeParts = client.selectedTime.split(':')
        const hours = parseInt(timeParts[0]) || 0
        const minutes = parseInt(timeParts[1]) || 0

        console.log('Creating cash booking:', {
          timeString: client.selectedTime,
          timeParts,
          hours,
          minutes,
          isHoursValid: hours >= 0 && hours <= 23,
          isMinutesValid: minutes >= 0 && minutes <= 59
        })

        // Additional validation
        if (isNaN(hours) || isNaN(minutes)) {
          throw new Error(`Invalid time format: ${client.selectedTime}`)
        }

        if (hours < 0 || hours > 23) {
          throw new Error(`Invalid hour: ${hours}`)
        }

        if (minutes < 0 || minutes > 59) {
          throw new Error(`Invalid minutes: ${minutes}. Minutes must be between 0 and 59.`)
        }

        // Ensure minutes are in valid increments (0, 15, 30, 45)
        if (minutes % 15 !== 0) {
          throw new Error(`Invalid minutes: ${minutes}. Minutes must be in 15-minute increments (0, 15, 30, 45).`)
        }

        // Get service duration
        const serviceDuration = getServiceDuration(client.service);

        // Get price from servicePrices map and convert to number
        const priceString = servicePrices[client.service as keyof typeof servicePrices];
        const price = priceString ? parseFloat(priceString.replace(/[^\d.]/g, '')) : 0;

        // If service has duration > 30 minutes, create bookings for all time slots
        if (serviceDuration > 30) {
          const bookingsForDuration = [];
          const startTime = new Date(selectedDate);
          startTime.setHours(hours, minutes, 0, 0);

          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + serviceDuration);

          // Create booking for each 15-minute slot that the service occupies
          let currentTime = new Date(startTime);
          while (currentTime < endTime) {
            bookingsForDuration.push(createBooking({
              date: selectedDate.toISOString().split('T')[0],
              time_hour: currentTime.getHours(),
              time_minute: currentTime.getMinutes(),
              service: client.service,
              people: 1, // Each booking is for 1 person
              client_name: client.name,
              client_phone: client.phone,
              notes: (notes.trim() ? notes.trim() + ' ' : '') + '[CASH PAYMENT]',
              price: price,
              status: 'pending'
            }));

            // Move to next 15-minute slot
            currentTime.setMinutes(currentTime.getMinutes() + 15);
          }

          return Promise.all(bookingsForDuration);
        } else {
          // For services 30 minutes or less, create single booking
          return createBooking({
            date: selectedDate.toISOString().split('T')[0],
            time_hour: hours,
            time_minute: minutes,
            service: client.service,
            people: 1, // Each booking is for 1 person
            client_name: client.name,
            client_phone: client.phone,
            notes: (notes.trim() ? notes.trim() + ' ' : '') + '[CASH PAYMENT]',
            price: price,
            status: 'pending'
          });
        }
      })

      // Flatten the array since some promises return arrays
      const flattenedPromises = bookingPromises.flat();
      await Promise.all(flattenedPromises)

      // Add booked slots to display immediately
      const newBookedSlots = clients.map(client => ({
        time: client.selectedTime,
        service: client.service,
        clientName: client.name
      }))
      setBookedSlots(prev => [...prev, ...newBookedSlots])

      toast.success('Cash booking request submitted! Our team will review and confirm your appointment within 24 hours. Please arrive 15 minutes early to pay at reception once approved.')
      setShowPaymentDialog(false)
      setPeople(1)
      setClients([{ name: '', phone: '', service: '', selectedTime: '', preferredTime: '' }])
      setNotes('')
      loadAvailability() // Refresh availability

    } catch (error) {
      console.error('Error creating cash booking:', error)
      toast.error('Failed to create booking. Please try again.')
    } finally {
      setBookingLoading(false)
      bookingInProgressRef.current = false;
    }
  }

  return (
    <div className="min-h-screen">
      <SEO
        title={bookingSEO.title}
        description={bookingSEO.description}
        url={bookingSEO.url}
        canonical={bookingSEO.canonical}
        image={bookingSEO.image}
        type={bookingSEO.type}
        keywords={bookingSEO.keywords}
        jsonLd={[faqSchema]}
        additionalMetaTags={
          <>
            <meta property="og:image:alt" content="Book Kigali spa treatments at V&SKY SPA" />
            <meta name="twitter:image:alt" content="Book Kigali spa treatments at V&SKY SPA" />
          </>
        }
      />



      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Confirm Your Booking Details</DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              Please review your booking details before proceeding to payment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">{t('booking.summary.date')}: {selectedDate.toLocaleDateString()}</p>
              <p className="font-medium">{t('booking.summary.time')}: {clients.map(client => client.selectedTime).filter(Boolean).join(', ') || t('booking.summary.multiple')}</p>
              <p className="font-medium">{t('booking.summary.people')}: {people}</p>
            </div>

            <div className="space-y-2">
              {clients.map((client, index) => (
                <div key={index} className="text-sm p-3 border rounded">
                  <p><strong>{t('booking.person.label', { number: index + 1 })}:</strong> {client.name}</p>
                  <p><strong>{t('booking.summary.service')}:</strong> {client.service}</p>
                  <p><strong>{t('booking.summary.price')}:</strong> {servicePrices[client.service as keyof typeof servicePrices]}</p>
                  <p><strong>{t('booking.summary.time')}:</strong> {client.selectedTime || t('booking.summary.not_selected')}</p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">{t('booking.price.breakdown')}:</h4>
              {clients.map((client, index) => (
                <div key={index} className="flex justify-between text-sm mb-1">
                  <span>{client.service}:</span>
                  <span>{servicePrices[client.service as keyof typeof servicePrices]}</span>
                </div>
              ))}
              <hr className="my-2" />
              <div className="flex justify-between font-bold">
                <span>{t('booking.total')}:</span>
                <span>
                  {(() => {
                    const prices = clients.map(client => {
                      const price = servicePrices[client.service as keyof typeof servicePrices];
                      if (!price) return 0;
                      return parseFloat(price.replace(/[^\d.]/g, ''));
                    });
                    const total = prices.reduce((sum, price) => sum + price, 0);
                    return `${total.toLocaleString()} RWF`;
                  })()}
                </span>
              </div>
            </div>

            {notes && (
              <div className="text-sm">
                <p><strong>{t('booking.notes.selected')}:</strong> {notes}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setShowConfirmDialog(false)}
                variant="outline"
                className="flex-1"
              >
                {t('booking.cancel.button')}
              </Button>
              <Button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setShowPaymentDialog(true);
                }}
                className="flex-1"
              >
                {t('booking.confirm.button')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Complete Your Payment</DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              Choose your payment method to confirm your booking reservation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">

            {/* Payment Options */}
            <div className="grid gap-4">
              {/* Mobile Money Payment */}
              <Card className="border-2 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">M</span>
                    </div>
                    {t('booking.payment.mtn.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-700 mb-2">
                      {t('booking.payment.mtn.instruction')}
                    </p>
                    <div className="bg-white rounded p-3 border text-center">
                      <p className="text-lg font-bold text-green-600">*182*8*1*88194#</p>
                      <p className="text-xs text-gray-600 mt-1">{t('booking.payment.mtn.code')}</p>
                    </div>
                    <p className="text-xs text-green-700 mt-2">
                      {t('booking.payment.mtn.confirmation')}
                    </p>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleSubmitBooking();
                    }}
                    disabled={bookingLoading}
                    className="w-full"
                    variant="default"
                  >
                    {bookingLoading ? t('booking.loading.confirming') : t('booking.payment.mtn.button')}
                  </Button>
                </CardContent>
              </Card>

              {/* Cash Payment */}
              <Card className="border-2 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">💵</span>
                    </div>
                    Pay in Cash at Spa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-700 mb-2">
                      Pay when you arrive at V&SKY SPA:
                    </p>
                    <div className="bg-white rounded p-3 border text-center">
                      <p className="text-lg font-bold text-blue-600">Pay at Reception</p>
                      <p className="text-xs text-gray-600 mt-1">Bring exact amount or pay upon arrival</p>
                    </div>
                    <p className="text-xs text-blue-700 mt-2">
                      Your booking will be held for 15 minutes. Please arrive on time.
                    </p>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleCashBooking();
                    }}
                    disabled={bookingLoading}
                    className="w-full"
                    variant="outline"
                  >
                    {bookingLoading ? 'Confirming...' : "Book & Pay in Cash"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setShowPaymentDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Navbar />

      {/* Hero Section */}
      <section className="mt-[116px] pt-32 md:pt-24 pb-16 gradient-soft text-center">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{t('booking.hero.title')}</h1>
          <p className="text-xl text-muted-foreground">
            {t('booking.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Booking Interface */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Date Selection */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      {t('booking.date.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className="rounded-md border"
                      disabled={(d) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const checkDate = new Date(d);
                        checkDate.setHours(0, 0, 0, 0);
                        return checkDate < today;
                      }}
                    />
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">{t('booking.date.selected')}:</p>
                      <p className="text-lg font-bold text-blue-800">
                        {selectedDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Booked Time Slots */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      {t('booking.booked.title')}
                    </CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">{t('booking.status.booked')}</Badge>
                      <Badge variant="outline" className="bg-red-100 text-red-800">{t('booking.status.booked')}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="grid grid-cols-1 gap-2">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                        {/* Show blocked slots */}
                        {timeSlots.filter(slot => {
                          if (!slot.isBlocked) return false;
                          const slotTime = new Date(selectedDate);
                          slotTime.setHours(slot.hour, slot.minute, 0, 0);
                          if (slotTime < new Date()) return false;
                          return true;
                        }).map((slot) => (
                          <div
                            key={`blocked-${slot.hour}-${slot.minute}`}
                            className={`p-3 rounded-lg border-2 transition-all ${getSlotColor(slot)}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{slot.timeString}</span>
                              <Badge variant="outline" className="text-xs">
                                Booked
                              </Badge>
                            </div>
                            <p className="text-xs mt-1">{slot.label}</p>
                          </div>
                        ))}

                        {/* Show booked time ranges */}
                        {groupBookedSlotsIntoRanges(fetchedBookedSlots.filter(slot => {
                          // Exclude past times
                          const slotTime = new Date(selectedDate);
                          const [hours] = slot.time.split(':').map(Number);
                          slotTime.setHours(hours, 0, 0, 0);
                          if (slotTime < new Date()) return false;
                          return slot.status === 'active' || slot.status === 'pending';
                        })).map((range, index) => (
                          <div
                            key={`booked-range-${index}`}
                            className="p-3 rounded-lg border-2 transition-all bg-gray-100 border-gray-300 text-gray-800"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{range.startTime} - {range.endTime}</span>
                              <Badge variant="outline" className="text-xs">
                                {t('booking.status.booked')}
                              </Badge>
                            </div>
                            <p className="text-xs mt-1">{range.service}</p>
                            <p className="text-xs mt-1 text-gray-600">{range.clientName}</p>
                          </div>
                        ))}

                        {/* Show message if no booked slots */}
                        {timeSlots.filter(slot => {
                          if (!slot.isBlocked) return false;
                          if (selectedDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]) {
                            const now = new Date();
                            const slotTime = new Date(selectedDate);
                            slotTime.setHours(slot.hour, slot.minute, 0, 0);
                            if (slotTime < now) return false;
                          }
                          return true;
                        }).length === 0 && groupBookedSlotsIntoRanges(fetchedBookedSlots.filter(slot => {
                          const slotTime = new Date(selectedDate);
                          const [hours] = slot.time.split(':').map(Number);
                          slotTime.setHours(hours, 0, 0, 0);
                          if (slotTime < new Date()) return false;
                          return true;
                        })).length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">No booked slots for this date</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Booking Form */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {t('booking.details.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">

                    {/* Number of People */}
                    <div>
                      <Label>{t('booking.people.label')}</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setPeople(Math.max(1, people - 1))}
                          disabled={people <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-4 py-2 border rounded-md min-w-[3rem] text-center">{people}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setPeople(Math.min(2, people + 1))}
                          disabled={people >= 2}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Client Forms */}
                    {clients.map((client, index) => (
                      <div key={index} className="space-y-4 p-4 border rounded-lg">
                        <h4 className="font-medium">{t('booking.person.label', { number: index + 1 })}</h4>

                        <div>
                          <Label htmlFor={`name-${index}`}>{t('booking.name.label')}</Label>
                          <Input
                            id={`name-${index}`}
                            placeholder={t('booking.name.placeholder')}
                            value={client.name}
                            onChange={(e) => handleClientChange(index, 'name', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`phone-${index}`}>{t('booking.phone.label')}</Label>
                          <Input
                            id={`phone-${index}`}
                            type="tel"
                            placeholder={t('booking.phone.placeholder')}
                            value={client.phone}
                            onChange={(e) => handleClientChange(index, 'phone', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`service-${index}`}>{t('booking.service.label')}</Label>
                          <Select
                            value={client.service}
                            onValueChange={(value) => handleClientChange(index, 'service', value)}
                          >
                            <SelectTrigger id={`service-${index}`}>
                              <SelectValue placeholder={t('booking.service.placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              {services.map(service => (
                                <SelectItem key={service} value={service}>{service}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor={`selectedTime-${index}`}>{t('booking.time.label')}</Label>
                          {/* Show booked times summary */}
                          {fetchedBookedSlots.length > 0 && (
                            <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-md">
                              <p className="text-sm font-medium text-red-800 mb-1">{t('booking.booked.today')}:</p>
                              <div className="flex flex-wrap gap-1">
                                {groupBookedSlotsIntoRanges(fetchedBookedSlots.filter(slot => {
                                  const slotTime = new Date(selectedDate);
                                  const [hours] = slot.time.split(':').map(Number);
                                  slotTime.setHours(hours, 0, 0, 0);
                                  return slotTime >= new Date();
                                })).map((range, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs bg-red-100 text-red-800 border-red-300">
                                    {range.startTime} - {range.endTime}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          <Select
                            value={client.selectedTime}
                            onValueChange={(value) => handleClientChange(index, 'selectedTime', value)}
                          >
                            <SelectTrigger id={`selectedTime-${index}`}>
                              <SelectValue placeholder={t('booking.time.placeholder')} />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              {generateTimeSlots().filter(timeSlot => {
                                const isBlocked = isTimeSlotBlocked(timeSlot);
                                const isInPast = isTimeSlotInPast(timeSlot);
                                const isConflicted = isTimeSlotConflicted(timeSlot);
                                const isInBookedRange = isTimeSlotInBookedRange(timeSlot);
                                return !isConflicted && !isBlocked && !isInPast && !isInBookedRange;
                              }).map(timeSlot => (
                                <SelectItem
                                  key={timeSlot}
                                  value={timeSlot}
                                >
                                  {timeSlot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {client.selectedTime && isTimeBlocked(client.selectedTime) && (
                            <p className="text-sm text-red-600 mt-1">{t('booking.time.unavailable')}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor={`preferredTime-${index}`}>{t('booking.preferred.label')}</Label>
                          <Input
                            id={`preferredTime-${index}`}
                            placeholder={t('booking.preferred.placeholder')}
                            value={client.preferredTime}
                            onChange={(e) => handleClientChange(index, 'preferredTime', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}

                    {/* Notes */}
                    <div>
                      <Label htmlFor="notes">{t('booking.notes.label')}</Label>
                      <Textarea
                        id="notes"
                        placeholder={t('booking.notes.placeholder')}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>

                    {/* Book Button */}
                    <Button
                      onClick={() => {
                        console.log('Confirm Booking clicked');
                        console.log('isFormValid:', isFormValid);
                        console.log('bookingLoading:', bookingLoading);
                        console.log('clients:', clients);
                        setShowConfirmDialog(true);
                      }}
                      disabled={!isFormValid || bookingLoading}
                      className="w-full"
                      size="lg"
                    >
                      {bookingLoading ? t('booking.loading.booking') : t('booking.confirm.button')}
                    </Button>

                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Booking;
