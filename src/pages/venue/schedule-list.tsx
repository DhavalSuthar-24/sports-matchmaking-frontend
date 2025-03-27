"use client"

import type { VenueSchedule } from "@/redux/features/venue/venueTypes"
import { useDispatch } from "react-redux"
import { deleteVenueSchedule, generateDailySlots } from "@/redux/features/venue/venueThunks"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { Calendar, Clock, DollarSign, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import toast from "react-hot-toast"
import { useState } from "react"

interface ScheduleListProps {
  venueId: string
  schedules: VenueSchedule[]
}

export default function ScheduleList({ venueId, schedules }: ScheduleListProps) {
  const dispatch = useDispatch()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [generatingSlots, setGeneratingSlots] = useState<Record<string, boolean>>({})

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      await dispatch(deleteVenueSchedule(scheduleId) as any)
      toast.success("Schedule deleted successfully")
    } catch (error) {
      toast.error("Failed to delete schedule")
    }
  }

  const handleGenerateSlots = async (scheduleId: string, selectedDate: Date) => {
    if (!selectedDate) {
      toast.error("Please select a date")
      return
    }

    setGeneratingSlots((prev) => ({ ...prev, [scheduleId]: true }))

    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd")
      await dispatch(generateDailySlots({ scheduleId, date: formattedDate }) as any)
      toast.success("Time slots generated successfully")
    } catch (error) {
      toast.error("Failed to generate time slots")
    } finally {
      setGeneratingSlots((prev) => ({ ...prev, [scheduleId]: false }))
    }
  }

  if (schedules.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No schedules available for this venue.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <Card key={schedule.id}>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Court #{schedule.courtNumber}</h4>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This will delete the schedule and cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteSchedule(schedule.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>
                {format(parseISO(schedule.startTime), "h:mm a")} - {format(parseISO(schedule.endTime), "h:mm a")}
              </span>
            </div>

            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {schedule.daysOfWeek.map((day, index) => (
                  <Badge key={index} variant="outline">
                    {day}
                  </Badge>
                ))}
              </div>
            </div>

            {schedule.price && (
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>${schedule.price} per slot</span>
              </div>
            )}

            <div className="text-sm text-muted-foreground">{schedule.interval} minute intervals</div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full" disabled={generatingSlots[schedule.id]}>
                  {generatingSlots[schedule.id] ? <>Generating...</> : <>Generate Slots for a Day</>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                <div className="p-2 border-t">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => date && handleGenerateSlots(schedule.id, date)}
                    disabled={!date || generatingSlots[schedule.id]}
                  >
                    Generate Slots
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

