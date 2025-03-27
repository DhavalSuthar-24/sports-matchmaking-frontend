"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { toast } from "react-hot-toast"
import { acceptTeamInvitation, declineTeamInvitation } from "@/redux/features/user/userThunks"
import type { TeamInvitation } from "@/redux/features/user/userTypes"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, Users } from "lucide-react"

interface InvitationCardProps {
  invitation: TeamInvitation
}

export function InvitationCard({ invitation }: InvitationCardProps) {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const handleAccept = async () => {
    setIsLoading(true)
    try {
      await dispatch(acceptTeamInvitation(invitation.id) as any).unwrap()
      toast.success("Invitation accepted successfully!")
    } catch (error) {
      toast.error("Failed to accept invitation")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecline = async () => {
    setIsLoading(true)
    try {
      await dispatch(declineTeamInvitation(invitation.id) as any).unwrap()
      toast.success("Invitation declined")
    } catch (error) {
      toast.error("Failed to decline invitation")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{invitation.team.name}</CardTitle>
        {/* <CardDescription>Invited by {invitation.inviter.name}</CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            {/* <span>{invitation.team.membersCount || "Unknown"} members</span> */}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
            {/* <span>Invited {new Date(invitation.createdAt).toLocaleDateString()}</span> */}
          </div>
          {invitation.role && (
            <Badge variant="outline" className="mt-2">
              Role: {invitation.role}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button className="flex-1" onClick={handleAccept} disabled={isLoading}>
          Accept
        </Button>
        <Button variant="outline" className="flex-1" onClick={handleDecline} disabled={isLoading}>
          Decline
        </Button>
      </CardFooter>
    </Card>
  )
}

