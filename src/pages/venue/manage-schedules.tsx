"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { fetchVenueById, fetchVenueSchedules, createVenueSchedule } from "@/redux/features/venue/venueThunks"
import type { RootState } from "@/redux/store"
import type { CreateSchedulePayload } from "@/redux/features/venue/venueTypes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2, Plus } from "lucide-react"
import toast from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ScheduleList from "./schedule-list"

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function ManageSchedules() {
  const { venueId } = useParams<{ venueId: string }>()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedVenue, schedules, status, error } = useSelector((state: RootState) => state.venues)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [interval, setInterval] = useState("60")
  const [courtNumber, setCourtNumber] = useState("1")
  const [price, setPrice] = useState("")
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (venueId) {
      dispatch(fetchVenueById(venueId) as any)
      dispatch(fetchVenueSchedules(venueId) as any)
    }
  }, [dispatch, venueId])

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!venueId || selectedDays.length === 0) {
      toast.error("Please select at least one day of the week")
      return
    }

    setIsSubmitting(true)

    try {
      const scheduleData: CreateSchedulePayload = {
        venueId,
        startTime,
        endTime,
        interval: Number.parseInt(interval),
        courtNumber: Number.parseInt(courtNumber),
        daysOfWeek: selectedDays,
      }

      if (price) {
        scheduleData.price = Number.parseFloat(price)
      }

      await dispatch(createVenueSchedule(scheduleData) as any)
      toast.success("Schedule created successfully")
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to create schedule")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setStartTime("")
    setEndTime("")
    setInterval("60")
    setCourtNumber("1")
    setPrice("")
    setSelectedDays([])
  }

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  if (status === "loading" && !selectedVenue) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (status === "failed") {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive">Error: {error}</p>
      </div>
    )
  }

  if (!selectedVenue) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Venue not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Manage Schedules</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Schedule</DialogTitle>
              <DialogDescription>Add a recurring schedule for {selectedVenue.name}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSchedule}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interval">Interval (minutes)</Label>
                    <Input
                      id="interval"
                      type="number"
                      min="15"
                      step="15"
                      value={interval}
                      onChange={(e) => setInterval(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courtNumber">Court Number</Label>
                    <Input
                      id="courtNumber"
                      type="number"
                      min="1"
                      value={courtNumber}
                      onChange={(e) => setCourtNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price per Slot (optional)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Days of Week</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day}`}
                          checked={selectedDays.includes(day)}
                          onCheckedChange={() => toggleDay(day)}
                        />
                        <Label htmlFor={`day-${day}`}>{day}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schedules for {selectedVenue.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleList venueId={venueId as string} schedules={schedules} />
        </CardContent>
      </Card>
    </div>
  )
}

