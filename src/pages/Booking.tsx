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
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import { pageSEO, faqContent } from "@/seo/seoConfig";
import {
  supabase,
  getAvailability,
  createBooking,
  subscribeToAvailabilityChanges,
  TimeSlot,
  type Booking
} from '@/lib/supabase';
import { Plus, Minus, Clock, Users, Calendar as CalendarIcon } from 'lucide-react';

const Booking = () => {
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

  useEffect(() => {
    loadAvailability();
  }, [selectedDate]);

  // Subscribe to real-time changes
  useEffect(() => {
    const unsubscribe = subscribeToAvailabilityChanges(() => {
      loadAvailability();
    });

    return unsubscribe;
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
      const slot = timeSlots.find(s => s.timeString === value);
      if (slot && (!slot.available || slot.isBlocked)) {
        toast.error('This time slot is not available. Please choose a different time.');
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
        // Parse time string safely (now always HH:00 format)
        const timeParts = client.selectedTime.split(':')
        const hours = parseInt(timeParts[0]) || 0
        const minutes = 0 // Always 0 for hourly slots

        console.log('Creating booking:', {
          timeString: client.selectedTime,
          timeParts,
          hours,
          minutes,
          isHoursValid: hours >= 0 && hours <= 23
        })

        // Additional validation
        if (isNaN(hours)) {
          throw new Error(`Invalid time format: ${client.selectedTime}`)
        }

        if (hours < 0 || hours > 23) {
          throw new Error(`Invalid hour: ${hours}`)
        }

        // Get price from servicePrices map and convert to number
        const priceString = servicePrices[client.service as keyof typeof servicePrices];
        const price = priceString ? parseFloat(priceString.replace(/[^\d.]/g, '')) : 0;

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
        })
      })

      await Promise.all(bookingPromises)

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
        // Parse time string safely (now always HH:00 format)
        const timeParts = client.selectedTime.split(':')
        const hours = parseInt(timeParts[0]) || 0
        const minutes = 0 // Always 0 for hourly slots

        console.log('Creating cash booking:', {
          timeString: client.selectedTime,
          timeParts,
          hours,
          minutes,
          isHoursValid: hours >= 0 && hours <= 23
        })

        // Additional validation
        if (isNaN(hours)) {
          throw new Error(`Invalid time format: ${client.selectedTime}`)
        }

        if (hours < 0 || hours > 23) {
          throw new Error(`Invalid hour: ${hours}`)
        }

        // Get price from servicePrices map and convert to number
        const priceString = servicePrices[client.service as keyof typeof servicePrices];
        const price = priceString ? parseFloat(priceString.replace(/[^\d.]/g, '')) : 0;

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
        })
      })

      await Promise.all(bookingPromises)

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
              <p className="font-medium">Date: {selectedDate.toLocaleDateString()}</p>
              <p className="font-medium">Time: {clients.map(client => client.selectedTime).filter(Boolean).join(', ') || 'Multiple times selected'}</p>
              <p className="font-medium">People: {people}</p>
            </div>

            <div className="space-y-2">
              {clients.map((client, index) => (
                <div key={index} className="text-sm p-3 border rounded">
                  <p><strong>Person {index + 1}:</strong> {client.name}</p>
                  <p><strong>Service:</strong> {client.service}</p>
                  <p><strong>Price:</strong> {servicePrices[client.service as keyof typeof servicePrices]}</p>
                  <p><strong>Time:</strong> {client.selectedTime || 'Not selected'}</p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Price Breakdown:</h4>
              {clients.map((client, index) => (
                <div key={index} className="flex justify-between text-sm mb-1">
                  <span>{client.service}:</span>
                  <span>{servicePrices[client.service as keyof typeof servicePrices]}</span>
                </div>
              ))}
              <hr className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
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
                <p><strong>Notes:</strong> {notes}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setShowConfirmDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setShowPaymentDialog(true);
                }}
                className="flex-1"
              >
                Confirm
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
                    MTN Mobile Money
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-700 mb-2">
                      Please send the total amount to:
                    </p>
                    <div className="bg-white rounded p-3 border text-center">
                      <p className="text-lg font-bold text-green-600">*182*8*1*88194#</p>
                      <p className="text-xs text-gray-600 mt-1">Momo Code: 88194</p>
                    </div>
                    <p className="text-xs text-green-700 mt-2">
                      After payment, your booking will be confirmed automatically.
                    </p>
                  </div>
                  <Button
                    onClick={handleSubmitBooking}
                    disabled={bookingLoading}
                    className="w-full"
                    variant="default"
                  >
                    {bookingLoading ? 'Confirming...' : "I've Paid with Mobile Money"}
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
                    onClick={handleCashBooking}
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Book V&SKY SPA Kigali</h1>
          <p className="text-xl text-muted-foreground">
            Schedule stress relief massages, facials, or couples treatments in minutes.
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
                      Select Date
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
                      <p className="text-sm font-medium text-blue-900">Selected Date:</p>
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
                      Booked Time Slots
                    </CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">Fully Booked</Badge>
                      <Badge variant="outline" className="bg-red-100 text-red-800">Blocked</Badge>
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
                        {timeSlots.filter(slot => {
                          // Only show blocked slots, and exclude all past times
                          if (!slot.isBlocked) return false;
                          const slotTime = new Date(selectedDate);
                          slotTime.setHours(slot.hour, slot.minute, 0, 0);
                          if (slotTime < new Date()) return false;
                          return true;
                        }).map((slot) => (
                          <div
                            key={`${slot.hour}-${slot.minute}`}
                            className={`p-3 rounded-lg border-2 transition-all ${getSlotColor(slot)}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{slot.timeString}</span>
                              <Badge variant="outline" className="text-xs">
                                Blocked
                              </Badge>
                            </div>
                            <p className="text-xs mt-1">{slot.label}</p>
                          </div>
                        ))}
                        {timeSlots.filter(slot => {
                          if (!slot.isBlocked) return false;
                          if (selectedDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]) {
                            const now = new Date();
                            const slotTime = new Date(selectedDate);
                            slotTime.setHours(slot.hour, slot.minute, 0, 0);
                            if (slotTime < now) return false;
                          }
                          return true;
                        }).length === 0 && (
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
                      Booking Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">

                    {/* Number of People */}
                    <div>
                      <Label>Number of People</Label>
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
                        <h4 className="font-medium">Person {index + 1}</h4>

                        <div>
                          <Label htmlFor={`name-${index}`}>Full Name *</Label>
                          <Input
                            id={`name-${index}`}
                            placeholder="John Doe"
                            value={client.name}
                            onChange={(e) => handleClientChange(index, 'name', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`phone-${index}`}>Phone Number *</Label>
                          <Input
                            id={`phone-${index}`}
                            type="tel"
                            placeholder="+250 788 123 456"
                            value={client.phone}
                            onChange={(e) => handleClientChange(index, 'phone', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`service-${index}`}>Service *</Label>
                          <Select
                            value={client.service}
                            onValueChange={(value) => handleClientChange(index, 'service', value)}
                          >
                            <SelectTrigger id={`service-${index}`}>
                              <SelectValue placeholder="Choose a service" />
                            </SelectTrigger>
                            <SelectContent>
                              {services.map(service => (
                                <SelectItem key={service} value={service}>{service}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor={`selectedTime-${index}`}>Select Time *</Label>
                          <Input
                            id={`selectedTime-${index}`}
                            type="time"
                            value={client.selectedTime}
                            onChange={(e) => handleClientChange(index, 'selectedTime', e.target.value)}
                            min={getBusinessHours().start}
                            max={getBusinessHours().end}
                            step="900" // 15 minute intervals
                          />
                          {client.selectedTime && isTimeBlocked(client.selectedTime) && (
                            <p className="text-sm text-red-600 mt-1">This time is not available. Please choose a different time.</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor={`preferredTime-${index}`}>Preferred Time (Optional)</Label>
                          <Input
                            id={`preferredTime-${index}`}
                            placeholder="e.g., 2:00 PM, Evening, Morning"
                            value={client.preferredTime}
                            onChange={(e) => handleClientChange(index, 'preferredTime', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}

                    {/* Notes */}
                    <div>
                      <Label htmlFor="notes">Special Requests (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any allergies, preferences, or special requirements..."
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
                      {bookingLoading ? 'Booking...' : 'Confirm Booking'}
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
