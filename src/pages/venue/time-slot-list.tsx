"use client"

import type { VenueTimeSlot } from "@/redux/features/venue/venueTypes"
import { useDispatch } from "react-redux"
import { bookVenueTimeSlot } from "@/redux/features/venue/venueThunks"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { Clock, DollarSign } from "lucide-react"
import toast from "react-hot-toast"

interface TimeSlotListProps {
  venueId: string
  timeSlots: VenueTimeSlot[]
}

export default function TimeSlotList({ venueId, timeSlots }: TimeSlotListProps) {
  const dispatch = useDispatch()

  const handleBookSlot = async (slotId: string) => {
    try {
      await dispatch(bookVenueTimeSlot(slotId) as any)
      toast.success("Time slot booked successfully")
    } catch (error) {
      toast.error("Failed to book time slot")
    }
  }

  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No time slots available for this venue.</p>
      </div>
    )
  }

  // Group time slots by date
  const groupedSlots: Record<string, VenueTimeSlot[]> = {}

  timeSlots.forEach((slot) => {
    const date = format(parseISO(slot.startTime), "yyyy-MM-dd")
    if (!groupedSlots[date]) {
      groupedSlots[date] = []
    }
    groupedSlots[date].push(slot)
  })

  return (
    <div className="space-y-6">
      {Object.entries(groupedSlots).map(([date, slots]) => (
        <div key={date} className="space-y-2">
          <h4 className="font-medium">{format(parseISO(date), "EEEE, MMMM d, yyyy")}</h4>
          <div className="grid gap-2 md:grid-cols-2">
            {slots.map((slot) => (
              <Card key={slot.id} className={slot.isBooked ? "border-muted" : ""}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(parseISO(slot.startTime), "h:mm a")} - {format(parseISO(slot.endTime), "h:mm a")}
                      </span>
                    </div>
                    {slot.price && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <DollarSign className="mr-1 h-3 w-3" />
                        <span>${slot.price}</span>
                      </div>
                    )}
                    {slot.courtNumber && <div className="text-sm text-muted-foreground">Court #{slot.courtNumber}</div>}
                  </div>
                  <div>
                    {slot.isBooked ? (
                      <Badge variant="secondary">Booked</Badge>
                    ) : (
                      <Button size="sm" onClick={() => handleBookSlot(slot.id)}>
                        Book
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

