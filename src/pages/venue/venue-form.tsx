"use client"

import type React from "react"

import { useState } from "react"
import type { Venue, CreateVenuePayload, UpdateVenuePayload } from "@/redux/features/venue/venueTypes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface VenueFormProps {
  onSubmit: (data: CreateVenuePayload | UpdateVenuePayload) => void
  isSubmitting: boolean
  initialData?: Venue
}

export default function VenueForm({ onSubmit, isSubmitting, initialData }: VenueFormProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [location, setLocation] = useState(initialData?.location || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [contactInfo, setContactInfo] = useState(initialData?.contactInfo || "")
  const [hourlyRate, setHourlyRate] = useState(initialData?.hourlyRate?.toString() || "")
  const [capacityPeople, setCapacityPeople] = useState(initialData?.capacityPeople?.toString() || "")
  const [facilities, setFacilities] = useState<string[]>(initialData?.facilities || [])
  const [newFacility, setNewFacility] = useState("")
  const [images, setImages] = useState<string[]>(initialData?.images || [])
  const [newImage, setNewImage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const data: CreateVenuePayload | UpdateVenuePayload = {
      name,
      location,
      description,
      contactInfo,
      facilities,
      images,
    }

    if (hourlyRate) {
      data.hourlyRate = Number.parseFloat(hourlyRate)
    }

    if (capacityPeople) {
      data.capacityPeople = Number.parseInt(capacityPeople)
    }

    onSubmit(data)
  }

  const addFacility = () => {
    if (newFacility.trim() && !facilities.includes(newFacility.trim())) {
      setFacilities([...facilities, newFacility.trim()])
      setNewFacility("")
    }
  }

  const removeFacility = (facility: string) => {
    setFacilities(facilities.filter((f) => f !== facility))
  }

  const addImage = () => {
    if (newImage.trim() && !images.includes(newImage.trim())) {
      setImages([...images, newImage.trim()])
      setNewImage("")
    }
  }

  const removeImage = (image: string) => {
    setImages(images.filter((img) => img !== image))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Venue Name *</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactInfo">Contact Information</Label>
          <Input id="contactInfo" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
          <Input
            id="hourlyRate"
            type="number"
            min="0"
            step="0.01"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacityPeople">Capacity (People)</Label>
          <Input
            id="capacityPeople"
            type="number"
            min="1"
            value={capacityPeople}
            onChange={(e) => setCapacityPeople(e.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Facilities</Label>
          <div className="flex gap-2">
            <Input
              value={newFacility}
              onChange={(e) => setNewFacility(e.target.value)}
              placeholder="Add facility (e.g., WiFi, Parking)"
            />
            <Button type="button" onClick={addFacility} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {facilities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {facilities.map((facility, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {facility}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => removeFacility(facility)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Images</Label>
          <div className="flex gap-2">
            <Input value={newImage} onChange={(e) => setNewImage(e.target.value)} placeholder="Add image URL" />
            <Button type="button" onClick={addImage} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {images.length > 0 && (
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 mt-2">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Venue image ${index + 1}`}
                    className="aspect-video object-cover rounded-md w-full"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=300"
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(image)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Venue" : "Create Venue"}
        </Button>
      </div>
    </form>
  )
}

