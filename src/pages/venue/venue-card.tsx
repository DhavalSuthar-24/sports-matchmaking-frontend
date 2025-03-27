import type { Venue } from "@/redux/features/venue/venueTypes"
import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, DollarSign, Users } from "lucide-react"

interface VenueCardProps {
  venue: Venue
}

export default function VenueCard({ venue }: VenueCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full bg-muted">
        {venue.images && venue.images.length > 0 ? (
          <img src={venue.images[0] || "/placeholder.svg"} alt={venue.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1">{venue.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          <span className="line-clamp-1">{venue.location}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        {venue.facilities && venue.facilities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {venue.facilities.slice(0, 3).map((facility, index) => (
              <Badge key={index} variant="secondary">
                {facility}
              </Badge>
            ))}
            {venue.facilities.length > 3 && <Badge variant="secondary">+{venue.facilities.length - 3} more</Badge>}
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {venue.hourlyRate && (
            <div className="flex items-center">
              <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
              <span>${venue.hourlyRate}/hour</span>
            </div>
          )}
          {venue.capacityPeople && (
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4 text-muted-foreground" />
              <span>Capacity: {venue.capacityPeople}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/venues/${venue.id}`} className="w-full">
          <Button variant="default" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

