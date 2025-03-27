"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { fetchVenueById, updateVenue } from "@/redux/features/venue/venueThunks"
import type { RootState } from "@/redux/store"
import type { UpdateVenuePayload } from "@/redux/features/venue/venueTypes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import VenueForm from "./venue-form"

export default function EditVenue() {
  const { venueId } = useParams<{ venueId: string }>()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedVenue, status, error } = useSelector((state: RootState) => state.venues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (venueId) {
      dispatch(fetchVenueById(venueId) as any)
    }
  }, [dispatch, venueId])

  const handleSubmit = async (data: UpdateVenuePayload) => {
    if (!venueId) return

    setIsSubmitting(true)

    try {
      await dispatch(updateVenue({ venueId, venueData: data }) as any)
      toast.success("Venue updated successfully")
      navigate(`/venues/${venueId}`)
    } catch (error) {
      toast.error("Failed to update venue")
    } finally {
      setIsSubmitting(false)
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
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Venue</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Venue Information</CardTitle>
        </CardHeader>
        <CardContent>
          <VenueForm onSubmit={handleSubmit} isSubmitting={isSubmitting} initialData={selectedVenue} />
        </CardContent>
      </Card>
    </div>
  )
}

