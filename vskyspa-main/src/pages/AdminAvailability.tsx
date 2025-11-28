import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { supabase, getAvailability, blockTimeSlot, unblockTimeSlot, TimeSlot, subscribeToAvailabilityChanges } from '@/lib/supabase'
import { Lock, Unlock, Calendar as CalendarIcon } from 'lucide-react'

const AdminAvailability = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [blockReason, setBlockReason] = useState('')
  const [adminEmail, setAdminEmail] = useState('')

  // Load availability for selected date
  const loadAvailability = async () => {
    setLoading(true)
    try {
      const slots = await getAvailability(selectedDate)
      setTimeSlots(slots)
    } catch (error) {
      console.error('Error loading availability:', error)
      toast.error('Failed to load availability')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAvailability()
  }, [selectedDate])

  // Subscribe to real-time changes
  useEffect(() => {
    const unsubscribe = subscribeToAvailabilityChanges(() => {
      loadAvailability()
    })

    return unsubscribe
  }, [selectedDate])

  const handleBlockSlot = async () => {
    if (!selectedSlot || !blockReason.trim() || !adminEmail.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      await blockTimeSlot(
        selectedDate.toISOString().split('T')[0],
        selectedSlot.hour,
        selectedSlot.minute,
        blockReason,
        adminEmail
      )
      toast.success('Time slot blocked successfully')
      setBlockDialogOpen(false)
      setBlockReason('')
      setSelectedSlot(null)
      loadAvailability()
    } catch (error) {
      console.error('Error blocking slot:', error)
      toast.error('Failed to block time slot')
    }
  }

  const handleUnblockSlot = async (slot: TimeSlot) => {
    try {
      await unblockTimeSlot(
        selectedDate.toISOString().split('T')[0],
        slot.hour,
        slot.minute
      )
      toast.success('Time slot unblocked successfully')
      loadAvailability()
    } catch (error) {
      console.error('Error unblocking slot:', error)
      toast.error('Failed to unblock time slot')
    }
  }

  const getSlotColor = (slot: TimeSlot) => {
    if (slot.isBlocked) return 'bg-red-100 border-red-300 text-red-800 cursor-not-allowed'
    if (!slot.available) return 'bg-gray-100 border-gray-300 text-gray-800 cursor-not-allowed'
    if (slot.remainingSpots === 1) return 'bg-yellow-100 border-yellow-300 text-yellow-800 cursor-pointer hover:bg-yellow-200'
    return 'bg-green-100 border-green-300 text-green-800 cursor-pointer hover:bg-green-200'
  }

  const getSlotIcon = (slot: TimeSlot) => {
    if (slot.isBlocked) return <Lock className="h-4 w-4" />
    return <Unlock className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mt-[116px] pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Availability Management</h1>
            <p className="text-gray-600">Manage time slot availability for V&SKY SPA bookings</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar Section */}
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

            {/* Time Slots Grid */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Time Slots - {selectedDate.toLocaleDateString()}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="bg-green-100 text-green-800">Available</Badge>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">1 Spot Left</Badge>
                    <Badge variant="outline" className="bg-gray-100 text-gray-800">Fully Booked</Badge>
                    <Badge variant="outline" className="bg-red-100 text-red-800">Blocked</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {timeSlots.map((slot) => (
                        <div
                          key={`${slot.hour}-${slot.minute}`}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getSlotColor(slot)}`}
                          onClick={() => {
                            if (slot.isBlocked) {
                              handleUnblockSlot(slot)
                            } else {
                              setSelectedSlot(slot)
                              setBlockDialogOpen(true)
                            }
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{slot.timeString}</span>
                            {getSlotIcon(slot)}
                          </div>
                          <p className="text-xs">{slot.label}</p>
                          {!slot.isBlocked && slot.available && (
                            <p className="text-xs mt-1">{slot.remainingSpots} spots left</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Block Slot Dialog */}
          <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Block Time Slot</DialogTitle>
                <DialogDescription>
                  Block this time slot to prevent bookings for this time period.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="slot">Time Slot</Label>
                  <Input
                    id="slot"
                    value={selectedSlot ? selectedSlot.timeString : ''}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="admin-email">Your Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@vskyspa.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="reason">Reason for Blocking</Label>
                  <Textarea
                    id="reason"
                    placeholder="e.g., Staff meeting, Maintenance, Holiday"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => setBlockDialogOpen(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBlockSlot}
                    className="flex-1"
                  >
                    Block Slot
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AdminAvailability
