"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import {
  fetchVenueById,
  fetchVenueTimeSlots,
  createVenueTimeSlot,
  deleteVenueTimeSlot,
} from "@/redux/features/venue/venueThunks"
import type { RootState } from "@/redux/store"
import type { CreateVenueTimeSlotPayload } from "@/redux/features/venue/venueTypes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import TimeSlotList from "./time-slot-list"

export default function ManageTimeSlots() {
  const { venueId } = useParams<{ venueId: string }>()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedVenue, timeSlots, status, error } = useSelector((state: RootState) => state.venues)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (venueId) {
      dispatch(fetchVenueById(venueId) as any)
      dispatch(fetchVenueTimeSlots(venueId) as any)
    }
  }, [dispatch, venueId])

  const handleCreateTimeSlot = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!venueId) return

    setIsSubmitting(true)

    try {
      const timeSlotData: CreateVenueTimeSlotPayload = {
        startTime,
        endTime,
      }

      await dispatch(createVenueTimeSlot({ venueId, timeSlotData }) as any)
      toast.success("Time slot created successfully")
      setIsDialogOpen(false)
      setStartTime("")
      setEndTime("")
    } catch (error) {
      toast.error("Failed to create time slot")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTimeSlot = async (slotId: string) => {
    if (!venueId) return

    try {
      await dispatch(deleteVenueTimeSlot({ venueId, slotId }) as any)
      toast.success("Time slot deleted successfully")
    } catch (error) {
      toast.error("Failed to delete time slot")
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Manage Time Slots</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Time Slot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Time Slot</DialogTitle>
              <DialogDescription>Add a new time slot for {selectedVenue.name}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTimeSlot}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
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
          <CardTitle>Time Slots for {selectedVenue.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeSlotList venueId={venueId as string} timeSlots={timeSlots} />
        </CardContent>
      </Card>
    </div>
  )
}

