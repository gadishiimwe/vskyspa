import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar as UICalendar } from '@/components/ui/calendar'

import { toast } from 'sonner'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Menu } from 'lucide-react'

// Service pricing map
const servicePrices = {
  "Deep Cleaning for Full Body (60 min)": "45,000 RWF",
  "Face Cleaning & Moisturizing (60 min)": "40,000 RWF",
  "Hair Braiding (60 min)": "25,000 RWF",
  "Hair Braiding (90 min)": "35,000 RWF",
  "Hair Treatment (45 min)": "30,000 RWF",
  "Professional Styling (30 min)": "20,000 RWF",
  "Professional Styling (60 min)": "30,000 RWF",
  "Full Body Relax Massage (Oil) (60 min)": "30,000 RWF",
  "Full Body Relax Massage (Oil) (90 min)": "40,000 RWF",
  "Hot Stone Massage (Oil) (90 min)": "50,000 RWF",
  "Hot Stone Massage (Oil) (120 min)": "70,000 RWF",
  "Deep Tissue Massage (Oil) (60 min)": "30,000 RWF",
  "Deep Tissue Massage (Oil) (90 min)": "40,000 RWF",
  "Four Hands Massage (Oil) (30 min)": "30,000 RWF",
  "Head Massage & Hair Wash (30 min)": "20,000 RWF",
  "Professional Foot Bath Massage (60 min)": "40,000 RWF",
  "Shoulder, Back, Head & Leg Massage (30 min)": "20,000 RWF",
  "VIP 1 Card (200K → 230K)": "200,000 RWF",
  "VIP 2 Card (300K → 350K)": "300,000 RWF",
  "VIP 3 Card (400K → 500K)": "400,000 RWF",
  "VIP 4 Card (500K → 600K)": "500,000 RWF",
  "Cappuccino Coffee": "4,000 RWF",
  "Café Latte": "4,000 RWF",
  "Americano Coffee": "3,000 RWF",
  "Hot Chocolate": "4,500 RWF",
  "Black Coffee": "2,500 RWF",
  "African Tea": "3,000 RWF",
  "African Coffee": "4,000 RWF",
  "Spice Tea": "4,500 RWF",
  "Fruit Tea": "4,500 RWF",
  "Iced Cappuccino": "4,000 RWF",
  "Iced Café Mocha": "4,000 RWF",
  "Iced Café Latte": "4,000 RWF",
  "Iced Americano": "4,000 RWF",
};
import {
  blockTimeSlot,
  getPendingBookings,
  getApprovedBookings,
  getDeclinedBookings,
  getAllBlockedSlots,
  unblockTimeSlot,
  approveBooking,
  declineBooking,
  deleteBooking,
  supabase
} from '../lib/supabase'
import type { Booking, BlockedSlot } from '../lib/supabase'
import {
  Lock,
  CalendarDays as CalendarIcon,
  CheckCircle,
  XCircle,
  Clock,
  CheckSquare,
  XSquare,
  BarChart3,
  Settings,
  Users,
  CalendarDays,
  TrendingUp,
  Home,
  AlertCircle,
  UserCheck,
  UserX,
  Trash2,
  RefreshCw,
  DollarSign,
  Target,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  Calendar,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock as ClockIcon,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const Admin = () => {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [spotsToBook, setSpotsToBook] = useState(1)
  const [bookedRanges, setBookedRanges] = useState<Array<{startTime: string, endTime: string, spots: number, date: string}>>([])
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([])
  const [approvedBookings, setApprovedBookings] = useState<Booking[]>([])
  const [declinedBookings, setDeclinedBookings] = useState<Booking[]>([])
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [loadingBlockedSlots, setLoadingBlockedSlots] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Analytics state
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'7d' | '30d' | '90d'>('30d')
  const [revenueData, setRevenueData] = useState<any>({ labels: [], datasets: [] })
  const [servicePopularity, setServicePopularity] = useState<any>({ labels: [], datasets: [] })
  const [bookingTrends, setBookingTrends] = useState<any>({ labels: [], datasets: [] })

  // Settings state
  const [businessHours, setBusinessHours] = useState({
    weekdayStart: '10:00',
    weekdayEnd: '22:00',
    weekendStart: '09:00',
    weekendEnd: '22:00'
  })
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newBookingAlerts: true,
    paymentReminders: true
  })
  const [businessInfo, setBusinessInfo] = useState({
    name: 'V&SKY SPA',
    address: 'Kigali, Rwanda',
    phone: '+250 788 123 456',
    email: 'info@vskyspa.com',
    description: 'Premium spa services in Kigali'
  })
  const [adminSettings, setAdminSettings] = useState({
    pinCode: '505050',
    sessionTimeout: 30,
    maxBookingsPerDay: 50,
    allowMultipleBookings: true
  })




  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Check PIN
    if (pin === '505050') {
      toast.success('Access granted')
      setAuthenticated(true)
    } else {
      toast.error('Invalid PIN')
    }

    setLoading(false)
  }



  const handleBookRange = async () => {
    if (!startTime || !endTime) {
      toast.error('Please select both start and end times')
      return
    }

    const start = new Date(`${selectedDate.toISOString().split('T')[0]}T${startTime}`)
    const end = new Date(`${selectedDate.toISOString().split('T')[0]}T${endTime}`)

    if (start >= end) {
      toast.error('End time must be after start time')
      return
    }

    // Validate business hours based on day of week
    const dateObj = new Date(selectedDate)
    const dayOfWeek = dateObj.getDay() // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const businessStartHour = isWeekend ? 9 : 10
    const businessEndHour = 22 // 10:00 PM

    const startHour = start.getHours()
    const endHour = end.getHours()
    if (startHour < businessStartHour || startHour > businessEndHour || endHour < businessStartHour || endHour > businessEndHour) {
      const dayType = isWeekend ? 'weekends (9 AM to 10 PM)' : 'weekdays (10 AM to 10 PM)'
      toast.error(`Booking times must be within business hours for ${dayType}`)
      return
    }

    setLoading(true)
    try {
      const slotsToBook = []
      let current = new Date(start)

      while (current < end) {
        slotsToBook.push({
          hour: current.getHours(),
          minute: current.getMinutes()
        })
        current.setMinutes(current.getMinutes() + 1)
      }

      // Book each slot in the range
      const bookingPromises = slotsToBook.map(slot =>
        blockTimeSlot(
          selectedDate.toISOString().split('T')[0],
          slot.hour,
          slot.minute,
          `Admin booked range ${startTime}-${endTime}`,
          'vskyyspa@gmail.com',
          spotsToBook
        )
      )

      await Promise.all(bookingPromises)

      // Add to booked ranges display
      setBookedRanges(prev => [...prev, {
        startTime,
        endTime,
        spots: spotsToBook,
        date: selectedDate.toISOString().split('T')[0]
      }])

      toast.success(`Booked ${slotsToBook.length} time slots from ${startTime} to ${endTime}`)
      setStartTime('')
      setEndTime('')
    } catch (error) {
      console.error('Error booking range:', error)
      toast.error('Failed to book time range')
    } finally {
      setLoading(false)
    }
  }



  // Handle approve booking
  const handleApproveBooking = async (bookingId: string) => {
    try {
      setLoadingBookings(true)
      await approveBooking(bookingId)
      toast.success('Booking approved and confirmed!')
      await loadAllBookings() // Refresh all bookings
    } catch (error: any) {
      console.error('Error approving booking:', error)
      toast.error(`Failed to approve booking: ${error.message || 'Unknown error'}`)
    } finally {
      setLoadingBookings(false)
    }
  }

  // Handle decline booking
  const handleDeclineBooking = async (bookingId: string) => {
    try {
      setLoadingBookings(true)
      await declineBooking(bookingId)
      toast.success('Booking declined')
      await loadAllBookings() // Refresh all bookings
    } catch (error: any) {
      console.error('Error declining booking:', error)
      toast.error(`Failed to decline booking: ${error.message || 'Unknown error'}`)
    } finally {
      setLoadingBookings(false)
    }
  }

  // Load all bookings data
  const loadAllBookings = async () => {
    setLoadingBookings(true)
    try {
      const [pending, approved, declined] = await Promise.all([
        getPendingBookings(),
        getApprovedBookings(),
        getDeclinedBookings()
      ])



      setPendingBookings(pending)
      setApprovedBookings(approved)
      setDeclinedBookings(declined)
    } catch (error) {
      console.error('Error loading bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setLoadingBookings(false)
    }
  }

  // Load all blocked slots
  const loadBlockedSlots = async () => {
    setLoadingBlockedSlots(true)
    try {
      const blocked = await getAllBlockedSlots()
      setBlockedSlots(blocked)
    } catch (error) {
      console.error('Error loading blocked slots:', error)
      toast.error('Failed to load blocked slots')
    } finally {
      setLoadingBlockedSlots(false)
    }
  }

  // Handle unblock slot
  const handleUnblockSlot = async (slot: BlockedSlot) => {
    if (!confirm(`Are you sure you want to unblock this time slot?`)) {
      return
    }

    try {
      setLoadingBlockedSlots(true)
      await unblockTimeSlot(slot.date, slot.time_hour, slot.time_minute)
      toast.success('Time slot unblocked successfully')
      await loadBlockedSlots() // Refresh blocked slots
    } catch (error: any) {
      console.error('Error unblocking slot:', error)
      toast.error(`Failed to unblock slot: ${error.message || 'Unknown error'}`)
    } finally {
      setLoadingBlockedSlots(false)
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

  // Helper function to calculate end time by adding duration to start time
  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = startTotalMinutes + durationMinutes;
    const endHour = Math.floor(endTotalMinutes / 60);
    const endMinute = endTotalMinutes % 60;
    return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
  };

  // Function to group consecutive bookings into time ranges
  const groupBookingsIntoRanges = (bookings: Booking[]): Array<{startTime: string, endTime: string, service: string, clientName: string, date: string, people: number}> => {
    const ranges: Array<{startTime: string, endTime: string, service: string, clientName: string, date: string, people: number}> = []

    // Group bookings by date, service, and client
    const groupedBookings = bookings.reduce((acc, booking) => {
      const key = `${booking.date}-${booking.service}-${booking.client_name}`
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(booking)
      return acc
    }, {} as Record<string, Booking[]>)

    Object.values(groupedBookings).forEach(bookings => {
      if (bookings.length === 0) return

      // Sort bookings by time
      bookings.sort((a, b) => {
        const timeA = a.time_hour * 60 + a.time_minute
        const timeB = b.time_hour * 60 + b.time_minute
        return timeA - timeB
      })

      // Find consecutive time ranges
      let currentRange: Booking[] = [bookings[0]]

      for (let i = 1; i < bookings.length; i++) {
        const prevBooking = bookings[i - 1]
        const currentBooking = bookings[i]

        const prevTime = prevBooking.time_hour * 60 + prevBooking.time_minute
        const currentTime = currentBooking.time_hour * 60 + currentBooking.time_minute

        // Check if consecutive (15 minutes apart)
        if (currentTime - prevTime === 15) {
          currentRange.push(currentBooking)
        } else {
          // End current range and start new one
          const startTime = `${currentRange[0].time_hour.toString().padStart(2, '0')}:${currentRange[0].time_minute.toString().padStart(2, '0')}`
          const lastBooking = currentRange[currentRange.length - 1]
          const endHour = lastBooking.time_minute + 15 >= 60 ? lastBooking.time_hour + 1 : lastBooking.time_hour
          const endMinute = (lastBooking.time_minute + 15) % 60
          const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`

          ranges.push({
            startTime,
            endTime,
            service: currentRange[0].service,
            clientName: currentRange[0].client_name,
            date: currentRange[0].date,
            people: currentRange[0].people
          })

          currentRange = [currentBooking]
        }
      }

      // Add the last range
      if (currentRange.length > 0) {
        const startTime = `${currentRange[0].time_hour.toString().padStart(2, '0')}:${currentRange[0].time_minute.toString().padStart(2, '0')}`
        const serviceDuration = getServiceDuration(currentRange[0].service)
        const endTime = calculateEndTime(startTime, serviceDuration)

        ranges.push({
          startTime,
          endTime,
          service: currentRange[0].service,
          clientName: currentRange[0].client_name,
          date: currentRange[0].date,
          people: currentRange[0].people
        })
      }
    })

    return ranges
  }

  // Function to group pending bookings by client only (1 request per user)
  const groupPendingBookings = (bookings: Booking[]): Array<{bookings: Booking[], startTime: string, endTime: string, service: string, clientName: string, clientPhone: string, date: string, people: number, notes?: string, created_at: string}> => {
    const groups: Array<{bookings: Booking[], startTime: string, endTime: string, service: string, clientName: string, clientPhone: string, date: string, people: number, notes?: string, created_at: string}> = []

    // Group bookings by client only (not by service or date)
    const groupedBookings = bookings.reduce((acc, booking) => {
      const key = booking.client_name
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(booking)
      return acc
    }, {} as Record<string, Booking[]>)

    Object.values(groupedBookings).forEach(bookings => {
      if (bookings.length === 0) return

      // Sort bookings by time
      bookings.sort((a, b) => {
        const timeA = a.time_hour * 60 + a.time_minute
        const timeB = b.time_hour * 60 + b.time_minute
        return timeA - timeB
      })

      const firstBooking = bookings[0]
      const lastBooking = bookings[bookings.length - 1]

      const startTime = `${firstBooking.time_hour.toString().padStart(2, '0')}:${firstBooking.time_minute.toString().padStart(2, '0')}`
      const endTime = `${lastBooking.time_hour.toString().padStart(2, '0')}:${(lastBooking.time_minute + 15).toString().padStart(2, '0')}`

      // Combine all services for this user
      const services = [...new Set(bookings.map(b => b.service))].join(', ')
      const totalPeople = bookings.reduce((sum, b) => sum + b.people, 0)

      groups.push({
        bookings,
        startTime,
        endTime,
        service: services,
        clientName: firstBooking.client_name,
        clientPhone: firstBooking.client_phone,
        date: firstBooking.date,
        people: totalPeople,
        notes: firstBooking.notes,
        created_at: firstBooking.created_at
      })
    })

    return groups
  }

  // Calculate analytics data
  const calculateAnalytics = () => {
    const allBookings = [...pendingBookings, ...approvedBookings, ...declinedBookings]

    // Filter bookings based on selected period
    const now = new Date()
    const periodDays = analyticsPeriod === '7d' ? 7 : analyticsPeriod === '30d' ? 30 : 90
    const periodStart = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000))

    const periodBookings = allBookings.filter(booking =>
      new Date(booking.created_at) >= periodStart
    )

    // If no real bookings, show demo data for illustration
    const hasRealData = periodBookings.length > 0
    let demoBookings = periodBookings

    if (!hasRealData) {
      // Generate demo data for the selected period
      demoBookings = []
      const demoServices = [
        "Deep Cleaning for Full Body (60 min)",
        "Face Cleaning & Moisturizing (60 min)",
        "Hair Braiding (60 min)",
        "Professional Styling (30 min)",
        "Full Body Relax Massage (Oil) (60 min)",
        "Hot Stone Massage (Oil) (90 min)"
      ]

      for (let i = 0; i < periodDays; i++) {
        const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000))
        const numBookings = Math.floor(Math.random() * 5) + 1 // 1-5 bookings per day

        for (let j = 0; j < numBookings; j++) {
          const service = demoServices[Math.floor(Math.random() * demoServices.length)]
          const people = Math.floor(Math.random() * 2) + 1 // 1-2 people
          const status = Math.random() > 0.3 ? 'active' : Math.random() > 0.5 ? 'pending' : 'cancelled'

          demoBookings.push({
            id: `demo-${i}-${j}`,
            date: date.toISOString().split('T')[0],
            time_hour: Math.floor(Math.random() * 10) + 10, // 10 AM - 8 PM
            time_minute: Math.floor(Math.random() * 4) * 15, // 0, 15, 30, 45 minutes
            service,
            people,
            client_name: `Demo Client ${i}-${j}`,
            client_phone: '+250 788 123 456',
            notes: 'Demo booking',
            status: status as 'pending' | 'active' | 'cancelled',
            created_at: date.toISOString(),
            price: 0
          })
        }
      }
    }

    // Revenue data - group by date
    const revenueByDate = demoBookings.reduce((acc, booking) => {
      const date = new Date(booking.created_at).toISOString().split('T')[0]
      const price = servicePrices[booking.service as keyof typeof servicePrices] || '0 RWF'
      const numericPrice = parseInt(price.replace(/[^\d]/g, '')) || 0
      const revenue = numericPrice * booking.people

      if (!acc[date]) acc[date] = 0
      acc[date] += revenue
      return acc
    }, {} as Record<string, number>)

    const sortedDates = Object.keys(revenueByDate).sort()
    setRevenueData({
      labels: sortedDates.map(date => new Date(date).toLocaleDateString()),
      datasets: [{
        label: hasRealData ? 'Revenue (RWF)' : 'Demo Revenue (RWF)',
        data: sortedDates.map(date => revenueByDate[date]),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    })

    // Service popularity - count bookings by service
    const serviceCount = demoBookings.reduce((acc, booking) => {
      if (!acc[booking.service]) acc[booking.service] = 0
      acc[booking.service] += 1
      return acc
    }, {} as Record<string, number>)

    const sortedServices = Object.entries(serviceCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10) // Top 10 services

    setServicePopularity({
      labels: sortedServices.map(([service]) => service.length > 30 ? service.substring(0, 30) + '...' : service),
      datasets: [{
        label: hasRealData ? 'Bookings' : 'Demo Bookings',
        data: sortedServices.map(([,count]) => count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
          'rgba(255, 99, 255, 0.8)',
          'rgba(99, 255, 132, 0.8)'
        ],
        borderWidth: 1
      }]
    })

    // Booking trends - bookings over time
    const bookingTrendsData = demoBookings.reduce((acc, booking) => {
      const date = new Date(booking.created_at).toISOString().split('T')[0]
      if (!acc[date]) acc[date] = 0
      acc[date] += 1
      return acc
    }, {} as Record<string, number>)

    const sortedTrendDates = Object.keys(bookingTrendsData).sort()
    setBookingTrends({
      labels: sortedTrendDates.map(date => new Date(date).toLocaleDateString()),
      datasets: [{
        label: hasRealData ? 'Bookings' : 'Demo Bookings',
        data: sortedTrendDates.map(date => bookingTrendsData[date]),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }]
    })
  }

  // Load all bookings when component mounts
  useEffect(() => {
    if (authenticated) {
      loadAllBookings()
      loadBlockedSlots()
    }
  }, [authenticated])

  // Calculate analytics when bookings or period changes
  useEffect(() => {
    if (authenticated && (pendingBookings.length > 0 || approvedBookings.length > 0 || declinedBookings.length > 0)) {
      calculateAnalytics()
    }
  }, [authenticated, pendingBookings, approvedBookings, declinedBookings, analyticsPeriod])

  // Update booked ranges when approved bookings change
  useEffect(() => {
    if (approvedBookings.length > 0) {
      const ranges = groupBookingsIntoRanges(approvedBookings)
      setBookedRanges(ranges.map(range => ({
        startTime: range.startTime,
        endTime: range.endTime,
        spots: range.people,
        date: range.date
      })))
    } else {
      setBookedRanges([])
    }
  }, [approvedBookings])



  // Real-time subscription for new bookings
  useEffect(() => {
    if (!authenticated) return

    const channel = supabase
      .channel('admin-bookings')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('INSERT event received:', payload)
          const newBooking = payload.new as Booking
          console.log('New booking details:', { id: newBooking.id, status: newBooking.status, client: newBooking.client_name })

          // Only add to pending if it's actually a new pending booking
          if (newBooking.status === 'pending') {
            setPendingBookings(prev => {
              // Check if booking already exists to prevent duplicates
              const exists = prev.some(b => b.id === newBooking.id)
              console.log('Booking exists in pending list:', exists)
              if (!exists) {
                console.log('Adding new pending booking to list')
                return [newBooking, ...prev]
              }
              console.log('Skipping duplicate booking')
              return prev
            })
            toast.info(`New booking from ${newBooking.client_name}`)
          } else {
            console.log('Skipping non-pending booking insert:', newBooking.status)
          }
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
          const updatedBooking = payload.new as Booking
          const oldBooking = payload.old as Booking

          console.log('Booking update received:', { oldBooking, updatedBooking })

          // Only process if status actually changed
          if (oldBooking.status !== updatedBooking.status) {
            console.log('Status change detected:', oldBooking.status, '->', updatedBooking.status)

            // Remove from old status list
            if (oldBooking.status === 'pending') {
              setPendingBookings(prev => prev.filter(b => b.id !== updatedBooking.id))
            } else if (oldBooking.status === 'active') {
              setApprovedBookings(prev => prev.filter(b => b.id !== updatedBooking.id))
            } else if (oldBooking.status === 'cancelled') {
              setDeclinedBookings(prev => prev.filter(b => b.id !== updatedBooking.id))
            }

            // Add to new status list
            if (updatedBooking.status === 'pending') {
              setPendingBookings(prev => {
                const exists = prev.some(b => b.id === updatedBooking.id)
                return exists ? prev : [updatedBooking, ...prev]
              })
            } else if (updatedBooking.status === 'active') {
              setApprovedBookings(prev => {
                const exists = prev.some(b => b.id === updatedBooking.id)
                return exists ? prev : [updatedBooking, ...prev]
              })
            } else if (updatedBooking.status === 'cancelled') {
              setDeclinedBookings(prev => {
                const exists = prev.some(b => b.id === updatedBooking.id)
                return exists ? prev : [updatedBooking, ...prev]
              })
            }
          } else {
            // Update within same status (for other field changes)
            if (updatedBooking.status === 'pending') {
              setPendingBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b))
            } else if (updatedBooking.status === 'active') {
              setApprovedBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b))
            } else if (updatedBooking.status === 'cancelled') {
              setDeclinedBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b))
            }
          }
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
          const deletedBooking = payload.old as Booking
          console.log('Booking delete received:', deletedBooking)

          // Remove from the appropriate status list
          if (deletedBooking.status === 'pending') {
            setPendingBookings(prev => prev.filter(b => b.id !== deletedBooking.id))
          } else if (deletedBooking.status === 'active') {
            setApprovedBookings(prev => prev.filter(b => b.id !== deletedBooking.id))
          } else if (deletedBooking.status === 'cancelled') {
            setDeclinedBookings(prev => prev.filter(b => b.id !== deletedBooking.id))
          }

          console.log('Removed deleted booking from UI:', deletedBooking.id)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [authenticated])



  if (!authenticated) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mt-[116px] pt-32 pb-16">
          <div className="container mx-auto px-4 max-w-md">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Lock className="h-6 w-6" />
                  Admin Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePinSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="pin">Enter PIN</Label>
                    <Input
                      id="pin"
                      type="password"
                      placeholder="Enter admin PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || pin.length !== 6}
                  >
                    {loading ? 'Verifying...' : 'Access Admin Panel'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home, color: 'text-blue-600' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-indigo-600' },
    { id: 'pending', label: 'Pending', icon: AlertCircle, color: 'text-yellow-600', count: groupPendingBookings(pendingBookings).length },
    { id: 'approved', label: 'Approved', icon: UserCheck, color: 'text-green-600', count: groupBookingsIntoRanges(approvedBookings).length },
    { id: 'declined', label: 'Declined', icon: UserX, color: 'text-red-600', count: groupBookingsIntoRanges(declinedBookings).length },
    { id: 'block-times', label: 'Block Times', icon: CalendarDays, color: 'text-purple-600' },
  ]

  // Handle delete booking
  const handleDeleteBooking = (bookingId: string) => {
    setBookingToDelete(bookingId)
    setDeleteDialogOpen(true)
  }

  // Confirm delete booking
  const confirmDeleteBooking = async () => {
    if (!bookingToDelete) return

    try {
      setLoadingBookings(true)
      await deleteBooking(bookingToDelete)
      toast.success('Booking deleted successfully')
      await loadAllBookings() // Refresh all bookings
    } catch (error: any) {
      console.error('Error deleting booking:', error)
      toast.error(`Failed to delete booking: ${error.message || 'Unknown error'}`)
    } finally {
      setLoadingBookings(false)
      setDeleteDialogOpen(false)
      setBookingToDelete(null)
    }
  }

  // Settings handlers
  const handleSaveBusinessInfo = () => {
    toast.success('Business information saved successfully')
    // TODO: Implement backend save
  }

  const handleSaveBusinessHours = () => {
    toast.success('Business hours saved successfully')
    // TODO: Implement backend save
  }

  const handleSaveNotifications = () => {
    toast.success('Notification settings saved successfully')
    // TODO: Implement backend save
  }

  const handleSavePricing = () => {
    toast.success('Pricing changes saved successfully')
    // TODO: Implement backend save
  }

  const handleSaveAdminSettings = () => {
    toast.success('Admin settings saved successfully')
    // TODO: Implement backend save
  }

  const renderBookingCard = (bookingOrGroup: Booking | {bookings: Booking[], startTime: string, endTime: string, service: string, clientName: string, clientPhone: string, date: string, people: number, notes?: string, created_at: string}, status: string, overrideStartTime?: string, overrideEndTime?: string, isRangeBooking?: boolean) => {
    const statusColors = {
      pending: 'bg-yellow-50 border-yellow-200',
      active: 'bg-green-50 border-green-200',
      declined: 'bg-red-50 border-red-200'
    }

    const statusBadges = {
      pending: <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending Review</Badge>,
      active: <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>,
      declined: <Badge variant="outline" className="bg-red-100 text-red-800">Declined</Badge>
    }

    const paymentMethodLabels = {
      cash: 'Cash',
      card: 'Card',
      online: 'Online'
    }

    // Check if it's a grouped booking (has bookings array) or single booking
    const isGrouped = 'bookings' in bookingOrGroup

    const booking = isGrouped ? bookingOrGroup.bookings[0] : bookingOrGroup
    const timeDisplay = overrideStartTime && overrideEndTime ? `${overrideStartTime} - ${overrideEndTime}` : (isGrouped ? `${bookingOrGroup.startTime} - ${bookingOrGroup.endTime}` : `${booking.time_hour.toString().padStart(2, '0')}:${booking.time_minute.toString().padStart(2, '0')}`)
    const bookingIds = isGrouped ? bookingOrGroup.bookings.map(b => b.id) : [booking.id]

    return (
      <div key={bookingIds.join('-')} className={`p-4 border rounded-lg ${statusColors[status as keyof typeof statusColors]}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-gray-800">{booking.client_name}</h4>
              {statusBadges[status as keyof typeof statusBadges]}
              {isRangeBooking && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  Time Range
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
              <p><strong>Phone:</strong> {booking.client_phone}</p>
              <p><strong>Service:</strong> {booking.service}</p>
              <p><strong>Booking Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {timeDisplay}</p>
              <p><strong>People:</strong> {booking.people}</p>
              <p><strong>Price:</strong> {servicePrices[booking.service as keyof typeof servicePrices] || '0 RWF'}</p>
              {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
            </div>
            <p className="text-xs text-gray-500">
              {status === 'pending' ? 'Requested' : 'Processed'}: {new Date(booking.created_at).toLocaleString()}
            </p>
            {isRangeBooking && (
              <p className="text-xs text-blue-600 mt-1">
                This represents a time range based on service duration. Individual bookings cannot be deleted from here.
              </p>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            {status === 'pending' && (
              <>
                <Button
                  onClick={() => {
                    // Approve all bookings in the group
                    bookingIds.forEach(id => handleApproveBooking(id))
                  }}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  onClick={() => {
                    // Decline all bookings in the group
                    bookingIds.forEach(id => handleDeclineBooking(id))
                  }}
                  size="sm"
                  variant="destructive"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Decline
                </Button>
              </>
            )}
            {(status === 'declined' || !isRangeBooking) && (
              <Button
                onClick={() => {
                  // Delete all bookings in the group
                  bookingIds.forEach(id => handleDeleteBooking(id))
                }}
                size="sm"
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mt-[116px] flex">
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-[116px] left-4 z-50">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="bg-white shadow-lg min-h-screen">
                <div className="p-6 border-b">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
                    <p className="text-sm text-gray-600">V&SKY SPA Management</p>
                  </div>
                </div>
                <nav className="p-4">
                  <ul className="space-y-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => {
                              setActiveTab(item.id)
                              setMobileMenuOpen(false)
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                              activeTab === item.id
                                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className={`h-5 w-5 ${item.color}`} />
                            <span className="flex-1">{item.label}</span>
                            {item.count !== undefined && item.count > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {item.count}
                              </Badge>
                            )}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6 border-b">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
              <p className="text-sm text-gray-600">V&SKY SPA Management</p>
            </div>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${item.color}`} />
                      <span className="flex-1">{item.label}</span>
                      {item.count !== undefined && item.count > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {item.count}
                        </Badge>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                    <p className="text-gray-600">Welcome to the V&SKY SPA admin panel</p>
                  </div>
                  <Button
                    onClick={loadAllBookings}
                    disabled={loadingBookings}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingBookings ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <AlertCircle className="h-8 w-8 text-yellow-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                          <p className="text-2xl font-bold text-gray-900">{groupPendingBookings(pendingBookings).length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Users className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Total People Approved</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {approvedBookings.reduce((total, booking) => total + booking.people, 0)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <DollarSign className="h-8 w-8 text-purple-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Total Money Approved</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {approvedBookings.reduce((total, booking) => {
                              const price = servicePrices[booking.service as keyof typeof servicePrices] || '0 RWF'
                              const numericPrice = parseInt(price.replace(/[^\d]/g, '')) || 0
                              return total + (numericPrice * booking.people)
                            }, 0).toLocaleString()} RWF
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity - Only Pending Bookings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Pending Requests</CardTitle>
                    <p className="text-sm text-gray-600">Latest booking requests awaiting approval</p>
                  </CardHeader>
                  <CardContent>
                    {loadingBookings ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-2">Loading activity...</p>
                      </div>
                    ) : pendingBookings.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No pending booking requests</p>
                        <p className="text-sm">New requests will appear here for review</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {groupPendingBookings(pendingBookings.slice(0, 5))
                          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                          .map((booking) => renderBookingCard(booking, 'pending'))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-600">Track your business performance and insights</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="analyticsPeriod" className="text-sm font-medium">Period:</Label>
                      <select
                        id="analyticsPeriod"
                        value={analyticsPeriod}
                        onChange={(e) => setAnalyticsPeriod(e.target.value as '7d' | '30d' | '90d')}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                      </select>
                    </div>
                    <Button
                      onClick={loadAllBookings}
                      disabled={loadingBookings}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${loadingBookings ? 'animate-spin' : ''}`} />
                      Refresh Data
                    </Button>
                  </div>
                </div>



                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <DollarSign className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {revenueData.datasets[0]?.data.reduce((sum: number, val: number) => sum + val, 0)?.toLocaleString() || '0'} RWF
                          </p>
                          <p className="text-xs text-gray-500">Last {analyticsPeriod}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <BarChart className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {bookingTrends.datasets[0]?.data.reduce((sum: number, val: number) => sum + val, 0) || 0}
                          </p>
                          <p className="text-xs text-gray-500">Last {analyticsPeriod}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <TrendingUp className="h-8 w-8 text-purple-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Avg. Revenue per Booking</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {bookingTrends.datasets[0]?.data.length > 0
                              ? Math.round((revenueData.datasets[0]?.data.reduce((sum: number, val: number) => sum + val, 0) || 0) / bookingTrends.datasets[0]?.data.reduce((sum: number, val: number) => sum + val, 0) || 1)
                              : 0} RWF
                          </p>
                          <p className="text-xs text-gray-500">Last {analyticsPeriod}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <PieChart className="h-8 w-8 text-orange-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Top Service</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {servicePopularity.labels?.[0]?.split(' ')?.[0] || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">{servicePopularity.datasets[0]?.data?.[0] || 0} bookings</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Revenue Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-5 w-5" />
                        Revenue Trends
                      </CardTitle>
                      <p className="text-sm text-gray-600">Daily revenue over the selected period</p>
                    </CardHeader>
                    <CardContent>
                      {revenueData.labels?.length > 0 ? (
                        <div className="h-80">
                          <Line
                            data={revenueData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  position: 'top' as const,
                                },
                                title: {
                                  display: false,
                                },
                              },
                              scales: {
                                y: {
                                  beginAtZero: true,
                                  ticks: {
                                    callback: function(value) {
                                      return value.toLocaleString() + ' RWF';
                                    }
                                  }
                                }
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-80 flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No revenue data available</p>
                            <p className="text-sm">Data will appear as bookings are processed</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Service Popularity Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Service Popularity
                      </CardTitle>
                      <p className="text-sm text-gray-600">Most booked services breakdown</p>
                    </CardHeader>
                    <CardContent>
                      {servicePopularity.labels?.length > 0 ? (
                        <div className="h-80">
                          <Pie
                            data={servicePopularity}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  position: 'right' as const,
                                  labels: {
                                    boxWidth: 12,
                                    font: {
                                      size: 11
                                    }
                                  }
                                },
                                tooltip: {
                                  callbacks: {
                                    label: function(context) {
                                      return `${context.label}: ${context.parsed} bookings`;
                                    }
                                  }
                                }
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-80 flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No service data available</p>
                            <p className="text-sm">Data will appear as bookings are processed</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Booking Trends Chart - Full Width */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart className="h-5 w-5" />
                        Booking Trends
                      </CardTitle>
                      <p className="text-sm text-gray-600">Daily booking volume over the selected period</p>
                    </CardHeader>
                    <CardContent>
                      {bookingTrends.labels?.length > 0 ? (
                        <div className="h-80">
                          <Bar
                            data={bookingTrends}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  position: 'top' as const,
                                },
                                title: {
                                  display: false,
                                },
                              },
                              scales: {
                                y: {
                                  beginAtZero: true,
                                  ticks: {
                                    stepSize: 1
                                  }
                                }
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-80 flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <BarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No booking trend data available</p>
                            <p className="text-sm">Data will appear as bookings are processed</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Performance Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-green-800">Best Performing Day</span>
                        <span className="text-sm font-bold text-green-700">
                          {revenueData.labels?.[revenueData.datasets[0]?.data.indexOf(Math.max(...(revenueData.datasets[0]?.data as number[]))) || 0] || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-blue-800">Total Services Offered</span>
                        <span className="text-sm font-bold text-blue-700">
                          {Object.keys(servicePrices).length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium text-purple-800">Avg. Bookings per Day</span>
                        <span className="text-sm font-bold text-purple-700">
                          {bookingTrends.labels?.length > 0
                            ? Math.round((bookingTrends.datasets[0]?.data.reduce((sum: number, val: number) => sum + val, 0) || 0) / bookingTrends.labels.length)
                            : 0}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[...pendingBookings, ...approvedBookings, ...declinedBookings]
                          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                          .slice(0, 5)
                          .map((booking, index) => (
                            <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{booking.client_name}</p>
                                <p className="text-xs text-gray-600">{booking.service}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">
                                  {new Date(booking.created_at).toLocaleDateString()}
                                </p>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    booking.status === 'active' ? 'bg-green-100 text-green-800' :
                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {booking.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        {[...pendingBookings, ...approvedBookings, ...declinedBookings].length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No recent activity</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Pending Bookings Tab */}
            {activeTab === 'pending' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Bookings</h1>
                    <p className="text-gray-600">Review and approve or decline customer booking requests</p>
                  </div>
                  <Button
                    onClick={loadAllBookings}
                    disabled={loadingBookings}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingBookings ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6">
                    {loadingBookings ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-2">Loading pending bookings...</p>
                      </div>
                    ) : pendingBookings.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No pending booking requests</p>
                        <p className="text-sm">New requests will appear here for review</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {groupPendingBookings(pendingBookings).map((group) => {
                          console.log('Rendering pending booking group:', group.bookings.map(b => b.id))
                          return renderBookingCard(group, 'pending')
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Approved Bookings Tab */}
            {activeTab === 'approved' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Approved Bookings</h1>
                    <p className="text-gray-600">Confirmed bookings that have been approved</p>
                  </div>
                  <Button
                    onClick={loadAllBookings}
                    disabled={loadingBookings}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingBookings ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6">
                    {loadingBookings ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-2">Loading approved bookings...</p>
                      </div>
                    ) : approvedBookings.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No approved bookings yet</p>
                        <p className="text-sm">Approved bookings will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {groupBookingsIntoRanges(approvedBookings).map((range) => {
                          // Create a mock booking object for the range
                          const mockBooking: Booking = {
                            id: `range-${range.startTime}-${range.endTime}-${range.date}`,
                            date: range.date,
                            time_hour: parseInt(range.startTime.split(':')[0]),
                            time_minute: parseInt(range.startTime.split(':')[1]),
                            service: range.service,
                            client_name: range.clientName,
                            client_phone: '', // Not available in range
                            people: range.people,
                            notes: undefined,
                            status: 'active',
                            created_at: new Date().toISOString(),
                            price: 0
                          };
                          return renderBookingCard(mockBooking, 'active', range.startTime, range.endTime, true);
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Declined Bookings Tab */}
            {activeTab === 'declined' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Declined Bookings</h1>
                    <p className="text-gray-600">Bookings that have been declined</p>
                  </div>
                  <Button
                    onClick={loadAllBookings}
                    disabled={loadingBookings}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingBookings ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6">
                    {loadingBookings ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-2">Loading declined bookings...</p>
                      </div>
                    ) : declinedBookings.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <UserX className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No declined bookings yet</p>
                        <p className="text-sm">Declined bookings will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {groupBookingsIntoRanges(declinedBookings).map((range) => {
                          // Create a mock booking object for the range
                          const mockBooking: Booking = {
                            id: `range-${range.startTime}-${range.endTime}-${range.date}`,
                            date: range.date,
                            time_hour: parseInt(range.startTime.split(':')[0]),
                            time_minute: parseInt(range.startTime.split(':')[1]),
                            service: range.service,
                            client_name: range.clientName,
                            client_phone: '', // Not available in range
                            people: range.people,
                            notes: undefined,
                            status: 'cancelled',
                            created_at: new Date().toISOString(),
                            price: 0
                          };
                          return renderBookingCard(mockBooking, 'declined', range.startTime, range.endTime, true);
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Block Times Tab */}
            {activeTab === 'block-times' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Block Time Slots</h1>
                  <p className="text-gray-600">Block time ranges to prevent bookings</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CalendarIcon className="h-5 w-5" />
                          Select Date & Block Range
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <UICalendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          className="rounded-md border"
                        />
                        <div className="p-3 bg-blue-50 rounded-lg">
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

                        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                          <h4 className="font-medium text-sm">Block Time Range</h4>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="startTime" className="text-xs">Start Time</Label>
                              <Input
                                id="startTime"
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="text-xs"
                              />
                            </div>
                            <div>
                              <Label htmlFor="endTime" className="text-xs">End Time</Label>
                              <Input
                                id="endTime"
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="spotsToBook" className="text-xs">Spots to Block (1-2)</Label>
                            <Input
                              id="spotsToBook"
                              type="number"
                              min="1"
                              max="2"
                              value={spotsToBook}
                              onChange={(e) => setSpotsToBook(Math.min(2, Math.max(1, parseInt(e.target.value) || 1)))}
                              className="text-xs"
                            />
                          </div>

                          <Button
                            onClick={handleBookRange}
                            className="w-full text-sm"
                            disabled={!startTime || !endTime || loading}
                          >
                            {loading ? 'Blocking...' : 'Block Range'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Booked Time Ranges</CardTitle>
                        <p className="text-sm text-gray-600">Time ranges booked by service and duration</p>
                      </CardHeader>
                      <CardContent>
                        {loadingBookings ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                            <p className="text-sm text-gray-600 mt-2">Loading booked ranges...</p>
                          </div>
                        ) : bookedRanges.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No booked time ranges yet</p>
                            <p className="text-sm">Approved bookings will appear here as time ranges</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {bookedRanges.map((range, index) => (
                              <div key={index} className="p-4 border rounded-lg bg-green-50 border-green-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-medium text-green-800">
                                        {new Date(range.date).toLocaleDateString()} from {range.startTime} to {range.endTime}
                                      </p>
                                      <Badge className="bg-green-100 text-green-800">
                                        Booked Range
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-green-600">
                                      Service duration covers this time range - {range.spots} spot{range.spots > 1 ? 's' : ''} booked
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Time range based on selected service duration
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}



            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                  <p className="text-gray-600">Configure your spa business settings and preferences</p>
                </div>

                <Tabs defaultValue="business" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="business" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Business
                    </TabsTrigger>
                    <TabsTrigger value="hours" className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4" />
                      Hours
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger value="pricing" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Pricing
                    </TabsTrigger>
                    <TabsTrigger value="admin" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Admin
                    </TabsTrigger>
                  </TabsList>

                  {/* Business Information */}
                  <TabsContent value="business" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="h-5 w-5" />
                          Business Information
                        </CardTitle>
                        <p className="text-sm text-gray-600">Update your business details and contact information</p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="businessName">Business Name</Label>
                            <Input
                              id="businessName"
                              value={businessInfo.name}
                              onChange={(e) => setBusinessInfo({...businessInfo, name: e.target.value})}
                              placeholder="Enter business name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="businessEmail">Email Address</Label>
                            <Input
                              id="businessEmail"
                              type="email"
                              value={businessInfo.email}
                              onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
                              placeholder="Enter email address"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="businessPhone">Phone Number</Label>
                            <Input
                              id="businessPhone"
                              value={businessInfo.phone}
                              onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
                              placeholder="Enter phone number"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="businessAddress">Address</Label>
                            <Input
                              id="businessAddress"
                              value={businessInfo.address}
                              onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
                              placeholder="Enter business address"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="businessDescription">Business Description</Label>
                          <textarea
                            id="businessDescription"
                            value={businessInfo.description}
                            onChange={(e) => setBusinessInfo({...businessInfo, description: e.target.value})}
                            placeholder="Enter business description"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                            rows={3}
                          />
                        </div>
                        <Button onClick={handleSaveBusinessInfo} className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Save Business Info
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Business Hours */}
                  <TabsContent value="hours" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ClockIcon className="h-5 w-5" />
                          Business Hours
                        </CardTitle>
                        <p className="text-sm text-gray-600">Set your operating hours for weekdays and weekends</p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                              <Calendar className="h-5 w-5" />
                              Weekdays (Mon-Fri)
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="weekdayStart">Opening Time</Label>
                                <Input
                                  id="weekdayStart"
                                  type="time"
                                  value={businessHours.weekdayStart}
                                  onChange={(e) => setBusinessHours({...businessHours, weekdayStart: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="weekdayEnd">Closing Time</Label>
                                <Input
                                  id="weekdayEnd"
                                  type="time"
                                  value={businessHours.weekdayEnd}
                                  onChange={(e) => setBusinessHours({...businessHours, weekdayEnd: e.target.value})}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                              <Calendar className="h-5 w-5" />
                              Weekends (Sat-Sun)
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="weekendStart">Opening Time</Label>
                                <Input
                                  id="weekendStart"
                                  type="time"
                                  value={businessHours.weekendStart}
                                  onChange={(e) => setBusinessHours({...businessHours, weekendStart: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="weekendEnd">Closing Time</Label>
                                <Input
                                  id="weekendEnd"
                                  type="time"
                                  value={businessHours.weekendEnd}
                                  onChange={(e) => setBusinessHours({...businessHours, weekendEnd: e.target.value})}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Current Hours Preview</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                            <div>
                              <strong>Weekdays:</strong> {businessHours.weekdayStart} - {businessHours.weekdayEnd}
                            </div>
                            <div>
                              <strong>Weekends:</strong> {businessHours.weekendStart} - {businessHours.weekendEnd}
                            </div>
                          </div>
                        </div>

                        <Button onClick={handleSaveBusinessHours} className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Save Business Hours
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Notifications */}
                  <TabsContent value="notifications" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="h-5 w-5" />
                          Notification Settings
                        </CardTitle>
                        <p className="text-sm text-gray-600">Configure how you receive notifications and alerts</p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Mail className="h-5 w-5 text-gray-500" />
                              <div>
                                <h4 className="font-medium">Email Notifications</h4>
                                <p className="text-sm text-gray-600">Receive booking notifications via email</p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notifications.emailNotifications}
                                onChange={(e) => setNotifications({...notifications, emailNotifications: e.target.checked})}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Phone className="h-5 w-5 text-gray-500" />
                              <div>
                                <h4 className="font-medium">SMS Notifications</h4>
                                <p className="text-sm text-gray-600">Receive booking notifications via SMS</p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notifications.smsNotifications}
                                onChange={(e) => setNotifications({...notifications, smsNotifications: e.target.checked})}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Bell className="h-5 w-5 text-gray-500" />
                              <div>
                                <h4 className="font-medium">New Booking Alerts</h4>
                                <p className="text-sm text-gray-600">Get notified immediately when new bookings are made</p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notifications.newBookingAlerts}
                                onChange={(e) => setNotifications({...notifications, newBookingAlerts: e.target.checked})}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <DollarSign className="h-5 w-5 text-gray-500" />
                              <div>
                                <h4 className="font-medium">Payment Reminders</h4>
                                <p className="text-sm text-gray-600">Send payment reminders to customers</p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notifications.paymentReminders}
                                onChange={(e) => setNotifications({...notifications, paymentReminders: e.target.checked})}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>

                        <Button onClick={handleSaveNotifications} className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Save Notification Settings
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Pricing */}
                  <TabsContent value="pricing" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          Service Pricing
                        </CardTitle>
                        <p className="text-sm text-gray-600">Manage your service prices and packages</p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                            <p className="text-sm text-yellow-800">
                              <strong>Note:</strong> Price changes will affect new bookings only. Existing bookings will maintain their original prices.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {Object.entries(servicePrices).map(([service, price]) => (
                            <div key={service} className="p-4 border rounded-lg">
                              <h4 className="font-medium text-gray-900 mb-2">{service}</h4>
                              <div className="flex items-center gap-2">
                                <Input
                                  value={price}
                                  onChange={(e) => {
                                    // This would update the servicePrices object
                                    // For now, just showing the current price
                                  }}
                                  className="flex-1"
                                />
                                <span className="text-sm text-gray-500">RWF</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <Button onClick={handleSavePricing} className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Save Pricing Changes
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Admin Settings */}
                  <TabsContent value="admin" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Admin Security & Preferences
                        </CardTitle>
                        <p className="text-sm text-gray-600">Configure admin access and system preferences</p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="adminPin">Admin PIN</Label>
                            <div className="relative">
                              <Input
                                id="adminPin"
                                type={adminSettings.pinCode === '505050' ? 'password' : 'text'}
                                value={adminSettings.pinCode}
                                onChange={(e) => setAdminSettings({...adminSettings, pinCode: e.target.value})}
                                placeholder="Enter admin PIN"
                                maxLength={6}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  // Toggle visibility logic would go here
                                }}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                              >
                                <Eye className="h-4 w-4 text-gray-500" />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500">6-digit PIN for admin panel access</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                              <Input
                                id="sessionTimeout"
                                type="number"
                                min="5"
                                max="480"
                                value={adminSettings.sessionTimeout}
                                onChange={(e) => setAdminSettings({...adminSettings, sessionTimeout: parseInt(e.target.value) || 30})}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="maxBookings">Max Bookings Per Day</Label>
                              <Input
                                id="maxBookings"
                                type="number"
                                min="1"
                                max="1000"
                                value={adminSettings.maxBookingsPerDay}
                                onChange={(e) => setAdminSettings({...adminSettings, maxBookingsPerDay: parseInt(e.target.value) || 50})}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">Allow Multiple Bookings</h4>
                              <p className="text-sm text-gray-600">Allow customers to book multiple services at once</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={adminSettings.allowMultipleBookings}
                                onChange={(e) => setAdminSettings({...adminSettings, allowMultipleBookings: e.target.checked})}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>

                        <Button onClick={handleSaveAdminSettings} className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Save Admin Settings
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteBooking} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Admin