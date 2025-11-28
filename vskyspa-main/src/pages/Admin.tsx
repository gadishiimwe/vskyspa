import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

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
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Clock,
  CheckSquare,
  XSquare,
  Users,
  CalendarDays,
  TrendingUp,
  Home,
  AlertCircle,
  UserCheck,
  UserX,
  Trash2,
  RefreshCw,
  BarChart3,
  Settings,
  DollarSign,
  Target,
  Activity,
  PieChart,
  LineChart,
  BarChart
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
  const [activeTab, setActiveTab] = useState('overview')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)








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



  // Load all bookings when component mounts
  useEffect(() => {
    if (authenticated) {
      loadAllBookings()
      loadBlockedSlots()
    }
  }, [authenticated])

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
          console.log('New booking received:', payload)
          const newBooking = payload.new as Booking
          setPendingBookings(prev => [newBooking, ...prev])

          toast.info(`New booking from ${newBooking.client_name}`)
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

          // Remove from old status and add to new status
          if (oldBooking.status !== updatedBooking.status) {
            if (oldBooking.status === 'pending') {
              setPendingBookings(prev => prev.filter(b => b.id !== updatedBooking.id))
            } else if (oldBooking.status === 'active') {
              setApprovedBookings(prev => prev.filter(b => b.id !== updatedBooking.id))
            } else if (oldBooking.status === 'cancelled') {
              setDeclinedBookings(prev => prev.filter(b => b.id !== updatedBooking.id))
            }

      // Add to new status
      if (updatedBooking.status === 'active') {
        setApprovedBookings(prev => [updatedBooking, ...prev])
      } else if (updatedBooking.status === 'cancelled') {
        setDeclinedBookings(prev => [updatedBooking, ...prev])
      }
          } else {
            // Update within same status
            if (updatedBooking.status === 'pending') {
              setPendingBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b))
            } else if (updatedBooking.status === 'active') {
              setApprovedBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b))
            } else if (updatedBooking.status === 'declined') {
              setDeclinedBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b))
            }
          }
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
    { id: 'pending', label: 'Pending', icon: AlertCircle, color: 'text-yellow-600', count: pendingBookings.length },
    { id: 'approved', label: 'Approved', icon: UserCheck, color: 'text-green-600', count: approvedBookings.length },
    { id: 'declined', label: 'Declined', icon: UserX, color: 'text-red-600', count: declinedBookings.length },
    { id: 'block-times', label: 'Block Times', icon: CalendarDays, color: 'text-purple-600' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-indigo-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600' },
  ]

  // Analytics functions
  const calculateAnalytics = () => {
    const allBookings = [...pendingBookings, ...approvedBookings, ...declinedBookings]
    const days = analyticsPeriod === '7d' ? 7 : analyticsPeriod === '30d' ? 30 : 90

    // Revenue data
    const revenueLabels = []
    const revenueValues = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      revenueLabels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))

      const dayRevenue = allBookings
        .filter(b => b.date === dateStr && b.status === 'active')
        .reduce((sum, b) => sum + (b.price || 0), 0)
      revenueValues.push(dayRevenue)
    }

    setRevenueData({
      labels: revenueLabels,
      datasets: [{
        label: 'Revenue (RWF)',
        data: revenueValues,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    })

    // Service popularity - handle empty data
    const serviceCount: { [key: string]: number } = {}
    allBookings.forEach(booking => {
      serviceCount[booking.service] = (serviceCount[booking.service] || 0) + 1
    })

    const topServices = Object.entries(serviceCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)

    // Ensure we have at least some data for the pie chart
    const serviceLabels = topServices.length > 0
      ? topServices.map(([service]) => service.length > 20 ? service.substring(0, 20) + '...' : service)
      : ['No data available']
    const serviceData = topServices.length > 0
      ? topServices.map(([,count]) => count)
      : [1]

    setServicePopularity({
      labels: serviceLabels,
      datasets: [{
        data: serviceData,
        backgroundColor: topServices.length > 0 ? [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ] : ['#E5E7EB'],
        borderWidth: 2
      }]
    })

    // Booking trends
    const trendLabels = []
    const pendingValues = []
    const approvedValues = []
    const declinedValues = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      trendLabels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))

      pendingValues.push(pendingBookings.filter(b => b.date === dateStr).length)
      approvedValues.push(approvedBookings.filter(b => b.date === dateStr).length)
      declinedValues.push(declinedBookings.filter(b => b.date === dateStr).length)
    }

    setBookingTrends({
      labels: trendLabels,
      datasets: [
        {
          label: 'Pending',
          data: pendingValues,
          backgroundColor: 'rgba(245, 158, 11, 0.8)',
          borderColor: 'rgb(245, 158, 11)',
          borderWidth: 1
        },
        {
          label: 'Approved',
          data: approvedValues,
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1
        },
        {
          label: 'Declined',
          data: declinedValues,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1
        }
      ]
    })
  }

  // Settings functions
  const handleSaveBusinessHours = () => {
    toast.success('Business hours updated successfully')
  }

  const handleSaveNotifications = () => {
    toast.success('Notification settings updated successfully')
  }

  const handleSavePricing = () => {
    toast.success('Pricing settings updated successfully')
  }

  const handleSaveBusinessInfo = () => {
    toast.success('Business information updated successfully')
  }

  const handleSaveAdminSettings = () => {
    toast.success('Admin settings updated successfully')
  }

  // Analytics functions
  const calculateAnalytics = () => {
    const allBookings = [...pendingBookings, ...approvedBookings, ...declinedBookings]
    const days = analyticsPeriod === '7d' ? 7 : analyticsPeriod === '30d' ? 30 : 90

    // Revenue data
    const revenueLabels = []
    const revenueValues = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      revenueLabels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))

      const dayRevenue = allBookings
        .filter(b => b.date === dateStr && b.status === 'active')
        .reduce((sum, b) => sum + (b.price || 0), 0)
      revenueValues.push(dayRevenue)
    }

    setRevenueData({
      labels: revenueLabels,
      datasets: [{
        label: 'Revenue (RWF)',
        data: revenueValues,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    })

    // Service popularity - handle empty data
    const serviceCount: { [key: string]: number } = {}
    allBookings.forEach(booking => {
      serviceCount[booking.service] = (serviceCount[booking.service] || 0) + 1
    })

    const topServices = Object.entries(serviceCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)

    // Ensure we have at least some data for the pie chart
    const serviceLabels = topServices.length > 0
      ? topServices.map(([service]) => service.length > 20 ? service.substring(0, 20) + '...' : service)
      : ['No data available']
    const serviceData = topServices.length > 0
      ? topServices.map(([,count]) => count)
      : [1]

    setServicePopularity({
      labels: serviceLabels,
      datasets: [{
        data: serviceData,
        backgroundColor: topServices.length > 0 ? [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ] : ['#E5E7EB'],
        borderWidth: 2
      }]
    })

    // Booking trends
    const trendLabels = []
    const pendingValues = []
    const approvedValues = []
    const declinedValues = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      trendLabels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))

      pendingValues.push(pendingBookings.filter(b => b.date === dateStr).length)
      approvedValues.push(approvedBookings.filter(b => b.date === dateStr).length)
      declinedValues.push(declinedBookings.filter(b => b.date === dateStr).length)
    }

    setBookingTrends({
      labels: trendLabels,
      datasets: [
        {
          label: 'Pending',
          data: pendingValues,
          backgroundColor: 'rgba(245, 158, 11, 0.8)',
          borderColor: 'rgb(245, 158, 11)',
          borderWidth: 1
        },
        {
          label: 'Approved',
          data: approvedValues,
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1
        },
        {
          label: 'Declined',
          data: declinedValues,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1
        }
      ]
    })
  }

  // Settings functions
  const handleSaveBusinessHours = () => {
    toast.success('Business hours updated successfully')
  }

  const handleSaveNotifications = () => {
    toast.success('Notification settings updated successfully')
  }

  const handleSavePricing = () => {
    toast.success('Pricing settings updated successfully')
  }

  const handleSaveBusinessInfo = () => {
    toast.success('Business information updated successfully')
  }

  const handleSaveAdminSettings = () => {
    toast.success('Admin settings updated successfully')
  }

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

  const renderBookingCard = (booking: Booking, status: string) => {
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

    return (
      <div key={booking.id} className={`p-4 border rounded-lg ${statusColors[status as keyof typeof statusColors]}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-gray-800">{booking.client_name}</h4>
              {statusBadges[status as keyof typeof statusBadges]}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
              <p><strong>Phone:</strong> {booking.client_phone}</p>
              <p><strong>Service:</strong> {booking.service}</p>
              <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {booking.time_hour.toString().padStart(2, '0')}:{booking.time_minute.toString().padStart(2, '0')}</p>
              <p><strong>People:</strong> {booking.people}</p>
              <p><strong>Price:</strong> {servicePrices[booking.service as keyof typeof servicePrices] || '0 RWF'}</p>
              {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
            </div>
            <p className="text-xs text-gray-500">
              {status === 'pending' ? 'Requested' : 'Processed'}: {new Date(booking.created_at).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            {status === 'pending' && (
              <>
                <Button
                  onClick={() => handleApproveBooking(booking.id)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleDeclineBooking(booking.id)}
                  size="sm"
                  variant="destructive"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Decline
                </Button>
              </>
            )}
            <Button
              onClick={() => handleDeleteBooking(booking.id)}
              size="sm"
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Delete
            </Button>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <AlertCircle className="h-8 w-8 text-yellow-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Pending</p>
                          <p className="text-2xl font-bold text-gray-900">{pendingBookings.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <UserCheck className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Approved</p>
                          <p className="text-2xl font-bold text-gray-900">{approvedBookings.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <UserX className="h-8 w-8 text-red-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Declined</p>
                          <p className="text-2xl font-bold text-gray-900">{declinedBookings.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Total</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {pendingBookings.length + approvedBookings.length + declinedBookings.length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <p className="text-sm text-gray-600">Latest booking requests and actions</p>
                  </CardHeader>
                  <CardContent>
                    {loadingBookings ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-2">Loading activity...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {[...pendingBookings.slice(0, 3), ...approvedBookings.slice(0, 2), ...declinedBookings.slice(0, 1)]
                          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                          .slice(0, 5)
                          .map((booking) => renderBookingCard(booking, booking.status))}
                      </div>
                    )}
                  </CardContent>
                </Card>
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
                        {pendingBookings.map((booking) => renderBookingCard(booking, 'pending'))}
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
                        {approvedBookings.map((booking) => renderBookingCard(booking, 'active'))}
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
                        {declinedBookings.map((booking) => renderBookingCard(booking, 'declined'))}
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
                        <Calendar
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
                        <CardTitle>Booked Time Slots</CardTitle>
                        <p className="text-sm text-gray-600">All approved bookings across all dates</p>
                      </CardHeader>
                      <CardContent>
                        {loadingBookings ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                            <p className="text-sm text-gray-600 mt-2">Loading booked slots...</p>
                          </div>
                        ) : approvedBookings.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No approved bookings yet</p>
                            <p className="text-sm">Approved bookings will appear here</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {approvedBookings.map((booking) => (
                              <div key={booking.id} className="p-4 border rounded-lg bg-green-50 border-green-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-medium text-green-800">
                                        {new Date(booking.date).toLocaleDateString()} at {booking.time_hour.toString().padStart(2, '0')}:{booking.time_minute.toString().padStart(2, '0')}
                                      </p>
                                      <Badge className="bg-green-100 text-green-800">
                                        Booked
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-green-600">
                                      {booking.service} - {booking.people} person{booking.people > 1 ? 's' : ''}
                                    </p>
                                    <p className="text-sm text-green-700 font-medium">
                                      {servicePrices[booking.service as keyof typeof servicePrices] || '0 RWF'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Client: {booking.client_name} - {booking.client_phone}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Booked on: {new Date(booking.created_at).toLocaleString()}
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
