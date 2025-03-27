"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { createVenue } from "@/redux/features/venue/venueThunks"
import type { CreateVenuePayload } from "@/redux/features/venue/venueTypes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"
import VenueForm from "./venue-form"

export default function CreateVenue() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: CreateVenuePayload) => {
    setIsSubmitting(true)

    try {
      const result = await dispatch(createVenue(data) as any)
      toast.success("Venue created successfully")
      navigate(`/venues/${result.payload.id}`)
    } catch (error) {
      toast.error("Failed to create venue")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create Venue</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Venue Information</CardTitle>
        </CardHeader>
        <CardContent>
          <VenueForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  )
}

