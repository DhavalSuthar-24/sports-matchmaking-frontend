"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, Link, useNavigate } from "react-router-dom"
import { fetchVenueById, fetchVenueTimeSlots, fetchVenueSchedules, deleteVenue } from "@/redux/features/venue/venueThunks"
import type { RootState } from "@/redux/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Building,
  MapPin,
  Phone,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Trash2,
  Edit,
  ArrowLeft,
  Loader2,
} from "lucide-react"
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
import toast from "react-hot-toast"
import TimeSlotList from "./time-slot-list"
import ScheduleList from "./schedule-list"

export default function VenueDetail() {
  const { venueId } = useParams<{ venueId: string }>()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedVenue, timeSlots, schedules, status, error } = useSelector((state: RootState) => state.venues)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    if (venueId) {
      dispatch(fetchVenueById(venueId) as any)
      dispatch(fetchVenueTimeSlots(venueId) as any)
      dispatch(fetchVenueSchedules(venueId) as any)
    }
  }, [dispatch, venueId])

  const handleDelete = async () => {
    if (!venueId) return

    try {
      await dispatch(deleteVenue(venueId) as any)
      toast.success("Venue deleted successfully")
      navigate("/")
    } catch (error) {
      toast.error("Failed to delete venue")
    }
  }

  if (status === "loading") {
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
          <h1 className="text-3xl font-bold tracking-tight">{selectedVenue.name}</h1>
        </div>
        <div className="flex gap-2">
          <Link to={`/venues/${venueId}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the venue and all associated time slots and
                  schedules.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="aspect-video w-full bg-muted rounded-md overflow-hidden">
                {selectedVenue.images && selectedVenue.images.length > 0 ? (
                  <img
                    src={selectedVenue.images[0] || "/placeholder.svg"}
                    alt={selectedVenue.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <Building className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="time-slots">Time Slots</TabsTrigger>
                  <TabsTrigger value="schedules">Schedules</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 pt-4">
                  <div>
                    <h3 className="text-lg font-medium">Description</h3>
                    <p className="text-muted-foreground mt-1">
                      {selectedVenue.description || "No description available"}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium">Facilities</h3>
                    {selectedVenue.facilities && selectedVenue.facilities.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedVenue.facilities.map((facility, index) => (
                          <Badge key={index} variant="secondary">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground mt-1">No facilities listed</p>
                    )}
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-medium">Location</h3>
                      <div className="flex items-center mt-1 text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        {selectedVenue.location}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Contact</h3>
                      <div className="flex items-center mt-1 text-muted-foreground">
                        <Phone className="mr-2 h-4 w-4" />
                        {selectedVenue.contactInfo || "No contact information"}
                      </div>
                    </div>

                    {selectedVenue.hourlyRate && (
                      <div>
                        <h3 className="text-lg font-medium">Hourly Rate</h3>
                        <div className="flex items-center mt-1 text-muted-foreground">
                          <DollarSign className="mr-2 h-4 w-4" />${selectedVenue.hourlyRate}
                        </div>
                      </div>
                    )}

                    {selectedVenue.capacityPeople && (
                      <div>
                        <h3 className="text-lg font-medium">Capacity</h3>
                        <div className="flex items-center mt-1 text-muted-foreground">
                          <Users className="mr-2 h-4 w-4" />
                          {selectedVenue.capacityPeople} people
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="time-slots" className="pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Available Time Slots</h3>
                    <Link to={`/venues/${venueId}/time-slots`}>
                      <Button size="sm">Manage Time Slots</Button>
                    </Link>
                  </div>
                  <TimeSlotList venueId={venueId as string} timeSlots={timeSlots} />
                </TabsContent>

                <TabsContent value="schedules" className="pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Schedules</h3>
                    <Link to={`/venues/${venueId}/schedules`}>
                      <Button size="sm">Manage Schedules</Button>
                    </Link>
                  </div>
                  <ScheduleList venueId={venueId as string} schedules={schedules} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to={`/venues/${venueId}/time-slots`} className="w-full">
                <Button className="w-full" variant="outline">
                  <Clock className="mr-2 h-4 w-4" />
                  Manage Time Slots
                </Button>
              </Link>
              <Link to={`/venues/${venueId}/schedules`} className="w-full">
                <Button className="w-full" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Schedules
                </Button>
              </Link>
              <Link to={`/venues/${venueId}/edit`} className="w-full">
                <Button className="w-full" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Venue
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

