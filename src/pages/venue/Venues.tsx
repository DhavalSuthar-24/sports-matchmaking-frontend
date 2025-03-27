"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchVenues } from "@/redux/features/venue/venueThunks"
import type { RootState } from "@/redux/store"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import VenueCard from "./venue-card"

export default function VenueList() {
  const dispatch = useDispatch()
  const { venues, status, error } = useSelector((state: RootState) => state.venues)
  const [location, setLocation] = useState("")
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    dispatch(fetchVenues({}) as any)
    // dispatch(fetchVenues({ location, available }) as any)
  }, [dispatch, location, available])

  const handleSearch = () => {
    dispatch(fetchVenues({ location, available }) as any)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Venues</h1>
        <Link to="/venues/create">
          <Button>Create Venue</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Venues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available"
                  checked={available}
                  onCheckedChange={(checked) => setAvailable(checked as boolean)}
                />
                <Label htmlFor="available">Show available only</Label>
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {status === "loading" && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {status === "failed" && (
        <div className="py-12 text-center">
          <p className="text-destructive">Error: {error?.message  || "miow"}</p>
        </div>
      )}

      {status === "succeeded" && venues.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No venues found. Try adjusting your search criteria.</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  )
}

